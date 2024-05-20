---
title: "CoffeeBar Application 7/19 - Managing opened tabs"
permalink: "en/posts/coffeebar-application-719-managing-opened-tabs.html"
date: "2015-02-12T19:38"
slug: coffeebar-application-719-managing-opened-tabs
layout: post
drupal_uuid: f96f38d4-945e-40b9-901e-841958f71d7b
drupal_nid: 109
lang: en
author: haclong

book:
  book: manage-coffeebar-event-driven-programming
  rank: 7,
  top: 
    url: /en/books/manage-coffeebar-event-driven-programming.html
    title: Manage a coffeebar with event driven programming
  next: 
    url: /en/posts/coffeebar-application-819-displaying-active-tabs.html
    title: CoffeeBar Application 8/19 - Displaying active tabs
  previous:
    url: /en/posts/coffeebar-application-619-listener-manager-tab-and-its-history.html
    title: CoffeeBar Application 6/19 - A listener to manager the tab and its history

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "events"
  - "helpers"

sites:
  - "Développement"

summary: "We have created previously a service responsible of managing the story of one tab only. Now, we will create a service bound to manage all the opened tabs. This new service will store the list of opened tabs and will list all the tabs status for the usage of the staff."
---

We have created previously a service responsible of managing the story of one tab only. Now, we will create a service bound to manage all the opened tabs. This new service will store the list of opened tabs and will list all the tabs status for the usage of the staff.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

## The OpenTabs service

The **OpenTabs** service will listen to different events which is triggered on tab(s). For doing so, it needs to implement the `**Zend\EventManager\ListenerAggregateInterface**` interface and, for each event, we will have a callback method to call when an event is triggered. You'll notice that our **OpenTabs** service will *listen only on Event objects* (**`CoffeeBar\Event\*`**) and not on Command object at all (**`CoffeeBar\Command\*`**).

On the contrary of the **TabAggregate** service which is loading one `**CoffeeBar\Entity\TabStory\TabStory**` object from the cache for each opened tab, the **OpenTabs** service will manipulate one and only one `**CoffeeBar\Entity\OpenTabs\TodoByTab**` object, stored in the '*openTabs*' cache key. The `**CoffeeBar\Entity\OpenTabs\TodoByTab**` object extends the `**\ArrayObject**`. (<a href="/en/content/coffeebar-application-219-install-framework.html" target="_blank">see the cache installation</a>)

Let's put all this in our** Service Manager**. We already know we need to declare the **OpenTabs** service must be declared as a listener into our customized **Event Manager**. We will do this attachment in the `Module::onBootstrap()` method.

The **OpenTabs** service - as far as we know - will not trigger any events. Therefore, there's no dependency on the **Event Manager**. On the other hand, the service is using (loading and storing) datas from the '*openTabs*' key in the cache : we know there's a dependency on the cache **TabCacheService**. Remember our cache service key in the **Service Manager** is '*TabCache*'.

```php
// module/CoffeeBar/Module

namespace CoffeeBar;
use CoffeeBar\Service\OpenTabs;

class Module
{
  // other methods

  public function onBootstrap(MvcEvent $event)
  {
    // this line should already be here
    $sm = $event->getApplication()->getServiceManager() ;

    // this line should already be here
    $em = $sm->get('TabEventManager');

    // injecting the Event Manager (TabEventManager)
    // in the OpenTabs::attach() method
    // thanks to the ListenerAggregateInterface interface
    $em->attachAggregate($sm->get('OpenTabs')) ;
  }

  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'OpenTabs' => function($sm) {
          $cache = $sm->get('TabCache') ;
          $openTabs = new OpenTabs() ;
          $openTabs->setCache($cache) ;

          return $openTabs ;
        },
      ),
    ) ;
  }
}
```

Now that our services are set, let's take a look at the `**CoffeeBar\Service\OpenTabs**` class.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Entity\OpenTabs\ItemsArray;
use CoffeeBar\Entity\OpenTabs\Tab;
use Zend\EventManager\EventManagerInterface;
use Zend\EventManager\ListenerAggregateInterface;

class OpenTabs implements ListenerAggregateInterface
{
  protected $todoByTab ; // TodoByTab (opened tabs list / extending ArrayObject)
  protected $cache ;
  protected $listeners ;
 
