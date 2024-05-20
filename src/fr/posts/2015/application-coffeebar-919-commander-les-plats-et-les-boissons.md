---
title: "Application CoffeeBar 9/19 - Commander les plats et les boissons"
permalink: "fr/posts/application-coffeebar-919-commander-les-plats-et-les-boissons.html"
date: "2015-03-04T14:05"
slug: application-coffeebar-919-commander-les-plats-et-les-boissons
layout: post
drupal_uuid: 14667901-6ec5-465b-a007-1d3850e16eed
drupal_nid: 111
lang: fr
author: haclong

book:
  book: gerer-un-cafe-avec-une-programmation-evenementielle
  rank: 9,
  top: 
    url: /fr/books/gerer-un-cafe-avec-une-programmation-evenementielle.html
    title: Gérer un café avec une programmation événementielle
  next: 
    url: /fr/posts/application-coffeebar-1019-passer-commande-le-formulaire.html
    title: Application CoffeeBar 10/19 - Passer commande, le formulaire
  previous:
    url: /fr/posts/application-coffeebar-819-afficher-les-notes-en-cours.html
    title: Application CoffeeBar 8/19 - Afficher les notes en cours

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "programmation événementielle"
  - "Event Manager"
  - "events"

sites:
  - "Développement"

summary: "Dans l'article d'aujourd'hui, nous allons voir comment on articule la logique métier autour de l'opération de passer commande. Il faut garder à l'esprit qu'il n'y a qu'un seul écran pour passer commande, à la fois pour les plats comme pour les boissons. Or, nous avons deux workflows distincts pour les boissons et pour les plats. Il faut donc, des éléments commandés, distinguer les boissons des plats et les envoyer dans les bons éléments."
---

Dans l'article d'aujourd'hui, nous allons voir comment on articule la logique métier autour de l'opération de passer commande. Il faut garder à l'esprit qu'il n'y a qu'un seul écran pour passer commande, à la fois pour les plats comme pour les boissons. Or, nous avons deux workflows distincts pour les boissons et pour les plats. Il faut donc, des éléments commandés, distinguer les boissons des plats et les envoyer dans les bons éléments.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui n'apparaitront plus systématiquement au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

Plusieurs éléments entrent dans cette étape. Lors d'une commande, il y a plusieurs plats et boissons qui peuvent être commandés. Nous utilisons tout d'abord une classe intermédiaire qui représente un élément du menu commandé, sans distinguer une boisson d'un plat.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/OrderedItem.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class OrderedItem
{
  protected $id ; // int - Menu number
  protected $description ; // string
  protected $price ; // float
  protected $isDrink ; // bool

  // getters &amp; setters
}
```

Une commande représentant de toutes évidences plusieurs éléments de menu commandés, nous avons un objet pour grouper tous ces éléments.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/OrderedItems.php

<?php
namespace CoffeeBar\Entity\TabStory ;

use ArrayObject;

class OrderedItems extends ArrayObject
{
}
```

Une fois que nous aurons la liste des éléments de menu commandés, nous pourrons établir la liste des boissons et la liste des plats commandés. Tout d'abord grâce à deux méthodes qui vont nous aider à séparer les boissons des plats.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/OrderedItems.php

class OrderedItems
{
  // les autres méthodes

  // retourne un objet de type CoffeeBar\Entity\TabStory\OrderedItems
  public function getDrinkableItems()
  {
    $iterator = $this->getIterator() ;
    $items = new OrderedItems() ;
    // $item de type CoffeeBar\Entity\TabStory\OrderedItem
    foreach($iterator as $item)
    {
      if($item->getIsDrink())
      {
        $items->offsetSet(NULL, $item) ;
      }
    }
    return $items ;
  }
 
  // retourne un objet de type CoffeeBar\Entity\TabStory\OrderedItems
  public function getEatableItems()
  {
    $iterator = $this->getIterator() ;
    $items = new OrderedItems() ;
    // $item de type CoffeeBar\Entity\TabStory\OrderedItem
    foreach($iterator as $item)
    {
      if(!$item->getIsDrink())
      {
        $items->offsetSet(NULL, $item) ;
      }
    }
    return $items ;
  }
}
```

Nous avons enfin l'opération `CoffeeBar\Command\PlaceOrder`. Ici encore, celui ci va déclencher un événement '`placeOrder`' qui doit être intercepté par les différents observers. Il faut donc donner accès au **gestionnaire d'événements**.

```php
// module/CoffeeBar/src/CoffeeBar/Command/PlaceOrder.php

<?php
namespace CoffeeBar\Command ;

use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

class PlaceOrder implements EventManagerAwareInterface
{
  protected $id ; // int
  protected $items ; // CoffeeBar\Entity\TabStory\OrderedItems
  protected $events ;

  // ajouter getters et setters

  // la fonction est nominative. Nous n'allons pas hydrater l'objet placeOrder.
  public function placeOrder($id, $items)
  {
    $this->setId($id) ;
    $this->setItems($items) ;
    $this->events->trigger('placeOrder', '', array('placeOrder' => $this)) ;
  }

