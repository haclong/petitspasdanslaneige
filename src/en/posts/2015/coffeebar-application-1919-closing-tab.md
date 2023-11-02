---
title: "CoffeeBar Application 19/19 - Closing the tab"
permalink: "en/posts/coffeebar-application-1919-closing-tab.html"
date: "2015-06-09T20:27"
slug: coffeebar-application-1919-closing-tab
layout: post
drupal_uuid: 810eb211-ecfd-4c0c-aef7-0264554a7a71
drupal_nid: 123
lang: en
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "OOP"
  - "programmation événementielle"

sites:
  - "Développement"

summary: "To check out a tab, we only need one field in a form. If the amount paid is less than the invoice, it is impossible to checkout the tab. If the amount paid is more than the invoice, we count the difference as a tip."
---

To check out a tab, we only need one field in a form. If the amount paid is less than the invoice, it is impossible to checkout the tab. If the amount paid is more than the invoice, we count the difference as a tip.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

## Processing the datas

Taking care of the form in the controller

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

use CoffeeBar\Exception\MustPayEnough;
use CoffeeBar\Exception\TabAlreadyClosed;

class TabController
{
  public function closeAction()
  {
    $openTabs = $this->serviceLocator->get('OpenTabs') ;

    $form = $this->serviceLocator->get('CloseTabForm') ;

    $request = $this->getRequest() ;

    $id = (int) $this->params()->fromRoute('id') ;

    // check if the table number is in the HTTP Request
    if (isset($id)) 
    {
      // check if the form is posted
      if($request->isPost()) 
      {
        $form->setData($request->getPost()) ;
 
        try {
          $form->isValid() ;

          // processing of datas is here
          // there's nothing really because when the form is valid
          // we bind the form datas to the object (closeTab) with the hydrator
          // we don't need to manipulate the closeTab object in the controller
          // so basically, we're done

          $this->flashMessenger()->addMessage('La note a été fermée avec succès');
          return $this->redirect()->toRoute('tab/opened');
        // amount paid not enough
        } catch (MustPayEnough $e) {
          $this->flashMessenger()->addErrorMessage($e->getMessage());
          return $this->redirect()->toRoute('tab/close', array('id' => $id));
        // tab already closed
        } catch (TabAlreadyClosed $e) {
          $this->flashMessenger()->addErrorMessage($e->getMessage()) ;
          return $this->redirect()->toRoute('tab/opened') ;
        }
      }
    }

    $result['status'] = $status ;
    $result['form'] = $form ;
    return array('result' => $result) ;
  }
}
```

## The Tab Story

When we submit the form, the `**CoffeeBar\Command\CloseTab**` is bound. With the `**Zend\Stdlib\Hydrator\ArraySerializable**` hydrator and the `CloseTab::populate()` method, we have triggered a '*closeTab*' event at the very moment the `**CoffeeBar\Command\CloseTab**` object is bound. Now, our **TabAggregate** service will listen to the event and do whatever it has to do with the tab story.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TagAggregate.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Event\TabClosed;
use CoffeeBar\Exception\MustPayEnough;
use CoffeeBar\Exception\TabAlreadyClosed;

class TabAggregate
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('closeTab', array($this, 'onCloseTab')) ;
    $this->listeners[] = $events->attach('tabClosed', array($this, 'onTabClosed')) ;
  }

  public function onCloseTab($events)
  {
    $closeTab = $events->getParam('closeTab') ;

    $story = $this->loadStory($closeTab->getId()) ;

    // $story->getItemsServedValue() = tab total of all served items
    // $closeTab->getAmountPaid() = amount paid from the closeTabForm
    if($story->getItemsServedValue() > $closeTab->getAmountPaid())
    {
      throw new MustPayEnough('Le solde n\'y est pas, compléter l\'addition') ;
    }
    // check if tab still opened
    if(!$story->isTabOpened())
    {
      throw new TabAlreadyClosed('La note est fermée') ;
    }

    $tabClosed = new TabClosed() ;
    $tabClosed->setId($closeTab->getId()) ;
    $tabClosed->setAmountPaid($closeTab->getAmountPaid()) ;
    $tabClosed->setOrderValue($story->getItemsServedValue()) ;
    $tabClosed->setTipValue($closeTab->getAmountPaid() - $story->getItemsServedValue()) ;

    $this->events->trigger('tabClosed', $this, array('tabClosed' => $tabClosed)) ;
  }
 
  public function onTabClosed($events)
  {
    $tabClosed = $events->getParam('tabClosed') ;
 
    $story = $this->loadStory($tabClosed->getId()) ;
    // now we close the tab
    $story->closeTab() ;
    $this->saveStory($tabClosed->getId(), $story) ;
  }
}
```

