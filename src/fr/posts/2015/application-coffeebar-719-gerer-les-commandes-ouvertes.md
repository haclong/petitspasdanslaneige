---
title: "Application CoffeeBar 7/19 - Gérer les commandes ouvertes"
permalink: "fr/posts/application-coffeebar-719-gerer-les-commandes-ouvertes.html"
date: "2015-02-12T10:39"
slug: application-coffeebar-719-gerer-les-commandes-ouvertes
layout: post
drupal_uuid: f96f38d4-945e-40b9-901e-841958f71d7b
drupal_nid: 109
lang: fr
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "events"
  - "helpers"

sites:
  - "Développement"

summary: "Nous avons créé précédemment un service qui est chargé de s'occuper de l'historique d'une note indivuellement. Maintenant, nous allons nous occuper de gérer la liste des notes ouvertes. Nous allons utiliser un nouveau service pour cela. Celui-ci va stocker la liste des notes ouvertes et pourra afficher le statut de chaque notes à l'usage du staff du café."
---

Nous avons créé précédemment un service qui est chargé de s'occuper de l'historique d'une note indivuellement. Maintenant, nous allons nous occuper de gérer la liste des notes ouvertes. Nous allons utiliser un nouveau service pour cela. Celui-ci va stocker la liste des notes ouvertes et pourra afficher le statut de chaque notes à l'usage du staff du café.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui auront disparu au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

## Le service OpenTabs

Le service **OpenTabs** va intercepter les différents événements qui se produisent sur une (les) notes. Pour ce faire, il va implémenter l'interface `Zend\EventManager\ListenerAggregateInterface` et pour chaque événement déclenché, on va définir une méthode à exécuter. Notez que le service **OpenTabs** ne va s'occuper que des événements correspondant à des objets Evénements (`CoffeeBar\Event\*`) et non pas aux événements déclenchés par les objets Opérations (`CoffeeBar\Command\*`).

Contrairement au service **TabAggregate** qui chargeait dans le cache un nouvel objet `CoffeeBar\Entity\TabStory\TabStory` par nouvelle note, le service **OpenTabs** ne va manipuler qu'un seul et même objet `CoffeeBar\Entity\OpenTabs\TodoByTab`, stocké dans l'index '`openTabs`' du cache. L'objet `CoffeeBar\Entity\OpenTabs\TodoByTab` hérite de `\ArrayObject`. (<a href="/fr/posts/application-coffeebar-219-installer-la-base-de-d%C3%A9veloppement.html">voir l'installation du cache</a>)

Déclarons tout ça dans notre **gestionnaire de services**. Nous savons déjà que le service **OpenTabs** doit être déclaré comme observer dans notre **gestionnaire d'événements** personnalisé (**TabEventManager**). On fait ce rattachement dans la méthode `Module::onBootstrap()`.

Le service **OpenTabs** - jusqu'à nouvel ordre - ne déclenche aucun événement. Il n'a donc aucune dépendance sur le **gestionnaire d'événements**. En revanche, il manipule l'index '`openTabs`' du cache : il y a donc une dépendance du service **OpenTabs** sur notre cache personnalisé **TabCacheService**. Rappelons nous, ce dernier a une clé '`TabCache`' dans notre **gestionnaire de services**.

```php
// module/CoffeeBar/Module

namespace CoffeeBar;

use CoffeeBar\Service\OpenTabs;

class Module
{
  // les autres méthodes

  public function onBootstrap(MvcEvent $event)
  {
    // cette ligne devrait déjà être présente
    $sm = $event->getApplication()->getServiceManager() ;
    // cette ligne devrait déjà être présente
    $em = $sm->get('TabEventManager');
    // on injecte le gestionnaire d'événements 'TabEventManager'
    // dans la méthode OpenTabs::attach()
    $em->attachAggregate($sm->get('OpenTabs')) ;
  }

  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'OpenTabs' => function($sm) {
          $cache = $sm->get('TabCache') ;
          $openTabs = new OpenTabs() ;
          $openTabs->setCache($cache) ;
          return $openTabs ;
        },
      ),
    ) ;
  }
}
```

Maintenant que les services sont mis en place, voyons à quoi ressemble `CoffeeBar\Service\OpenTabs` dans les détails.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Entity\OpenTabs\ItemsArray;
use CoffeeBar\Entity\OpenTabs\Tab;
use Zend\EventManager\EventManagerInterface;
use Zend\EventManager\ListenerAggregateInterface;

class OpenTabs implements ListenerAggregateInterface
{
  protected $todoByTab ; // TodoByTab (opened tabs list / extending ArrayObject)
  protected $cache ;
  protected $listeners ;
 
