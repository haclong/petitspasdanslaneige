---
title: "Zend Framework 2, la classe Module"
permalink: "fr/posts/zend-framework-2-la-classe-module.html"
date: "2015-06-02T15:31"
slug: zend-framework-2-la-classe-module
layout: post
drupal_uuid: bbbf751e-759f-4d11-b566-654aee9b2986
drupal_nid: 134
lang: fr
author: haclong

media:
  path: /img/teaser/lego_pieces1.jpg

tags:
  - "zend framework 2"
  - "zend application"
  - "Modules"
  - "Service Manager"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Chacun des modules d'une application MVC avec Zend Framework 2 doit obligatoirement avoir une classe Module. Cette classe Module n'hérite d'aucune autre classe et sa documentation, quoique présente, est atypique. Voici donc la classe Module et ses méthodes."
---

Chacun des modules d'une **application MVC avec Zend Framework 2** doit obligatoirement avoir une classe `Module`. Cette classe `Module` n'hérite d'aucune autre classe et sa documentation, quoique présente, est atypique.

Voici donc la classe `Module` et ses méthodes.

## Pourquoi la classe Module ?

Zend Framework 2 se démarque de sa version précédente en expliquant notamment qu'ils avaient élargis les éléments à configurer, supprimant ainsi des mécanismes automatisés et finalement, "cachés". Il reste toutefois, au moins un dernier élément qui est obligatoire et qu'on ne peut pas modifier : la classe `Module`.

Pour chacun des modules qui doit être chargé dans l'application, on doit lui créer une classe `Module` qui se situe obligatoirement à la racine du module. Certains contournent cette dernière contrainte en faisant un include de la vraie classe `Module` s'ils avaient décidés de la mettre ailleurs.

On peut surcharger cette contrainte en personnalisant la classe `Zend\ModuleManager\Listener\ModuleResolverListener` mais... est-ce vraiment nécessaire ?

Le module étant finalement votre création propre, la classe `Module` n'hérite de personne, d'aucune autres classes de ZF2. Toutefois, elle a des méthodes que tous utilisent et que l'application Zend Framework reconnaît et décode et nous permet de travailler sur notre application.

## Les méthodes disponibles

Les méthodes de la classe `Module` sont documentées dans la <a href="http://framework.zend.com/manual/current/en/modules/zend.module-manager.module-manager.html" target="_blank">documentation officielle</a>.

- <a href="#getAutoloaderConfig">Module::getAutoloaderConfig()</a>
- <a href="#getConfig">Module::getConfig()</a>
- <a href="#getModuleDependencies">Module::getModuleDependencies()</a>
- <a href="#init">Module::init()</a>
- <a href="#onBootstrap">Module::onBootstrap()</a>
- <a href="#getServiceConfig">Module::getServiceConfig()</a>
- <a href="#getControllerConfig">Module::getControllerConfig()</a>
- <a href="#getFormElementConfig">Module::getFormElementConfig()</a>
- <a href="#getViewHelperConfig">Module::getViewHelperConfig()</a>
- <a href="#getControllerPluginConfig">Module::getControllerPluginConfig()</a>
- <a href="#getFilterConfig">Module::getFilterConfig()</a>
- <a href="#getInputFilterConfig">Module::getInputFilterConfig()</a>
- <a href="#getValidatorConfig">Module::getValidatorConfig()</a>
- <a href="#getHydratorConfig">Module::getHydratorConfig()</a>
- <a href="#getRouteConfig">Module::getRouteConfig()</a>
- <a href="#getSerializerConfig">Module::getSerializerConfig()</a>
- <a href="#getLogProcessorConfig">Module::getLogProcessorConfig()</a>
- <a href="#getLogWriterConfig">Module::getLogWriterConfig()</a>

**ATTENTION**

*Dans les exemples de code, j'utilise toujours la clé 'invokables'. Toutefois, il faut savoir que dans le gestionnaire de services, il y a plusieurs types de services à déclarer. J'utilise pas défaut 'invokables' mais consulter la documentation du gestionnaire de services pour savoir quels sont les autres types disponibles.*

### <a name="getAutoloaderConfig" id="getAutoloaderConfig">Méthode Module::getAutoloaderConfig()</a>

La méthode définit un tableau associatif pour que l'application sache quel est le chemin à associer à l'espace de nom de votre module.

Ce tableau est ensuite passé à l'instance de `Zend\Loader\AutoloaderFactory` afin que les classes de votre module soient reconnues et soient autochargées. C'est cette brique qui vous économise les lignes de `include()` que vous deviez faire lorsque vous codiez sans framework.

**Modèle de la méthode "par défaut"**

```php
// Module.php

class Module
{
  public function getAutoloaderConfig()
  {
    return array(
      'Zend\Loader\StandardAutoloader' => array(
        'namespaces' => array(
          // vous pouvez changer le chemin si l'envie vous en dit.
          __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
        ),
      ),
    ) ;
  }
}
```

