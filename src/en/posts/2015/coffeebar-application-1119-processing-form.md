---
title: "CoffeeBar Application 11/19 - Processing the form"
permalink: "en/posts/coffeebar-application-1119-processing-form.html"
date: "2015-03-19T19:52"
slug: coffeebar-application-1119-processing-form
layout: post
drupal_uuid: 231fc264-6df3-4a3c-a9b4-f9b49f547dca
drupal_nid: 113
lang: en
author: haclong

book:
  book: manage-coffeebar-event-driven-programming
  rank: 11,
  top: 
    url: /en/books/manage-coffeebar-event-driven-programming.html
    title: Manage a coffeebar with event driven programming
  next: 
    url: /en/posts/coffeebar-application-1219-processing-order.html
    title: CoffeeBar Application 12/19 - Processing the order
  previous:
    url: /en/posts/coffeebar-application-1019-building-form-place-order.html
    title: CoffeeBar Application 10/19 - Building a form to place the order

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "MVC"
  - "OOP"
  - "programmation événementielle"

sites:
  - "Développement"

summary: "We have now created our place order form, with that nice repeat-my-fields feature in the previous chapter. In today's chapter, we will process the form, binding it to an object and, of course, triggering our events."
---

We have now created our place order form, with that nice repeat-my-fields feature in the previous chapter. In today's chapter, we will process the form, binding it to an object and, of course, triggering our events.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

For our form, we will create an *object which will match the form fields* (an **id** and a **list of items in the order**).* For each items*, there is, of course, a *dedicated object as well*with the number of the menu item and the number of the item in the order.

## The item in the order

The `**CoffeeBar\Entity\TabStory\OrderItem**` targets an item being ordered in the order : either food or drink and how many times it has been ordered.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/OrderItem.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class OrderItem
{
  protected $id ; // menu number
  protected $number ; // ordered times

  // getters &amp; setters
}
```

It is impossible to use here our `**CoffeeBar\Entity\TabStory\OrderedItem**` created earlier because there's no direct match between the `**CoffeeBar\Entity\TabStory\OrderedItem**` object and the datas we will get from the form. The `**CoffeeBar\Entity\TabStory\OrderedItem**` will be processed by the `**CoffeeBar\Command\PlaceOrder**` command.

As a reminder, `**CoffeeBar\Entity\TabStory\OrderedItem**` holds all the informations of a menu item : its **menu number**, its **description**, its **price** and **if it is a drink or not** also.

But, when we validate the form, the datas we get from the form are **menu number** and **how many times** the item has been ordered only.

Now we set this new object to our fieldset. For each 'menu item/number' pair, we will instanciate a new `**CoffeeBar\Entity\TabStory\OrderItem**` object.

As for the hydratation, since we don't need to use customized methods, we can use the straight `**Zend\Stdlib\Hydrator\ClassMethods**` available in Zend Framework 2. But of course, you can use your favorite hydrator if you want.

```php
// module/CoffeeBar/src/CoffeeBar/Form/MenuItemFieldset.php

<?php
namespace CoffeeBar\Form ;

use Zend\Stdlib\Hydrator\ClassMethods;
use CoffeeBar\Entity\TabStory\OrderItem ;

class MenuItemFieldset extends Fieldset
{
  public function __construct()
  {
    // add the hydrator and the object in the constructor
    // or add them in the Service Manager, as you want
    $this->setHydrator(new ClassMethods()) ;
    $this->setObject(new OrderItem()) ;
  }
}
```

## The Form

Now set an object to the form.

```php
// module/CoffeeBar/src/CoffeeBar/Form/PlaceOrderForm.php

<?php
namespace CoffeeBar\Form ;

use CoffeeBar\Entity\TabStory\OrderModel;
use Zend\Stdlib\Hydrator\ArraySerializable;

class PlaceOrderForm extends Form
{
  public function __construct()
  {
    // ajouter dans le constructeur
    $this->setHydrator(new ArraySerializable()) ;
    $this->setObject(new OrderModel) ;
  }
}
```

Here again, it is not mandatory to use the `**Zend\Stdlib\Hydrator\ArraySerializable**` hydrator... We can use the `**Zend\Stdlib\Hydrator\ClassMethods**` hydrator as well.

Here is the `**CoffeeBar\Entity\TabStory\OrderModel**` object.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/OrderModel.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class OrderModel
{
  protected $id ; // int - table number
  protected $items ; // array de CoffeeBar\Entity\TabStory\OrderItem
 
  // getters &amp; setters

  // mandatory methods when we use ArraySerializable
  public function populate($data = array()) {
    isset($data['id']) ? $this->setId($data['id']) : null;
    isset($data['items']) ? $this->setItems($data['items']) : null;
  }

  // mandatory methods when we use ArraySerializable
  public function getArrayCopy() {
    return array(
      'id' => $this->id,
      'items' => $this->items,
    ) ;
  }
}
```

## Processing the form

Once the form `**CoffeeBar\Form\PlaceOrderForm**` has been submitted, we will get a `**CoffeeBar\Entity\TabStory\OrderModel**` object with an `$id` (**table number**) and an array `$items` (**items in the order**). We will need to process those datas and transform them into a `**CoffeeBar\Command\PlaceOrder**` object with a **unique id** (guid) and a `**CoffeeBar\Entity\TabStory\OrderedItems**` object.

We need to find *the unique id of a tab by its table number*.

