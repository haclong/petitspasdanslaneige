---
title: "CoffeeBar Application 15/19 - Food is prepared, reacting to it"
permalink: "en/posts/coffeebar-application-1519-food-prepared-reacting-it.html"
date: "2015-04-21T19:44"
slug: coffeebar-application-1519-food-prepared-reacting-it
layout: post
drupal_uuid: bd18552c-7719-421d-a864-c5a8826c8c88
drupal_nid: 119
lang: en
author: haclong

book:
  book: manage-coffeebar-event-driven-programming
  rank: 15,
  top: 
    url: /en/books/manage-coffeebar-event-driven-programming.html
    title: Manage a coffeebar with event driven programming
  next: 
    url: /en/posts/coffeebar-application-1619-get-staff-todo-list.html
    title: CoffeeBar Application 16/19 - Get the staff todo list
  previous:
    url: /en/posts/coffeebar-application-1419-marking-prepared-food.html
    title: CoffeeBar Application 14/19 - Marking prepared food

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "OOP"
  - "events"
  - "Event Manager"
  - "programmation événementielle"

sites:
  - "Développement"

summary: "Now food is prepared and ready to serve... The 'foodPrepared' event has been triggered. But we know it well by now, nothing will ever happen if nobody is listening to this event. So now, let's add some listeners... ok, we (almost) know which listeners, but what about callbacks ?"
---

Now food is prepared and ready to serve... The 'foodPrepared' event has been triggered. But we know it well by now, nothing will ever happen if nobody is listening to this event. So now, let's add some listeners... ok, we (almost) know which listeners, but what about callbacks ?

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

## Here is what we know

- For the **Tab Story**, items in the `TabStory::$outstandingFood` list will be removed and they will be added to the `TabStory::$preparedFood` list.
- For the **Chef todo list**, **prepared food will be removed** from the list.
- For the **Open tabs** list, items in the `Tab::$itemsInPreparation` list will be moved to the `Tab::$itemsToServe` list.

## The Tab Story

Ordered fool not prepared yet are listed in the `TabStory::$outstandingFood` property. For each ordered menu number, we need to know** its key** in the `TabStory::$outstandingFood` array so we can delete that index.

The `TabStory::$outstandingFood` property is a `**CoffeeTab\Entity\TabStory\OrderedItems**` (extending `**\ArrayObject**`). We need to make a method which will return the **key** of the `TabStory::$outstandingFood` array by menu number.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/OrderedItems.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class OrderedItems extends ArrayObject
{
  // $id = menu number
  public function getKeyById($id)
  {
    $iterator = $this->getIterator() ;
 
    // iterate through the whole array
    foreach($iterator as $key => $value)
    {
      // check when we have a $value matching the menu number.
      // once we have a match, return its key
      if($value->getId() == $id) 
      {
        return $key ;
      }
    }
  }
}
```

Prepared food are stored now in a `TabStory::$preparedFood` property.

```php
// module/CoffeeBar/src/CoffeeBar/TabStory/TabStory.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class TabStory
{
  protected $preparedFood ; // CoffeeBar/Entity/TabStory/OrderedItems
 
  public function __construct()
  {
    $this->preparedFood = new OrderedItems() ;
  }

  public function getPreparedFood() 
  {
    return $this->preparedFood;
  }

  public function addPreparedFood($food) 
  {
    foreach($food as $item)
    {
      $this->preparedFood->offsetSet(NULL, $item) ;
    }
  }
}
```

Now put it all together : remove the items from the `TabStory::$outstandingFood` array and add the same items to the `TabStory::$preparedFood` array.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
class TabAggregate
{
  ...
 
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('foodPrepared', array($this, 'onFoodPrepared')) ;
  }

  public function onFoodPrepared($events)
  {
    $foodPrepared = $events->getParam('foodPrepared') ;
 
    $story = $this->loadStory($foodPrepared->getId()) ;
 
    foreach($foodPrepared->getFood() as $food)
    {
      // get the key of prepared food
      $key = $story->getOutstandingFood()->getKeyById($food) ;
 
      if($key !== null)
      {
        // get the item : CoffeeBar/Entity/TabStory/OrderedItem
        $value = $story->getOutstandingFood()->offsetGet($key) ;

        // remove the item from the $outstandingFood array
        $story->getOutstandingFood()->offsetUnset($key) ;

        // add the item in the $preparedFood array
        $story->getPreparedFood()->offsetSet(NULL, $value) ;
      }
    }
    $this->saveStory($foodPrepared->getId(), $story) ;
  }
}
```