Si vous souhaitez personnaliser l'autoload, voir la documentation sur <a href="http://framework.zend.com/manual/current/en/modules/zend.loader.autoloader-factory.html" target="_blank">**Zend\Loader**</a>

### <a name="getConfig" id="getConfig"></a>Méthode Module::getConfig()

Cette méthode définit un tableau associatif qui contient toute la configuration de votre module. Il faut savoir qu'à son lancement, l'application charge tous les fichiers de configuration et les concatène en un seul tableau de configuration. Vous n'êtes donc pas tenu de faire tenir toute la configuration de votre module dans un seul fichier `module.config.php`. Elle peut en effet être répartie sur plusieurs fichiers de configuration. De même, vous n'êtes pas tenu d'utiliser un fichier `module.config.php` du tout : soit parce que votre module ne nécessite pas de configuration, soit parce que vous avez opté pour éclater la configuration de votre module dans plusieurs fichiers différents.

**Modèle de la méthode par défaut**

```php
// Module.php

class Module
{
  public function getConfig()
  {
    // choisir un autre chemin si l'envie vous en prend
    return include __DIR__ . '/config/module.config.php' ;
  }
}
```

### <a name="getModuleDependencies" id="getModuleDependencies"></a>Méthode Module::getModuleDependencies()

Cette méthode permet de vérifier que les modules dont votre module est dépendant sont bien chargés au lancement de l'application. Si l'un des modules est absent, alors une exception de type `Zend\ModuleManager\Exception\MissingDependencyModuleException` est envoyée.

**Modèle de la méthode par défaut**

```php
// Module.php

class Module
{
  public function getModuleDependencies()
  {
    return array('Module1', 'Module2') ;
  }
}
```

Notez que **Composer** peut également vous permettre de vous en sortir. Cela dépend si vous souhaitez que l'exception soit gérée dans l'application ou à l'installation.

### <a name="init" id="init"></a>Méthode Module::init()

Cette méthode est appelée lorsque l'événement `ModuleEvent::EVENT_LOAD_MODULE` est déclenché. Elle admet pour argument unique le gestionnaire de module courant.

**Modèle de la méthode par défaut**

```php
// Module.php

class Module
{
  public function init(Zend\ModuleManager\ModuleManager $moduleManager)
  {
    // code, probablement en utilisant $moduleManager
  }
}
```

Les méthodes de la classe `Zend\ModuleManager\ModuleManager` sont disponibles dans l'<a href="http://framework.zend.com/apidoc/2.4/classes/Zend.ModuleManager.ModuleManager.html" target="_blank">API de Zend Framework 2</a> mais vous aurez probablement un intérêt pour les méthodes suivantes :

- `ModuleManager::getEvent` : l'objet **Zend\ModuleManager\ModuleEvent**
- `ModuleManager::getEventManager` : l'objet **Zend\EventManager\EventManagerInterface**
- `ModuleManager::getLoadedModules` : la liste des modules chargés
- `ModuleManager::getModule(nom du module)` : l'objet **Module** par son nom
- `ModuleManager::getModules` : la liste des modules à charger

La document précise toutefois qu'il n'est pas possible de garantir que tous les modules aient été correctement chargés au moment où la méthode `Module::init()` est appelée. Cela peut générer des problèmes si la méthode `Module::init()` a des dépendances avec d'autres modules. Il est donc recommandé de faire usage de l'événement `ModuleEvent::EVENT_LOAD_MODULES_POST` afin d'assurer que tout se passe bien.

```php
class Module
{
  public function init(Zend\ModuleManager\ModuleManager $moduleManager)
  {
    $events = $moduleManager->getEventManager() ;
    $events->attach('ModuleEvent::EVENT_LOAD_MODULES_POST', array($this, 'onceModulesLoaded')) ;
  }

  public function onceModulesLoaded(Zend\EventManager\EventInterface $event)
  {
    $moduleManager = $event->getTarget() ;
    // faire ce qui est nécessaire maintenant
    // qu'on s'est assuré que tous les modules étaient chargés
    // et qu'on a récupéré le moduleManager
  }
}
```

### <a name="onBootstrap" id="onBootstrap">Méthode Module::onBootstrap()</a>

Cette méthode est appelée lorsque l'événement `MvcEvent::EVENT_BOOTSTRAP` est déclenché. Elle admet pour argument unique un objet **Zend\Mvc\MvcEvent**. Il faut savoir que l'événement `MvcEvent::EVENT_BOOTSTRAP` est déclenché après l'événement `ModuleEvent::EVENT_LOAD_MODULES_POST`.

**Modèle de la méthode par défaut**

