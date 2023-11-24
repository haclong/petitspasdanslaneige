---
title: "CoffeeBar Application 14/19 - Marking prepared food"
permalink: "en/posts/coffeebar-application-1419-marking-prepared-food.html"
date: "2015-04-14T19:26"
slug: coffeebar-application-1419-marking-prepared-food
layout: post
drupal_uuid: 373a2d62-8680-4c8e-8179-eb1819acae48
drupal_nid: 118
lang: en
author: haclong

book:
  book: manage-coffeebar-event-driven-programming
  rank: 14,
  top: 
    url: /en/books/manage-coffeebar-event-driven-programming.html
    title: Manage a coffeebar with event driven programming
  next: 
    url: /en/posts/coffeebar-application-1519-food-prepared-reacting-it.html
    title: CoffeeBar Application 15/19 - Food is prepared, reacting to it
  previous:
    url: /en/posts/coffeebar-application-1319-chef-todo-list.html
    title: CoffeeBar Application 13/19 - Chef todo list

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "programmation événementielle"
  - "Event Manager"
  - "OOP"

sites:
  - "Développement"

summary: "The chef knows what he has to do. The list of items to prepare are now displaying on screen. Once the chef has prepared an item, he needs to advise the staff that the item can now be served."
---

The chef knows what he has to do. The list of items to prepare are now displaying on screen. Once the chef has prepared an item, he needs to advise the staff that the item can now be served.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

## Chef view

We will add some checkboxes to the chef todo list.

```php
// module/CoffeeBar/view/coffee-bar/chef/index.phtml

<h2>Meals to prepare</h2>

// le formulaire, qui renvoie sur une action de traitement
<form action="<?php echo $this->url('chef/markprepared') ; ?>" method="post">

  <table>
    <tr>
      <th>Menu #</th>
      <th>Description</th>
      <th>Prepared</th>
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
      // the checkbox, with the tab unique id and the menu number embedded in the checkbox value
      <td><input type="checkbox" name="prepared[]" value="prepared_<?php echo $group->getTab() ; ?>_<?php echo $item->getMenuNumber() ; ?>"/></td>
    </tr>

    <?php
        }
      }
    ?>
  </table>

  <input type='submit' name='submit' value='Mark Prepared'/>
</form>
```

Therefore, prepared food will be checked and marked as prepared so submitting the form will send advising informations to the waiters.

### The 'chef/markprepared' route

