---
title: "Application CoffeeBar 15/19 - Les plats sont prêts, réaction."
permalink: "fr/posts/application-coffeebar-1519-les-plats-sont-prets-reaction.html"
date: "2015-04-21T14:02"
slug: application-coffeebar-1519-les-plats-sont-prets-reaction
layout: post
drupal_uuid: bd18552c-7719-421d-a864-c5a8826c8c88
drupal_nid: 119
lang: fr
author: haclong

book:
  book: gerer-un-cafe-avec-une-programmation-evenementielle
  rank: 15,
  top: 
    url: /fr/books/gerer-un-cafe-avec-une-programmation-evenementielle.html
    title: Gérer un café avec une programmation événementielle
  next: 
    url: /fr/posts/application-coffeebar-1619-afficher-la-todo-list-du-staff.html
    title: Application CoffeeBar 16/19 - Afficher la todo list du staff
  previous:
    url: /fr/posts/application-coffeebar-1419-marquer-les-plats-prepares.html
    title: Application CoffeeBar 14/19 - Marquer les plats préparés

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "OOP"
  - "events"
  - "Event Manager"
  - "programmation événementielle"

sites:
  - "Développement"

summary: "Les plats sont préparés et prêts à servir. L'événement 'foodPrepared' a été déclenché. Voyons ce qu'il déclenche dans nos différents observers."
---

Les plats sont préparés et prêts à servir. L'événement 'foodPrepared' a été déclenché. Voyons ce qu'il déclenche dans nos différents observers.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui n'apparaitront plus systématiquement au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

## Voici ce qu'on peut dire

- Dans l'*historique de la note*, les plats qui figurent dans la liste `TabStory::$outstandingFood` seront retirés de cette liste mais seront déplacés vers une nouvelle liste `TabStory::$preparedFood`.
- Concernant la *todo list du chef* cuisine, les *plats préparés vont disparaître* de sa liste de plats à préparer.
- Concernant la *liste des notes actives*, les éléments qui étaient dans la liste `Tab::$itemsInPreparation` seront déplacés dans la liste `Tab::$itemsToServe`.

## L'historique de la note

Les plats commandés mais pas encore préparés sont stockés dans chacune des listes `TabStory::$outstandingFood`. Pour chaque numéro de menu correspondant à un plat préparé, il faut identifier à quel *index* est stocké ce plat dans le tableau `TabStory::$outstandingFood` afin de pouvoir supprimer cet index.

La propriété `TabStory::$outstandingFood` est un objet de type `CoffeeTab\Entity\TabStory\OrderedItems` (héritant de `\ArrayObject`). Il nous faut la méthode qui, avec le numéro de menu, peut retourner l'*index* de ce numéro dans la propriété `TabStory::$outstandingFood`.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/OrderedItems.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class OrderedItems extends ArrayObject
{
  // $id = numéro de menu en argument
  public function getKeyById($id)
  {
    $iterator = $this->getIterator() ;
 
    // on parcourt tout le tableau
    foreach($iterator as $key => $value)
    {
      // on vérifie à quel moment on a une $value qui correspond au numéro de menu en argument.
      // quand on a une correspondance (positive), on retourne l'index de cette $value.
      if($value->getId() == $id) 
      {
        return $key ;
      }
    }
  }
}
```

Les plats préparés sont stockés dans une nouvelle propriété `TabStory::$preparedFood`.

```php
// module/CoffeeBar/src/CoffeeBar/TabStory/TabStory.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class TabStory
{
  protected $preparedFood ; // CoffeeBar/Entity/TabStory/OrderedItems
 
  public function __construct()
  {
    $this->preparedFood = new OrderedItems() ;
  }

  public function getPreparedFood() 
  {
    return $this->preparedFood;
  }

  public function addPreparedFood($food) 
  {
    foreach($food as $item)
    {
      $this->preparedFood->offsetSet(NULL, $item) ;
    }
  }
}
```

Allons maintenant supprimer les plats préparés de la liste `TabStory::$outstandingFood` et allons les rajouter dans la liste `TabStory::$preparedFood`

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
class TabAggregate
{
  ...
 
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('foodPrepared', array($this, 'onFoodPrepared')) ;
  }

  public function onFoodPrepared($events)
  {
    $foodPrepared = $events->getParam('foodPrepared') ;
 
    $story = $this->loadStory($foodPrepared->getId()) ;
 
    foreach($foodPrepared->getFood() as $food)
    {
      // idenfier la clé du plat préparé dans la liste $outstandingFood
      $key = $story->getOutstandingFood()->getKeyById($food) ;
 
      if($key !== null)
      {
        // récupérer l'élément OrderedItem correspondant à la clé
        $value = $story->getOutstandingFood()->offsetGet($key) ;

        // supprimer l'élément dans la liste $outstandingFood avec la clé
        $story->getOutstandingFood()->offsetUnset($key) ;

        // ajouter l'élément dans la liste $preparedFood
        $story->getPreparedFood()->offsetSet(NULL, $value) ;
      }
    }
    $this->saveStory($foodPrepared->getId(), $story) ;
  }
}
```

