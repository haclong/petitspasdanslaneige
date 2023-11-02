---
title: "La configuration dans Zend Framework 2 - 1ere partie"
permalink: "fr/posts/la-configuration-dans-zend-framework-2-1ere-partie.html"
date: "2013-05-17T20:08"
slug: la-configuration-dans-zend-framework-2-1ere-partie
layout: post
drupal_uuid: 75743bed-9a86-4eec-be4f-5146f8f6f955
drupal_nid: 36
lang: fr
author: haclong

media:
  path: /img/teaser/musictechnique.jpg

tags:
  - "zend framework 2"
  - "application"
  - "configuration"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Une application MVC développée avec Zend Framework 2 se structure grâce à des modules. La volonté de l'équipe de développement de Zend Framework est de créer des unités indépendantes les unes des autres. Cela permet de développer des modules qui peuvent facilement être branché et débranché d'une application. Afin de faciliter cet effet plugin, il faut savoir que chaque module embarque avec lui son propre fichier de configuration (contrairement à Zend Framework 1 qui concentrait la configuration dans un seul fichier de configuration). Mais que faut il savoir devant la démultiplication des fichiers de config ?
"
---

Une application MVC développée avec Zend Framework 2 se structure grâce à des modules. La volonté de l'équipe de développement de Zend Framework est de créer des unités indépendantes les unes des autres. Cela permet de développer des modules qui peuvent facilement être branché et débranché d'une application. Afin de faciliter cet effet plugin, il faut savoir que chaque module embarque avec lui son propre fichier de configuration (contrairement à Zend Framework 1 qui concentrait la configuration dans un seul fichier de configuration).

Mais que faut il savoir devant la démultiplication des fichiers de config ?

### Prérequis

Vous avez installé Zend Framework 2.0 ou 2.1 et vous avez installé le <a href="https://github.com/zendframework/ZendSkeletonApplication" target="_blank">**ZendSkeletonApplication**</a> utile pour démarrer une application MVC développée avec Zend Framework 2.

La configuration, dans le cadre d'une application "standard" de Zend Framework 2, se présente comme un tableau php.

Chaque fichier de configuration présente invariablement la même structure : 

```php
<?php
 return array() ;
?>
```

Il ne tient qu'à vous de compléter le tableau.

### Utiliser la configuration

Zend Framework 2 a les composants nécessaires pour charger / concaténer les informations des différents tableaux de configuration pour que l'on puisse les utiliser.

Dans la pratique, on aura forcément besoin de la configuration à partir d'une classe. N'importe laquelle. Concrètement, il faudra que cette classe puisse appeler la classe `ServiceLocator`. Si vous trouvez un chemin pour arriver jusqu'à `ServiceLocator`, alors vous trouverez votre configuration.

En partant du **ZendSkeletonApplication**, sans trop se fouler, voici comment on peut arriver jusqu'à notre `ServiceLocator`.

#### Par la classe Module

Dans tous les callback de la fonction `getServiceConfig()` du fichier `Module.php`. (Dans les différents tutoriaux sur Zend Framework 2, cette fonction sert à configurer et gérer les dépendances de vos différents services).

```php
// Module.php

public function getServiceConfig()
{
  return array(
    'factories' => array(
      'monService' => function ($serviceManager) { // par défaut, la fonction passe le service manager en paramètre. Ne me demandez pas comment. C'est comme ça.
        $maConfiguration = $serviceManager->get('config') ; 
        // ou
        $maConfiguration = $serviceManager->get('Configuration') ; // les deux fonctionnent.
      },
    ),
  ) ;
}
```

#### Dans toutes les fonctions liées au gestionnaire d'événement

```php
// Module.php

public function onLoadModulesPost($event) // par défaut, la fonction passe un objet $event. La bonne question à se poser, c'est quelle est la liste complète des fonctions on* qu'on peut utiliser.
{
  $maConfiguration = $event->getConfigListener()->getMergedConfig(false) ;
  // ou
  $maConfiguration = $event->getApplication()->getServiceManager()->get('Configuration') ;
}
```

#### Par les contrôleurs

La classe <a href="http://framework.zend.com/manual/2.2/en/modules/zend.mvc.controllers.html#the-abstractactioncontroller" target="_blank">`AbstractActionController`</a> implémente `ServiceLocatorAwareInterface`. Ainsi, à partir de n'importe lequel de vos contrôleurs, vous pouvez accéder à votre configuration.

```php
// monController.php

function myFunction() // pas forcément une action et pas forcément une fonction publique non plus. Du moment qu'elle est dans une classe controlleur qui étends AbstractActionController
{
  $maConfiguration = $this->getServiceLocator()->get('Configuration') ;
}
```

#### Par d'autres classes (dont les vôtres)