  // méthodes obligatoire pour l'interface ListenerAggregateInterface
  // le paramètre $events est automatiquement poussé dans la méthode lorsqu'on attache l'objet OpenTabs au gestionnaire d'événements.
  // ce fonctionnement est automatique grâce à l'interface ListenerAggregateInterface.
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('tabOpened', array($this, 'onTabOpened'));
  }
 
  public function detach(EventManagerInterface $events)
  {
    foreach ($this->listeners as $index => $listener) {
      if ($events->detach($listener)) {
        unset($this->listeners[$index]);
      }
    }
  }
 
  // injection du cache, pour pouvoir y stocker les données et les en extraire
  public function setCache($cache)
  {
    $this->cache = $cache ;
  }
 
  public function getCache()
  {
    return $this->cache ;
  }
 
  // extraction de l'élément 'openTabs' du cache
  protected function loadTodoByTab()
  {
    $this->todoByTab = $this->cache->getOpenTabs() ;
  }
 
  // stockage des données dans l'élément 'openTabs' du cache
  protected function saveTodoByTab()
  {
    // remember, no object allowed
    $this->cache->saveOpenTabs(serialize($this->todoByTab)) ;
  }

  /**
   * Listener to tabOpened event
   * @param Events $events
   */
  public function onTabOpened($events)
  {
    $tabOpened = $events->getParam('tabOpened') ;

    // on charge l'objet ArrayObject du cache
    $this->loadTodoByTab() ;
 
    // on instancie un nouvel objet CoffeeBar\Entity\OpenTabs\Tab
    $tab = new Tab($tabOpened->getTableNumber(), $tabOpened->getWaiter(), new ItemsArray(), new ItemsArray(), new ItemsArray()) ;
    // on ajoute le nouvel objet Tab dans l'objet TodoByTab stocké dans le cache
    // notez que l'index est l'id qui vient de l'objet TabOpened (c'est l'id unique)
    $this->todoByTab->offsetSet($tabOpened->getId(), $tab) ;
    $this->saveTodoByTab() ;
  }
}
```

Rappelons nous : l'index '`openTabs`' du cache contient un objet `CoffeeBar\Entity\OpenTabs\TodoByTab`.

Lorsque nous faisons `OpenTabs::loadTodoByTab()`, on récupère cet objet `CoffeeBar\Entity\OpenTabs\TodoByTab`. Celui ci hérite de l'objet `\ArrayObject`.

Chaque itération de l'objet `CoffeeBar\Entity\OpenTabs\TodoByTab` sera en fait un objet `CoffeeBar\Entity\OpenTabs\Tab`.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/OpenTabs/Tab.php

<?php
namespace CoffeeBar\Entity\OpenTabs ;

class Tab
{
  protected $tableNumber; // int - numéro de la table
  protected $waiter; // string - nom du serveur
  protected $itemsToServe; // ItemsArray - liste des éléments à servir
  protected $itemsInPreparation; // ItemsArray - liste des éléments en préparation
  protected $itemsServed; // ItemsArray - liste des éléments servis
 
  public function __construct($tableNumber, $waiter, ItemsArray $itemsToServe, ItemsArray $itemsInPreparation, ItemsArray $itemsServed)
  {
    $this->setTableNumber($tableNumber) ;
    $this->setWaiter($waiter) ;
    $this->setItemsToServe($itemsToServe) ;
    $this->setItemsInPreparation($itemsInPreparation) ;
    $this->setItemsServed($itemsServed) ;
  }

  // getters &amp; setters
}
```

Et puisqu'on y est, voyons un peu à quoi ressemble `CoffeeBar\Entity\OpenTabs\ItemsArray`.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/OpenTabs/ItemsArray.php

namespace CoffeeBar\Entity\OpenTabs ;

use ArrayObject;

class ItemsArray extends ArrayObject
{
  public function addItem($item)
  {
    $this->offsetSet(NULL, $item) ;
  }
}
```

### Pour résumer

Dans le cache, il y a une clé '`openTabs`' qui est une liste `CoffeeBar\Entity\OpenTabs\TodoByTab` qui hérite de l'objet `\ArrayObject**` (qui se comporte donc comme un tableau (grosso modo)). Chaque élément de cette liste est un objet `CoffeeBar\Entity\OpenTabs\Tab**` qui contient le *numéro de la table*, le *nom du serveur* et trois listes : la *liste des éléments à servir*, la *liste des éléments en préparation* et la *liste des éléments servis*. Chaque liste est un objet `CoffeeBar\Entity\OpenTabs\ItemsArray` qui hérite de l'objet `\ArrayObject`.

Lorsqu'on ouvre une note, on crée donc un objet `CoffeeBar\Entity\TabStory\TabStory` (créé grâce au service **TabAggregate**) et on ajoute un élément `CoffeeBar\Entity\OpenTabs\Tab` dans la liste `CoffeeBar\Entity\OpenTabs\TodoByTab` (créé grâce au service **OpenTabs**).

*Je m'excuse pour les noms qui prêtent à confusion. Je n'ai pas pris le temps de prendre du recul sur le tutoriel d'origine et le framework .Net offre des raccourcis que PHP n'a pas (notamment sur les listes d'objets). J'ai du un peu improviser.*

## Controler les tables occupées

Puisque nous avons enfin la liste des notes ouvertes (donc des tables occupées), nous pouvons contrôler qu'au moment où on ouvre une nouvelle note, la table n'est pas déjà occupée, afin qu'il n'y ait pas deux notes sur la même table.

Récupérons la liste des tables correspondant à une note ouverte.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

class OpenTabs
{
  /**
   * Retourne la liste des tables servies
   * @return array
   */
  public function activeTableNumbers()
  {
    $this->loadTodoByTab() ;
    $array = array() ;
    foreach($this->todoByTab->getArrayCopy() as $k => $v)
    {
      $array[] = $v->getTableNumber() ;
    }
    return sort($array) ;
  }
}
```

