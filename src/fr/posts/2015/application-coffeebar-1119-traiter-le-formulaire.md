---
title: "Application CoffeeBar 11/19 - Traiter le formulaire"
permalink: "fr/posts/application-coffeebar-1119-traiter-le-formulaire.html"
date: "2015-03-19T15:04"
slug: application-coffeebar-1119-traiter-le-formulaire
layout: post
drupal_uuid: 231fc264-6df3-4a3c-a9b4-f9b49f547dca
drupal_nid: 113
lang: fr
author: haclong

book:
  book: gerer-un-cafe-avec-une-programmation-evenementielle
  rank: 11,
  top: 
    url: /fr/books/gerer-un-cafe-avec-une-programmation-evenementielle.html
    title: Gérer un café avec une programmation événementielle
  next: 
    url: /fr/posts/application-coffeebar-1219-traiter-la-commande.html
    title: Application CoffeeBar 12/19 - Traiter la commande
  previous:
    url: /fr/posts/application-coffeebar-1019-passer-commande-le-formulaire.html
    title: Application CoffeeBar 10/19 - Passer commande, le formulaire

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

summary: "Le formulaire pour passer la commande est créé et fonctionne convenablement. Dans l'article d'aujourd'hui, nous verrons comment on va associer le formulaire avec un objet et de cet objet, comment on va réussir à déclencher nos événements."
---

Le formulaire pour passer la commande est créé et fonctionne convenablement. Dans l'article d'aujourd'hui, nous verrons comment on va associer le formulaire avec un objet et de cet objet, comment on va réussir à déclencher nos événements.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui auront disparu au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

Pour notre formulaire de commande, nous allons créer un* objet qui représente la commande* (un *id* et la *liste des éléments de menu commandés*) et, bien entendu, un *objet par élément de menu commandé*.

## L'élément de menu

L'objet `CoffeeBar\Entity\TabStory\OrderItem` représente un élément de menu commandé : un plat/une boisson et le nombre de fois que ce plat/boisson est commandé.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/OrderItem.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class OrderItem
{
  protected $id ; // numéro de menu
  protected $number ; // nombre d'éléments commandés

  // getters &amp; setters
}
```

Nous ne pouvons pas utiliser ici les objets `CoffeeBar\Entity\TabStory\OrderedItem` que nous avons créés plus tôt et qui seront traités par l'opération `CoffeeBar\Command\PlaceOrder` parce que nous n'avons pas de correspondance directe entre l'objet `CoffeeBar\Entity\TabStory\OrderedItem` et ce que nous allons obtenir à la validation du formulaire.

Souvenez vous, `CoffeeBar\Entity\TabStory\OrderedItem` comprend l'ensemble des informations d'un élément de menu : son *numéro de menu*, sa *description*, son *prix* et également *si c'est une boisson ou pas*.

Or, à la validation du formulaire, nous n'avons que la valeur des éléments selectionnés dans la liste déroulante : juste les *numéros de menu* et le *nombre de fois* où ils sont commandés.

Attachons un objet à notre élément de menu. Ainsi, à chaque paire `'élément de menu'/'nombre'`, nous l'associons à un objet `CoffeeBar\Entity\TabStory\OrderItem`.

Pour l'hydratation, j'ai opté pour l'hydrator `Zend\Stdlib\Hydrator\ClassMethods` mis à disposition par Zend Framework 2. Lorsqu'on crée un objet `CoffeeBar\Entity\TabStory\OrderItem`, il n'y a aucun événement qui est déclenché. On n'a donc pas besoin (sauf préférence) d'utiliser un hydrator qui nous permettait de customiser notre méthode d'hydratation.

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
    // ajouter dans le constructeur l'hydrator et l'objet OrderItem
    $this->setHydrator(new ClassMethods()) ;
    $this->setObject(new OrderItem()) ;
  }
}
```

Effectivement, dans notre objet `CoffeeBar\Entity\TabStory\OrderItem`, nous retrouvons bien les deux champs du fieldset.

## Le Formulaire

Attachons maintenant un objet au formulaire.

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

Pour le formulaire, on n'était pas obligé de garder l'hydrator `Zend\Stdlib\Hydrator\ArraySerializable`... un oubli de ma part. L'hydrator `Zend\Stdlib\Hydrator\ClassMethods` faisait tout aussi bien l'affaire.

