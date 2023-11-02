---
title: "Le solveur de sudoku - Préparer le projet"
permalink: "fr/posts/le-solveur-de-sudoku-preparer-le-projet.html"
date: "2014-03-09T16:45"
slug: le-solveur-de-sudoku-preparer-le-projet
layout: post
drupal_uuid: ab089543-81c2-4b21-90de-716f19f722e7
drupal_nid: 54
lang: fr
author: haclong

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "Netbeans"
  - "POO"
  - "Zend Framework"

sites:
  - "Développement"

summary: "Aborder la programmation orientée objet par l'exemple : concevoir un solveur de sudoku.
Avant de se lancer dans un développement, fixons les objectifs et préparons le projet dans Netbeans"
---

### L'objectif

Quand vous commencez un projet de développement, vous avez nécessairement un objectif. Voici le nôtre :

- pouvoir initialiser une grille de sudoku en déclarant les numéros d'une grille existante (notre projet n'a pas l'ambition de générer une grille de sudoku au hasard)
- le moteur doit pouvoir résoudre la grille initialisée, quelque soit le niveau de la grille présentée.

### Les fonctionnalités

Avant de se lancer à corps perdu dans le développement, il nous faut des fonctionnalités. Il n'est pas faux de dire qu'aucun développement n'a d'utilité si il n'y a pas de fonctionnalités définies pour orienter le développement.

Les fonctionnalités de notre projet :

- on doit pouvoir initialiser une grille avant de lancer notre solveur
- en lançant le solveur, la grille doit être résolue
- on doit pouvoir recommencer une nouvelle grille quand on le souhaite

La résolution de la grille se fait selon les règles du sudoku que tout le monde connait :

- une grille de sudoku est composée d'autant de lignes que de colonnes que de régions.
- chaque ligne a autant de cases qu'une colonne a de cases et autant qu'une région a de cases
- chaque case comporte un chiffre
- sur chacune des lignes de la grille, aucun chiffre ne peut apparaître deux fois
- sur chacune des colonnes de la grille, aucun chiffre ne peut apparaître deux fois
- dans chacune des régions de la grille, aucun chiffre ne peut apparaître deux fois

### Initialiser le projet

Maintenant qu'on a notre objectif bien en vue et les fonctionnalités définies, on va commencer à installer notre projet

1. Récupérer le <a href="https://github.com/zendframework/ZendSkeletonApplication" target="_blank">**ZendSkelettonApplication**</a> et l'installer dans l'environnement de développement. Si vous n'avez pas encore la librairie Zend Framework 2, installez la avec <a href="http://framework.zend.com/manual/2.2/en/user-guide/skeleton-application.html" target="_blank">**Composer**</a>.
2. Renommer le répertoire `ZendSkeletonApplication-master/` en `SudokuSolver/`
3. Il faut maintenant configurer Apache et le virtual host
4. Editer le fichier de configuration d'Apache 2

```sh
 gedit /etc/apache2/sites-available/default</pre>
```

5. Ajoutez le virtual host suivant :

```sh
  Alias /SudokuSolver/ {chemin_de_votre_serveur_web}/SudokuSolver/public/
 
  <Directory {chemin_de_votre_serveur_web}/SudokuSolver/public/ >
    Options Indexes MultiViews FollowSymLinks
    AllowOverride All
    Order allow,deny
    Allow from all
  </Directory>
```

6. Redémarrez Apache

```sh
 sudo /etc/init.d/apache2 restart
```

<blockquote>

*Où est votre serveur web ?*

*Sur une installation ubuntu, votre serveur web est dans le répertoire /var/www par défaut.*

*Sur une installation WAMP, voir le distributeur de votre installation qui vous aura très certainement donné l'indication où se situait le répertoire www/*

*Si vous avez modifié la configuration de apache, votre serveur web se situe là où vous avez l'intention de mettre vos fichiers web*

*De manière générale, le serveur web = l'adresse <a href="http://localhost">http://localhost</a> sur votre navigateur.*

</blockquote>

### Installer le projet sur netbeans

1. Créer un nouveau projet PHP - *PHP Application with Existing Source*
2. Passez à l'écran suivant
3. Sources Folder : trouvez votre répertoire `SudokuSolver/`
4. Project Name : donnez lui un nom - *Sudoku Solver*
5. PHP Version : *PHP 5.3*
6. Default Encoding : *UTF-8*
7. Passez à l'écran suivant
8. Run as : *Local Web Site (running on local web server)*
9. Project URL : `http://localhost/SudokuSolver`
10. Index File : `index.php`
11. Cliquer sur Finish

### Préparez l'environnement de tests unitaires

Le tutoriel de Zend Framework explique comment créer un module. Dans le cadre de notre solveur de Sudoku, nous n'avons pas besoin d'ajouter un module dédié. Nous allons donc travailler directement dans le module **Application** initial du skeleton.

Dans Netbeans, ouvrez votre projet avec la vue **Files**.

1. Créer un répertoire `module/Application/test/`
2. Créer le répertoire `module/Application/test/ApplicationTest/`
3. Créer le fichier `module/Application/test/Bootstrap.php`

