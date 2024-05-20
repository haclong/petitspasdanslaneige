---
title: "Application CoffeeBar 19/19 - Clore la note"
permalink: "fr/posts/application-coffeebar-1919-clore-la-note.html"
date: "2015-06-09T16:23"
slug: application-coffeebar-1919-clore-la-note
layout: post
drupal_uuid: 810eb211-ecfd-4c0c-aef7-0264554a7a71
drupal_nid: 123
lang: fr
author: haclong

book:
  book: gerer-un-cafe-avec-une-programmation-evenementielle
  rank: 19,
  top: 
    url: /fr/books/gerer-un-cafe-avec-une-programmation-evenementielle.html
    title: Gérer un café avec une programmation événementielle
  previous:
    url: /fr/posts/application-coffeebar-1819-inevitablement-laddition.html
    title: Application CoffeeBar 18/19 - Inévitablement, l'addition

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "zend framework 2"
  - "OOP"
  - "programmation événementielle"

sites:
  - "Développement"

summary: "Pour encaisser la note, il n'y a qu'un seul élément de saisie de formulaire (input text). Si le paiement (donc le montant saisi) est inférieur, la note n'est pas soldée, on refuse de clore la note. Si le paiement est supérieur, on considère que la différence est le pourboire."
---

Pour encaisser la note, il n'y a qu'un seul élément de saisie de formulaire (input text). Si le paiement (donc le montant saisi) est inférieur, la note n'est pas soldée, on refuse de clore la note. Si le paiement est supérieur, on considère que la différence est le pourboire.

*NOTE : le long du tutoriel, je vais vous faire rééditer des classes et des vues sur lesquels on sera déjà passé. Il va y avoir des parties qui n'apparaitront plus systématiquement au second passage : typiquement les use, les instructions extends, implements etc... Cela ne veut pas dire qu'il faut les retirer. C'est juste pour alléger le code. S'il faut retirer du code, soit je vous remettrais le passage intégralement, pour voir ce qui a disparu, soit je vous signalerais qu'il faut effacer une ligne pour la remplacer par une autre.*

## Traitement du formulaire

Traitons d'abord le formulaire dans le contrôleur

```php
// module/CoffeeBar/src/CoffeeBar/Controller/TabController.php

<?php
namespace CoffeeBar\Controller ;

use CoffeeBar\Exception\MustPayEnough;
use CoffeeBar\Exception\TabAlreadyClosed;

class TabController
{
  public function closeAction()
  {
    $openTabs = $this->serviceLocator->get('OpenTabs') ;

    $form = $this->serviceLocator->get('CloseTabForm') ;

    $request = $this->getRequest() ;

    $id = (int) $this->params()->fromRoute('id') ;

    // vérifier si on connait le numéro de la table pour laquelle on va encaisser
    if (isset($id)) 
    {
      // vérifier si le formulaire a été posté
      if($request->isPost()) 
      {
        $form->setData($request->getPost()) ;
 
        try {
          $form->isValid() ;
          $this->flashMessenger()->addMessage('La note a été fermée avec succès');
          return $this->redirect()->toRoute('tab/opened');
 
        // si le paiement est insuffisant
        } catch (MustPayEnough $e) {
          $this->flashMessenger()->addErrorMessage($e->getMessage());
          return $this->redirect()->toRoute('tab/close', array('id' => $id));
        // si la note est déjà fermée, on refuse d'encaisser de nouveau
        } catch (TabAlreadyClosed $e) {
          $this->flashMessenger()->addErrorMessage($e->getMessage()) ;
          return $this->redirect()->toRoute('tab/opened') ;
        }
      }

      // le reste du code
    }

    $result['status'] = $status ;
    $result['form'] = $form ;
    return array('result' => $result) ;
  }
}
```

## L'historique des notes

