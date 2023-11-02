---
title: "CoffeeBar Application 4/19 - The Open Tab Form"
permalink: "en/posts/coffeebar-application-419-open-tab-form.html"
date: "2015-01-21T19:30"
slug: coffeebar-application-419-open-tab-form
layout: post
drupal_uuid: 4e7b4e62-c8ec-460a-9f4f-1e672c7523eb
drupal_nid: 106
lang: en
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "MVC"
  - "Zend Form"
  - "dépendances"
  - "Service Manager"

sites:
  - "Développement"

summary: "In this chapter, we will build the form. Its particularity is to include a drop down component with customized datas. Let's take advantage of this application to learn how to create a customized Select component with a dependency."
---

In this chapter, we will build the form. Its particularity is to include a drop down component with customized datas. Let's take advantage of this application to learn how to create a customized Select component with a dependency.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

A **tab** has following datas : the **table number** (text input), the **waiter name** (one value among the waiters list) and, here is the technical value, the **unique id** (guid) of the tab.

## The Select Element

### The waiters list

The waiters list is an object : **`CoffeeBar\Entity\Waiters`** using an array (`array`) with the name and id of each waiter of the coffeebar. We can easily imagine our object **`CoffeeBar\Entity\Waiters`** linked to a database, its informations extracted of the right table. In this tutorial though, we will use a static list.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/Waiters.php

<?php
namespace CoffeeBar\Entity ;

use ArrayObject ;

// Waiters inherits from ArrayObject
class Waiters extends ArrayObject
{
  public function __construct(Array $array=null)
  {
    $array = array( 
      ‘paul’ => 'Paul',
      ‘john’ => 'John',
      ‘melissa’ => 'Melissa',
      ‘julie’ => 'Julie',
      ‘michael’ => 'Michael'
    ) ;
    parent::__construct($array) ;
  }
}
```

Now we need to inject this waiters list in an **Select** element and we don't want to have to write the list down *again*.

In the <a href="http://framework.zend.com/manual/current/en/modules/zend.form.elements.html#select" target="_blank">Select element documentation</a>, we use `Select::setValueOptions($array)` method to fill in the Select element.

```php
$select = new Element\Select('my_select_element') ;

$select->setValueOptions(array(
  '0' => 'element1',
  '1' => 'element2',
  '2' => 'element3',
  'key' => 'value',
));
```

Using the array notation :

```php
$form->add(array(
  'type' => 'Select',
  'options' => array(
    'value_options' => array(
      '0' => 'element1',
      '1' => 'element2',
      '2' => 'element3',
      'key' => 'value',
    ),
  ),
)) ;
```

We need to replace the `value_options` array by our waiters list. The first thing to check : Is our waiters list formatted as an `'key'=>'value'` array as expected by the Select element. No multiple level arrays are allowed, nor object are allowed as `'value'`.

### The customized Select element

With Zend Framework 2, we create a **customized `Select` element**, **`CoffeeBar\Form\WaiterSelect`**, extending the Zend Framework class **`Zend\Form\Element\Select`**. We will inject the **`CoffeeBar\Entity\Waiters`** and we will assign the values of the **`CoffeeBar\Entity\Waiters`** object to the values of the **`CoffeeBar\Form\WaiterSelect`** element.

```php
// module/CoffeeBar/src/CoffeeBar/Form/WaiterSelect

<?php
namespace CoffeeBar\Form ;

use CoffeeBar\Entity\Waiters;
use Zend\Form\Element\Select;

class WaiterSelect extends Select
{
  protected $waiters ;
 
  // in the constructor, we inject the list of waiters (object Waiters)
  // then we will be able to use the list as we want within the WaiterSelect object
  public function __construct(Waiters $waiters)
  {
    $this->waiters = $waiters ;
  }
 
  // in the init() method, we get the waiters list (from the Waiters object)
  // we define the waiters list as the list of options of the Select element
  // $this->setValueOptions() is a method belonging to the ZF2 Select element
  // the ArrayObject::getArrayCopy() takes the ArrayObject contents and returns an array
  public function init()
  {
    $this->setValueOptions($this->waiters->getArrayCopy()) ;
  }
}
```

We load the elements in the **Service Manager**

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

use CoffeeBar\Form\WaiterSelect;
use Zend\ModuleManager\Feature\FormElementProviderInterface;

// as soon as it concerns customized form elements
// it is mandatory to implement FormElementProviderInterface
class Module implements FormElementProviderInterface
{
  public function getConfig() {...}

  public function getAutoloaderConfig() {...}
 
  // the FormElementProviderInterface interface
  // require a getFormElementConfig() method
  public function getFormElementConfig() {
    return array(
      'factories' => array(
        // declare the form element in the form manager
        // here, the key is 'WaiterSelect'
        // but any key would do
        'WaiterSelect' => function($sm) {
          $serviceLocator = $sm->getServiceLocator() ;
          $waiters = $serviceLocator->get('CoffeeBarEntities\Waiters') ;

          // on the other hand, we are using the straight CoffeeBar\Form\WaiterSelect class
          // note the injection of the Waiters object in the constructor
          $select = new WaiterSelect($waiters) ; //CoffeeBar\Form\WaiterSelect

          return $select ;
        },
      ),
    );
  }

  // loading the Service Manager
  public function getServiceConfig()
  {
    return array(
      'invokables' => array(
        // key in the Service Manager => object
        'CoffeeBarEntities\Waiters' => 'CoffeeBar\Entity\Waiters',
      ),
    ) ;
  }
}
```

