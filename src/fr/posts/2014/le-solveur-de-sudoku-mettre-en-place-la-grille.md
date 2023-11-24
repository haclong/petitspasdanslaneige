---
title: "Le solveur de Sudoku - Mettre en place la grille"
permalink: "fr/posts/le-solveur-de-sudoku-mettre-en-place-la-grille.html"
date: "2014-05-08T08:19"
slug: le-solveur-de-sudoku-mettre-en-place-la-grille
layout: post
drupal_uuid: 25072a38-9d04-4864-9429-38217f94f2d5
drupal_nid: 62
lang: fr
author: haclong

book:
  book: aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku
  rank: 9,
  top: 
    url: /fr/books/aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku.html
    title: Aborder la programmation orientée objet par l'exemple. Concevoir un solveur de sudoku
  next: 
    url: /fr/posts/solveur-de-sudoku-ajouter-des-hypotheses.html
    title: Solveur de Sudoku - Ajouter des hypothèses
  previous:
    url: /fr/posts/sudoku-solver-developper-lobjet-case.html
    title: Sudoku Solver - Développer l'objet Case

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "phpunit"
  - "POO"
  - "zend framework 2"

sites:
  - "Développement"

summary: "Dans le développement d'un modèle en programmation orientée objet, vous serez nécessairement amené à créer plusieurs objets mais la plupart du temps, vous allez construire un principe de poupées russes avec des objets appelés par d'autres objets appelés par d'autres objets... Jusqu'à ce qu'on parvienne à l'objet qui sera au dessus de tout, l'objet \"de niveau supérieur\".
L'objet de niveau supérieur est l'objet qui sera véritablement \"utilisé\". Dans le cas d'une application MVC, l'objet de niveau supérieur sera utilisé par le contrôleur. Ou, dans le cas d'une application Zend Framework 2, l'objet qui sera chargé dans le Service Manager."
---

Dans le développement d'un modèle en programmation orientée objet, vous serez nécessairement amené à créer plusieurs objets mais la plupart du temps, vous allez construire un principe de poupées russes avec des objets appelés par d'autres objets appelés par d'autres objets... Jusqu'à ce qu'on parvienne à l'objet qui sera au dessus de tout, l'objet "de niveau supérieur".

L'objet de niveau supérieur est l'objet qui sera véritablement "utilisé". Dans le cas d'une application MVC, l'objet de niveau supérieur sera utilisé par le contrôleur. Ou, dans le cas d'une application Zend Framework 2, l'objet qui sera chargé dans le Service Manager.

Dans le cadre du Solveur de Sudoku, nous ne ferons pas intervenir le **Service Manager**. Nous passerons également sur la gestion des dépendances. Les objets seront ainsi utilisés par le contrôleur de manière directe.

Voyons donc notre objet **Grille**. Celui ci n'a que très peu de propriétés, mais en revanche, il a beaucoup plus de méthodes. C'est à partir de cet objet qu'on va charger une nouvelle grille, la réinitialiser et la résoudre.

### Développer l'objet Grille

Voyons donc notre objet **Grille** et les manipulations que nous prévoyons de faire dessus :

- construire la grille
- charger une nouvelle grille
- réinitialiser une nouvelle grille
- contrôler que la grille respecte les règles du sudoku
- valider que la grille est résolue

Les propriétés de la grille : souvenons nous, la grille n'a qu'une seule propriété : le tableau des cases qui composent la grille. Eventuellement, il est également utile d'ajouter la taille de la grille aussi.

```php
// module/Application/src/Application/Model/Grille.php

<?php
namespace Application\Model ;

class Grille
{
  /**
   * Taille de la grille
   *
   * @var int
   */
  protected $taille ;

  /**
   * Les cases
   *
   * @var array
   */
  protected $cases = array() ;
}
```

### Le constructeur

```php
// module/Application/src/Application/Model/Grille.php

<?php
namespace Application\Model ;

class Grille
{
  /**
   * Constructor
   *
   * @param int $taille de la grille - 9 par défaut
   * Souvenez vous de notre contrôleur. La valeur par défaut du paramètre $taille est défini dans le contrôleur.
   * Inutile à mon sens de le gérer ici.
   */
  public function __construct($taille)
  {
    $this->taille = $taille ;
    // Construire la grille soit par une méthode protégée, soit directement dans le constructeur
    // J'opte pour la méthode protégée.
    $this->construireGrille() ;
  }
}
```

La méthode `construireGrille()` va utiliser la propriété `$taille` pour construire toutes les cases de la grille. On aurait pu soit envoyer la taille de la grille comme argumennt de la méthode `construireGrille()`, soit utiliser la propriété `$taille` de l'objet **Grille**.

Au sujet de la propriété `$cases` de la grille, il y avait deux façons d'aborder le tableau :

- Le tableau est un tableau à deux dimensions. Cette option génère un tableau qui correspond au tableau qui est attendu dans la vue. Toutefois, quand il s'agira de manipuler le tableau, par exemple de manière itérative, en parcourant le tableau ligne par ligne, colonne par colonne et/ou région par région, il faudra systématiquement imbriquer une boucle colonne dans une boucle ligne.

