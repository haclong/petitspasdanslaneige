---
title: "CoffeeBar Application 18/19 - The bill, last but not least"
permalink: "en/posts/coffeebar-application-1819-bill-last-not-least.html"
date: "2015-05-26T20:08"
slug: coffeebar-application-1819-bill-last-not-least
layout: post
drupal_uuid: 0ac02d5f-30b0-4a00-809b-b9c8986173bd
drupal_nid: 122
lang: en
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "OOP"
  - "programmation événementielle"

sites:
  - "Développement"

summary: "Service is running. Prepared food is served. Ordered drinks are served. As they are served, the application is counting the bill. Our clients are done. They want to close the tab... pay the bill."
---

Service is running. Prepared food is served. Ordered drinks are served. As they are served, the application is counting the bill. Our clients are done. They want to close the tab... pay the bill.

*NOTE : throughout the tutorial, i will reedit numerous classes and views i already talked about. On the second edition, some datas will be missing such as use keyword, extends and implements keywords etc... It doesn't mean you have to delete those existing lines. It is intended to lighten this tutorial. In the case we need to remove lines, i'll say it so plainly, even re-editing the whole part to make myself clear on that item.*

## Checking out the client.

### Building the form first

Our last form will have only one field : the amount paid field. The total amount of the tab will be printed on screen, of course.

```php
// module/CoffeeBar/src/CoffeeBar/Form/CloseTabForm.php

<?php
namespace CoffeeBar\Form ;

use Zend\Form\Element\Csrf;
use Zend\Form\Form;
use Zend\Stdlib\Hydrator\ArraySerializable;

class CloseTabForm extends Form
{
  public function __construct()
  {
    parent::__construct('closetab') ;
 
    $this->setAttribute('method', 'post')
         ->setHydrator(new ArraySerializable()) ;
 
    $this->add(array(
      'name' => 'id',
      'type' => 'hidden',
    )) ;
 
    $this->add(array(
      'name' => 'amountPaid',
      'options' => array(
        'label' => 'Encaissement',
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
        'value' => 'Encaisser',
        'class' => 'btn btn-default',
      ),
    )) ;
  }
}
```

Once again, no object has been set. Because, we already knows that, the `**CoffeeBar\Command\CloseTab**` has a dependency on the **Event Manager**.

Wait... Dependencies ?? Of course, the automatic answer is **Service Manager**.

Let's take a look at the `**CoffeeBar\Command\CloseTab**` command first.

```php
// module/CoffeeBar/src/CoffeeBar/Command/CloseTab.php

<?php
namespace CoffeeBar\Command ;

use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

class CloseTab implements EventManagerAwareInterface
{
  protected $id ;
  protected $amountPaid ;
  // propriété liées à l’interface EventManagerAwareInterface
  protected $events ;

  // getters &amp; setters

  // méthodes obligatoires pour l'hydrator ArraySerializable
  public function populate($data = array()) {
    $this->id = (isset($data['id'])) ? $data['id'] : null;
    $this->amountPaid = (isset($data['amountPaid'])) ? $data['amountPaid'] : null;
 
    $this->events->trigger('closeTab', '', array('closeTab' => $this)) ;
  }

  public function getArrayCopy() {
    return array(
      'id' => $this->id,
      'amountPaid' => $this->amountPaid,
    ) ;
  }
}
```

Within the `**CoffeeBar\Module**`, our **Service Manager**.

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

use CoffeeBar\Command\CloseTab;
use CoffeeBar\Form\CloseTabForm;

class Module implements FormElementProviderInterface
{
  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        // setting the object to the form
        'CloseTabForm' => function($sm) {
          $form = new CloseTabForm() ;
          $form->setObject($sm->get('CloseTabCommand')) ;
          return $form ;
        },
        // injecting the TabEventManager to the CloseTab command
        'CloseTabCommand' => function($sm) {
          $events = $sm->get('TabEventManager') ;
          $closeTab = new CloseTab() ;
          $closeTab->setEventManager($events) ;
          return $closeTab ;
        },
      ),
    ) ;
  }
}
```

## Rendering the form

Let's put all this together in the controller.

```php
// module/CoffeeBar/src/CoffeeBar/Controler/TabController.php

<?php
namespace CoffeeBar\Controller ;

class TabController
{
  public function closeAction()
  {
    $openTabs = $this->serviceLocator->get('OpenTabs') ;

    $form = $this->serviceLocator->get('CloseTabForm') ;

    $request = $this->getRequest() ;

    $id = (int) $this->params()->fromRoute('id') ;

    // check if the table number is in the HTTP request
    if (isset($id)) {
      // form has been posted
      if($request->isPost()) {
        $form->setData($request->getPost()) ;
 
        // process the datas
      }

      // we will be redirected if the form is validated
      // we won't get to this point of the script

      $status = $openTabs->invoiceForTable($id) ;

      // check that all items of the tab have been served
      try {
        if($status->hasUnservedItems())
        {
          throw new TabHasUnservedItem('Il reste des éléments commandés pour cette table') ;
        }
      } catch (TabHasUnservedItem $e) {
        $this->flashMessenger()->addErrorMessage($e->getMessage());
        return $this->redirect()->toRoute('tab/status', array('id' => $id));
      }

      // no exception raised, no redirection : we can get the form
      // set the value of the hidden id field of the form
      $form->get('id')->setValue($openTabs->tabIdForTable($id)) ;

      // if no table number is get, redirect to the opened tabs page
    } else {
      return $this->redirect()->toRoute('tab/opened');
    }

    $result['status'] = $status ;
    $result['form'] = $form ;
    return array('result' => $result) ;
  }
}
```

The exception, simple and straight

```php
// module/CoffeeBar/src/CoffeeBar/Exception/TabHasUnservedItem.php