Si vous souhaitez accéder à votre configuration à partir d'autres classes (ni `Module`, ni contrôleurs), vous pouvez soit implémenter `ServiceLocatorAwareInterface`, soit charger votre configuration au moment de l'appel à votre classe.

Si votre classe implémente <a href="http://framework.zend.com/manual/2.2/en/modules/zend.service-manager.quick-start.html" target="_blank">`ServiceLocatorAwareInterface`</a>, d'après la documentation de Zend Framework 2, vous êtes tenu de rajouter ces deux fonctions à votre classe : `setServiceLocator()` et `getServiceLocator()`

```php
// maClasse.php

class maClasse implements ServiceLocatorAwareInterface
{
  protected $services;

  // fonction à ajouter selon ServiceLocatorAwareInterface
  public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
  {
    $this->services = $serviceLocator ;
  }

  // fonction à ajouter selon ServiceLocatorAwareInterface
  public function getServiceLocator()
  {
    return $this->services ;
  }
}
```

```php
// Module.php

public function getServiceConfig()
{
  return array(
    'invokables'=> array(
      'maClasse' => 'maClasse' ;
    ),
  ) ;
}
```

**NOTE***Je n'ai pas réussi à implémenter correctement ServiceLocatorAwareInterface. D'après ce que j'ai vu sur les forums, il semblerait que ce soit comme ça qu'il faille faire. Dans la mesure où je suis quand même obligé de charger ma classe dans le Service Manager et que je rajoute des lignes supplémentaires dans le code de ma classe, j'ai préféré opter pour la version où la configuration est injectée dans mon service à l'instanciation de ce dernier.*

Pour injecter la configuration à l'instanciation de votre classe, voici ce que vous pouvez faire :

```php
// Module.php

public function getServiceConfig()
{
  return array(
    'factories' => array(
      'maClasse' => function ($serviceManager) { 
        $maConfiguration = $serviceManager->get('Configuration') ;
        $maClasse = new maClasse() ;
        $maClasse->setConfig($maConfiguration) ; // c'est par là que j'envoie ma configuration à ma classe.
        return $maClasse ; 
      },
    ),
  ) ;
}
```

```php
// maClasse.php

class maClasse
{
  protected $config ;

  public function setConfig($config)
  {
    $this->config = $config ;
  }
}
```

### Accéder aux clés de configuration

Une fois que vous avez récupéré le tableau de configuration (`$maConfiguration`), vous l'utilisez comme un tableau php standard. Voici dans les grosses mailles des fichiers de configuration répartis un peu partout dans votre application.

```php
// module/Module1/config/module.config.php

<?php
return array(
  'myModule1Key' => array(),
) ;
```

```php
// module/Module2/config/module.config.php

<?php
return array(
  'myModule2Key' => array(),
);
```

```php
// config/application.config.php

<?php
return array(
  'myAppliKey1' => array(),
  'myAppliKey2' => array(), // il peut y avoir plusieurs clés par fichier de configuration, bien sûr.
);
```

```php
// config/autoload/global.php

<?php
return array(
  'myGlobalKey' => array(),
);
```

```php
// config/autoload/local.php

<?
return array(
  'myLocalKey' => array(),
);
```

Pour accéder à chacune de ces clés de configuration :

```php
$maConfiguration = $serviceManager->get('Configuration') ;
$configurationDuModule1 = $maConfiguration['myModule1Key'] ;
$configurationDuModule2 = $maConfiguration['myModule2Key'] ;
$configurationGlobal = $maConfiguration['myGlobalKey'] ;
```

### Chemin pour les fichiers de configuration

Dans la classe `Module`, il y a une fonction, obligatoire, qui définit le chemin vers votre fichier de config :

```php
//Module.php

public function getConfig()
{
  return include __DIR__ . '/config/module.config.php' ;
}
```

Tel que défini là, le fichier se trouve donc dans `module/monModule/config/module.config.php`. Il permet donc de définir un fichier `module.config.php` par module.

Il faut également compter sur le fichier de configuration de l'application.

```php
// index.php

Zend\Mvc\Application::init(require 'config/application.config.php')->run() ;
```

Ce fichier, comme indiqué, se situe dans `config/`

Le fichier `config/application.config.php`

- liste les modules qui doivent être chargés, 
- définit le chemin où l'application peut trouver les modules
- définit le chemin où des fichiers de configuration supplémentaires seront chargés en dernier dans l'application (surchargeant les options de configuration si certaines clés apparaissent en double)

```php
//application.config.php

//liste des modules qui doivent être chargés
'modules' => array(),

//le chemin où on peut trouver des modules
'module_listener_options' => array(
  'module_paths' => array(
    './module',
    './vendor',
  ),
),

//chemin et regex des fichiers de configuration supplémentaires
'module_listener_options' => array(
  'config_glob_paths' => array(
    'config/autoload/{,*.}{global,local}.php',
  ),
),
```

