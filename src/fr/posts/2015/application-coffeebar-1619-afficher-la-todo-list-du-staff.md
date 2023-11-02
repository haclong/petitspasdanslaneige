---
title: "Application CoffeeBar 16/19 - Afficher la todo list du staff"
permalink: "fr/posts/application-coffeebar-1619-afficher-la-todo-list-du-staff.html"
date: "2015-04-28T14:29"
slug: application-coffeebar-1619-afficher-la-todo-list-du-staff
layout: post
drupal_uuid: c144d6d4-049c-47e4-bd2e-96fb433074f5
drupal_nid: 120
lang: fr
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "programmation événementielle"
  - "OOP"

sites:
  - "Développement"

summary: "Les boissons sont commandées, les plats sont préparés, il reste à les servir. C'est la tâche des serveurs. Cette fois-ci, l'équipe est composée de plusieurs serveurs. Il faut donc préparer une liste par serveur, toutes leurs tables confondues."
---

Les boissons sont commandées, les plats sont préparés, il reste à les servir. C'est la tâche des serveurs. Cette fois-ci, l'équipe est composée de plusieurs serveurs. Il faut donc préparer une liste par serveur, toutes leurs tables confondues.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui n'apparaitront plus systématiquement au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

## Les listes par serveur

### Voyons le (nouveau) contrôleur

```php
// module/CoffeeBar/src/CoffeeBar/Controller/StaffController.php

<?php
namespace CoffeeBar\Controller ;

use Zend\Mvc\Controller\AbstractActionController;

class StaffController extends AbstractActionController
{
  // afficher la liste des serveurs
  public function indexAction()
  {
    $waiters = $this->serviceLocator->get('CoffeeBarEntity\Waiters') ;
    return array('result' => $waiters) ;
  }

  // afficher la liste des tâches (plats à servir) par serveurs
  public function toDoAction()
  {
    $waiter = $this->params()->fromRoute('name');
    $openTabs = $this->serviceLocator->get('OpenTabs') ;
    $list = $openTabs->todoListForWaiter($waiter) ;
    return array('result' => $list, 'waiter' => $waiter) ;
  }
}
```

### Les deux vues associées

```php
// module/CoffeeBar/view/coffee-bar/staff/index.phtml

<h1>Staff</h1>

<ul>
  <?php
    foreach($result as $k => $v)
    {
      echo '<li><a href="' . $this->url("staff/todo", array("name" => $k)) . '">' . $v . '</a>' ;
    }
  ?>
</ul>
```

```php
// module/CoffeeBar/view/coffee-bar/staff/todo.phtml

<h2>Todo List for <?php echo $waiter; ?></h2>

  <?php
    foreach($result as $key => $table)
    {
  ?>

      <h3>Table #<?php echo $key; ?></h3>
      
      <form action="<?php echo $this->url('staff/markserved') ; ?>" method="post">
        <input type="hidden" name="id" value="<?php echo $key; ?>"/>
        <input type="hidden" name="waiter" value="<?php echo $waiter; ?>"/>
        <table>
          <tr>
            <th>Menu #</th>
            <th>Description</th>
            <th>Served</th>
          </tr>
 
          <?php
            foreach($table as $liste)
            {
          ?>
              <tr>
                <td><?php echo $liste->getMenuNumber() ;?></td>
                <td><?php echo $liste->getDescription() ; ?></td>
                <td>
                  <input type='checkbox' name='served[]' value='served_<?php echo $liste->getMenuNumber() ; ?>'/>
                </td>
              </tr>
          <?php
            }
          ?>
        </table>

        <a href='<?php echo $this->url('tab/status', array('id' => $key)) ; ?>'>Voir la commande</a>
        <input type='submit' name='submit' value='Mark Served'/>
      </form>
  <?php
    }
```

On a, bien évidemment, ajouté les cases à cocher pour marquer les plats servis, et ajouté une route pour le traitement du formulaire.

### La configuration

Cela inclus la route, la navigation et l'alias du contrôleur.