  // mandatory methods if we implements ListenerAggregateInterface
  // the $events parameters is injected automatically when we attach the OpenTabs service to the Event Manager
  // this mechanics is available thanks to the ListenerAggregateInterface interface.
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('tabOpened', array($this, 'onTabOpened'));
  }

  public function detach(EventManagerInterface $events)
  {
    foreach ($this->listeners as $index => $listener) {
      if ($events->detach($listener)) {
        unset($this->listeners[$index]);
      }
    }
  }
 
  // injecting the cache
  public function setCache($cache)
  {
    $this->cache = $cache ;
  }

  public function getCache()
  {
    return $this->cache ;
  }
 
  // loading the 'openTabs' item from the cache
  protected function loadTodoByTab()
  {
    $this->todoByTab = $this->cache->getOpenTabs() ;
  }

  // storing the datas in the 'openTabs' item in the cache
  protected function saveTodoByTab()
  {
    // remember, no object allowed
    $this->cache->saveOpenTabs(serialize($this->todoByTab)) ;
  }

  /**
   * Listener to tabOpened event
   * @param Events $events
   */
  public function onTabOpened($events)
  {
    // $tabOpened = CoffeeBar\Event\TabOpened
    $tabOpened = $events->getParam('tabOpened') ;

    // loading TodoByTab object from the cache
    $this->loadTodoByTab() ;
 
    // instanciate a new CoffeeBar\Entity\OpenTabs\Tab object
    $tab = new Tab($tabOpened->getTableNumber(), $tabOpened->getWaiter(), new ItemsArray(), new ItemsArray(), new ItemsArray()) ;
    // adding the new Tab object into the TodoByTab object
    // notice the key is the unique id from the TabOpened object
    $this->todoByTab->offsetSet($tabOpened->getId(), $tab) ;
    // store the TodoBytab object back into the cache with the Tab object inside
    $this->saveTodoByTab() ;
  }
}
```

Remember : the '*openTabs*' key in the cache store a `**CoffeeBar\Entity\OpenTabs\TodoByTab**` object.

When we do `OpenTabs::loadTodoByTab()`, we retrieve that `**CoffeeBar\Entity\OpenTabs\TodoByTab**` object. This one extends the `**\ArrayObject**` object.

Each iteration of `**CoffeeBar\Entity\OpenTabs\TodoByTab**` array is a `**CoffeeBar\Entity\OpenTabs\Tab**` object.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/OpenTabs/Tab.php

<?php
namespace CoffeeBar\Entity\OpenTabs ;

class Tab
{
  protected $tableNumber; // int 
  protected $waiter; // string 
  protected $itemsToServe; // ItemsArray - items to serve list
  protected $itemsInPreparation; // ItemsArray - items in preparation list
  protected $itemsServed; // ItemsArray - items served list
 
  public function __construct($tableNumber, $waiter, ItemsArray $itemsToServe, ItemsArray $itemsInPreparation, ItemsArray $itemsServed)
  {
    $this->setTableNumber($tableNumber) ;
    $this->setWaiter($waiter) ;
    $this->setItemsToServe($itemsToServe) ;
    $this->setItemsInPreparation($itemsInPreparation) ;
    $this->setItemsServed($itemsServed) ;
  }
 
  // getters &amp; setters
}
```

Since we're at it : let's look at `**CoffeeBar\Entity\OpenTabs\ItemsArray**`.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/OpenTabs/ItemsArray.php

namespace CoffeeBar\Entity\OpenTabs ;

use ArrayObject;

class ItemsArray extends ArrayObject
{
  public function addItem($item)
  {
    $this->offsetSet(NULL, $item) ;
  }
}
```

### To sum up

In the cache, we have an item '*openTabs*' which is a `**CoffeeBar\Entity\OpenTabs\TodoByTab**` object, extending the `**\ArrayObject**` (behaving like an array, somehow). Each item of that array is a `**CoffeeBar\Entity\OpenTabs\Tab**` object with the **table number**, the **waiter name** and three lists : **list of items to serve**, **list of items in preparation** and **list of items served**. Each one of these lists are a `**CoffeeBar\Entity\OpenTabs\ItemsArray**` object and extends the `**\ArrayObject**`.

When we open a tab, we create a `**CoffeeBar\Entity\TabStory\TabStory**` object (thanks to the **TabAggregate** service) and we add an `**CoffeeBar\Entity\OpenTabs\Tab**` item in the `**CoffeeBar\Entity\OpenTabs\TodoByTab**` list (thanks to the **OpenTabs** service)

*I should apologize for the names which are really confusing sometimes. I have not taken time to rearrange the names of the entities. The .Net framework allow to use 'shortcuts' therefore, less objects than in PHP. I had to improvise.*

## Checking if the table is available

Since we have at last the list of opened tab (therefore, unavailable tables), we can check - right before opening a tab - that the table number is still available.

Let's get the list of active tables first.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

class OpenTabs
{
  /**
   * Return the list of tables with a tab on it
   * @return array
   */
  public function activeTableNumbers()
  {
    $this->loadTodoByTab() ;
    $array = array() ;
    foreach($this->todoByTab->getArrayCopy() as $k => $v)
    {
      $array[] = $v->getTableNumber() ;
    }

    return sort($array) ;
  }
}
```