```php
<?php
namespace ApplicationTest;

use Zend\Loader\AutoloaderFactory ;
use Zend\Mvc\Service\ServiceManagerConfig ;
use Zend\ServiceManager\ServiceManager ;
use RuntimeException ;

error_reporting(E_ALL | E_STRICT) ;
chdir(__DIR__) ;

/**
* Test bootstrap, for setting up autoloading
*/
class Bootstrap
{
  protected static $serviceManager ;
 
  public static function init()
  {
    $zf2ModulePaths = array(dirname(dirname(__DIR__))) ;
    if(($path = static::findParentPath('vendor'))) {
      $zf2ModulePaths[] = $path ;
    }
    if(($path = static::findParentPath('module')) !== $zf2ModulePaths[0]) {
      $zf2ModulePaths[] = $path ;
    }
 
    static::initAutoloader() ;
 
    // use ModuleManager to load this module and it's dependencies
    $config = array(
      'module_listener_options' => array(
        'module_paths' => $zf2ModulePaths,
      ),
      'modules' => array(
        'SudokuSolver'
      )
    ) ;
 
    $serviceManager = new ServiceManager(new ServiceManagerConfig()) ;
    $serviceManager->setService('ApplicationConfig', $config) ;
    $serviceManager->get('ModuleManager')->loadModules() ;
    static::$serviceManager = $serviceManager ;
  }
 
  public static function chroot()
  {
    $rootPath = dirname(static::findParentPath('module')) ;
    chdir($rootPath) ;
  }
 
  public static function getServiceManager()
  {
    return static::$serviceManager ;
  }
 
  protected static function initAutoloader()
  {
    $vendorPath = static::findParentPath('vendor') ;
 
    $zf2Path = getenv('ZF2_PATH') ;
    if (!$zf2Path) {
      if (defined('ZF2_PATH')) {
        $zf2Path = ZF2_PATH ;
      } elseif (is_dir($vendorPath . '/ZF2/library')) {
        $zf2Path = $vendorPath . '/ZF2/library' ;
      } elseif (is_dir($vendorPath . '/zendframework/zendframework/library')) {
        $zf2Path = $vendorPath . '/zendframework/zendframework/library' ;
      }
    }
 
    if (!$zf2Path) {
      throw new RuntimeException(
        'Unable to load ZF2. Run `php composer.phar install` or'
        . ' define a ZF2_PATH environment variable.'
      ) ;
    }
 
    if (file_exists($vendorPath . '/autoload.php')) {
      include $vendorPath . '/autoload.php' ;
    }
 
    include $zf2Path . '/Zend/Loader/AutoloaderFactory.php' ;
    AutoloaderFactory::factory(array(
      'Zend\Loader\StandardAutoloader' => array(
        'autoregister_zf' => true,
        'namespaces' => array(
          __NAMESPACE__ => __DIR__ . '/' . __NAMESPACE__,
        ),
      ),
    )) ;
  }
 
  protected static function findParentPath($path)
  {
    $dir = __DIR__ ;
    $previousDir = '.' ;
    while (!is_dir($dir . '/' . $path)) {
      $dir = dirname($dir) ;
      if ($previousDir === $dir) return false ;
      $previousDir = $dir ;
    }
 
    return $dir . '/' . $path ;
  }
}

Bootstrap::init() ;
Bootstrap::chroot() ;
?>
```

ATTENTION ! On trouve différentes versions du fichier `Bootstrap.php` sur le net. Dans les grosses lignes, le principe reste le même.

4. Créer le fichier `module/Application/test/phpunit.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>

<phpunit bootstrap="Bootstrap.php" colors="true">
  <testsuites>
    <testsuite name="zf2tutorial">
    <directory>./ApplicationTest</directory>
  </testsuite> 
  </testsuites>
</phpunit>
```

5. Revenez sur la vue Projects
6. Clic droit sur le projet > Propriétés

```
- Sources > Project Folder : {chemin_de_votre_serveur_web}/SudokuSolver
- Sources > Source Folder : {chemin_de_votre_serveur_web}/SudokuSolver
- Sources > Test Folder : {chemin_de_votre_serveur_web}/SudokuSolver/module/Application/test
- Sources > Web Root : public
- Sources > Copy files from Sources Folder to another location : N
- Sources > Encoding : UTF-8
- Sources > PHP Version : PHP 5.3
- Sources > Allow short tags : N
- Sources > Allow ASP tags : N
- PHPUnit > Use Bootstrap : Y
- PHPUnit > Bootstrap : {chemin_de_votre_serveur_web}/SudokuSolver/module/Application/test/Bootstrap.php
- PHPUnit > Use Bootstrap for Creating New Unit Tests : N
- PHPUnit > Use XML Configuration : Y
- PHPUnit > XML Configuration : {chemin_de_votre_serveur_web}/SudokuSolver/module/Application/test/phpunit.xml
- PHPUnit > Use Custom Test Suite : N
- PHPUnit > Run All *Test Files Using PHPUnit : N
```

Le projet est enfin créé. Nous pouvons désormais concevoir notre solveur, ce qui reste quand même le but ultime de notre développement.
