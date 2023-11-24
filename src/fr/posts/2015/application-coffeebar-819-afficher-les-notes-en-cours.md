---
title: "Application CoffeeBar 8/19 - Afficher les notes en cours"
permalink: "fr/posts/application-coffeebar-819-afficher-les-notes-en-cours.html"
date: "2015-02-25T13:41"
slug: application-coffeebar-819-afficher-les-notes-en-cours
layout: post
drupal_uuid: ac92abd2-5a7b-4517-be4a-7c74c3556222
drupal_nid: 110
lang: fr
author: haclong

book:
  book: gerer-un-cafe-avec-une-programmation-evenementielle
  rank: 8,
  top: 
    url: /fr/books/gerer-un-cafe-avec-une-programmation-evenementielle.html
    title: Gérer un café avec une programmation événementielle
  next: 
    url: /fr/posts/application-coffeebar-919-commander-les-plats-et-les-boissons.html
    title: Application CoffeeBar 9/19 - Commander les plats et les boissons
  previous:
    url: /fr/posts/application-coffeebar-719-gerer-les-commandes-ouvertes.html
    title: Application CoffeeBar 7/19 - Gérer les commandes ouvertes

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "MVC"
  - "programmation événementielle"
  - "events"
  - "OOP"

sites:
  - "Développement"

summary: "Notre application se structure de mieux en mieux. Nous avons nos principaux éléments et services désormais en place. Nous avons effectivement triché en affichant les éléments du cache de manière un peu... violente. Mettons maintenant les choses en forme pour un rendu plus sérieux."
---

Notre application se structure de mieux en mieux. Nous avons nos principaux éléments et services désormais en place. Nous avons effectivement triché en affichant les éléments du cache de manière un peu... violente. Mettons maintenant les choses en forme pour un rendu plus sérieux.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui auront disparu au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

## Liste des notes ouvertes

Allons créer l'action dédiée.

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

class TabController extends AbstractActionController
{
  public function listOpenedAction()
  {
    $cache = $this->serviceLocator->get('TabCache') ;
    $openTabs = $cache->getOpenTabs() ;
    return array('result' => $openTabs) ;
  }
}
```

On récupère l'index '`openTabs`' dans le cache. Rappelons nous, c'est l'objet `CoffeeBar\Entity\OpenTabs\TodoByTab` qui hérite de `\ArrayObject`. Il ne reste plus qu'à itérer et à afficher les informations dans la vue.

```
// module/CoffeeBar/view/coffee-bar/tab/list-opened.phtml

<h1>Notes ouvertes</h1>

<table>
  <tr><th>Serveur</th><th>Table</th><th></th></tr>
  <?php
    foreach($result as $k => $v)
    {
      echo "<tr>" ;
      echo "<td>" .$v->getWaiter(). "</td>" ;
      echo "<td>" .$v->getTableNumber(). "</td>" ;
      echo "<td><a href='".$this->url('tab/status', array('id' => $v->getTableNumber()))."'>Voir le statut</a></td>" ;
      echo "</tr>" ;
    }
  ?>
</table>
```

Mettons en place les routes (et la navigation) afin que cette page soit accessible. (Nous mettrons également la route `tab/status` en place au passage).

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
           * cette URL : http://coffeebar.home/tab/opened mène à cette route
           */
          'opened' => array(
            'type' => 'Literal',
            'options' => array(
              'route' => '/opened',
              'defaults' => array(
                'controller' => 'CoffeeBarController\Tab',
                'action' => 'listOpened',
              ),
            ),
            'may_terminate' => true,
          ),
 
          /**
           * cette URL : http://coffeebar.home/tab/status mène à cette route
           */
          'status' => array(
            'type' => 'Segment',
            'options' => array(
              'route' => '/status/[:id]',
              'defaults' => array(
                'controller' => 'CoffeeBarController\Tab',
                'action' => 'status',
              ),
            ),
          ),
        ),
      ),
    ),
  ),
) ;
```

La navigation :

```php
// module/CoffeeBar/config/module.config.php

<?php
return array(
  'navigation' => array(
    'default' => array(
      // ajouter aux autres items de navigation
      array(
        'label' => 'Opened tabs',
        'route' => 'tab/opened',
      ),
    ),
  ),
) ;
```

Retournons dans le contrôleur et ajoutons l'action `TabController::statusAction()`.

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

