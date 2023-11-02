---
title: "Solveur de Sudoku - La grille, suite"
permalink: "fr/posts/solveur-de-sudoku-la-grille-suite.html"
date: "2014-05-14T15:43"
slug: solveur-de-sudoku-la-grille-suite
layout: post
drupal_uuid: e3801718-c509-4600-9684-3a5607b8aaa7
drupal_nid: 63
lang: fr
author: haclong

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "zend framework 2"
  - "phpunit"
  - "POO"

sites:
  - "Développement"

summary: "Terminons le développement de l'objet Grille. Rappelons que nous savons accéder à toutes les cases de la grille, ou bien à une seule de ses cases. Nous connaissons la taille de la grille et nous pouvons mettre un chiffre dans une case ou bien écarter un chiffre possible d'une case."
---

Terminons le développement de l'objet **Grille**. Rappelons que nous savons accéder à toutes les cases de la grille, ou bien à une seule de ses cases. Nous connaissons la taille de la grille et nous pouvons mettre un chiffre dans une case ou bien écarter un chiffre possible d'une case.

Mettons en place des méthodes pour valider la grille avec les règles de sudoku en vérifiant qu'il n'y a pas deux fois le même chiffre validé sur une ligne, une colonne ou une région.

```php
// module/Application/src/Application/Model/Grille.php

<?php
namespace Application\Model ;

class Grille
{
  /**
   * Compter le nombre de fois qu'un chiffre est validé dans une ligne
   *
   * @param int $ligne numéro de ligne
   * @param int $chiffre chiffre
   *
   * @return int
   */
  public function compterChiffreDansLigne($ligne, $chiffre)
  {
    $i = 0 ;
    foreach($this->selectionnerCasesDeLigne($ligne) as $case) {
      if($case->chiffre->getStatutDuNumero($chiffre) == 1) {
        $i++ ;
      }
    }
  
    return $i ;
  }

  // Faire les méthodes équivalentes pour la colonne et la région

  /**
   * Vérifier si la grille est valide ou pas
   *
   * @return bool
   */
  public function estValide()
  {
    foreach($this->cases as $case) {
      $ligne = $case->getLigne() ;
      $colonne = $case->getColonne() ;
      $region = $case->calculerRegion($ligne, $colonne) ;
      
      for($chiffre=1 ; $chiffre<=$this->taille; $chiffre++) {
        if($this->compterChiffreDansLigne($ligne, $chiffre) > 1) {
          return false ;
        } elseif($this->compterChiffreDansColonne($colonne, $chiffre) > 1) {
          return false ;
        } elseif($this->compterChiffreDansRegion($region, $chiffre) > 1) {
          return false ;
        }
      }
    }
  
    return true ;
  }
}
```

Vérifions si la grille est résolue ou pas

```php
// module/Application/src/Application/Model/Grille.php

<?php
namespace Application\Model ;

class Grille
{
  /**
   * Vérifier si la grille est résolue ou pas
   *
   * @return bool
   */
  public function estResolue()
  {
    foreach($this->cases as $case) {
      if($case->chiffre->estInconnu()) {
        return false ;
      }
    }
 
    return true ;
  }
}
```

Il reste encore deux méthodes pour manipuler la grille : la réinitialiser et charger une grille prédéfinie. Charger une grille signifie à la fois mettre des chiffres visuellement dans les cases de notre vue, mais également valider les chiffres dans les objets **CaseSudoku** de notre objet **Grille**.

Dans la mesure où la vue a des balises `<input>` pour chacune des cases de la grille, on imagine sans problème qu'on va saisir les numéros dans la grille et qu'en cliquant sur un bouton qui validerait les entrées de la grille, on va charger ces numéros dans la propriété `$cases` de l'objet **Grille**.

Pour charger les numéros saisis :

- le contrôleur peut utiliser une méthode autant de fois qu'il y a de numéros saisis. La méthode utilisée admettrait en paramètre les coordonnées de la case et le numéro saisi.
- le contrôleur peut utiliser une méthode une seule fois. La méthode utilisée admettrait en paramètre un tableau. Ce serait le tableau en paramètre qui contiendra les coordonnées de la case et les numéros saisis.