A la soumission du formulaire, l'objet `CoffeeBar\Command\CloseTab` est créé. Grâce à l'hydrator `Zend\Stdlib\Hydrator\ArraySerializable` et à la méthode `CloseTab::populate()`, on a pu déclencher un événement '`closeTab`' au moment où on crée l'objet `CoffeeBar\Command\CloseTab`. Il reste à notre service **TabAggregate** d'intercepter cet événement et, le cas échéant, de lancer les exceptions si nécessaire.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TagAggregate.php

<?php
namespace CoffeeBar\Service ;

use CoffeeBar\Event\TabClosed;
use CoffeeBar\Exception\MustPayEnough;
use CoffeeBar\Exception\TabAlreadyClosed;

class TabAggregate
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('closeTab', array($this, 'onCloseTab')) ;
    $this->listeners[] = $events->attach('tabClosed', array($this, 'onTabClosed')) ;
  }

  public function onCloseTab($events)
  {
    $closeTab = $events->getParam('closeTab') ;

    $story = $this->loadStory($closeTab->getId()) ;

    // on compare le montant des éléments servis (stockés dans l'historique)
    // avec le montant payé (qui vient de l'objet CloseTab)
    if($story->getItemsServedValue() > $closeTab->getAmountPaid())
    {
      throw new MustPayEnough('Le solde n\'y est pas, compléter l\'addition') ;
    }

    // on vérifie que la note est toujours ouverte
    if(!$story->isTabOpened())
    {
      throw new TabAlreadyClosed('La note est fermée') ;
    }

    $tabClosed = new TabClosed() ;
    $tabClosed->setId($closeTab->getId()) ;
    $tabClosed->setAmountPaid($closeTab->getAmountPaid()) ;
    $tabClosed->setOrderValue($story->getItemsServedValue()) ;
    $tabClosed->setTipValue($closeTab->getAmountPaid() - $story->getItemsServedValue()) ;

    $this->events->trigger('tabClosed', $this, array('tabClosed' => $tabClosed)) ;
  }
 
  public function onTabClosed($events)
  {
    $tabClosed = $events->getParam('tabClosed') ;
 
    $story = $this->loadStory($tabClosed->getId()) ;
    // on ferme la note.
    $story->closeTab() ;
    $this->saveStory($tabClosed->getId(), $story) ;
  }
}
```

Voici les deux exceptions, encore une fois, juste des héritages de la classe `\Exception` de base

```php
// module/CoffeeBar/src/CoffeeBar/Exception/MustPayEnough.php

<?php
namespace CoffeeBar\Exception ;

use Exception;

class MustPayEnough extends Exception {}
```

```php
// module/CoffeeBar/src/CoffeeBar/Exception/TabAlreadyClosed.php

<?php
namespace CoffeeBar\Exception ;

use Exception;

class TabAlreadyClosed extends Exception {}
```

Voici l'objet `CoffeeBar\Event\TabClosed`, mais vous vous doutez déjà de ce qu'on va y trouver

```php
// module/CoffeeBar/src/CoffeeBar/Event/TabClosed.php

<?php
namespace CoffeeBar\Event ;

class TabClosed
{
  protected $id; // int (guid) - id unique de la note
  protected $amountPaid; // double
  protected $orderValue; // double
  protected $tipValue; // double

  // getters &amp; setters
}
```

Notez que, contrairement à l'objet `CoffeeBar\Command\CloseTab` qui n'a que deux propriétés (l'*id* et le *montant payé* (`$amountPaid`)), l'objet `CoffeeBar\Event\TabClosed` contient deux propriétés de plus : le *pourboire* (`$tipValue`) et le *montant total de la note* (`$orderValue`).

Avec l'événement '`tabClosed`', on ferme la note.



## Liste des notes ouvertes

Avec l'événement '`tabClosed`', on retire la note de la liste des notes ouvertes.

```php
// module/CoffeeBar/src/CoffeeBar/Service/OpenTabs.php

<?php
namespace CoffeeBar\Service ;

class OpenTabs implements ListenerAggregateInterface
{
  public function attach(EventManagerInterface $events)
  {
    $this->listeners[] = $events->attach('tabClosed', array($this, 'onTabClosed')) ;
  }

