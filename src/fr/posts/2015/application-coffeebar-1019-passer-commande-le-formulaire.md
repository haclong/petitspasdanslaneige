---
title: "Application CoffeeBar 10/19 - Passer commande, le formulaire"
permalink: "fr/posts/application-coffeebar-1019-passer-commande-le-formulaire.html"
date: "2015-03-12T14:35"
slug: application-coffeebar-1019-passer-commande-le-formulaire
layout: post
drupal_uuid: 67831584-8641-4a3d-b940-4dd0f1ae4e4d
drupal_nid: 112
lang: fr
author: haclong

book:
  book: gerer-un-cafe-avec-une-programmation-evenementielle
  rank: 10,
  top: 
    url: /fr/books/gerer-un-cafe-avec-une-programmation-evenementielle.html
    title: Gérer un café avec une programmation événementielle
  next: 
    url: /fr/posts/application-coffeebar-1119-traiter-le-formulaire.html
    title: Application CoffeeBar 11/19 - Traiter le formulaire
  previous:
    url: /fr/posts/application-coffeebar-919-commander-les-plats-et-les-boissons.html
    title: Application CoffeeBar 9/19 - Commander les plats et les boissons

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "aide de vue"
  - "MVC"
  - "javascript"
  - "Zend Form"
  - "Zend Form Collection"

sites:
  - "Développement"

summary: "Pour passer commande, nous allons mettre en place un formulaire avec un ensemble de champs : liste déroulante et champ de saisie libre pour chaque élément de menu. On pourra ajouter autant d'éléments de menu que l'on voudra dans notre formulaire. Un peu de dépendances et de javascript dans le tutoriel d'aujourd'hui."
---

Ici encore, nous allons mettre un formulaire en place. Plus complexe que le précédent : il va inclure un élément de sélection et un élément de texte, ces deux éléments pouvant s'ajouter autant de fois qu'on le voudra dans le formulaire.
Pour passer commande, nous allons mettre en place un formulaire avec un ensemble de champs : liste déroulante et champ de saisie libre pour chaque élément de menu. On pourra ajouter autant d'éléments de menu que l'on voudra dans notre formulaire. Un peu de dépendances et de javascript dans le tutoriel d'aujourd'hui.

### Ce que nous allons faire

Pour passer commande, nous arriverons sur un formulaire où il y aura un élément de sélection, présentant chaque élément du menu et sur la même ligne, un élément de saisie où on pourra saisir le nombre de boissons et/ou de plats commandés. Il sera alors possible, si on veut commander une autre boisson ou un autre plat, de rajouter une ligne de plus : il y aura alors un nouvel élément de sélection et l'élément de saisie qui lui est associé.

### L'élément de menu

L'élément de menu est composé d'un *numéro de menu*, d'une *description*, d'un *prix* et d'un *flag* si l'élément est une boisson ou pas.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/MenuItem.php

<?php
namespace CoffeeBar\Entity ;

class MenuItem
{
  protected $id ; // int
  protected $description ; // string
  protected $price ; // float
  protected $isDrink ; // bool

  // nous définissons des valeurs par défaut pour le prix et le statut boisson
  public function __construct($id, $description, $price = 0.00, $isDrink = false)
  {
    $this->setId($id) ;
    $this->setDescription($description) ;
    $this->setPrice($price) ;
    $this->setIsDrink($isDrink) ;
  }
 
  /* définir les getter et setter */
}
```

Un menu complet est donc composé de plusieurs éléments de menu. *Qui m'entend déjà parler d'ArrayObject ?*

Là encore, ce sont des objets avec des données en dur mais il est très facile, à partir d'ici, de relier ces objets à une base de données.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/MenuItems.php

<?php
namespace CoffeeBar\Entity ;

use ArrayObject;

class MenuItems extends ArrayObject
{
  public function __construct(Array $array=null)
  {
    $array = array() ;
    $i = 0 ;
    $array[] = new MenuItem($i++, 'Thé vert', 3.75, true) ;
    $array[] = new MenuItem($i++, 'Café', 2.55, true) ;
    $array[] = new MenuItem($i++, 'Limonade', 4.05, true) ;
    $array[] = new MenuItem($i++, 'Soda', 4.20, true) ;
    $array[] = new MenuItem($i++, 'Bière', 4.75, true) ;
    $array[] = new MenuItem($i++, 'Frites', 5.25) ;
    $array[] = new MenuItem($i++, 'Pizza', 9.80) ;
    $array[] = new MenuItem($i++, 'Saucisses Frites', 7.75) ;
    $array[] = new MenuItem($i++, 'Hot Dog', 7.00) ;
    $array[] = new MenuItem($i++, 'Quiche', 6.65) ;
    parent::__construct($array) ;
  }
}
```

