---
title: "CoffeeBar Application 10/19 - Building a form to place the order"
permalink: "en/posts/coffeebar-application-1019-building-form-place-order.html"
date: "2015-03-12T19:51"
slug: coffeebar-application-1019-building-form-place-order
layout: post
drupal_uuid: 67831584-8641-4a3d-b940-4dd0f1ae4e4d
drupal_nid: 112
lang: en
author: haclong

book:
  book: manage-coffeebar-event-driven-programming
  rank: 10,
  top: 
    url: /en/books/manage-coffeebar-event-driven-programming.html
    title: Manage a coffeebar with event driven programming
  next: 
    url: /en/posts/coffeebar-application-1119-processing-form.html
    title: CoffeeBar Application 11/19 - Processing the form
  previous:
    url: /en/posts/coffeebar-application-919-placing-order-mixing-drinks-and-food.html
    title: CoffeeBar Application 9/19 - Placing an order, mixing drinks and food

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "aide de vue"
  - "MVC"
  - "javascript"
  - "Zend Form"
  - "Zend Form Collection"

sites:
  - "Développement"

summary: "To place an order, we will build a complex form with a fieldset : a drop down list and an input text. The numbers of fieldset is infinite and we can add as many fieldset as we need. Let's do some form dependencies and javascript in today's chapter."
---

To place an order, we will build a complex form with a fieldset : a drop down list and an input text. The numbers of fieldset is infinite and we can add as many fieldset as we need. Let's do some form dependencies and javascript in today's chapter.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

### What we gonna do

We will build a fieldset associating one drop down list, listing all menu items and, on the same fieldset, an input text, where we will be able to set the number of ordered items. If the client wish to order another menu item, it will be possible to add another fieldset.

### The menu item

The menu item has a **menu number**, a **description**, a **price** and a **flag** saying if the item is a drink or not.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/MenuItem.php

<?php
namespace CoffeeBar\Entity ;

class MenuItem
{
  protected $id ; // int
  protected $description ; // string
  protected $price ; // float
  protected $isDrink ; // bool

  // default value for price and flag
  public function __construct($id, $description, $price = 0.00, $isDrink = false)
  {
    $this->setId($id) ;
    $this->setDescription($description) ;
    $this->setPrice($price) ;
    $this->setIsDrink($isDrink) ;
  }
 
  /* définir les getter et setter */
}
```

A whole menu is a list of menu items. *Wait... wait... wait... who's thinking i'll use ArrayObject ?*

Here again, we will use static datas but i let you imagine how you can tie all this with a database.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/MenuItems.php

<?php
namespace CoffeeBar\Entity ;

use ArrayObject;

class MenuItems extends ArrayObject
{
  public function __construct(Array $array=null)
  {
    $array = array() ;
    $i = 0 ;

    $array[] = new MenuItem($i++, 'Thé vert', 3.75, true) ;
    $array[] = new MenuItem($i++, 'Café', 2.55, true) ;
    $array[] = new MenuItem($i++, 'Limonade', 4.05, true) ;
    $array[] = new MenuItem($i++, 'Soda', 4.20, true) ;
    $array[] = new MenuItem($i++, 'Bière', 4.75, true) ;
    $array[] = new MenuItem($i++, 'Frites', 5.25) ;
    $array[] = new MenuItem($i++, 'Pizza', 9.80) ;
    $array[] = new MenuItem($i++, 'Saucisses Frites', 7.75) ;
    $array[] = new MenuItem($i++, 'Hot Dog', 7.00) ;
    $array[] = new MenuItem($i++, 'Quiche', 6.65) ;

    parent::__construct($array) ;
  }
}
```

So we do have a list (`**\ArrayObject**`). But do not forget. In a Select element, the `value_options` expects a simple array : `id => value`. No objects are allowed. So we need to have a method to extract the right datas from `**CoffeeBar\Entity\MenuItems**` and build the right array for our Select element. Obviously, the `id`, will be the **menu number** when the `value` would be the **description**.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/MenuItems.php

<?php
namespace CoffeeBar\Entity ;

class MenuItems ...
{
  // method to extract id and description and build a simple array
  public function getSelectValues()
  {
    $array = array() ;
 
    // we get the iterator with ArrayObject::getIterator()
    $iterator = $this->getIterator() ;

    foreach($iterator as $item)
    {
      $array[$item->getId()] = $item->getDescription() ;
    }

    return $array ;
  }
}
```

### Form elements

Let's see the form elements. Let's start with the Select element.

```php
// module/CoffeeBar/src/CoffeeBar/Form/MenuSelect.php

<?php
namespace CoffeeBar\Form ;

use CoffeeBar\Entity\MenuItems;
use Zend\Form\Element\Select;

class MenuSelect extends Select
{
  protected $menus ;
 
  // inject the MenuItems in the constructor
  public function __construct(MenuItems $items)
  {
    $this->menus = $items ;
  }

