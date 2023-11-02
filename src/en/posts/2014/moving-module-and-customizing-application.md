---
title: "Moving the module and customizing the application"
permalink: "en/posts/moving-module-and-customizing-application.html"
date: "2014-02-02T17:44"
slug: moving-module-and-customizing-application
layout: post
drupal_uuid: 382ef798-f696-42aa-bd49-4ded954bf709
drupal_nid: 52
lang: en
author: haclong

media:
  path: /img/teaser/ZendFramework.png
  credit: "zend framework"

tags:
  - "zend framework 2"
  - "module"
  - "customization"
  - "psr-0"

sites:
  - "Développement"

summary: "There's something I can't deny... As much the solution provided is flexible, as much there will be at least one person who'll wish to bend it to his will... Here, I'm attempting to customize the path to my Module."

---

I just don't know why. Maybe i find it too easy ? Maybe building a module in the right module/ directory as intended by the Zend Framework team would be too much ? Maybe i was afraid my modules would be mistaken with somebody's else module ? Maybe i found prefixing my modules too easy to go.. Who can say ? But i decided yesterday that I want to customized the path to my module.

That should be easy. Anywhere on the web, they explain that Zend Framework 2 is <a href="http://www.php-fig.org/psr/psr-0/" target="_blank">PSR-0</a> compliant so moving a directory one level is peanuts... Indeed. What nobody's telling you is how to get rid of this `Fatal error: Class 'Custom\Application\Controller\IndexController' not found in /path/to/libraries/zendframework/zendframework/library/Zend/ServiceManager/AbstractPluginManager.php on line 170...` Indeed...

### Now, to the work !

Let's start - again - with the <a href="https://github.com/zendframework/ZendSkeletonApplication" target="_blank">ZendApplicationSkeletton</a>. Just go to github repository and download it to your localhost. Copy the `/module/Application` directory and paste it here : `/module/Custom/Application`. Because it does make sense saving the original Application module though we don't want our application to load it. We want our application load our brand new **Custom Application Module** - which is, for now, the lame copy of the original one, except it's one level lower.

Here is our file system

```
config
----application.config.php
data
module
----Application // we don't want this one
----Custom
--------Application // this is our precious
------------config
----------------module.config.php
------------src
------------Module.php
public
vendor
```

### Loading our Module

Now, as we said before, we want the application to load our Custom Application Module and unload the initial Application Module.

Edit `config/application.config.php`

```php
<?php

return array(
  // as it is said in comment on the ZendApplicationSkeletton original file
  // This should be an array of module namespaces used in the application.
  'modules' => array(
    'Custom\Application',
  ),
) ;
```

BECAUSE Zend Framework 2 is PSR-0 compliant, your module namespace should follow your file system. So the namespace and the path to your module Module class are matching. This is working as is out of the box. You can change that but then you'll have to customize the ModuleManager which is bootstrapped in the Zend\Mvc\Application default configuration.

Out of your `application.config.php`, you've told your application which module the application should load - by providing the list of module namespaces, and where the ModuleManager should find the Module class for each loaded Module. As the matter of fact, when you load several modules in your `application.config.php`, the configuration of the last loaded module (by order of the list) will override the configuration of the earlier ones. So either you do it purposedly, or you have to make sure that your configuration keys are not overriding eachother.

### The Module class

Edit your `module/Custom/Application/Module.php` file. This is the Module class of your module. First of all, we'll have to change the namespace.

```php
<?php

namespace Custom\Application ;

?>
```

Be really attentive here and observe this line on the end of your Module class

```php
<?php
  'Zend\Loader\StandardAutoloader' => array(
    'namespaces' => array(
      __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
    ),
  ),
?>
```

This line works when the namespace of your module is one word only. But if the namespace involves several directories, you'll have issues here. That's because the namespace use backslashes (\) while a path use slashes (/). Therefore, the __NAMESPACE__ constant includes either backslashes, or slashes but cannot include both.

