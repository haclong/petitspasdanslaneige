---
title: "Application CoffeeBar 2/19 - Installer la base de développement"
permalink: "fr/posts/application-coffeebar-219-installer-la-base-de-developpement.html"
date: "2014-12-29T15:44"
slug: application-coffeebar-219-installer-la-base-de-developpement
layout: post
drupal_uuid: 1a7e39f7-9cd5-4094-a77a-2e48e36a3afd
drupal_nid: 99
lang: fr
author: haclong

book:
  book: gerer-un-cafe-avec-une-programmation-evenementielle
  rank: 2,
  top: 
    url: /fr/books/gerer-un-cafe-avec-une-programmation-evenementielle.html
    title: Gérer un café avec une programmation événementielle
  next: 
    url: /fr/posts/application-coffeebar-319-espionner-notre-cache.html
    title: Application CoffeeBar 3/19 - Espionner notre cache
  previous:
    url: /fr/posts/application-coffeebar-119-introduction-la-programmation-evenementielle.html
    title: Application CoffeeBar 1/19 - Introduction à la programmation événementielle

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "MVC"
  - "Zend Cache"

sites:
  - "Développement"

summary: "Pour commencer notre petite application de gestion des commandes d’un petit café, installons d’abord la base de l’application. Nous travaillerons avec Zend Framework 2. Ce framework permet de monter des applications web en se basant sur l'architecture Modèle-Vue-Controleur, et l'application charge par défaut des gestionnaires de services, d'événements et de formulaires qui nous seront bien utiles."
---

Pour commencer notre petite application de gestion des commandes d’un petit café, installons d’abord la base de l’application. Nous travaillerons avec Zend Framework 2. Ce framework permet de monter des applications web en se basant sur l'architecture Modèle-Vue-Controleur, et l'application charge par défaut des gestionnaires de services, d'événements et de formulaires qui nous seront bien utiles.

Je tiens à préciser que les autres grands frameworks populaires ont les mêmes fonctionnalités. J'écris ce tutorial pour ZF2 parce que je travaille sur ce framework. Je vous invite à le "traduire" dans votre framework favori si vous le souhaitez.

### Prérequis

- Installer <a href="http://framework.zend.com/manual/2.3/en/user-guide/skeleton- application.html" target="_blank">Zend Framework Skeletton Application</a>.
- Créer un nouveau module **CoffeeBar**. Je passe rapidement sur cette partie, vous trouverez la documentation sur<a href="http://framework.zend.com/manual/2.3/en/user-guide/modules.html" target="_blank"> la documentation de Zend Framework</a>.
- Ne pas oublier d'activer le module dans `config/application.config.php`
- Créer le fichier `module/CoffeeBar/Module.php` avec ce contenu minimal :

```php
<?php
namespace CoffeeBar ;

class Module
{
  public function getAutoloaderConfig()
  {
    return array(
      'Zend\Loader\StandardAutoloader' => array(
        'namespaces' => array(
          __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
        ),
      ),
    ) ;
  }
 
  public function getConfig()
  {
    return include __DIR__ . '/config/module.config.php' ;
  }
}
```

- Créer le fichier `module/CoffeeBar/config/module.config.php` avec ce contenu minimal :

```php
<?php
return array() ;
```

Vérifier que le site fonctionne toujours. Il n'y a pas de raisons qu'il ne fonctionne pas normalement.

### Persistence des données

Nous allons avoir besoin d'un espace pour stocker la liste des notes ouvertes. Une couche de "persistence" où nous allons stocker les informations et les extraire.

Parce que l'exercice est sensé être court, nous allons exploiter le cache. D’abord pour nous familiariser avec, et ma foi, pour un petit exercice sans conséquence, je ne vois pas pourquoi on irait s’encombrer avec la couche base de données...

Fort heureusement, même si cela m’a pris un certain temps, voire un temps certain à comprendre un <a href="http://www.masterzendframework.com/servicemanager/storage-cache-abstract-service-factory-easy-cache-configuration" target="_blank">tutoriel</a> trouvé sur le net au sujet du cache dans Zend Framework, une fois que c’est compris, c’est - comme pour le reste - simplissime.