  /**
   * Listener to tabClosed event
   * unset the tab from the TodoByTab list
   * @param Events $events
   */
  public function onTabClosed($events)
  {
    $tabClosed = $events->getParam('tabClosed') ;

    $this->loadTodoByTab() ;
    $this->todoByTab->offsetUnset($tabClosed->getId()) ;
    $this->saveTodoByTab() ;
  }
}
```

Et voila. L'application est terminée.

## Historiser les événements

Avec cette méthode, on peut facilement enregistrer l'historique d'une note. Pour cela, il suffit de stocker dans une propriété `TabStory::$eventsLoaded` les événements qui surviennent.

```php
// module/CoffeeBar/src/CoffeeBar/Entity/TabStory/TabStory.php

<?php
class TabStory
{
  protected $eventsLoaded ; // array - liste des événements

  public function __construct()
  {
    $this->eventsLoaded = array() ;
  }

  public function addEvents($event) 
  {
    $this->eventsLoaded[] = $event ;
  }

  public function getEventsLoaded() 
  {
    return $this->eventsLoaded ;
  }
}
```

Dans notre service **TabAggregate**, lorsqu'on sauvegarde l'historique dans le cache, on va en profiter pour ajouter l'événement à l'historique.

```php
// module/CoffeeBar/src/CoffeeBar/Service/TabAggregate.php

<?php
class TabAggregate
{
  // les autres méthodes

  public function onTabOpened($events)
  {
    $tabOpened = $events->getParam('tabOpened') ;
    $story = $this->loadStory($tabOpened->getId()) ;
    $story->addEvents($tabOpened) ; // stockage de l'événement dans la note
    // traiter les données
    $this->saveStory($tabOpened->getId(), $story) ;
  }
 
  public function onDrinksOrdered($events)
  {
    $drinksOrdered = $events->getParam('drinksOrdered') ;
    $story = $this->loadStory($drinksOrdered->getId()) ;
    $story->addEvents($drinksOrdered) ; // stockage de l'événement dans la note
    // traiter les données
    $this->saveStory($drinksOrdered->getId(), $story) ;
  }
 
  public function onFoodOrdered($events)
  {
    $foodOrdered = $events->getParam('foodOrdered') ;
    $story = $this->loadStory($foodOrdered->getId()) ;
    $story->addEvents($foodOrdered) ; // stockage de l'événement dans la note
    // traiter les données
    $this->saveStory($foodOrdered->getId(), $story) ;
  }
 
  public function onDrinksServed($events)
  {
    $drinksServed = $events->getParam('drinksServed') ;
    $story = $this->loadStory($drinksServed->getId()) ;
    $story->addEvents($drinksServed) ;
    // traiter les données
    $this->saveStory($drinksServed->getId(), $story) ;
  }

  public function onFoodPrepared($events)
  {
    $foodPrepared = $events->getParam('foodPrepared') ;
    $story = $this->loadStory($foodPrepared->getId()) ;
    $story->addEvents($foodPrepared) ;
    // traiter les données
    $this->saveStory($foodPrepared->getId(), $story) ;
  }

  public function onFoodServed($events)
  {
    $foodServed = $events->getParam('foodServed') ;
    $story = $this->loadStory($foodServed->getId()) ;
    $story->addEvents($foodServed) ;
    // traiter les données
    $this->saveStory($foodServed->getId(), $story) ;
  }
 