On a donc une liste (`\ArrayObject`). Mais rappelons nous. Dans un élément de sélection, l'option `value_options` attend un tableau (`array`) à une dimension : `id => valeur`. Il faut donc mettre en place une méthode qui va extraire les données de `CoffeeBar\Entity\MenuItems` et qui va retourner juste le tableau qu'il nous faut. L'`id`, de toute évidence, sera le *numéro de menu* alors que la `valeur` sera la *description*.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/MenuItems.php

<?php
namespace CoffeeBar\Entity ;

class MenuItems ...
{
  // une méthode pour faire un tableau de paire id/value pour chaque objet MenuItem
  public function getSelectValues()
  {
    $array = array() ;
 
    // on accède à l'itérateur des objets ArrayObject avec la méthode getIterator()
    $iterator = $this->getIterator() ;
    foreach($iterator as $item)
    {
      $array[$item->getId()] = $item->getDescription() ;
    }
    return $array ;
  }
}
```

### Passons aux éléments de formulaire.

On va commencer par l'élément de sélection.

```php
// module/CoffeeBar/src/CoffeeBar/Form/MenuSelect.php

<?php
namespace CoffeeBar\Form ;

use CoffeeBar\Entity\MenuItems;
use Zend\Form\Element\Select;

class MenuSelect extends Select
{
  protected $menus ;
 
  // injecter l'objet MenuItems dans le constructeur
  public function __construct(MenuItems $items)
  {
    $this->menus = $items ;
  }

  // assigner le tableau avec les paires id/value
  // il faut le faire dans la méthode init() prévue à cet effet
  public function init()
  {
    $this->setValueOptions($this->menus->getSelectValues()) ;
  }
}
```

Nous allons maintenant construire une classe `Fieldset` personnalisée qui contiendra, de paire, l'élément de sélection et l'élément de saisie de texte.

```php
// module/CoffeeBar/src/CoffeeBar/Form/MenuItemFieldset.php

<?php
namespace CoffeeBar\Form ;

use Zend\Form\Fieldset;

class MenuItemFieldset extends Fieldset
{
  // lorsqu'il y a des éléments personnalisés de formulaire
  // la méthode init() est chargée en premier
  public function init()
  {
    $this->add(array(
      'name' => 'id',
      'type' => 'MenuSelect', // utiliser la clé qui est dans le manager de formulaire
      'attributes' => array(
        'class' => 'form-control',
      ),
    )) ;
  }

  public function __construct()
  {
    parent::__construct('menuItems') ;
 
    $this->add(array(
      'name' => 'number',
      'options' => array(
        'label' => ' ',
      ),
      'attributes' => array(
        'value' => 1,
        'class' => 'form-control text-right',
        'size' => 4,
      ),
    )) ;
  }
}
```

Afin d'assurer le rendu de ce fieldset (il n'existe aucune aide de vue fournie par Zend Framework 2 qui convienne à notre fieldset personnalisé), nous allons créer notre propre aide de vue.

Je ne sais plus où j'ai trouvé la doc pour écrire mon aide de vue... Inspirez vous de celle ci :p

```php
// module/CoffeeBar/src/CoffeeBar/Form/Helper/MenuItemFormCollection.php

<?php
namespace CoffeeBar\Form\Helper ;

use Zend\Form\View\Helper\FormCollection ;
use Zend\Form\Element\Collection ;

