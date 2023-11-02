---
title: "CoffeeBar Application 12/19 - Processing the order"
permalink: "en/posts/coffeebar-application-1219-processing-order.html"
date: "2015-03-26T20:06"
slug: coffeebar-application-1219-processing-order
layout: post
drupal_uuid: cec8d17c-8540-48bd-94d5-b1501d4f4894
drupal_nid: 114
lang: en
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "MVC"
  - "OOP"
  - "programmation événementielle"

sites:
  - "Développement"

summary: "When we place an order, two events are triggered. One event advising the drinks have been ordered and the second event advising the food has been ordered. Based on the initial workflow, the food and drinks do not follow the same process. Let's see how to differentiate each process."
---

When we place an order, two events are triggered. One event advising the drinks have been ordered and the second event advising the food has been ordered. Based on the initial workflow, the food and drinks do not follow the same process. Let's see how to differentiate each process.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

Here is our workflow :

When the drinks are ordered ('*drinksOrdered*'), the waiter can **serve** them straight away.

On the other hand, when food is ordered ('*foodOrdered*'), the cook has to **prepare** them before the waiter can **serve** them.

## Drinks are ordered

Let's see how it works for ordered drinks.

### The Tab Story

The tab story is managed by the **TabAggregate** service.

When drinks are ordered, we will add those ordered items in a `TabStory::$outstandingDrinks` property, listing drinks *ordered but not served yet*.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php

class TabStory
{
  /**
   * list of ordered drinks not served yet
   * @var CoffeeBar\Entity\TabStory\OrderedItems
   */
  protected $outstandingDrinks ;

  public function __construct()
  {
    $this->outstandingDrinks = new OrderedItems() ;
  }

  // les autres méthodes

  public function addOutstandingDrinks($drinks)
  {
    foreach($drinks as $drink)
    {
      // add $drink in an OrderedItems() extending ArrayObject
      // offsetSet() is a method of ArrayObject
      $this->outstandingDrinks->offsetSet(NULL, $drink) ;
    }
  }

  public function getOutstandingDrinks() {
    return $this->outstandingDrinks;
  }
}
```

When the '*drinksOrdered*' event is triggered, the **TabAggregate** service will listen to that event and update the tab story with these datas.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
class TabAggregate
{
  ...
 
  public function attach(EventManagerInterface $events)
  {
    // listen to 'drinksOrdered' event
    $this->listeners[] = $events->attach('drinksOrdered', array($this, 'onDrinksOrdered')) ;
  }

  public function onDrinksOrdered($events)
  {
    $drinksOrdered = $events->getParam('drinksOrdered') ;
 
    $story = $this->loadStory($drinksOrdered->getId()) ;
    // add ordered drinks to $outstandingDrinks property
    $story->addOutstandingDrinks($drinksOrdered->getItems()) ;
    $this->saveStory($drinksOrdered->getId(), $story) ;
  }
}
```

### The open tabs list

On another part, when drinks are ordered, they are listed within the open tabs list, in the `Tab::$itemsToServe` property.

For each ordered drink, we will add the drink informations to a **`CoffeeBar\Entity\OpenTabs\TabItem`** object.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/OpenTabs/TabItem.php

<?php
namespace CoffeeBar\Entity\OpenTabs ;

class TabItem
{
  protected $menuNumber; // int - menu number
  protected $description; // string - description
  protected $price; // float - price
 
  public function __construct($menuNumber, $description, $price)
  {
    $this->setMenuNumber($menuNumber) ;
    $this->setDescription($description) ;
    $this->setPrice($price) ;
  }

  // getters &amp; setters
}
```

Please notice that we do not need to know if the ordered item is a drink or food anymore. We do not need to keep the '`$isDrink`' property. Once we're here, we know what to do with drinks and/or food...

When the '*drinksOrdered*' event is triggered, the **OpenTabs** service will listen to the event and update the right `**CoffeeBar\Entity\OpenTabs\Tab**` object.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Entity\OpenTabs\TabItem;

class OpenTabs implements ListenerAggregateInterface
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('drinksOrdered', array($this, 'onDrinksOrdered')) ;
  }

  /**
   * Listener add drinks ordered tab content
   * @param Events $events
   */
  public function onDrinksOrdered($events)
  {
    $drinksOrdered = $events->getParam('drinksOrdered') ;

    // get the TodoByTab list (extending ArrayObject)
    $this->loadTodoByTab() ;
    // within the TodoByTab, get the Tab by its unique id
    $tab = $this->todoByTab->offsetGet($drinksOrdered->getId()) ;
 
    foreach($drinksOrdered->getItems() as $drink)
    {  
      // instanciate new TabItem for each ordered drink
      $item = new TabItem($drink->getId(), $drink->getDescription(), $drink->getPrice()) ;

      // add this TabItem to the ItemsToServe (ItemsArray) property
      $tab->getItemsToServe()->addItem($item) ; // CoffeeBar\Entity\OpenTabs\ItemsArray::addItem()
    }

    // update the Tab within the TodoByTab list
    $this->todoByTab->offsetSet($drinksOrdered->getId(), $tab) ;
    $this->saveTodoByTab() ;
  }
}
```

