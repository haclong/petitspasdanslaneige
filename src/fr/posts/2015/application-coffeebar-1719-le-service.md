---
title: "Application CoffeeBar 17/19 - Le service"
permalink: "fr/posts/application-coffeebar-1719-le-service.html"
date: "2015-05-05T15:12"
slug: application-coffeebar-1719-le-service
layout: post
drupal_uuid: 0a45ad24-6408-4d35-84e2-d2bc1f4e86a6
drupal_nid: 121
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

summary: "Le staff peut à présent voir en un coup d'oeil la liste des boissons et des plats à servir, par table. On a vu ensemble que les plats servis et les boissons servies ne déclenchaient pas tout à fait le même événement. Voyons à quoi s'en tenir désormais dans nos observers."
---

Le staff peut à présent voir en un coup d'oeil la liste des boissons et des plats à servir, par table. On a vu ensemble que les plats servis et les boissons servies ne déclenchaient pas tout à fait le même événement. Voyons à quoi s'en tenir désormais dans nos observers.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui n'apparaitront plus systématiquement au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

## L'historique des notes

### Traitement des opérations

Les opérations sont systématiquement interceptées par le service **TabAggregate**. C'est là qu'on va effectuer les contrôles de cohérence avant de déclencher véritablement un nouvel événement, validant ainsi la bonne exécution de la commande envoyée.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Event\DrinksServed;
use CoffeeBar\Event\FoodServed;
use CoffeeBar\Exception\DrinksNotOutstanding;
use CoffeeBar\Exception\FoodNotPrepared;

class TabAggregate
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('markDrinksServed', array($this, 'onMarkDrinksServed')) ;
    $this->listeners[] = $events->attach('markFoodServed', array($this, 'onMarkFoodServed')) ;
  }
 
  public function onMarkDrinksServed($events)
  {
    $markDrinksServed = $events->getParam('markDrinksServed') ;
 
    $story = $this->loadStory($markDrinksServed->getId()) ;

    if(!$story->areDrinksOutstanding($markDrinksServed->getDrinks()))
    {
      throw new DrinksNotOutstanding('une ou plusieurs boissons ne font pas parties de la commande') ;
    }
 
    $drinksServed = new DrinksServed() ;
    $drinksServed->setId($markDrinksServed->getId()) ;
    $drinksServed->setDrinks($markDrinksServed->getDrinks()) ;
    $this->events->trigger('drinksServed', $this, array('drinksServed' => $drinksServed)) ;
  }

  public function onMarkFoodServed($events)
  {
    $markFoodServed = $events->getParam('markFoodServed') ;
 
    $story = $this->loadStory($markFoodServed->getId()) ;

    if(!$story->isFoodPrepared($markFoodServed->getFood()))
    {
      throw new FoodNotPrepared('les plats ne sont pas encore prêts') ;
    }
 
    $foodServed = new FoodServed() ;
    $foodServed->setId($markFoodServed->getId()) ;
    $foodServed->setFood($markFoodServed->getFood()) ;
    $this->events->trigger('foodServed', $this, array('foodServed' => $foodServed)) ;
  }
}
```

Pour contrôler l'état des notes avant de déclencher les événements, il faut vérifier

- que les boissons ont bien été commandées et pas encore servies d'une part, et
- que les plats ont bien été préparés et pas encore servis d'autre part.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class TabStory
{
  // on vérifie si les boissons sont bien commandées mais non servies
  public function areDrinksOutstanding(array $menuNumbers)
  {
    return $this->areAllInList($menuNumbers, $this->outstandingDrinks) ;
  }
 
  // on vérifie que les plats sont bien préparés mais non servis
  public function isFoodPrepared(array $menuNumbers)
  {
    return $this->areAllInList($menuNumbers, $this->preparedFood) ;
  }
}
```

Si les boissons à servir n'ont pas été commandés, on retourne une exception `CoffeeBar\Exception\DrinksNotOutstanding`

```php
// module/CoffeeBar/src/CoffeeBar/Exception/DrinksNotOutstanding.php

namespace CoffeeBar\Exception ;

use Exception;

class DrinksNotOutstanding extends Exception {}
```

Si les plats à servir n'ont pas été préparés, on retourne une exception `CoffeeBar\Exception\FoodNotPrepared`

