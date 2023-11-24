---
title: "CoffeeBar Application 16/19 - Get the staff todo list"
permalink: "en/posts/coffeebar-application-1619-get-staff-todo-list.html"
date: "2015-04-28T19:53"
slug: coffeebar-application-1619-get-staff-todo-list
layout: post
drupal_uuid: c144d6d4-049c-47e4-bd2e-96fb433074f5
drupal_nid: 120
lang: en
author: haclong

book:
  book: manage-coffeebar-event-driven-programming
  rank: 16,
  top: 
    url: /en/books/manage-coffeebar-event-driven-programming.html
    title: Manage a coffeebar with event driven programming
  next: 
    url: /en/posts/coffeebar-application-1719-serving.html
    title: CoffeeBar Application 17/19 - Serving
  previous:
    url: /en/posts/coffeebar-application-1519-food-prepared-reacting-it.html
    title: CoffeeBar Application 15/19 - Food is prepared, reacting to it

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "programmation événementielle"
  - "OOP"

sites:
  - "Développement"

summary: "Food is prepared, drinks are ordered... all they are waiting for is to be served. This is the waiters job. And we do have several waiters in the cofffeebar. So we need to assign the right todo list to the right waiter. We wouldn't assign a tab to a waiter who are not in charge of that table, right ?"
---

Food is prepared, drinks are ordered... all they are waiting for is to be served. This is the waiters job. And we do have several waiters in the cofffeebar. So we need to assign the right todo list to the right waiter. We wouldn't assign a tab to a waiter who are not in charge of that table, right ?

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

## Sorting todo list by waiter

### Our (new) controller

```php
// module/CoffeeBar/src/CoffeeBar/Controller/StaffController.php

<?php
namespace CoffeeBar\Controller ;

use Zend\Mvc\Controller\AbstractActionController;

class StaffController extends AbstractActionController
{
  // get waiters list
  public function indexAction()
  {
    $waiters = $this->serviceLocator->get('CoffeeBarEntity\Waiters') ;
    return array('result' => $waiters) ;
  }

  // the todo list
  public function toDoAction()
  {
    $waiter = $this->params()->fromRoute('name');
    $openTabs = $this->serviceLocator->get('OpenTabs') ;
    $list = $openTabs->todoListForWaiter($waiter) ;
    return array('result' => $list, 'waiter' => $waiter) ;
  }
}
```
### The views

```php
// module/CoffeeBar/view/coffee-bar/staff/index.phtml

<h1>Staff</h1>

<ul>
  <?php
    foreach($result as $k => $v)
    {
      echo "<li><a href='" . $this->url('staff/todo', array('name' => $k)) . "'>" . $v . "</a>" ;
    }
  ?>
</ul>
```


```php
// module/CoffeeBar/view/coffee-bar/staff/todo.phtml
<h2>Todo List for <?php echo $waiter; ?></h2>

<?php
  foreach($result as $key => $table)
  {
?>

<h3>Table #<?php echo $key; ?></h3>

<form action='<?php echo $this->url('staff/markserved') ; ?>' method='post'>
  <input type='hidden' name='id' value='<?php echo $key; ?>'/>
  <input type='hidden' name='waiter' value='<?php echo $waiter; ?>'/>
  <table>
    <tr>
      <th>Menu #</th>
      <th>Description</th>
      <th>Served</th>
    </tr>
  
    <?php
      foreach($table as $liste)
      {
    ?>
 
    <tr>
      <td><?php echo $liste->getMenuNumber() ;?></td>
      <td><?php echo $liste->getDescription() ; ?></td>
      <td><input type='checkbox' name='served[]' value='served_<?php echo $liste->getMenuNumber() ; ?>'/></td>
    </tr>
 
    <?php
      }
    ?>
  </table>

  <a href='<?php echo $this->url('tab/status', array('id' => $key)) ; ?>'>Voir la commande</a>
  <input type='submit' name='submit' value='Mark Served'/>
</form>
}
```

We have added the checkboxes so our waiter can easily mark when drinks or food have been served. Do not forget the route we will use to process the form.

### The configuration

