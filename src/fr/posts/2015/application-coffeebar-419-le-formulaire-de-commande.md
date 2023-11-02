---
title: "Application CoffeeBar 4/19 - Le formulaire de commande"
permalink: "fr/posts/application-coffeebar-419-le-formulaire-de-commande.html"
date: "2015-01-21T16:35"
slug: application-coffeebar-419-le-formulaire-de-commande
layout: post
drupal_uuid: 4e7b4e62-c8ec-460a-9f4f-1e672c7523eb
drupal_nid: 106
lang: fr
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "MVC"
  - "Zend Form"
  - "dépendances"
  - "Service Manager"

sites:
  - "Développement"

summary: "Dans cet article, nous allons construire un formulaire dont la particularité est de comporter une liste de sélection avec des données personnalisées. Profitons de cette application pour voir comment créer un élément Select de formulaire avec une dépendance."
---

Dans cet article, nous allons construire un formulaire dont la particularité est de comporter une liste de sélection avec des données personnalisées. Profitons de cette application pour voir comment créer un élément Select de formulaire avec une dépendance.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui auront disparu au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

Une *note* est constituée du *numéro de la table* (un texte libre), du *nom du serveur* (une valeur parmi la liste des serveurs du café) et, ça, c'est la valeur technique, l'*id unique* (guid) de la note.

## L'élément Select

### La liste des serveurs

La liste des serveurs du café est un objet `CoffeeBar\Entity\Waiters` qui contient un tableau (`array`) avec les noms et les identifiants de chaque serveur du café. On peut imaginer que cette objet `CoffeeBar\Entity\Waiters` est relié à une base de données et extrait les informations de la base de données. Dans notre cas, la liste va être créée en statique.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/Waiters.php

<?php
namespace CoffeeBar\Entity ;

use ArrayObject ;

// l'objet Waiters hérite de l'objet ArrayObject
class Waiters extends ArrayObject
{
  public function __construct(Array $array=null)
  {
    $array = array( ‘paul’ => 'Paul',
      ‘john’ => 'John',
      ‘melissa’ => 'Melissa',
      ‘julie’ => 'Julie',
      ‘michael’ => 'Michael'
    ) ;
    parent::__construct($array) ;
  }
}
```

Maintenant, on souhaite envoyer cette liste de serveur dans un élément `Select` sans avoir à ressaisir la liste de nos serveurs.

Dans la <a href="http://framework.zend.com/manual/current/en/modules/zend.form.elements.html#select" target="_blank">documentation de l'élément Select</a>, on remplit la liste des valeurs avec la méthode `Select::setValueOptions($array)`.

```php
$select = new Element\Select('mon_element_select') ;

$select->setValueOptions(array(
  '0' => 'element1',
  '1' => 'element2',
  '2' => 'element3',
  'clé' => 'valeur',
));
```

Ou en utilisant une notation en tableau :

```php
$form->add(array(
  'type' => 'Select',
  'options' => array(
    'value_options' => array(
      '0' => 'element1',
      '1' => 'element2',
      '2' => 'element3',
      'clé' => 'valeur',
    ),
  ),
)) ;</pre>
```

Notre besoin crucial est de remplacer notre tableau attendu pour `value_options` par la liste de nos serveurs. Le premier point est de vérifier que notre tableau de serveurs est au bon format `'clé' => 'valeur'`... Pas de tableau à plusieurs entrées, et `'valeur</code>'` doit être une chaîne de caractère et non pas un objet.

### L'élément Select personnalisé

Avec Zend Framework 2, on crée un élément `Select` *personnalisé*, `CoffeeBar\Form\WaiterSelect`, qui hérite de l'objet `Zend\Form\Element\Select` du framework. On va lui injecter notre objet `CoffeeBar\Entity\Waiters` et on va assigner les valeurs de l'objet `CoffeeBar\Entity\Waiters` aux valeurs de l'élément `CoffeeBar\Form\WaiterSelect`.

```php
// module/CoffeeBar/src/CoffeeBar/Form/WaiterSelect

