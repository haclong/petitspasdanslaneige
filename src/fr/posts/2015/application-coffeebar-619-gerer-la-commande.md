---
title: "Application CoffeeBar 6/19 - Gérer la commande"
permalink: "fr/posts/application-coffeebar-619-gerer-la-commande.html"
date: "2015-02-05T18:00"
slug: application-coffeebar-619-gerer-la-commande
layout: post
drupal_uuid: 29149d60-3b61-435a-81b9-c4315dfeb630
drupal_nid: 108
lang: fr
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "Event Manager"
  - "programmation événementielle"

sites:
  - "Développement"

summary: "Nous avons déclenché notre premier événement dans l'article précédent : 'openTab'. Maintenant, il va falloir mettre en place un service qui va intercepter les événements et qui va appliquer les règles métiers.
"
---

Nous avons déclenché notre premier événement dans l'article précédent : '`openTab`'. Maintenant, il va falloir mettre en place un service qui va intercepter les événements et qui va appliquer les règles métiers.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui auront disparu au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

## Le service TabAggregate

Afin d'écouter et d'intercepter les événements qui se produisent sur une note, on va mettre en place un service : le service **TabAggregate**.

- Le service **TabAggregate** écoute les événements qui sont déclenchés par les opérations (`CoffeeBar\Command\*`) et vérifie que l'événement qui est déclenché est cohérent avec les règles métiers.
- Le service **TabAggregate** écoute plusieurs événements différents qui vont tous être déclenchés sur le même **gestionnaire d'événements** : il faudra alors utiliser l'interface `Zend\EventManager\ListenerAggregateInterface`
- Le service **TabAggregate** va déclencher lui même d'autres événements en fonction des méthodes qu'il va utiliser : il faudra alors utiliser l'interface `Zend\EventManager\EventManagerAwareInterface`
- Le service **TabAggregate** stocke dans le cache chacune des notes ouvertes. Il charge les notes une à une identifiée par leur id unique et il les charge à partir du cache quand besoin est. Il y a donc une dépendance avec le cache.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

namespace CoffeeBar\Service ;

use Zend\EventManager\EventManagerInterface;
use Zend\EventManager\ListenerAggregateInterface;
use Zend\EventManager\EventManagerAwareInterface;

class TabAggregate implements ListenerAggregateInterface, EventManagerAwareInterface
{
  protected $listeners = array() ; // voir listenerAggregateInterface
  protected $events ; // voir EventManagerAwareInterface
  protected $cache ; // le cache

  // le gestionnaire d'événement $events va être injecté dans le Service Manager
  // méthode obligatoire si on veut utiliser l'interface EventManagerAwareInterface
  public function setEventManager(EventManagerInterface $events)
  {
    $this->events = $events;
    return $this;
  }
 
  // méthode obligatoire si on veut utiliser l'interface EventManagerAwareInterface
  public function getEventManager()
  {
    return $this->events;
  }

  // le paramètre $events va être injecté lorsqu'on attachera cet objet à notre gestionnaire d'événement, en vertu de l'interface ListenerAggregateInterface
  // méthode obligatoire si on veut utiliser l'interface ListenerAggregateInterface
  public function attach(EventManagerInterface $events)
  {
    // attacher les événements ici + les callback
  }
  
  public function detach(EventManagerInterface $events)
  {
    foreach ($this->listeners as $index => $listener) {
      if ($events->detach($listener)) {
        unset($this->listeners[$index]);
      }
    }
  }
 
  // le cache va être injecté à partir du Service Manager
  public function getCache() 
  {
    return $this->cache;
  }
 
  public function setCache($cache) 
  {
    $this->cache = $cache;
  }
}
```

## Appel au cache

Pour stocker une note dans le cache et charger une note à partir du cache :

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

class TabAggregate
{
  /**
   * Load the tab story by id
   * @param string $id - Tab guid
   */
  public function loadStory($id)
  {
    // on vérifie qu'il existe un élément avec cet id dans le cache
    if($this->cache->hasItem($id))
    {
      // si oui, on retourne l'élément
      return unserialize($this->cache->getItem($id)) ;
    // sinon, on instancie un nouvel objet TabStory() auquel on assigne le nouvel $id
    } else {
      // pour être propre, on devrait cloner un objet TabStory() et ne pas l'instancier d'ici
      $story = new TabStory() ; // ne pas oublier de mettre les instructions use à jour
      $story->setId($id) ;
      return $story ;
    }
  }
 
  /**
   * Stockage en cache
   * @param string $id - Tab guid
   * @param string $event - Objet événement
   */
  protected function saveStory($id, $story)
  { 
    // il faut serializer l'objet $story. Le cache ne prendra pas d'objets.
    $this->cache->setItem($id, serialize($story)) ;
  }
}
```