The route, the nav and the controller alias altogether.

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'router' => array(
    'routes' => array(
      /**
       * cette URL : http://coffeebar.home/staff mène à cette route
       */
      'staff' => array(
        'type' => 'Literal',
        'options' => array(
          'route' => '/staff',
          'defaults' => array(
            'controller' => 'CoffeeBarController\Staff',
            'action' => 'index',
          ),
        ),
        'may_terminate' => true,
        'child_routes' => array(
          /**
           * cette URL : http://coffeebar.home/staff/{$waiter} mène à cette route
           */
          'todo' => array(
            'type' => 'Segment',
            'options' => array(
              'route' => '/[:name]',
              'constraints' => array(
                'name' => '[a-zA-Z]+',
              ),
              'defaults' => array(
                'controller' => 'CoffeeBarController\Staff',
                'action' => 'toDo',
              ),
            ),
            'may_terminate' => true,
          ),
          'markserved' => array(
            'type' => 'Literal',
            'options' => array(
              'route' => '/mark',
              'defaults' => array(
                'controller' => 'CoffeeBarController\Staff',
                'action' => 'mark',
              ),
            ),
          ),
        ),
      ),
    ),
  ),
  'controllers' => array(
    'invokables' => array(
      'CoffeeBarController\Staff' => 'CoffeeBar\Controller\StaffController',
    ),
  ),
  'navigation' => array(
    'default' => array(
      array(
        'label' => 'Staff',
        'route' => 'staff',
      ),
    ),
  ),
);
```

Wait a minute.

In our `StaffController`, we have a `OpenTabs::todoListForWaiter($waiter)` method. Here it is :

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
class OpenTabs
{
  /**
   * Get the list of items to serve
   * @param string $waiter
   * @return ArrayObject
   */
  public function todoListForWaiter($waiter)
  {
    $this->loadTodoByTab() ;
    $array = array() ;
    foreach($this->todoByTab->getArrayCopy() as $k => $v)
    {
      if($v->getWaiter() == $waiter &amp;&amp; count($v->getItemsToServe()) > 0)
      {
        $array[$v->getTableNumber()] = $v->getItemsToServe() ;
      }
    }
    return $array ;
  }
}
```

Have you noticed ? Our **OpenTabs** service is so good, we already have all the datas we need... Just write down some methods to organize and return the datas we want. This is one of the fondamental of the Object Oriented Programming : you don't need to extract all datas in a shapeless glob and manipulate the blug without knowing how it would shape... Just clean it and shape it right as you need it and use it as is.

## Processing the form, the markAction action

Let's get back to our `StaffController::markAction()`.

```php
// module/CoffeeBar/src/CoffeeBar/Controller/StaffController.php

<?php
namespace CoffeeBar\Controller ;

use Zend\Mvc\Controller\AbstractActionController;

class StaffController extends AbstractActionController
{
  public function markAction()
  {
    $request = $this->getRequest() ; 
    if($request->isPost()) 
    {
      $id = $request->getPost()->get('id') ;
      $waiter = $request->getPost()->get('waiter') ;
 
      if(!is_array($request->getPost()->get('served'))) 
      {
        $this->flashMessenger()->addErrorMessage('Aucun plat ou boisson n\'a été choisi pour servir');
        return $this->redirect()->toRoute('staff/todo', array('name' => $waiter));
      }
 
      $menuNumbers = array() ;
      foreach($request->getPost()->get('served') as $item)
      {
        $groups = explode('_', $item) ;
        $menuNumbers[] = $groups[1] ;
      }
      $this->markDrinksServed($id, $menuNumbers) ;
      $this->markFoodServed($id, $menuNumbers) ;

      return $this->redirect()->toRoute('staff/todo', array('name' => $waiter));
    }
  }

  // $menuNumbers = array - numéro de menus
  // $id = numéro de la table
  protected function markDrinksServed($id, array $menuNumbers)
  {
    // pour retrouver l'id unique de la note
    $openTabs = $this->serviceLocator->get('OpenTabs') ;
    $tabId = $openTabs->tabIdForTable($id) ;

    // we need to retrieve the menu items informations here
    $menu = $this->serviceLocator->get('CoffeeBarEntity\MenuItems') ;
 
    $drinks = array() ;
    foreach($menuNumbers as $nb)
    {
      if($menu->getById($nb)->getIsDrink())
      {
        $drinks[] = $nb ;
      }
    }
 
    if(!empty($drinks))
    {
      // récupérer l'objet 'CoffeeBar\Command\MarkDrinksServed'
      $markServed = $this->serviceLocator->get('MarkDrinksServedCommand') ;
      $markServed->markServed($tabId, $drinks) ;
    }
  }
 
  protected function markFoodServed($id, array $menuNumbers)
  {
    $openTabs = $this->serviceLocator->get('OpenTabs') ;
    $tabId = $openTabs->tabIdForTable($id) ;

    $menu = $this->serviceLocator->get('CoffeeBarEntity\MenuItems') ;
 
    $food = array() ;
    foreach($menuNumbers as $nb)
    {
      if(!$menu->getById($nb)->getIsDrink())
      {
        $food[] = $nb ;
      }
    }

    if(!empty($food))
    {
      $markServed = $this->serviceLocator->get('MarkFoodServedCommand') ;
      $markServed->markServed($tabId, $food) ;
    }
  }
}
```

