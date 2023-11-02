---
title: "Solveur de Sudoku - Mise en place dans le contrôleur"
permalink: "fr/posts/solveur-de-sudoku-mise-en-place-dans-le-controleur.html"
date: "2014-05-20T22:36"
slug: solveur-de-sudoku-mise-en-place-dans-le-controleur
layout: post
drupal_uuid: b8d71a7f-c81e-43ef-b053-0ba00601410e
drupal_nid: 64
lang: fr
author: haclong

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "POO"
  - "zend framework 2"
  - "Zend Session"

sites:
  - "Développement"

summary: "Notre solveur avance petit à petit. Nous avons déjà mis en place nos objets principaux : les chiffres, la grille et la case. Chacun sait - jusqu'à nouvel ordre - ce qu'il a à faire. Avant de nous attaquer véritablement au moteur de résolution, occupons nous de la paire contrôleur / vue pour nous amuser un peu avec le \"rendu\"."
---

Notre solveur avance petit à petit. Nous avons déjà mis en place nos objets principaux : les chiffres, la grille et la case. Chacun sait - jusqu'à nouvel ordre - ce qu'il a à faire. Avant de nous attaquer véritablement au moteur de résolution, occupons nous de la paire contrôleur / vue pour nous amuser un peu avec le "rendu".

### Utiliser notre objet Grille dans le contrôleur

Rappelons nous, pour mettre en place notre vue et notre contrôleur, on avait construit la grille avec une double boucle dans le contrôleur. C'était bien sûr uniquement pour simuler notre grille. Maintenant que notre objet **Grille** est prêt, nous allons modifier notre contrôleur pour qu'il utilise notre objet **Grille** plutôt que la double boucle.

```php
// module/Application/src/Application/Controller/IndexController.php

<?php
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Application\Model\Grille;

class IndexController extends AbstractActionController
{
  public function indexAction()
  {
    // pour retrouver le paramètre dans l'url
    // dans la route, on a nommé le paramètre 'size'
    // si aucune paramètre n'est passé, mettre 9 par défaut
    $size = (int) $this->params()->fromRoute('size', 9) ;

    // on crée notre grille.
    // la taille est fournie par la variable $size plus haut.
    $g = new Grille($size) ;

    $view = array(
      'grille' => $g->prepare(),
    ) ;
    return $view ;
  }
}
```

Voilà. Avec ceci, nous avons exactement le même comportement que précédemment, mais cette fois ci, nous utilisons l'objet **Grille**.

### Ajouter des fonctionnalités

**Modifier la vue**

Notre vue ne comporte que la grille de sudoku et une navigation qui permet de choisir la taille de la grille. Souvenez vous, d'ailleurs, que nous savons changer d'un clic la taille de notre grille de sudoku.

Voici ce que nous voulons faire :

- obtenir une grille vierge
- remplir la grille en recopiant nous même une grille de sudoku imprimée dans notre grille de sudoku à l'écran
- une fois la grille remplie, charger la grille dans notre objet Grille
- lancer le solveur
- éventuellement, recharger la même grille remplie pour pouvoir relancer le solveur.

Voici ce que nous allons faire :

- Obtenir une grille vierge : il faut préparer un bouton "Nouvelle grille"
- Remplir la grille : c'est une étape manuelle, pas d'action du côté de notre contrôleur
- Charger la grille : il faut préparer un bouton "Charger la grille" ou "Enregistrer"
- Lancer le solveur : il faut préparer un bouton "Lancer le solveur" ou "Résoudre"
- Recharger la grille : il faut préparer un bouton "Recharger la grille" ou "Recommencer"

En poussant la réflexion plus loin, on arrive à la conclusion qu'on peut économiser un bouton, voire même deux :

- Enregistrer la grille : on peut enregistrer la grille au moment où on demande à l'application de résoudre notre grille. Les deux peuvent être fait en même temps.
- Nouvelle grille : cliquer sur la navigation réinitialise la grille de toutes façons. Une option peut nous faire garder notre bouton "Nouvelle grille" : dans le cas où, cliquer sur le menu permet de charger une grille automatiquement, auquel cas on n'aurait aucun moyen d'obtenir une grille vierge.