Voilà pour l'historique de la note.

## Todolist du chef

Voyons maintenant ce qu'il se passe pour la todoList du chef cuisinier : quand le plat est préparé, il faut le retirer de la liste du chef, bien sûr.

```php
// module/CoffeeBar/src/CoffeeBar/Service/ChefTodoList.php

<?php
namespace CoffeeBar\Service;

class ChefTodoList implements ListenerAggregateInterface
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('foodPrepared', array($this, 'onFoodPrepared')) ;
  }

  public function onFoodPrepared($events)
  {
    $foodPrepared = $events->getParam('foodPrepared') ;

    $this->loadTodoList() ;

    foreach($this->todoList as $key => $item)
    {
      // si l'id unique de la note dans la todolist correspond
      // à l'id unique de la note dans l'événement $foodPrepared'
      if($item->getTab() == $foodPrepared->getId())
      {
        $groupKey = $key ;
        $group = $item ;
      }
    }
 
    // $foodPrepared->getFood retourne la liste des numéros de menu préparés
    foreach($foodPrepared->getFood() as $food)
    {
      // il faut identifier la clé du plat préparé dans la todoList du chef
      $key = $group->getKeyByMenuNumber($food) ;
      if($key !== null)
      {
        // retirer le plat préparé de la todolist du chef
        $group->getItems()->offsetUnset($key) ;
      }
    }
 
    // s'il n'y a plus d'éléments dans la propriété TodoListGroup::items
    // alors retirer l'élément TodoListGroup
    if(count($group->getItems()) == 0)
    {
      $this->todoList->offsetUnset($groupKey) ;
    }
 
    $this->saveTodoList() ;
  }
}
```

Ici encore, identifions l'élément avec le numéro de menu, cette fois ci dans l'objet `CoffeeBar\Entity\ChefTodoList`

```php
// module/CoffeeBar/src/CoffeeBar/Entity/ChefTodoList/TodoListGroup.php

<?php
namespace CoffeeBar\Entity\ChefTodoList;

class TodoListGroup {
  // $menuNumber = numéro de menu passé en argument
  public function getKeyByMenuNumber($menuNumber)
  {
    // itération sur le tableau $items
    foreach($this->getItems() as $key => $value)
    {
      // si une valeur est trouvée, correspondant au numéro de menu passé en argument
      // retourner l'index
      if($value->getMenuNumber() == $menuNumber)
      {
        return $key ;
      }
    }
  }
}
```

## Liste des notes ouvertes

Et maintenant, au tour de la liste des notes ouvertes

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Entity\OpenTabs\TabStatus;

class OpenTabs
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('foodPrepared', array($this, 'onFoodPrepared')) ;
  }

  /**
   * Move the prepared items from the itemsInPreparation list to the itemsToServe list
   * @param Events $events
   */
  public function onFoodPrepared($events)
  {
    $foodPrepared = $events->getParam('foodPrepared') ;

    $this->loadTodoByTab() ;
    $tab = $this->todoByTab->offsetGet($foodPrepared->getId()) ;
 
    // on récupère la liste des numéros de menu des plats préparés
    foreach($foodPrepared->getFood() as $food)
    {
      // ici aussi, on récupère l'index du tableau avec le numéro de menu
      $key = $tab->getItemsInPreparation()->getKeyByMenuNumber($food) ;
      if($key !== null)
      {
        // on récupère l'élément stocké à cet index
        $value = $tab->getItemsInPreparation()->offsetGet($key) ;

        // on ajoute l'élément à la liste de $itemsToServe
        $tab->getItemsToServe()->addItem($value) ;

        // on supprime l'élément de la liste $itemsInPreparation
        $tab->getItemsInPreparation()->offsetUnset($key) ;
      }
    }
    $this->todoByTab->offsetSet($foodPrepared->getId(), $tab) ;
    $this->saveTodoByTab() ;
  }
}
```

La propriété `Tab::$itemsInPreparation` est un objet de type `CoffeeBar\Entity\OpenTabs\ItemsArray`. Ici encore, mettons en place la même méthode : identifier l'index du tableau à l'aide du numéro de menu.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/OpenTabs/ItemsArray.php

<?php
namespace CoffeeBar\Entity\OpenTabs ;

class ItemsArray extends ArrayObject
{
  public function getKeyByMenuNumber($menuNumber)
  {
    $iterator = $this->getIterator() ;
 
    foreach($iterator as $key => $value)
    {
      if($value->getMenuNumber() == $menuNumber)
      {
        return $key ;
      }
    }
  }
}
```

### Conclusion

Ainsi, quand l'événement '*foodPrepared*' est déclenché :

- les plats préparés disparaissent de la todolist du chef cuisinier
- les plats préparés disparaissent de la liste `Tab::$itemsInPreparation` et rejoignent la liste `Tab::$itemsToServe`
- les plats préparés disparaissent de la liste `TabStory::$outstandingFood` et rejoignent la liste `TabStory::$preparedFood`

Il reste à servir tout ça.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