Et vérifions que la table n'est pas déjà occupée.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

class OpenTabs
{
  /**
   * Retourne un booléen si la table est déjà ouverte ou pas
   * @param int $id - table number
   */
  public function isTableActive($id)
  {
    if(in_array($id, $this->activeTableNumbers()))
    {
      return TRUE ;
    } else {
      return FALSE ;
    }
  }
}
```

Utilisons cette méthode dans le contrôleur, au moment où on ouvre une note.

J'ai beaucoup hésité...

J'ai d'abord envisagé mettre ce contrôle dans l'objet `CoffeeBar\Command\OpenTab` puisque c'est au moment de déclencher l'événement que je souhaitais vérifier si la table est déjà active ou pas. Toutefois, cela créait une dépendance de l'objet `CoffeeBar\Command\OpenTab`sur le service **OpenTabs**. Ce n'était pas très satisfaisant.

Puis, j'ai pensé qu'il valait mieux déplacer le contrôle dans le service **TabAggregate**. Ainsi, le contrôle aurait pu se déclencer juste avant l'événement '`tabOpened`' mais là encore, il y avait une dépendance entre **TabAggregate** et **OpenTabs**. De plus, le statut (occupée / inoccupée) de la table n'a rien à voir avec l'historique de la note.

Finalement, je m'arrête au contrôleur qui accède par défaut au **gestionnaire de services** et qui va nous permettre d'accéder facilement aux différents services et qui, de surcroît, va traiter les informations du formulaire.

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

use CoffeeBar\Exception\TableNumberUnavailable;
use Zend\Mvc\Controller\AbstractActionController;

class TabController extends AbstractActionController
{
  public function openAction()
  {
    $form = $this->serviceLocator->get('OpenTabForm') ;
    $request = $this->getRequest() ;

    if($request->isPost()) {
      $form->setData($request->getPost()) ;
 
      $posted = $request->getPost() ;

      $openTabs = $this->serviceLocator->get('OpenTabs') ;

      try {
        if($openTabs->isTableActive($posted['tableNumber'])) {
          throw new TableNumberUnavailable('Tab is already opened') ;
        }
      } catch (TableNumberUnavailable $e) {
        $this->flashMessenger()->addErrorMessage($e->getMessage());
        return $this->redirect()->toRoute('tab/open');
      }
 
      if($form->isValid()) {
        $openTab = $form->getObject() ;
        return $this->redirect()->toRoute('tab/order', array('id' => $openTab->getTableNumber()));
      }
    }

    $result['form'] = $form ;
    return array('result' => $result) ;
  }
}
```

Et voila.

L'exception `CoffeeBar\Exception\TableNumberUnavailable` hérite de la classe `\Exception`.

```php
// module/CoffeeBar/src/CoffeeBar/Exception/TableNumberUnavailable.php
namespace CoffeeBar\Exception ;

use Exception;

class TableNumberUnavailable extends Exception {}
```

L'exception capturée est envoyée dans l'aide d'action '`flashMessenger()`'. Pour l'afficher dans la vue, il suffit d'utiliser l'aide de vue correspondante.

```php
// module/Application/view/layout/layout.phtml

... html divers

<div class="container">
  <?php echo $this->flashMessenger()->render('error'); ?>
  <?php echo $this->content; ?>

  ...
</div>
```

L'architecture de notre application prend forme petit à petit.

Nous avons désormais :

- une **architecture MVC*** pour structurer notre application.
- un **cache** pour gérer la couche persistence de données (évidemment, sur des projets à long terme il faudra utiliser des solutions plus perennes, comme une base de données).
- un **gestionnaire d'événements** pour gérer les événements déclenchés et leurs observers.
- un **gestionnaire de services** pour gérer les dépendances entre les objets et les services.

- un service **TabAggregate** pour gérer la logique métier sur une seule note et pour déclencher les événements qui vont bien.
- un service **OpenTabs** pour gérer la logique métier sur l'ensemble des notes ouvertes et pour écouter les événements déclenchés.

L'architecture MVC, le cache, les gestionnaires de services et d'événements sont des composants natifs du framework Zend Framework 2 et sont appelés par défaut lorsqu'on installe une squelette d'application ZF2.

Allons ajouter quelques écrans sympathiques avant d'aller plus loin.

*You'll find the full application in my <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