Check both our exceptions extending the php `**\Exception**` class.

```php
// module/CoffeeBar/src/CoffeeBar/Exception/MustPayEnough.php

<?php
namespace CoffeeBar\Exception ;

use Exception;

class MustPayEnough extends Exception {}
```

```php
// module/CoffeeBar/src/CoffeeBar/Exception/TabAlreadyClosed.php

<?php
namespace CoffeeBar\Exception ;

use Exception;

class TabAlreadyClosed extends Exception {}
```

Here the `**CoffeeBar\Event\TabClosed**` event, but you already know what's inside.

```php
// module/CoffeeBar/src/CoffeeBar/Event/TabClosed.php

<?php
namespace CoffeeBar\Event ;

class TabClosed
{
  protected $id; // int (guid) - id unique de la note
  protected $amountPaid; // double
  protected $orderValue; // double
  protected $tipValue; // double

  // getters &amp; setters
}
```

Please note that we have more properties in the `**CoffeeBar\Event\TabClosed**` class than in the `**CoffeeBar\Command\CloseTab**` class. The `**CoffeeBar\Command\CloseTab**` has only two properties : the **id** (unique) and the **amount paid** (`$amountPaid`), while the `**CoffeeBar\Event\TabClosed**` has two more properties : the **tip** (`$tipValue`) and the** total amount of the tab** (`$orderValue`).

With the '*tabClosed*' event, we're closing the tab. Finally.

## The Open Tabs list

With the '*tabClosed*' event, we remove the tab from the open tabs list.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

class OpenTabs implements ListenerAggregateInterface
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('tabClosed', array($this, 'onTabClosed')) ;
  }

  /**
   * Listener to tabClosed event
   * unset the tab from the TodoByTab list
   * @param Events $events
   */
  public function onTabClosed($events)
  {
    $tabClosed = $events->getParam('tabClosed') ;

    $this->loadTodoByTab() ;
    $this->todoByTab->offsetUnset($tabClosed->getId()) ;
    $this->saveTodoByTab() ;
  }
}
```

Tadaa.. We're done.

## Keep track of events

When using events this way, it is easy to imagine a way to keep history of a tab (and store it into the database). All we have to do is to store each events into a `TabStory::$eventsLoaded` property.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php
<?php
class TabStory
{
 protected $eventsLoaded ; // array - liste des événements

 public function __construct()
 {
 $this->eventsLoaded = array() ;
 }

 public function addEvents($event) {
 $this->eventsLoaded[] = $event ;
 }

 public function getEventsLoaded() {
 return $this->eventsLoaded ;
 }
}
</pre>
```

In the **TabAggregate** service, when we save the tab story, we will take the opportunity to save the events too.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
class TabAggregate
{
  // les autres méthodes

  public function onTabOpened($events)
  {
    $tabOpened = $events->getParam('tabOpened') ;
    $story = $this->loadStory($tabOpened->getId()) ;
    $story->addEvents($tabOpened) ; // add the event in the tab story
    // do things
    $this->saveStory($tabOpened->getId(), $story) ;
  }
 
  public function onDrinksOrdered($events)
  {
    $drinksOrdered = $events->getParam('drinksOrdered') ;
    $story = $this->loadStory($drinksOrdered->getId()) ;
    $story->addEvents($drinksOrdered) ; // add the event in the tab story

    // do things
 
    $this->saveStory($drinksOrdered->getId(), $story) ;
  }
 
  public function onFoodOrdered($events)
  {
    $foodOrdered = $events->getParam('foodOrdered') ;
    $story = $this->loadStory($foodOrdered->getId()) ;
    $story->addEvents($foodOrdered) ; // add the event in the tab story
    
    // do things
 
    $this->saveStory($foodOrdered->getId(), $story) ;
  }
 