class MenuItemFormCollection extends FormCollection
{
  public function renderTemplate(Collection $collection)
  {
    $elementHelper = $this->getElementHelper();
    $escapeHtmlAttribHelper = $this->getEscapeHtmlAttrHelper();
    $fieldsetHelper = $this->getFieldsetHelper();
    $element = $collection->getTemplateElement();
 
    if ($element instanceof FieldsetInterface) {
      $templateMarkup .= $fieldsetHelper($element);
    }

    $formRow = $this->view->plugin('FormRow') ;

    $templateMarkup = '';
    $templateMarkup .= '<fieldset class="form-inline">' ;
    $templateMarkup .= $formRow($element->get('id')) . '&amp;nbsp;&amp;nbsp;';
    $templateMarkup .= $formRow($element->get('number')) ;
    $templateMarkup .= '</fieldset>' ;

    return sprintf(
      $this->templateWrapper,
      $escapeHtmlAttribHelper($templateMarkup)
    );
  }
}
```

Après avoir créé votre aide de vue, il faut aller l'<a href="http://framework.zend.com/manual/current/en/modules/zend.view.helpers.advanced-usage.html#registering-helpers" target="_blank">enregistrer dans l'application</a> afin qu'on puisse y faire appel.

```php
// module/CoffeeBar/config/module.config.php

<?
return array(
  'view_helpers' => array(
    'invokables' => array(
      // comme d’habitude : la clé => l’objet
      'MenuItemFormCollection' => 'CoffeeBar\Form\Helper\MenuItemFormCollection',
    ),
  ),
);
```

Maintenant que l'aide de vue est prête, montons le formulaire. Un élément `fieldset` qu'on peut répéter à l'envi, Zend Framework 2 l'appelle <a href="http://http://framework.zend.com/manual/current/en/modules/zend.form.collections.html" target="_blank">**Form Collection**</a> et le documente pas trop mal. Dans le formulaire, on va créer un élément de type `Zend\Form\Element\Collection`. Cet élément admet quelques options en plus pour gérer la répétition des informations.

```php
// module/CoffeeBar/src/CoffeeBar/Form/PlaceOrderForm

<?php
namespace CoffeeBar\Form ;

use Zend\Form\Element\Csrf;
use Zend\Form\Form;

class PlaceOrderForm extends Form
{
  public function init()
  {
    $this->add(array(
      // c'est un élément du framework. Il permet de faire des champs qui peuvent s'incrémenter dynamiquement
      'type' => 'Zend\Form\Element\Collection',
      'name' => 'items',
      'options' => array(
        'label' => 'Commandez vos plats',
        // nombre d'éléments par défaut à l'ouverture du formulaire
        'count' => 2,
        // les deux options suivantes permettent d'ajouter autant de champs qu'on souhaite
        'should_create_template' => true,
        'allow_add' => true,
        // cette option indique quel est l'élément à utiliser
        'target_element' => array(
          // chemin du vrai objet, pas un alias dans le Service Manager
          'type' => 'CoffeeBar\Form\MenuItemFieldset',
        ),
      ),
      'attributes' => array(
        'class' => 'form-control',
      ),
    ));
  }

  public function __construct()
  {
    parent::__construct('order') ;
 
    $this->setAttribute('method', 'post') ;
    // il faudra ajouter l'hydrator et l'objet ici éventuellement
 
    // numéro de la table
    $this->add(array(
      'name' => 'id',
      'type' => 'hidden',
    )) ;
 
    $this->add(new Csrf('security')) ;
 
    $this->add(array(
      'name' => 'submit',
      'type' => 'Submit',
      'attributes' => array(
        'value' => 'Place order',
        'class' => 'btn btn-default',
      ),
    )) ;
  }
}
```

Notre formulaire est prêt. On va le charger dans le **gestionnaire de services**, l'invoquer dans le contrôleur et afficher le formulaire dans la vue, en profitant de notre **aide de vue** au passage.

#### Gestionnaire de services

```php
// module/CoffeeBar/Module.php

namespace CoffeeBar;

use CoffeeBar\Form\MenuSelect;

class Module implements FormElementProviderInterface
{
  // l'interface FormElementProvideInterface a la méthode getFormElementConfig()
  public function getFormElementConfig() {
    return array(
      'factories' => array(
        // déclarer l'élément de formulaire dans le Manager de formulaire
        'MenuSelect' => function($sm) {
          $serviceLocator = $sm->getServiceLocator() ;
          // CoffeeBarEntity\MenuItems : clé dans le Service Manager
          $menus = $serviceLocator->get('CoffeeBarEntity\MenuItems') ;
          // MenuSelect : objet CoffeeBar\Form\MenuSelect
          $select = new MenuSelect($menus) ;
          return $select ;
        },
      ),
    );
  }

