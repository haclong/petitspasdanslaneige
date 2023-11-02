---
title: "Managing Dependencies - Custom Select Element in Form"
permalink: "en/posts/managing-dependencies-custom-select-element-form.html"
date: "2014-11-25T16:43"
slug: managing-dependencies-custom-select-element-form
layout: post
drupal_uuid: 64d0f94e-404b-4821-aaac-1eb887741ceb
drupal_nid: 98
lang: en
author: haclong

media:
  path: /img/teaser/Capture_serveur_rack.PNG

tags:
  - "zend framework 2"
  - "Service Manager"
  - "dépendances"
  - "formulaire"

sites:
  - "Développement"

summary: "Personal reminder about how to code dependencies in custom select element in forms."
---

A very very frequent case :

You have a form with a select field (drop down box). The options in the drop box are values from a (most likely) table in your database. How to do this ?

This is working for - at least - ZF2 2.1.5+

### The Select Element

Create the Select Element as a custom field.

As we want to manage the dependencies and have a loose coupling between entities and layers of code, we don’t want our custom element to know anything about the database or the table or anything outside the element itself… So we will inject all the external values into the element.

Reminder : the Select element is expecting an array as value options :

```php
$select->setValueOptions(array(
  '0' => 'French',
  '1' => 'English',
  '2' => 'Japanese',
  '3' => 'Chinese',
));
```

All we have to do is to fetch a similar array to our custom element : we can either inject an array with pairs of key/label, or inject an object. If it would be an object, we will have to build the array somehow from the object.

Injecting an array :

```php
// module/MyModule/src/MyModule/Form/CustomSelect.php

<?php
namespace MyModule\Form ;

use Zend\Form\Element\Select ;

class CustomSelect extends Select
{
  public function __construct($arrayInjected)
  {
    $this->setName('mySelectField') ;
    $this->setLabel('Choose the value') ;
    $this->setValueOptions($arrayInjected) ;
  }
}
```

Injecting an object : You should be able to iterate through your object, or at least, you should find a way to extract an array out of it.

```php
// module/MyModule/src/MyModule/Form/CustomSelect.php

<?php
namespace MyModule\Form ;

use Zend\Form\Element\Select ;

class CustomSelect extends Select
{
  public function __construct($objectInjected)
  {
    $valuesInArray = $this->makeArray($objectInjectect) ;
    $this->setName('mySelectField') ;
    $this->setLabel('Choose the value') ;
    $this->setValueOptions($valuesInjected) ;
  }

  protected function makeArray($iterativeObject)
  {
    $array = array() ;

    foreach($iterativeObject as $value)
    {
      $array[$value->getId()] = $value->getName() ;
    }

    return $array ;
  }
}
```

### Loading the element in the form manager

Edit the Module.php file. We have to load the element in the form manager

```php
// module/MyModule/Module.php

<?php
namespace MyModule ;

use MyModule\Form\CustomSelect ;

class Module
{
  public function getFormElementConfig()
  {
    return array(
      'factories' => array(
        'MyOwnElement' => function($sm) {
          $valuesToInject = $sm->getServiceLocator()->get('TableGateway') ;

          // do not forget the use instruction for the CustomSelect object
          // injecting the values in the constructor of our custom element 
          $select = new CustomSelect($valuesToInject) ;

          return $select ;
        },
      ),
    ) ;
  }

  public function getServiceConfig()
  {
    return array(
      'factories' => array(

        // do whatever it takes to access to your datas from your persistence layer
        'TableGateway' => function ($sm) {
          return new TableGateway(...) ;
        },
      ),
    );
  }
}
```

### Building the form

Now we build our form component

```php
// module/MyModule/src/MyModule/Form/MyForm.php

<?php
namespace MyModule\Form ;

use Zend\Form\Form ;

class MyForm extends Form
{
  public function init()
  {
    $this->add(array(
      'name' => 'mySelect',
      'type' => 'MyOwnElement',
    )) ;
  }

  public function __construct()
  {
    // build the form as usual with standardized ZF2 elements
  }
}
```

When you create customized form elements, you have to add them in the form (or any fieldset) using the init() method.

Notice i use the alias defined in the Module class.

### Declaring the form in the Module class

```php
// module/MyModule/Module.php

<?php
namespace MyModule ;

...

class Module
{
  public function getServiceConfig()
  {
    return array(
      'invokables' => array(
        'MyForm' => 'MyModule\Form\MyForm',
      );
    ) ;
  }
}
```

### Putting it together in the controller

```php
// module/MyModule/src/MyModule/Controller/IndexController.php

<?php
namespace MyModule\Controller ;

use Zend\Mvc\Controller\AbstractActionController ;

class IndexController extends AbstractActionController
{
  public function indexAction()
  {
    $formManager = $this->serviceLocator->get('FormElementManager') ;
    $form = $formManager->get('MyForm') ;

    return array('form' = $form) ;
  }
}
```
### Now the View

As for the view, just use the Views plugins designed by ZF2 for rendering form elements. No further customization is required here.