Les deux options sont proches l'une de l'autre. La seule différence est de décider à quel niveau on veut utiliser/conserver les informations. Toutefois, il faut garder à l'esprit qu'il est préférable de déplacer la logique au niveau du modèle. Il vaut donc mieux utiliser une méthode qui serait utilisée qu'une seule fois et qui chargerait l'ensemble des numéros saisis.

```php
// module/Application/src/Application/Model/Grille.php

<?php
namespace Application\Model ;

class Grille
{
  /**
   * Réinitialiser une grille vierge
   *
   * @return array CaseSudoku
   */
  public function nouvelleGrille()
  {
    foreach($this->cases as $case) {
      $case->chiffre->retablirTout() ;
    }
 
    return $this->cases ;
  }

  /**
   * Charger une grille avec des valeurs initiales
   *
   * @return void
   */
  public function chargerGrille($cases)
  {
    foreach($cases as $ligne => $contenu_ligne) {
      foreach($contenu_ligne as $colonne => $chiffre) {
        if(!empty($chiffre)) {
          $this->validerChiffre($ligne, $colonne, $chiffre) ;
        }
      }
    }
  }
}
```

Toutes les méthodes de notre objet **Grille** sont écrites. On pourrait bien évidemment en rajouter quelques unes, notamment quelques méthodes pour filtrer les chiffres qui sont chargés dans la grille, et qui pourront vérifier qu'on ne met pas un 0 dans une case par exemple mais je vous laisse explorer ces extensions. Complétons ces méthodes avec une méthode pour préparer la grille pour la vue (transformons le tableau `$cases` à une dimension à un tableau en deux dimensions `$cases[$ligne][$colonne]`.

```php
// module/Application/src/Application/Model/Grille.php

<?php
namespace Application\Model ;

class Grille
{
  /**
   * Préparer la grille :
   * transformer le tableau à une dimension à un tableau à deux dimensions
   * assigner la valeur à la case. (utiliser getNumero() de l'objet Chiffre)
   *
   * @param int $chiffre En cas où on aurait besoin de n'afficher que les possibilités d'un seul numéro - Rien par défaut
   * @param array $cases tableau à une dimension des cases. Par défaut, la propriété $cases de l'objet.
   *
   * @return array
   */
  public function preparer($cases=null)
  {
    // if $cases == null, utiliser $this->cases
    if($cases == null) {
      $cases = $this->cases ;
    }

    // transformer le tableau à clé unique en un tableau à deux dimensions et afficher un numéro si défini.
    foreach($cases as $c) {
      $ligne = $c->getLigne() ; // CaseSudoku::getLigne()
      $colonne = $c->getColonne() ; // CaseSudoku::getColonne()
      $tableau[$ligne][$colonne] = $c->chiffre->getNumero() ; // Chiffre::getNumero()
    }
 
    return $tableau ;
  }
}
```

Et voila ! Avec cette méthode, on s'assure qu'on va toujours récupérer un tableau à deux dimensions pour la vue, et on consolide l'information qu'on veut voir affichée dans chacune des cases.

