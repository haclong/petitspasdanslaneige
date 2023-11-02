---
title: "Application CoffeeBar 14/19 - Marquer les plats préparés"
permalink: "fr/posts/application-coffeebar-1419-marquer-les-plats-prepares.html"
date: "2015-04-14T13:32"
slug: application-coffeebar-1419-marquer-les-plats-prepares
layout: post
drupal_uuid: 373a2d62-8680-4c8e-8179-eb1819acae48
drupal_nid: 118
lang: fr
author: haclong

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "programmation événementielle"
  - "Event Manager"
  - "OOP"

sites:
  - "Développement"

summary: "Maintenant que le chef accède à la liste des plats à préparer, il faut que le chef puisse marquer les plats qui ont été préparés et qui sont désormais prêts à servir. "
---

Maintenant que le chef accède à la liste des plats à préparer, il faut que le chef puisse marquer les plats qui ont été préparés et qui sont désormais prêts à servir.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui n'apparaitront plus systématiquement au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

## La vue du chef

Revoyons la vue (parce qu'après tout, l'interaction vient de là) et ajoutons lui quelques cases à cocher.

```php
// module/CoffeeBar/view/coffee-bar/chef/index.phtml

<h2>Meals to prepare</h2>

// le formulaire, qui renvoie sur une action de traitement
<form action="<?php echo $this->url('chef/markprepared') ; ?>" method="post">
  <table>
    <tr>
      <th>Menu #</th>
      <th>Description</th>
      <th>Prepared</th>
    </tr>

    <?php
      foreach($result as $group)
      {
        foreach($group->getItems() as $item)
        {
    ?>
 
          <tr>
            <td><?php echo $item->getMenuNumber() ; ?></td>
            <td><?php echo $item->getDescription() ; ?></td>
            // la case à cocher, avec, inclus dans la valeur, l'id unique de la note, et le numéro de menu
            <td>
              <input type="checkbox" name="prepared[]" value="prepared_<?php echo $group->getTab() ; ?>_<?php echo $item->getMenuNumber() ; ?>"/>
            </td>
          </tr>

    <?php
        }
      }
    ?>

  </table>

  <input type='submit' name='submit' value='Mark Prepared'/>
</form>
```

Ainsi, lorsque le chef aura préparé ses plats, il cochera les plats prêts et il préviendra ainsi les serveurs que des plats sont prêts à être servis.

### La route 'chef/markprepared'

Lorsque le formulaire est soumis, la route '`chef/markprepared`' est la route définie pour traiter le formulaire ainsi que c'est indiqué dans l'attribut `action` de la balise `<form>`.

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'router' => array(
    'routes' => array(
  
      /**
       * cette URL : http://coffeebar.home/chef mène à cette route
       */
      'chef' => array(
        'type' => 'Literal',
        'options' => array(
          'route' => '/chef',
          'defaults' => array(
            'controller' => 'CoffeeBarController\Chef',
            'action' => 'index',
          ),
        ),
        'may_terminate' => true,
        'child_routes' => array(
          'markprepared' => array(
            'type' => 'Literal',
            'options' => array(
              'route' => '/mark',
              'defaults' => array(
                'controller' => 'CoffeeBarController\Chef',
                'action' => 'mark',
              ),
            ),
          ),
        ),
      ),
    ),
  ),
) ;
```

### Traitons le formulaire

```php
// module/CoffeeBar/src/CoffeeBar/Controller/ChefController.php

<?php
namespace CoffeeBar\Controller;

use Zend\Mvc\Controller\AbstractActionController;

class ChefController extends AbstractActionController
{
  public function markAction()
  {
    $request = $this->getRequest() ; 
    if($request->isPost()) 
    {
      if(!is_array($request->getPost()->get('prepared'))) 
      {
        $this->flashMessenger()->addErrorMessage('Aucun plat ou boisson n\'a été choisi pour servir');
        return $this->redirect()->toRoute('chef');
      }
 
      $foodPerTab = $this->getPreparedFoodPerTab($request->getPost()->get('prepared')) ;

      if(!empty($foodPerTab))
      {
        $markPrepared = $this->serviceLocator->get('MarkFoodPreparedCommand') ;
        // $id = id unique de la note
        // $food = numero des menus préparés (array)
        foreach($foodPerTab as $id => $food)
        {
          $markPrepared->markPrepared($id, $food) ;
        }
      }
    }
    return $this->redirect()->toRoute('chef') ;
  }
 
  protected function getPreparedFoodPerTab($prepared)
  {
    $array = array() ;
    foreach($prepared as $item)
    {
      $groups = explode('_', $item) ;
      // $groups[1] = id unique de la note
      // $groups[2] = numéro de plat qui est préparé
      $array[$groups[1]][] = $groups[2] ;
    }
    return $array ;
  }
}
```

### Gestionnaire de services

Le gestionnaire de service, où on trouvera le service '`MarkFoodPreparedCommand`'

```php
// module/CoffeeBar/Module.php

<?php
namespace CoffeeBar;

use CoffeeBar\Command\MarkFoodPrepared;