So since the namespace has backslashes (\), you'll have to edit this line and write the path to your sources literally.

Now, the path to your module source, as intended by the Zend Framework team :

```php 
__NAMESPACE__ => __DIR__ . '/src/Custom/Application/',
```

If you want to do it more dynamically, you can use `str_replace()` function to replace backslahes by slashes :

```php
__NAMESPACE__ => __DIR__ . '/src/' . str_replace('\\', '/', __NAMESPACE__),
```

And here is the filesystem you should have :

```php
module
----Custom
--------Application // this is our precious
------------config
----------------module.config.php
------------src
----------------Custom
--------------------Application
------------------------Controller
------------Module.php
```

If you're not interested being PSR-0 compliant - because you can allow to -, you can decide your namespace would be `Custom\Application` and your module files can be located (almost) wherever you liked them to be, for example in a "sources" directory.

```php
__NAMESPACE__ => __DIR__ . '/sources/',
```

And here is the filesystem you should have :

```php
module
----Custom
--------Application // this is our precious
------------config
----------------module.config.php
------------sources
----------------Controller
------------Module.php
```

Or maybe for your source, you don't want to repeat the project name but you want to keep the module name :

```php
__NAMESPACE__ => __DIR__ . '/src/Application/',
```

And here is the filesystem you should have :

```php
module
----Custom
--------Application // this is our precious
------------config
----------------module.config.php
------------src
----------------Application
-------------------Controller
------------Module.php
```

### Your Index Controller

Edit your `module/Custom/Application/src/Application/Controller/IndexController.php` file and update the namespace.

```php
<?php

namespace Custom\Application\Controller ;

?>
```

This is the namespace of our controller, no matter what is the path of the `IndexController.php` file. Remember, we are talking about namespace and not about path anymore. Your controller (or any other classes belonging to your module) is included in the module namespace, which is, in our case `Custom\Application`.

### The Module configuration

Edit your `module/Custom/Application/config/module.config.php`

You'll have to update - at least - the controller loaded in your Service Manager.

```php
<?php
return array(

  ...

  'controllers' => array(
    'invokables' => array(
      'Application\Controller\Index' => 'Custom\Application\Controller\IndexController',
    ),
  ),
);
?>
```

`Application\Controller\Index` is the alias which I take as is from the initial ZendApplicationSkeletton package. You can change it and put any alias you find suitable such as MyHomeController or IndexController etc... If you choose to change the alias, do not forget to update the routes (or any other elements) which are using the controller alias.

`Custom\Application\Controller\IndexController` is your IndexController full name (meaning the namespace + the name of the class).

### Rendering the view

Here again, I discovered the hard way that Zend Framework 2 is not that much PSR-0 compliant. It is, in a limited situation. But it is not anymore if you take too much liberty with the rules.

After the ability to change our module namespace (and therefore path), we also are able to change the path to our module source files but when we try to access to our module through the navigator, we will have - high probabilities - an error and the framework is looking for a template here : `custom/index/index.phtml`, which matches this pattern : `{first-namespace}/{controller}/{action}.phtml`. As observed, the framework is ignoring the arborescence of namespaces. This situation will induce some errors if you have two differents modules under the same Custom directory. So, obviously, we should be able to change our templates names.

Changing our templates names, and therefore overriding the framework naming system for templates is done in the **`InjectTemplateListener`** which is loaded when the application is bootstrapped. Thanks to **<a href="http://ctrl-f5.net/php/custom-default-templates-in-zf2/" target="_blank">this blog</a>** and **<a href="https://github.com/ensemble/EnsembleAdmin" target="_blank">this module</a>** , we are now able to change the template naming. Our templates names will now match this scheme : `{full}/{module}/{namespace}/{controller}/{action}.phtml`.

We need to create our own `InjectTemplateListener` to override **<a href="http://framework.zend.com/manual/2.2/en/modules/zend.mvc.mvc-event.html#http-context-only" target="_blank">the one by default</a>**.