```php
// module/CoffeeBar/config/module.config.php
<?php
return array(
  'router' => array(
    'routes' => array(
 
      /**
       * cette URL : http://coffeebar.home/staff mène à cette route
       */
      'staff' => array(
        'type' => 'Literal',
        'options' => array(
          'route' => '/staff',
          'defaults' => array(
            'controller' => 'CoffeeBarController\Staff',
            'action' => 'index',
          ),
        ),
        'may_terminate' => true,
        'child_routes' => array(
 
          /**
           * cette URL : http://coffeebar.home/staff/{$waiter} mène à cette route
           */
          'todo' => array(
            'type' => 'Segment',
            'options' => array(
              'route' => '/[:name]',
              'constraints' => array(
                'name' => '[a-zA-Z]+',
              ),
              'defaults' => array(
                'controller' => 'CoffeeBarController\Staff',
                'action' => 'toDo',
              ),
            ),
            'may_terminate' => true,
          ),
          'markserved' => array(
            'type' => 'Literal',
            'options' => array(
              'route' => '/mark',
              'defaults' => array(
                'controller' => 'CoffeeBarController\Staff',
                'action' => 'mark',
              ),
            ),
          ),
        ),
      ),
    ),
  ),
  'controllers' => array(
    'invokables' => array(
      'CoffeeBarController\Staff' => 'CoffeeBar\Controller\StaffController',
    ),
  ),
  'navigation' => array(
    'default' => array(
      array(
        'label' => 'Staff',
        'route' => 'staff',
      ),
    ),
  ),
);
```

Arrêtons nous cependant un moment.

Dans notre contrôleur, il y a une méthode qui est appelée : `OpenTabs::todoListForWaiter($waiter)`. Voyons rapidement à quoi elle ressemble

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
class OpenTabs
{
  /**
   * Retourne la liste des éléments à servir
   * @param string $waiter
   * @return ArrayObject
   */
  public function todoListForWaiter($waiter)
  {
    $this->loadTodoByTab() ;
    $array = array() ;
    foreach($this->todoByTab->getArrayCopy() as $k => $v)
    {
      if($v->getWaiter() == $waiter &amp;&amp; count($v->getItemsToServe()) > 0)
      {
        $array[$v->getTableNumber()] = $v->getItemsToServe() ;
      }
    }
    return $array ;
  }
}
```

Ainsi, encore une fois, on a systématiquement des méthodes dans notre service **OpenTabs** pour extraire exactement l'information dont on a besoin. C'est l'un des principes fondamentaux du langage objet et cela empêche d'extraire des entités volumineuses et informes qu'il faut s'employer à assainir et formaliser dans notre programme.

## Traitement du formulaire, l'action markAction

Retournons dans le contrôleur pour l'action `StaffController::markAction()`.

```php
// module/CoffeeBar/src/CoffeeBar/Controller/StaffController.php

<?php
namespace CoffeeBar\Controller ;

use Zend\Mvc\Controller\AbstractActionController;

class StaffController extends AbstractActionController
{
  public function markAction()
  {
    $request = $this->getRequest() ; 
    if($request->isPost()) 
    {
      $id = $request->getPost()->get('id') ;
      $waiter = $request->getPost()->get('waiter') ;
 
      if(!is_array($request->getPost()->get('served'))) 
      {
        $this->flashMessenger()->addErrorMessage('Aucun plat ou boisson n\'a été choisi pour servir');
        return $this->redirect()->toRoute('staff/todo', array('name' => $waiter));
      }
 
      $menuNumbers = array() ;
      foreach($request->getPost()->get('served') as $item)
      {
        $groups = explode('_', $item) ;
        $menuNumbers[] = $groups[1] ;
      }
      $this->markDrinksServed($id, $menuNumbers) ;
      $this->markFoodServed($id, $menuNumbers) ;

      return $this->redirect()->toRoute('staff/todo', array('name' => $waiter));
    }
  }

