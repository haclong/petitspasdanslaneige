---
title: "CoffeeBar Application 2/19 - Install the framework"
permalink: "en/posts/coffeebar-application-219-install-framework.html"
date: "2014-12-29T18:37"
slug: coffeebar-application-219-install-framework
layout: post
drupal_uuid: 1a7e39f7-9cd5-4094-a77a-2e48e36a3afd
drupal_nid: 99
lang: en
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "MVC"
  - "Zend Cache"

sites:
  - "Développement"

summary: "To start with our coffeebar application, let's start by installing our framework first. We will work with Zend Framework 2. This framework allows us to build nice web applications using the MVC architecture and when running, the application will launch automatically a bunch of managers : Service manager, Event manager, Form elements manager which will be very useful in our case."
---

To start with our coffeebar application, let's start by installing our framework first. We will work with Zend Framework 2. This framework allows us to build nice web applications using the MVC architecture and when running, the application will launch automatically a bunch of managers : Service manager, Event manager, Form elements manager which will be very useful in our case.


I want to add that all other good PHP frameworks do have the same functionnalities. I choose ZF2 because i'm more familiar with this one. You are invited to port this tutorial to your favorite framework if you wish it...

### Prerequisite

- Install <a href="http://framework.zend.com/manual/2.3/en/user-guide/skeleton- application.html" target="_blank">Zend Framework Skeleton Application</a>.
- Create a new **CoffeeBar** module. You'll find all documentation on <a href="http://framework.zend.com/manual/2.3/en/user-guide/modules.html" target="_blank">Zend Framework documentation pages</a>.
- Of course, do not forget to enable your module in `config/application.config.php`
- Create the `module/CoffeeBar/Module.php` file with this content only (for a start) :

```php
<?php
namespace CoffeeBar ;

class Module
{
  public function getAutoloaderConfig()
  {
    return array(
      'Zend\Loader\StandardAutoloader' => array(
        'namespaces' => array(
 __       NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
        ),
      ),
    ) ;
  }

  public function getConfig()
  {
    return include __DIR__ . '/config/module.config.php' ;
  }
}
```

- Create the `module/CoffeeBar/config/module.config.php` file with this content only for a start :

```php
<?php
return array() ;
```

Check the site still working. (there's not reason whatsoever that it won't work anymore but...)

### Data persistence layer

We will need a place where to store all the datas about our opened tabs. Somewhere to store and load the datas.

Because the exercise is meant to be short, we will use the cache only. First, this will allow us to get use to it and, on the other hand, i don't feel setting up a database just for a small exercise.

Hopefully, though it took me more time than expected, i finally get to understand this <a href="http://www.masterzendframework.com/servicemanager/storage-cache-abstract-service-factory-easy-cache-configuration" target="_blank">tutorial</a> found on the web about the cache in Zend Framework. Once it is understood, it is, as for the rest of the framework, easy peasy.

#### The cache already set in the application skeleton