To sum up, once a drink is ordered

- it is added to the **list of drinks ordered but not served yet** (`TabStory::$outstandingDrinks`)
- it is also added to the** list of items to serve** (`Tab::$itemsToServe`).

## Food is ordered

On the same logic, let's process the ordered food.

### The Tab Story

Ordered food is added to a `TabStory::$outstandingFood` property, listing all food *ordered but not prepared yet*.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php

class TabStory
{
  /**
   * list of ordered food not yet prepared
   * @var CoffeeBar\Entity\TabStory\OrderedItems
   */
  protected $outstandingFood ;

  public function __construct()
  {
    $this->outstandingFood = new OrderedItems() ;
  }

  // les autres méthodes

  public function addOutstandingFood($food)
  {
    foreach($food as $item)
    {
      // add $item (food) in an OrderedItems() extending ArrayObject
      // offsetSet() is a method of ArrayObject
      $this->outstandingFood->offsetSet(NULL, $item) ;
    }
  }
 
  public function getOutstandingFood() {
    return $this->outstandingFood;
  }
}
```

When the '*foodOrdered*' is triggered, the **TabAggregate** service listen to that event and update the tab story with these datas.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
class TabAggregate
{
  ...

  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('foodOrdered', array($this, 'onFoodOrdered')) ;
  }

  public function onFoodOrdered($events)
  {
    $foodOrdered = $events->getParam('foodOrdered') ;
 
    $story = $this->loadStory($foodOrdered->getId()) ;
    // add ordered food to $outstandingFood property
    $story->addOutstandingFood($foodOrdered->getItems()) ;
    $this->saveStory($foodOrdered->getId(), $story) ;
  }
}
```

### The open tabs list

Again, for each ordered food, we will instanciate a new `**CoffeeBar\Entity\OpenTabs\TabItem**`.

We will add those `**CoffeeBar\Entity\OpenTabs\TabItem**` into a `Tab::$itemsInPreparation` property.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Entity\OpenTabs\TabItem;

class OpenTabs implements ListenerAggregateInterface
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('foodOrdered', array($this, 'onFoodOrdered')) ;
  }

  /**
   * Listener add food ordered tab content
   * @param Events $events
   */
  public function onFoodOrdered($events)
  {
    $foodOrdered = $events->getParam('foodOrdered') ;

    // get the TodoByTab list (extending ArrayObject)
    $this->loadTodoByTab() ;
    // within the TodoByTab, get the Tab by its unique id
    $tab = $this->todoByTab->offsetGet($foodOrdered->getId()) ;
 
    foreach($foodOrdered->getItems() as $food)
    {
      // instanciate new TabItem for each ordered food
      $item = new TabItem($food->getId(), $food->getDescription(), $food->getPrice()) ;
      // add this TabItem to the ItemsInPreparation (ItemsArray) property
      $tab->getItemsInPreparation()->addItem($item) ; // CoffeeBar\Entity\OpenTabs\ItemsArray::addItem()
    }
 
    // update the Tab within the TodoByTab list
    $this->todoByTab->offsetSet($foodOrdered->getId(), $tab) ;
    $this->saveTodoByTab() ;
  }
}
```

Be careful here (*and forgive me if for any typo with copy/paste failures*) : the ordered food are added to the items in preparation list (`Tab::$itemsInPreparation`) and not to the items to serve list (`Tab::$itemsToServe`). As for the `Tab::$itemsToServe` property, the `Tab::$itemsInPreparation` property is a `**CoffeeBar\Entity\OpenTabs\ItemsArray**` object. We already know the `ItemsArray::addItem()` method.

Drinks to serve and food in preparation should now display on the tab status page. In our next chapter, we will build the chef page : see which food he has to prepared and later on, how to mark which food are prepared.

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