Now check if the table is available.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

class OpenTabs
{
  /**
   * Return a boolean either the table is active or not
   * @param int $id - table number
   */
  public function isTableActive($id)
  {
    if(in_array($id, $this->activeTableNumbers()))
    {
      return TRUE ;
    } else {
      return FALSE ;
    }
  }
}
```

Let's use that method in the controller, right before opening the tab.

I have thought a lot about that part.

I wanted to put the check into the `**CoffeeBar\Command\OpenTab**`, blocking the triggering of the event if the table wasn't available but then, i would have to manage a dependency between the `** CoffeeBar\Command\OpenTab**` object and the **`CoffeeBar\Service\OpenTabs`** service.

Then i thought i would be better to put the check within the `**CoffeeBar\Service\TabAggregate**` service. So i can block the triggering of the '*tabOpened*' event but here again, i'll create a dependency between both services : `**CoffeeBar\Service\TabAggregate**`and **`CoffeeBar\Service\OpenTabs`**. Beside, the status of the table has nothing to do with the history of a tab (since it is something happening BEFORE the history of the tab).

Finally, i thought that putting the control at the controller lever has a meaning, since the controller can easily access to Service Manager and procecssing of the form.

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

use CoffeeBar\Exception\TableNumberUnavailable;
use Zend\Mvc\Controller\AbstractActionController;

class TabController extends AbstractActionController
{
  public function openAction()
  {
    $form = $this->serviceLocator->get('OpenTabForm') ;
    $request = $this->getRequest() ;

    if($request->isPost()) 
    {
      $form->setData($request->getPost()) ;
 
      $posted = $request->getPost() ;

      $openTabs = $this->serviceLocator->get('OpenTabs') ;

      try {
        if($openTabs->isTableActive($posted['tableNumber'])) {
          throw new TableNumberUnavailable('Tab is already opened') ;
        }
      } catch (TableNumberUnavailable $e) {
        $this->flashMessenger()->addErrorMessage($e->getMessage());
        return $this->redirect()->toRoute('tab/open');
      }
 
      if($form->isValid()) {
        $openTab = $form->getObject() ;
        return $this->redirect()->toRoute('tab/order', array('id' => $openTab->getTableNumber()));
      }
    }

    $result['form'] = $form ;
    return array('result' => $result) ;
  }
}
```

The exception `**CoffeeBar\Exception\TableNumberUnavailable**` extends the `**\Exception**` class.

```php
// module/CoffeeBar/src/CoffeeBar/Exception/TableNumberUnavailable.php

namespace CoffeeBar\Exception ;

use Exception;

class TableNumberUnavailable extends Exception {}
```

The exception caught is send to the screen thanks to the **action helpers** '`flashMessenger()`'. To display the message to the browser, in the view, please use the dedicated **view helper**.

```php
// module/Application/view/layout/layout.phtml

... html divers

<div class="container">
  <?php echo $this->flashMessenger()->render('error'); ?>
  <?php echo $this->content; ?>
...
```

The structure of our application is modelling slowly but surely.

We have now

- a **MVC architecture** to structure our application
- a **cache** to manage the data persistence layer (but of course, for long time application, you'll have to manage a real persistence data layer)
- an **Event Manager** to manage events triggered and listeners for those events.
- a **Service Manager** to manage dependencies between objects and services.
- a **TabAggregate** service which manages logic for one single tab and triggers events when command events are triggered.
- an **OpenTabs** service which listens to events triggered on a tab and manages the logic for many opened tabs.

The MVC architecture, cache, Event Manager, Service Manager are genuine components of the Zend Framework Application.

Let's go to our next chapter and build some pages.

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