  public function onTabClosed($events)
  {
    $tabClosed = $events->getParam('tabClosed') ;
    $story = $this->loadStory($tabClosed->getId()) ;
    $story->addEvents($tabClosed) ;
    // traiter les données
    $this->saveStory($tabClosed->getId(), $story) ;
  }
}
```

Si on souhaite également stocker les opérations (`CoffeeBar\Command`), il faut savoir que vous ne pourrez pas sérializer les objets du namespace `CoffeeBar\Command` parce que chacun de ces objets a une propriété `$events` (`EventManager`). Il y a quelquechose dans un objet **EventManager** qui empêche la sérialization. Il faudra alors, pour chaque objet du namespace `CoffeeBar\Command` ajouter une méthode magique `__sleep()>` dans laquelle on définit les propriétés qui doivent être conservées dans la sérialization.

## Extensions

On peut imaginer la suite, un outil de comptabilité par ex qui comptabiliserait toutes les notes de la journée : montant total encaissés, montant total des éléments servis par table, montant total du pourboire, ou encore pourboire par serveur... On peut encore étendre les fonctionnalités et relativement facilement.

On peut également permettre de modifier la note : annuler des plats pas encore préparés et des boissons pas encore servies par ex. Les possibilités sont multiples, bien entendu et je vous laisse imaginer la suite.

Les événements (`CoffeeBar\Event`) et les opérations (`CoffeeBar\Command`) sont des objets qui n'héritent de rien. Afin de pouvoir les traiter comme des ensembles (et utiliser par exemple le <a href="http://fr2.php.net/manual/fr/language.oop5.typehinting.php" target="_blank">typage explicite (type hinting)</a>), je pense qu'il faut mettre en place une *interface* pour les opérations et une autre pour les événements. Chaque objet alors implémenterait l'interface qui correspond.

## Remarques

Avec ce tutoriel, très long finalement (plus long que je ne le pensais) et très répétitif, je vois deux points à mettre en évidence :

Pour un rendu (avec **Zend Framework 2**), il faut toujours

1. une route
2. un contrôleur (et surtout ne pas oublier de le déclarer dans la configuration)
3. une vue
4. une navigation
5. un gestionnaire de services parce que tout repasse par lui

**Tous les autres objets ne concernent que le métier**

Parallèlement à cette constatation, je peux dresser deux familles d'objets :

- **Controller**, **Form**, **Service**, **Aides de vues** et **Aides d'action** vont être des objets qui servent au rendu de l'application.
- **Hydrators**, **Exception**, **Entity**, **Listeners** et tout ce qu'on peut imaginer derrière vont être des objets qui servent au traitement des informations.

Si on doit appliquer cette règle strictement, mon service **TabAggregate** ne serait pas un service mais serait autre chose... juste un listener par ex. Alors que le service **OpenTabs** lui, retourne des objets (`TabStatus`, `TabInvoice`) qui sont exploités par la vue.

C'est du chipotage... juste une piste pour organiser ses entités par exemple.

## Conclusion

J'espère que ce tutoriel n'a pas été trop long finalement, que vous avez appris de nouvelles choses (en tout cas, moi, je l'ai fait) et que je reste clair le long de la vingtaine d'articles, sans recourir à des raccourcis trop rapide et sans m'embrouiller entre la commande (`CoffeeBar\Command`) et la commande (des plats et boissons), le service (**ServiceManager**) et le service (`CoffeeBar\Service`), l'événement (`CoffeeBar\Event`) et l'événement (l'entité *Event* déclenchée dans un gestionnaire d'événement).

Je m'aperçois que dans mon source, il y a des commentaires et des textes en français parfois et en anglais parfois... désolée, je manque de rigueur de ce côté là.

Tout du long du tutoriel, je sais que j'ai une gestion des dépendances des plus pourries :p Il faudrait bannir les mots clés '`new`' du code. Je vous laisse faire les corrections pour mettre tout ça au carré. Toutefois, suite à mes remarques plus haut, entre les classes qui servent au traitement des infos et aux classes qui servent au rendu, on peut essayer de dégager une logique pour ne pas systématiquement instancier tous ses objets dans le gestionnaire de services. Je n'ai pas vraiment d'exemple à proposer. Cela reste encore confus pour moi et je ne me permettrais pas de donner des recommandations sur ce point.

Merci de m'avoir suivi jusqu'ici. A une prochaine fois.

For my english spoken friends, sorry... If i'd be courageous enough, i'd translate this tutorial into english but it is an awfully long one and i don't know if I'll do it...

*Vous trouverez l'intégralité de l'application sur mon <a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
