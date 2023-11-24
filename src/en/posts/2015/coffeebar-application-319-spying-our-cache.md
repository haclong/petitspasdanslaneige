---
title: "CoffeeBar Application 3/19 - Spying on our cache"
permalink: "en/posts/coffeebar-application-319-spying-our-cache.html"
date: "2015-01-14T18:41"
slug: coffeebar-application-319-spying-our-cache
layout: post
drupal_uuid: 17e5ec1c-512c-4db2-be9c-67e5385de0f4
drupal_nid: 105
lang: en
author: haclong

book:
  book: manage-coffeebar-event-driven-programming
  rank: 3,
  top: 
    url: /en/books/manage-coffeebar-event-driven-programming.html
    title: Manage a coffeebar with event driven programming
  next: 
    url: /en/posts/coffeebar-application-419-open-tab-form.html
    title: CoffeeBar Application 4/19 - The Open Tab Form
  previous:
    url: /en/posts/coffeebar-application-219-install-framework.html
    title: CoffeeBar Application 2/19 - Install the framework

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "MVC"
  - "Zend Navigation"
  - "Zend Router"

sites:
  - "Développement"

summary: "There are tutorials which are starting explaining the thing and then showing the first views after several chapters. Since i didn't know how to organize this one, i started to put the logic first then the views afterward. But i find it too frustrating to have to wait for the end of the tutorial to see what's happening. And truth is, in the real world, i need to see what is happening anyway."
---

There are tutorials which are starting explaining the thing and then showing the first views after several chapters. Since i didn't know how to organize this one, i started to put the logic first then the views afterward. But i find it too frustrating to have to wait for the end of the tutorial to see what's happening. And truth is, in the real world, i need to see what is happening anyway.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item*.

## Spying on our cache

This does not belong to the application but it can be useful throughout the development of it. A kind of debugging. We will prepare a page to flush (empty) the cache and another one to check what's inside both keys '*openTabs*' and '*todoList*'.

### The controlleur

I take the **`IndexController`**... Which wasn't a wise idea but... wasn't thinking much here :p.

```php
// module/CoffeeBar/src/CoffeeBar/Controller/IndexController.php

<?php
namespace CoffeeBar\Controller ;

use Zend\Mvc\Controller\AbstractActionController;

class IndexController extends AbstractActionController
{
  public function indexAction()
  {
    // get the cache
    $cache = $this->serviceLocator->get('TabCache');

    // send all the content of the cache to the view
    return array('result' => $cache) ;
  }

  public function flushAction()
  {
    // get the cache
    $cache = $this->serviceLocator->get('Cache\Persistence') ;

    // flush the cache
    $cache->flush() ;

    // redirect to the 'home' route = home page
    return $this->redirect()->toRoute('home') ;
  }
}
```

### The view

The `IndexController::flushAction()` does not have a view. Which leave us with only one view to prepare, for the `IndexController::indexAction()`.

**Please note the view path is entirely in lower case and any camelCase name (such as CoffeeBar) is translated into dash (-) separated words. This is a particularity of Zend Framework 2 framework... just don't ask...**

```php
// module/CoffeeBar/view/coffee-bar/index/index.phtml

<?php
var_dump($result->getTodoList()) ;

var_dump($result->getOpenTabs()) ;
?>
```

That's all... we don't pretend to do something nice here.

### Route and navigation

