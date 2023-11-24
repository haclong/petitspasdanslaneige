---
title: "Un solveur de Sudoku - Tester le contrôleur"
permalink: "fr/posts/un-solveur-de-sudoku-tester-le-controleur.html"
date: "2014-04-15T18:37"
slug: un-solveur-de-sudoku-tester-le-controleur
layout: post
drupal_uuid: c71e79b1-4cca-4a11-b93c-cfa4ce9ad629
drupal_nid: 58
lang: fr
author: haclong

book:
  book: aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku
  rank: 5,
  top: 
    url: /fr/books/aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku.html
    title: Aborder la programmation orientée objet par l'exemple. Concevoir un solveur de sudoku
  next: 
    url: /fr/posts/solveur-de-sudoku-lobjet-chiffre.html
    title: Solveur de Sudoku - L'objet Chiffre
  previous:
    url: /fr/posts/solveur-de-sudoku-route-et-controleur.html
    title: Solveur de Sudoku - Route et Contrôleur

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "zend framework 2"
  - "phpunit"
  - "Netbeans"

sites:
  - "Développement"

summary: "Dernier petit détour avant les festivités : le test unitaire pour le contrôleur. On en n'a pas vraiment besoin pour cette application, mais j'en ai profité pour voir comment on pouvait faire ça."
---

Dernier petit détour avant les festivités : le test unitaire pour le contrôleur. On en n'a pas vraiment besoin pour cette application, mais j'en ai profité pour voir comment on pouvait faire ça.

```php
// module/Application/test/ApplicationTest/Controller/IndexControllerTest.php

<?php
namespace ApplicationTest\Controller ;

use Zend\Test\PHPUnit\Controller\AbstractHttpControllerTestCase;

class IndexControllerTest extends AbstractHttpControllerTestCase
{
  protected $traceError = true;

  // dire à Zend Test où est le fichier de configuration de l'application. Apparemment, il faut un chemin absolu. Dans la mesure où les tests unitaires doivent se faire sur l'environnement de développement (très probablement en local), cette contrainte ne devrait pas poser de problème. Encore moins avec le fait que je ne développe pas en collaboratif.
  public function setUp()
  {
    $this->setApplicationConfig(
      include '{chemin_de_votre_serveur_web}/SudokuSolver/config/application.config.php'
    ) ;
    parent::setUp() ;
  }
 
  public function testIndexActionCanBeAccessed()
  {
    // dire à Zend Test que c'est l'url qu'on envoie à l'application.
    $this->dispatch('/') ;
    // Affirmer qu'à cette adresse, la réponse HTTP sera positive (200)
    $this->assertResponseStatusCode(200) ;
    // Affirmer qu'à cette adresse, le module qui est chargé est le module "Application"
    $this->assertModuleName('Application') ;
    // Affirmer qu'à cette adresse, le contrôleur qui est chargé est le contrôleur "Application\Controller\Index" (le nom du controleur est défini dans le tableau 'invokables' du fichier config/module.config.php du module.)
    $this->assertControllerName('Application\Controller\Index') ;
    // Affirmer qu'à cette adresse, la classe du controleur est IndexController.
    $this->assertControllerClass('IndexController') ;
    // Affirmer qu'à cette adresse, la route qui est utiliser par le gestionnaire de route est la route nommée 'home'.
    $this->assertMatchedRouteName('home') ;
  }

  public function testGridSizeCanBeAccessed()
  {
    // dire à Zend Test que c'est l'url qu'on envoie à l'application. Cette fois ci, on a rajouté une valeur pour size.
    $this->dispatch('/9') ;

    // vérifier que le paramètre "size" est bien identifié par l'application et que le paramètre est égal à 9.
    $this->assertTrue($this->getApplication()->getMvcEvent()->getRouteMatch()->getParam('size') == 9) ;
    $this->assertResponseStatusCode(200) ;
 
    $this->assertModuleName('Application') ;
    $this->assertControllerName('Application\Controller\Index') ;
    $this->assertControllerClass('IndexController') ;
    $this->assertMatchedRouteName('home') ;
  }
}
```

Dans netbeans, lancer les tests : `Menu Run > Test Project (Alt + F6)`

Une fenêtre Test Results doit s'ouvrir et en principe, les tests devraient passer sans problème.
