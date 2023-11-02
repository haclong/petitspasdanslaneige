---
title: "CoffeeBar Application 13/19 - Chef todo list"
permalink: "en/posts/coffeebar-application-1319-chef-todo-list.html"
date: "2015-04-07T19:22"
slug: coffeebar-application-1319-chef-todo-list
layout: post
drupal_uuid: 99fa9802-a323-44f4-84bd-a152d46f2dcd
drupal_nid: 117
lang: en
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

summary: "In our previous chapters, food and drinks have been ordered. Though a drink can be served immediately, food has to be prepared before being served. It is the chef job to prepare food. Today, let's see how to display the chef todo list : what food he has to prepare."
---

In our previous chapters, food and drinks have been ordered. Though a drink can be served immediately, food has to be prepared before being served. It is the chef job to prepare food. Today, let's see how to display the chef todo list : what food he has to prepare.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

## Chef todo list

We will build a brand new service, dedicated to the chef todo list. This new service will listen to the '*foodOrdered*' event and add to a list all the items to be prepared and display that list to the chef.

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
    foreach ($this->listeners as $index => $listener) {
      if ($events->detach($listener)) {
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

We do have `EventManager::attach()` and `EventManager::detach()` methods, mandatory when we use the `**Zend\EventManager\ListenerAggregateInterface**` interface.

We also have *getter*and *setter*to the cache.

And we have our callback `ChefTodoList::onFoodOrdered()` answering to the 'foodOrdered' event and building a list of items to prepare.

The list is an `**\ArrayObject**` stored in the '*todoList*' index of our cache (remember our Bootstrap)

Each item in the array is a `**CoffeeBar\Entity\ChefTodoList\TodoListGroup**`. Each `**CoffeeBar\Entity\ChefTodoList\TodoListGroup**` is meant for a tab and has two properties : the **unique id** of the tab on one hand and the **list of items to prepare** (`**\ArrayObject**`) on the other hand.

Here is the `**CoffeeBar\Entity\ChefTodoList\TodoListGroup**` object :

```php
// module/CoffeeBar/src/CoffeeBar/Entity/ChefTodoList/TodoListGroup.php

<?php
namespace CoffeeBar\Entity\ChefTodoList;

use ArrayObject;

class TodoListGroup 
{
  protected $tab ; // int (guid) - tab unique id
  protected $items ; // ArrayObject - liste de TodoListItem
 
  public function __construct($tab, ArrayObject $items)
  {
    $this->setTab($tab) ;
    $this->setItems($items) ;
  }

  // getters &amp; setters
}
```

and the `**CoffeeBar\Entity\ChefTodoList\TodoListItem**` object :

```php
// module/CoffeeBar/src/CoffeeBar/Entity/ChefTodoList/TodoListItem.php

<?php
namespace CoffeeBar\Entity\ChefTodoList;

class TodoListItem 
{
  protected $menuNumber ; // int - menu number
  protected $description ; // string - menu description

  public function __construct($menuNumber, $description)
  {
    $this->setMenuNumber($menuNumber) ;
    $this->setDescription($description) ;
  }

  // getters &amp; setters
}
```

Once we have created our **ChefTodoList** service, we will put all this in our Service Manager.

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
 
    // attach the new listener (aggregate) ChefTodoList to the event manager
    // because we are using EventManager::attachAggregate(), we injecting 
    // automatically the 'TabEventManager' into the ChefTodoList::attach()
    // thanks to the ListenerAggregateInterface
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

## Rendering

### The controller

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

### The view

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

### The route

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'router' => array(
    'routes' => array(

      /**
       * this URL : http://coffeebar.home/chef leads to the following route
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

### The navigation

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

### Add the controller to the configuration

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

Now at this URL `http://coffeebar.home/chef`, you should be able to see the list of items to prepare. Though the items are ordered in chronological order (the order when they are added into the list), notice that there's no way to know to which tab each food belongs to. On the other hand the chef does not care. All he has to do is to prepare the food as soon as it arrives in his todo list.

Next chapter : let's see how the chef can mark which food is prepared.

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
