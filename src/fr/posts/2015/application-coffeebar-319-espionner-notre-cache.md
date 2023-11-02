---
title: "Application CoffeeBar 3/19 - Espionner notre cache"
permalink: "fr/posts/application-coffeebar-319-espionner-notre-cache.html"
date: "2015-01-14T16:10"
slug: application-coffeebar-319-espionner-notre-cache
layout: post
drupal_uuid: 17e5ec1c-512c-4db2-be9c-67e5385de0f4
drupal_nid: 105
lang: fr
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "MVC"
  - "Zend Navigation"
  - "Zend Router"

sites:
  - "Développement"

summary: "Il y a des tutoriaux qui commence par tout expliquer avant de présenter une première vue après plusieurs chapitres. C'est ce que j'ai commencé à faire avec notre application. Mais je trouve que c'est trop frustrant d'attendre avant de découvrir ce que l'application donne. Et puis, pour ma part, j'ai besoin de voir ce que je développe. Il me faut un retour écran, de toutes façons."
---

Il y a des tutoriaux qui commence par tout expliquer avant de présenter une première vue après plusieurs chapitres. C'est ce que j'ai commencé à faire avec notre application. Mais je trouve que c'est trop frustrant d'attendre avant de découvrir ce que l'application donne. Et puis, pour ma part, j'ai besoin de voir ce que je développe. Il me faut un retour écran, de toutes façons.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui auront disparu au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

## Espionner notre cache

Cela ne fait pas partie de notre application, mais ça peut être utile en cours de développement. Nous allons avoir une page pour vider le cache, et une autre pour voir ce qui est contenu dans les deux index '*openTabs*' et '*todoList*'.

### Le controleur

J'ai choisi le contrôleur `IndexController`... C'était pas très réfléchi, c'est vrai... l'application est temporaire, j'ai pas beaucoup cherché.

```php
// module/CoffeeBar/src/CoffeeBar/Controller/IndexController.php

<?php
namespace CoffeeBar\Controller ;

use Zend\Mvc\Controller\AbstractActionController;

class IndexController extends AbstractActionController
{
  public function indexAction()
  {
    // récupérer le cache
    $cache = $this->serviceLocator->get('TabCache');
    // envoyer l'intégralité du cache à la vue
    return array('result' => $cache) ;
  }
 
  public function flushAction()
  {
    // récupérer le cache
    $cache = $this->serviceLocator->get('Cache\Persistence') ;
    // le vider
    $cache->flush() ;
    // rediriger vers la page d'accueil 'home'
    return $this->redirect()->toRoute('home') ;
 }
}
```

### La vue

L'action `IndexController::flushAction()` n'a pas de vue. C'est une redirection. Il ne reste qu'une vue à préparer, pour l'action `IndexController::indexAction()`.

**Notez que le path est tout en minuscule et que le nom du module, en camelCase est transformé en mots séparés par des tirets (-). C'est une particularité de l'application Zend Framework 2... ne demandez pas...**

```php
// module/CoffeeBar/view/coffee-bar/index/index.phtml

<pre>

<?php
  var_dump($result->getTodoList()) ;

  var_dump($result->getOpenTabs()) ;
?>
</pre>
```

### La route et la navigation

Avant de définir les routes, il faut déclarer notre contrôleur dans la **configuration**.

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'controllers' => array(
    'invokables' => array(
      // the name => the component
      'CoffeeBarController\Index' => 'CoffeeBar\Controller\IndexController',
    ),
  ),
 
  // ... // autres clés...
);
```

Mise en place des **routes**

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'router' => array(
    'routes' => array(
      /**
       * on écrase la route 'home' qui est définie par défaut dans Application
       * voir le fichier /module/Application/config/module.config.php
       * cette adresse URL mène à la route http://coffeebar.home/
       */
      'home' => array(
        'type' => 'Literal',
        'options' => array(
          'route' => '/',
          'defaults' => array(
            'controller' => 'CoffeeBarController\Index',
            'action' => 'index',
          ),
        ),
        'may_terminate' => true,
      ),

      /**
       * cette URL : http://coffeebar.home/flush mène à cette route
       */
      'flush' => array(
        'type' => 'Literal',
        'options' => array(
          'route' => '/flush',
          'defaults' => array(
            'controller' => 'CoffeeBarController\Index',
            'action' => 'flush',
          ),
        ),
      ),
    ),
  ),
) ;
```

