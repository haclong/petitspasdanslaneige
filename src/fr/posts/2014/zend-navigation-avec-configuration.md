---
title: "Zend Navigation avec configuration"
permalink: "fr/posts/zend-navigation-avec-configuration.html"
date: "2014-07-03T13:46"
slug: zend-navigation-avec-configuration
layout: post
drupal_uuid: 7c79b579-b299-47d7-bf35-d3d3f50be7ac
drupal_nid: 77
lang: fr
author: haclong

book:
  book: configuration-dans-zend-framework-2
  rank: 6,
  top: 
    url: /fr/books/configuration-dans-zend-framework-2.html
    title: Configuration dans Zend Framework 2
  next: 
    url: /fr/posts/zend-filter-par-configuration.html
    title: Zend Filter par configuration
  previous:
    url: /fr/posts/zend-mvc-router-par-configuration.html
    title: Zend Mvc Router par configuration

media:
  path: /img/teaser/musictechnique.jpg

tags:
  - "zend framework 2"
  - "configuration"
  - "Zend Navigation"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Comment configurer un objet Zend\Navigation en utilisant la configuration seulement

J'espère que cette liste va vous aider à utilsier Zend\Navigation"
---

Comment configurer un objet **Zend\Navigation** en utilisant la configuration seulement

J'espère que cette liste va vous aider à utilsier **Zend\Navigation**

Voici l'ensemble entier :

Toutes les options sont plutôt optionnelles mais pour que la navigation fonctionne, certaines informations seront obligatoires (par bon sens, pas par programmation)

```php
<?php
return array(
  // keyword 'navigation' is mandatory
  'navigation' => array( 
    // mandatory - name properties of the Navigation Factory. 
    // Default = 'default' if we use the \Zend\Navigation\DefaultNavigationFactory class
    '{$nav_name}' => array( 
      // Page definition, the 'name' key can be optional 
      // and the navigation component will iterate automatically over the $nav_name array
      '{$page_name}' => array( 
        // optional, either 'mvc' or 'uri' for the ZF2 library 
        // but you can add any other custom type if you want to. 
        // Custom type has to extend Zend\Navigation\Page\AbstractPage
        'type' => string $type, 
        // it's not mandatory but you'll need this one : 
        // text on the link, the one you can click. 
        // Zend Navigation is international and the label should be translatable if everything's fine
        'label' => string $label, 
        // name of the anchor if any. As far as i know, do not include the # sign
        'fragment' => string $fragment, 
        // id of the page (attribut ID de la balise Html A)
        'id' => string $id, 
        // css style class to apply (attribut class de la balise html A)
        'class' => string $class, 
        // title of the page (attribut title de la balise html A)
        'title' => string $title,
        // target of the page (attribut target de la balise html A)
        'target' => string $target, 
        
        'rel' => array(
          // multiple rel types for one page
          '{$type_rel}' => array( 
            // page options such as 'label', 'uri', 'controller' etc...
          ),
        ),
 
        'rev' => array(
          // multiple rel types for one page
          '{$type_rel}' => array( 
            // page options such as 'label', 'uri', 'controller' etc...
          ),
        ),
 
        // default = null : order of the page in the container. 
        // Ordering from smallest to biggest
        'order' => int $order, 
        // basically, the name you assigned to a resource 
        // in the Zend\Permission\Acl\Resource\GenericResouce($name) ;
        'resource' => string | AclResource $resource, 
        // basically, the privilege assigned for the ACL component
        'privilege' => string $privilege, 
        // permission set to the page
        'permission' => $permission, 
        // default false - whether the page is active or not
        'active' => bool, 
        // default true - whether the page is visible or not
        'visible' => bool, 
        'pages' => array(
          '{$page_name}' => array(), // recursive
        ),
 
        // $type = 'uri' Zend\Navigation\Page\Uri
        // $type = 'uri' by default if there's one 'uri' key in the page
        // can combine with 'fragment' too
        'uri' => string $uri, // any url, either absolute or relative
 
        // $type = 'mvc' Zend\Navigation\Page\Mvc
        // $type = 'mvc' by default if there's at least 
        // either one 'action' key, or 'controller' or 'route' key in the page
        // name of action of the controller
        'action' => string $action, 
        // name of the controller
        'controller' => string $controller,
        // array of all parameters as defined in the route 
        'params' => array $params, 
        // name of the route
        'route' => string $route, 
        // within a ZF Skeleton Application, one is defined by default. 
        // You can use a customized routeInterface though.
        'routeMatch' => Zend\Mvc\Router\RouteMatch, 
        // default = false - 
        // if true, use the routeMatch defined to assemble the URI
        'useRouteMatch' => bool, 
        // within a ZF Skeleton Application, one is defined by default. 
        // You can use a customized RouteStackInterface though.
        'router' => Zend\Mvc\Router\RouteStackInterface, 
      ),
    ),
  ),
);
?>
```

Pour utiliser Zend Navigation, il faut également instancier le `Navigation Factory`.

```php
// n'importe quel fichier de config
// j'ai tendance à favoriser module/Application/config/module.config.php

<?php
return array(
  ... // autre élément de conf
  'service_manager' => array(
    'factories' => array(
      'navigation' => 'Zend\Navigation\Service\DefaultNavigationFactory',
    ),
  ),
);
```

A titre indicatif, voici à quoi ressemble la classe `DefaultNavigationFactory` :

```php
<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link http://github.com/zendframework/zf2 for the canonical source repository
 * @copyright Copyright (c) 2005-2013 Zend Technologies USA Inc. (http://www.zend.com)
 * @license http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Zend\Navigation\Service;

/**
 * Default navigation factory.
 */
class DefaultNavigationFactory extends AbstractNavigationFactory
{
  /**
   * @return string
   */
  protected function getName()
  {
    return 'default';
  }
}
```

Comme on peut le constater, dans la fonction `getName()`, la valeur est *default* : c'est cette valeur qu'il faut utiliser dans la configuration de *'navigation'*, en lieu et place du `{$nav_name}`

### Créer son propre NavigationFactory

Pour créer son propre `Navigation Factory`, il suffit d'étendre `AbstractNavigationFactory` et créer une méthode `getName()` qui retourne le nom de votre `Navigation Factory`.

Utiliser ensuite ce même nom pour la configuration de **Zend Navigation** et voilaa...

```php
// path/to/My/Navigation/MyNavigationFactory.php

<?php
namespace My\Navigation;

/**
 * Customized navigation factory.
 */
class MyNavigationFactory extends AbstractNavigationFactory
{
  /**
   * @return string
   */
  protected function getName()
  {
    return 'my';
  }
}
```

et dans le fichier de conf :

```php
// My/conf/module.config.php

<?php
return array(
  'service_manager' => array(
    'factories' => array(
      'navigation' => 'My\Navigation\MyNavigationFactory ',
    ),
  ), 
  'navigation' => array( 
    'my' => array( // My\Navigation\MyNavigationFactory class
      'home' => array( 
        'label' => 'Home',
        'route' => 'home',
      ),
    ),
  ),
);
?>
```

### i18n

Pour que la navigation soit traduite, rajouter une classe `Translator` avec le mot clé *'translator'* dans le **service Manager**

```php
<?php
return array(
  'service_manager' => array(
    'factories' => array(
      'translator' => 'Zend\I18n\Translator\TranslatorServiceFactory',
    ),
  ), 
);
?>
```

Et tadaaa
