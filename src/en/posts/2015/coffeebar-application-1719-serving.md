---
title: "CoffeeBar Application 17/19 - Serving"
permalink: "en/posts/coffeebar-application-1719-serving.html"
date: "2015-05-05T20:05"
slug: coffeebar-application-1719-serving
layout: post
drupal_uuid: 0a45ad24-6408-4d35-84e2-d2bc1f4e86a6
drupal_nid: 121
lang: en
author: haclong

book:
  book: manage-coffeebar-event-driven-programming
  rank: 17,
  top: 
    url: /en/books/manage-coffeebar-event-driven-programming.html
    title: Manage a coffeebar with event driven programming
  next: 
    url: /en/posts/coffeebar-application-1819-bill-last-not-least.html
    title: CoffeeBar Application 18/19 - The bill, last but not least
  previous:
    url: /en/posts/coffeebar-application-1619-get-staff-todo-list.html
    title: CoffeeBar Application 16/19 - Get the staff todo list

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "OOP"
  - "programmation événementielle"

sites:
  - "Développement"

summary: "Now our staff can see in one look the list of drinks and food to be served, per table number. We have two different events. Let's listen to them."
---

Now our staff can see in one look the list of drinks and food to be served, per table number. We have two different events. Let's listen to them.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

## The Tab Story

### Handling commands

Commands are handled by the **TabAggregate** service. We will check the logic before firing a new event into the Event Manager.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Event\DrinksServed;
use CoffeeBar\Event\FoodServed;
use CoffeeBar\Exception\DrinksNotOutstanding;
use CoffeeBar\Exception\FoodNotPrepared;

class TabAggregate
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('markDrinksServed', array($this, 'onMarkDrinksServed')) ;
    $this->listeners[] = $events->attach('markFoodServed', array($this, 'onMarkFoodServed')) ;
  }
 
  public function onMarkDrinksServed($events)
  {
    $markDrinksServed = $events->getParam('markDrinksServed') ;
 
    $story = $this->loadStory($markDrinksServed->getId()) ;

    if(!$story->areDrinksOutstanding($markDrinksServed->getDrinks()))
    {
      throw new DrinksNotOutstanding('une ou plusieurs boissons ne font pas parties de la commande') ;
    }
 
    $drinksServed = new DrinksServed() ;
    $drinksServed->setId($markDrinksServed->getId()) ;
    $drinksServed->setDrinks($markDrinksServed->getDrinks()) ;

    $this->events->trigger('drinksServed', $this, array('drinksServed' => $drinksServed)) ;
  }

  public function onMarkFoodServed($events)
  {
    $markFoodServed = $events->getParam('markFoodServed') ;
 
    $story = $this->loadStory($markFoodServed->getId()) ;

    if(!$story->isFoodPrepared($markFoodServed->getFood()))
    {
      throw new FoodNotPrepared('les plats ne sont pas encore prêts') ;
    }
 
    $foodServed = new FoodServed() ;
    $foodServed->setId($markFoodServed->getId()) ;
    $foodServed->setFood($markFoodServed->getFood()) ;

    $this->events->trigger('foodServed', $this, array('foodServed' => $foodServed)) ;
  }
}
```

To check the status of the tab before triggering new events, we need to verify

- drinks have been ordered but not served yet and
- food has been prepared but not served yet.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class TabStory
{
  // checking if drinks have been ordered but not served yet
  public function areDrinksOutstanding(array $menuNumbers)
  {
    return $this->areAllInList($menuNumbers, $this->outstandingDrinks) ;
  }
 
  // checking food is prepared but not served yet
  public function isFoodPrepared(array $menuNumbers)
  {
    return $this->areAllInList($menuNumbers, $this->preparedFood) ;
  }
}
```

If drinks to serve have not been ordered, throw a `**CoffeeBar\Exception\DrinksNotOutstanding**` exception.