```php
// Module.php

class Module
{
  public function onBootstrap(Zend\Mvc\MvcEvent $mvcEvent)
  {
    // code, probablement en utilisant $mvcEvent
  }
}
```

Les méthodes de la classe `Zend\Mvc\MvcEvent` sont disponibles dans l'<a href="http://framework.zend.com/apidoc/2.4/classes/Zend.Mvc.MvcEvent.html" target="_blank">API de Zend Framework 2</a> mais vous aurez probablement un intérêt pour les méthodes suivantes :

- `MvcEvent::getApplication`: l'objet **Zend\Mvc\ApplicationInterface**
- `MvcEvent::getController` : le nom du contrôleur courant
- `MvcEvent::getControllerClass` : le nom de la classe du contrôleur
- `MvcEvent::getError` : le message d'erreur
- `MvcEvent::getName` : le nom de l'événement
- `MvcEvent::getParam(nom du paramètre)` : le paramètre
- `MvcEvent::getParams` : le tableau des paramètres
- `MvcEvent::getRequest` : l'objet **Zend\Stdlib\RequestInterface**
- `MvcEvent::getResponse` : l'objet **Zend\Stdlib\ResponseInterface**
- `MvcEvent::getResult`
- `MvcEvent::getRouteMatch` : l'objet **Zend\Mvc\Router\RouteMatch**
- `MvcEvent::getRouter` : l'objet **Zend\Mvc\Router\RouteStackInterface**
- `MvcEvent::getTarget` : la cible de l'événement
- `MvcEvent::getViewModel` : l'objet **Zend\View\Model\ModelInterface**
- `MvcEvent::isError` : booléen
- `MvcEvent::propagationIsStopped` : booléen

Pour les méthodes `Module::init()` et `Module::onBootstrap()`, il faut savoir que ces deux méthodes sont appelées à chaque fois qu'on appelle une page, sur chacun des modules qui les utilisent. Il n'est donc pas recommandé d'en abuser.

Les deux méthodes sont appelées 'pratiquement' au même moment. Toutefois, l'intérêt de l'une et de l'autre, d'après moi, est que `Module::init()` qui accepte une instance du **Zend\ModuleManager\ModuleManager** comme argument, permet d'intervenir directement sur les modules, et savoir quoi faire après leur chargement alors que `Module::onBootstrap()` accepte une instance de **Zend\Mvc\MvcEvent** comme argument et permet d'intervenir sur l'application plutôt.

### <a name="getServiceConfig" id="getServiceConfig">Méthode Module::getServiceConfig()</a>

Cette méthode est celle que vous utilisez le plus si vous faites appel, comme c'est recommandé, au **gestionnaire de services**. Mais, en parcourant la documentation, on s'aperçoit que le gestionnaire de services à son tour charge d'autres gestionnaires qui viennent s'ajouter à l'application.

Vous trouverez toute la documentation utile sur la page <a href="http://framework.zend.com/manual/current/en/modules/zend.service-manager.quick-start.html" target="_blank">Quick Start du **Service Manager**</a> et sur la page des <a href="http://framework.zend.com/manual/current/en/modules/zend.mvc.services.html" target="_blank">services de l'application</a>.

Le **gestionnaire de services** utilisé par défaut dans l'application de Zend Framework, c'est **Zend\ServiceManager\ServiceManager**.

**Modèle de la méthode par défaut**

```php
// Module.php

class Module
{
  function getServiceConfig()
  {
    return array(
      'invokables' => array(
        'ServiceName' => 'Namespace\To\My\Service',
      ),
    ) ;
  }
}
```

Si vous ne souhaitez pas alourdir votre classe `Module`, vous pouvez également déclarer les mêmes services, mais cette fois directement dans un fichier de configuration de votre choix. Il faut juste utiliser la clé '*service_manager*'.

```php
// module.config.php ou un autre fichier

return array(
  'service_manager' => array(
    'invokables' => array(
      'ServiceName' => 'Namespace\To\My\Service',
    ),
  ),
) ;
```

Si vous ne souhaitez pas alléger la classe `Module` pour alourdir le fichier `module.config.php`, <a href="https://juriansluiman.nl/article/120/using-zend-framework-service-managers-in-your-application" target="_blank">**Jurian Sluiman**</a> a une solution intéressante : créer un tableau de configuration dédié aux services.

```php
// Module.php

class Module
{
  function getServiceConfig()
  {
    return include __DIR__ . '/config/service.config.php';
  }
}
```

**Attention pour ceux qui optent pour les services dans le tableau de configuration (soit dans `service.config.php`, soit dans `module.config.php`)**.

