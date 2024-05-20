---
title: "HOWTO - Utiliser la fabrique abstraite pour les Db Adapter (ZF2)"
permalink: "fr/posts/howto-utiliser-la-fabrique-abstraite-pour-les-db-adapter-zf2.html"
date: "2015-07-28T06:37"
slug: howto-utiliser-la-fabrique-abstraite-pour-les-db-adapter-zf2
layout: post
drupal_uuid: 9ba5c51f-bf57-4980-b6de-11dcc406ba4d
drupal_nid: 144
lang: fr
author: haclong

media:
  path: /img/teaser/musictechnique.jpg

tags:
  - "ZF2"
  - "gestionnaire de service"
  - "configuration"
  - "factory"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Un tout petit tuto sur le paramétrage de votre Db Adapter.
"
---

Un tout petit tuto sur le paramétrage de votre **Db Adapter**.

(le **Db Adapter**, c'est l'objet qui va vous service à vous connecter sur votre base de données).

## Ce que vous avez

- Vous avez une installation du **Zend Framework Application Skeleton** (version Zend Framework 2)
- Vous utilisez une base de données (au moins une)

## Les basiques

D'après cette <a href="http://framework.zend.com/manual/current/en/user-guide/database-and-models.html" target="_blank">page de la documentation officielle de ZF2</a>, vous savez comment on paramètre les accès à la base de données.

```php
// /config/autoload/local.php
return array(
  'db' => array(
    'driver' => 'Pdo',
    'dsn' => 'mysql:dbname=zf2tutorial;host=localhost',
    'username'       => 'YOUR USERNAME HERE',
    'password'       => 'YOUR PASSWORD HERE',
    'driver_options' => array(
      PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''
    ),
  ),
);
```

Je sais, le tutoriel dit que les données sont dans le fichier `/config/autoload/global.php` mais si vous préférez les mettre dans le fichier `/config/autoload/local.php`, c'est également correct. En fait, tout ça, c'est une question de sécurité. Vous le savez bien maintenant.

Oh, à propos de la clé '*db*'. Celle ci est, en quelque sorte, obligatoire. Vous pouvez utilisez une autre clé si vous préférez (ou si vous n'avez pas le choix) mais alors, il faudra alors dire à votre adapter où vous avez paramétré les données d'autentification à la base de données.

Une fois que vous avez paramétré les données de la base de données, on va ajouter le **Db adapter** à notre **Gestionnaire de services** comme ça, vous pourrez l'appeler plus tard.

```php
// /config/autoload/global.php
return array(
  'service_manager' => array(
    'factories' => array(
      'Zend\Db\Adapter\Adapter' => 'Zend\Db\Adapter\AdapterServiceFactory',
    ),
  ),
);
```

`/config/autoload/global.php` est un fichier un peu mieux adapté à ces infos puisqu'il n'y a rien de confidentiel dedans. Cependant, la plupart du temps, j'ai plutôt tendance à ajouter ce code dans le même fichier où j'ai déclaré les informations de connexion de la base de données. It's up to you. En fait, vous pouvez mettre ça où vous voulez.

Quand vous souhaitez accéder à votre **Db Adapter** (parce que vous avez un objet qui a besoin de se connecter à la base de données), vous avez juste à faire :

```php
$serviceManager->get('Zend\Db\Adapter\Adapter') ;
```

#### Ce qu'il y a à savoir :

`$serviceManager`, c'est n'importe quelle méthodes, fonctions, objets ou n'importe quoi qui retourne le **Gestionnaire de service** de votre application.

On peut trouver le gestionnaire de service dans sa config même :

```php
Module::getServiceConfig()
{
  return array(
    'factories' => array(
      'services' => function($sm) {
        // $sm : le voilà
      }
    ) ;
  );
}
```

ou dans l'objet **MvcEvent** :

```php
MvcEvent->getApplication()->getServiceManager()
```

ou dans le **Controller** :

```php
AbstractActionController->getServiceLocator()
```

ou dans n'importe quelle fabrique de service:

```php
class anyCustomizedFactory implements FactoryInterface {
  public function createService(ServiceLocatorInterface $sm)
  {
    // $sm : le voilà
  }
}
```

Il y a d'autres endroits où vous pourriez accéder au **Gestionnaire de service**. Consultez <a href="http://framework.zend.com/manual/current/en/modules/zend.service-manager.quick-start.html" target="_blank">la documentation</a>. Chercher surtout pour l'interface `ServiceLocatorAwareInterface` si vous souhaitez créer des objets qui accèdent directement au **Gestionnaire de service**.

Une fois que vous accédez au **Gestionnaire de service**, vous pouvez récupérer les services que vous avez créé, comme par exemple votre **Db Adapter**.

Le nom du service (ici `Zend\Db\Adapter\Adapter`) est juste une chaîne de caractère. Vous pouvez donc l'appelez comme vous voulez.

Donc, d'après les basiques :

- vous utilisez un premier tableau (de configuration) avec la clé *db* pour déclarer les informations de connexion à votre base de données
- puis vous créez un adapter déclaré dans le **Gestionnaire de service**.

## Utiliser la fabrique abstraite

**ZF2 framework** possède des fabriques abstraites. L'une d'elle permet de créer vos Db Adapter automatiquement, du moment qu'on conserve la structure et les clés attendues. Voici comment faire ça :

Retournous dans le fichier `/config/autoload/local.php` (celui avec les informations de connexion)

```php
// /config/autoload/local.php
return array(
  'db' => array(
    'adapters' => array(
      'Zend\Db\Adapter\Adapter' => array(
        'driver' => 'Pdo',
        'dsn' => 'mysql:dbname=zf2tutorial;host=localhost',
        'username'       => 'YOUR USERNAME HERE',
        'password'       => 'YOUR PASSWORD HERE',
        'driver_options' => array(
          PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''
        ),
      ),
    ),
  ),
);
```

Que venons nous de faire ?

- Au tableau '*db*', on lui a déclaré une clé '*adapters*'.
- la clé '*adapters*' est un tableau (`array`) (cela signifie également que vous pouvez en mettre plusieurs).
- Chaque *adapter* a un nom de service et, le plus important, les informations de connexion.

Maintenant que nous avons fait ça, nous n'avons plus besoin de notre fabrique d'`adapter` que nous avons déclaré dans la clé '*service_manager*', n'est ce pas ?

```php
// /config/autoload/global.php
<strike>return array(
   'service_manager' => array(
     'factories' => array(
       'Zend\Db\Adapter\Adapter' => 'Zend\Db\Adapter\AdapterServiceFactory',
     ),
   ),
);</strike>
```

Voyons notre application.

Bien sûr, vous avez une erreur. C'est parce que nous n'avons pas dit à l'application que nous allions utiliser une fabrique abstraite. Dans une application Zend Framework 2, il y a un endroit où toutes les fabriques abstraites sont déclarées (bon, en fait, dans le tableau de configuration, donc vous pouvez mettre ça où vous le souhaitez, mais il y a une endroit où on a déjà déclaré d'autres fabriques abstraites).