### Les différents fichiers config

#### config/application.config.php

C'est le fichier de configuration principal de votre application.

La gestion de la priorité sur l'ordre de chargement des modules est gérée par le <a href="http://framework.zend.com/manual/2.2/en/modules/zend.module-manager.module-autoloader.html" target="_blank">**Module Manager**</a>. Cela est utile de le savoir dans le cas où un de vos modules redéfinit un service ou un tableau qui a déjà été défini par un autre module.

D'après la documentation, si deux modules portent le même nom (chacun dans un chemin différent), alors le premier que le **Module Manager** trouvera sera retenu.

Par défaut, vous pouvez mettre vos modules soit dans le répertoire `module/` du **ZendSkeletonApplication**, soit dans le répertoire `vendor/`.

En fait, le répertoire `vendor/` est un répertoire utilisé par **Composer** principalement. **Composer**, quand il gère les dépendances, organise les modules installés avec une arborescence qu'il gère lui même. Il crée ensuite des alias que l'application Zend utilise. Du coup, dans la clé '`modules`', il faut lister le namespace du module et non pas essayer de saisir le chemin du module. **Composer** fera le lien.

**Par ex**

Si vous installez le module **BjyProfiler** en utilisant **Composer**, vous allez avoir cette structure :

- Le fichier `Module.php` du module **BjyProfiler** va avoir ce chemin : `vendor/bjyoungblood/bjy-profiler/Module.php`
- Le fichier `Module.php` définit le namespace du module (**BjyProfiler**)
- Pour ajouter le module à votre application, il faut ajouter '**BjyProfiler**' (le namespace) à votre fichier `config/application.config.php`, dans la clé '`modules`'.

Toute l'astuce se situe au niveau de `vendor/composer/autoload_namespace.php` qui va faire le lien entre le namespace **BjyProfiler** et le chemin `bjyoungblood/bjy-profiler`. Il ne sert à rien d'éditer les fichiers de **Composer**. Il les réécrit quand on fait un `composer update` ou une nouvelle `composer install`.

Si vous souhaitez mettre des modules dans le répertoire `vendor/` sans passer par **Composer**, il faudra appliquer les mêmes règles que dans le répertoire `module/` :

`vendor/{NAMESPACE}`

#### module_path/monModule/config/module.config.php

Les fichiers de configuration des modules : chaque module attends obligatoirement un fichier de configuration.

Si votre module n'a pas besoin d'options de configuration pour fonctionner, vous êtes tenu de créer le fichier `module.config.php` qui doit retourner un tableau vide. En l'absence du fichier, l'application retourne une exception.

```php
// module_path/monModule/config/module.config.php

return array() ;
```

#### Les fichiers de configuration supplémentaires

D'après l'instruction suivante :

```php
//config/application.config.php

'module_listener_options' => array(
  'config_glob_paths' => array(
    'config/autoload/{,*.}{global,local}.php',
  ),
),
```

des fichiers de configuration supplémentaires peuvent être chargés automatiquement par l'application s'ils se situent à ce chemin : `config/autoload/` et si le nom du fichier satisfait la regex définie.

Ainsi, les fichiers suivants seront automatiquement chargés comme des fichiers de configuration :

- `config/autoload/global.php`
- `config/autoload/maconfig.global.php`
- `config/autoload/monautreconfig.global.php`
- `config/autoload/local.php`
- `config/autoload/maconfig.local.php`
- `config/autoload/monautreconfig.local.php`

Zend Framework 2 utilise les fonctionnalités de **git**. Il y a donc un fichier `config/autoload/.gitignore` qui est défini par défaut. Dans ce fichier, il est déclaré que **git** doit ignorer les fichiers `local.php` et `*.local.php`. Ainsi, les fichiers `local.php` pourront contenir spécifiquement les informations sensibles ainsi que les différences de paramétrage relatives à l'environnement (*development*, *test*, *prod*). Evan Coury a un excellent <a href="http://blog.evan.pro/environment-specific-configuration-in-zend-framework-2" target="_blank">article</a> à cet effet.

Une astuce est de créer systématiquement un fichier `local.php.dist` qui contiendra toutes les clés nécessaires au fonctionnement de votre application mais qui ne contiendra pas les valeurs de ces clés (qui sont, généralement, des informations sensibles).

Après avoir vu où se situaient les fichiers de configuration, comment on pouvait accéder à la configuration, comment on pouvait nommer les fichiers de configuration, nous voici arrivé au terme de cette première partie sur les fichiers de configuration d'une application montée avec Zend Framework 2.

Dans la seconde partie, nous verrons comment utiliser/écrire un fichier de configuration.