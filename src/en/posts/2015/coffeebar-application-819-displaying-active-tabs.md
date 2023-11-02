---
title: "CoffeeBar Application 8/19 - Displaying active tabs"
permalink: "en/posts/coffeebar-application-819-displaying-active-tabs.html"
date: "2015-02-25T19:43"
slug: coffeebar-application-819-displaying-active-tabs
layout: post
drupal_uuid: ac92abd2-5a7b-4517-be4a-7c74c3556222
drupal_nid: 110
lang: en
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "MVC"
  - "programmation événementielle"
  - "events"
  - "OOP"

sites:
  - "Développement"

summary: "Our application is taking shape more and more. We have already built our main components and services. We have dumped unceremoniously the items from the cache. Now let's see if we can do better."

---

Our application is taking shape more and more. We have already built our main components and services. We have dumped unceremoniously the items from the cache. Now let's see if we can do better.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

## Opened tab list

Let's create the dedicated **action**.

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

class TabController extends AbstractActionController
{
  public function listOpenedAction()
  {
    $cache = $this->serviceLocator->get('TabCache') ;
    $openTabs = $cache->getOpenTabs() ;

    return array('result' => $openTabs) ;
  }
}
```

We get the '*openTabs*' item from the cache. Remember, it is a `**CoffeeBar\Entity\OpenTabs\TodoByTab**` object, extending `**\ArrayObject**`. All we have to do is to iterate over it and display the datas into the **view**.

```php
// module/CoffeeBar/view/coffee-bar/tab/list-opened.phtml

<h1>Opened tabs</h1>

<table>
  <tr><th>Waiter</th><th>Table number</th><th></th></tr>

  <?php
    foreach($result as $k => $v)
    {
      echo "<tr>" ;
      echo "<td>" .$v->getWaiter(). "</td>" ;
      echo "<td>" .$v->getTableNumber(). "</td>" ;
      echo "<td><a href='".$this->url('tab/status', array('id' => $v->getTableNumber()))."'>See the status</a></td>" ;
      echo "</tr>" ;
    }
  ?>
</table>
```

Now put the **route** and the **navigation** so we can access this page easily. (Adding the '*tab/status*' route too).

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'router' => array(
    'routes' => array(

      // ajouter aux autres routes
      'tab' => array(
        'child_routes' => array(

          /**
           * this URL : http://coffeebar.home/tab/opened leads to the following route
           */
          'opened' => array(
            'type' => 'Literal',
            'options' => array(
              'route' => '/opened',
              'defaults' => array(
                'controller' => 'CoffeeBarController\Tab',
                'action' => 'listOpened',
              ),
            ),
            'may_terminate' => true,
          ),

          /**
           * this URL : http://coffeebar.home/tab/status leads to the following route
           */
          'status' => array(
            'type' => 'Segment',
            'options' => array(
              'route' => '/status/[:id]',
              'defaults' => array(
                'controller' => 'CoffeeBarController\Tab',
                'action' => 'status',
              ),
            ),
          ),
        ),
      ),
    ),
  ),
) ;
```

The navigation :

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'navigation' => array(
    'default' => array(

      // add to previous pages
      array(
        'label' => 'Opened tabs',
        'route' => 'tab/opened',
      ),
    ),
  ),
) ;
```

Let's go back to the controller and add the `TabController::statusAction()` action.

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

class TabController extends AbstractActionController
{
  public function statusAction()
  {
    $openTabs = $this->serviceLocator->get('OpenTabs') ;
    $status = $openTabs->statusForTable($this->params()->fromRoute('id')) ;

    return array('result' => $status) ;
  }
}
```

### The tab status page

Inside our **OpenTabs** service, we will add a method to get the status of a tab.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Entity\OpenTabs\TabStatus;

