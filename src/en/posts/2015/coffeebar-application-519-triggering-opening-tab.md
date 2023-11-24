---
title: "CoffeeBar Application 5/19 - Triggering the opening of a tab"
permalink: "en/posts/coffeebar-application-519-triggering-opening-tab.html"
date: "2015-01-28T19:35"
slug: coffeebar-application-519-triggering-opening-tab
layout: post
drupal_uuid: 8ee97055-fe76-485b-916b-e07062ecd3d6
drupal_nid: 107
lang: en
author: haclong

book:
  book: manage-coffeebar-event-driven-programming
  rank: 5,
  top: 
    url: /en/books/manage-coffeebar-event-driven-programming.html
    title: Manage a coffeebar with event driven programming
  next: 
    url: /en/posts/coffeebar-application-619-listener-manager-tab-and-its-history.html
    title: CoffeeBar Application 6/19 - A listener to manager the tab and its history
  previous:
    url: /en/posts/coffeebar-application-419-open-tab-form.html
    title: CoffeeBar Application 4/19 - The Open Tab Form

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "events"
  - "Service Manager"
  - "hydrator"
  - "Event Manager"

sites:
  - "Développement"

summary: "Once we have created a form - which open a tab, we will assign an object to it and use that object while processing the form. We will see how this object will trigger our very first event, the starting point of our application.
"
---

Once we have created a form - which open a tab, we will assign an object to it and use that object while processing the form. We will see how this object will trigger our very first event, the starting point of our application.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

## The TabOpened event

All the scenarii start when a tab is opened (`**CoffeeBar\Event\TabOpened**`). Once a tab is opened, we can identify it by **its unique id**, its **table number** and the **name of the waiter** who is serving the table.

```php
// module/CoffeeBar/src/CoffeeBar/Event/TabOpened.php

namespace CoffeeBar\Event ;

class TabOpened
{
  protected $id ; // string (guid)
  protected $tableNumber ; // string (table number)
  protected $waiter ; // string (waiter's name)

 // getters &amp; setters
}
```

## The associated command : OpenTab

For a tab to be opened, we need a command which is actually opening the tab : `**CoffeeBar\Command\OpenTab**`.

```php
// module/CoffeeBar/src/CoffeeBar/Command/OpenTab.php

namespace CoffeeBar\Command ;

class OpenTab
{
  protected $id ; // string (guid)
  protected $tableNumber ; // string (table number)
  protected $waiter ; // string (name of the waiter)
  // the ‘OpenTab’ object trigger an event ‘openTab’

  // getters &amp; setters
}
```

## The Event Manager

In the original tutorial, the commands are managed by a common manager. When a command is instanciated, the manager handles the command and then triggers the associated event. With Zend Framework 2, there's no such thing as handle an object and trigger an event. All in all, handling a command or triggering an event IS in the end triggering an event, though the event is named after a command or after an event.