Edit `/module/Custom/Application/src/Application/Listener/InjectTemplateListener.php` (or choose your own path)

```php
<?php
namespace Custom\Application\Listener ;

use Zend\Mvc\View\Http\InjectTemplateListener as BaseListener ;
use Zend\EventManager\EventManagerInterface as Events ;
use Zend\Filter;
use Zend\Mvc\MvcEvent;

class InjectTemplateListener extends BaseListener
{
  /**
  * {@inheritdoc}
  */
  // we attach this class as top priorities (but the priorities will be override on bootstrap event
  public function attach(Events $events)
  {
    $this->listeners[] = $events->attach(MvcEvent::EVENT_DISPATCH, array($this, 'injectTemplate'), -100);
  }
 
  /**
  * {@inheritdoc}
  */
  // we use the parent injectTemplate method
  public function injectTemplate(MvcEvent $e)
  {
    parent::injectTemplate($e) ;
  }
 
  /**
   * {@inheritdoc}
   */
  // we add filtering to the string used
  // when the inflectName method is called, i honestly don't know
  // but you can find it out while looking more deeper into the Zend Framework sources.
  protected function inflectName($name)
  {
    if(!$this->inflector) 
    {
      $this->inflector = new Filter\FilterChain ;
      $this->inflector->attach(new Filter\Word\CamelCaseToDash())
          ->attach(new Filter\Word\SeparatorToDash('\\')) ;
    }

    $name = $this->inflector->filter($name) ;

    return strtolower($name) ;
  }
 
  /**
   * {@inheritdoc}
   */
  // this is the method to override
  protected function deriveModuleNamespace($controller)
  {
    if(!strstr($controller, '\\')) 
    {
      return '' ;
    }

    // $controller includes the namespace too
    $parts = explode('\\', $controller) ;
    $ns = array() ;

    foreach($parts as $part)
    {
      $ns[] = $part ;
    }

    // we discard the last key, which is the controller name
    array_pop($ns) ;

    // we discard - again - the last key, which is the namespace Controller
    array_pop($ns) ;
 
    return implode('/', $ns) ;
  }
}
?>
```

Now, we need to load our listener, and therefore override the application default listener.

Edit `/module/Custom/Application/Module.php`

```php
<?php

// add the use instruction
use Custom\Application\Listener\InjectTemplateListener;

// update the onBootstrap(MvcEvent $e) method
  public function onBootstrap(MvcEvent $e)
  {
    $eventManager = $e->getApplication()->getEventManager();
    $moduleRouteListener = new ModuleRouteListener();
    $moduleRouteListener->attach($eventManager);
 
    $injectTemplateListener = new InjectTemplateListener() ;
    $em = $e->getApplication()->getEventManager()->getSharedManager() ;
    $em->attach('Custom', MvcEvent::EVENT_DISPATCH, array($injectTemplateListener, 'injectTemplate'), -89) ;
  }
```

Our listener will create the name we are expecting for our template. The error in the navigator is modified now and the application is expecting the template matching this name : `custom/application/index/index`

Now, map the template's name and the template's path in the module configuration.

Edit `/module/Custom/Application/config/module.config.php`

Update the template mapping for the `view_manager` key :

```php
  'view_manager' => array(
    'display_not_found_reason' => true,
    'display_exceptions' => true,
    'doctype' => 'HTML5',
    'not_found_template' => 'error/404',
    'exception_template' => 'error/index',
    'template_map' => array(
      'layout/layout'        => __DIR__ . '/../view/layout/layout.phtml',
      'custom/application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
      'error/404'        => __DIR__ . '/../view/error/404.phtml',
      'error/index'        => __DIR__ . '/../view/error/index.phtml',
    ),
  ),
```
Now, go to our navigator. Tadaaaa !!!

We have successfully moved our module under a "vendor" directory, updated the namespace, the path to sources files and the template mapping. This being done, i have to admit that I won't be using it : it is too much customizing for not that much gain.
