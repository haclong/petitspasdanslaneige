---
title: "Solveur de Sudoku - Les tests unitaires pour l'objet Chiffre"
permalink: "fr/posts/solveur-de-sudoku-les-tests-unitaires-pour-lobjet-chiffre.html"
date: "2014-03-09T21:22"
slug: solveur-de-sudoku-les-tests-unitaires-pour-lobjet-chiffre
layout: post
drupal_uuid: 32087044-b661-414d-a501-7970b111bca9
drupal_nid: 60
lang: fr
author: haclong

book:
  book: aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku
  rank: 7,
  top: 
    url: /fr/books/aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku.html
    title: Aborder la programmation orientée objet par l'exemple. Concevoir un solveur de sudoku
  next: 
    url: /fr/posts/sudoku-solver-developper-lobjet-case.html
    title: Sudoku Solver - Développer l'objet Case
  previous:
    url: /fr/posts/solveur-de-sudoku-lobjet-chiffre.html
    title: Solveur de Sudoku - L'objet Chiffre

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "OOP"

sites:
  - "Haclong projects"

---

### Monter la campagne de tests

Je ne suis pas encore très calée en développement piloté par les tests. Mais cela ne veut pas dire qu'on va se passer des tests unitaires. Pour ma part, j'utilise les tests unitaires pour vérifier que je n'ai pas de régression pendant l'utilisation de mes objets.

Nous allons donc monter un jeu de tests que nous n'hésiterons pas à lancer régulièrement pour vérifier que tout le monde va bien.

### Préparons le fichier de tests pour l'objet Chiffre.

```php
// module/Application/test/ApplicationTest/Model/ChiffreTest.php

<?php
namespace ApplicationTest\Model ;

use Application\Model\Chiffre ;
use PHPUnit_Framework_TestCase ;

class ChiffreTest extends PHPUnit_Framework_TestCase
{
}
```

Nous allons nous concentrer à tester chaque fonctionnalité, chaque caractéristique de notre objet **Chiffre**.

Testons le constructeur en vérifiant que quand on instancie un objet **Chiffre**, chaque possibilité existe et n'est pas écartée.

```php
public function testChiffreInitial()
{
  $f = new Chiffre(4) ;
 
  $this->assertSame($f->getStatutDuNumero(1), 2) ;
  $this->assertSame($f->getStatutDuNumero(2), 2) ;
  $this->assertSame($f->getStatutDuNumero(3), 2) ;
  $this->assertSame($f->getStatutDuNumero(4), 2) ;
}
```

Testons que lorsqu'on instancie un objet **Chiffre**, il n'y a pas plus de numéros possibles que la taille de la grille. Pour ce type de test, les méthodes doivent retourner une erreur PHP. Il faut donc prévenir PHP Unit que pour ce test, nous attendons une exception.

```php
public function testChiffreInitial()
{
  $f = new Chiffre(4) ;
 
  $this->assertSame($f->getStatutDuNumero(1), 2) ;
  $this->assertSame($f->getStatutDuNumero(2), 2) ;
  $this->assertSame($f->getStatutDuNumero(3), 2) ;
  $this->assertSame($f->getStatutDuNumero(4), 2) ;
}

/**
 * @expectedException PHPUnit_Framework_Error
 */
public function testNotExistingOffset()
{
  $f = new Chiffre(4) ;

  // Le Chiffre n'a que 4 numéros possibles.
  // Il est donc impossible qu'il existe un 5eme numéro possible.
  // Cette assertion retourne une erreur.
  $this->assertFalse($f->getStatutDuNumero(5)) ;
}
```

Testons le comportement quand on valide un numéro.

```php
public function testValiderChiffre()
{
  $f = new Chiffre(4) ;
  $f->validerChiffre(2) ;
 
  $this->assertSame($f->getNumero(), 2) ;
  $this->assertSame($f->getStatutDuNumero(3), 0) ;
  $this->assertFalse($f->estInconnu()) ;
  $this->assertTrue($f->estValide()) ;
}
```

Vérifions qu'on ne peut pas valider un numéro qui a été éliminé. Pour ce test, nous attendons une exception.

```php
/**
 * @expectedException Exception
 */
public function testEchecValiderChiffre()
{
  $f = new Chiffre(4) ;
  $f->eliminerChiffre(2) ;
  $f->validerChiffre(2) ;
}
```

Testons le comportement d'un objet Chiffre quand on réinitialise la grille alors qu'un chiffre a été validé.

```php
public function testRetablirChiffre()
{
  $f = new Chiffre(4) ;
  $f->validerChiffre(2) ;
  $f->retablirTout() ;

  // Le numéro validé est réinitialisé
  $this->assertSame($f->getNumero(), '') ;
  $this->assertSame($f->getStatutDuNumero(1), 2) ;
  $this->assertTrue($f->estInconnu()) ;
  $this->assertFalse($f->estValide()) ;
}
```

On vérifie ce qu'il se passe quand on élimine une possibilité

```php
public function testEliminerChiffre()
{
  $f = new Chiffre(4) ;
 
  $this->assertSame($f->getNumero(), '') ;
  $this->assertSame($f->getStatutDuNumero(3), 2) ;
 
  $f->eliminerChiffre(3) ;
 
  $this->assertSame($f->getNumero(), '') ;
  $this->assertSame($f->getStatutDuNumero(3), 0) ;
  $this->assertTrue($f->estInconnu()) ;
  $this->assertFalse($f->estValide()) ;
}
```

On teste qu'il est impossible d'éliminer un chiffre qui a été validé

```php
/**
 * @expectedException Exception
 */
public function testEchecEliminerChiffre()
{
  $f = new Chiffre(4) ;
  $f->validerChiffre(2) ;
  $f->eliminerChiffre(2) ;
}
```

Il reste à vérifier que lorsque tous les numéros possibles sont éliminés, le dernier numéro possible est validé.

```php
public function testEstDerniereOption()
{
  $f = new Chiffre(4) ;
 
  $this->assertSame($f->getNumero(), '') ;
  $this->assertTrue($f->estInconnu()) ;
  $this->assertFalse($f->estValide()) ;
 
  $f->eliminerChiffre(3) ;
  $f->eliminerChiffre(2) ;
  $f->eliminerChiffre(1) ;

  // La seule possibilité qui reste (4) a été validée.
  $this->assertSame($f->getNumero(), 4) ;
  $this->assertFalse($f->estInconnu()) ;
  $this->assertTrue($f->estValide()) ;
}
```

Testons enfin la méthode qui va retourner le statut de chacun des numéros

```php
public function testGetStatutDuNumero()
{
  $f = new Chiffre(4) ;
  $this->assertSame($f->getStatutDuNumero(1), 2) ; // Chiffre::POSSIBLE
  $this->assertSame($f->getStatutDuNumero(3), 2) ; // Chiffre::POSSIBLE
 
  $f->validerChiffre(3) ;
 
  $this->assertSame($f->getStatutDuNumero(1), 0) ; // Chiffre:ELIMINE
  $this->assertSame($f->getStatutDuNumero(3), 1) ; // Chiffre::VALIDE
 
  $f->retablirTout() ;
 
  $this->assertSame($f->getStatutDuNumero(2), 2) ; // Chiffre::POSSIBLE
  $this->assertSame($f->getStatutDuNumero(3), 2) ; // Chiffre::POSSIBLE
}
```

Lancer les tests dans Netbeans (`Run > Run Tests`).

Les tests devraient bien se passer. Nous avons un objet **Chiffre** quasiment complet. Passons à l'objet **Case** dans le prochain post