  // on charge le service manager
  public function getServiceConfig()
  {
    return array(
      'invokables' => array(
        'CoffeeBarEntity\MenuItems' => 'CoffeeBar\Entity\MenuItems',
      ),
      'factories' => array(
        'PlaceOrderForm' => function($sm) {
          $formManager = $sm->get('FormElementManager') ;
          $form = $formManager->get('CoffeeBar\Form\PlaceOrderForm') ;
          return $form ;
        },
      ),
    ) ;
  }
}
```

#### Le contrôleur

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

use Zend\Mvc\Controller\AbstractActionController;

class TabController extends AbstractActionController
{
  public function orderAction()
  {
    // utiliser la clé déclarée dans le Service Manager (classe Module)
    $form = $this->serviceLocator->get('PlaceOrderForm') ;
    $request = $this->getRequest() ;

    // vérifier si on connait le numéro de la table pour laquelle on passe commande
    if ($id = (int) $this->params()->fromRoute('id')) 
    {
      $form->get('id')->setValue($id) ;
    // sinon, vérifier si le formulaire a été posté
    } elseif($request->isPost()) {
      $form->setData($request->getPost()) ;
      if($form->isValid()) {
        // traitement de la commande
      }
    // si on ne sait pas pour quelle table on va passer commande, retourner à la page 'Ouvrir une commande'
    } else {
      return $this->redirect()->toRoute('tab/open');
    }
 
    $result['form'] = $form ;
    return array('result' => $result) ;
  }
}
```

#### Et enfin la vue définitive.

N'oubliez pas le code javascript qui va nous permettre d'ajouter autant d'éléments qu'on veut.

```php
// module/CoffeeBar/view/coffee-bar/tab/order.phtml

<script>
  function add_item() {
    var currentCount = $('form fieldset fieldset').length;
    var template = $('form fieldset > span').data('template');
    template = template.replace(/__index__/g, currentCount);
    $('form fieldset').last().append(template);

    return false;
  }
</script>

<h1>Passer commande</h1>

<?php
  $form = $this->result['form'] ;
  $form->prepare() ;

  $form->setAttribute('action', $this->url('tab/order')) ;
  $form->setAttribute('method', 'post') ;
?>

<?php echo $this->form()->openTag($form) ; ?>

<div class='form-group'>
  <?php echo $this->formRow($form->get('id')) ; ?>
</div>

<div class='form-group'>
  <fieldset>
    <legend><?php $this->formLabel($form->get('items')) ; ?></legend>

    <?php
      foreach($form->get('items')->getIterator() as $fieldset)
      {
        echo '<fieldset class="form-inline">' ;
        echo $this->formRow($fieldset->get('id')). '&amp;nbsp;&amp;nbsp;' ;
        echo $this->formRow($fieldset->get('number')) ;
        echo '</fieldset>' ;
      }
      // Et voici notre aide de vue
      echo $this->MenuItemFormCollection()->renderTemplate($form->get('items'));
    ?>
  
  </fieldset>
  <button onclick="return add_item()">Add a new item</button>
</div>

<?php
  echo $this->formRow($form->get('security')) ;
  echo $this->formRow($form->get('submit')) ;
  echo $this->form()->closeTag() ;
?>
```

#### La route

Avant de passer à la suite, on n'oublie pas de paramétrer la route qui va bien

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'router' => array(
    'routes' => array(
      // ajouter aux autres routes
      'tab' => array(
        'child_routes' => array(
 
          /**
           * cette URL : http://coffeebar.home/tab/order mène à cette route
           */
          'order' => array(
            'type' => 'Segment',
            'options' => array(
              'route' => '/order[/:id]',
              'constraints' => array(
                'id' => '[a-zA-Z0-9_-]+',
              ),
              'defaults' => array(
                'controller' => 'CoffeeBarController\Tab',
                'action' => 'order',
              ),
            ),
          ),
        ),
      ),
    ),
  ),
) ;
```

Tadaaa... C'est pas génial ? Notre formulaire fonctionne. Fonctionne ?? Pas tout à fait, il reste maintenant à gérer le traitement des informations.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
