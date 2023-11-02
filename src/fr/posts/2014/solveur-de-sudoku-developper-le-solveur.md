---
title: "Solveur de Sudoku - Développer le solveur"
permalink: "fr/posts/solveur-de-sudoku-developper-le-solveur.html"
date: "2014-05-26T22:46"
slug: solveur-de-sudoku-developper-le-solveur
layout: post
drupal_uuid: 879d4bb5-de39-40f7-913f-2187cb2dd06c
drupal_nid: 65
lang: und
author: haclong

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "zend framework 2"
  - "POO"

sites:
  - "Développement"

summary: "J'ai songé un moment mettre les méthodes du solveur dans mon objet grille (après tout, la résolution se fait à partir des éléments de la grille), mais finalement, je vais distinguer un objet Grille et un objet Solveur. L'objet Grille aurait pour responsabilité d'afficher et de manipuler la grille, et l'objet Solveur aurait pour responsabilité de gérer la résolution de la grille. Voyons donc cet objet Solveur."
---

J'ai songé un moment mettre les méthodes du solveur dans mon objet grille (après tout, la résolution se fait à partir des éléments de la grille), mais finalement, je vais distinguer un objet **Grille** et un objet **Solveur**. L'objet **Grille** aurait pour responsabilité d'afficher et de manipuler la grille, et l'objet **Solveur** aurait pour responsabilité de gérer la résolution de la grille. Voyons donc cet objet **Solveur**.

Pour ma part, pour résoudre une grille de sudoku, j'applique les déductions suivantes :

1. Comme il ne peut y avoir deux chiffres placés sur une même ligne, si un chiffre est placé sur une ligne, alors il peut être éliminé des numéros possibles dans les autres cases de la ligne. Le même raisonnement s'applique pour la colonne et pour la région.
2. Comme chaque chiffre possible doit apparaître une fois par ligne, si un chiffre, à force d'être éliminé dans les cases de la ligne, n'est possible que dans une seule case de la ligne, alors ce chiffre doit être placé dans cette case. Le même raisonnement s'applique pour la colonne et pour la région.

Commençons par construire notre objet **Solveur** et implémentons le premier niveau de déduction.

L'objet **Solveur** doit, bien entendu, travailler sur une grille. Il faudra donc prévoir de charger la grille dans le solveur.

```php
// module/Application/src/Application/Model/Solveur.php

<?php
namespace Application\Model ;

class Solveur
{
  /**
   * Donnees de la grille
   *
   * @var Grille $grille
   */
  protected $grille ;

  /**
   * Constructeur
   *
   * @param Grille $grille
   */
  public function __construct(Grille $grille)
  {
    $this->grille = $grille ;
  }
}
```

Une fois le constructeur prêt, on va préparer la méthode qui sera appelée pour lancer le solveur. Ma façon de voir les choses : pour résoudre la grille, le solveur va exécuter une boucle qui ne s'arrêtera que lorsque la grille sera résolue. Une boucle ininterrompue jusqu'à un état qu'on n'est pas sûr d'atteindre... Mmmh... Il va falloir prévoir une porte de sortie... Et pouvoir identifier quand on tombe dans une boucle infinie...

On peut dire qu'on est dans une boucle infinie quand, par exemple, on constate qu'on ne peut plus faire de déductions sur la grille. Si on ne peut plus faire de déductions sur la grille, cela signifie que la grille après les opérations de déductions est identique à la grille qu'il y avait avant.

Un peu de code pour tout ça :

