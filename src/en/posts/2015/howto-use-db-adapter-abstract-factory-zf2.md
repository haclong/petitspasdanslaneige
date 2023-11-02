---
title: "HOWTO - Use the DB Adapter abstract factory (ZF2)"
permalink: "en/posts/howto-use-db-adapter-abstract-factory-zf2.html"
date: "2015-07-28T12:01"
slug: howto-use-db-adapter-abstract-factory-zf2
layout: post
drupal_uuid: 9ba5c51f-bf57-4980-b6de-11dcc406ba4d
drupal_nid: 144
lang: en
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

summary: "A really quick little howto about setting your db adapter.
"
---

A really quick little howto about setting your db adapter.

## What's you got

- You have an install of the Zend Framework Application Skeletton using the Zend Framework 2 framework.
- You have a usage for database (at least one).

## The Basics

According to this <a href="http://framework.zend.com/manual/current/en/user-guide/database-and-models.html" target="_blank">page of the official ZF2 documentation</a>, you know how to set the credentials to access the database.

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

I know, the tutorial said it is in the **`/config/autoload/global.php`** file but you can also put all those datas into the `**/config/autoload/local.php**` file too. It is a security issue as you may know well by now.

Oh the key is '*db*'. This is kindof mandatory. You can use any other key if you prefer but then you'll have to tell your adapter where you have stored the credentials.

Once you have set the datas for the database, you have to add the **Db Adapter** to your **Service Manager** so you can call it later.

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

`**/config/autoload/global.php**` is a more appropriate file since there's no secure datas in this code. Most of the time, though, i add this code right after my database credential. It's up to you. You can actually put it anywhere you like.

When you want to call your **Db Adapter** (because you gonna use an object to retrieve the datas stored in the database), you'll just have to do :

```php
$serviceManager->get('Zend\Db\Adapter\Adapter') ;
```

### What you have to know here :

`**$serviceManager**` is any methods, objects or anything returning the **Service Manager** of your application.

You can find it in the service manager configuration :

```php
Module::getServiceConfig()
{
  return array(
    'factories' => array(
      'services' => function($sm) {
        // $sm : this is the service Manager
      }
    ) ;
  );
}
```

or in the MVC Event :

```php
MvcEvent->getApplication()->getServiceManager()
```

or in the Controller :

```php
AbstractActionController->getServiceLocator()
```

or in a service factory :

```php
class anyCustomizedFactory implements FactoryInterface {
  public function createService(ServiceLocatorInterface $sm)
  {
    // $sm : this is the service manager
  }
}
```

There's more places where you can find (or call) your **Service Manager**. Just <a href="http://framework.zend.com/manual/current/en/modules/zend.service-manager.quick-start.html" target="_blank">check the documentation</a>. Search for the `**ServiceLocatorAwareInterface**` if you want to create objects accessing the Service Manager.

Once you can get to the **Service Manager**, you can get to the service you created meaning, your **Db Adapter**.

The name given to your service (here is the `**Zend\Db\Adapter\Adapter**`) is just a single string. You can call it anyway you like.

So, based on the basics :

- you use a first array with the key '*db*' to declare your database credentials
- and then you create your adapter in the Service Manager.

## Using the abstract factory

**ZF2 framework** is shipped with an abstract factory (more than one actually). This abstract factory will create you adapter automatically, if you stick to the structure and the keys expected. How to do this :

Go back to your `**/config/autoload/local.php**` (the one with your db credentials)

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

See what we just done ?

- To the '*db*' array, we told him that we declare '*adapters*'.
- '*adapters*' is an array (meaning you can set multiple adapters).
- Each *adapter* has the service name and then, the database credentials.

Now we don't need the adapter factory we used in our '*service_manager*' key, do we ?

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

Check the application.

Of course, you get an error. That's because we don't told the application to use the abstract factory. There's one place in the Zend Framework Skeletton Application where all the abstract factories shipped with Zend Framework are declared.

```php
// /module/Application/config/module.config.php

return array(
  ...
  'service_manager' => array(
    'abstract_factories' => array(
      'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
      'Zend\Log\LoggerAbstractServiceFactory',

      // add this abstract factory
      'Zend\Db\Adapter\AdapterAbstractServiceFactory',
    ),
  ),
)
```

and Tadaaa it is working.

## Last but not least

Ok, i've mentionned earlier that the '*db*' array key is mandatory. What if you want to use another one... for any reasons, nobody really cares :)

```php
// /config/autoload/global.php

return array(
  'service_manager' => array(
    'factories' => array(
      'myFirstDbAdapter' => function ($sm) {
        // 'config' is the key in the Service Manager to retrieve
        // informations stored in the config files
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

In the first example, you would have your credential set like this :

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

In the second example, we use the credentials we also use for Doctrine ORM packages.

Et Voila !