Both `**CoffeeBar\Command\MarkDrinksServed**` command and `**CoffeeBar\Command\MarkFoodServed**` command trigger an event each. So don't forget to inject the **Event Manager** in each of them.

Let's get a quick look at our commands :

```php
// module/CoffeeBar/src/CoffeeBar/Command/MarkDrinksServed.php

<?php
namespace CoffeeBar\Command ;

use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

class MarkDrinksServed implements EventManagerAwareInterface
{
  protected $id ; // int (guid) - id unique de la note
  protected $drinks ; // array - numéro de menus
  protected $events ; // EventManager

  // getters &amp; setters y compris setEventsManager &amp; getEventsManager

  public function markServed($id, $menuNumbers)
  {
    $this->setId($id) ;
    $this->setDrinks($menuNumbers) ;
    $this->events->trigger('markDrinksServed', '', array('markDrinksServed' => $this)) ;
  }
}
```

the other one :

```php
// module/CoffeeBar/src/CoffeeBar/Command/MarkFoodServed.php

<?php
namespace CoffeeBar\Command ;

use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

class MarkFoodServed implements EventManagerAwareInterface
{
  protected $id ; // int (guid) - id unique de la note
  protected $food ; // array - liste des numéros de menus
  protected $events ; // EventManager

  public function markServed($id, $menuNumbers)
  {
    $this->setId($id) ;
    $this->setFood($menuNumbers) ;
    $this->events->trigger('markFoodServed', '', array('markFoodServed' => $this)) ;
  }
}
```

Very very quick look at the unnoticed method : `MenuItems::getById($id)` (found in the `StaffController::markAction()`)

```php
// module/CoffeeBar/src/CoffeeBar/Entity/MenuItems.php

class MenuItems
{
  public function getById($id)
  {
    $iterator = $this->getIterator() ;
    foreach($iterator as $item)
    {
      if($id == $item->getId())
      {
        return $item ;
      }
    }
  }
}
```

### Injecting the dependencies

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

use CoffeeBar\Command\MarkDrinksServed;
use CoffeeBar\Command\MarkFoodServed;

class Module
{
  // on charge le service manager
  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'MarkDrinksServedCommand' => function($sm) {
          $events = $sm->get('TabEventManager') ;
          $markDrinksServed = new MarkDrinksServed() ;
          $markDrinksServed->setEventManager($events) ;
          return $markDrinksServed ;
        },
        'MarkFoodServedCommand' => function($sm) {
          $events = $sm->get('TabEventManager') ;
          $markFoodServed = new MarkFoodServed() ;
          $markFoodServed->setEventManager($events) ;
          return $markFoodServed ;
        },
      ),
    ) ;
  }
}
```

View and structure are done. This chapter is long enough so we will process the data in the next chapter. But i bet you already know what to expect.. and don't forget : once items are served, we need to count the bill...

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
