---
title: "Gérer les dépendances - Une liste déroulante personnalisée"
permalink: "fr/posts/gerer-les-dependances-une-liste-deroulante-personnalisee.html"
date: "2014-11-25T20:51"
slug: gerer-les-dependances-une-liste-deroulante-personnalisee
layout: post
drupal_uuid: 64d0f94e-404b-4821-aaac-1eb887741ceb
drupal_nid: 98
lang: fr
author: haclong

book:
  book: gerer-les-dependances-avec-zend-framework-2
  rank: 1,
  top: 
    url: /fr/books/gerer-les-dependances-avec-zend-framework-2.html
    title: Gérer les dépendances avec Zend Framework 2
  next: 
    url: /fr/posts/gerer-les-dependances-utiliser-linjection-dans-le-controleur.html
    title: Gérer les dépendances - Utiliser l'injection dans le controleur

media:
  path: /img/teaser/Capture_serveur_rack.PNG

tags:
  - "zend framework 2"
  - "Service Manager"
  - "dépendances"
  - "formulaire"

sites:
  - "Développement"

summary: "Pour me souvenir comment on gère les dépendances lorsqu'on crée des éléments personnalisés dans les formulaires."
---

Un cas très très très fréquent :

Vous avez un formulaire avec une liste déroulante. Les options de la liste déroulante sont des informations qui - très probablement - sont stockées dans votre base de données.

Comment faire ?

Ce tuto fonctionne au moins pour ZF2 2.1.5+

### L'élément Select

Créer l'élément `Select` comme un champ personnalisé.

Comme nous souhaitons gérer les dépendances et avoir très peu de contraintes entre nos entités et nos différentes niveaux de code, nous ne voulons pas que notre élément personnalisé ait des informations sur la base de données ou les tables ou n'importe quelles autres informations extérieures à l'élément lui même.... Nous allons donc injecter les données externes dans l'élément.

Rappelons nous : l'élément `Select` attends un tableau `array` :

```php
$select->setValueOptions(array(
  '0' => 'French',
  '1' => 'English',
  '2' => 'Japanese',
  '3' => 'Chinese',
));
```

Tout ce que nous aurons à faire et de fournir à notre élément personnalisé un tableau similaire : soit nous allons injecter un tableau déjà au format, avec des paires de clé/libellé, soit nous allons injecter un objet. Si cela doit être un objet, il faut garder à l'esprit qu'il faut pouvoir extraire le tableau au format à partir de l'objet.

Injecter un tableau au format :

```php
// module/MyModule/src/MyModule/Form/CustomSelect.php

<?php
namespace MyModule\Form ;

use Zend\Form\Element\Select ;

class CustomSelect extends Select
{
  public function __construct($arrayInjected)
  {
    $this->setName('mySelectField') ;
    $this->setLabel('Choose the value') ;
    $this->setValueOptions($arrayInjected) ;
  }
}
```

Injecter un objet : il faudra être capable d'itérer sur l'objet, ou, à minima, il faudra une méthode pour extraire le tableau à partir de l'objet.

```php
// module/MyModule/src/MyModule/Form/CustomSelect.php

<?php
namespace MyModule\Form ;

use Zend\Form\Element\Select ;

class CustomSelect extends Select
{
  public function __construct($objectInjected)
  {
    $valuesInArray = $this->makeArray($objectInjectect)
    $this->setName('mySelectField') ;
    $this->setLabel('Choose the value') ;
    $this->setValueOptions($valuesInjected) ;
  }

  protected function makeArray($iterativeObject)
  {
    $array = array() ;
    foreach($iterativeObject as $value)
    {
      $array[$value->getId()] = $value->getName() ;
    }
  
    return $array ;
  }
}
```

### Charger l'élément dans le gestionnaire de formulaire (Form Manager)

Editer le fichier `Module.php`. Nous allons charger l'élément dans le gestionnaire de formulaire

```php
// module/MyModule/Module.php

<?php
namespace MyModule ;

use MyModule\Form\CustomSelect ;

class Module
{
  public function getFormElementConfig()
  {
    return array(
      'factories' => array(
        'MyOwnElement' => function($sm) {
          $valuesToInject = $sm->getServiceLocator()->get('TableGateway') ;
          // injecting the values in the constructor of our custom element 
          $select = new CustomSelect($valuesToInject) ;
      
          return $select ;
        },
      ),
    ) ;
  }

  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        // do whatever it takes to access to your datas from your persistence layer
        'TableGateway' => function ($sm) {
          return new TableGateway(...) ;
        },
      ),
    );
  }
}
```

Noter que dans ce cas, nous avons injecter un objet **TableGateway**. Très probablement, on va pouvoir itérer sur cet objet et récupérer les valeurs clé et libellé pour notre tableau.

### Construire le formulaire

Construisons maintenant le formulaire

```php
// module/MyModule/src/MyModule/Form/MyForm.php

<?php
namespace MyModule\Form ;

use Zend\Form\Form ;

class MyForm extends Form
{
  public function init()
  {
    $this->add(array(
      'name' => 'mySelect',
      'type' => 'MyOwnElement',
    )) ;
  }

  public function __construct()
  {
    // construire les autres éléments du formulaire avec les briques standards de ZF2
  }
}
```

Quand vous créez des éléments personnalisés, vous devez les ajouter dans l'élément `Form` (ou n'importe quel élément `Fieldset`) en utilisant la méthode `init()`.

Notez que nous utilisons l'alias qui a été défini dans la classe `Module`.

### Declarer le formulaire dans la classe Module

```php
// module/MyModule/Module.php

<?php
namespace MyModule ;

...

class Module
{
  public function getServiceConfig()
  {
    return array(
      'invokables' => array(
        'MyForm' => 'MyModule\Form\MyForm',
      );
    ) ;
  }
}
```

Nous souhaitons juste être capable d'invoquer la classe MyForm. Nous n'avons pas besoin de lui injecter d'autres dépendances.

### Finaliser le tout dans le controleur

```php
// module/MyModule/src/MyModule/Controller/IndexController.php

<?php
namespace MyModule\Controller ;

use Zend\Mvc\Controller\AbstractActionController ;

class IndexController extends AbstractActionController
{
  public function indexAction()
  {
    $formManager = $this->serviceLocator->get('FormElementManager') ;
    $form = $formManager->get('MyForm') ;
    
    return array('form' = $form) ;
  }
}
```

### Maintenant, à la vue

Quant à la vue, il ne reste qu'à utiliser les **View Plugins** mis à disposition par ZF2 pour mettre en forme les éléments de formulaire. A ce niveau, il n'y a rien de changé sur la documentation de ZF2.