Très rapidement, la classe `CoffeeBar\Entity\TabStory\TabStory`. Pour le moment, la classe n'a que deux propriétés.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php

<?php
namespace CoffeeBar\Entity\TabStory ;

class TabStory
{
  protected $id ; // int (guid) - identifiant unique de la note
  protected $status ; // bool - si la note est ouverte ou pas

  // définition des constantes
  const CLOSE = false ;
  const OPEN = true ;

  // getters &amp; setters

  public function __construct()
  {
    // par défaut, la note est fermée
    $this->status = self::CLOSE ;
  }

  public function isTabOpened()
  {
    return $this->status ;
  }
 
  public function openTab()
  {
    // on change le statut
    $this->status = self::OPEN ;
    return $this ;
  }
 
  public function closeTab()
  {
    $this->status = self::CLOSE ;
    return $this ;
  }
}
```

Nous voilà en possession d'un service **TabAggregate** qui va intercepter les événements qui surviennent sur la note et qui va déclencher d'autres événements pour les autres observers. Toutefois, **TabAggregate** ne peut pas fonctionner si le gestionnaire d'événements ne sait pas qui écoute qui...

## Attacher le listener au gestionnaire d'événements

Voyons dans la classe `Module` comment dire au gestionnaire d'événements que nous lui ajoutons un nouvel observer / listener.

```php
// module/CoffeeBar/Module.php
<?php
namespace CoffeeBar;

use CoffeeBar\Service\TabAggregate;

class Module
{
  public function getConfig() //

  public function getAutoloaderConfig() //

  public function onBootstrap(MvcEvent $event)
  {
    // cette ligne est déjà là
    $sm = $event->getApplication()->getServiceManager() ;
    // on récupère le gestionnaire d'événement dans le gestionnaire de service
    $em = $sm->get('TabEventManager');
    // au gestionnaire d'événement, on attache le listener TabAggregate
    // ne pas oublier d'aller déclarer le listener TabAggregate dans le service Manager
    $em->attachAggregate($sm->get('TabAggregate')) ;
    // parce qu'on utilise EventManager::attachAggregate,
    // on injecte automatiquement l'objet 'TabEventManager' en argument de la méthode TabAggregate::attach
    // grâce à l'interface ListenerAggregateInterface
  }

  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'TabAggregate' => function($sm) {
          // clé de notre gestionnaire d'événements personnalisé
          $events = $sm->get('TabEventManager') ;
          // clé du TabCacheService dans le Service Manager
          $cache = $sm->get('TabCache') ;
          $tab = new TabAggregate() ;
          // il faut définir un gestionnaire d'événements
          // parce que TabAggregate déclenche des événements
          $tab->setEventManager($events) ;
          $tab->setCache($cache) ;
          return $tab ;
        },
      ),
    ) ;
  }
}
```

Maintenant qu'on a notre gestionnaire d'événements dans lequel on va déclencher nos événements (`EventManagerAwareInterface`) et où on va écouter (`ListenerAggregateInterface`) ainsi qu'un cache valide dans lequel on va pouvoir charger et sauvegarder nos différentes notes, on va pouvoir dérouler nos scenarii.

**NOTE**

Sur le **gestionnaire d'événements** (`EventManager`), il y a la méthode `EventManager::attach()` mais également la méthode `EventManager::attachAggregate()`.

En fait, la méthode `EventManager::attach()` lie le **gestionnaire d'événement**, un événement, un callback. Si un observer doit intercepter plusieurs événements différents, il faudrait répéter (dans le **gestionnaire d'événements**) une méthode `EventManager::attach()` pour chaque événement à attacher et si plusieurs observers sont sur le même événement, il faudrait répéter encore les événements.

Alors que la méthode `EventManager::attachAggregate()` lie le **gestionnaire d'événements** et un objet qui implémente l'interface `ListenerAggregateInterface`. Cela permet, comme ici, de déclarer des observers et gérer la liste des événements attachés à l'intérieur de chaque observer. C'est plus pratique pour regrouper les observers / événements.

Il y a peut être d'autres applications à `EventManager::attachAggregate()` mais je trouve déjà celle-ci bien pratique.

### Voir nos historiques de notes dans le cache

Pour 'espionner' nos notes stockées dans le cache, retournons rapidement dans la vue `module/CoffeeBar/view/coffee-bar/index/index.phtml` où on avait déjà mis deux `var_dump()` pour voir ce qu'il y avait dans les index '`openTabs`' et '`todoList`' du cache.

```php
// module/CoffeeBar/view/coffee-bar/index/index.phtml

