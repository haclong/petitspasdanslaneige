---
title: "Sudoku Solver - Développer l'objet Case"
permalink: "fr/posts/sudoku-solver-developper-lobjet-case.html"
date: "2014-05-01T21:58"
slug: sudoku-solver-developper-lobjet-case
layout: post
drupal_uuid: b59afe27-d262-418d-98c9-6fae084a1f38
drupal_nid: 61
lang: fr
author: haclong

book:
  book: aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku
  rank: 8,
  top: 
    url: /fr/books/aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku.html
    title: Aborder la programmation orientée objet par l'exemple. Concevoir un solveur de sudoku
  next: 
    url: /fr/posts/le-solveur-de-sudoku-mettre-en-place-la-grille.html
    title: Le solveur de Sudoku - Mettre en place la grille
  previous:
    url: /fr/posts/solveur-de-sudoku-les-tests-unitaires-pour-lobjet-chiffre.html
    title: Solveur de Sudoku - Les tests unitaires pour l'objet Chiffre

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "POO"
  - "phpunit"

sites:
  - "Développement"

summary: "L'objet CaseSudoku a pour propriétés les coordonnées de la case : colonne, ligne et région et toutes les valeurs possibles et/ou définitive de la case avec un objet Chiffre."
---

Notre objet **Chiffre** est écrit et pratiquement complet. Nous allons passer à l'objet **Case** qui est beaucoup plus simple à appréhender. "Case" est un mot clé, notre objet s'appellera "CaseSudoku".

L'objet **CaseSudoku** a pour propriétés les coordonnées de la case : colonne, ligne et région et toutes les valeurs possibles et/ou définitive de la case avec un objet **Chiffre**.

Dans le cadre d'une grille de sudoku de niveau difficile, on résoud la grille avec une approche empirique, avec des hypothèses. Lorsqu'on émet une hypothèse, on considère qu'il y a sur chaque case de la grille un second numéro qui applique les raisonnements qui sont issus de l'hypothèse émise. Si l'hypothèse se révèle fausse, alors le second numéro est réputé comme nul. Si l'hypothèse s'avère vraie, alors le second numéro est validé et rejoint la grille initiale. Il faudra donc prévoir un second **Chiffre** pour pouvoir conserver l'état de la grille qui aurait été "validée".

```php
// module/Application/src/Application/Model/CaseSudoku.php

<?php
namespace Application\Model ;

class CaseSudoku
{
  /**
   * Numéro de colonne
   *
   * @var int
   */
  protected $colonne ;

  /**
   * Numéro de ligne
   *
   * @var int
   */
  protected $ligne ;

  /**
   * Numero de région
   *
   * @var int
   */
  protected $region ;

  /**
   * Objet Chiffre qui est manipulé
   *
   * @var Chiffre
   */
  public $chiffre ;

  /**
   * Objet Chiffre validé
   *
   * @var Chiffre
   */
  protected $sauvegarde ;
}
```

La propriété `$chiffre` retourne une instance de l'objet **Chiffre** qu'on a développé. Grâce à la propriété `$chiffre`, on peut accéder à toutes les méthodes publiques de notre objet **Chiffre**. On peut ainsi accéder à ce type de manipulation :

- `$this->chiffre->validerChiffre($chiffre) ;`
- `$this->chiffre->eliminerChiffre($chiffre) ;`
- `$this->chiffre->retablirTout() ;`
- `$this->chiffre->estValide() ;`
- `$this->chiffre->estInconnu() ;`
- `$this->chiffre->getStatutDuNumero($numero) ;`
- `$this->chiffre->getNumero() ;`

On considère les manipulations suivantes sur l'objet **CaseSudoku** :

- Créer la case avec le chiffre et les coordonnées de la case
- Sauvegarder le chiffre avant d'émettre une hypothèse et récupérer le chiffre sauvegardé si l'hypothèse aboutit sur une impossibilité.
- Récupérer les propriétés de la case

```php
// module/Application/src/Application/Model/CaseSudoku.php

<?php
namespace Application\Model ;

class CaseSudoku
{
  /**
   * Constructeur
   *
   * @param int $region Numero de region
   * @param int $colonne Numero de colonne
   * @param int $ligne Numero de ligne
   * @param int $taille Taille de la grille de sudoku -
   * Souvenez vous, il nous faut la taille de la grille pour créer notre objet Chiffre.
   */
  public function __construct($region, $ligne, $colonne, $taille)
  {
    $this->colonne = $colonne ;
    $this->ligne = $ligne ;
    $this->region = $region ;
    $this->chiffre = new Chiffre($taille) ;
  }

  /**
   * Retourner le numéro de colonne
   *
   * @return string
   */
  public function getColonne()
  {
    return $this->colonne ;
  }

  /**
   * Retourner le numéro de ligne
   *
   * @return string
   */
  public function getLigne()
  {
    return $this->ligne ;
  }

  /**
   * Retourner le numéro de région
   *
   * @return string
   */
  public function getRegion()
  {
    return $this->region ;
  }
}
```