<?php
namespace CoffeeBar\Exception ;

use Exception;

class TabHasUnservedItem extends Exception {}
```

The view : listing all items from the invoice and then, rendering the form.

```php
// module/CoffeeBar/view/coffee-bar/tab/close.phtml

<?php
  $tab = $result['status'] ;
  $form = $result['form'] ;
  $form->prepare() ;
?>

<h3>Encaisser pour la table #<?php echo $tab->getTableNumber() ; ?> </h3>

<table> 

<?php
  foreach($tab->getItems() as $item)
  {
?>
    <tr>
      <td><?php echo $item->getMenuNumber() ; ?></td>
      <td><?php echo $item->getDescription() ; ?></td>
      <td><?php echo $item->getPrice() ; ?></td>
    </tr>
<?php
  }
?>
  <tr>
    <td>Total</td>
    <td></td>
    <td><?php echo $tab->getTotal() ; ?></td>
  </tr>
</table>

<?php
  $form->setAttribute('action', $this->url('tab/close', array('id' => $tab->getTableNumber()))) ;
  $form->setAttribute('method', 'post') ;
?>

<?php echo $this->form()->openTag($form) ; ?>

<div class='form-group'>
  <?php echo $this->formRow($form->get('amountPaid')) ; ?>
</div>

<?php
  echo $this->formRow($form->get('security')) ;
  echo $this->formHidden($form->get('id')) ;
  echo $this->formRow($form->get('submit')) ;

  echo $this->form()->closeTag() ;
?>
```

Sorry. This is quick but by now, i hope you all get that part already. Now the route.

```php
// module/CoffeeBar/config/module.config.php
<?php
return array(
  'router' => array(
    'routes' => array(
      'tab' => array(
        'child_routes' => array(
          /**
           * cette URL : http://coffeebar.home/tab/close/{$id} mène à cette route
           */
          'close' => array(
            'type' => 'Segment',
            'options' => array(
              'route' => '/close/[:id]',
              'constraints' => array(
                'id' => '[a-zA-Z0-9_-]+',
              ),
              'defaults' => array(
                'controller' => 'CoffeeBarController\Tab',
                'action' => 'close',
              ),
            ),
            'may_terminate' => true,
          ),
        ),
      ),
    ),
  ),
);
```

Voila.

The form is ready. Rendered. Let's add a 'Checkout' link to the status.phtml page for exemple.

```php
// module/CoffeeBar/view/coffee-bar/tab/status.phtml

<!-- n'importe où dans la page... juste sous le titre par exemple -->
<div><a href="<?php echo $this->url('tab/close', array('id' => $result->getTableNumber())) ;?>">Invoice</a></div>
```

Wait wait wait... let's read again... yes... there's a new unknown method in the controller... we are using a `OpenTabs::invoiceForTable($numéro_de_table)` method... What is that one ?

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Entity\OpenTabs\TabInvoice;

class OpenTabs implements ListenerAggregateInterface
{
  public function invoiceForTable($table)
  {
    $this->loadTodoByTab() ;
    foreach($this->todoByTab->getArrayCopy() as $k => $v)
    {
      if($v->getTableNumber() == $table)
      {
        $status = new TabInvoice() ;
        $status->setTabId($k) ;
        $status->setTableNumber($v->getTableNumber()) ;
        $status->setItems($v->getItemsServed()) ; // CoffeeBar\Entity\OpenTabs\ItemsArray of TabItem
        $status->setHasUnservedItems(count($v->getItemsToServe()) + count($v->getItemsInPreparation())) ;
        return $status ;
      }
    }
    return NULL ;
  }
}
```

The `OpenTabs::invoiceForTable($table)` return a `**CoffeeBar\Entity\OpenTabs\TabInvoice**` object.

We don't need the whole set of *getters*and *setters*so i'll show you how i handle that object.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/OpenTabs/TabInvoice.php

<?php
namespace CoffeeBar\Entity\OpenTabs ;

class TabInvoice
{
  protected $tabId;
  protected $tableNumber;
  protected $items;
  protected $total;
  protected $hasUnservedItems;

  // getter &amp; setter pour $tabId
  // getter &amp; setter pour $tableNumber

  // When we do set the items, we calculate the total in the same time
  public function setItems($items) 
  {
    $this->items = $items;
    $this->getTotal() ;
  }

  public function getItems() 
  {
    return $this->items;
  }

  // we don't setTotal(). The total is calculated from the items list
  public function getTotal() 
  {
    $this->total = 0 ;
    foreach($this->items as $item)
    {
      $this->total += $item->getPrice() ;
    }
    return $this->total;
  }

  // juste un booleen
  // just put in argument the count of non served items (in preparation items and to served items)
  public function setHasUnservedItems($nonServedItemsCount) 
  {
    if($nonServedItemsCount == 0)
    {
      $this->hasUnservedItems = FALSE ;
    } else {
      $this->hasUnservedItems = TRUE ;
    }
  }

  // i changed the getHasUnservedItems() to this hasUnservedItems()... make more sense.
  public function hasUnservedItems() 
  {
    return $this->hasUnservedItems;
  }
}
```

We have the whole set now. All should be fine.

One chapter to go and we will be done. In the last chapter, we will process the form datas and close the tab...

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