The **Zend Framework Application (Skeleton)** has an `abstract factory` already set for the cache usage. All you need to do is to configure the cache and use it. The tutorial of ***Matthew Setter*** propose to use a **Redis** service (which i don't have) and by default, use the filesystem. For our use, we will use the filesystem only...

Here is how the application skeleton set the abstract factory :

```php
// module/Application/config/module.config.php
<?php

return array(

  ...

  'service_manager' => array(
    'abstract_factories' => array(
      'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
    ),
  ),
);
```

To set the cache, you can choose to put the configuration wherever you prefer. Anywhere. As a reminder, the **Zend Framework Application** allow the configuration in all those following files :

- `config/application.config.php` (which will be commited and displayed for all)
- `config/autoload/(*.)global.php` (which will be commited and displayed for all)
- `config/autoload/(*.)local.php` (which won't be commited and not displayed for all)
- `module/*/config/module.config.php` (which will be commited and displayed for all)

You can create your own logic all between your configuration files. Here is how i see it :

- `config/application.config.php` will only be used for loading modules, configuring the path(s) where we can find our modules and the path(s) where we can find the configuration files.

- `module/*/config/module.config.php` hold the usual informations of the modules : views, controllers, services, routes, navigation... as much as possible, i'll keep the same keys from one file to the other one, so i won't have to look everywhere.

- last but not least, all the `config/autoload/*.php` files, used for configuring components or specific modules datas. You ought to know that you can create as many configuration files as you wish there : `db.local.php`, `cache.local.php`, `mail.global.php` etc...

We will use the plain `global.php` configuration file just because we will configure our cache within our filesystem : no password, no credentials, nothing to hide...

```php
// config/autoload/global.php
<?php

return array(
  'caches' => array(
    'Cache\Persistence' => array(
      'adapter' => 'filesystem',
      'ttl' => 86400,
      'options' => array(
        // if needed, change the access right (according to your server)
        // mod : 775 - owner : user:www-data
        'cache_dir' => __DIR__ . '/../../data/cache/',
      ),
    ),
  ),
);
```

We could use the cache straight away but since we will (surely) need to define customized methods, we will create a dedicated service.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabCacheService.php
<?php

namespace CoffeeBar\Service ;

class TabCacheService
{
  // protected properties and getters and setters define to access that property
  // therefore managing the dependencies.
  protected $cache ;
 
  public function getCache() {
    return $this->cache;
  }

  // i choose to inject the dependency through the constructor : 
  // this made the dependency mandatory and
  // ensure the service won't work without that dependency
  public function __construct($cache) {
    $this->cache = $cache;
  }
}
```

The cache will store

- the opened tabs list
- the chef todo list
- each tab individually, using their unique id.

For each of theses informations, we will create a key within our cache and prepare the methods to access to these keys.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabCacheService.php
<?php
namespace CoffeeBar\Service ;

use Zend\Cache\Exception\MissingKeyException;

class TabCacheService
{
  // all other methods

  // instanciate the key for the opened tabs list
  // key = 'openTabs'
  public function setOpenTabs($openTabs)
  {
    if($this->cache->hasItem('openTabs'))
    {
      return $this->cache->getItem('openTabs') ;
    } else {
      return $this->cache->setItem('openTabs', $openTabs) ;
    }
  }

  // get the opened tab list datas
  public function getOpenTabs()
  {
    try {
      return unserialize($this->cache->getItem('openTabs')) ;
    } catch (MissingKeyException $ex) {
      echo 'openTabs cache key missing' ;
    }
  }

  // store the opened tab list datas
  public function saveOpenTabs($openTabs)
  {
    return $this->cache->setItem('openTabs', $openTabs) ;
  }
 
  // instanciate the key for the chef todo list
  // key = 'todoList'
  public function setTodoList($todoList)
  {
    if($this->cache->hasItem('todoList'))
    {
      return $this->cache->getItem('todoList') ;
    } else {
      return $this->cache->setItem('todoList', $todoList) ;
    }
  }

  // get the chef todolist datas
  public function getTodoList()
  {
    try {
      return unserialize($this->cache->getItem('todoList')) ;
    } catch (MissingKeyException $ex) {
      echo 'todoList cache key missing' ;
    }
  }

  // store the chef todolist datas
  public function saveTodoList($todoList)
  {
    return $this->cache->setItem('todoList', $todoList) ;
  }

  // get an element from the cache through its key
  public function getItem($id)
  {
    return $this->cache->getItem($id) ;
  }

  // instanciate an element in the cache with its key
  public function setItem($id, $datas)
  {
    $this->cache->setItem($id, $datas) ;
  }

  // check if the element exists, through its key
  public function hasItem($id)
  {
    return $this->cache->hasItem($id) ;
  }
}
```

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

Let's load our cache service in the **Service Manager**. We will take that opportunity to instanciate both list keys at the **bootstrap** of the application.

```php
// module/CoffeeBar/Module.php

<?php

namespace CoffeeBar;

use ArrayObject;
use CoffeeBar\Entity\OpenTabs\TodoByTab;
use CoffeeBar\Service\TabCacheService;
use Zend\Mvc\MvcEvent;

class Module
{
  public function getConfig() //

  public function getAutoloaderConfig() //

  // onBootstrap method is loaded in the beginning of the application.
  // it ALWAYS gets a MVCEvent object as argument.
  public function onBootstrap(MvcEvent $event)
  {
    $sm = $event->getApplication()->getServiceManager() ;
    $cache = $sm->get('TabCache') ;

    // the cache store strings only. When dealing with objects, you need to serialize the object.
    $cache->setOpenTabs(serialize(new TodoByTab())) ;
    $cache->setTodoList(serialize(new ArrayObject())) ;
  }

  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'TabCache' => function($sm) {
          // use the key defined in the configuration for the cache
          $cacheService = $sm->get('Cache\Persistence') ;
          $tabCache = new TabCacheService($cacheService) ;
          return $tabCache ;
        },
      ),
    ) ;
  }
}
```

We load in each cache key an **\ArrayObject** object. For the **opened tabs list**, we will load a customized class which will inherits from **\ArrayObject** and for the **chef todo list**, we will use the **\ArrayObject** straight.

Let's get a quick look at our **CoffeeBar\Entity\OpenTabs\TodoByTab** class.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/OpenTabs/TodoByTab.php
<?php

namespace CoffeeBar\Entity\OpenTabs ;

use ArrayObject;

class TodoByTab extends ArrayObject {}
```

Of course, we could have use a simple **\ArrayObject** but i want to (try to) explain :

- The real advantage is : you can use <a href="http://fr2.php.net/manual/fr/language.oop5.typehinting.php" target="_blank">type hinting</a> when you have customized classes
- The true reason here : i didn't know, when i created that class, how i'll use it and what i'll need for it later on... So i decided to create a customized one, just in case. For the chef todo list, i have more clearer vizualisation of the architecture and i knew customized classes wasn't necessary at that point...

Please come back next chapter for our first page : setting up some route, some controller and some view...

*You can find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