```php
// /module/Application/config/module.config.php

return array(
  ...
  'service_manager' => array(
    'abstract_factories' => array(
      'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
      'Zend\Log\LoggerAbstractServiceFactory',

      // rajouter la nouvelle fabrique abstraite
      'Zend\Db\Adapter\AdapterAbstractServiceFactory',
    ),
  ),
)
```

Et... Tadaaa !! ça marche.

## Last but not least

OK, j'ai mentionné plus tôt que la clé '*db*' était obligatoire. Que faire si vous souhaitez utiliser une autre clé ? pour n'importe quelle raison, après tout, qui est-on pour juger ?

```php
// /config/autoload/global.php
return array(
  'service_manager' => array(
    'factories' => array(
      'myFirstDbAdapter' => function ($sm) {
        // 'config' est la clé du gestionnaire de service pour
        // récupérer les données stockées dans les fichiers de config
        $config = $sm->get('config');
        $adapter = new Zend\Db\Adapter\Adapter($config['db1']);
        return $adapter ;
      },

      'mySecondDbAdapter' => function ($sm) {
        $config = $sm->get('config') ;
        $dbconfig = $config['doctrine']['connection']['orm_default']['params'] ;
        $adapter = new Zend\Db\Adapter\Adapter(array(
          'database' => $dbconfig['dbname'],
          'username' => $dbconfig['user'],
          'password' => $dbconfig['password'],
          'hostname' => $dbconfig['host'],
          'driver' => 'Pdo_Mysql',
          'dsn' => 'mysql:dbname=' .$dbconfig['dbname']. ';host=' . $dbconfig['host'],
          'driver_options' => array(
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''
          ),
        ));
        return $adapter ;
      }
    ),
  ),
);
```

Dans le premier exemple, les données de connexion se seraient présentées comme suit :

```php
// /config/autoload/dbadapter.local.php
return array(
  'db1' => array(
    'driver' => 'Pdo',
    'dsn' => 'mysql:dbname=db1_name;host=db1_host',
    'username' => 'db1user',
    'password' => '#######',
    'driver_options' => array(
      PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''
    ),
  ),
) ;
```

Dans le deuxième exemple, on souhaite utiliser les données de connexion déclarées pour le module Doctrine.

Et Voila !
