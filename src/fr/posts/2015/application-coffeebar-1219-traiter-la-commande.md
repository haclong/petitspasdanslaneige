---
title: "Application CoffeeBar 12/19 - Traiter la commande"
permalink: "fr/posts/application-coffeebar-1219-traiter-la-commande.html"
date: "2015-03-26T15:36"
slug: application-coffeebar-1219-traiter-la-commande
layout: post
drupal_uuid: cec8d17c-8540-48bd-94d5-b1501d4f4894
drupal_nid: 114
lang: fr
author: haclong

book:
  book: gerer-un-cafe-avec-une-programmation-evenementielle
  rank: 12,
  top: 
    url: /fr/books/gerer-un-cafe-avec-une-programmation-evenementielle.html
    title: Gérer un café avec une programmation événementielle
  next: 
    url: /fr/posts/application-coffeebar-1319-la-todo-list-du-chef.html
    title: Application CoffeeBar 13/19 - La Todo list du Chef
  previous:
    url: /fr/posts/application-coffeebar-1119-traiter-le-formulaire.html
    title: Application CoffeeBar 11/19 - Traiter le formulaire

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

summary: "Lorsqu'on place une commande, deux événements sont déclenchés. Un premier événement qui signale que les boissons sont commandées et un second événement qui signale que les plats sont commandés. Selon le workflow défini initialement, les plats et les boissons ne suivent pas le même traitement. L'article d'aujourd'hui mets en place - du moins pour le début - les deux traitements différents."
---

Lorsqu'on place une commande, deux événements sont déclenchés. Un premier événement qui signale que les boissons sont commandées et un second événement qui signale que les plats sont commandés. Selon le workflow défini initialement, les plats et les boissons ne suivent pas le même traitement. L'article d'aujourd'hui mets en place - du moins pour le début - les deux traitements différents.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui auront disparu au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

Le workflow est le suivant : lorsque les boissons sont commandées ('`drinksOrdered`'), on peut les servir directement. En revanche, lorsque les plats sont commandés ('`foodOrdered`'), il faut les préparer avant de les servir.

## Traitement des boissons commandées

Voyons d'abord ce qu'il se passe pour les boissons.

### Gérer l'historique de la note.

L'historique de la note est maintenue par le service **TabAggregate**.

Lorsque les boissons sont commandées, on va ajouter cette information dans l'historique de la note, dans une propriété `TabStory::$outstandingDrinks` qui représente la liste des boissons commandées mais pas encore servies.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php

class TabStory
{
  /**
   * liste des boissons commandées, non servies
   * @var CoffeeBar\Entity\TabStory\OrderedItems
   */
  protected $outstandingDrinks ;

  public function __construct()
  {
    $this->outstandingDrinks = new OrderedItems() ;
  }

  // les autres méthodes

  public function addOutstandingDrinks($drinks)
  {
    foreach($drinks as $drink)
    {
      // ajouter des éléments $drink dans un objet ArrayObject
      // offsetSet() est une méthode de l'objet ArrayObject
      $this->outstandingDrinks->offsetSet(NULL, $drink) ;
    }
  }

  public function getOutstandingDrinks() 
  {
    return $this->outstandingDrinks;
  }
}
```

Quand l'événement '`drinksOrdered`' est déclenché, le service **TabAggregate** va intercepter cet événement et va mettre l'historique de la note à jour.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php

class TabAggregate
{
  ...
  
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('drinksOrdered', array($this, 'onDrinksOrdered')) ;
  }

  public function onDrinksOrdered($events)
  {
    $drinksOrdered = $events->getParam('drinksOrdered') ;
 
    $story = $this->loadStory($drinksOrdered->getId()) ;
    // où on liste les boissons commandées dans l'historique de la note
    $story->addOutstandingDrinks($drinksOrdered->getItems()) ;
    $this->saveStory($drinksOrdered->getId(), $story) ;
  }
}
```

### Liste des notes ouvertes

D'un autre côté, lorsque des boissons sont commandées, celles-ci figurent aussi dans la liste des notes ouvertes, dans la propriété `Tab::$itemsToServe`.

Pour chaque boisson commandée, on va assigner les informations de la boisson à un objet `CoffeeBar\Entity\OpenTabs\TabItem`

```php
// module/CoffeeBar/src/CoffeeBar/Entity/OpenTabs/TabItem.php

<?php
namespace CoffeeBar\Entity\OpenTabs ;

class TabItem
{
  protected $menuNumber; // int - id de l'élément du menu
  protected $description; // string - descriptif du menu
  protected $price; // float - prix
 
  public function __construct($menuNumber, $description, $price)
  {
    $this->setMenuNumber($menuNumber) ;
    $this->setDescription($description) ;
    $this->setPrice($price) ;
  }

  // getters &amp; setters
}
```

Notez qu'arrivé là, on n'a plus besoin de savoir si l'élément commandé est un plat ou une boisson. On n'a donc pas conservé le flag '`$isDrink`'. Arrivé là, on sait déjà quoi faire des boissons et quoi faire des plats...

Quand l'événement '`drinksOrdered`' est déclenché, le service **OpenTabs** va intercepter cet événement et mettre l'objet `CoffeeBar\Entity\OpenTabs\Tab` à jour

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Entity\OpenTabs\TabItem;