  public function onDrinksServed($events)
  {
    $drinksServed = $events->getParam('drinksServed') ;
    $story = $this->loadStory($drinksServed->getId()) ;
    $story->addEvents($drinksServed) ;
 
    // do things
 
    $this->saveStory($drinksServed->getId(), $story) ;
  }

  public function onFoodPrepared($events)
  {
    $foodPrepared = $events->getParam('foodPrepared') ;
    $story = $this->loadStory($foodPrepared->getId()) ;
    $story->addEvents($foodPrepared) ;
 
    // do things
 
    $this->saveStory($foodPrepared->getId(), $story) ;
  }

  public function onFoodServed($events)
  {
    $foodServed = $events->getParam('foodServed') ;
    $story = $this->loadStory($foodServed->getId()) ;
    $story->addEvents($foodServed) ;
 
    // do things
 
    $this->saveStory($foodServed->getId(), $story) ;
  }
 
  public function onTabClosed($events)
  {
    $tabClosed = $events->getParam('tabClosed') ;
    $story = $this->loadStory($tabClosed->getId()) ;
    $story->addEvents($tabClosed) ;
    
    // do things
    
    $this->saveStory($tabClosed->getId(), $story) ;
  }
}
```

If we'd like to keep the commands as well, you ought to know that you won't be able to serialize classes with an** Event Manager** within. It is not clear why but you just can't... So you'll have to use the magic method `__sleep()` and decide which properties you want to be serialized (and which one won't be... *hint*: the `$events` properties for example...)

## Extensions

We can extends our application, of course.

We can add an accounting workflow. Counting the amount earned in one day : total paid, total served, total of tips, tips per waiter... This will be rather easy.

We can also allow to amend the tab : cancel food which are not prepared yet and drinks which are not served yet.

The events object (`**CoffeeBar\Event**`) and commands object (`**CoffeeBar\Command**`) do not extends any other objects. If you want to use <a href="http://fr2.php.net/manual/fr/language.oop5.typehinting.php" target="_blank">type hinting</a>, it is better to use **interfaces**. One interface for events object and the other for the commands object.

## Notes

With this tutorial, pretty long (and i didn't expect it to be that long) and with a lot of repetition, i wish to point out two observations :

### Observation A :

When you need to rendering things on screen (using Zend Framework 2), you need (always)

1. a route
2. a controller (and don't forget to put it in the configuration)
3. a view
4. a navigation
5. a Service Manager because every thing goes through it - i mean it. EVERYTHING. More than what has been done in this tutorial.

**Any other classes belong to the business model.**

### Observation B :

On the other side, we can list two kinds of classes :

- **Controller**, **Form**, **Service**, **View Helpers** and **Action Helpers** will be used for the rendering.
- **Hydrators**, **Exception**, **Entity**, **Listeners** and anything else will be used for the processing of datas.

If we want to be fair, my **TabAggregate** class shouldn't be a service. It is not helping the rendering whatsoever. It is not even sending any objects to any views. It is not even being called by anything except being present in the Event Manager as a listener. So maybe it is more a listener than a service... On the other hand, the **OpenTabs** service build specific objects (`**TabStatus**`, `**TabInvoice**`) which are used by the view.

I know... it is quibbling (?) but it might be useful to get organized with the entities...

## Conclusion

I really hope you enjoyed that tutorial and i hope it wasn't too long and too boring. I hope you learned few things here and there (i have) and i'm not being too confused, using too much shortcuts and not too messy with events and Events...

The source do have comments either in english or in french. Mostly in french for the explanatory part. I have translated most of the comments in this tutorial series though.

I know my dependencies management is very very very bad throughout the tutorial series. DO NOT DO LIKE ME. It is DEFINITELY unwise to use the keyword '`new`' within your source. You can fix that if you feel to. Although, if we can sort all the classes between two kinds of objects : those for rendering and those for processing, i'm thinking about a logic to keep some classes heavy dependants and some other less dependants... It's unclear. And maybe unwise. I have no idea what i'm telling right now... Just don't take this into account. I'm absolutely not in position to give any recommandations about that point.

Anyway, thanks for reading this. See you next time.

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