Nous allons rajouter des boutons : "Nouvelle grille", "Résoudre" et "Recommencer". Nous profiterons également de l'occasion pour rajouter la balise `<form>` qui fait défaut dans notre vue initiale.

```php
// module/Application/view/application/index/index.phtml

<!-- il faut penser à renvoyer le paramètre "size" dans l'url sinon, le contrôleur ne saura pas quel est la taille de l'objet Grille qui doit être créé -->
<!-- la variable $grille est envoyée par le contrôleur. c'est le tableau en deux dimensions qui est utilisé pour créer / charger la grille de sudoku -->
<form method="post" action="<?php echo $this->url('home', array('size' => count($grille))) ; ?>">
 
  <button class="btn btn-default" type="submit" name="submit" value="start">Résoudre</button>
  <button class="btn btn-default" type="submit" name="submit" value="reset">Recommencer</button>
  <button class="btn btn-default" type="submit" name="submit" value="new">Nouvelle grille</button>

  <p>
    <div>Insérer les chiffres de départ de la grille.</div>
    <div>Cliquer sur 'Résoudre' pour que le robot remplisse la grille seul.</div>
    <div>Cliquer sur 'Recommencer' pour recommencer la grille.</div>
    <div>Cliquer sur 'Nouvelle grille' pour vider la grille complètement.</div>
  </p>

  <!-- ajouter un espace pour afficher d'éventuels messages. -->
  <!-- décorer cet espace avec les styles de bootstrap -->
  <div>
    <?php
      print($msg) ;
    ?>
  </div>

  <table class="sudoku_grid">
    <!-- le code de notre table de sudoku -->
  </table>
</form> <!-- ne pas oublier de fermer la balise form -->
```

Pour pouvoir recharger la grille, il va falloir trouver un moyen pour conserver la grille qui a été chargée. Plusieurs solutions sont possibles. On peut envisager de mettre la grille dans une base de données, dans un fichier plat ou en session.

On utilisera le composant **Session** de la librairie Zend Framework pour créer notre session.

**Modifier le contrôleur**

Appliquons les modifications au controleur.

```php
// module/Application/src/Application/Controller/IndexController.php

<?php
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Application\Model\Grille;
use Zend\Session\Container ; // ajouter le composant Session

class IndexController extends AbstractActionController
{
  public function indexAction()
  {
    // instancier un objet Container pour la session
    $session = new Container('sudoku') ;

    // pour retrouver le paramètre dans l'url
    // dans la route, on a nommé le paramètre 'size'
    // si aucune paramètre n'est passé, mettre 9 par défaut
    $size = (int) $this->params()->fromRoute('size', 9) ;

    // récupérer les informations du formulaire (en méthode POST)
    $request = $this->getRequest() ; // on récupère l'objet Request qui arrive au contrôleur
    $post = $request->getPost() ; // dans l'objet Request, on récupère la propriété $post (qui est un tableau avec toutes les clés du formulaire

    // on instancie la chaîne $msg
    $msg = '' ;

    // on crée notre grille.
    // la taille est fournie par la variable $size plus haut.
    $g = new Grille($size) ;

    // en fonction du bouton qui a été cliqué dans le formulaire, nous allons avoir des comportements différents
    switch($post['submit']) {
      case 'start' :
        // créer une variable $grille dans la session
        $session->grille = $post->k ;
        $g->chargerGrille($session->grille) ;
        break ;
 
      case 'reset' :
        $g->chargerGrid($session->grille) ;
        break ;
 
      case 'new' :
      default :
        // on vide la session
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

Manipuler un peu votre contrôleur. Afficher une grille. Remplissez la avec quelques numéros. Cliquer sur *Résoudre*. Rajoutez quelques chiffres. Cliquer sur *Recommencer*. La grille revient à son état initial (au moment où vous avez cliqué sur *Résoudre*). Cliquer sur *Nouvelle grille*. La grille se vide.

Rendez vous dans le prochain post pour construire notre solveur.
