---
title: "La configuration dans Zend Framework 2 - 2nde partie"
permalink: "fr/posts/la-configuration-dans-zend-framework-2-2nde-partie.html"
date: "2013-06-07T18:03"
slug: la-configuration-dans-zend-framework-2-2nde-partie
layout: post
drupal_uuid: db31e162-a377-49a9-b4f3-8b34059bc651
drupal_nid: 37
lang: fr
author: haclong

book:
  book: configuration-dans-zend-framework-2
  rank: 2,
  top: 
    url: /fr/books/configuration-dans-zend-framework-2.html
    title: Configuration dans Zend Framework 2
  next: 
    url: /fr/posts/rajouter-zend-inputfilter.html
    title: Rajouter Zend InputFilter
  previous:
    url: /fr/posts/la-configuration-dans-zend-framework-2-1ere-partie.html
    title: La configuration dans Zend Framework 2 - 1ere partie

media:
  path: /img/teaser/musictechnique.jpg

tags:
  - "zend framework 2"
  - "configuration"
  - "tutorial"

sites:
  - "Développement"

summary: "Dans la première partie de ce dyptique, nous avons vu que la configuration d'une application montée avec Zend Framework 2 était répartie sur plusieurs fichiers chargés successivement. Nous avons également vu l'ordre de chargement de ces fichiers : la configuration de l'application en premier lieu, la configuration de chacun des modules, avec, rappelons le, la priorité au premier module trouvé, et enfin le chargement en toute fin des modules supplémentaires. Chaque module contient des informations propres et un élément de Zend se charge de fusionner tous ces différents fichiers de configuration. Voyons maintenant ce que contiennent ces fichiers de configuration."
---

Dans la première partie de ce dyptique, nous avons vu que la configuration d'une application montée avec Zend Framework 2 était répartie sur plusieurs fichiers chargés successivement. Nous avons également vu l'ordre de chargement de ces fichiers : la configuration de l'application en premier lieu, la configuration de chacun des modules, avec, rappelons le, la priorité au premier module trouvé, et enfin le chargement en toute fin des modules supplémentaires. Chaque module contient des informations propres et un élément de Zend se charge de fusionner tous ces différents fichiers de configuration. Voyons maintenant ce que contiennent ces fichiers de configuration.

### Prérequis

A l'écriture de ce tutorial, Zend Framework 2.2 vient de sortir. Ce qui est dit ici fonctionne donc en principe pour les versions 2.0, 2.1 et 2.2.

Vous avez installé le **ZendSkeletonFramework** pour construire votre propre application MVC.

La configuration dans une application Zend Framework 2 va se répartir entre deux types d'informations

- les clés réservées d'une part, qui font parties du framework Zend
- les clés de votre module, que vous créerez vous même.

Puisque tous les différents tableaux de configuration vont tous être fusionnés en un seul, on peut faire plusieurs constats :

- on peut mettre en principe toute la configuration dans un seul fichier de configuration. Cela serait complètement contraire à ce que l'équipe de développement de Zend Framework 2 essaie de mettre en place, mais, il n'y a aucune contrainte technique contre ce choix. Il faudra juste penser à créer des fichiers `module.config.php` qui retournent un tableau vide et ce sera fait.
- on peut créer autant de fichiers de configuration que l'on veut en créant plusieurs fichiers qui finissent par `.local.php` (ou `.global.php`) qu'on empilerait dans le répertoire `config/autoload/`.
- si plusieurs clés portent le même nom, il est évident que l'une va être supplantée par l'autre, la gestion de la priorité reste à déterminer. D'après les éléments que nous avons :
- si deux modules portent le même nom, seul le premier est chargé par l'application. Il est évident que les fichiers de config du second module ne devraient donc pas être pris en compte.
- si deux clés portent le même nom dans deux modules différents, je pense que la clé du module chargé en second écrase les informations de la clé de configuration du module chargé en premier.

Pour répartir les clés dans vos fichiers de configuration, il faut faire appel au bon sens, tout simplement, et garder à l'esprit les préceptes qui gouvernent le développement des modules dans une application Zend Framework 2.

- Les modules doivent être indépendants les uns des autres. Evitez donc de créer dans un module des clés de configuration d'un autre module.
- Conformément à un principe d'indépendance des modules, il doit être possible de supprimer un module (et les clés qui lui sont attachées) sans pénaliser les modules restants.
- L'ordre de chargement des clés est important et se fait dans cet ordre : configuration de l'application, configuration des modules, fichiers de configuration supplémentaires.