class TabController extends AbstractActionController
{
  public function statusAction()
  {
    $openTabs = $this->serviceLocator->get('OpenTabs') ;
    $status = $openTabs->statusForTable($this->params()->fromRoute('id')) ;
    return array('result' => $status) ;
  }
}
```

### La page de statut

Dans le service **OpenTabs**, nous allons mettre en place une méthode pour récupérer le statut de chacune des notes.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Entity\OpenTabs\TabStatus;

class OpenTabs
{
  /**
   * Retourne le statut de la commande
   * @param int $table - numéro de la table
   * @return TabStatus
   */
  public function statusForTable($table)
  {
    $this->loadTodoByTab() ;
    foreach($this->todoByTab->getArrayCopy() as $k => $v)
    {
      if($v->getTableNumber() == $table)
      {
        $status = new TabStatus() ;
        $status->setTabId($k) ;
        $status->setTableNumber($v->getTableNumber()) ;
        $status->setItemsToServe($v->getItemsToServe()) ;
        $status->setItemsInPreparation($v->getItemsInPreparation()) ;
        $status->setItemsServed($v->getItemsServed()) ;
        return $status ;
      }
    }
    return NULL ;
  }
}
```

La méthode `OpenTabs::statusForTable($table)` retourne un objet `CoffeeBar\Entity\OpenTabs\TabStatus`.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/OpenTabs/TabStatus.php

<?php
namespace CoffeeBar\Entity\OpenTabs ;

use ArrayObject;

class TabStatus
{
  protected $tabId; // int (guid) - id unique de la note
  protected $tableNumber; // int - numéro de la table
  protected $itemsToServe; // ItemsArray (ArrayObject) - liste des éléments à servir
  protected $itemsInPreparation; // ItemsArray (ArrayObject) - liste des éléments en préparation
  protected $itemsServed; // ItemsArray (ArrayObject) - liste des éléments servis

  // getters &amp; setters
}
```

Le tutoriel d'origine a l'air d'appliquer scrupuleusement la règle suivante : toute méthode retourne invariablement un objet. Ca à l'air systématique. En soit, ça ne me choque pas mais cela génère effectivement un volume conséquent d'objets. Après, cela permet de modifier un objet sans casser toute l'application...

Maintenant qu'on sait à quoi ressemble l'objet qui est issu de la méthode `OpenTabs::statusForTable()`, on va pouvoir organiser notre vue.

*(faites pas attention, je me suis aperçu après coup que mes vues sont un coup en français, un coup en anglais...)*

```php
// module/CoffeeBar/view/coffee-bar/tab/status.phtml

<h1>Tab status</h1>

<h2>Table #<?php echo $result->getTableNumber(); ?></h2>

<div><a href="<?php echo $this->url('tab/order', array('id' => $result->getTableNumber())) ;?>">Order Food/Drink</a></div>

<h3>Items to serve</h3>

<?php
  if(count($result->getItemsToServe()) == 0)
  {
    echo 'Pas de commande en cours' ;
  } else {
?>

    <table>
      <tr>
        <th>Menu #</th>
        <th>Description</th>
      </tr>

      <?php
        foreach($result->getItemsToServe() as $k=> $v)
        {
          echo "<tr>" ;
          echo "<td>" .$v->getMenuNumber(). "</td>" ;
          echo "<td>" .$v->getDescription() . "</td>" ;
          echo "</tr>" ;
        }
      ?>
    </table>

<?php
  }
?>

<h3>Food in preparation</h3>

<?php
  if(count($result->getItemsInPreparation()) == 0)
  {
    echo 'Pas de commande en cours' ;
  } else {
?>
    <table>
      <tr>
        <th>Menu #</th>
        <th>Description</th>
      </tr>

      <?php 
        foreach($result->getItemsInPreparation() as $k=> $v)
        {
          echo "<tr>" ;
          echo "<td>" .$v->getMenuNumber(). "</td>" ;
          echo "<td>" .$v->getDescription() . "</td>" ;
          echo "</tr>" ;
        }
      ?>
    </table>

<?php
  }
?>

<h3>Items already served</h3>

<?php
  if(count($result->getItemsServed()) == 0)
  {
    echo 'Pas de commande en cours' ;
  } else {
?>

    <table>
      <tr>
        <th>Menu #</th>
        <th>Description</th>
      </tr>

      <?php 
        foreach($result->getItemsServed() as $k=> $v)
        {
          echo "<tr>" ;
          echo "<td>" .$v->getMenuNumber(). "</td>" ;
          echo "<td>" .$v->getDescription() . "</td>" ;
          echo "</tr>" ;
        }
      ?>
    </table>

<?php
  }
?>
```

Evidemment, à ce niveau, nos listes (`$itemsToServe`, `$itemsInPreparation` et `$itemsServed`) sont vides... il n'y a rien... aucune commande.

Alors allons y !! Mettons les commandes en place.

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
 