- Le tableau est un tableau à une seule dimension. Certes le tableau généré ne convient pas pour l'affichage de la vue, mais pour les nombreuses manipulations qui précèdent l'affichage, il offrirait un avantage certain en ne nous faisant manipuler qu'une seule boucle. Il suffira d'avoir une méthode qui, se basant sur les coordonnées ligne et colonne de la case, reconstruirait le tableau en deux dimensions nécessaire à la vue.

Notons que la case de la grille admet trois coordonnées : la ligne, la colonne et la région. Si les informations ligne et colonne peuvent être déduites à partir de la boucle, il en va autrement de la région. Il va falloir calculer, en fonction de la ligne et de la colonne, dans quelle région se situe la case.

Ce calcul aurait pu se faire dans le constructeur de la case, tout aussi bien que dans l'objet grille - mon choix.

```php
// module/Application/src/Application/Model/Grille.php

<?php
namespace Application\Model ;

class Grille
{
  /**
   * Calculer le numéro de la région grâce aux informations ligne, colonne et taille de la grille
   *
   * @param int $colonne Numéro de colonne
   * @param int $ligne Numéro de ligne
   *
   * @return int Numero de région
   */
  protected function calculerRegion($ligne, $colonne)
  {
    $region = 0 ;
    $sqrt = sqrt($this->taille) ;
 
    // Identifier dans quelle partie de la grille se trouve la ligne
    $ligne_region = ceil(($ligne / $this->taille) * $sqrt) ;

    // Identifier dans quelle partie de la grille se trouve la colonne
    $colonne_region = ceil(($colonne / $this->taille) * $sqrt) ;

    // Calculer le numéro de région
    $region = (($ligne_region - 1) * $sqrt) + $colonne_region ;
   
    return (int) $region ;
  }

  /**
   * Construction de chaque case de la grille
   *
   * @return array
   */
  protected function construireGrille()
  {
    $this->cases = array() ;
    // Dans la vue, pour que les marques des régions tombent juste avec l'opérateur module (%),
    // il est important que la numérotation des lignes et des colonnes commencent par 1
    for($ligne = 1; $ligne<=$this->taille; $ligne++) { // ligne
      for($colonne = 1 ; $colonne<= $this->taille; $colonne++) { // colonne
        $region = $this->calculerRegion($ligne, $colonne) ;
        $this->cases[$ligne . '.' . $colonne] = new CaseSudoku($region, $ligne, $colonne, $this->taille) ;
      }
    }
 
    return $this->cases ;
  }
}
```

Veillons maintenant à accéder à nos propriétés. Récupérons le tableau de cases d'une part, la taille de la grille d'autre part, mais également préparons une méthode pour récupérer une case précise.

```php
// module/Application/src/Application/Model/Grille.php

<?php
namespace Application\Model ;

class Grille
{
  /**
   * Récupérer la taille de la grille
   *
   * @return int
   */
  public function getTaille()
  {
    return $this->taille ;
  }

  /**
   * Récupérer le tableau des cases
   *
   * @return array
   */
  public function getCases()
  {
    return $this->cases ;
  }

  /**
   * Récupérer une case
   *
   * @param int $ligne numéro de ligne
   * @param int $colonne numéro de colonne
   *
   * @return CaseSudoku
   */
  public function getCase($ligne, $colonne)
  {
    return $this->cases[$ligne . '.' . $colonne] ;
  }
}
```

Il faudrait également qu'on puisse valider un numéro dans une case ou bien éliminer un chiffre possible d'une case. En vertu des règles du sudoku, rappelons à toutes fins utiles qu'on ne peut valider un chiffre dans une case que si le même chiffre n'est pas déjà validé dans la ligne, la colonne ou la région. De même, si tous les chiffres possibles dans une case sont éliminés, le dernier chiffre qui restera sera validé par défaut. Cette partie est gérée par l'objet **Chiffre**.

