---
title: "Application CoffeeBar 13/19 - La Todo list du Chef"
permalink: "fr/posts/application-coffeebar-1319-la-todo-list-du-chef.html"
date: "2015-04-07T13:00"
slug: application-coffeebar-1319-la-todo-list-du-chef
layout: post
drupal_uuid: 99fa9802-a323-44f4-84bd-a152d46f2dcd
drupal_nid: 117
lang: fr
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "programmation événementielle"
  - "OOP"
  - "MVC"
  - "Event Manager"

sites:
  - "Développement"

summary: "Dans les articles précédents, les boissons et les plats ont été commandés. Une boisson peut être servie immédiatement mais un plat doit être adressé à la cuisine pour être préparé. Le plat pourra être servi uniquement lorsqu'il sera prêt. Dans l'article d'aujourd'hui, nous allons gérer la todo list du chef et afficher la liste des plats commandés."
---

Dans les articles précédents, les boissons et les plats ont été commandés. Une boisson peut être servie immédiatement mais un plat doit être adressé à la cuisine pour être préparé. Le plat pourra être servi uniquement lorsqu'il sera prêt. Dans l'article d'aujourd'hui, nous allons gérer la todo list du chef et afficher la liste des plats commandés.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui auront disparu au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

## Todo list du chef

Nous allons monter un service consacré à la liste du chef cuisinier. Ce service va intercepter l'événement '`foodOrdered`', ajouter les plats à préparer dans une liste afin de les présenter au chef.

```php
// module/CoffeeBar/src/CoffeeBar/Service/ChefTodoList.php

<?php
namespace CoffeeBar\Service;

use ArrayObject;
use CoffeeBar\Entity\ChefTodoList\TodoListGroup;
use CoffeeBar\Entity\ChefTodoList\TodoListItem;
use Zend\EventManager\EventManagerInterface;
use Zend\EventManager\ListenerAggregateInterface;

class ChefTodoList implements ListenerAggregateInterface
{
  protected $todoList ;
  protected $cache ;
  protected $listeners ;
 
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('foodOrdered', array($this, 'onFoodOrdered')) ;
  }

  public function detach(EventManagerInterface $events)
  {
    foreach ($this->listeners as $index => $listener) 
    {
      if ($events->detach($listener)) 
      {
        unset($this->listeners[$index]);
      }
    }
  }
 
  public function setCache($cache)
  {
    $this->cache = $cache ;
  }
 
  public function getCache()
  {
    return $this->cache ;
  }

  protected function loadTodoList()
  {
    $this->todoList = $this->cache->getTodoList() ;
  }
 
  protected function saveTodoList()
  {
    $this->cache->saveTodoList(serialize($this->todoList)) ;
  }
 
  public function onFoodOrdered($events)
  {
    $foodOrdered = $events->getParam('foodOrdered') ;

    $this->loadTodoList() ;
 
    $items = new ArrayObject() ;
    foreach($foodOrdered->getItems() as $value)
    {
      $item = new TodoListItem($value->getId(), $value->getDescription()) ;
      $items->offsetSet(NULL, $item) ;
    }

    $group = new TodoListGroup($foodOrdered->getId(), $items) ;
 
    $this->todoList->offsetSet(NULL, $group) ;
    $this->saveTodoList() ;
  }

  public function getList()
  {
    $this->loadTodoList() ;
    return $this->todoList ;
  }
}
```

Nous avons pour ce service les méthodes `attach()` et `detach()` obligatoires pour l'interface `Zend\EventManager\ListenerAggregateInterface`. Nous avons également les *getter* et *setter* pour accéder au cache, injecté dans le service.

Il reste la méthode `ChefTodoList::onFoodOrdered()` qui va construire la liste de plats à préparer.

La liste est un objet `\ArrayObject` stocké dans l'index '`todoList`' du cache.

Chaque itération de la liste est un objet `CoffeeBar\Entity\ChefTodoList\TodoListGroup`. L'objet `CoffeeBar\Entity\ChefTodoList\TodoListGroup` a deux propriétés : l'*id unique de la note* d'une part, et *la liste des plats* (`\ArrayObject`) à préparer.

Voici l'objet `CoffeeBar\Entity\ChefTodoList\TodoListGroup`