```php
// module/CoffeeBar/src/CoffeeBar/Exception/FoodNotPrepared.php

namespace CoffeeBar\Exception ;

use Exception;

class FoodNotPrepared extends Exception {}
```

Il reste à présenter les deux objets `CoffeeBar\Event\DrinksServed` et `CoffeeBar\Event\FoodServed`

```php
// module/CoffeeBar/src/CoffeeBar/Event/DrinksServed.php

<?php
namespace CoffeeBar\Event ;

class DrinksServed
{
  protected $id ; // int (guid) - id unique de la note
  protected $drinks ; // array - liste des numéros de menu

  // getters &amp; setters
}
```

```php
// module/CoffeeBar/src/CoffeeBar/Event/FoodServed.php

<?php
namespace CoffeeBar\Event ;

class FoodServed
{
  protected $id ; // int (guid) - id unique de la note
  protected $food ; // array - liste des numéros de menu

  // getters &amp; setters
}
```

### Traitement des événements

Une fois que les deux opérations sont traitées par le service **TabAggregate**, deux événements sont déclenchés : '`drinksServed`' et '`foodServed`'.

Rappelons nous que nous sommes dans un café/snack bar. Il faut compter combien nos clients doivent payer. De plus, selon notre scénario, il n'est pas possible de clore une note tant que l'addition n'est pas payée. Au moment de servir les plats et les boissons est le moment idéal pour comptabiliser le montant de chaque élément servi. Ainsi, il ne pourra pas y avoir de litige possible : On ne comptera pas un plat commandé mais non servi.

Lorsqu'on sert un plat et/ou une boisson, on ajoute le prix de l'élément dans le total de la note.

Le *total de la note* est une propriété de l'historique de la note : `TabStory::$itemsServedValue`

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class TabStory
{
  protected $itemsServedValue ; // float - total de la note
 
  public function __construct()
  {
    $this->itemsServedValue = 0 ;
  }

  public function getItemsServedValue() 
  {
    return $this->itemsServedValue;
  }

  public function addValue($value)
  {
    $this->itemsServedValue += $value ;
    return $this->itemsServedValue ;
  }
}
```

Voyons l'articulation dans le service **TabAggregate** :

- Quand une boisson est servie, on la retire de la liste `TabStory::$outstandingDrinks` et on ajoute le prix de la boisson à la propriété `TabStory::$itemsServedValue`.
- Quand un plat est servi, on le retire de la liste `TabStory::$preparedFood` et on ajoute le prix du plat à la propriété `TabStory::$itemsServedValue`.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
namespace CoffeeBar\Service ;

class TabAggregate
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('drinksServed', array($this, 'onDrinksServed')) ;
    $this->listeners[] = $events->attach('foodServed', array($this, 'onFoodServed')) ;
  }
 
  public function onDrinksServed($events)
  {
    $drinksServed = $events->getParam('drinksServed') ;
 
    $story = $this->loadStory($drinksServed->getId()) ;
    foreach($drinksServed->getDrinks() as $drink)
    {
      // on retrouve l'index de l'élément de menu qui est dans le tableau $outstandingDrinks
      $key = $story->getOutstandingDrinks()->getKeyById($drink) ;

      if($key !== null)
      {
        // on récupère le tarif de l'objet OrderedItem qui correspond à l'index identifié plus haut
        $price = $story->getOutstandingDrinks()->offsetGet($key)->getPrice() ;
        $story->addValue($price) ;

        // retrait de l'élément de la liste $outstandingDrinks
        $story->getOutstandingDrinks()->offsetUnset($key) ;
      }
    }
    $this->saveStory($drinksServed->getId(), $story) ;
  }

  public function onFoodServed($events)
  {
    $foodServed = $events->getParam('foodServed') ;

    $story = $this->loadStory($foodServed->getId()) ;
    $story->addEvents($foodServed) ;
 
    foreach($foodServed->getFood() as $food)
    {
      // il faut récupérer l'index du plat servi dans le tableau $preparedFood
      $key = $story->getPreparedFood()->getKeyById($food) ;
 
      if($key !== null)
      {
        // on récupère le prix de l'objet OrderedItem qui correspond à l'index identifié plus haut
        $price = $story->getPreparedFood()->offsetGet($key)->getPrice() ;
        $story->addValue($price) ;
 
        // retrait de l'élément de la liste $preparedFood
        $story->getPreparedFood()->offsetUnset($key) ;
      }
    }
    $this->saveStory($foodServed->getId(), $story) ;
  }
}
```