Throughout the whole tutorial, we will have events (as handled by the Event Manager) and Event (as object of namespace **`Coffee\Event\*`**. A command object (**`Coffee\Command\*`**) will trigger an event (as handed in the event Manager) while an event object (<span style="color:#a52a2a;"><code>**Coffee\Event\***</code></span>), associated with the command, will ALSO trigger an event. We will then have a command `**CoffeeBar\Command\OpenTab**` which will trigger an event '*openTab*' and once the '*openTab*' event will be handled, it will instanciate a `**CoffeeBar\Event\TabOpened**` event object which will trigger a '*tabOpened*' event. Please note the font styles (objects are in red color with first upper case while events are in lower case, in italic). I'll do my best not to be too confused but, though it feels clear in my head, i don't know if i'll be able to be so clear here.

When we speak about events, we need to put an <a href="http://framework.zend.com/manual/current/en/modules/zend.event-manager.event-manager.html" target="_blank">**Event Manager**</a> in place. By default, the Zend Framework 2 Application (*this is a very very ugly shortcut : i am of course talking about the Zend Framework Application Skeletton which is based on the Zend Framework 2 library. Zend Framework 2 is not at all an application*) does include a shipped **Event Manager**, anonymously. For our needs, we will need to create a **customized Event Manager**, based on the one created by the application.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabEventManager.php

<?php
namespace CoffeeBar\Service ;

use Zend\EventManager\EventManager;

class TabEventManager extends EventManager
{
}
```

Voila. That's simple. Frankly speaking, apart from giving it a name, we didn't do anything else.

But don't forget to add it in our **Service Manager**.

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

class Module implements FormElementProviderInterface
{

  ...

  public function getServiceConfig()
  {
    return array(
      'invokables' => array(
        'TabEventManager' => 'CoffeeBar\Service\TabEventManager',
      ),
    ) ;
  }
}
```

The **Event Manager** has an `EventManager::trigger('event_name', 'target', 'params')` method. When the `EventManager::trigger()` is called, an `event_name` event is fired into the Event Manager.

The **Event Manager** has an `EventManager::attach('event_name', 'callback')`. When an `event_name` event is triggered, the '`callback`' method is run.

In any cases, it is mandatory to have access to the Event Manager : either for triggering the event or answering to it.

## Triggering an event

Let's see now how our `**CoffeeBar\Command\OpenTab**` will trigger the '*openTab*' event into the **Event Manager**.

We just stated that there's a dependency for the `**CoffeeBar\Command\OpenTab**` on the **Event Manager** to be able to trigger the '*openTab*' event.

```php
// module/CoffeeBar/src/CoffeeBar/Command/OpenTab.php

namespace CoffeeBar\Command ;

use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

// OpenTab trigger an event. It is mandatory that it has 
// access to an Event Manager
class OpenTab implements EventManagerAwareInterface
{
  // property linked to the EventManagerAwareInterface
  protected $events ;

  // mandatory method with the EventManagerAwareInterface
  // we will inject the Event Manager with this method
  public function setEventManager(EventManagerInterface $events)
  {
    $this->events = $events;
    return $this;
  }
 
  // mandatory method with the EventManagerAwareInterface
  public function getEventManager()
  {
    return $this->events;
  }
}>
```

Once the `**CoffeeBar\Command\OpenTab**` object has an object extending `**Zend\EventManager\EventManager**`, we will be able to trigger an event.

**Using a dedicated method**

We could use a `triggerMe()` customized method but then, we need to call that method to trigger the event.

**Automatically trigger the event in the constructor of the object**

I wished the object to trigger the event the most seamlessly possible so the constructor could have been an answer but since all the objects are constructed in the Service Manager, the event will be triggered when the Service Manager will load, and not when the object being invoked.

**Automatically trigger the event once the object datas are properly 'assigned'**

Finally, as the `**CoffeeBar\Command\OpenTab**` object will be properly defined once the form will be validated, the best answer is to trigger the event once the object is hydrated. Among all the <a href="http://framework.zend.com/manual/current/en/modules/zend.stdlib.hydrator.html" target="_blank">**available hydrators**</a> in Zend Framework 2, only the `**Zend\Stdlib\Hydrator\ArraySerializable**` hydrator uses mandatory methods. The other hydrators uses the getters and setters of the object or the public properties of the object.

```php
// module/CoffeeBar/src/CoffeeBar/Command/OpenTab.php

namespace CoffeeBar\Command ;

use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

// OpenTab trigger an event. It is mandatory that it has 
// access to an Event Manager
class OpenTab implements EventManagerAwareInterface
{
  // other methods

  // the populate() method is mandatory if we wish to use the ArraySerializable() hydrator
  // And the ArraySerializable hydrator is the only one hydrator allowing us
  // to hydrate an object with customized methods
  // And we need to have a customized method to allow us to
  // trigger the event when we are hydrating the object...
  public function populate($data = array())
  {
    // hydrating the object
    $this->id = (isset($data['id'])) ? $data['id'] : null;
    $this->tableNumber = (isset($data['tableNumber'])) ? $data['tableNumber'] : null;
    $this->waiter = (isset($data['waiter'])) ? $data['waiter'] : null;

    // triggering the event
    $this->events->trigger('openTab', '', array('openTab' => $this)) ;
  }

  // the getArrayCopy() method is mandatory if we wish to use the ArraySerializable() hydrator
  public function getArrayCopy() 
  {
    return array(
      'id' => $this->id,
      'tableNumber' => $this->tableNumber,
      'waiter' => $this->waiter,
    ) ;
  }
}
```

Let's see how we can put all this together in the Service Manager.

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

use CoffeeBar\Command\OpenTab;
use Zend\Stdlib\Hydrator\ArraySerializable;

class Module
{
  public function getConfig() {...}

  public function getAutoloaderConfig() {...}
 
  // loading the Service Manager
  public function getServiceConfig()
  {
    return array(
      'factories' => array(

        // the OpenTabForm with the setObject() method
        'OpenTabForm' => function($sm) {

          // because the OpenTabForm use a customized form element
          // we need to use $this->serviceLocator->get('FormElementManager') ;
          // and call the form from the Form Element Manager
          $formManager = $sm->get('FormElementManager') ;
          $form = $formManager->get('CoffeeBar\Form\OpenTabForm') ;

          // OpenTabCommand : key in the Serviec Manager
          $form->setObject($sm->get('OpenTabCommand')) ;

          // we can actually add the hydrator straight 
          // into the CoffeeBar/Form/OpenTabForm.php file
          $form->setHydrator(new ArraySerializable()) ;
          
          return $form ;
        },

        'OpenTabCommand' => function($sm) {
          $eventsManager = $sm->get('TabEventManager') ;
          $openTab = new OpenTab() ;

          // inject the Event Manager into the OpenTab command
          $openTab->setEventManager($eventsManager) ;

          return $openTab ;
        },
      ),
    ) ;
  }
}
```

## The controller

At last, the controller, and how to process the valid form.

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

use Zend\Mvc\Controller\AbstractActionController;

class TabController extends AbstractActionController
{
  public function openAction()
  {
    // get the form in the Service Manager
    $form = $this->serviceLocator->get('OpenTabForm') ;
    $request = $this->getRequest() ;

    // form has been posted
    if($request->isPost()) {
      // assign $_POST datas into the form
      $form->setData($request->getPost()) ;
 
      // form is valid, hydrate the object (OpenTab)
      if($form->isValid()) {
        $openTab = $form->getObject() ;

        // redirect to the order page form
        // note the table number sent to the route as param
        return $this->redirect()->toRoute('tab/order', array('id' => $openTab->getTableNumber()));
      }
    }

    $result['form'] = $form ;
    return array('result' => $result) ;
  }
}
```

Once the form is valid, we will map the datas from `**CoffeeBar\Form\OpenTabForm**` form on the `**CoffeeBar\Command\OpenTab**` command. When we **are hydrating** the object, the '*openTab*' event will be triggered. Stay around !! In my next chapter, we will talk about who and how we will caught the '*openTab*' event.

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