#### Une navigation

Et pour faire joli, nous allons ajouter une navigation. Cela va nous permettre de construire facilement la hiérarchie dans les différentes pages de notre site.

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'navigation' => array(
    'default' => array(
      array(
        'label' => 'Home',
        'route' => 'home',
      ),
      array(
        'label' => 'Flush cache',
        'route' => 'flush',
      ),
    ),
  ),

  // ... // others keys and arrays...
);
```

La navigation n’est pas dans le *Skeleton de base de Zend Framework*. Si vous voulez intégrer une navigation dans votre application, voir <a href="/fr/posts/zend-navigation-avec-configuration.html">mon post à ce sujet</a>. Par acquis de conscience, voici ce qu’il faut rajouter dans les différents fichiers (à vérifier…) :

```php
// module/Application/view/layout/layout.phtml
// remplacer le menu du layout d’origine par ce code

<div class="collapse nav-collapse">
  <?php echo $this->navigation('navigation')->menu()->setUlClass('nav navbar-nav')->setMaxDepth(0) ;?>
</div>
```

```php
// module/Application/config/module.config.php
// ajouter les clés suivantes :

'service_manager' => array(
  'factories' => array(
    'navigation' => 'Zend\Navigation\Service\DefaultNavigationFactory',
  ),
),
```

Une fois que nos petits espions sont mis en place, on va pouvoir s'occuper de notre première page.

## La première page : ouvrir une note

### Le contrôleur

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

use Zend\Mvc\Controller\AbstractActionController;

class TabController extends AbstractActionController
{
  public function openAction()
  {
    $result = '' ;
    return array('result' => $result) ;
  }
}
```

#### Déclarer le contrôleur dans la configuration

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'controllers' => array(
    'invokables' => array(
      // autres clés...
      'CoffeeBarController\Tab' => 'CoffeeBar\Controller\TabController',
    ),
  ),
 
  // ... // autres clés...
);
```

### La route

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'router' => array(
    'routes' => array(
      // ajouter aux autres routes
      'tab' => array(
 
        /**
         * cette route ne correspond à aucune page
         * notez l'absence d'options 'defaults' parce qu'il n'y a
         * pas de pages valides à cette adresse http://coffeebar.home/tab
         * cette adresse retourne une erreur 404
         * vous pouvez également décider de définir un contrôleur
         * et une action par défaut pour éviter l'erreur 404
         */
        'type' => 'Literal',
        'options' => array(
          'route' => '/tab',
        ),
        'child_routes' => array(
 
          /**
           * cette URL (http://coffeebar.com/tab/open) mène à cette route
           */
          'open' => array(
            'type' => 'Literal',
            'options' => array(
              'route' => '/open',
              'defaults' => array(
                'controller' => 'CoffeeBarController\Tab',
                'action' => 'open',
              ),
            ),
            'may_terminate' => true,
          ),
        ),
      ),
    ),
  ),
) ;
```

### La navigation

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'navigation' => array(
    'default' => array(
      // ajouter aux autres items de navigation
      array(
        'label' => 'Open new tab',
        'route' => 'tab/open', // utiliser les clés du tableau $router
      ),
    ),
  ),
) ;
```

### La vue

```php
// module/CoffeeBar/view/coffee-bar/tab/open.phtml

<?php echo __FILE__ ; ?>
```

Et voila.

En principe, si je n'ai rien oublié, lorsque vous irez sur ce lien : `http://coffeebar.com/tab/open`, vous accèderez à une page avec le chemin du fichier affiché à l'écran : `path/to/module/CoffeeBar/view/coffee-bar/tab/open.phtml`.

Dans le prochain article, on va monter notre page '**Ouvrir une note**'.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