```php
// module/CoffeeBar/src/CoffeeBar/Exception/DrinksNotOutstanding.php

namespace CoffeeBar\Exception ;

use Exception;

class DrinksNotOutstanding extends Exception {}
```

If food to serve has not been prepared, throw a `**CoffeeBar\Exception\FoodNotPrepared**` exception.

```php
// module/CoffeeBar/src/CoffeeBar/Exception/FoodNotPrepared.php

namespace CoffeeBar\Exception ;

use Exception;

class FoodNotPrepared extends Exception {}
```

Now a quick look at our new events object :`** CoffeeBar\Event\DrinksServed**` and `**CoffeeBar\Event\FoodServed**`

```php
// module/CoffeeBar/src/CoffeeBar/Event/DrinksServed.php

<?php
namespace CoffeeBar\Event ;

class DrinksServed
{
  protected $id ; // int (guid) - id unique de la note
  protected $drinks ; // array - liste des numéros de menu

  // getters &amp; setters
}
```

```php
// module/CoffeeBar/src/CoffeeBar/Event/FoodServed.php

<?php
namespace CoffeeBar\Event ;

class FoodServed
{
  protected $id ; // int (guid) - id unique de la note
  protected $food ; // array - liste des numéros de menu

  // getters &amp; setters
}
```

### Listening to the events

When our commands are being handled by the **TabAggregate** service, two events have been triggered : '*drinksServed*' and '*foodServed*'.

You do remember that in a shop/store, we need to bill our clients, of course. This is sadly true. Beside, a tab cannot be closed if it is not fully paid. So, somebody definitely HAS to pay. We need to know how much, of course. The best time to count the bill is when the drinks and/or food are served. That will allow some security check : Only pay what have been served as first and as second, keep trace of the total of the table when the order is placed and checking if both amounts are equal so we would know if all ordered items are served.

When we serve a food or a drink, we add the price of the item into the total of our tab.

The **tab total** is a new property in the tab story : `TabStory::$itemsServedValue`

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class TabStory
{
  protected $itemsServedValue ; // float - total de la note
 
  public function __construct()
  {
    $this->itemsServedValue = 0 ;
  }

  public function getItemsServedValue() 
  {
    return $this->itemsServedValue;
  }

  public function addValue($value)
  {
    $this->itemsServedValue += $value ;
    return $this->itemsServedValue ;
  }
}
```

Now into the **TabAggregate** service :

- When a drink is served, remove the item from the `TabStory::$outstandingDrinks` array and add its price to the `TabStory::$itemsServedValue` property.
- When a food is served, remove the item from the `TabStory::$preparedFood` array and add its price to the `TabStory::$itemsServedValue` property.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
namespace CoffeeBar\Service ;

class TabAggregate
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('drinksServed', array($this, 'onDrinksServed')) ;
    $this->listeners[] = $events->attach('foodServed', array($this, 'onFoodServed')) ;
  }
 
  public function onDrinksServed($events)
  {
    $drinksServed = $events->getParam('drinksServed') ;
 
    $story = $this->loadStory($drinksServed->getId()) ;
    foreach($drinksServed->getDrinks() as $drink)
    {
      // get the key
      $key = $story->getOutstandingDrinks()->getKeyById($drink) ;

      if($key !== null)
      {
        // get the price
        $price = $story->getOutstandingDrinks()->offsetGet($key)->getPrice() ;
        $story->addValue($price) ;

        // remove the item from the $outstandingDrinks array
        $story->getOutstandingDrinks()->offsetUnset($key) ;
      }
    }
    $this->saveStory($drinksServed->getId(), $story) ;
  }

  public function onFoodServed($events)
  {
    $foodServed = $events->getParam('foodServed') ;

    $story = $this->loadStory($foodServed->getId()) ;
    $story->addEvents($foodServed) ;
 
    foreach($foodServed->getFood() as $food)
    {
      // get the key from the $preparedFood array
      $key = $story->getPreparedFood()->getKeyById($food) ;
 
      if($key !== null)
      {
        // get the price
        $price = $story->getPreparedFood()->offsetGet($key)->getPrice() ;
        $story->addValue($price) ;
 
        // remove the item from the $preparedFood array
        $story->getPreparedFood()->offsetUnset($key) ;
      }
    }
    $this->saveStory($foodServed->getId(), $story) ;
  }
}
```