When the form is submitted, the datas are sent to the '*chef/markprepared*' route (as indicated in the `action` attribute of the `<form>` tag)

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'router' => array(
    'routes' => array(
      /**
       * this URL : http://coffeebar.home/chef will lead to the following route
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
        'child_routes' => array(
          'markprepared' => array(
            'type' => 'Literal',
            'options' => array(
              'route' => '/mark',
              'defaults' => array(
                'controller' => 'CoffeeBarController\Chef',
                'action' => 'mark',
              ),
            ),
          ),
        ),
      ),
    ),
  ),
) ;
```

### In the ChefController::markAction() : process the form

```php
// module/CoffeeBar/src/CoffeeBar/Controller/ChefController.php

<?php
namespace CoffeeBar\Controller;

use Zend\Mvc\Controller\AbstractActionController;

class ChefController extends AbstractActionController
{
  public function markAction()
  {
    $request = $this->getRequest() ; 
    
    if($request->isPost()) 
    {
      if(!is_array($request->getPost()->get('prepared'))) 
      {
        $this->flashMessenger()->addErrorMessage('Aucun plat ou boisson n\'a été choisi pour servir');
        return $this->redirect()->toRoute('chef');
      }
 
      $foodPerTab = $this->getPreparedFoodPerTab($request->getPost()->get('prepared')) ;

      if(!empty($foodPerTab))
      {
        $markPrepared = $this->serviceLocator->get('MarkFoodPreparedCommand') ;
        // $id = id unique de la note
        // $food = numero des menus préparés (array)
        foreach($foodPerTab as $id => $food)
        {
          $markPrepared->markPrepared($id, $food) ;
        }
      }
    }
 
    return $this->redirect()->toRoute('chef') ;
  }
 
  protected function getPreparedFoodPerTab($prepared)
  {
    $array = array() ;
    foreach($prepared as $item)
    {
      $groups = explode('_', $item) ;
      // $groups[1] = id unique de la note
      // $groups[2] = numéro de plat qui est préparé
      $array[$groups[1]][] = $groups[2] ;
    }
  
    return $array ;
  }
}
```

### The Service Manager

The Service Manager, with the '*MarkFoodPreparedCommand*'

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

use CoffeeBar\Command\MarkFoodPrepared;

class Module
{
  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'MarkFoodPreparedCommand' => function($sm) {
          $events = $sm->get('TabEventManager') ;
          $markFoodPrepared = new MarkFoodPrepared() ;
          // there will be an event triggered
          // inject the event manager to the MarkFoodPrepared() command
        $markFoodPrepared->setEventManager($events) ;
        return $markFoodPrepared ;
      },
    ),
  ) ;
 }
}
```

At last `**CoffeeBar\Command\MarkFoodPrepared**`

```php
// module/CoffeeBar/src/CoffeeBar/Command/MarkFoodPrepared.php

<?php
namespace CoffeeBar\Command ;

use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

class MarkFoodPrepared implements EventManagerAwareInterface
{
  protected $id ; // int - unique id of the tab
  protected $food ; // array - array of menu number
  protected $events ;

  // getters &amp; setters - ne pas oubliers setEventManager() et getEventManager()
 
  public function markPrepared($id, $menuNumbers)
  {
    $this->setId($id) ;
    $this->setFood($menuNumbers) ;
    $this->events->trigger('markFoodPrepared', '', array('markFoodPrepared' => $this)) ;
  }
}
```

Here we are. The '*markFoodPrepared*' event is triggered.

Once we mark food as prepared, this event will be listened to and that will trigger a '*foodPrepared*' event.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
use CoffeeBar\Event\FoodPrepared;
use CoffeeBar\Exception\FoodNotOutstanding;

class TabAggregate
{
  ...
  
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('markFoodPrepared', array($this, 'onMarkFoodPrepared')) ;
  }

  public function onMarkFoodPrepared($events)
  {
    $markFoodPrepared = $events->getParam('markFoodPrepared') ;
 
    $story = $this->loadStory($markFoodPrepared->getId()) ;

    // check if the prepared food have been ordered
    // checking the list of menu numbers in the markFoodPrepared() object
    // and the list of menu numbers stored in the TabStory::$outstandingFood property
    if(!$story->isFoodOutstanding($markFoodPrepared->getFood()))
    {
      throw new FoodNotOutstanding('un ou plusieurs plats n\'ont pas été commandés') ;
    }
 
    $foodPrepared = new FoodPrepared() ;
    $foodPrepared->setId($markFoodPrepared->getId()) ;
    $foodPrepared->setFood($markFoodPrepared->getFood()) ;

    // on déclenche un événement 'foodPrepared'
    $this->events->trigger('foodPrepared', $this, array('foodPrepared' => $foodPrepared)) ;
  }
}
```

For your information, here is the `TabStory::isFoodOutstanding()` method :

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php

class TabStory
{
  public function isFoodOutstanding(array $menuNumbers)
  {
    return $this->areAllInList($menuNumbers, $this->outstandingFood) ;
  }

  protected function areAllInList(array $want, OrderedItems $have)
  {
    // extract the menu numbers from the OrderedItems object only
    $currentHave = $this->getOrderedItemsId($have) ;

    // for each number of prepared food, 
    // check the number exists in the OrderedItems property (the $outstandingFood in our case)
    foreach($want as $item)
    {
      // if there is a match, delete the number from the currentHave list (extracted from the OrderedItems list)
      if(($key = array_search($item, $currentHave)) !== false) 
      {
        unset($currentHave[$key]);

      // if there's no match, return false
      } else {
        return false ;
      }
    }

    return true ;
  }

  protected function getOrderedItemsId(OrderedItems $items)
  {
    $array = array() ;
    foreach($items as $item)
    {
      $array[] = $item->getId() ;
    }
    return $array ;
  }
}
```

Here is the event object `**CoffeeBar\Event\FoodPrepared**`

```php
// module/CoffeeBar/src/CoffeeBar/Event/FoodPrepared.php

<?php
namespace CoffeeBar\Event ;

class FoodPrepared
{
  protected $id ; // int - tab unique id
  protected $food ; // array - menu numbers

  // getters &amp; setters
}
```

and the exception `**CoffeeBar\Exception\FoodNotOutstanding**`

```php
// module/CoffeeBar/src/CoffeeBar/Exception/FoodNotOutstanding.php

namespace CoffeeBar\Exception ;

use Exception;

class FoodNotOutstanding extends Exception {}
```

So the chef has prepared the food. He has marked the food as prepared. Doing so, he has triggered the '*markFoodPrepared*' event.

Thanks to the `TabStory::$outstandingFood` property stored in each `**CoffeeBar\Entity\TabStory\TabStory**`, we can verify the integrity of our tab, checking that each prepared food has been ordered before. When no exception has been caught, we can trigger a '*foodPrepared*' event.

Next chapter, check who's listening and what they will do next.

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