// ajouter le code suivant
<pre>
<?php
foreach($result->getOpenTabs() as $k => $v)
{
  var_dump(unserialize($result->getItem($k))) ;
}
?>
</pre>
```

Toutefois, tant que l'index '`openTabs`' du cache n'aura pas été alimenté, il ne sera pas possible de voir les notes.

## Ouvrir une note

On a déclenché (au moment où on a validé notre formulaire) un événement '`openTab`'. Notre service **TabAggregate** va intercepter cet événement et déclencher un second événement : '`tabOpened`'.

```php
use CoffeeBar\Event\TabOpened;

class TabAggregate
{
  public function attach(EventManagerInterface $events)
  {
    // si l'événement 'openTab' est déclenché, la méthode TabAggregate::onOpenTab() s'exécute
    $this->listeners[] = $events->attach('openTab', array($this, 'onOpenTab'));
  }

  // quand on déclenche l'événement 'openTab', on crée un objet $events qui est automatiquement passé en paramètre à la méthode callback (ici, onOpenTab()). L'objet $events est composé du nom de l'événement, d'une cible (target) et d'un tableau de paramètres. Nous allons mettre les données utilies à l'événement dans ce tableau de paramètres et nous pourrons les récupérer avec $events->getParam('clé_du_tableau') ;
  public function onOpenTab($events)
  {
    // nous allons récupérer ici un événement de type CoffeeBar\Command\OpenTab
    $openTab = $events->getParam('openTab') ;
 
    // à partir de l'objet OpenTab en entrée, on crée l'événement CoffeeBar\Event\TabOpened
    $openedTab = new TabOpened() ; // mettre les instructions use à jour
    $openedTab->setId($openTab->getId()) ;
    $openedTab->setTableNumber($openTab->getTableNumber()) ;
    $openedTab->setWaiter($openTab->getWaiter()) ;

    // déclenchement de l'événement tabOpened
    // comme cet événement intéresse notre aggrégat, il faut rajouter un listener plus haut
    $this->events->trigger('tabOpened', $this, array('tabOpened' => $openedTab)) ;
  }
}
```

Après avoir géré l'événement '`openTab`', on va gérer l'événement '`tabOpened`', toujours dans le service **TabAggregate**, les codes ci-dessous s'ajoutant aux codes précédents.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
class TabAggregate
{
  public function attach(EventManagerInterface $events)
  {
    // si l'événement 'tabOpened' est déclenché, la méthode TabAggregate::onTabOpened() s'exécute
    $this->listeners[] = $events->attach('tabOpened', array($this, 'onTabOpened'));
  }

  public function onTabOpened($events)
  {
    $tabOpened = $events->getParam('tabOpened') ;

    // chargement du l'historique de la note à partir de son id unique.
    // comme c'est le premier chargement, notre méthode va instancier un nouvel objet TabStory($id) ;
    $story = $this->loadStory($tabOpened->getId()) ;
    $story->openTab() ;
    $this->saveStory($tabOpened->getId(), $story) ;
  }
}
```

Notre note est enfin ouverte. Voyons comment, à partir de l'événement '`tabOpened`', on alimente la liste des notes ouvertes (vous vous rappelez, l'index '`openTabs`' qui est dans notre cache...)

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