## Open Tabs list

Now, let's update the open tabs list as well.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

class OpenTabs implements ListenerAggregateInterface
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('drinksServed', array($this, 'onDrinksServed')) ;
    $this->listeners[] = $events->attach('foodServed', array($this, 'onFoodServed')) ;
  }

  /**
   * Move the served items from the itemsToServe list to the itemsServed list
   * @param Events $events
   */
  public function onDrinksServed($events)
  {
    $drinksServed = $events->getParam('drinksServed') ;

    // load the TodoByTab from the cache
    $this->loadTodoByTab() ;
    // get the right Tab object by its id
    $tab = $this->todoByTab->offsetGet($drinksServed->getId()) ;
 
    foreach($drinksServed->getDrinks() as $drink)
    {
      // for each served drink, get its menu number
      // get the key of that menu number in the $itemsToServe array
      $key = $tab->getItemsToServe()->getKeyByMenuNumber($drink) ;
      if($key !== null)
      {
        // get the item CoffeeBar\Entity\OpenTabs\TabItem
        $value = $tab->getItemsToServe()->offsetGet($key) ;
        // add the item to the ItemsServed array (ItemsArray)
        $tab->getItemsServed()->addItem($value) ;
        // remove the item from the ItemsToServe array (ItemsArray)
        $tab->getItemsToServe()->offsetUnset($key) ;
      }
    }

    // update the index in the TodoByTab array
    $this->todoByTab->offsetSet($drinksServed->getId(), $tab) ;
    // save to the cache
    $this->saveTodoByTab() ;
  }
 
  /**
   * Move the served items from the itemsToServe list to the itemsServed list
   * @param Events $events
   */
  public function onFoodServed($events)
  {
    $foodServed = $events->getParam('foodServed') ;

    // on charge l'objet TodoByTab du cache
    $this->loadTodoByTab() ;
    // on récupère l'objet Tab identifié par l'id unique
    $tab = $this->todoByTab->offsetGet($foodServed->getId()) ;
 
    foreach($foodServed->getFood() as $food)
    {
      // pour chaque plat à servir, on ne récupère que le numéro de menu correspondant
      // il faut pouvoir identifier à quel index se situe cet élément de menu dans la liste des plats à servir
      // on pourra ainsi manipuler les objets ArrayObject à partir du moment où on sait de quel index on parle
      $key = $tab->getItemsToServe()->getKeyByMenuNumber($food) ;
      if($key !== null)
      {
        // on récupère l'objet TabItem qui se situe à cet index $key dans l'objet ItemsToServe (ArrayObject)
        $value = $tab->getItemsToServe()->offsetGet($key) ;
        // on reprend l'objet extrait de ItemsToServed (ArrayObject) et on le rajoute dans l'objet ItemsServed (ArrayObject)
        $tab->getItemsServed()->addItem($value) ;
        // on supprime l'objet qui était dans les ItemsToServe (ArrayObject) et qui n'y est plus
        $tab->getItemsToServe()->offsetUnset($key) ;
      }
    }

    // on stocke sur le même index (id unique) l'objet Tab mis à jour avec les nouveaux éléments
    $this->todoByTab->offsetSet($foodServed->getId(), $tab) ;
    $this->saveTodoByTab() ;
  }
}
```

Here again, we move items from one array to another one.

In the open tabs list, we move items from the `Tab::$itemsToServe` array to the `Tab::$itemsServed` array.

Food and Drinks are now served. In the next chapter, we will take the money and we are heading to the end of this tutorial.

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