<?php
namespace CoffeeBar\Form ;

use CoffeeBar\Entity\Waiters;
use Zend\Form\Element\Select;

class WaiterSelect extends Select
{
  protected $waiters ;
  
  // dans le constructeur, on injecte la liste des serveurs (objet Waiters)
  // ainsi, dans l'objet WaiterSelect, on peut l'utiliser comme on le souhaite
  public function __construct(Waiters $waiters)
  {
    $this->waiters = $waiters ;
  }
 
  // dans la méthode init(), on récupère la liste des serveurs (de l'objet Waiters)
  // on définit la liste des serveurs comme la liste des options de l'élément Select
  // $this->setValueOptions() est une méthode qui fait partie de l'objet Select
  // la méthode ArrayObject::getArrayCopy() prend l'objet ArrayObject tel quel et le retourne sous forme de tableau
  public function init()
  {
    $this->setValueOptions($this->waiters->getArrayCopy()) ;
  }
}
```

On charge les éléments dans le **gestionnaire de services** (Service Manager)

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

use CoffeeBar\Form\WaiterSelect;
use Zend\ModuleManager\Feature\FormElementProviderInterface;

// dès qu'il s'agit d'éléments de formulaire personnalisés
// il faut implémenter FormElementProviderInterface
class Module implements FormElementProviderInterface
{
  public function getConfig() {...}

  public function getAutoloaderConfig() {...}
 
  // l'interface FormElementProviderInterface
  // a la méthode getFormElementConfig
  public function getFormElementConfig() {
    return array(
      'factories' => array(
        // déclarer l'élément de formulaire dans le manager de formulaire
        // dans mon exemple, la clé est 'WaiterSelect'
        // mais n'importe quelle clé est possible
        'WaiterSelect' => function($sm) {
          $serviceLocator = $sm->getServiceLocator() ;
          $waiters = $serviceLocator->get('CoffeeBarEntities\Waiters') ;
          // ici par contre, c'est l'objet CoffeeBar\Form\WaiterSelect
          // notez l’injection de l'objet Waiters dans le constructeur
          $select = new WaiterSelect($waiters) ; //CoffeeBar\Form\WaiterSelect
          return $select ;
        },
      ),
    );
  }

  // on charge le Service Manager
  public function getServiceConfig()
  {
    return array(
      'invokables' => array(
        // clé dans le Service Manager => objet
        'CoffeeBarEntities\Waiters' => 'CoffeeBar\Entity\Waiters',
      ),
    ) ;
  }
}
```

On va maintenant créer notre formulaire, qui va contenir un élément caché, pour l'id unique, un élément texte pour le numéro de la table et notre élément select personnalisé, pour la liste des serveurs.

## Le formulaire

```php
// module/CoffeeBar/src/CoffeeBar/Form/OpenTabForm.php

<?php
namespace CoffeeBar\Form ;

use Zend\Form\Element\Csrf;
use Zend\Form\Form;

class OpenTabForm extends Form
{
  // la fonction init va charger l'élément de formulaire customisé
  // les autres éléments de formulaire "standards" peuvent être créé dans le constructeur
  public function init()
  {
    $this->add(array(
      'name' => 'waiter',
      // utiliser la clé définie dans getFormElementConfig dans la classe Module
      'type' => 'WaiterSelect',
      'options' => array(
        'label' => 'Serveur',
      ),
      'attributes' => array(
        // c'est l'une des classes CSS de Bootstrap Twitter
        'class' => 'form-control',
      ),
    )) ;
  }

  public function __construct()
  {
    parent::__construct('opentab') ;
 
    $this->setAttribute('method', 'post') ;
 
    // le champ id est un id unique (guid) caché
    // il sera généré automatiquement dans la vue
    $this->add(array(
      'name' => 'id',
      'type' => 'hidden',
    )) ;
    $this->add(array(
      'name' => 'tableNumber',
      'options' => array(
        'label' => 'Numéro de la table',
      ),
      'attributes' => array(
        'required' => 'required',
        'class' => 'form-control',
      ),
    )) ;
 
    $this->add(new Csrf('security')) ;
 
    $this->add(array(
      'name' => 'submit',
      'type' => 'Submit',
      'attributes' => array(
        'value' => 'Open',
        'class' => 'btn btn-default',
      ),
    )) ;
  }
}
```