Which one of our object allow us to access all our opened tabs ?? Here it is, the `**CoffeeBar\Entity\OpenTabs\TodoByTab**`, stored in the '*openTabs*' cache index and reachable through the **OpenTabs** service.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Entity\OpenTabs\TabStatus;

class OpenTabs
{
  /**
   * return the unique id of the tab
   * @param int $table - table number
   * @return id (guid)
   */
  public function tabIdForTable($table)
  {
    $this->loadTodoByTab() ;
    foreach($this->todoByTab->getArrayCopy() as $k => $v)
    {
      if($v->getTableNumber() == $table)
      {
        return $k ;
      }
    }

    return NULL ;
  }
}
```

### The controller

Then, in our controller, let's focus on the `**CoffeeBar\Entity\TabStory\OrderModel**` from the validated form.

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

use CoffeeBar\Entity\TabStory\OrderModel;
use Zend\Mvc\Controller\AbstractActionController;

class TabController extends AbstractActionController
{
  public function orderAction()
  {
    // use the key in the Service Manager 
    $form = $this->serviceLocator->get('PlaceOrderForm') ;
    $request = $this->getRequest() ;

    // check if table number is in the HTTP request
    if ($id = (int) $this->params()->fromRoute('id')) {
      $form->get('id')->setValue($id) ;

    // check if form has been posted
    } elseif($request->isPost()) {
      $form->setData($request->getPost()) ;

      // make sure form is valid (the object then is bound)
      if($form->isValid()) {
        // here we are
        $orderModel = $form->getObject() ; // CoffeeBar\Entity\TabStory\OrderModel
        $tableNumber = $orderModel->getId() ;

        // gets CoffeeBar\Service\OpenTabs
        $openTabs = $this->serviceLocator->get('OpenTabs') ;

        // gets CoffeeBar\Command\PlaceOrder
        $placeOrder = $this->serviceLocator->get('PlaceOrderCommand') ;

        // create OrderedItems from the OrderModel
        $items = $this->assignOrderedItems($orderModel) ;

        // calling PlaceOrder::placeOrder() will trigger a 'placeOrder' event
        // PlacerOrder::placeOrder(guid, OrderedItems)
        $placeOrder->placeOrder($openTabs->tabIdForTable($tableNumber), $items) ;

        return $this->redirect()->toRoute('tab/status', array('id' => $tableNumber));
      }
    // if there's no table number in the HTTP request, redirect to the 'open new tab' page
    } else {
      return $this->redirect()->toRoute('tab/open');
    }
 
    $result['form'] = $form ;

    return array('result' => $result) ;
  }

  // iterate on the OrderModel items and build the OrderedItems object
  protected function assignOrderedItems(OrderModel $model)
  {
    $items = $this->serviceLocator->get('OrderedItems') ;

    // gets MenuItems
    $menu = $this->serviceLocator->get('CoffeeBarEntity\MenuItems') ;

    foreach($model->getItems() as $item)
    {
      for($i = 0; $i < $item->getNumber(); $i++)
      {
        $orderedItem = clone $this->serviceLocator->get('OrderedItem') ;
        $orderedItem->setId($item->getId()) ;
        $orderedItem->setDescription($menu->getById($item->getId())->getDescription()) ;
        $orderedItem->setPrice($menu->getById($item->getId())->getPrice()) ;
        $orderedItem->setIsDrink($menu->getById($item->getId())->getIsDrink()) ;

        $items->offsetSet(NULL, $orderedItem) ;
      }
    }

    return $items ;
  }
}
```

We use a `clone` keyword so we can 'instanciate' the `**CoffeeBar\Entity\TabStory\OrderedItem**` several times without using the `new` keyword. This is a recommandation to limit dependencies constraints. Actually, i should use more `clone` and **Service Manager** throughout my application... i've been lazy.

### The Service Manager

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

use CoffeeBar\Command\PlaceOrder;

class Module
{
  public function getServiceConfig()
  {
    return array(
      'invokables' => array(
        'OrderedItems' => 'CoffeeBar\Entity\TabStory\OrderedItems',
        'OrderedItem' => 'CoffeeBar\Entity\TabStory\OrderedItem',
      ),
      'factories' => array(
        'PlaceOrderCommand' => function($sm) {
          $events = $sm->get('TabEventManager') ;
          $placeOrder = new PlaceOrder() ;
          $placeOrder->setEventManager($events) ;

          return $placeOrder ;
        },
      ),
    ) ;
  }
}
```

Now, this is how we can, with a simple trick, transform a `**CoffeeBar\Entity\TabStory\OrderModel**` (table number and array of `**CoffeeBar\Entity\TabStory\OrderItem**`) object on a `**CoffeeBar\Command\PlaceOrder**` (tab guid and `**CoffeeBar\Entity\TabStory\OrderedItems**`). A '*placeOrder*' event has been triggered. **TabAggregate** has been listening to that event and two more events have been triggered : '*drinksOrdered*' and '*foodOrdered*'.

All best practices i have found on internet recommend to build slim controller. I think so too. On my opinion, i would have put the `TabController::assignOrderedItems(OrderModel $model)` method within a service... But again, this method has a dependency on the `**CoffeeBar\Entity\MenuItems**`. In the meanwhile, the method is not quite thick : all it does is to get the menu items informations and clone `**CoffeeBar\Entity\TabStory\OrderedItem**` with the ordered items number. With a right constructor for the `**CoffeeBar\Entity\TabStory\OrderedItem**`, the method can look lighter finally.

Next, let's see what we have with both *'drinksOrdered*' and '*foodOrdered*' events.

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