  // $menuNumbers = array - numéro de menus
  // $id = numéro de la table
  protected function markDrinksServed($id, array $menuNumbers)
  {
    // pour retrouver l'id unique de la note
    $openTabs = $this->serviceLocator->get('OpenTabs') ;
    $tabId = $openTabs->tabIdForTable($id) ;

    // pour récupérer les informations de l'élément du menu en fonction de son numéro
    $menu = $this->serviceLocator->get('CoffeeBarEntity\MenuItems') ;
 
    $drinks = array() ;
    foreach($menuNumbers as $nb)
    {
      if($menu->getById($nb)->getIsDrink())
      {
        $drinks[] = $nb ;
      }
    }
 
    if(!empty($drinks))
    {
      // récupérer l'objet 'CoffeeBar\Command\MarkDrinksServed'
      $markServed = $this->serviceLocator->get('MarkDrinksServedCommand') ;
      $markServed->markServed($tabId, $drinks) ;
    }
  }
 
  protected function markFoodServed($id, array $menuNumbers)
  {
    $openTabs = $this->serviceLocator->get('OpenTabs') ;
    $tabId = $openTabs->tabIdForTable($id) ;

    $menu = $this->serviceLocator->get('CoffeeBarEntity\MenuItems') ;
 
    $food = array() ;
    foreach($menuNumbers as $nb)
    {
      if(!$menu->getById($nb)->getIsDrink())
      {
        $food[] = $nb ;
      }
    }

    if(!empty($food))
    {
      $markServed = $this->serviceLocator->get('MarkFoodServedCommand') ;
      $markServed->markServed($tabId, $food) ;
    }
  }
}
```

Les deux opérations `CoffeeBar\Command\MarkDrinksServed` et `CoffeeBar\Command\MarkFoodServed` déclenchent chacune un événement. Il ne faut pas oublier d'injecter le **gestionnaire d'événements**.

Voyons rapidement chacun des objets :

```php
// module/CoffeeBar/src/CoffeeBar/Command/MarkDrinksServed.php

<?php
namespace CoffeeBar\Command ;

use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

class MarkDrinksServed implements EventManagerAwareInterface
{
  protected $id ; // int (guid) - id unique de la note
  protected $drinks ; // array - numéro de menus
  protected $events ; // EventManager

  // getters &amp; setters y compris setEventsManager &amp; getEventsManager

  public function markServed($id, $menuNumbers)
  {
    $this->setId($id) ;
    $this->setDrinks($menuNumbers) ;
    $this->events->trigger('markDrinksServed', '', array('markDrinksServed' => $this)) ;
  }
}
```

et la seconde opération

```php
// module/CoffeeBar/src/CoffeeBar/Command/MarkFoodServed.php

<?php
namespace CoffeeBar\Command ;

use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

class MarkFoodServed implements EventManagerAwareInterface
{
  protected $id ; // int (guid) - id unique de la note
  protected $food ; // array - liste des numéros de menus
  protected $events ; // EventManager

  public function markServed($id, $menuNumbers)
  {
    $this->setId($id) ;
    $this->setFood($menuNumbers) ;
    $this->events->trigger('markFoodServed', '', array('markFoodServed' => $this)) ;
  }
}
```

Rapidement, la méthode qui passe presque inaperçue dans notre action `StaffController::markAction()` : `MenuItems::getById($id)`

```php
// module/CoffeeBar/src/CoffeeBar/Entity/MenuItems.php

class MenuItems
{
  public function getById($id)
  {
    $iterator = $this->getIterator() ;
    foreach($iterator as $item)
    {
      if($id == $item->getId())
      {
        return $item ;
      }
    }
  }
}
```

### Gestionnaire de services

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

use CoffeeBar\Command\MarkDrinksServed;
use CoffeeBar\Command\MarkFoodServed;

class Module
{
  // on charge le service manager
  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'MarkDrinksServedCommand' => function($sm) {
          $events = $sm->get('TabEventManager') ;
          $markDrinksServed = new MarkDrinksServed() ;
          $markDrinksServed->setEventManager($events) ;
          return $markDrinksServed ;
        },
       'MarkFoodServedCommand' => function($sm) {
          $events = $sm->get('TabEventManager') ;
          $markFoodServed = new MarkFoodServed() ; 
          $markFoodServed->setEventManager($events) ;
          return $markFoodServed ;
        },
      ),
    ) ;
  }
}
```

La vue et la structure sont faites. Traitons les données dans le prochain article, mais je pense que vous devinez déjà ce qu'il va se passer :p.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
