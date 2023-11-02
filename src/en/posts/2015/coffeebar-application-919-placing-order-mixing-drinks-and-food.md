---
title: "CoffeeBar Application 9/19 - Placing an order, mixing drinks and food"
permalink: "en/posts/coffeebar-application-919-placing-order-mixing-drinks-and-food.html"
date: "2015-03-04T19:45"
slug: coffeebar-application-919-placing-order-mixing-drinks-and-food
layout: post
drupal_uuid: 14667901-6ec5-465b-a007-1d3850e16eed
drupal_nid: 111
lang: en
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "programmation événementielle"
  - "Event Manager"
  - "events"

sites:
  - "Développement"

summary: "In today chapters, we will see how we can manage the logic around the PlaceOrder command. Keep in mind we have only one form to order drinks and food. But we have two different workflows so we have to know, when the order is placed, which item is a drink and which one is a food and send the item in the correct workflow."
---

In today chapters, we will see how we can manage the logic around the PlaceOrder command. Keep in mind we have only one form to order drinks and food. But we have two different workflows so we have to know, when the order is placed, which item is a drink and which one is a food and send the item in the correct workflow.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

Several entities are used in this part. When an order is placed, we can order menu items several times, no matter if it is a drink or food. So we will use a class to represent the ordered items.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/OrderedItem.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class OrderedItem
{
  protected $id ; // int - Menu number
  protected $description ; // string
  protected $price ; // float
  protected $isDrink ; // bool

 // getters &amp; setters
}
```

Several `**CoffeeBar\Entity\TabStory\OrderedItem**`(s) are grouped into a `**CoffeeBar\Entity\TabStory\OrderedItems**`.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/OrderedItems.php

<?php
namespace CoffeeBar\Entity\TabStory ;

use ArrayObject;

class OrderedItems extends ArrayObject
{
}
```

Once we have the list of ordered items, we will be able to sort the drinks and the food, using two methods.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/OrderedItems.php

class OrderedItems
{
  // les autres méthodes

  // return : CoffeeBar\Entity\TabStory\OrderedItems
  public function getDrinkableItems()
  { 
    $iterator = $this->getIterator() ;
    $items = new OrderedItems() ;

    // $item de type CoffeeBar\Entity\TabStory\OrderedItem
    foreach($iterator as $item)
    {
      if($item->getIsDrink())
      {
        $items->offsetSet(NULL, $item) ;
      }
    }

    return $items ;
  }
 
  // return : CoffeeBar\Entity\TabStory\OrderedItems
  public function getEatableItems()
  {
    $iterator = $this->getIterator() ;
    $items = new OrderedItems() ;

    // $item de type CoffeeBar\Entity\TabStory\OrderedItem
    foreach($iterator as $item)
    {
      if(!$item->getIsDrink())
      {
        $items->offsetSet(NULL, $item) ;
      }
    }

    return $items ;
  }
}
```

Then, once we have ensured that we can sort ordered drinks from ordered food, we can focus on the `**CoffeeBar\Command\PlaceOrder**` command. Again, the `**CoffeeBar\Command\PlaceOrder**` will trigger a '*placeOrder*' event.

That means : dependency on the **Event Manager**.

```php
// module/CoffeeBar/src/CoffeeBar/Command/PlaceOrder.php

<?php
namespace CoffeeBar\Command ;

use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

class PlaceOrder implements EventManagerAwareInterface
{
  protected $id ; // int
  protected $items ; // CoffeeBar\Entity\TabStory\OrderedItems
  protected $events ;

  // ajouter getters et setters

  // We have a named method, we won't use hydrator here.
  public function placeOrder($id, $items)
  {
    $this->setId($id) ;
    $this->setItems($items) ;
    $this->events->trigger('placeOrder', '', array('placeOrder' => $this)) ;
  }

  // mandatory method when we implements EventManagerAwareInterface
  public function setEventManager(EventManagerInterface $events)
  {
    $this->events = $events;

    return $this;
  }
 