  // méthode obligatoire pour l'interface EventManagerAwareInterface
  public function setEventManager(EventManagerInterface $events)
  {
    $this->events = $events;
    return $this;
  }
 
  // méthode obligatoire pour l'interface EventManagerAwareInterface
  public function getEventManager()
  {
    return $this->events;
  }
}
```

De même que lors de l'ouverture de la note, on a eu une opération `CoffeeBar\Command\OpenTab` et au moment où cette opération s'est produite, on a eu un événement `CoffeeBar\Event\TabOpened`, une fois que l'opération `CoffeeBar\Command\PlaceOrder` se produit, cela va produire deux événements : `CoffeeBar\Event\DrinksOrdered` et `CoffeeBar\Event\FoodOrdered`.

L'objet `CoffeeBar\Event\DrinksOrdered`, avec deux propriétés : l'*identification de la note qui a fait la commande* et la *liste des éléments de menu commandés*.

```php
// module/CoffeeBar/src/CoffeeBar/Event/DrinksOrdered.php

<?php
namespace CoffeeBar\Event ;

use CoffeeBar\Entity\TabStory\OrderedItems;

class DrinksOrdered
{
  protected $id ; // guid - id unique de la note
  protected $items ; // CoffeeBar\Entity\TabStory\OrderedItems

  // getters &amp; setters
}
```

L'objet `CoffeeBar\Event\FoodOrdered`, avec deux propriétés : l'*identification de la note qui a fait la commande* et la *liste des éléments de menu commandés*.

```php
// module/CoffeeBar/src/CoffeeBar/Event/FoodOrdered.php

<?php
namespace CoffeeBar\Event ;

use CoffeeBar\Entity\TabStory\OrderedItems;

class FoodOrdered
{
  protected $id ; // guid - id unique de la note
  protected $items ; // CoffeeBar\Entity\TabStory\OrderedItems

  // getters &amp; setters
}
```

Allons maintenant mettre toute cette articulation, cette logique en place dans notre service **TabAggregate**.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php

use CoffeeBar\Command\PlaceOrder;
use CoffeeBar\Event\DrinksOrdered;
use CoffeeBar\Event\FoodOrdered;
use CoffeeBar\Exception\TabNotOpen;

class TabAggregate
{
  // les autres méthodes
  ...

  public function attach(EventManagerInterface $events)
  {
    // si l'événement 'placeOrder' est déclenché, la méthode TabAggregate::onPlaceOrder() s'exécute
    $this->listeners[] = $events->attach('placeOrder', array($this, 'onPlaceOrder')) ;
  }
 
  public function onPlaceOrder($events)
  {
    $placeOrder = $events->getParam('placeOrder') ;

    // chargement de l'historique de la note en utilisant l'id unique
    $story = $this->loadStory($placeOrder->getId()) ;

    // on vérifie si la note n'est pas encore ouverte, on retourne une exception
    if(!$story->isTabOpened())
    {
      throw new TabNotOpen('Tab is not open yet') ; // CoffeeBar\Exception\TabNotOpen
    // sinon, on commande les boissons et les plats
    } else {
      $this->orderDrink($placeOrder) ; // on déclenche l'événement 'drinksOrdered'
      $this->orderFood($placeOrder) ; // on déclenche l'événement 'foodOrdered'
    }
  }

  protected function orderDrink(PlaceOrder $order)
  {
    // pour chacun des éléments de menu de type OrderedItem dans l'objet PlaceOrder,
    // on vérifie si c'est une boisson ou pas
    // $order->getItems() retourne un objet de type OrderedItems
    $drinks = $order->getItems()->getDrinkableItems() ;

    // s'il y a des boissons commandées, on retourne un objet DrinksOrdered()
    // et on déclenche un événement 'drinksOrdered'
    if(count($drinks) != 0)
    {
      $orderedDrinks = new DrinksOrdered() ;
      $orderedDrinks->setId($order->getId()) ;
      $orderedDrinks->setItems($drinks) ;
      $this->events->trigger('drinksOrdered', $this, array('drinksOrdered' => $orderedDrinks)) ;
    }
  }
 
  // même logique pour les plats
  protected function orderFood(PlaceOrder $order)
  {
    $foods = $order->getItems()->getEatableItems() ;

    if(count($foods) != 0)
    {
      $orderedFoods = new FoodOrdered() ;
      $orderedFoods->setId($order->getId()) ;
      $orderedFoods->setItems($foods) ;
      $this->events->trigger('foodOrdered', $this, array('foodOrdered' => $orderedFoods)) ;
    }
  }
}
```

Rapidement, l'exception :

```php
// module/CoffeeBar/src/CoffeeBar/Exception/TabNotOpen.php

namespace CoffeeBar\Exception ;

use Exception;

class TabNotOpen extends Exception {}
```

Dans le prochain article, mettons l'interface en place afin de passer commande et de voir cette articulation en action.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