Mettons maintenant en place les méthodes pour sauvegarder le chiffre et, si nécessaire, le restaurer.

La première idée, plus proche du mécanisme naturel, est de commencer à résoudre la grille et, si la grille s'avère difficile, créer une grille temporaire avec laquelle on avancera progressivement. Ce raisonnement est possible mais il nécessite une manipulation supplémentaire : il faut savoir quand on travaille sur la grille "sérieuse" et quand on travaille sur la grille "temporaire". On commencerait sur la grille "sérieuse" et en cas où on serait bloqué, il faudrait basculer toute la logique (et toutes les méthodes) sur la grille temporaire le temps de débloquer la situation... Et si on débloque la situation, il faudrait reporter l'hypothèse initiale sur la grille sérieuse et continuer dans le raisonnement... Cela ajoute un niveau de complexité dont on n'a pas besoin. Au lieu de cela, on va travailler sur une grille "courante" et une grille "sauvegardée". On va s'efforcer de résoudre la grille sur la grille "courante". Dans le cas où on serait bloqué, alors on fait une sauvegarde de la grille juste avant d'être bloqué et on continue de travailler sur la grille "courante". Si on finit dans une impossibilité, alors on récupère la grille sauvegardée et on réémet une nouvelle hypothèse. Dans ce cas, la grille "sauvegardée" n'est jamais manipulée excepté le fait de la créer au moment où on fait la sauvegarde et le moment où on restaure le dernier point de sauvegarde.

```php
// module/Application/src/Application/Model/CaseSudoku.php

<?php
namespace Application\Model ;

class CaseSudoku
{
  /**
   * Sauvegarder la propriété chiffre (qui représente l'avancée de la résolution de la grille)
   *
   * @return Chiffre
   */
  public function sauvegarderChiffre()
  {
    $this->sauvegarde = clone $this->chiffre ;
  }

  /**
   * Restaurer à partir de la sauvegarde
   *
   * @return Chiffre
   */
  public function restaurerChiffre()
  {
    $this->chiffre = clone $this->sauvegarde ;
  }
}
```

Voir l'instruction `clone` qui permet de copier un objet. Si on n'écrit que

```php
$this->sauvegarde = $this->chiffre ;
```

on n'arrivera pas à faire ce qu'on souhaite faire. En effet, si on modifie une information dans `$this->chiffre`, alors `$this->sauvegarde` sera également modifié parce que `$this->sauvegarde` et `$this->chiffre` pointent vers la même information.

En revanche, avec

```php
$this->sauvegarde = clone $this->chiffre ;
```

alors si on modifie une information dans `$this->chiffre`, alors `$this->sauvegarde` restera non modifié. Ce qu'on veut faire.

Vu d'ici, l'objet **CaseSudoku** est fini. Cool. Mettons en place les tests unitaires avant d'aller plus loin.

### Les tests unitaires

```php
// module/Application/test/ApplicationTest/Model/CaseSudokuTest.php

<?php
namespace ApplicationTest\Model ;

use Application\Model\CaseSudoku ;
use PHPUnit_Framework_TestCase ;

class CaseSudokuTest extends PHPUnit_Framework_TestCase
{
  public function testCaseSudokuInitial()
  {
    $g = new CaseSudoku(1, 2, 3, 4) ;
 
    $this->assertSame($g->getColonne(), 3) ;
    $this->assertSame($g->getLigne(), 2) ;
    $this->assertSame($g->getRegion(), 1) ;
    $this->assertObjectHasAttribute('size', $g->chiffre) ;
  }
 
  public function testSauvegarderChiffre()
  {
    $g = new CaseSudoku(1, 2, 3, 4) ;
    $g->chiffre->validerChiffre(3) ;
    $this->assertSame($g->chiffre->getNumero(), 3) ;
    
    $g->sauvegarderChiffre() ;
    $g->chiffre->retablirTout() ;
    $this->assertSame($g->chiffre->getNumero(), '') ;
    
    $g->restaurerChiffre() ;
    $this->assertSame($g->chiffre->getNumero(), 3) ;
  }
}
```

Lancer les tests. Tout devrait bien se passer.

Et voila ! Notre objet **CaseSudoku** est terminé. Dans le prochain article, nous nous attaquerons à l'objet **Grille**. La **Grille** est l'objet qui sera manipulé par le contrôleur. On peut considérer que c'est notre objet "principal".