Concernant la création des services avec une fabrique : **Evan Coury** (son article n'est plus disponible à ce jour) a noté que la *fabrique par closure* ne fonctionnait pas bien dans le tableau de configuration. Il valait mieux, dans ce cas, créer une classe qui implémente `Zend\ServiceManager\FactoryInterface`. Cette information date un peu et elle mérite d'être vérifiée. Personnellement, mes services sont créés avec des fabriques directement dans ma classe `Module` : je ne suis donc pas concerné. Je tâcherais de faire un article sur les fabriques un de ces jours.

Si vous souhaitez bricoler votre propre **gestionnaire de services**, il faudra qu'il implémente l'interface `Zend\ModuleManager\Feature\ServiceProviderInterface`.

### <a name="getControllerConfig" id="getControllerConfig">Méthode Module::getControllerConfig()</a>

Cette méthode fait appel au **gestionnaire de contrôleurs**. Le gestionnaire de contrôleurs est chargé par le **gestionnaire de services**.

Vous pouvez y accéder avec cette clé 

```php
$serviceManager->get('ControllerLoader') ;
```

Contrairement à ZF1 pour ceux qui se souviennent, un contrôleur était identifié s'il s'appelait *Controller/qqchController*... (ou un truc comme ça). Avec ZF2, l'application n'identifie plus les contrôleurs d'elle même. Il faut donner la liste des contrôleurs utilisés. Certains parleront de sécurité. D'autres parleront de modularité. Je n'ai pas plus d'explication en la matière mais ma conviction est que moins d'éléments restent "cachés", moins il sera compliqué de s'en affranchir.

Le **gestionnaire de contrôleurs** par défaut de l'application MVC, c'est **Zend\Mvc\Controller\ControllerManager**.

**Modèle de la méthode**

```php
// Module.php

class Module
{
  function getControllerConfig()
  {
    return array(
      'invokables' => array(
        'ControllerName' => 'Namespace\To\My\Controller',
      ),
    ) ;
  }
}
```

Si vous ne souhaitez pas alourdir votre classe `Module`, vous pouvez également déclarer les mêmes services, mais cette fois directement dans un fichier de configuration de votre choix. Il faut juste utiliser la clé '*controllers*'.

```php
// module.config.php ou un autre

return array(
  'controllers' => array(
    'invokables' => array(
      'ControllerName' => 'Namespace\To\My\Controller',
    ),
  ),
) ;
```

Si vous souhaitez bricoler votre propre **gestionnaire de contrôleurs**, il faudra qu'il implémente l'interface `Zend\ModuleManager\Feature\ControllerProviderInterface`.

### <a name="getFormElementConfig" id="getFormElementConfig">Méthode Module::getFormElementConfig()</a>

Cette méthode fait appel au **gestionnaire d'éléments de formulaire**. Le gestionnaire d'éléments de formulaire est chargé par le **gestionnaire de services**.

Vous pouvez y accéder avec cette clé

```php
$serviceManager->get('FormElementManager') ;
```

Afin de <a href="http://framework.zend.com/manual/current/en/modules/zend.form.advanced-use-of-forms.html#handling-dependencies" target="_blank">gérer les dépendances dans les éléments de formulaire</a>, avec ZF2, vous allez devoir créer des éléments de formulaire personnalisé avec leurs dépendances. Ces éléments personnalisés doivent être déclarés dans le gestionnaire d'éléments de formulaire afin de pouvoir être utilisés dans l'application.

Le **gestionnaire d'éléments de formulaire** par défaut de l'application MVC, c'est **Zend\Form\FormElementManager**.

**Modèle de la méthode**

```php
// Module.php

class Module
{
  function getFormElementConfig()
  {
    return array(
      'invokables' => array(
        'ElementName' => 'Namespace\To\My\Form\Element',
      ),
    ) ;
  }
}
```

Si vous ne souhaitez pas alourdir votre classe `Module`, vous pouvez également déclarer les mêmes services, mais cette fois directement dans un fichier de configuration de votre choix. Il faut juste utiliser la clé '*form_elements*'.

```php
// module.config.php ou un autre

return array(
  'form_elements' => array(
    'invokables' => array(
      'ElementName' => 'Namespace\To\My\Form\Element',
    ),
  ),
) ;
```

Si vous souhaitez bricoler votre propre **gestionnaire d'éléments de formulaire**, il faudra qu'il implémente l'interface `Zend\ModuleManager\Feature\FormElementProviderInterface`.

### <a name="getViewHelperConfig" id="getViewHelperConfig">Méthode Module::getViewHelperConfig()</a>

Cette méthode fait appel au **gestionnaire d'aides de vue**. Le gestionnaire d'aides de vue est chargé par le **gestionnaire de services**.

Vous pouvez y accéder avec cette clé

```php
$serviceManager->get('ViewHelperManager') ;
```

Les <a href="http://framework.zend.com/manual/current/en/modules/zend.view.helpers.advanced-usage.html" target="_blank">aides de vues</a> (*View Helper* en anglais) sont des objets qui peuvent être appelés par n'importe quel template de vue de votre application et qui vont pouvoir traiter de l'information. C'est, à peu près, l'équivant d'un plugin, d'un snippet, d'un bloc chez Drupal ou d'un widget chez Wordpress. Bon, je dis n'importe quel template mais je pense beaucoup aux templates HTML. Je ne vois pas comment on peut exploiter ça en json ou en XML mais si on peut le faire en HTML, je ne vois pas pourquoi on ne pourrait pas le faire pour un autre format de template...

Le **gestionnaire d'aide de vue** utilisé par défaut dans l'application MVC, c'est **Zend\View\HelperPluginManager**.

**Modèle de la méthode**

```php
// Module.php

class Module
{
  function getViewHelperConfig()
  {
    return array(
      'invokables' => array(
        'ViewHelperName' => 'Namespace\To\My\View\Helper',
      ),
    ) ;
  }
}
```

Si vous ne souhaitez pas alourdir votre classe `Module`, vous pouvez également déclarer les mêmes services, mais cette fois directement dans un fichier de configuration de votre choix. Il faut juste utiliser la clé '*view_helpers*'.

```php
// module.config.php ou un autre

return array(
  'view_helpers' => array(
    'invokables' => array(
      'ViewHelperName' => 'Namespace\To\My\View\Helper',
    ),
  ),
) ;
```

Si vous souhaitez bricoler votre propre **gestionnaire d'aide de vue**, il faudra qu'il implémente l'interface `Zend\ModuleManager\Feature\ViewHelperProviderInterface`.

### <a name="getControllerPluginConfig" id="getControllerPluginConfig">Méthode Module::getControllerPluginConfig()</a>

Cette méthode fait appel au **gestionnaire de plugins de contrôleur**. Le gestionnaire de plugins de contrôleur est chargé par le **gestionnaire de services**.

Vous pouvez y accéder avec cette clé

```php
$serviceManager->get('ControllerPluginManager') ;
```

Les <a href="http://framework.zend.com/manual/current/en/modules/zend.mvc.plugins.html" target="_blank">plugins de contrôleur</a>, anciennement *aides d'action* avec ZF1 (*Action Helper*en anglais) sont des objets qui peuvent être appelés par n'importe quel objet contrôleur. Un plugin quoi... De quoi traiter les informations de la même façon d'un contrôleur à un autre sans avoir à tout réécrire à chaque fois...

Il manque une documentation étendue sur la façon de créer son propre plugin de contrôleur. Toutefois, on trouve des tutoriaux assez facilement sur internet et à franchement parler, ce n'est pas sorcier. Je ferais un article sur ce sujet plus tard.

Le **gestionnaire de plugin de contrôleur** utilisé par défaut dans l'application MVC, c'est **Zend\Mvc\Controller\PluginManager**.

**Modèle de la méthode**

```php
// Module.php

class Module
{
  function getControllerPluginConfig()
  {
    return array(
      'invokables' => array(
        'ControllerPluginName' => 'Namespace\To\My\Controller\Plugin',
      ),
    ) ;
  }
}
```

Si vous ne souhaitez pas alourdir votre classe `Module`, vous pouvez également déclarer les mêmes services, mais cette fois directement dans un fichier de configuration de votre choix. Il faut juste utiliser la clé '*controller_plugins*'.

```php
// module.config.php ou un autre

return array(
  'controller_plugins' => array(
    'invokables' => array(
      'ControllerPluginName' => 'Namespace\To\My\Controller\Plugin',
    ),
  ),
) ;
```

Si vous souhaitez bricoler votre propre **gestionnaire de plugins de contrôleur**, il faudra qu'il implémente l'interface `Zend\ModuleManager\Feature\ControllerPluginProviderInterface`.

### <a name="getFilterConfig" id="getFilterConfig">Méthode Module::getFilterConfig()</a>

Cette méthode fait appel au **gestionnaire de filtres**. Le gestionnaire de filtres est chargé par le **gestionnaire de services**.

Vous pouvez y accéder avec cette clé

```php
$serviceManager->get('FilterManager') ;
```

Voir la <a href="http://framework.zend.com/manual/current/en/modules/zend.filter.html" target="_blank">documentation de **Zend\Filter**</a>.

Le **gestionnaire de filtres** utilisé par défaut est **Zend\Filter\FilterPluginManager**.

**Modèle de la méthode**

```php
// Module.php

class Module
{
  function getFilterConfig()
  {
    return array(
      'invokables' => array(
        'FilterName' => 'Namespace\To\My\Filter',
      ),
    ) ;
  }
}
```

Si vous ne souhaitez pas alourdir votre classe `Module`, vous pouvez également déclarer les mêmes services, mais cette fois directement dans un fichier de configuration de votre choix. Il faut juste utiliser la clé '*filters*'.

```php
// module.config.php ou un autre

return array(
  'filters' => array(
    'invokables' => array(
      'FilterName' => 'Namespace\To\My\Filter',
    ),
  ),
) ;
```

Si vous souhaitez bricoler votre propre **gestionnaire de filtres**, il faudra qu'il implémente l'interface `Zend\ModuleManager\Feature\FilterProviderInterface`.

### <a name="getInputFilterConfig" id="getInputFilterConfig">Méthode Module::getInputFilterConfig()</a>

Cette méthode fait appel au **gestionnaire de filtres de saisie**. Le gestionnaire de filtres de saisie est chargé par le **gestionnaire de services**.

Vous pouvez y accéder avec cette clé

```php
$serviceManager->get('InputFilterManager') ;
```

On parle ici des <a href="http://framework.zend.com/manual/current/en/modules/zend.input-filter.intro.html" target="_blank">filtres appliqués sur les éléments de formulaire</a>.

Le **gestionnaire de filtre de saisie** est **Zend\InputFilter\InputFilterPluginManager**.

**Modèle de la méthode**

```php
// Module.php

class Module
{
  function getInputFilterConfig()
  {
    return array(
      'invokables' => array(
        'InputFilterName' => 'Namespace\To\My\Input\Filter',
      ),
    ) ;
  }
}
```

Si vous ne souhaitez pas alourdir votre classe `Module`, vous pouvez également déclarer les mêmes services, mais cette fois directement dans un fichier de configuration de votre choix. Il faut juste utiliser la clé '*input_filters*'.

```php
// module.config.php ou un autre

return array(
  'input_filters' => array(
    'invokables' => array(
      'InputFilterName' => 'Namespace\To\My\Input\Filter',
    ),
  ),
) ;
```

Si vous souhaitez bricoler votre propre **gestionnaire de filtres de saisie**, il faudra qu'il implémente l'interface `Zend\ModuleManager\Feature\InputFilterProviderInterface`.

### <a name="getValidatorConfig" id="getValidatorConfig">Méthode Module::getValidatorConfig()</a>

Cette méthode fait appel au **gestionnaire de validateurs**. Le gestionnaire de validateurs est chargé par le **gestionnaire de services**.

Vous pouvez y accéder avec cette clé

```php
$serviceManager->get('ValidatorManager') ;
```

Voir la <a href="http://framework.zend.com/manual/current/en/modules/zend.validator.html" target="_blank">documentation de **Zend\Validator**</a>

Le **gestionnaire de validateurs** est **Zend\Validator\ValidatorPluginManager**.

**Modèle de la méthode**

```php
// Module.php

class Module
{
  function getValidatorConfig()
  {
    return array(
      'invokables' => array(
        'ValidatorName' => 'Namespace\To\My\Validator',
      ),
    ) ;
  }
}
```

Si vous ne souhaitez pas alourdir votre classe `Module`, vous pouvez également déclarer les mêmes services, mais cette fois directement dans un fichier de configuration de votre choix. Il faut juste utiliser la clé '*validators*'.

```php
// module.config.php ou un autre

return array(
  'validators' => array(
    'invokables' => array(
      'ValidatorName' => 'Namespace\To\My\Validator',
    ),
  ),
) ;
```

Si vous souhaitez bricoler votre propre **gestionnaire de validateurs**, il faudra qu'il implémente l'interface `Zend\ModuleManager\Feature\ValidatorProviderInterface`.

### <a name="getHydratorConfig" id="getHydratorConfig">Méthode Module::getHydratorConfig()</a>

Cette méthode fait appel au **gestionnaire d'hydrateurs**. Le gestionnaire d'hydrateurs est chargé par le **gestionnaire de services**.

Vous pouvez y accéder avec cette clé

```php
$serviceManager->get('HydratorManager') ;
```

Ce gestionnaire me laisse perplexe. Il faudra jeter un coup d'oeil soit sur la documentation, soit dans le source pour voir de quoi il s'agit. Toutefois, voici la <a href="http://framework.zend.com/manual/current/en/modules/zend.stdlib.hydrator.html" target="_blank">documentation des hydrateurs</a> par défaut de Zend Framework 2.

Le **gestionnaire d'hydrateurs** utilisé par défaut est un objet **Zend\Stdlib\Hydrator\HydratorPluginManager**.

**Modèle de la méthode**

```php
// Module.php

class Module
{
  function getHydratorConfig()
  {
    return array(
      'invokables' => array(
        'HydratorName' => 'Namespace\To\My\Hydrator',
      ),
    ) ;
  }
}
```

Si vous ne souhaitez pas alourdir votre classe `Module`, vous pouvez également déclarer les mêmes services, mais cette fois directement dans un fichier de configuration de votre choix. Il faut juste utiliser la clé '*hydrators*'.

```php
// module.config.php ou un autre

return array(
  'hydrators' => array(
    'invokables' => array(
      'HydratorName' => 'Namespace\To\My\Hydrator',
    ),
  ),
) ;
```

Si on souhaite créer son propre **gestionnaire d'hydrateurs**, il faut implémenter l'interface `Zend\ModuleManager\Feature\HydratorProviderInterface`.

### <a name="getRouteConfig" id="getRouteConfig">Méthode Module::getRouteConfig()</a>

Cette méthode fait appel au **gestionnaire de routes**. Le gestionnaire de routes est chargé par le **gestionnaire de services**.

Toutefois, je reste très prudente sur cette méthode : Le **gestionnaire de services** charge une clé '*router*' qui fait un lien symbolique vers la classe `Zend\Mvc\Service\RouterFactory` qui, selon l'environnement, déclenche soit `ConsoleRouter`, soit `HttpRouter`. `HttpRouter` est lié quant à lui à l'objet `Zend\Mvc\Service\RouterFactory` qui a pour tâche de récupérer dans le tableau de configuration la clé '*router*' et de créer toutes les routes contenues sous cette clé. Pour faire court, la clé '*router*' crée - normalement - *l'unique arbre des routes*.

D'autre part, le **gestionnaire de services** charge également une autre clé '*RoutePluginManager*' qui correspond à l'objet **Zend\Mvc\Service\RoutePluginManagerFactory**. Généralement, dans ZF2, les **PluginManager** servent à créer des objets grâce à un tableau associatif et si on se réfère aux autres méthodes de la classe `Module`, les autres méthodes concernent également des **PluginManager**. La clé '*RoutePluginManager*' crée donc toutes les routes, une à une.

Je pense que `Module::getRouteConfig()` devrait correspondre plutôt à la clé '*RoutePluginManager*' (`$serviceManager->get('HydratorManager') ;`) si on se réfère au type d'utilisation qu'on fait sur les autres **PluginManager** : il y a **un seul** arbre de routes mais **plusieurs** routes. Du coup, ça a plus de sens de se dire que le **gestionnaire de routes** gère **les routes** et non pas l'arbre des routes... mais je ne suis pas sûr.

Dans ces cas là, la clé à utiliser dans le tableau de configuration serait '*route_manager*' : gestion des routes.

De base dans les documentations et tutoriaux, vous trouverez plutôt une clé '*router *' dans le tableau de configuration. C'est la clé qui correspond à l'arbre des routes.

Vous trouverez de la documentation complémentaire pour <a href="http://http://framework.zend.com/manual/current/en/modules/zend.mvc.routing.html" target="_blank">**Zend\Mvc\Router**</a>.

Le **gestionnaire de routes** utilisé par défaut est l'objet **Zend\Mvc\Router\RoutePluginManager**

**Modèle de la méthode**

```php
// Module.php

class Module
{
  function getRouteConfig()
  {
    return array() ;
  }
}
```

Si vous ne souhaitez pas alourdir votre classe `Module`, vous pouvez également déclarer les mêmes services, mais cette fois directement dans un fichier de configuration de votre choix. Il faut juste utiliser la clé '*route_manager*' (d'après mon raisonnement ci dessus). Dans la documentation du router, on mentionne une clé '*route_plugins*' qui correspond également à la classe **Zend\Mvc\Router\RoutePluginManager**. Du coup, potentiellement, c'est l'une ou l'autre clé.

```php
// module.config.php ou un autre

return array(
  'route_manager' => array(),
) ;
```

Personnellement, j'utilise la clé '*router*' dans le tableau de configuration et je construit toute mes routes à cet endroit là. Je n'utilise donc pas le gestionnaire de routes. De toutes façons, la fabrique qui construit toute les routes à partir de la clé '*router*' du fichier de configuration doit forcément inclure le **gestionnaire de routes**...

*TODO* : Toutefois, lorsqu'il y a beaucoup de routes imbriquées les unes dans les autres, j'avoue que le tableau associatif qui en résulte est très compliqué à maintenir et qu'on se retrouve rapidement avec de nombreuses indentations. Si cela se révèle assez illisible (et ça peut), il faudra se pencher sur ce gestionnaire.

Si on souhaite créer son propre **gestionnaire de routes**, il faut implémenter l'interface `Zend\ModuleManager\Feature\RouteProviderInterface`.

### <a name="getSerializerConfig" id="getSerializerConfig">Méthode Module::getSerializerConfig()</a>

Cette méthode fait appel au **gestionnaire de serialisation**. Le gestionnaire de serialisation est chargé par le **gestionnaire de services**.

Vous pouvez y accéder avec cette clé

```php
$serviceManager->get('SerializerAdapterManager') ;
```

Voir la <a href="http://framework.zend.com/manual/current/en/modules/zend.serializer.html" target="_blank">documentation de **Zend\Serializer**</a>.

Le **gestionnaire de serialisation** utilisé par défaut est le **Zend\Serializer\AdapterPluginManager**.

**Modèle de la méthode**

```php
// Module.php

class Module
{
  function getSerializerConfig()
  {
    return array(
      'invokables' => array(
        'SerializerName' => 'Namespace\To\My\Serializer',
      ),
    ) ;
  }
}
```

Si vous ne souhaitez pas alourdir votre classe `Module`, vous pouvez également déclarer les mêmes services, mais cette fois directement dans un fichier de configuration de votre choix. Il faut juste utiliser la clé '*serializers*'.

```php
// module.config.php ou un autre

return array(
  'serializers' => array(
    'invokables' => array(
      'SerializerName' => 'Namespace\To\My\Serializer',
    ),
  ),
) ;
```

Si on souhaite créer son propre **gestionnaire de serialisation**, il faut implémenter l'interface `Zend\ModuleManager\Feature\SerializerProviderInterface`.

### <a name="getLogProcessorConfig" id="getLogProcessorConfig">Méthode Module::getLogProcessorConfig()</a>

Cette méthode fait appel au **gestionnaire de moteur de journalisation (?)**. Le gestionnaire de moteur de journalisation est chargé par le **gestionnaire de services**.

Vous pouvez y accéder avec cette clé

```php
$serviceManager->get('LogProcessorManager') ;
```

Voir <a href="http://framework.zend.com/manual/current/en/modules/zend.log.overview.html" target="_blank">la documentation de **Zend\Log**</a>

Le **gestionnaire de moteurs de journalisation** utilisé par défaut est le **Zend\Log\ProcessorPluginManager**.

**Modèle de la méthode**

```php
// Module.php

class Module
{
  function getLogProcessorConfig()
  {
    return array(
      'invokables' => array(
        'ProcessorName' => 'Namespace\To\My\Log\Processor',
      ),
    ) ;
  }
}
```

Si vous ne souhaitez pas alourdir votre classe `Module`, vous pouvez également déclarer les mêmes services, mais cette fois directement dans un fichier de configuration de votre choix. Il faut juste utiliser la clé '*log_processors*'.

```php
// module.config.php ou un autre

return array(
  'log_processors' => array(
    'invokables' => array(
      'ProcessorName' => 'Namespace\To\My\Log\Processor',
    ),
  ),
) ;
```

Si on souhaite créer son propre **gestionnaire de processeurs de journalisation**, il faut implémenter l'interface `Zend\ModuleManager\Feature\LogProcessorProviderInterface`.

### <a name="getLogWriterConfig" id="getLogWriterConfig">Méthode Module::getLogWriterConfig()</a>

Cette méthode fait appel au **gestionnaire de destination de journalisation**. Le gestionnaire de destination de journalisation est chargé par le **gestionnaire de services**.

Vous pouvez y accéder avec cette clé

```php
$serviceManager->get('LogWriterManager') ;
```

Le **gestionnaire de destination de journalisation** utilisé par défaut est le **Zend\Log\WriterPluginManager**.

**Modèle de la méthode**

```php
// Module.php

class Module
{
  function getLogWriterConfig()
  {
    return array(
      'invokables' => array(
        'LogWriterName' => 'Namespace\To\My\Log\Writer',
      ),
    ) ;
  }
}
```

Si vous ne souhaitez pas alourdir votre classe `Module`, vous pouvez également déclarer les mêmes services, mais cette fois directement dans un fichier de configuration de votre choix. Il faut juste utiliser la clé '*log_writers*'.

```php
// module.config.php ou un autre

return array(
  'log_writers' => array(
    'invokables' => array(
      'LogWriterName' => 'Namespace\To\My\Log\Writer',
    ),
  ),
) ;
```

Si on souhaite créer son propre **gestionnaire de destination de journalisation**, il faut implémenter l'interface `Zend\ModuleManager\Feature\LogWriterProviderInterface`.

## Ce qu'il faut également savoir sur les modules

Normalement (non testé), vous pouvez accéder à votre module (pourquoi donc se faire ?) en utilisant ce code :

```php
$serviceManager->get('NomDuModule').
```

C'est peut être bon à savoir même si je ne sais pas si c'est utile à quelqu'un. Je n'ai pas trouvé d'application pratique sur le net... pour le moment.

Voila tout ce que j'ai trouvé sur la classe `Module`. J'étais parti pour recenser toutes ces méthodes que je découvrais au fur et à mesure dans les tutoriaux, en pestant parce que bon-dieu-mais-pourquoi-ça-ils-le-disent-pas-avant ? mais finalement, comme la plupart du temps, j'étais mauvaise langue. Tout est soigneusement documenté. Je n'ai pas su lire la doc.