```php
// module/Application/src/Application/Model/Grille.php

<?php
namespace Application\Model ;

class Grille
{
  /**
   * Selectionner toutes les cases qui composent une ligne
   *
   * @param int $ligne numéro de ligne
   *
   * @return array
   */
  public function selectionnerCasesDeLigne($ligne)
  {
    $cases = array() ;
    foreach($this->cases as $case) {
      if($case->getLigne() == $ligne) {
        $cases[] = $case ;
      }
    }
    return $cases ;
  }

  /**
   * Vérifier que le numéro qu'on veut valider n'est pas déjà validé dans la ligne
   *
   * @param int $ligne numéro de ligne
   * @param int $colonne numéro de colonne
   * @param int $chiffre numéro qu'on souhaite valider
   *
   * @return bool
   */
  protected function estDefiniDansLigne($ligne, $colonne, $chiffre)
  {
    foreach($this->selectionnerCasesDeLigne($ligne) as $case) {
      if($case->chiffre->getStatutDuNumero($chiffre) == 1 &amp;&amp; $case->getColonne() != $colonne) {
        return true ;
      }
    }
    return false ;
  }

  // On utilisera le même principe pour les méthodes Grille::estDefiniDansColonne() et Grille::estDefiniDansRegion()

  /**
   * Valider un numéro dans une case
   *
   * @param int $ligne numéro de ligne
   * @param int $colonne numéro de colonne
   * @param int $chiffre numéro à mettre dans la case
   */
  public function validerChiffre($ligne, $colonne, $chiffre)
  {
    if($this->estDefiniDansLigne($ligne, $colonne, $chiffre)) {
      throw new \Exception('Operation impossible') ;
    } elseif($this->estDefiniDansColonne($ligne, $colonne, $chiffre)) {
      throw new \Exception('Operation impossible') ;
    } elseif($this->estDefiniDansRegion($ligne, $colonne, $chiffre)) {
      throw new \Exception('Operation impossible') ;
    }
    $case = $this->getCase($ligne, $colonne) ;
    $case->chiffre->validerChiffre($chiffre) ;
  }

  /**
   * Eliminer un numéro dans une case
   *
   * @param int $ligne numéro de ligne
   * @param int $colonne numéro de colonne
   * @param int $chiffre chiffre possible à éliminer d'une case
   */
  public function eliminerChiffre($ligne, $colonne, $chiffre)
  {
    $case = $this->getCase($ligne, $colonne) ;
    $case->chiffre->eliminerChiffre($chiffre) ;
  }
}
```

Notre objet **Grille** n'est pas fini, loin de là. Mais préparons les tests unitaires liés aux méthodes que nous avons déjà écrite.

```php
// module/Application/test/ApplicationTest/Model/GrilleTest.php

<?php
namespace ApplicationTest\Model ;

use Application\Model\Grille ;
use PHPUnit_Framework_TestCase ;

class GrilleTest extends PHPUnit_Framework_TestCase
{
  /**
   * Testons la création de la grille
   * On doit pouvoir récupérer la valeur de la propriété $taille
   * Le nombre de cases de la grille est égal à $taille x $taille
   */
  public function testGrilleInitial()
  {
    $g = new Grille(4) ;
 
    $this->assertSame($g->getTaille(), 4) ;
    $this->assertSame(count($g->getCases()), 16) ;
  }
 
  /**
   * Vérifions que le calcul de la région est juste
   */
  public function testCalculerRegion()
  {
    $g = new Grille(4) ;
    $c = $g->getCase(3, 2) ;
 
    // Le numéro de la région a été calculée
    $this->assertSame($c->getRegion(), 3) ;
    $this->assertSame($c->getColonne(), 2) ;
    $this->assertSame($c->getLigne(), 3) ;
  }

  /**
   * Validons un chiffre dans une case de la grille
   */
  public function testValiderChiffre()
  {
    $g = new Grille(4) ;
    // Mettons un 3 dans la 2eme case de la 2me ligne
    $g->validerChiffre(2, 2, 3) ;
 
    $case = $g->getCase(2, 2) ;
    // Vérifions que la 2eme case de la 2me ligne est bien validée et que c'est le numéro 3 qui est validé.
    $this->assertTrue($case->chiffre->estValide()) ;
    $this->assertSame($case->chiffre->getNumero(), 3) ;
  }

  /**
   * Vérifions qu'il est impossible de valider un second chiffre dans la même ligne
   *
   * @expectedException Exception
   */
  public function testDefiniDansLigne()
  {
    $g = new Grille(4) ;
    // Mettons un 1 dans la 1ere case de la 1ere ligne
    $g->validerChiffre(1, 1, 1) ;
 
    // Mettons un 1 dans la 4eme case de la 1ere ligne
    // La méthode assertFalse() importe peu dans la mesure où
    // la méthode validerChiffre() va envoyer une exception et que c'est le comportement que l'on teste.
    $this->assertFalse($g->validerChiffre(1, 4, 1)) ;
  }

  // Tester également qu'il est impossible de valider un second chiffre dans la même colonne et un troisième test pour vérifier qu'il est impossible de valider un autre chiffre dans la même région.

  /**
   * Vérifions qu'on peut éliminer un chiffre
   */
  public function testDefiniDansLigne()
  {
    $g = new Grille(4) ;
    // Il ne peut pas y avoir de 3 dans la 2eme case de la 2eme ligne
    $g->eliminerChiffre(2, 2, 3) ;
 
    $case = $g->getCase(2, 2) ;
    // Vérifions que la 2eme case de la 2me ligne n'a toujours pas de chiffre validé
    $this->assertTrue($case->chiffre->estInconnu()) ;
    // Vérifier que le chiffre 3 a un statut ELIMINE (0)
    $this->assertSame($case->chiffre->getStatutDuNumero(3), 0) ;
    // Vérifier que le chiffre 1 est toujours un chiffre possible et a un statut POSSIBLE (2)
    $this->assertSame($case->chiffre->getStatutDuNumero(1), 2) ;
  }
}
```

Lancer les tests. Tout devrait bien se passer. Nous complèterons notre objet Grille dans la prochaine partie en rajoutant les méthodes pour manipuler la grille et pour la valider.