Et voila. Next.

## The Chef Todo List

Now let's see what happens to the chef todo list : once the food is prepared, remove the item from the list, of course.

```php
// module/CoffeeBar/src/CoffeeBar/Service/ChefTodoList.php

<?php
namespace CoffeeBar\Service;

class ChefTodoList implements ListenerAggregateInterface
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('foodPrepared', array($this, 'onFoodPrepared')) ;
  }

  public function onFoodPrepared($events)
  {
    $foodPrepared = $events->getParam('foodPrepared') ;

    $this->loadTodoList() ;

    foreach($this->todoList as $key => $item)
    {
      // $item->getTab() get the tab unique id in the todolist
      // $foodPrepared->getId() get the tab unique id from the 'foodPrepared' event
      if($item->getTab() == $foodPrepared->getId())
      {
        $groupKey = $key ;
        $group = $item ;
      }
    }
 
    // $foodPrepared->getFood = array of int (menu numbers)
    foreach($foodPrepared->getFood() as $food)
    {
      // get the key of the prepared item in the chef todo list
      $key = $group->getKeyByMenuNumber($food) ;
      if($key !== null)
      {
        // remove the item by its key
        $group->getItems()->offsetUnset($key) ;
      }
    }
 
    // if TodoListGroup::items is empty
    // remove TodoListGroup
    if(count($group->getItems()) == 0)
    {
      $this->todoList->offsetUnset($groupKey) ;
    }
 
    $this->saveTodoList() ;
  }
}
```

This time, we need to retrieve the array key by one of its value in the `**CoffeeBar\Entity\ChefTodoList**`

```php
// module/CoffeeBar/src/CoffeeBar/Entity/ChefTodoList/TodoListGroup.php

<?php
namespace CoffeeBar\Entity\ChefTodoList;

class TodoListGroup 
{
  // $menuNumber = numéro de menu passé en argument
  public function getKeyByMenuNumber($menuNumber)
  {
    // itération sur le tableau $items
    foreach($this->getItems() as $key => $value)
    {
      // si une valeur est trouvée, correspondant au numéro de menu passé en argument
      // retourner l'index
      if($value->getMenuNumber() == $menuNumber)
      {
        return $key ;
      }
    }
  }
}
```

## The Open Tabs list

Now about the Open Tabs list

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Entity\OpenTabs\TabStatus;

class OpenTabs
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('foodPrepared', array($this, 'onFoodPrepared')) ;
  }

  /**
   * Move the prepared items from the itemsInPreparation list to the itemsToServe list
   * @param Events $events
   */
  public function onFoodPrepared($events)
  {
    $foodPrepared = $events->getParam('foodPrepared') ;

    $this->loadTodoByTab() ;
    $tab = $this->todoByTab->offsetGet($foodPrepared->getId()) ;
 
    // get the list of prepared food (array of int)
    foreach($foodPrepared->getFood() as $food)
    {
      // ici aussi, on récupère l'index du tableau avec le numéro de menu
      $key = $tab->getItemsInPreparation()->getKeyByMenuNumber($food) ;
      if($key !== null)
      {
        // on récupère l'élément stocké à cet index
        $value = $tab->getItemsInPreparation()->offsetGet($key) ;

        // on ajoute l'élément à la liste de $itemsToServe
        $tab->getItemsToServe()->addItem($value) ;

        // on supprime l'élément de la liste $itemsInPreparation
        $tab->getItemsInPreparation()->offsetUnset($key) ;
      }
    }
    $this->todoByTab->offsetSet($foodPrepared->getId(), $tab) ;
    $this->saveTodoByTab() ;
  }
}
```

The `Tab::$itemsInPreparation` property is a `**CoffeeBar\Entity\OpenTabs\ItemsArray**`. Again, try to get the key by the value.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/OpenTabs/ItemsArray.php

<?php
namespace CoffeeBar\Entity\OpenTabs ;

class ItemsArray extends ArrayObject
{
  public function getKeyByMenuNumber($menuNumber)
  {
    $iterator = $this->getIterator() ;
 
    foreach($iterator as $key => $value)
    {
      if($value->getMenuNumber() == $menuNumber) {
        return $key ;
      }
    }
  }
}
```

### Conclusion

Once '*foodPrepared*' event is triggered :

- prepared food is removed from the chef todo list
- prepared food is removed from the `Tab::$itemsInPreparation` array and added to the `Tab::$itemsToServe` array
- prepared food is removed from the `TabStory::$outstandingFood` array and added to the `TabStory::$preparedFood` array

Now the service

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