Before setting up our routes, it is mandatory to declare our controller within the **configuration** array.

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'controllers' => array(
    'invokables' => array(
      // the name => the component
      'CoffeeBarController\Index' => 'CoffeeBar\Controller\IndexController',
    ),
  ),
 
  // ... // other keys...
);
```

Setting **routes** up.

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'router' => array(
    'routes' => array(
      /**
       * here we override the default 'home' route which is defined in the Application module
       * See /module/Application/config/module.config.php
       * this URL http://coffeebar.home/ leads us to the following route
       */
      'home' => array(
        'type' => 'Literal',
        'options' => array(
          'route' => '/',
          'defaults' => array(
            'controller' => 'CoffeeBarController\Index',
            'action' => 'index',
          ),
        ),
        'may_terminate' => true,
      ),

      /**
       * this URL : http://coffeebar.home/flush leads to the following route
       */
      'flush' => array(
        'type' => 'Literal',
        'options' => array(
          'route' => '/flush',
          'defaults' => array(
            'controller' => 'CoffeeBarController\Index',
            'action' => 'flush',
          ),
        ),
      ),
    ),
  ),
) ;
```

A **navigation**

We want it to be nice (this part we do want it nice), we will add a navigation. This will allow us to build the hierarchy of our pages easily.

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'navigation' => array(
    'default' => array(
      array(
        'label' => 'Home',
        'route' => 'home',
      ),
      array(
        'label' => 'Flush cache',
        'route' => 'flush',
      ),
    ),
  ),

  // ... // others keys and arrays...
);
```

The navigation is not in the default **Zend Framework 2 Skeletton Application**. If you want to add a navigation in your application, please <a href="/en/content/creating-menu-zend-navigation.html">refer to my post on that matter</a>. To be sure, here is what you have to do (please, check again...) :

```php
// module/Application/view/layout/layout.phtml

// replace the menu on the original layout with this code
<div class="collapse nav-collapse">
  <?php echo $this->navigation('navigation')->menu()->setUlClass('nav navbar-nav')->setMaxDepth(0) ;?>
</div>
```

```php
// module/Application/config/module.config.php

// add following keys
'service_manager' => array(
  'factories' => array(
    'navigation' => 'Zend\Navigation\Service\DefaultNavigationFactory',
  ),
),
```

Once our little spies are set, we can focus on our (real) first page.

## Our very first page : Open a tab

### The controller

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

use Zend\Mvc\Controller\AbstractActionController;

class TabController extends AbstractActionController
{
  public function openAction()
  {
    $result = '' ;
    return array('result' => $result) ;
  }
}
```

Add the controller to the configuration

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'controllers' => array(
    'invokables' => array(

      // other keys...
      'CoffeeBarController\Tab' => 'CoffeeBar\Controller\TabController',
    ),
  ),
 
  // ... // other keys...
);
```

### The route

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'router' => array(
    'routes' => array(

      // to add to other routes
      'tab' => array(
        /**
         * this route does not match to any pages
         * pay attention to the absence of 'defaults' key
         * because there's no valid pages at this URL http://coffeebar.home/tab
         * this url return a 404 error page
         * you can define a default controller and a default action
         * to avoid the 404 error
         */
        'type' => 'Literal',
        'options' => array(
          'route' => '/tab',
        ),
        'child_routes' => array(
          /**
           * this URL : http://coffeebar.com/tab/open leads to the following route
           */
          'open' => array(
            'type' => 'Literal',
            'options' => array(
              'route' => '/open',
              'defaults' => array(
                'controller' => 'CoffeeBarController\Tab',
                'action' => 'open',
              ),
            ),
            'may_terminate' => true,
          ),
        ),
      ),
    ),
  ),
) ;
```

### The navigation

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'navigation' => array(
    'default' => array(

      // add to other keys
      array(
        'label' => 'Open new tab',
        'route' => 'tab/open', // use keys of the router
      ),
    ),
  ),
) ;
```

### The view

```php
// module/CoffeeBar/view/coffee-bar/tab/open.phtml

<?php echo __FILE__ ; ?></pre>
```

Et voila.

If everything is fine and if i have not forgotten anything here, when you'll go to that url : `http://coffeebar.com/tab/open`, you'll see a page with the path of the file printed on screen : `path/to/module/CoffeeBar/view/coffee-bar/tab/open.phtml`.

In our next chapter, we will build the '**Open tab**' page.


*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