  // mandatory method when we implements EventManagerAwareInterface
  public function getEventManager()
  {
    return $this->events;
  }
}
```

When we had a `**CoffeeBar\Command\OpenTab**` command, we had a `**CoffeeBar\Event\TabOpened**` event.

Now we have a `**CoffeeBar\Command\PlaceOrder**` command, we will have the `CoffeeBar\Event\DrinksOrdered**` event and the `**CoffeeBar\Event\FoodOrdered**` event.

Here is the `**CoffeeBar\Event\DrinksOrdered**` event object, with two properties : the **unique id** of the tab ordering and the **list of ordered drinks**.

```php
// module/CoffeeBar/src/CoffeeBar/Event/DrinksOrdered.php

<?php
namespace CoffeeBar\Event ;

use CoffeeBar\Entity\TabStory\OrderedItems;

class DrinksOrdered
{
  protected $id ; // guid - id unique de la note
  protected $items ; // CoffeeBar\Entity\TabStory\OrderedItems

  // getters &amp; setters
}
```

Here is the `**CoffeeBar\Event\FoodOrdered**` event object, with two properties : the **unique id** of the tab ordering and the **list of ordered food**.

```php
// module/CoffeeBar/src/CoffeeBar/Event/FoodOrdered.php

<?php
namespace CoffeeBar\Event ;

use CoffeeBar\Entity\TabStory\OrderedItems;

class FoodOrdered
{
  protected $id ; // guid - id unique de la note
  protected $items ; // CoffeeBar\Entity\TabStory\OrderedItems

  // getters &amp; setters
}
```

Now, let's place all of those components within our **TabAggregate** service.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
use CoffeeBar\Command\PlaceOrder;
use CoffeeBar\Event\DrinksOrdered;
use CoffeeBar\Event\FoodOrdered;
use CoffeeBar\Exception\TabNotOpen;

class TabAggregate
{
  // other methods
  ...

  public function attach(EventManagerInterface $events)
  {
    // if the 'placeOrder' event is triggered, the TabAggregate::onPlaceOrder() method is called
    $this->listeners[] = $events->attach('placeOrder', array($this, 'onPlaceOrder')) ;
  }
 
  public function onPlaceOrder($events)
  {
    // CoffeeBar\Command\PlaceOrder
    $placeOrder = $events->getParam('placeOrder') ;

    // load the TabStory of the tab using its unique id
    $story = $this->loadStory($placeOrder->getId()) ;

    // checking if the tab is not opened yet, throw an exception
    if(!$story->isTabOpened())
    {
      throw new TabNotOpen('Tab is not open yet') ; // CoffeeBar\Exception\TabNotOpen
    // other wise, ordering drinks and food
    } else {
      $this->orderDrink($placeOrder) ; // triggers 'drinksOrdered'
      $this->orderFood($placeOrder) ; // triggers 'foodOrdered'
    }
  }

  protected function orderDrink(PlaceOrder $order)
  {
    // for each ordered items in the PlaceOrder object
    // check if it is a drink or not
    // $order->getItems() return an OrderedItems object
    $drinks = $order->getItems()->getDrinkableItems() ;

    // if there is drinks ordered, return a DrinksOrdered() object
    // trigger a 'drinksOrdered' event
    if(count($drinks) != 0)
    {
      $orderedDrinks = new DrinksOrdered() ;
      $orderedDrinks->setId($order->getId()) ;
      $orderedDrinks->setItems($drinks) ;

      $this->events->trigger('drinksOrdered', $this, array('drinksOrdered' => $orderedDrinks)) ;
    }
  }
 
  // same logic for food
  protected function orderFood(PlaceOrder $order)
  {
    $foods = $order->getItems()->getEatableItems() ;

    if(count($foods) != 0)
    {
      $orderedFoods = new FoodOrdered() ;
      $orderedFoods->setId($order->getId()) ;
      $orderedFoods->setItems($foods) ;

      $this->events->trigger('foodOrdered', $this, array('foodOrdered' => $orderedFoods)) ;
    }
  }
}
```

The exception, easy :
```php
// module/CoffeeBar/src/CoffeeBar/Exception/TabNotOpen.php

namespace CoffeeBar\Exception ;

use Exception;

class TabNotOpen extends Exception {}
```

In the next chapter, we will build the form and place our order.

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