We now create the form : add a hidden element, for the unique id, a text element for the table number and our customized select element, for the waiters list.

## The form

```php
// module/CoffeeBar/src/CoffeeBar/Form/OpenTabForm.php

<?php
namespace CoffeeBar\Form ;

use Zend\Form\Element\Csrf;
use Zend\Form\Form;

class OpenTabForm extends Form
{
  // the init() method will load the customized element
  // all the other 'standards' elements can be loaded in the form constructor
  public function init()
  {
    $this->add(array(
      'name' => 'waiter',
 
      // use the key defined in the Module::getFormElementConfig
      'type' => 'WaiterSelect',
      'options' => array(
        'label' => 'Serveur',
      ),
      'attributes' => array(
        // this is one of Bootstrap Twitter CSS class
        'class' => 'form-control',
      ),
    )) ;
  }

  public function __construct()
  {
    parent::__construct('opentab') ;
 
    $this->setAttribute('method', 'post') ;
 
    // the id field is a hidden unique id (guid)
    // its value will be generated in the view
    $this->add(array(
      'name' => 'id',
      'type' => 'hidden',
    )) ;

    $this->add(array(
      'name' => 'tableNumber',
      'options' => array(
        'label' => 'Numéro de la table',
      ),
      'attributes' => array(
        'required' => 'required',
        'class' => 'form-control',
      ),
    )) ;
 
    $this->add(new Csrf('security')) ;
 
    $this->add(array(
      'name' => 'submit',
      'type' => 'Submit',
      'attributes' => array(
        'value' => 'Open',
        'class' => 'btn btn-default',
      ),
    )) ;
  }
}
```

Back to the **Service Manager** for the management of our form

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

class Module implements FormElementProviderInterface
{
  public function getConfig() {...}

  public function getAutoloaderConfig() {...}
 
  public function getFormElementConfig() {...}

  // loading the service manager
  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'OpenTabForm' => function($sm) {
          // because the OpenTabForm use a customized form element
          // it is mandatory to use $this->serviceLocator->get('FormElementManager') ;
          // and use the form from the Form Element Manager (and not the Service Manager)
          $formManager = $sm->get('FormElementManager') ;
          $form = $formManager->get('CoffeeBar\Form\OpenTabForm') ;
          return $form ;
        },
      ),
    ) ;
  }
}
```

## Rendering in the browser

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
    // get the form in the Service Manager
    $form = $this->serviceLocator->get('OpenTabForm') ;

    $request = $this->getRequest() ;

    // check if the form has been posted
    if($request->isPost()) {
      // assign $_POST datas to the form
      $form->setData($request->getPost()) ;
 
      if($form->isValid()) {
        // process the form
      }
    }

    $result['form'] = $form ;
    return array('result' => $result) ;
  }
}
```

### The view

Now we use <a href="http://framework.zend.com/manual/current/en/modules/zend.form.view.helpers.html" target="_blank">**view helpers**</a>

```php
// module/CoffeeBar/view/coffee-bar/tab/open.phtml

<h1>Open a new tab</h1>

<?php
  $form = $this->result['form'] ;
  $form->prepare() ;

  // the form action will send us to the ‘tab/open’ route
  // meaning TabController / OpenAction as defined in the route in the module.config.php file
  $form->setAttribute('action', $this->url('tab/open')) ;
  $form->setAttribute('method', 'post') ;

  // generating the unique id in the view (as promised)
  $id = $form->get('id') ;
  $id->setValue(uniqid()) ;
?>

<?php echo $this->form()->openTag($form) ; ?>

<div class='form-group'>
  <?php echo $this->formRow($form->get('tableNumber')) ; ?>
</div>
<div class='form-group'>
  <?php echo $this->formRow($form->get('waiter')) ; ?>
</div>
<?php
  echo $this->formRow($form->get('security')) ;
  echo $this->formHidden($id) ;
  echo $this->formRow($form->get('submit')) ;

  echo $this->form()->closeTag() ;
?>
```

Form is done.

Therefore, to **customized a select element**, you need

- an **object model** with a list of values
- make sure that object will return an **array with one dimension** : `'key' => 'value'` (either by default, either by using a dedicated method)
- create a customized select element extending **Zend\Form\Element\Select**
- implement the **FormElementProviderInterface** in the Module class
- **inject dependencies** in the configuration of the form element `Module::getFormElementConfig()`
- use the **FormElementManager** (which is itself in the Service Manager)

In next chapter, we will see how we will get the form datas (hydrated in a dedicated object, of course) and how we can process them in our application.

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