class OpenTabs implements ListenerAggregateInterface
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('drinksOrdered', array($this, 'onDrinksOrdered')) ;
  }

  /**
   * Listener add drinks ordered tab content
   * @param Events $events
   */
  public function onDrinksOrdered($events)
  {
    $drinksOrdered = $events->getParam('drinksOrdered') ;

    // on charge l'objet TodoByTab (ArrayObject) du cache
    $this->loadTodoByTab() ;
    // on récupère l'objet Tab identifié par l'id unique
    $tab = $this->todoByTab->offsetGet($drinksOrdered->getId()) ;
 
    foreach($drinksOrdered->getItems() as $drink)
    { 
      // on crée un nouvel objet TabItem pour chaque boisson commandée
      $item = new TabItem($drink->getId(), $drink->getDescription(), $drink->getPrice()) ;

      // on ajoute ce TabItem à la liste des ItemsToServe (ItemsArray) de la note courante
      $tab->getItemsToServe()->addItem($item) ; // CoffeeBar\Entity\OpenTabs\ItemsArray::addItem()
    }
    // on stocke sur le même index (id unique) l'objet Tab mis à jour avec les nouveaux éléments
    $this->todoByTab->offsetSet($drinksOrdered->getId(), $tab) ;
    $this->saveTodoByTab() ;
  }
}
```

Ainsi, lorsqu'une boisson est commandée, elle est ajoutée

- à la *liste des boissons commandées mais pas encore servies* (`TabStory::$outstandingDrinks`)
- mais également à la *liste des éléments à servir* (`Tab::$itemsToServe`).

## Traitement des plats commandés

Sur le même principe, voyons comment on traite les plats commandés.

### Dans l'historique de la note.

Les plats commandés viennent alimenter une propriété `TabStory::$outstandingFood` qui représente la liste des plats commandés mais pas encore préparés.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php

class TabStory
{
  /**
   * liste des plats commandés, non préparés
   * @var CoffeeBar\Entity\TabStory\OrderedItems
   */
  protected $outstandingFood ;

  public function __construct()
  {
    $this->outstandingFood = new OrderedItems() ;
  }

  // les autres méthodes

  public function addOutstandingFood($food)
  {
    foreach($food as $item)
    {
      // ajouter des éléments $item dans un objet ArrayObject
      // offsetSet() est une méthode de l'objet ArrayObject
      $this->outstandingFood->offsetSet(NULL, $item) ;
    }
  }
 
  public function getOutstandingFood() 
  {
    return $this->outstandingFood;
  }
}
```

Lorsque l'événement '`foodOrdered`' est déclenché, le service **TabAggregate** intercepte l'événement et mets l'historique de la note à jour.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
class TabAggregate
{
  ...
 
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('foodOrdered', array($this, 'onFoodOrdered')) ;
  }

  public function onFoodOrdered($events)
  {
    $foodOrdered = $events->getParam('foodOrdered') ;
 
    $story = $this->loadStory($foodOrdered->getId()) ;
    // où on liste les plats commandés dans l'historique de la note
    $story->addOutstandingFood($foodOrdered->getItems()) ;
    $this->saveStory($foodOrdered->getId(), $story) ;
  }
}
```

### Liste des notes ouvertes

Ici encore, pour chaque plat commandé, on va instancier un objet `CoffeeBar\Entity\OpenTabs\TabItem`.

Ces objets `CoffeeBar\Entity\OpenTabs\TabItem` vont s'incrémenter dans une propriété `Tab::$itemsInPreparation`.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Entity\OpenTabs\TabItem;

class OpenTabs implements ListenerAggregateInterface
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('foodOrdered', array($this, 'onFoodOrdered')) ;
  }

  /**
   * Listener add food ordered tab content
   * @param Events $events
   */
  public function onFoodOrdered($events)
  {
    $foodOrdered = $events->getParam('foodOrdered') ;

    // on charge l'objet TodoByTab (ArrayObject) du cache
    $this->loadTodoByTab() ;
    // on récupère l'objet Tab identifié par l'id unique
    $tab = $this->todoByTab->offsetGet($foodOrdered->getId()) ;
 
    foreach($foodOrdered->getItems() as $food)
    {
      // on crée un nouvel objet TabItem pour chaque plat commandée
      $item = new TabItem($food->getId(), $food->getDescription(), $food->getPrice()) ;
      // on ajoute ce TabItem à la liste des ItemsInPreparation (ArrayObject) de la note courante
      $tab->getItemsInPreparation()->addItem($item) ; // CoffeeBar\Entity\OpenTabs\ItemsArray::addItem()
    }
 
    // on stocke sur le même index (id unique) l'objet Tab mis à jour avec les nouveaux éléments
    $this->todoByTab->offsetSet($foodOrdered->getId(), $tab) ;
    $this->saveTodoByTab() ;
  }
}
```

Notons que les plats commandés s'ajoutent à la liste des éléments en préparation (`Tab::$itemsInPreparation`) et non pas à la liste des éléments à servir (`Tab::$itemsToServe`). Comme pour la propriété `Tab::$itemsToServe`, la propriété `Tab::$itemsInPreparation` est un objet de type `CoffeeBar\Entity\OpenTabs\ItemsArray`. La méthode `ItemsArray::addItem()` est alors disponible.

Les boissons à servir et les plats à préparer devraient désormais apparaître sur la page du statut de la note. Dans le prochain article, nous allons nous occuper de la vue du chef : voir les plats à préparer et comment signaler que des plats sont préparés.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
