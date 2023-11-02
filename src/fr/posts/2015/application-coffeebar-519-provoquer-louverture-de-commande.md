---
title: "Application CoffeeBar 5/19 - Provoquer l'ouverture de commande"
permalink: "fr/posts/application-coffeebar-519-provoquer-louverture-de-commande.html"
date: "2015-01-28T17:18"
slug: application-coffeebar-519-provoquer-louverture-de-commande
layout: post
drupal_uuid: 8ee97055-fe76-485b-916b-e07062ecd3d6
drupal_nid: 107
lang: fr
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "events"
  - "Service Manager"
  - "hydrator"
  - "Event Manager"

sites:
  - "Développement"

summary: "Maintenant que nous avons notre formulaire - qui ouvre une note - nous allons lui attacher un objet. Avec cet objet, nous allons pouvoir traiter le formulaire. Nous verrons alors comment avec cet objet, nous allons pouvoir déclencher notre tout premier événement, le point de départ de toute notre application.
"
---

Maintenant que nous avons notre formulaire - qui ouvre une note - nous allons lui attacher un objet. Avec cet objet, nous allons pouvoir traiter le formulaire. Nous verrons alors comment avec cet objet, nous allons pouvoir déclencher notre tout premier événement, le point de départ de toute notre application.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui auront disparu au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

## L'événement TabOpened

Tous les scénarii commencent au moment où une note est ouverte (`CoffeeBar\Event\TabOpened`). On identifie une note avec son *id unique*, le *numéro de la table* qui a ouvert la note et le *nom du serveur* qui a ouvert la note.

```php
// module/CoffeeBar/src/CoffeeBar/Event/TabOpened.php

namespace CoffeeBar\Event ;

class TabOpened
{
  protected $id ; // string (guid)
  protected $tableNumber ; // string (numéro de la table)
  protected $waiter ; // string (serveur)

  // getters &amp; setters
}
```

## L'opération OpenTab correspondante

Pour qu'une note soit ouverte, il nous faut également l'objet qui fait l'action d'ouvrir cette note.

Le tutoriel d'origine parle de commande (le fait de faire quelquechose), mais en français, il y a trop de sens au mot commande (surtout dans le cadre d'un commerce), je parlerais donc d'une opération (le mot action ayant également un sens dans une architecture MVC). L'opération correspondante qui ouvre une note sera donc `CoffeeBar\Command\OpenTab`.

```php
// module/CoffeeBar/src/CoffeeBar/Command/OpenTab.php

namespace CoffeeBar\Command ;

class OpenTab
{
  protected $id ; // string (guid)
  protected $tableNumber ; // string (numéro table)
  protected $waiter ; // string (serveur)
  // l’objet ‘OpenTab’ déclenche une opération (événement) ‘openTab’

  // getters &amp; setters
}
```

## Le gestionnaire d'événements

Dans le tutoriel d'origine, les opérations sont gérées par un gestionnaire central. Quand une opération a lieu, le gestionnaire prend l'opération en charge et déclenche dans ce cas là les événements qui vont bien. Avec Zend Framework 2, cela ne va pas se passer pareil. Il n'y a rien pour '*prendre en charge une opération*' d'une part et pour '*écouter un événement*' d'autre part. Que ce soit une opération qui a lieu ou un événement qui est déclenché, il faut intercepter ce qu'il se passe : au final, que ce soit une opération ou un événement, c'est *déclencher un événement*, que l'événement soit nommé comme l'opération ou comme l'événement...