### La configuration de l'environnement

En fonction de l'environnement de votre application, il est clair que certaines données de configuration vont devoir être modifiées. A priori, vous allez avoir au moins deux environnements de travail. Personnellement, pour que ce soit bien, je pense qu'il en faudrait au moins quatre mais deux c'est un minimum : votre environnement de *développement* et votre environnement de *production*. Potentiellement, et cela est même plus que recommandable, vous allez avoir une base de données pour chacun de ces environnements, et vous allez avoir plus que probablement des chemins différents pour les fichiers de log, de cache etc... et une configuration différente pour le paramétrage du debug.

Comme on sait que le fichier `config/autoload/local.php` n'est pas commité par **git**, il présente deux avantages :

- il reste un fichier avec des informations relativements protégées.
- la version d'un environnement ne va pas écraser la version d'un autre environnement. Du coup, pas besoin de reparamétrer la configuration de l'environnement à chaque livraison des fichiers.

C'est dans ce fichier que nous préférerons mettre les informations sensibles :

- informations de connexion de votre base de données (*host*, *databasename*, *password*, *user*, *type*)
- informations de connexion à d'autres comptes (un FTP par exemple)
- chemin pour les fichiers de log
- chemin pour le cache
- adresse mail du site (si vous développez un mailer et que l'adresse mail n'a pas nécessairement besoin d'être gérée par la base de données)
- ...

C'est aussi dans ce fichier qu'on pourra mettre des flag pour le debug par exemple :

- activation du mode debug
- cacher la barre d'outil
- afficher les erreurs sur l'écran

**NOTE**

Il ne faudrait pas faire la gaffe alors de le mettre à jour par FTP. Le FTP n'obéissant pas aux règles de git, il écraserait le fichier local.php existant avec le nouveau fichier local.php. Si vous faite un transfert FTP d'un environnement à l'autre, vos paramétrages vont être modifiés par le nouveau fichier.

Pour la répartition, vous avez au choix la répartition dans des fichiers `monmodule.local.php` pour ne pas perdre le fil de votre module ou bien tout mettre dans le fichier `local.php`.

**ASTUCE**

Arrangez vous pour que la clé que vous allez créer pour stocker vos informations de connexion à votre base de données soit conforme au format attendu par `Zend\Db\Adapter\Adapter()`. Vous en saurez plus sur la <a href="http://framework.zend.com/manual/2.2/en/modules/zend.db.adapter.html" target="_blank">documentation</a> de la classe.

Configuration d'un Adapter en deux temps

```php
// config/autoload/local.php

return array(
  'dbhost' => 'localhost',
  'dbuser' => 'userName',
  'dbname' => 'myDatabase',
  'dbpwd' => 'password',
);
```

Créer un adapter pour la base de donnée 

1. en déclarant un nouveau Service en utilisant les factories

```php
// module/MonModule/Module.php

class Module
{
  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'dbAdapter' => function($sm) {
          $dbConfig = $sm->get('config') ;
          $adapter = new Zend\Db\Adapter\Adapter(array(
            'driver' => 'Mysqli',
            'database' => $dbConfig['dbname'],
            'username' => $dbConfig['dbuser'],
            'password' => $dbConfig['dbpwd']
          )) ;
          return $adapter ;
        }
      ),
    );
  }
}
```

2. ou en déclarant un nouveau Service avec des clés de paramétrages

```php
// config/autoload/global.php

return array(
  'service_manager' => array(
    'factories' => array(
      'dbAdapter' => function($sm) {
        $dbConfig = $sm->get('config') ;
        $adapter = new Zend\Db\Adapter\Adapter(array(
          'driver' => 'Mysqli',
          'database' => $dbConfig['dbname'],
          'username' => $dbConfig['dbuser'],
          'password' => $dbConfig['dbpwd']
        )) ;
        return $adapter ;
      },
    ),
  ),
) ;
```

3. ou directement à partir d'un controller

```php
// module/MonModule/src/Controller/MonController.php 

class MonController extends AbstractActionController
{
  protected function createDbAdapter()
  {
    $config = $this->getServiceLocator()->get('config') ;
    $dbAdapter = new Zend\Db\Adapter\Adapter(array(
      'driver' => 'Mysqli',
      'database' => $config['dbname'],
      'username' => $config['dbuser'],
      'password' => $config['dbpwd']
    ));
    $this->db = $dbAdapter ;
  }
}
```

En optimisant, vous pouvez le faire en économisant des lignes de codes :

```php
// config/autoload/local.php

return array(
  'db' => array(
    'driver => 'Mysqli',
    'hostname' => 'localhost',
    'username' => 'userName',
    'database' => 'myDatabase',
    'password' => 'password'
  )
);
```

Créer un adapter pour la base de donnée

1. en déclarant un nouveau Service en utilisant les factories

```php

// module/MonModule/Module.php 
class Module
{
  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'dbAdapter' => function($sm) {
          $dbConfig = $sm->get('config') ;
          $adapter = new Zend\Db\Adapter\Adapter($dbConfig['db']) ;
          return $adapter ;
        }
      ),
    );
  }
}
```

2. ou en déclarant un nouveau Service avec des clés de paramétrages

```php
// config/autoload/global.php

return array(
  'service_manager' => array(
    'factories' => array(
      'dbAdapter' => function($sm) {
        $dbConfig = $sm->get('config') ;
        $adapter = new Zend\Db\Adapter\Adapter($dbConfig['db']) ;
        return $adapter ;
      },
    ),
  ),
) ;
```

3. ou directement à partir d'un controller

```php
// module/MonModule/src/Controller/MonController.php

class MonController extends AbstractActionController
{
  protected function createDbAdapter()
  {
    $config = $this->getServiceLocator()->get('config') ;
    $dbAdapter = new Zend\Db\Adapter\Adapter($config['db']);
    $this->db = $dbAdapter ;
  }
}
```

*Je rappelle que si pour accéder à la configuration à partir des classes de votre modèle, vous reférer à <a href="http://haclong.long2.net/fr/content/la-configuration-dans-zend-framework-2-1ere-partie.html">la première partie du sujet</a>.*

Vos fichiers de configuration vont se construire petit à petit. Il y aura vos propres clés que vous créerez au fur et à mesure que vous construirez votre application, et il y aura les clés réservées par les outils que vous utiliserez : à n'en pas douter, les composants de Zend Framework pour commencer, et éventuellement, les composants d'autres modules que vous aurez installé.

### Configuration du module

Dans la configuration de chacun de vos modules, vous devrez obligatoirement faire les paramétrages suivants, dès lors que votre module comprend une logique **Vue** et **Contrôleur** (parce qu'il est également possible de faire des modules qui ne contiennent que des **Modèles**, sans **Vue** ni **Contrôleur**. Ces modules exposeront dans ce cas là des **Services** que les autres modules utiliseront)

- **Lister les contrôleurs** disponibles en associant le nom d'un contrôleur et l'objet **Contrôleur** : cela peut s'avérer pratique dès qu'il va s'agir de faire des modifications de type le nom `ControllerA` ne pointe plus vers le **contrôleur A** mais vers le **contrôleur A'**.
- Indiquer à l'application **où se trouvent les fichiers Vue** que l'application doit utiliser.
- **Définir le chemin pour arriver à votre page** : comment doit se construire l'URL qui va être saisie par l'utilisateur, comment faire référence à cette page à l'intérieur du code et lorsque l'URL est envoyée vers l'application, déterminer quel contrôleur va prendre en charge la requête en entrée.

#### Lister les contrôleurs

```php
//module.config.php

return array(
  'controllers' => array(
    'invokables' => array(
     'MonControllerA' => 'Module_Namespace\Controller\Controller_Name',
    ),
  ),
);
```

Ce qu'il faut savoir :

- Logiquement, vous aurez autant d'entrées dans le tableau '`invokables`' que de contrôleurs que vous développerez.
- N'oubliez pas à inclure le namespace du module dans le nom du contrôleur... Si vous avez plusieurs noms identiques (cela arrivera parce que vous aurez plusieurs modules donc plusieurs fichiers de configuration chacun avec sa liste de contrôleurs disponibles), un seul objet Contrôleur sera identifié parmi plusieurs objets contrôleurs qui porteront tous le même nom.

#### Indiquer à l'application le chemin des vues

```php
//module.config.php

return array(
  'view_manager' => array(
    'template_path_stack' => array(
      'mon-module' => __DIR__ . '/../view',
    ),
  ),
);
```

Ce qu'il faut savoir :

- Je n'ai eu à le faire qu'une fois par module parce que toutes mes vues étaient regroupées dans le même répertoire.
- Le répertoire `view/` se situe dans votre module et doit contenir obligatoire un répertoire reprenant en minuscule le namespace du module. Une chose que je ne m'explique pas : il y a une logique (ou pas) entre le nom du module écrit en camelCase **MonModule** et le nom du répertoire vue écrit avec un tiret `mon-module`. En testant un peu, on finit par retrouver l'orthographe attendue par l'application. Je me demande s'il n'y a pas un lien avec la façon d'écrire le nom du path dans le fichier `module.config.php`... Cela mériterait des tests étendus.

#### Déterminer la route entre la requête (HTTP probablement) et le rendu de la page en mettant à profit le bon contrôleur et la bonne action.

Cette partie concerne un mécanisme très logique, nécessaire dont on est très peu conscient finalement : il faut faire comprendre à l'application qu'à une chaîne de caractère donnée (l'URL) correspond nécessairement une page donnée et cette correspondance, l'application pourra la faire en analysant les "composants" de cette chaîne de caractère.

Le système de fichier des systèmes d'exploitation utilisent une logique simplissime : un séparateur. Ce qui est à droite du signe '/' est nécessairement contenu dans ce qui est à gauche de ce même signe. Le serveur Apache utilise cette logique en natif. C'est pour cela que lorsqu'on crée un site HTML statique, le chemin d'une page HTML dans le navigateur correspond exactement au chemin qui mène au fichier .html que le navigateur doit ouvrir.

Or, dans le cadre d'une application dynamique, cette logique peut être cassée. On le voit bien tous les jours maintenant parce que les sites ont tout d'abord été simplement dynamiques et désormais, certains sont des applications complètes qui ont des règles pour faire correspondre un chemin (la requête) et la vue HTML issue d'un contrôleur et d'une action.

Cette logique, est ce qu'on appelle le **routing**. Une **route**, c'est la correspondance entre d'un côté **un format attendu dans la barre d'adresse du navigateur (l'URL)** et de l'autre **le ou les contrôleurs que l'application doit instancier ainsi que l'action qui doit être exécutée**.

Si vous êtes familier de Zend Framework 1, l'application MVC de Zend Framework 1 avait une route définie par défaut dont le format était le suivant : `mon.domaine.tld(/[module])/[controller]/[action](/[params-eventuellement])`.

*module* et *params* était des composants facultatifs dans le format de l'URL.

L'application analysait la requête entrante. Elle déterminait :

- si le 1er argument après le nom de domaine correspondait à un nom de module ou bien à un contrôleur existant dans le module **default**.
- si le 2nd argument après le nom de domaine correspondait au nom d'un contrôleur du module identifié au 1er argument ou au nom d'une action.
- si le 3me argument après le nom de domaien correspondait au nom d'une action du contrôleur identifié au 2nd argument ou à des paramètres nécessaires pour l'action identifiée au 2nd argument.

Ainsi de suite, elle identifiait l'objet contrôleur qui devait être utilisé, puis la méthode action de l'objet contrôleur identifié. La vue étant définie au niveau de l'action, il n'y avait plus qu'à afficher la page demandée.

Depuis Zend Framework 2, l'application MVC n'a pas de route définie par défaut. En revanche, dans le **ZendSkelettonApplication**, une route a été définie dans `module/Application/config/module.config.php`. Elle reproduit la route qu'on connaissait dans Zend Framework 1. Personnellement, je ne l'ai jamais utilisée parce que j'ai développé mes propres modules assez rapidement. Je vous laisse explorer cette partie.

Les routes portent des noms. C'est pratique parce que vous pourrez vous y referrer rapidement. Le jour où vous décidez de changer un contrôleur ou une action, vous n'aurez pas à changer toutes vos URLs : la route **login** a ce format : '`mon.domaine.tld/login`' et utilise par défaut un contrôleur `UserController` et son action `LoginAction`. Mais demain, après un refactoring, la route **login** peut utiliser un contrôler `AuthController` et son action `LogAction`. Le format reste inchangé. Il suffit de changer la définition de la route.

Il reste encore beaucoup à dire sur les routes mais en attendant un prochain article, j'ai trouvé la documentation relativement claire. En tâtonnant un peu s'il le faut, on finit par y arriver.

Avec Zend Framework 2, vous remarquerez qu'il y a à tout les niveaux des alias et des noms qui définissent des objets qui portent finalement les mêmes noms (comme la liste des controleurs). C'est une technique pour établir un cloisonnement intelligent entre le code qui est écrit et les composants qui sont utilisés véritablement. Ainsi, vous pouvez changer vos classes ou même remplacer une librairie par une autre sans avoir à réécrire tout votre code. Pensez y de temps en temps. Si ce concept vous paraît inutile et redondant à l'écriture de votre code, vous vous apercevrez que cela peut s'avérer redoutable sur la longueur.