class Module
{
  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'MarkFoodPreparedCommand' => function($sm) {
          $events = $sm->get('TabEventManager') ;
          $markFoodPrepared = new MarkFoodPrepared() ;
          // il nous faut le gestionnaire d'événements
          // puisque la classe MarkFoodPrepared() va déclencher un événement, bien sûr !
          $markFoodPrepared->setEventManager($events) ;
          return $markFoodPrepared ;
        },
      ),
    ) ;
  }
}
```

Enfin la classe `CoffeeBar\Command\MarkFoodPrepared`

```php
// module/CoffeeBar/src/CoffeeBar/Command/MarkFoodPrepared.php

<?php
namespace CoffeeBar\Command ;

use Zend\EventManager\EventManagerAwareInterface;
use Zend\EventManager\EventManagerInterface;

class MarkFoodPrepared implements EventManagerAwareInterface
{
  protected $id ; // int - id unique de la note
  protected $food ; // array - liste des numéros de menu
  protected $events ;

  // getters &amp; setters - ne pas oubliers setEventManager() et getEventManager()
 
  public function markPrepared($id, $menuNumbers)
  {
    $this->setId($id) ;
    $this->setFood($menuNumbers) ;
    $this->events->trigger('markFoodPrepared', '', array('markFoodPrepared' => $this)) ;
  }
}
```

Et voila, notre événement '`markFoodPrepared`' est déclenché.

On a signalé que les plats avaient été préparés. Cela va déclencher mécaniquement un événement '`foodPrepared`'.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php

use CoffeeBar\Event\FoodPrepared;
use CoffeeBar\Exception\FoodNotOutstanding;

class TabAggregate
{
  ...
 
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('markFoodPrepared', array($this, 'onMarkFoodPrepared')) ;
  }

  public function onMarkFoodPrepared($events)
  {
    $markFoodPrepared = $events->getParam('markFoodPrepared') ;
 
    $story = $this->loadStory($markFoodPrepared->getId()) ;

    // on vérifie que les plats préparés ont bien été commandés
    // en comparant la liste des numéros de menu préparés avec
    // la liste des numéros de menu qui figurent dans la propriété TabStory::outstandingFood
    if(!$story->isFoodOutstanding($markFoodPrepared->getFood()))
    {
      throw new FoodNotOutstanding('un ou plusieurs plats n\'ont pas été commandés') ;
    }
 
    $foodPrepared = new FoodPrepared() ;
    $foodPrepared->setId($markFoodPrepared->getId()) ;
    $foodPrepared->setFood($markFoodPrepared->getFood()) ;

    // on déclenche un événement 'foodPrepared'
    $this->events->trigger('foodPrepared', $this, array('foodPrepared' => $foodPrepared)) ;
  }
}
```

Pour info, voilà à quoi ressemble la méthode `TabStory::isFoodOutstanding()`

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php

class TabStory
{
  public function isFoodOutstanding(array $menuNumbers)
  {
    return $this->areAllInList($menuNumbers, $this->outstandingFood) ;
  }

  protected function areAllInList(array $want, OrderedItems $have)
  {
    // on récupère uniquement les numéros de menu de la liste OrderedItems stockée
    $currentHave = $this->getOrderedItemsId($have) ;

    // pour chaque numéro de plats préparés, on vérifie
    // que le numéro existe dans la liste des plats stockés ($outstandingFood)
    foreach($want as $item)
    {
      // si le numéro existe, on retire cet élément de la liste temporaire des plats stockés
      if(($key = array_search($item, $currentHave)) !== false) 
      {
        unset($currentHave[$key]);

      // sinon, on interromps l'exécution de la méthode
      } else {
        return false ;
      }
    }
    return true ;
  }

  protected function getOrderedItemsId(OrderedItems $items)
  {
    $array = array() ;
    foreach($items as $item)
    {
      $array[] = $item->getId() ;
    }
    return $array ;
  }
}
```

Et l'objet événement `CoffeeBar\Event\FoodPrepared

```php
// module/CoffeeBar/src/CoffeeBar/Event/FoodPrepared.php

<?php
namespace CoffeeBar\Event ;

class FoodPrepared
{
  protected $id ; // int - id unique de la note
  protected $food ; // array - menu numbers

  // getters &amp; setters
}
```

Voici l'exception `CoffeeBar\Exception\FoodNotOutstanding`

```php
// module/CoffeeBar/src/CoffeeBar/Exception/FoodNotOutstanding.php

namespace CoffeeBar\Exception ;

use Exception;

class FoodNotOutstanding extends Exception {}
```

Ainsi, le chef a préparé les plats. Il a marqué les plats qui avaient été préparés. En marquant ses plats, il a déclenché des événements '`markFoodPrepared`'.

Grâce aux listes `TabStory::$outstandingFood` qui sont stockées dans chaque `CoffeeBar\Entity\TabStory\TabStory`, on peut vérifier que tous les plats préparés ont bien été commandés. S'il n'y a pas d'exception qui a été lancée, on peut déclencher un événement '`foodPrepared`'.

Il est certain que nos différents objets vont réagir à ce nouvel événement.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