Tout le long du tutoriel, nous avons des événements (gérés par le **gestionnaire d'événements**) et des événements (les objets de l'espace de nom `Coffee\Event\*`). Un objet opération (`Coffee\Command\*`) va déclencher un événement (géré par le **gestionnaire d'événements**) mais un objet événement (`Coffee\Event\*`), va AUSSI déclencher un événement. Nous allons avoir une opération `CoffeeBar\Command\OpenTab` qui va déclencher un événement '`openTab`' et une fois que l'événement '`openTab`' va être intercepté, on va générer un objet événement `CoffeeBar\Event\TabOpened` qui va déclencher un événement '`tabOpened`'. Notez la casse que j'utilise, je vais faire de mon mieux pour être clair sur ce point...

Dès qu'on parle d'événements, on va devoir mettre en place un <a href="http://framework.zend.com/manual/current/en/modules/zend.event-manager.event-manager.html" target="_blank">**gestionnaire d'événement**</a>. Par défaut, l'application de Zend Framework 2 (*raccourci honteux : je parle bien entendu du Application Skeleton qui se base sur le framework de Zend Framework 2. Zend Framework 2 n'est pas une application à lui seul*) comprend un **gestionnaire d'événements** par défaut, anonyme. Pour notre usage, nous allons donc créer un **gestionnaire d'événement personnalisé**, basé sur le gestionnaire de Zend.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabEventManager.php

<?php
namespace CoffeeBar\Service ;

use Zend\EventManager\EventManager;

class TabEventManager extends EventManager
{
}
```

Voila. Tout simplement. Franchement, à part lui donner un nom, on n'a rien fait d'autre.

Par contre, on va l'ajouter dans notre **gestionnaire de services**.

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

class Module implements FormElementProviderInterface
{
  ...
  public function getServiceConfig()
  {
    return array(
      'invokables' => array(
        'TabEventManager' => 'CoffeeBar\Service\TabEventManager',
      ),
    ) ;
  }
}
```

Le **gestionnaire d'événements** a une méthode `EventManager::trigger('nom_de_l_evenement', 'cible', 'paramètres')`. Lorsque `EventManager::trigger()` est appelé, un événement '`nom_de_l_evenement`' est déclenché dans le gestionnaire d'événements.

Le **gestionnaire d'événements** a une méthode `EventManager::attach('nom_de_l_evenement', 'callback')`. Lorsqu'un événement '`nom_de_l_evenement`' est déclenché, la méthode `callback` s'exécute.

Dans tous les cas, il est nécessaire que le gestionnaire d'événements soit présent, ou pour déclencher l'événement, ou pour y répondre.

## Déclencher un événement

Voyons maintenant comment notre objet `CoffeeBar\Command\OpenTab` peut déclencher un événement '`openTab`' dans le **gestionnaire d'événements**.

On vient de voir qu'il était nécessaire, pour l'objet `CoffeeBar\Command\OpenTab` d'intégrer le **gestionnaire d'événements** pour pouvoir déclencher un événement '`openTab`'.

```php
// module/CoffeeBar/src/CoffeeBar/Command/OpenTab.php

namespace CoffeeBar\Command ;

use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

// OpenTab déclenche un événement. Il faut donc que l’objet puisse avoir
// accès à un Event Manager pour y déclencher l’événement
class OpenTab implements EventManagerAwareInterface
{
  // propriété liées à l’interface EventManagerAwareInterface
  protected $events ;

  // méthode définie par l’interface EventManagerAwareInterface
  // on va injecter le gestionnaire d'événement dans la méthode setEventManager
  public function setEventManager(EventManagerInterface $events)
  {
    $this->events = $events;
    return $this;
  }
 
  // méthode définie par l’interface EventManagerAwareInterface
  public function getEventManager()
  {
    return $this->events;
  }
}
```

Une fois que l'objet `CoffeeBar\Command\OpenTab` a un objet héritant de `Zend\EventManager\EventManager`, on va pouvoir déclencher l'événement.

**Utiliser une méthode dédiée**

On pourrait utiliser une méthode `triggerMe()` qui déclencherait l'événement, mais on serait alors obligé de l'invoquer.

**Déclencher systématiquement l'événement dans le constructeur**

Pour ma part, je souhaitais, autant que possible, que si l'objet était instancié, l'événement serait déclenché -> dans le constructeur alors ? Avec le **gestionnaire de services**, toutefois, ce n'est pas possible puisqu'on construit tous nos objets dans le gestionnaire de services et on y fait appel après coup... Les événements seraient tous déclenchés au lancement de l'application...

**Déclencher systématiquement l'événement une fois que l'objet est défini**

Finalement, comme l'objet `CoffeeBar\Command\OpenTab` sera véritablement défini après que le formulaire d'ouverture de note sera validé, il faut déclencher l'événement une fois que les propriétés de l'objet `CoffeeBar\Command\OpenTab` étaient définies par le formulaire : juste avant d'hydrater l'objet donc. Parmi les <a href="http://framework.zend.com/manual/current/en/modules/zend.stdlib.hydrator.html" target="_blank">hydrators disponibles</a> dans Zend Framework 2, seul l'hydrator `Zend\Stdlib\Hydrator\ArraySerializable` implemente des méthodes obligatoires. Les autres hydrators utilisent les propriétés et/ou les getters / setters de l'objet.

```php
// module/CoffeeBar/src/CoffeeBar/Command/OpenTab.php

namespace CoffeeBar\Command ;

use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

// OpenTab déclenche un événement. Il faut donc que l’objet puisse avoir
// accès à un Event Manager pour y déclencher l’événement
class OpenTab implements EventManagerAwareInterface
{
  // les autres méthodes

  // la méthode populate() est obligatoire si on veut utiliser l’hydrator ArraySerializable()
  // Or l’hydrator ArraySerializable est le seul hydrator exposé par Zend Framework qui permet
  // d’hydrater un objet avec une fonction personnalisée
  // Nous avons besoin de la fonction personnalisée pour déclencher l’événement au moment
  // où on hydrate l’objet...
  public function populate($data = array())
  {
    // hydrating the object
    $this->id = (isset($data['id'])) ? $data['id'] : null;
    $this->tableNumber = (isset($data['tableNumber'])) ? $data['tableNumber'] : null;
    $this->waiter = (isset($data['waiter'])) ? $data['waiter'] : null;
    // triggering the event
    $this->events->trigger('openTab', '', array('openTab' => $this)) ;
  }

  // la méthode getArrayCopy() est obligatoire pour l’hydrator ArraySerializable()
  public function getArrayCopy() 
  {
    return array(
      'id' => $this->id,
      'tableNumber' => $this->tableNumber,
      'waiter' => $this->waiter,
    ) ;
  }
}
```

Voyons comment on organise tout ça dans notre gestionnaire de services.

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

use CoffeeBar\Command\OpenTab;
use Zend\Stdlib\Hydrator\ArraySerializable;

class Module
{
  public function getConfig() {...}

  public function getAutoloaderConfig() {...}
 
  // on charge le Service Manager
  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        // formulaire OpenTabForm avec l'instruction setObject()
        'OpenTabForm' => function($sm) {
          // parce que le formulaire OpenTabForm utilise un élément de formulaire personnalisé
          // il faut utiliser $this->serviceLocator->get('FormElementManager') ;
          // et utiliser le formulaire à partir du Form Element Manager
          $formManager = $sm->get('FormElementManager') ;
          $form = $formManager->get('CoffeeBar\Form\OpenTabForm') ;
          // OpenTabCommand : clé dans le Service Manager
          $form->setObject($sm->get('OpenTabCommand')) ;
          // on peut ajouter l'hydrator directement
          // dans le fichier CoffeeBar/Form/OpenTabForm.php
          $form->setHydrator(new ArraySerializable()) ;
          return $form ;
        },
        'OpenTabCommand' => function($sm) {
          $eventsManager = $sm->get('TabEventManager') ;
          $openTab = new OpenTab() ;
          // injection du gestionnaire d’événement dans l’objet OpenTab
          $openTab->setEventManager($eventsManager) ;
          return $openTab ;
        },
      ),
    ) ;
  }
}
```

## Le contrôleur

Et enfin le controller, où il faut compléter et traiter le formulaire s'il est valide.

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

use Zend\Mvc\Controller\AbstractActionController;

class TabController extends AbstractActionController
{
  public function openAction()
  {
    // récupérer le formulaire dans le ServiceManager
    $form = $this->serviceLocator->get('OpenTabForm') ;
    $request = $this->getRequest() ;

    // si le formulaire a été posté
    if($request->isPost()) {
      // assigné les données du tableau $_POST aux éléments du formulaire
      $form->setData($request->getPost()) ;
 
      // si le formulaire est valide, hydraté l'objet qui est lié au formulaire (OpenTab)
      if($form->isValid()) {
        $openTab = $form->getObject() ;
        // on redirige directement vers la page de prise de commande
        // notez qu'on passe en paramètre le numéro de la table
        return $this->redirect()->toRoute('tab/order', array('id' => $openTab->getTableNumber()));
      }
    }

    $result['form'] = $form ;
    return array('result' => $result) ;
  }
}
```

Quand le formulaire sera validé, on va mapper les données du formulaire `CoffeeBar\Form\OpenTabForm` sur l'objet `CoffeeBar\Command\OpenTab`. Au moment où on va hydrater notre objet, l'événement '`openTab`' va se déclencher.

Restez dans le coin !! dans le prochain article, nous allons voir qui et comment on va prendre cet événement '`openTab`' en charge.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
