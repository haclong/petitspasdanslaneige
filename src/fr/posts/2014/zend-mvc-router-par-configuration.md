---
title: "Zend Mvc Router par configuration"
permalink: "fr/posts/zend-mvc-router-par-configuration.html"
date: "2014-07-20T14:53"
slug: zend-mvc-router-par-configuration
layout: post
drupal_uuid: 90e91daf-6d66-4494-a4ca-b54c734f6086
drupal_nid: 78
lang: fr
author: haclong

book:
  book: configuration-dans-zend-framework-2
  rank: 5,
  top: 
    url: /fr/books/configuration-dans-zend-framework-2.html
    title: Configuration dans Zend Framework 2
  next: 
    url: /fr/posts/zend-navigation-avec-configuration.html
    title: Zend Navigation avec configuration
  previous:
    url: /fr/posts/zend-log-logger-avec-configuration.html
    title: Zend Log Logger avec configuration

media:
  path: /img/teaser/hi_tech.jpg

tags:
  - "zend framework 2"
  - "configuration"
  - "Zend Router"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Définir les routes en utilisant la configuration uniquement"
---

Définir les routes en utilisant la configuration uniquement.

**Plugin**

Il y a différents types de routes et pour chaque type, il y a un plugin qui est inclus par défaut dans Zend Framework 2

Voici la liste des différents plugins dans **Zend\Mvc\Router**

```php
Zend\Mvc\Router\RoutePluginManager :
  'hostname' => 'Zend\Mvc\Router\Http\Hostname',
  'literal' => 'Zend\Mvc\Router\Http\Literal',
  'part' => 'Zend\Mvc\Router\Http\Part',
  'regex' => 'Zend\Mvc\Router\Http\Regex',
  'scheme' => 'Zend\Mvc\Router\Http\Scheme',
  'segment' => 'Zend\Mvc\Router\Http\Segment',
  'wildcard' => 'Zend\Mvc\Router\Http\Wildcard',
  'query' => 'Zend\Mvc\Router\Http\Query',
  'method' => 'Zend\Mvc\Router\Http\Method',
```

En fonction du plugin utilisé, le router attends des options différentes.

```php
<?php
return array(
  'router' => array(
    'routes' => array(
      '{$name}' => array( // une route mandatory
        'type' => string $type, // mandatory Zend\Mvc\Router\RoutePluginManager invokable name
        'options' => array( // mandatory

          // $type = 'hostname' Zend\Mvc\Router\Http\Hostname
          'route' => string $uri, // mandatory (possibilité avec clé de substitution)
          'constraints' => array( // mandatory si la clé de substitution existe sinon, optional
            '{clé_de_substitution}' => string $regex, // peut être une regex pour plusieurs match ou bien un litéral pour un match unique
          ),
          'defaults' => array( // optional
            '',
          ),
 
          // $type = 'literal' Zend\Mvc\Router\Http\Literal
          'route' => string $uri, // mandatory, correspond à ce qui est attendu dans la barre d'adresse
          'defaults' => array( // optional
            'controller' => string $controler, // invokable name du contrôleur
            'action' => string $action, // nom de l'action
          ),
 
          // $type = 'method' Zend\Mvc\Router\Http\Method
          'verb' => string $methods, // comma separated list of method post, put, get... mandatory
          'defaults' => array( // optional
            'controller' => string $controller, // invokable name du contrôleur
            'action' => string $action, // nom de l'action
          ),
 
          // $type = 'regex' Zend\Mvc\Router\Http\Regex
          'regex' => string $regex, // mandatory, possible de définir plusieurs regex avec des id pour chaque chaîne
          'spec' => string $uri, // uri avec les variables définies par la regex, mandatory
          'defaults' => array( // optional
            'controller' => string $controller, // invokable name du contrôleur
            'action' => string $action, // nom de l'action
            'format' => string $format, // variable format à mettre par défaut si dans la regex, on a définit une variable 'format'
          ),
 
          // $type = 'scheme' Zend\Mvc\Router\Http\Scheme
          'scheme' => string $scheme, // mandatory
          'defaults' => array( // optional
            'https' => bool,
          ),
 
          // $type => 'segment' Zend\Mvc\Router\Http\Segment
          'route' => string $uri, // mandatory, avec des clés de substitution
          'constraints' => array( // optional
            '{clé de substition}' => string $regex, // optional
          ),
          'defaults' => array( // optional
            '{clé de substition}' => string $clé_de_substition_valeur_par_defaut,
          ),
 
          // $type = 'wildcard' Zend\Mvc\Router\Http\Wildcard
          'key_value_delimiter' => string $delimiter, // default '/'
          'param_delimiter' => string $param, // default '/'
          'defaults' => array(), // optional
        ),
      ),
      'route_plugins' => Zend\Mvc\Router\RoutePluginManager $routePlugins, // mandatory, pris en charge par l'application
      'may_terminate' => bool // optional - no other segment will follow - default : false
      'child_routes' => array( // optional
        // array of route,
      ),
    ),
  ),
);
?>
```

N'hésitez pas à utiliser vos routes avec votre objet **Navigation**.