  // assign the right array to the select element
  // use the init() method for all customized form elements
  public function init()
  {
    $this->setValueOptions($this->menus->getSelectValues()) ;
  }
}
```

Now build the customized `Fieldset` with two elements : the customized select element and the straight input text element.

```php
// module/CoffeeBar/src/CoffeeBar/Form/MenuItemFieldset.php

<?php
namespace CoffeeBar\Form ;

use Zend\Form\Fieldset;

class MenuItemFieldset extends Fieldset
{
  // use the init() method for any customized element
  public function init()
  {
    $this->add(array(
      'name' => 'id',
      'type' => 'MenuSelect', // use the key in the Form Element Manager
      'attributes' => array(
        'class' => 'form-control',
      ),
    )) ;
  }

  public function __construct()
  {
    parent::__construct('menuItems') ;
 
    $this->add(array(
      'name' => 'number',
      'options' => array(
        'label' => ' ',
      ),
      'attributes' => array(
        'value' => 1,
        'class' => 'form-control text-right',
        'size' => 4,
      ),
    )) ;
  }
}
```

We want to use a javascript so the same template (with the fieldset) will be copied as many time as needed. So we need to write that template down.

*I can't find where i have found that part so... just see how it works here.*

```php
// module/CoffeeBar/src/CoffeeBar/Form/Helper/MenuItemFormCollection.php

<?php
namespace CoffeeBar\Form\Helper ;

use Zend\Form\View\Helper\FormCollection ;
use Zend\Form\Element\Collection ;

class MenuItemFormCollection extends FormCollection
{
  public function renderTemplate(Collection $collection)
  {
    $elementHelper = $this->getElementHelper();
    $escapeHtmlAttribHelper = $this->getEscapeHtmlAttrHelper();
    $fieldsetHelper = $this->getFieldsetHelper();
    $element = $collection->getTemplateElement();
 
    if ($element instanceof FieldsetInterface) {
      $templateMarkup .= $fieldsetHelper($element);
    }

    $formRow = $this->view->plugin('FormRow') ;

    $templateMarkup = '';
    $templateMarkup .= '<fieldset class="form-inline">' ;
    $templateMarkup .= $formRow($element->get('id')) . '&amp;nbsp;&amp;nbsp;';
    $templateMarkup .= $formRow($element->get('number')) ;
    $templateMarkup .= '</fieldset>' ;

    return sprintf(
      $this->templateWrapper,
      $escapeHtmlAttribHelper($templateMarkup)
    );
  }
}
```

After our template being created as a view helper, we need to <a href="http://framework.zend.com/manual/current/en/modules/zend.view.helpers.advanced-usage.html#registering-helpers" target="_blank">declare it inside our application configuration</a> so we can invoke/call it.

```php
// module/CoffeeBar/config/module.config.php

<?
return array(
  'view_helpers' => array(
    'invokables' => array(
      // as usual : key => object
      'MenuItemFormCollection' => 'CoffeeBar\Form\Helper\MenuItemFormCollection',
    ),
  ),
);
```

The view helper is ready, let's build the form.

A **fieldset** component we can repeat dynamically, Zend Framework 2 calls it <a href="http://http://framework.zend.com/manual/current/en/modules/zend.form.collections.html" target="_blank">**Form Collection**</a>. Its documentation is not that bad. In the form, we will add a `**Zend\Form\Element\Collection**` element. This form element has few more options so we can set the "repeat" feature.

```php
// module/CoffeeBar/src/CoffeeBar/Form/PlaceOrderForm

<?php
namespace CoffeeBar\Form ;

use Zend\Form\Element\Csrf;
use Zend\Form\Form;

class PlaceOrderForm extends Form
{
  public function init()
  {
    $this->add(array(
      // this is a dedicated element from ZF2. It allows us to build repeatable fields
      'type' => 'Zend\Form\Element\Collection',
      'name' => 'items',
      'options' => array(
        'label' => 'Commandez vos plats',
        // default number of fieldset when the form is loaded
        'count' => 2,
        // both following options allow us to repeat the fieldset
        'should_create_template' => true,
        'allow_add' => true,
        // point to the element we want to repeat
        'target_element' => array(
          // this is the true object, not an alias within the form element manager
          'type' => 'CoffeeBar\Form\MenuItemFieldset',
        ),
      ),
      'attributes' => array(
        'class' => 'form-control',
      ),
    ));
  }

  public function __construct()
  {
    parent::__construct('order') ;
 
    $this->setAttribute('method', 'post') ;

    // we will add the hydrator and the object later
 
    // table number
    $this->add(array(
      'name' => 'id',
      'type' => 'hidden',
    )) ;
 
    $this->add(new Csrf('security')) ;
 
    $this->add(array(
      'name' => 'submit',
      'type' => 'Submit',
      'attributes' => array(
        'value' => 'Place order',
        'class' => 'btn btn-default',
      ),
    )) ;
  }
}
```

Our **form** is ready. We will now load it into our **Service Manager**, get it in our **controller**, render the form in the **view**, including the **view helper** and the **javascript**.

#### Service Manager

```php
// module/CoffeeBar/Module.php

