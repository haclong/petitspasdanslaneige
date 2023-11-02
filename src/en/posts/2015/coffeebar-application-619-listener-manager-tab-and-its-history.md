---
title: "CoffeeBar Application 6/19 - A listener to manager the tab and its history"
permalink: "en/posts/coffeebar-application-619-listener-manager-tab-and-its-history.html"
date: "2015-02-05T19:37"
slug: coffeebar-application-619-listener-manager-tab-and-its-history
layout: post
drupal_uuid: 29149d60-3b61-435a-81b9-c4315dfeb630
drupal_nid: 108
lang: en
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "Event Manager"
  - "programmation événementielle"

sites:
  - "Développement"

summary: "We have triggered our very first event in our previous chapter : 'openTab'. Now, we will set a service to catch the events triggered and process the business rules to it."

---

We have triggered our very first event in our previous chapter : '*openTab*'. Now, we will set a service to catch the events triggered and process the business rules to it.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

## The TabAggregate service

We will set up a **TabAggregate** service to listen and catch all events triggered on a tab.

- The **TabAggregate** service listens to events triggered by commands (**`CoffeeBar\Command\*`**) and checks that the event is coherent along the business rules.
- The **TabAggregate** service listens to several different events triggered in only one **Event Manager** : we will need to use the `**Zend\EventManager\ListenerAggregateInterface**` interface.
- The **TabAggregate** service will trigger other events depending on the methods it will use : we then will need to use the `**Zend\EventManager\EventManagerAwareInterface**` interface.
- The **TabAggregate** service will store in the cache each one of the opened tab. It will load each tab (identified by its unique id) from the cache. Therefore, there is a **dependency** on the cache too.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

namespace CoffeeBar\Service ;

use Zend\EventManager\EventManagerInterface;
use Zend\EventManager\ListenerAggregateInterface;
use Zend\EventManager\EventManagerAwareInterface;

class TabAggregate implements ListenerAggregateInterface, EventManagerAwareInterface
{
  protected $listeners = array() ; // see listenerAggregateInterface
  protected $events ; // see EventManagerAwareInterface
  protected $cache ; // the cache

  // the event manager $events will be inject in the Service Manager
  // mandatory method if we want to implement EventManagerAwareInterface
  public function setEventManager(EventManagerInterface $events)
  {
    $this->events = $events;
    return $this;
  }

  // mandatory method if we want to implement EventManagerAwareInterface
  public function getEventManager()
  {
    return $this->events;
  }

  // the argument $events will be injected when we will attach 
  // this object to the Event Manager, thanks to the ListenerAggregateInterface
  // mandatory method if we want to implement ListenerAggregateInterface
  public function attach(EventManagerInterface $events)
  {
    // attach the events + their callback here
  }

  public function detach(EventManagerInterface $events)
  {
    foreach ($this->listeners as $index => $listener) {
      if ($events->detach($listener)) {
        unset($this->listeners[$index]);
      }
    }
  }
 
  // inject the cache from the Service Manager
  public function getCache() 
  {
    return $this->cache;
  }

  public function setCache($cache) 
  {
    $this->cache = $cache;
  }
}
```

## Loading from the cache

To store a tab in the cache and then load it from the cache :

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

class TabAggregate
{
  /**
   * Load the tab story by id
   * @param string $id - Tab guid
   */
  public function loadStory($id)
  {
    // checking if there's already an item with the id in the cache
    if($this->cache->hasItem($id))
    {
      // yes : load the item
      return unserialize($this->cache->getItem($id)) ;

      // otherwise, instanciate a new TabStory() object
      // and assign to it a new id
    } else {
      // to be totally clean (and dependency free)
      // we should clone the TabStory() and we shouldn't instanciate it here
      $story = new TabStory() ; // do not forget the use keywords, of course
      $story->setId($id) ;

      return $story ;
    }
  }

  /**
   * Storing in the cache
   * @param string $id - Tab guid
   * @param string $story - Tab Story object
   */
  protected function saveStory($id, $story)
  { 
    // it is mandatory to serialize the object
    // the cache won't allow any object.
    $this->cache->setItem($id, serialize($story)) ;
  }
}
```

Quick look on the `**CoffeeBar\Entity\TabStory\TabStory**` class. For now, it is pretty light, holding only two properties.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class TabStory
{
  protected $id ; // int (guid) - unique id of the tab
  protected $status ; // bool - is the tab open or not

  // constantes
  const CLOSE = false ;
  const OPEN = true ;

  // getters &amp; setters

  public function __construct()
  {
    // default value : the tab is closed
    $this->status = self::CLOSE ;
  }

  public function isTabOpened()
  {
    return $this->status ;
  }
 
  public function openTab()
  {
    // opening the tab
    $this->status = self::OPEN ;
    return $this ;
  }
 
  public function closeTab()
  {
    $this->status = self::CLOSE ;
    return $this ;
  }
}
```

Here we go. Our **TabAggregate** service will catch the events triggered and will in turn trigger other events for other listeners. But, on last thing : the **TabAggregate** is unable to catch anything if the **Event Manager** is not aware of who is listening...

## Attach the listener to the Event Manager

We go in the `**Module**` class and see how we can add a new listener to the Event Manager.

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

use CoffeeBar\Service\TabAggregate;

class Module
{
  public function getConfig() //

  public function getAutoloaderConfig() //

  public function onBootstrap(MvcEvent $event)
  {
    // this line should already be there
    $sm = $event->getApplication()->getServiceManager() ;

    // get the Event Manager in the Service Manager
    $em = $sm->get('TabEventManager');

    // attach the TabAggregate listener to the Event Manager
    // do not forget to add the TabAggregate service to the Service Manager
    $em->attachAggregate($sm->get('TabAggregate')) ;

    // because we use EventManager::attachAggregate() 
    // and attach the TabAggregate listener to the TabEventManager event manager
    // we automatically inject the TabEventManager as an argument to the TabAggregate::attach() method
    // thanks to the ListenerAggregateInterface interface
  }

  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'TabAggregate' => function($sm) {
          // key of our customized Event Manager
          $events = $sm->get('TabEventManager') ;

          // key of the Cache service in the Service Manager
          $cache = $sm->get('TabCache') ;
          $tab = new TabAggregate() ;

          // setting the Event Manager in the TabAggregate
          // mandatory to trigger events
          $tab->setEventManager($events) ;
          $tab->setCache($cache) ;

          return $tab ;
        },
      ),
    ) ;
  }
}
```

