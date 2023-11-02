---
title: "Managing Dependencies - Constructor Injection in controllers"
permalink: "en/posts/managing-dependencies-constructor-injection-controllers.html"
date: "2014-11-29T14:41"
slug: managing-dependencies-constructor-injection-controllers
layout: post
drupal_uuid: 3ef0f1cb-1e14-4764-a28c-76872fa966d2
drupal_nid: 101
lang: en
author: haclong

media:
  path: /img/teaser/Capture_serveur_rack.PNG

tags:
  - "zend framework 2"
  - "dépendances"
  - "HOWTO"

sites:
  - "Développement"

summary: "A quick post on how to inject dependencies into our controller's constructor."
---

A quick post on how to inject dependencies into our controller's constructor.

Working on ZF2 2.1.5+

We want to have mandatory dependencies within our controller. Why not ? But how to do it since the controller object is instanciated by the MVC application… We could of course twitch and hack the application basics but we don’t want this, do we ?

#### Manage the mandatory dependencies in our controller

```php
<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
// module/MyModule/src/MyModule/Controller/IndexController.php

<?php
namespace MyModule\Controller ;

use MyModule\Entity\DependencyAInterface ;
use MyModule\Form\DependencyBInterface ;
use Zend\Mvc\Controller\AbstractActionController ;

class IndexController extends AbstractActionController
{
  protected $dependencyA ;
  protected $dependencyB ;
 
  public function __construct(
    DependencyAInterface $depA,
    DependencyBInterface $debB
  )
  {
    $this->dependencyA = $depA ;
    $this->dependencyB = $depB ;
  }
 
  public function indexAction()
    {
      // just use $this->dependencyA and $this->dependencyB as normal
    }
}
```

Now we need a factory so we can “access” the constructor of our controller

#### Creating the controller factory

```php
<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
// module/MyModule/src/MyModule/Factory/IndexControllerFactory.php

<?php
namespace MyModule\Factory ;

use MyModule\Controller\WriteController ;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface ;

class IndexControllerFactory implements FactoryInterface
{
  public function createService(ServiceLocatorInterface $serviceLocator)
  {
    // this is mandatory , don’t ask
    $realServiceLocator = $serviceLocator->getServiceLocator() ;
    $entityDepA = $realServiceLocator->get('DependencyEntity') ;
    $formDepB = $realServiceLocator->get('FormElementManager')->get('DependencyForm') ;
 
    return new IndexController( // here is our controller
      $entityDepA,
      $formDepB
    ) ;
  }
}
```

Et voilaaaa

We have successfully injected the dependency in the controller.

#### But of course, now, our Service Manager

```php
// module/MyModule/Module.php

<?php
// we all know that part now
...

  public function getServiceConfig()
  {
    return array(
      'invokables' => array(
        'DependencyForm' => 'MyModule\Form\MyForm',
      ),
      'factories' => array(
        'DependencyEntity' => function($sm) {
          // anything here including your dependencies injection, of course
          return $entity ;
        },
      ),
    ) ;
  }
...
```

And now, how to tell the application that it shouldn’t use the controller straight but the one instanciated through our factory ??

Let’s go get our module config. Remember the controllers key there where we use to declare each one of our controllers ? Yep, that’s it… right there.

#### The controllers key

We had something like this in that key :

```php
// module/MyModule/config/module.config.php

<?php

return array(
  'controllers' => array(
    'invokables' => array(
      'ModuleController\Index' => 'MyModule\Controller\IndexController',
    ),
  ),
);
```

Now we want to use the factory instead

```php
// module/MyModule/config/module.config.php

<?php

return array(
  'controllers' => array(
    'factories' => array(
      'ModuleController\Index' => 'MyModule\Factory\IndexControllerFactory',
    ),
  ),
);
```

Make sure to use the same alias (***ModuleController\Index***) so you won’t have to change the router too.

And it’s done