Retournons dans le **gestionnaire de services** pour ajouter le formulaire

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

class Module implements FormElementProviderInterface
{
  public function getConfig() {...}

  public function getAutoloaderConfig() {...}
 
  public function getFormElementConfig() {...}

  // on charge le service manager
  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'OpenTabForm' => function($sm) {
          // parce que le formulaire OpenTabForm utilise un élément de formulaire personnalisé
          // il faut utiliser $this->serviceLocator->get('FormElementManager') ;
          // et utiliser le formulaire à partir du Form Element Manager
          $formManager = $sm->get('FormElementManager') ;
          $form = $formManager->get('CoffeeBar\Form\OpenTabForm') ;
          return $form ;
        },
      ),
    ) ;
  }
}
```

## Le rendu dans le navigateur

### Le contrôleur

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;
 
use Zend\Mvc\Controller\AbstractActionController;

class TabController extends AbstractActionController
{
  public function openAction()
  {
    // récupérer le formulaire dans le ServiceManager
    $form = $this->serviceLocator->get('OpenTabForm') ;

    $request = $this->getRequest() ;

    // si le formulaire a été posté
    if($request->isPost()) {
      // assigné les données du tableau $_POST aux éléments du formulaire
      $form->setData($request->getPost()) ;
 
      if($form->isValid()) {
        // traiter les données du formulaire
      }
    }

    $result['form'] = $form ;
    return array('result' => $result) ;
  }
}
```

### La vue

Utilisons, pour le rendu du formulaire, les **aides de vues** mise à disposition par Zend Framework 2.

```php
// module/CoffeeBar/view/coffee-bar/tab/open.phtml

<h1>Ouvrir une nouvelle note</h1>

<?php
  $form = $this->result['form'] ;
  $form->prepare() ;

  // l’action va nous renvoyer sur la route ‘tab/open’
  // soit TabController / OpenAction tel que défini dans la route dans module.config.php
  $form->setAttribute('action', $this->url('tab/open')) ;
  $form->setAttribute('method', 'post') ;

  // on génère l'id unique dans la vue
  $id = $form->get('id') ;
  $id->setValue(uniqid()) ;
?>

<?php echo $this->form()->openTag($form) ; ?>

<div class='form-group'>
  <?php echo $this->formRow($form->get('tableNumber')) ; ?>
</div>

<div class='form-group'>
  <?php echo $this->formRow($form->get('waiter')) ; ?>
</div>

<?php
  echo $this->formRow($form->get('security')) ;
  echo $this->formHidden($id) ;
  echo $this->formRow($form->get('submit')) ;

  echo $this->form()->closeTag() ;
?>
```

Notre formulaire est fini.

Ainsi, pour personnaliser un élément select, il faut

- un **objet métier** avec la liste des valeurs
- s'assurer que cet objet retourne un **tableau à une dimension** : `'clé' => 'valeur'` (soit par défaut, soit avec une méthode dédiée)
- créer un élément `select` personnalisé, qui **hérite de `Zend\Form\Element\Select`**
- implémenter l'**interface `FormElementProviderInterface`** dans la classe `Module`
- **injecter les dépendances** dans la configuration des éléments de formulaire `Module::getFormElementConfig()`
- utiliser le **gestionnaire de formulaire 'FormElementManager'** qui va se trouver dans le gestionnaire de service.

Dans le chapitre suivant, on va voir comment on récupère les données du formulaire (hydratées dans un objet) et comment on les exploite dans notre application.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