class OpenTabs
{
  /**
   * Return the status of the tab
   * @param int $table - table number
   * @return TabStatus
   */
  public function statusForTable($table)
  {
    $this->loadTodoByTab() ;
    foreach($this->todoByTab->getArrayCopy() as $k => $v)
    {
      if($v->getTableNumber() == $table)
      {
        $status = new TabStatus() ;
        $status->setTabId($k) ;
        $status->setTableNumber($v->getTableNumber()) ;
        $status->setItemsToServe($v->getItemsToServe()) ;
        $status->setItemsInPreparation($v->getItemsInPreparation()) ;
        $status->setItemsServed($v->getItemsServed()) ;

        return $status ;
      }
    }

    return NULL ;
  }
}
```

The `OpenTabs::statusForTable($table)` methods return a `**CoffeeBar\Entity\OpenTabs\TabStatus**` object.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/OpenTabs/TabStatus.php

<?php
namespace CoffeeBar\Entity\OpenTabs ;

use ArrayObject;

class TabStatus
{
  protected $tabId; // int (guid) - unique id of the tab
  protected $tableNumber; // int - table number
  protected $itemsToServe; // ItemsArray (ArrayObject) - items to serve list
  protected $itemsInPreparation; // ItemsArray (ArrayObject) - items in preparation list
  protected $itemsServed; // ItemsArray (ArrayObject) - items served list

  // getters &amp; setters
}
```

The original tutorial use a strict application of the following rule : each method should return an object. This looks systematic. This is not shocking at all but i have to admit this is generating an awful amount of objects. But on the other side, i think we can update an object without breaking any other part of the application... One object = single responsibility.

Now we know how the object returned from the `OpenTabs::statusForTable()` is made of, we we'll be able to focus on our view.

```php
// module/CoffeeBar/view/coffee-bar/tab/status.phtml

<h1>Tab status</h1>

<h2>Table #<?php echo $result->getTableNumber(); ?></h2>

<div><a href="<?php echo $this->url('tab/order', array('id' => $result->getTableNumber())) ;?>">Order Food/Drink</a></div>

<h3>Items to serve</h3>

<?php
  if(count($result->getItemsToServe()) == 0)
  {
    echo 'Pas de commande en cours' ;
  } else {
?>
    <table>
      <tr>
        <th>Menu #</th>
        <th>Description</th>
      </tr>
<?php
      foreach($result->getItemsToServe() as $k=> $v)
      {
        echo "<tr>" ;
          echo "<td>" .$v->getMenuNumber(). "</td>" ;
          echo "<td>" .$v->getDescription() . "</td>" ;
        echo "</tr>" ;
      }
?>
    </table>
<?php
  }
?>

<h3>Food in preparation</h3>

<?php
  if(count($result->getItemsInPreparation()) == 0)
  {
    echo 'Pas de commande en cours' ;
  } else {
?>
    <table>
      <tr>
        <th>Menu #</th>
        <th>Description</th>
      </tr>
<?php 
      foreach($result->getItemsInPreparation() as $k=> $v)
      {
        echo "<tr>" ;
          echo "<td>" .$v->getMenuNumber(). "</td>" ;
          echo "<td>" .$v->getDescription() . "</td>" ;
        echo "</tr>" ;
      }
?>
    </table>
<?php
  }
?>

<h3>Items already served</h3>

<?php
  if(count($result->getItemsServed()) == 0)
  {
    echo 'Pas de commande en cours' ;
  } else {
?>
    <table>
      <tr>
        <th>Menu #</th>
        <th>Description</th>
      </tr>
<?php 
      foreach($result->getItemsServed() as $k=> $v)
      {
        echo "<tr>" ;
          echo "<td>" .$v->getMenuNumber(). "</td>" ;
          echo "<td>" .$v->getDescription() . "</td>" ;
        echo "</tr>" ;
      }
?>
    </table>
<?php
  }
?>
```

Obviously, for the moment, our lists (`$itemsToServe`, `$itemsInPreparation` et `$itemsServed`) are empty. There's nothing. No order...

So be it !! Let's get some order !!

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
