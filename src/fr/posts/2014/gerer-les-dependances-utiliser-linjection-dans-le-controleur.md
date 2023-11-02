---
title: "Gérer les dépendances - Utiliser l'injection dans le controleur"
permalink: "fr/posts/gerer-les-dependances-utiliser-linjection-dans-le-controleur.html"
date: "2014-11-29T20:56"
slug: gerer-les-dependances-utiliser-linjection-dans-le-controleur
layout: post
drupal_uuid: 3ef0f1cb-1e14-4764-a28c-76872fa966d2
drupal_nid: 101
lang: fr
author: haclong

media:
  path: /img/teaser/Capture_serveur_rack.PNG

tags:
  - "zend framework 2"
  - "dépendances"
  - "HOWTO"

sites:
  - "Développement"

summary: "Une petite bafouille pour me rappeler comment on injecte les dépendances dans le constructeur du contrôleur"
---

Une petite bafouille pour me rappeler comment on injecte les dépendances dans le constructeur du contrôleur

Fonctionne sur ZF2 2.1.5+

Nous souhaitons avoir des dépendances obligatoires dans notre contrôleur... Pourquoi pas après tout ? Admettons que le contrôleur ne peut pas fonctionner si les dépendances manquent. Mais comment surcharger le constructeur alors que le contrôleur est instancié par l'application MVC ? On pourrait, bien sûr, hacker le code de l'application, mais ce n'est pas ce que nous voulons vraiment, n'est-ce pas ?

### Les dépendances sont obligatoires dans notre contrôleur

```php
// module/MyModule/src/MyModule/Controller/IndexController.php

<?php
namespace MyModule\Controller ;

use MyModule\Entity\DependencyAInterface ;
use MyModule\Form\DependencyBInterface ;
use Zend\Mvc\Controller\AbstractActionController ;

class IndexController extends AbstractActionController
{
  protected $dependencyA ;
  protected $dependencyB ;
 
  public function __construct(
    DependencyAInterface $depA,
    DependencyBInterface $debB
  )
  {
    $this->dependencyA = $depA ;
    $this->dependencyB = $depB ;
  }
 
  public function indexAction()
  {
    // just use $this->dependencyA and $this->dependencyB as normal
  }
}
```

Maintenant, nous avons besoin d'un Factory, pour pouvoir accéder au constructeur du contrôleur.

### Créer le controller factory

```php
// module/MyModule/src/MyModule/Factory/IndexControllerFactory.php

<?php
namespace MyModule\Factory ;

use MyModule\Controller\WriteController ;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface ;

class IndexControllerFactory implements FactoryInterface
{
  public function createService(ServiceLocatorInterface $serviceLocator)
  {
    // cette ligne est obligatoire, même si elle paraît redondante
    $realServiceLocator = $serviceLocator->getServiceLocator() ;
    $entityDepA = $realServiceLocator->get('DependencyEntity') ;
    $formDepB = $realServiceLocator->get('FormElementManager')->get('DependencyForm') ;
 
    return new IndexController( // voici notre contrôleur
      $entityDepA,
      $formDepB
    ) ;
  }
}
```

Et voilaaaa

Et nous avons injecté les dépendances dans le contrôleur sans coup férir.

### C'est pas fini, maintenant, au tour du Service Manager

```php
// module/MyModule/Module.php

<?php
// bref, on sait tous ce qu'il y a là
...
  public function getServiceConfig()
  {
    return array(
      'invokables' => array(
        'DependencyForm' => 'MyModule\Form\MyForm',
      ),
      'factories' => array(
        'DependencyEntity' => function($sm) {
          // n'importe quoi comprenant les injections de dépendances, bien sûr
          return $entity ;
        },
      ),
    ) ;
  }
...
```

Maintenant, comment dire à l'application qu'elle ne devrait plus utiliser le contrôleur tel quel mais qu'elle devrait utiliser le contrôleur qui a été instancié à partir de notre factory ?

Allez hop, voyons la configuration du module. On se souvient de la clé '*controllers*' qui se trouve là et qui nous sert à déclarer nos contrôleurs mmmh ??? oui oui oui, exactement, c'est de ça qu'il s'agit...

### La clé 'controllers'

On avait quelquechose comme ça dans cette clé :

```php
// module/MyModule/config/module.config.php

<?php
return array(
  'controllers' => array(
    'invokables' => array(
      'ModuleController\Index' => 'MyModule\Controller\IndexController',
    ),
  ),
);
```

Maintenant, on veut utiliser la factory à la place

```php
// module/MyModule/config/module.config.php
<?php
return array(
  'controllers' => array(
    'factories' => array(
      'ModuleController\Index' => 'MyModule\Factory\IndexControllerFactory',
    ),
  ),
);
```

Surtout, il faut bien veiller à réutiliser le même alias (`ModuleController\Index`). Comme ça, on n'aura pas à changer le routeur également...

Tadaaaa