#### Un cache prédéfini dans le skeleton

L’**Application (Skeletton) de Zend Framework 2** charge déjà un objet `abstract factory` pour utiliser le cache. Tout ce qui reste à faire, c’est de le paramétrer et de l’utiliser. Le tutoriel de ***Matthew Setter*** propose d’utiliser un service **Redis**, ou à défaut, d’utiliser les ressources de la machine pour le cache. Pour ma part, je découvre, j’opte pour l’utilisation exclusive des ressources de la machine... N’allons pas trop vite...

Il est défini ici :

```php
// module/Application/config/module.config.php

<?php
return array(
  ...
  'service_manager' => array(
    'abstract_factories' => array(
      'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
    ),
  ),
);
```

Pour le paramétrer, vous pouvez choisir le fichier de configuration de votre préférence. Pour rappel, l'**Application** admet les fichiers de configuration suivants :

- `config/application.config.php` (qui sera commité et distribué pour tous)
- `config/autoload/(*.)global.php` (qui seront commités et distribués pour tous)
- `config/autoload/(*.)local.php` (qui ne seront pas commités et cachés à tous)
- `module/*/config/module.config.php` (qui seront commités et distribués pour tous)

Vous pouvez adoptez votre propre organisation, dans vos différents fichiers de configuration. Je vous propose mon point de vue :

- le fichier `config/application.config.php` ne concerne que le chargement des modules, le path où on peut les trouver ainsi que les fichiers de configuration que l'application doit charger automatiquement.
- les fichiers `module/*/config/module.config.php` comprennent les informations récurrentes des modules : les vues, les controllers, les services, les routes, la navigation... autant que possible, conserver les mêmes clés pour ne pas avoir à chercher l'information partout.
- restent enfin les fichiers dans `config/autoload/*.php` qui peuvent être utilisés pour configurer des éléments ou des modules. Il faut savoir qu'à cet endroit, on peut créer autant de fichiers de configuration qu'on veut : `db.local.php`, `cache.local.php`, `mail.global.php` etc...

Ici, on va utiliser le fichier `global.php` parce que mon cache est en local dans le système de fichiers. On n'a rien à cacher...

```php
// config/autoload/global.php

<?php
return array(
  'caches' => array(
    'Cache\Persistence' => array(
      'adapter' => 'filesystem',
      'ttl' => 86400,
      'options' => array(
        // modifier les droits d’accès si nécessaires
        // mod : 775 - owner : user:www-data
        'cache_dir' => __DIR__ . '/../../data/cache/',
      ),
    ),
  ),
);
```

On pourrait utiliser le cache directement mais comme on va avoir besoin de définir des méthodes dédiées pour accéder à nos éléments, nous allons créer un service dédié.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabCacheService.php

<?php
namespace CoffeeBar\Service ;

class TabCacheService
{
  // notez la propriété protégée et les accesseurs qui nous permettent ainsi de gérer les dépendances.
  protected $cache ;
 
  public function getCache() 
  {
    return $this->cache;
  }