```php
// module/CoffeeBar/src/CoffeeBar/Entity/ChefTodoList/TodoListGroup.php

<?php
namespace CoffeeBar\Entity\ChefTodoList;

use ArrayObject;

class TodoListGroup {
  protected $tab ; // int (guid) - id unique de la note
  protected $items ; // ArrayObject - liste de TodoListItem
 
  public function __construct($tab, ArrayObject $items)
  {
    $this->setTab($tab) ;
    $this->setItems($items) ;
  }

  // getters &amp; setters
}
```

et l'objet `CoffeeBar\Entity\ChefTodoList\TodoListItem`

```php
// module/CoffeeBar/src/CoffeeBar/Entity/ChefTodoList/TodoListItem.php

<?php
namespace CoffeeBar\Entity\ChefTodoList;

class TodoListItem {
  protected $menuNumber ; // int - numéro du menu
  protected $description ; // string - nom du menu

  public function __construct($menuNumber, $description)
  {
    $this->setMenuNumber($menuNumber) ;
    $this->setDescription($description) ;
  }

  // getters &amp; setters
}
```

Après avoir défini notre service **ChefTodoList**, allons mettre tout ça en place dans notre gestionnaire de service.

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

use CoffeeBar\Service\ChefTodoList;

class Module
{
  public function getConfig() //

  public function getAutoloaderConfig() //

  public function onBootstrap(MvcEvent $event)
  {
    // ces lignes sont déjà là
    $sm = $event->getApplication()->getServiceManager() ;
    $em = $sm->get('TabEventManager');
 
    // au gestionnaire d'événement, on attache le listener ChefTodoList
    // parce qu'on utilise EventManager::attachAggregate,
    // on injecte automatiquement l'objet 'TabEventManager' en argument de la méthode TabAggregate::attach
    // grâce à l'interface ListenerAggregateInterface
    $em->attachAggregate($sm->get('ChefTodoList')) ;
  }

  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'ChefTodoList' => function($sm) {
          $cache = $sm->get('TabCache') ;
          $todoList = new ChefTodoList() ;
          $todoList->setCache($cache) ;
          return $todoList ;
        },
      ),
    ) ;
  }
}
```

## Rendu à l'écran

### Tout d'abord, avec le contrôleur

```php
// module/CoffeeBar/src/CoffeeBar/Controller/ChefController.php

<?php
namespace CoffeeBar\Controller;

use Zend\Mvc\Controller\AbstractActionController;

class ChefController extends AbstractActionController
{
  public function indexAction()
  {
    $todoList = $this->serviceLocator->get('ChefTodoList') ;
    $list = $todoList->getList() ; // ArrayObject
    return array('result' => $list) ;
  }
}
```

### La vue

```php
// module/CoffeeBar/view/coffee-bar/chef/index.phtml

<h2>Meals to prepare</h2>

<table>
  <tr>
    <th>Menu #</th>
    <th>Description</th>
  </tr>

  <?php
    foreach($result as $group)
    {
      foreach($group->getItems() as $item)
      {
  ?>
 
        <tr>
          <td><?php echo $item->getMenuNumber() ; ?></td>
          <td><?php echo $item->getDescription() ; ?></td>
        </tr>
 
  <?php
      }
    }
  ?>
</table>
```

### Et la route

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'router' => array(
    'routes' => array(
      
      /**
       * cette URL : http://coffeebar.home/chef mène à cette route
       */ 
      'chef' => array(
        'type' => 'Literal',
        'options' => array(
          'route' => '/chef',
          'defaults' => array(
            'controller' => 'CoffeeBarController\Chef',
            'action' => 'index',
          ),
        ),
        'may_terminate' => true,
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
      // a ajouter
      array(
        'label' => 'Chef\'s todo',
        'route' => 'chef',
      ),
    ),
  ),

  // ... // others keys and arrays...
);
```

### Configuration du contrôleur

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'controllers' => array(
    'invokables' => array(
      // à ajouter
      'CoffeeBarController\Chef' => 'CoffeeBar\Controller\ChefController',
    ),
  ),
) ;
```

A cette adresse `http://coffeebar.home/chef`, vous pourrez voir la liste des plats à préparer. Mais on ne peut s'arrêter là pour le chef. Il faut maintenant qu'il marque les plats préparés à partir de cette liste.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