## Liste des notes ouvertes.

Il faut maintenant modifier également la liste des notes ouvertes.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php

namespace CoffeeBar\Service ;

class OpenTabs implements ListenerAggregateInterface
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('drinksServed', array($this, 'onDrinksServed')) ;
    $this->listeners[] = $events->attach('foodServed', array($this, 'onFoodServed')) ;
  }

  /**
   * Move the served items from the itemsToServe list to the itemsServed list
   * @param Events $events
   */
  public function onDrinksServed($events)
  {
    $drinksServed = $events->getParam('drinksServed') ;

    // on charge l'objet TodoByTab du cache
    $this->loadTodoByTab() ;
    // on récupère l'objet Tab identifié par l'id unique
    $tab = $this->todoByTab->offsetGet($drinksServed->getId()) ;
 
    foreach($drinksServed->getDrinks() as $drink)
    {
      // pour chaque boisson servie, on ne récupère que le numéro de menu correspondant
      // il faut pouvoir identifier à quel index se situe cet élément de menu dans la liste des plats à servir
      // on pourra ainsi manipuler les objets ArrayObject à partir du moment où on sait de quel index on parle
      $key = $tab->getItemsToServe()->getKeyByMenuNumber($drink) ;
      if($key !== null)
      {
        // on récupère l'objet TabItem qui se situe à cet index $key dans l'objet ItemsToServe (ArrayObject)
        $value = $tab->getItemsToServe()->offsetGet($key) ;
        // on reprend l'objet extrait de ItemsToServe (ArrayObject) et on le rajoute dans l'objet ItemsServed (ArrayObject)
        $tab->getItemsServed()->addItem($value) ;
        // on supprime l'objet qui était dans les ItemsToServe (ArrayObject)
        $tab->getItemsToServe()->offsetUnset($key) ;
      }
    }
    // on stocke sur le même index (id unique) l'objet Tab mis à jour avec les nouveaux éléments
    $this->todoByTab->offsetSet($drinksServed->getId(), $tab) ;
    $this->saveTodoByTab() ;
  }
 
  /**
   * Move the served items from the itemsToServe list to the itemsServed list
   * @param Events $events
   */
  public function onFoodServed($events)
  {
    $foodServed = $events->getParam('foodServed') ;

    // on charge l'objet TodoByTab du cache
    $this->loadTodoByTab() ;
    // on récupère l'objet Tab identifié par l'id unique
    $tab = $this->todoByTab->offsetGet($foodServed->getId()) ;
 
    foreach($foodServed->getFood() as $food)
    {
      // pour chaque plat à servir, on ne récupère que le numéro de menu correspondant
      // il faut pouvoir identifier à quel index se situe cet élément de menu dans la liste des plats à servir
      // on pourra ainsi manipuler les objets ArrayObject à partir du moment où on sait de quel index on parle
      $key = $tab->getItemsToServe()->getKeyByMenuNumber($food) ;
      if($key !== null)
      {
        // on récupère l'objet TabItem qui se situe à cet index $key dans l'objet ItemsToServe (ArrayObject)
        $value = $tab->getItemsToServe()->offsetGet($key) ; 
        // on reprend l'objet extrait de ItemsToServed (ArrayObject) et on le rajoute dans l'objet ItemsServed (ArrayObject) 
        $tab->getItemsServed()->addItem($value) ;
        // on supprime l'objet qui était dans les ItemsToServe (ArrayObject) et qui n'y est plus
        $tab->getItemsToServe()->offsetUnset($key) ;
      }
    }
    // on stocke sur le même index (id unique) l'objet Tab mis à jour avec les nouveaux éléments
    $this->todoByTab->offsetSet($foodServed->getId(), $tab) ;
    $this->saveTodoByTab() ;
  }
}
```

Ici aussi, on déplace les éléments d'une liste à une autre.

Dans la liste des notes ouvertes, on déplace les éléments (plats et boissons confondus) de la liste `Tab::$itemsToServe` à la liste `Tab::$itemsServed`

Et nos boissons et plats se déplacent gentimment d'une liste à une autre... Le scénario prend fin lorsque la note est soldée.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