Voyons maintenant les tests unitaires en rééditant le fichier `GrilleTest.php` de la dernière fois.

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
  public function testNouvelleGrille()
  {
    $g = new Grille(4) ;
    // On place un chiffre dans la 4eme case de la 3eme ligne
    $g->validerChiffre(3, 4, 2) ;
    // On réinitialise la grille
    $g->nouvelleGrille() ;
 
    // On vérifie que dans la case 3, 4, il n'y a plus de chiffre validé
    $this->assertTrue($g->getCase(3, 4)->chiffre->estInconnu()) ;
    $this->assertSame($g->getCase(3, 4)->chiffre->getNumero(), '') ;
  }
 
  /**
   * Vérifions comment on charge une grille
   */
  public function testChargerGrille()
  {
    $g = new Grille(4) ;
    $a = array() ;
    $a[1][3] = 4 ;
    $a[2][2] = 3 ;
    $a[3][2] = 1 ;
 
    // Vérifier que les chiffres sont bien validés
    $this->assertSame($g->getCase(1, 3)->chiffre->getNumero(), 4) ;
    $this->assertSame($g->getCase(2, 2)->chiffre->getNumero(), 3) ;
    $this->assertSame($g->getCase(3, 2)->chiffre->getNumero(), 1) ;

    $this->assertSame($g->getCase(1, 1)->chiffre->getNumero(), '') ;
    $this->assertSame($g->getCase(4, 2)->chiffre->getNumero(), '') ;
  }

  /**
   * Vérifions la validation de la grille
   */
  public function testGrilleInvalideColonne()
  {
    $g = new Grille(4) ;
    // Mettons un 1 dans la 1ere case de la 1ere ligne
    $g->validerChiffre(1, 1, 1) ;
    // Ecartons les chiffres possibls dans la 1re case de la 3eme ligne
    $g->eliminerChiffre(3, 1, 2) ;
    $g->eliminerChiffre(3, 1, 3) ;
    $g->eliminerChiffre(3, 1, 4) ;

    // Arrivé à ce moment, l'objet Chiffre a déduit que la dernière option possible pour la case 3-1 était le chiffre 1, ce qui est impossible puisque le 1 est déjà défini dans la même colonne, à la 1ere ligne
    $this->assertFalse($g->estValide()) ;
  }

  // Tester également l'invalidité pour la ligne et la région sur le même modèle.

  /**
   * Vérifions que la grille est résolue
   */
  public function testGrilleResolue()
  {
    $g = new Grille(4) ;
    // Remplissons toutes les cases de la grille
    $g->validerChiffre(1, 1, 1) ;
    $g->validerChiffre(1, 2, 2) ;
    $g->validerChiffre(1, 3, 3) ;
    $g->validerChiffre(1, 4, 4) ;
    $g->validerChiffre(2, 1, 3) ;
    $g->validerChiffre(2, 2, 4) ;
    $g->validerChiffre(2, 3, 1) ;
    $g->validerChiffre(2, 4, 2) ;
    $g->validerChiffre(3, 1, 2) ;
    $g->validerChiffre(3, 2, 3) ;
    $g->validerChiffre(3, 3, 4) ;
    $g->validerChiffre(3, 4, 1) ;
    $g->validerChiffre(4, 1, 4) ;
    $g->validerChiffre(4, 2, 1) ;
    $g->validerChiffre(4, 3, 2) ;
    $g->validerChiffre(4, 4, 3) ;

    // La grille devrait être valide
    $this->assertTrue($g->estValide()) ;
    // La grille devrait être résolue
    $this->assertTrue($g->estResolue()) ;
  }

  /**
   * Vérifions la réciproque : la grille n'est pas résolue
   */
  public function testGrilleResolue()
  {
    $g = new Grille(4) ;
    // Remplissons quelques cases de la grille
    $g->validerChiffre(1, 1, 1) ;
    $g->validerChiffre(1, 2, 2) ;
    $g->validerChiffre(1, 3, 3) ;
    $g->validerChiffre(1, 4, 4) ;
    $g->validerChiffre(2, 1, 3) ;
    $g->validerChiffre(2, 2, 4) ;
    $g->validerChiffre(2, 3, 1) ;
    $g->validerChiffre(4, 3, 2) ;
    $g->validerChiffre(4, 4, 3) ;

    // La grille n'est pas résolue
    $this->assertFalse($g->estResolue()) ;
  }

  /**
   * Testons enfin notre dernière méthode, la préparation de la grille pour la vue
   */
  public function testPreparer()
  {
    $g = new Grille(4) ;
    // Plaçons un 2 dans la 4eme case de la 3me ligne
    $g->validerChiffre(3, 4, 2) ;
    $grille = $g->preparer() ;
 
    // Vérifions qu'il y a bien un 2 dans la 4eme case de la 3me ligne
    $this->assertSame($grille[3][4], 2) ;
  }
}
```

Super ! Nos objets **Chiffre**, **CaseSudoku** et **Grille** sont terminés. Nous avons bientôt fini notre solveur. Il reste encore quelques détails à régler et non des moindres : comment utiliser nos objets avec l'affichage d'une part, et d'autre part, on l'aura bien remarqué, on n'a pas encore réfléchi au solveur en particulier...
