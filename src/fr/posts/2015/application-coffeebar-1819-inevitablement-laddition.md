---
title: "Application CoffeeBar 18/19 - Inévitablement, l'addition"
permalink: "fr/posts/application-coffeebar-1819-inevitablement-laddition.html"
date: "2015-05-26T15:58"
slug: application-coffeebar-1819-inevitablement-laddition
layout: post
drupal_uuid: 0ac02d5f-30b0-4a00-809b-b9c8986173bd
drupal_nid: 122
lang: fr
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

summary: "Le service se fait. Les boissons commandées, les plats préparés sont servis les uns après les autres. Doucement, le total des éléments servis s'additionne. Maintenant, les clients souhaitent quitter la table... Et payer la note."
---

Le service se fait. Les boissons commandées, les plats préparés sont servis les uns après les autres. Doucement, le total des éléments servis s'additionne. Maintenant, les clients souhaitent quitter la table... Et payer la note.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui n'apparaitront plus systématiquement au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

## Encaisser le client

Voyons comment on encaisse le client.

### Préparation du formulaire

Le formulaire n'a qu'un seul champ de saisie : c'est le champ dans lequel on va saisir le montant payé par le client. Le montant à payer va s'afficher hors des champs de formulaire.

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
 
    // le champ id est un id unique (guid) caché
    // il sera généré automatiquement dans la vue
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

Encore une fois, on n'a pas assigné d'objet, puisque, vous vous en doutez maintenant, notre objet `CoffeeBar\Command\CloseTab` a une dépendance sur le gestionnaire d'événements...

Dépendances ?? mais bien sûr, le **gestionnaire de services**.

Mais avant tout, un petit coup d'oeil sur l'opération `CoffeeBar\Command\CloseTab`

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
  public function populate($data = array()) 
  {
    $this->id = (isset($data['id'])) ? $data['id'] : null;
    $this->amountPaid = (isset($data['amountPaid'])) ? $data['amountPaid'] : null;
 
    $this->events->trigger('closeTab', '', array('closeTab' => $this)) ;
  }
    
  public function getArrayCopy() 
  {
    return array(
      'id' => $this->id,
      'amountPaid' => $this->amountPaid,
    ) ;
  }
}
```

Et la classe `CoffeeBar\Module`

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
        // on assigne l'objet au formulaire
        'CloseTabForm' => function($sm) {
          $form = new CloseTabForm() ;
          $form->setObject($sm->get('CloseTabCommand')) ;
          return $form ;
        },
        // on gère la dépendance de l'objet CloseTab sur le gestionnaire d'événements TabEventManager
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

## Affichage du formulaire

Il n'y a plus qu'à mettre tout ça en place pour le contrôleur.

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

    // vérifier si on connait le numéro de la table pour laquelle on va encaisser
    if (isset($id)) {
      // vérifier si le formulaire a été posté
      if($request->isPost()) {
        $form->setData($request->getPost()) ;
 
        // traiter le formulaire
      }

      // le traitement du formulaire va faire les redirections qui s'imposent
      // on n'arrivera ici que si le formulaire n'a pas été traité

      $status = $openTabs->invoiceForTable($id) ;

      // on vérifie que tous les plats et boissons ont été servis
      try {
        if($status->hasUnservedItems())
        {
          throw new TabHasUnservedItem('Il reste des éléments commandés pour cette table') ;
        }
      } catch (TabHasUnservedItem $e) {
        $this->flashMessenger()->addErrorMessage($e->getMessage());
        return $this->redirect()->toRoute('tab/status', array('id' => $id));
      }

      // plus rien ne s'oppose à l'affichage du formulaire
      // on assigne l'id unique de la table au champ caché du formulaire
      $form->get('id')->setValue($openTabs->tabIdForTable($id)) ;

    // si on ne sait pas pour quelle table on va encaisser, retourner à la page 'Liste des commandes ouvertes'
    } else {
      return $this->redirect()->toRoute('tab/opened');
    }

    $result['status'] = $status ;
    $result['form'] = $form ;
    return array('result' => $result) ;
  }
}
```

L'exception, juste un héritage de la classe `Exception` par défaut

```php
// module/CoffeeBar/src/CoffeeBar/Exception/TabHasUnservedItem.php

<?php
namespace CoffeeBar\Exception ;

use Exception;

class TabHasUnservedItem extends Exception {}
```

La vue

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

Je passe rapidement. J'espère que tout est clair sur cette partie. Il nous reste la route à préparer et on passera dans le vif du sujet.

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

Voila

Le formulaire est prêt. Ajoutons un lien 'Encaisser la table' sur la page `status.phtml` par ex.

```html
// module/CoffeeBar/view/coffee-bar/tab/status.phtml

<!-- n'importe où dans la page... juste sous le titre par exemple -->

<div><a href="<?php echo $this->url('tab/close', array('id' => $result->getTableNumber())) ;?>">Invoice</a></div>
```

Si vous ne l'avez pas fait, on peut également rajouter un lien vers la page pour placer une commande (histoire de rajouter des boissons ou des plats)

```html
// module/CoffeeBar/view/coffee-bar/tab/status.phtml

<!-- n'importe où dans la page... juste sous le titre par exemple -->

<div><a href="<?php echo $this->url('tab/order', array('id' => $result->getTableNumber())) ;?>">Order Food/Drink</a></div></pre>
```

Mais attendez, il nous manque des éléments... Dans notre contrôleur, on utilise une méthode `OpenTabs::invoiceForTable($numéro_de_table)`.

En effet, dans notre liste de notes ouvertes, nous pouvons, avec le numéro de la table, récupérer la 'facture' de la note (la liste des éléments qui ont été servis)

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
        $status->setItems($v->getItemsServed()) ;
        $status->setHasUnservedItems(count($v->getItemsToServe()) + count($v->getItemsInPreparation())) ;
        return $status ;
      }
    }
    return NULL ;
  }
}
```

Cette méthode `OpenTabs::invoiceForTable($table)` retourne un objet `CoffeeBar\Entity\OpenTabs\TabInvoice`.

Exceptionnellement, pour cet objet, je n'ai pas défini tous les *getters* et *setters*. Je vous mets donc à disposition l'intégralité de l'objet.

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

  // lorsqu'on set les items, on en profite pour calculer le total (setTotal)
  public function setItems($items) 
  {
    $this->items = $items;
    $this->getTotal() ;
  }

  public function getItems() 
  {
    return $this->items;
  }

  // il n'y a pas de setTotal puisque la valeur ne viendra jamais de l'extérieur.
  // c'est la liste des éléments servis de la note qui calcule le total de la note
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
  // en entrée, le nombre d'éléments sur la note qui n'ont pas été servis.
  public function setHasUnservedItems($nonServedItemsCount) 
  {
    if($nonServedItemsCount == 0)
    {
      $this->hasUnservedItems = FALSE ;
    } else {
      $this->hasUnservedItems = TRUE ;
    }
  }

  // il n'y a pas de getHasUnservedItems() parce que je trouvais que ce n'était pas très joli...
  public function hasUnservedItems() 
  {
    return $this->hasUnservedItems;
  }
}
```

Nous avons enfin tout. Le formulaire devrait maintenant s'afficher convenablement.

Allez ! plus qu'un tout petit dernier article et nous en aurons enfin fini avec ce tutoriel. Dans le prochain article, je vous le donne dans le mille, on va traiter le formulaire et clore notre note.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