  // l’injection se fait dans le constructeur : cela permet de rendre l’élément obligatoire au bon fonctionnement de notre service.
  public function __construct($cache) 
  {
    $this->cache = $cache;
  }
}
```

Notre cache va stocker

- la liste des notes ouvertes d'une part,
- la todolist du chef d'autre part
- et chaque note individuellement, par leur id unique.

Pour chacune de ces listes, on va créer un index dans le cache et des méthodes pour accéder à ces index.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabCacheService.php

<?php
namespace CoffeeBar\Service ;

use Zend\Cache\Exception\MissingKeyException;

class TabCacheService
{
  // autres méthodes

  // instancier la clé pour la liste des notes ouvertes
  // index = 'openTabs'
  public function setOpenTabs($openTabs)
  {
    if($this->cache->hasItem('openTabs'))
    {
      return $this->cache->getItem('openTabs') ;
    } else {
      return $this->cache->setItem('openTabs', $openTabs) ;
    }
  }

  // récupérer la liste des notes ouverte
  public function getOpenTabs()
  {
    try {
      return unserialize($this->cache->getItem('openTabs')) ;
    } catch (MissingKeyException $ex) {
      echo 'openTabs cache key missing' ;
    }
  }
 
  // mettre la liste à jour
  public function saveOpenTabs($openTabs)
  {
    return $this->cache->setItem('openTabs', $openTabs) ;
  }
 
  // instancier la clé pour la todolist du chef
  // index = 'todoList'
  public function setTodoList($todoList)
  {
    if($this->cache->hasItem('todoList'))
    {
      return $this->cache->getItem('todoList') ;
    } else {
      return $this->cache->setItem('todoList', $todoList) ;
    }
  }
 
  // récupérer la todolist du chef
  public function getTodoList()
  {
    try {
      return unserialize($this->cache->getItem('todoList')) ;
    } catch (MissingKeyException $ex) {
      echo 'todoList cache key missing' ;
    }
  }
 
  // mettre la todolist à jour
  public function saveTodoList($todoList)
  {
    return $this->cache->setItem('todoList', $todoList) ;
  }

  // récupérer un élément du cache par son index
  public function getItem($id)
  {
    return $this->cache->getItem($id) ;
  }
 
  // créer un élément du cache avec un index et les données
  public function setItem($id, $datas)
  {
    $this->cache->setItem($id, $datas) ;
  }
  
  // vérifie si l'élément du cache désigné par son index existe
  public function hasItem($id)
  {
    return $this->cache->hasItem($id) ;
  }
}
```

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui auront disparu au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

Chargeons notre service dans le **gestionnaire de services (Service Manager)**. On en profitera pour instancier les deux index au lancement de l'application (au moment du **bootstrap**).

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

use ArrayObject;
use CoffeeBar\Entity\OpenTabs\TodoByTab;
use CoffeeBar\Service\TabCacheService;
use Zend\Mvc\MvcEvent;

class Module
{
  public function getConfig() //

  public function getAutoloaderConfig() //

  // la fonction onBootstrap est une fonction qui est chargée dans l'application.
  // elle admet en argument un objet de type MvcEvent systématiquement.
  public function onBootstrap(MvcEvent $event)
  {
    $sm = $event->getApplication()->getServiceManager() ;
    $cache = $sm->get('TabCache') ;
    // le cache ne stocke que des strings. Il faut sérializer notre objet.
    $cache->setOpenTabs(serialize(new TodoByTab())) ;
    $cache->setTodoList(serialize(new ArrayObject())) ;
  }

  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'TabCache' => function($sm) {
          // la clé qui a été définie dans notre configuration
          $cacheService = $sm->get('Cache\Persistence') ;
          $tabCache = new TabCacheService($cacheService) ;
 
          return $tabCache ;
        },
      ),
    ) ;
  }
}
```

On charge dans chaque index du cache un objet `\ArrayObject`. Pour la **liste des notes ouvertes**, on va charger un objet personnalisé qui va hériter de `\ArrayObject` et pour la **todolist du chef**, on va se contenter d'utiliser un objet `\ArrayObject` directement.

Voyons rapidement notre objet `CoffeeBar\Entity\OpenTabs\TodoByTab`.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/OpenTabs/TodoByTab.php

<?php
namespace CoffeeBar\Entity\OpenTabs ;

use ArrayObject;

class TodoByTab extends ArrayObject {}
```

On aurait pu utiliser directement un objet `\ArrayObject`. Mais je peux expliquer :

- L'avantage réel, c'est que vous pouvez utiliser du <a href="http://fr2.php.net/manual/fr/language.oop5.typehinting.php" target="_blank">**typage explicite** (type hinting)</a> avec cette classe...
- La vraie raison dans notre cas, cependant, c'est que je ne savais pas, au moment où j'ai créé cette classe, s'il avait fallu lui ajouter des méthodes personnalisées... J'ai pris les devants en créant une classe dédiée, au cas où. Pour la todolist du chef, je l'ai créée à la fin de l'application, j'avais compris où j'allais.

Rendez vous dans le prochain article pour faire un peu de route / contrôleur / vue...

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