namespace CoffeeBar;

use CoffeeBar\Form\MenuSelect;

class Module implements FormElementProviderInterface
{
  // l'interface FormElementProvideInterface a la méthode getFormElementConfig()
  public function getFormElementConfig() {
    return array(
      'factories' => array(
        // déclarer l'élément de formulaire dans le Manager de formulaire
        'MenuSelect' => function($sm) {
          $serviceLocator = $sm->getServiceLocator() ;
          // CoffeeBarEntity\MenuItems : clé dans le Service Manager
          $menus = $serviceLocator->get('CoffeeBarEntity\MenuItems') ;
          // MenuSelect : objet CoffeeBar\Form\MenuSelect
          $select = new MenuSelect($menus) ;

          return $select ;
        },
      ),
    );
  }

  // on charge le service manager
  public function getServiceConfig()
  {
    return array(
      'invokables' => array(
        'CoffeeBarEntity\MenuItems' => 'CoffeeBar\Entity\MenuItems',
      ),
      'factories' => array(
        'PlaceOrderForm' => function($sm) {
          $formManager = $sm->get('FormElementManager') ;
          $form = $formManager->get('CoffeeBar\Form\PlaceOrderForm') ;

          return $form ;
        },
      ),
    ) ;
  }
}
```

#### The controller

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

use Zend\Mvc\Controller\AbstractActionController;

class TabController extends AbstractActionController
{
  public function orderAction()
  {
    // use the Service Manager key
    $form = $this->serviceLocator->get('PlaceOrderForm') ;
    $request = $this->getRequest() ;

    // check if the table number is in the HTTP request
    if ($id = (int) $this->params()->fromRoute('id')) {
      $form->get('id')->setValue($id) ;
      // check if form is posted
    } elseif($request->isPost()) {
      $form->setData($request->getPost()) ;

      if($form->isValid()) {
        // process the order
      }
    // if there's no table number, redirect to 'open tab' page
    } else {
      return $this->redirect()->toRoute('tab/open');
    }
 
    $result['form'] = $form ;
    return array('result' => $result) ;
  }
}
```

#### Finally, the view

Right on the top of the view, the javascript for the 'Add a new item' button.

```php
// module/CoffeeBar/view/coffee-bar/tab/order.phtml

<script>
  function add_item() {
    var currentCount = $('form fieldset fieldset').length;
    var template = $('form fieldset > span').data('template');
    template = template.replace(/__index__/g, currentCount);
    $('form fieldset').last().append(template);

    return false;
  }
</script>

<h1>Passer commande</h1>

<?php
  $form = $this->result['form'] ;
  $form->prepare() ;

  $form->setAttribute('action', $this->url('tab/order')) ;
  $form->setAttribute('method', 'post') ;
?>

<?php echo $this->form()->openTag($form) ; ?>

<div class='form-group'>
  <?php echo $this->formRow($form->get('id')) ; ?>
</div>

<div class='form-group'>
  <fieldset>
    <legend><?php $this->formLabel($form->get('items')) ; ?></legend>

    <?php
      foreach($form->get('items')->getIterator() as $fieldset)
      {
        echo '<fieldset class="form-inline">' ;
        echo $this->formRow($fieldset->get('id')). '&amp;nbsp;&amp;nbsp;' ;
        echo $this->formRow($fieldset->get('number')) ;
        echo '</fieldset>' ;
      }

      // here is our view helper
      echo $this->MenuItemFormCollection()->renderTemplate($form->get('items'));
    ?>
  </fieldset>

  <button onclick="return add_item()">Add a new item</button>
</div>

<?php
  echo $this->formRow($form->get('security')) ;
  echo $this->formRow($form->get('submit')) ;
  echo $this->form()->closeTag() ;
?>
```

#### The route

Just set the route for this page

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'router' => array(
    'routes' => array(
      // add to previous routes
      'tab' => array(
        'child_routes' => array(

          /**
           * this URL : http://coffeebar.home/tab/order leads to the following route
           */
          'order' => array(
            'type' => 'Segment',
            'options' => array(
              'route' => '/order[/:id]',
              'constraints' => array(
                'id' => '[a-zA-Z0-9_-]+',
              ),
              'defaults' => array(
                'controller' => 'CoffeeBarController\Tab',
                'action' => 'order',
              ),
            ),
          ),
        ),
      ),
    ),
  ),
) ;
```

Tadaaa... Isn't it nice ? Our form is working now... Working ?? Wait a minute... Not really actually. We haven't process the datas yet...

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