```php
// module/Application/src/Application/Model/Solveur.php

<?php
namespace Application\Model ;

class Solveur
{
  /**
   * Tableau où est stockée la grille à chaque boucle
   *
   * @var array
   */
  private $tentatives = array() ;

  /**
   * Méthode pour résoudre la grille
   *
   * @return void
   */
  public function execute()
  {
    // instanciation du compteur
    $i = 0 ;

    // lance la boucle
    do {
      // stocker la grille avant de lancer les opérations de déductions
      // j'ai appris à mes dépends que je ne peux pas enregistrer $this->grille directement. j'ai résolu le problème en transformant l'objet grille en un tableau
      $this->tentatives[$i] = $this->photo($this->grille) ;

      // s'il n'y a plus rien à déduire, sortir de la boucle
      if(!$this->deduit($i)) {
        break ;
      }
 
    // la boucle s'exécute jusqu'à ce que la grille soit résolue
    } while(!$this->grille->estResolu()) ;
  }

  /**
   * Prends une photo de la grille
   *
   * @param $grille Grille
   *
   * @return array
   */
  protected function photo(Grille $grille)
  {
    // instanciation du tableau
    $photo = array() ;

    // boucle sur chaque case de la grille
    // on va exploiter la clé du tableau associatif, pour savoir de quelle case on parle et la valeur du tableau pour récupérer chacun des chiffres possibles
    foreach($grille->getCases() as $index => $case) {
      // boucle qui va parcourir chacun des chiffres possibles de la grille (déterminé par la taille de la grille)
      for($i=1; $i<=$grille->getTaille(); $i++) {
        // construction du tableau
        $photo[$index][$i] = $case->chiffre->getStatutDuNumero($i) ;
      }
    }
    // on retourne le tableau
    return $photo ;
  }

  /**
   * Détermine si on est dans une boucle infinie
   *
   * @param int $iteration
   *
   * @return bool / true si on est dans une boucle infinie
   */
  protected function boucleInfinie($iteration)
  {
    if($iteration >= 1 &amp;&amp; $this->tentatives[$iteration] == $this->tentatives[$iteration - 1]) {
      return true ;
    }
    return false ;
  }

  /**
   * Algorythme de déduction
   *
   * @param array $iteration
   *
   * @return bool / false si on est dans l'incapacité de continuer
   */
  protected function deduit($iteration)
  {
    // si on est dans une boucle infinie, cela signifie qu'on ne peut plus continuer de déduire.
    if($this->boucleInfinie($iteration)) {
      return false ;
    }

    // on applique le 1er degré de déduction : éliminer tous les chiffres possibles dans la ligne, colonne et région d'un chiffre qui a été validé.
    $this->eliminerOptions() ;

    // retourner true va nous permettre de continuer de boucler
    return true ;
  }

  /**
   * Elimination de tous les chiffres possibles dans la ligne, colonne et région d'un chiffre validé
   *
   * @return void
   */
  protected function eliminerOptions()
  {
    // on parcourt toutes les cases de la grille une à une
    foreach($this->grille->getCases() as $case) {
      // si le chiffre est validé, continuer le traitement
      if($case->chiffre->estValide()) {
        $colonne = $case->getColonne() ;
        $ligne = $case->getLigne() ;
        $region = $case->getRegion() ;
        $chiffre = $case->chiffre->getNumero() ;

        // on parcourt une seconde fois chacune des cases de la grille, cette fois ci pour écarter les possibilités dans les cases de la ligne, la colonne et la région
        foreach($this->grille->getCases() as $c) {
          // on vérifie que la case n'a pas encore de chiffre validé et que la case est dans la même ligne
          if($c->getColonne() == $colonne &amp;&amp; !$c->chiffre->estValide()) {
            $c->chiffre->eliminerChiffre($chiffre) ;
          }
          // appliquer le même principe pour la colonne et pour la région
        }
      }
    }
  }
}
```

Et voila...

Si on veut le voir en action, on doit aller rajouter notre solveur dans le contrôleur.

```php
// module/Application/src/Application/Controller/IndexController.php

<?php
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Application\Model\Grille;
use Zend\Session\Container ;
use Application\Model\Solveur ; // ajouter le solveur

class IndexController extends AbstractActionController
{
  public function indexAction()
  {
    $session = new Container('sudoku') ;

    $size = (int) $this->params()->fromRoute('size', 9) ;

    $request = $this->getRequest() ;
    $post = $request->getPost() ;

    $msg = '' ;

    $g = new Grille($size) ;

    switch($post['submit']) {
      case 'start' :
        $session->grille = $post->k ;
        $g->chargerGrille($session->grille) ;
        
        // on instancie le solveur et on lui passe l'objet grille
        $solveur = new Solveur($g) ;
        
        // on essaie de résoudre la grille
        try {
          $solveur->execute() ;
        // si la tentative pour résoudre la grille échoue et lance une exception, on récupère l'exception et on charge la propriété $msg qu'on va envoyer à la vue
        } catch(\Exception $e) {
          $msg = $e->getMessage() ;
        }

        // on change le contenu de la variable $msg si la grille est résolue
        if($g->isSolved()) {
          $msg = 'Grille résolue' ;
        }
        break ;
      
      case 'reset' :
        $g->chargerGrid($session->grille) ;
        break ;
 
      case 'new' :
      default :
        $session->grille = array() ;
        $g->nouvelleGrille() ;
      break ;
    }

    $view = array(
      'grille' => $g->prepare(),
      'msg' => $msg ;
    ) ;
    return $view ;
  }
}
```

Arrivé là, notre solveur devrait être capable de résoudre des grilles simples de sudoku.