C'est un objet `CoffeeBar\Entity\TabStory\OrderModel`.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/OrderModel.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class OrderModel
{
  protected $id ; // int - table number
  protected $items ; // array de CoffeeBar\Entity\TabStory\OrderItem
 
  // getters &amp; setters

  // méthode obligatoire pour fonctionner avec l'hydrator ArraySerializable
  public function populate($data = array()) {
    isset($data['id']) ? $this->setId($data['id']) : null;
    isset($data['items']) ? $this->setItems($data['items']) : null;
  }

  // méthode obligatoire pour fonctionner avec l'hydrator ArraySerializable
  public function getArrayCopy() {
    return array(
      'id' => $this->id,
      'items' => $this->items,
    ) ;
  }
}
```

## Traitement du formulaire

Après la soumission du formulaire `CoffeeBar\Form\PlaceOrderForm`, on récupère un objet `CoffeeBar\Entity\TabStory\OrderModel` qui est composé d'une propriété `$id` (*le numéro de la table*) et d'un array `$items` (*les éléments de la commande*). Il va nous falloir assainir ces données et les traiter pour en faire un objet `CoffeeBar\Command\PlaceOrder` composé d'un *id unique* (`guid`) et d'un objet `CoffeeBar\Entity\TabStory\OrderedItems`.

Il nous faut tout d'abord préparer une méthode pour *retrouver l'id unique d'une note à partir du numéro de table*.

Quel est donc notre objet qui liste les notes ouvertes ? Je vous le donne dans le mille, `CoffeeBar\Entity\OpenTabs\TodoByTab`, stocké dans le cache à l'index '`openTabs`' et accessible grâce au service **OpenTabs**.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Entity\OpenTabs\TabStatus;

class OpenTabs
{
  /**
   * Retourne l'id de la table
   * @param int $table - Numéro de la table
   * @return id
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

### Le contrôleur

Ainsi, dans le contrôleur, traitons notre objet `CoffeeBar\Entity\TabStory\OrderModel` récupéré après la validation du formulaire.

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
    // utiliser la clé déclarée dans le Service Manager (classe Module)
    $form = $this->serviceLocator->get('PlaceOrderForm') ;
    $request = $this->getRequest() ;

    // vérifier si on connait le numéro de la table pour laquelle on passe commande
    if ($id = (int) $this->params()->fromRoute('id')) {
      $form->get('id')->setValue($id) ;

    // sinon, vérifier si le formulaire a été posté
    } elseif($request->isPost()) {
      $form->setData($request->getPost()) ;

      // s'assurer que le formulaire est valide
      if($form->isValid()) {
        $orderModel = $form->getObject() ; // CoffeeBar\Entity\TabStory\OrderModel
        $tableNumber = $orderModel->getId() ;

        // on charge le service CoffeeBar\Service\OpenTabs
        $openTabs = $this->serviceLocator->get('OpenTabs') ;

        // on charge l'objet CoffeeBar\Command\PlaceOrder
        $placeOrder = $this->serviceLocator->get('PlaceOrderCommand') ;

        // on crée notre objet OrderedItems à partir de l'objet OrderModel
        $items = $this->assignOrderedItems($orderModel) ;

        // l'appel à la méthode PlaceOrder::placeOrder va déclencher un événement placeOrder
        // PlacerOrder::placeOrder(guid, OrderedItems)
        $placeOrder->placeOrder($openTabs->tabIdForTable($tableNumber), $items) ;

        return $this->redirect()->toRoute('tab/status', array('id' => $tableNumber));
      }
    // si on ne sait pas pour quelle table on va passer commande, retourner à la page 'Ouvrir une commande'
    } else {
      return $this->redirect()->toRoute('tab/open');
    }
 
    $result['form'] = $form ;
    return array('result' => $result) ;
  }

  protected function assignOrderedItems(OrderModel $model)
  {
    $items = $this->serviceLocator->get('OrderedItems') ;

    // on récupère l'objet menuItems afin de pouvoir récupérer
    // les informations des éléments de menu à partir du numéro de menu
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

Notez l'utilisation du mot clé `clone`, qui permet d'instancier plusieurs fois l'objet `CoffeeBar\Entity\TabStory\OrderedItem` sans recourir au mot clé `new`. Cela permet d'instancier l'objet dans le **gestionnaire de services** et de gérer les dépendances.

### Le gestionnaire de services

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

Et voila comment, dans le contrôleur, en un tour de passe-passe, on tranforme un objet `CoffeeBar\Entity\TabStory\OrderModel` (numéro de la table, `array(CoffeeBar\Entity\TabStory\OrderItem`)) en un objet `CoffeeBar\Command\PlaceOrder` (guid de la note, `CoffeeBar\Entity\TabStory\OrderedItems`). Un événement '`placeOrder`' a été déclenché, intercepté par le service **TabAggregate**, il a déclenché deux autres événements : '`drinksOrdered`' et '`foodOrdered`'.

Les recommandations que je trouve sur le net préconisent plutot un contrôleur léger (Slim controller). Je le pense aussi. Personnellement, j'aurais envisagé mettre la méthode `TabController::assignOrderedItems(OrderModel $model)` dans un service... Toutefois, cette méthode a une dépendance sur l'objet `CoffeeBar\Entity\MenuItems`. En même temps, la méthode ne fait pas grand chose : récupérer le tableau des éléments de menu et instancier des objets `CoffeeBar\Entity\TabStory\OrderedItem` à partir des numéros de menu commandés. Avec le constructeur qui va bien pour l'objet `CoffeeBar\Entity\TabStory\OrderedItem`, finalement, la méthode peut paraître beaucoup plus légère.

Voyons maintenant ce que les événements '`drinksOrdered`' et '`foodOrdered`' produisent.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