Well. We have now a proper service where we can trigger events (`**EventManagerAwareInterface**`), listen to events (`**ListenerAggregateInterface**`) and load and store datas into a proper cache, we can run our scenarii.

**NOTE :**

On the **Event Manager** (`**Zend\EventManager\EventManager**`), there is a `EventManager::attach()` method and a `EventManager::attachAggregate()` method.

The `EventManager::attach()` method links the **Event Manager object**, an **event**, and a **listener and its callback**. If a listener need to listen to multiple events, we will have to repeat in our Event Manager the `EventManager::attach()` method, one for each event to attach. If there's more than one listener, so we will have to do it for each listeners. Which will turn out to be quite cumbersome.

The `EventManager::attachAggregate()` method links the **Event Manager object** and an **object which is implementing the ListenerAggregateInterface** interface. This allow, like here, to attach **listeners** only, no matter how many events they are listening to. The list of events they are listening to are attached within each listeners. It is easier to group the events by listeners.

Maybe there's more applications to the `EventManager::attachAggregate()` method but this one is already truly convenient.

### See the tab history from the cache

To 'spy' our tabs stored in the cache, let's go back to the view : `module/CoffeeBar/view/coffee-bar/index/index.phtml`. We had put two `var_dump()` to see what's inside the '*openTabs*' key and the '*todoList*' key from the cache. Now let's add the tab histories.

```php
// module/CoffeeBar/view/coffee-bar/index/index.phtml

// ajouter le code suivant
<pre>
<?php
  foreach($result->getOpenTabs() as $k => $v)
  {
    var_dump(unserialize($result->getItem($k))) ;
  }
?>
</pre>
```

Since we rely on the '*openTabs*' cache key to dump each one of our tab story, we need to add open tabs to the '*openTabs*' cache key.

## Open a tab

We have triggered (when the form has been valid) an '*openTab*' event. Our**TabAggregate** service will listen to this event and trigger another one : the '*tabOpened*' event. (which should be the real event, remember ?)

```php
use CoffeeBar\Event\TabOpened;

class TabAggregate
{
  public function attach(EventManagerInterface $events)
  {
    // if the event 'openTab' is triggered, the TabAggregate::onOpenTab() method is called
    $this->listeners[] = $events->attach('openTab', array($this, 'onOpenTab'));
  }

  // when  we trigger an 'openTab' event, we create an object $events 
  // which is automatically passed as parameters to the callback (onOpenTab()).
  // the $events object is composed with the name of the event (openTab), its target and an array as parameter.
  // we will fill the parameter array with all useful informations
  // and we will be able to get those datas using $events->getParam('array_key')
  public function onOpenTab($events)
  {
    // object type : CoffeeBar\Command\OpenTab
    $openTab = $events->getParam('openTab') ;
 
    // from the OpenTab object, we instanciate the CoffeeBar\Event\TabOpened event object
    $openedTab = new TabOpened() ; //  do not forget to update your use keywords
    $openedTab->setId($openTab->getId()) ;
    $openedTab->setTableNumber($openTab->getTableNumber()) ;
    $openedTab->setWaiter($openTab->getWaiter()) ;

    // triggering the tabOpened
    // note that we have sent an CoffeeBar\Event\TabOpened object in the parameter array of the event object.
    $this->events->trigger('tabOpened', $this, array('tabOpened' => $openedTab)) ;
  }
}
```

After managing the '*openTab*' event, we will now manage the '*tabOpened*' event, still in the **TabAggregate** service. Add the following code to the previous one.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
class TabAggregate
{
  public function attach(EventManagerInterface $events)
  {
    // if the 'tabOpened' event is triggered, the TabAggregate::onTabOpened() method is called
    $this->listeners[] = $events->attach('tabOpened', array($this, 'onTabOpened'));
  }

  public function onTabOpened($events)
  {
    // $tabOpened type is CoffeeBar\Event\TabOpened
    $tabOpened = $events->getParam('tabOpened') ;

    // loading the history of the tab with its unique id
    // as it is the very first loading, 
    // the TabAggregate::loadStory will instanciate a new TabStory($id) object
    $story = $this->loadStory($tabOpened->getId()) ;
    $story->openTab() ;

    $this->saveStory($tabOpened->getId(), $story) ;
  }
}
```

Our tab is finally opened. Let's see how, with the '*tabOpened*' event, we can use our opened tabs list (remember remember, the 'openTabs' key in our cache...)


*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
