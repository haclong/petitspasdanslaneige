---
title: "Le routing avec Zend Framework 2"
permalink: "fr/posts/le-routing-avec-zend-framework-2.html"
date: "2015-02-15T12:49"
slug: le-routing-avec-zend-framework-2
layout: post
drupal_uuid: 010b7f84-51df-4ec2-ac3f-12b30e4bfe39
drupal_nid: 130
lang: fr
author: haclong

media:
  path: /img/teaser/m_Ruta-40-Argentina.jpg

tags:
  - "routing"
  - "Zend Router"
  - "zend framework 2"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Le routing, c'est le fait d'associer une requête (URL) à des fichiers qui se trouvent sur le serveur... C'est la correspondance qui se fait entre l'URL qu'on saisit dans la barre d'adresse du navigateur et le (ou les) fichiers qui vont contenir le code nécessaire à la construction des informations qui vont être retournées vers le navigateur (on parle de \"page web\"). On sait tous, de nos jours, qu'UNE page web n'est plus l'affaire d'une page (et une seule)... Si le routing, ça ne vous dit rien, c'est parce que la plupart du temps, ça s'est fait tout seul... Plus maintenant."
---

Le routing, c'est le fait d'associer une requête (URL) à des fichiers qui se trouvent sur le serveur... C'est la correspondance qui se fait entre l'URL qu'on saisit dans la barre d'adresse du navigateur (`http://www.monsite.com/accueil/hello/world`) et le (ou les) fichiers qui vont contenir le code nécessaire à la construction des informations qui vont être retournées vers le navigateur (on parle de "page web"). On sait tous, de nos jours, qu'UNE page web n'est plus l'affaire d'une page (et une seule)... Si le routing, ça ne vous dit rien, c'est parce que la plupart du temps, ça s'est fait tout seul... Plus maintenant.

## Un peu d'historique

### En HTML

Pour ceux qui ont commencé à faire des sites web en HTML, on a acquis une mauvaise habitude : l'URL de la page HTML correspond au chemin du fichier .html dans le système de fichiers.

En bon vieux HTML, pour l'URL : `http://www.monsite.com/accueil/hello/world.html`, on devait mettre le fichier dans `{WEBROOT}/accueil/hello/world.html`.

Il n'y a donc pas à se soucier du routing. Le serveur (**Apache**) faisait le boulot pour nous et tout allait bien.

### Au début du PHP

Pour ceux qui ont commencé en PHP avec les prémices d'un front controller, on avait une page `index.php` unique avec un tas de paramétres dans la requête qui disait vers quelle page partir.

Pour l'URL : `http://www.monsite.com/index.php?page=helloworld`, on avait, dans le fichier `{WEBROOT}/index.php` une redirection ou un include vers le fichier php qui correspondait au contenu de `page=helloworld`.

### Zend Framework 1

Pour ceux qui sont passés par **Zend Framework 1**, ici encore, le routing était transparent. En soit, c'était bien pratique parce que quand on découvre un framework, ça faisait toujours ça de moins à gérer. Mais c'est une erreur parce qu'on continue avec nos mauvaises habitudes. Avec **Zend Framework 1** (si je me souviens bien), pour l'URL `http://www.monsite.com/accueil/hello/world`, le contenu de la page se trouvait dans l'action `WorldAction` du contrôleur `HelloController` du module `Accueil` (et la vue associée).

C'était pratique mais ça pouvait générer des casses têtes pour l'organisation des contrôleurs et des actions.

En effet, comment par exemple, mettre en place nos contrôleurs et actions si on a ce type de pages :

- monsite.com/album/list
- monsite.com/admin/album/list

Il faudrait coder un premier module avec la liste des albums d'une part, pour la partie **front** puis créer un module **admin** et RE coder la liste des albums, pour la partie admin ?? On n'a pas l'impression de travailler deux fois pour rien ?

### Zend Framework 2

Avec l'arrivée de **Zend Framework 2**, il y a eu des changements.

La Team de **ZF2** a décidé que le routing ne se ferait plus de manière transparente. Finie la règle *module\controller\action* qui régnait. (Note : on pouvait la surcharger, la changer et en faire ce qu'on voulait, mais c'était compliqué et finalement, pour ceux qui découvrait le framework, c'était plus complexe de changer).

Désormais, il est impératif de définir ses propres routes. L'avantage, c'est qu'on en fait ce qu'on veut. On garde le contrôle et l'organisation de nos modules, nos contrôleurs est complètement décorélé de l'arborescence de notre site.

Si vous souhaitez utiliser les composants de routing de **Zend Framework 2** en standalone (hors de l'application Zend Framework par défaut), je vous recommande de vous reférer à la <a href="http://framework.zend.com/manual/current/en/modules/zend.mvc.routing.html" target="_blank">documentation officielle</a> et de voir comment vous pouvez instancier vos routes.

Pour ceux qui utilisent le **Zend Framework Skeleton Application**, le mécanisme de routing est déjà chargé (avec l'objet `Zend\Mvc\Router\Http\TreeRouteStack`) dans l'application. Il ne reste plus qu'à paramétrer nos routes, c-a-d définir les URL d'une part (la requête) et leur assigner les contrôleurs et les actions qui correspondent.

En plus de l'objet **TreeRouteStack** qui est monté par défaut dans l'application de **Zend Framework** et qui prend le routing en charge, il y a l'objet `Zend\Mvc\Router\RoutePluginManager` qui permet de paramétrer nos routes à partir d'un tableau (`array`) de configuration.

Toute la construction / chargement des différentes routes se fait alors automatiquement à partir de la configuration.

## Le paramétrage des routes

### Les types de routes

Chaque route a **un nom**, **un type** et les différentes **options**, en fonction du type de route que l'on va définir.

**Zend Framework** définit par défaut un certain nombre de types différents. Chaque type a un nom raccourci (le nom du plugin) utilisé par le **RoutePluginManager**.

#### De base, j'ai envie de dire que vous n'aurez besoin que deux types différents :

- `Zend\Mvc\Router\Http\Literal` (plugin : *literal*)
- `Zend\Mvc\Router\Http\Segment` (plugin : *segment*)

Ainsi que d'un type que vous allez utiliser indirectement :

- `Zend\Mvc\Router\Http\Part` (plugin : *part*)

Nous allons voir ces types plus en détail plus bas.

#### Les autres types qui existent :

- `Zend\Mvc\Router\Http\Hostname` (plugin : *hostname*)
- `Zend\Mvc\Router\Http\Method` (plugin : *method*)
- `Zend\Mvc\Router\Http\Regex` (plugin : *regex*)
- `Zend\Mvc\Router\Http\Scheme` (plugin : *scheme*)
- `Zend\Mvc\Router\Http\Method` (plugin : *method*)

Je vous invite à consulter la documentation directement pour ces autres types de routes.

#### Deux types sont documentés mais sont marqués obsolètes :

- `Zend\Mvc\Router\Http\Query`
- `Zend\Mvc\Router\Http\Widlcard`

Je vous recommande de ne pas les utiliser... enfin, c'est du bon sens en fait :p

### L'usage... quotidien

`Zend\Mvc\Router\Http\Literal`

Le type Literal sert à définir des routes qui ont une URL fixe.

- http://www.monsite.com/about-me
- http://www.monsite.com/accueil
- http://www.monsite.com/forum
- http://www.monsite.com/catalogue/musique/album/list
- http://www.monsite.com/catalogue/lecture/auteur/list

Voici comment marche la route (pour moi) :

- Je détermine la requête (l'URL) où je veux situer mes informations.
- Je choisis le contrôleur et l'action avec lesquels je pourrais afficher ces informations.
- Je donne un nom à cette route (rappel : la route, c'est le fait d'associer la requête au contrôleur/action correspondant)

Et je fais le paramétrage qui va bien :

```php
// module/MON_MODULE/config/module.config.php
return array(
  'controllers' => array(
    'invokables' => array(
      'AboutMeController' => 'MON_MODULE\Controller\AboutMeController',
      'IndexController' => 'MON_MODULE\Controller\IndexController',
      'LivreController' => 'MON_MODULE\Controller\BookController',
      'MusiqueController' => 'MON_MODULE\Controller\MusicController',
    ),
  ),
  'router' => array(
    'routes' => array(
      
      // le nom de ma route : aboutme
      'aboutme' => array(
        'type' => 'literal',
        'options' => array(
          'route' => '/about-me',
          'defaults' => array(
            // utiliser les alias des controleurs
            // dans la clé 'controllers'
            'controller' => 'AboutMeController',
            'action' => 'aboutme', // AboutMeController::AboutmeAction()
          ),
        ),
      ),

      'home' => array(
        'type' => 'literal',
        'options' => array(
          'route' => '/accueil',
          'defaults' => array(
            // utiliser les alias des controleurs
            // dans la clé 'controllers'
            'controller' => 'IndexController',
            'action' => 'index', // IndexController::IndexAction()
          ),
        ),
      ),
      
      'forum' => array(
        'type' => 'literal',
        'options' => array(
          'route' => '/forum',
        ),
      ),
 
      'listAlbum' => array(
        'type' => 'literal',
        'options' => array(
          'route' => '/catalogue/musique/album/list',
          'defaults' => array(
            // utiliser les alias des controleurs
            // dans la clé 'controllers'
            'controller' => 'MusiqueController',
            'action' => 'album', // MusiqueController::AlbumAction()
          ),
        ),
      ),
 
      'listAuteur' => array(
        'type' => 'literal',
        'options' => array(
          'route' => '/catalogue/lecture/auteur/list',
          'defaults' => array(
            // utiliser les alias des controleurs
            // dans la clé 'controllers'
            'controller' => 'LivreController',
            'action' => 'auteur', // LivreController::AuteurAction()
          ),
        ),
      ),
    ),
  ),
);
```

Comme on peut le voir avec les requêtes concernant le catalogue :

- on peut avec une URL qui ne correspond pas à nos controllers
- on peut avoir des alias de contrôleurs qui ne correspondent pas à nos objets contrôleurs

D'autre part, comme pour la requête du forum, il n'y a pas de contrôleur et d'action défini : par exemple, parce que dans le répertoire `/forum`, sur le serveur, il y a un phpBB qui est installé...

On est vraiment libre de faire ce qu'on veut. Il faut garder à l'esprit que les routes de type literal sont celles qui, pour une URL, affiche un même contenu... (modulo par ex, les informations stockées en session, que vous pouvez utiliser pour changer l'affichage...)

Avec les routes définies à l'instant, il faut savoir que vous n'avez RIEN de prévu pour ce type de requête :

- http://www.monsite.com/catalogue
- http://www.monsite.com/catalogue/musique
- http://www.monsite.com/catalogue/lecture

Pour le moment, comme il n'y a rien prévu pour ces requêtes, l'internaute va obtenir une erreur 404. Du coup, il va falloir définir une route pour chacune des étapes du lien... Ou gérer avec une redirection d'URL... à vous de voir.

`Zend\Mvc\Router\Http\Segment`

Bon, si à chaque requête on a toujours le même contenu, on est d'accord, autant faire de la page HTML, ça ira bien plus vite...

Non, nous, ce qui nous intéresse, ce sont les informations qui changent dynamiquement, en fonction de la page, du contexte, des liens...

Et des informations qui changent dynamiquement, ce sont des routes de type **segment**.

- monsite.com/profil/marie
- monsite.com/profil/jean
- monsite.com/album
- monsite.com/album/2
- monsite.com/produit/read/1
- monsite.com/produit/edit/1
- monsite.com/produit/delete/1

```php
// module/MON_MODULE/config/module.config.php

return array(
  'controllers' => array(
    'invokables' => array(
      'ProfilController' => 'MON_MODULE\Controller\ProfilController',
      'AlbumController' => 'MON_MODULE\Controller\AlbumController',
      'ProduitController' => 'MON_MODULE\Controller\ProduitController',
    ),
  ),
  'router' => array(
    'routes' => array(
      // les fiches profil
      'profil' => array(
        'type' => 'segment',
        'options' => array(
          'route' => '/profil/:name',
          'constraints' => array(
            'name' => '[a-zA-Z]+', // regex, débrouillez vous, je suis nulle à ce jeu
          ),
          'defaults' => array(
            // utiliser les alias des controleurs
            // dans la clé 'controllers'
            'controller' => 'ProfilController',
            'action' => 'index', // ProfilController::IndexAction()
          ),
        ),
      ),
      'album' => array(
        'type' => 'literal',
        'options' => array(
          'route' => '/album[/:id]',
          'constraints' => array(
            'id' => '[0-9]+',
          ),
          'defaults' => array(
            'controller' => 'AlbumController',
            'action' => 'index', // AlbumController::IndexAction()
            'id' => 1,
          ),
        ),
      ),
      'produit' => array(
        'type' => 'literal',
        'options' => array(
          'route' => '/produit[/:action/:id]',
          'constraints' => array(
            'action' => '[a-z]+',
            'id' => '[0-9]+',
          ),
          'defaults' => array(
            'controller' => 'ProduitController',
            'action' => 'index', // ProduitController::IndexAction()
          ),
        ),
      ),
    ),
  ),
);
```

Dans les exemples ci dessus, on peut noter plusieurs éléments :

Dans la route '*profil*', on note que

- il y a un élément variable : `:name`.
- cet élément `:name` est forcément alphabétique.
- cet élément `:name` est obligatoire dans l'URL

Cette requête `monsite.com/profil/marie` va utiliser le contrôleur `ProfilController`, l'action `IndexAction` et la valeur de `name` sera **marie**.
Cette requête `monsite.com/profil/jean` va utiliser le contrôleur `ProfilController`, l'action `IndexAction` et la valeur de `name`sera **jean**.

Cette requête `monsite.com/profil/marie3` va provoquer une erreur.

Dans la route '*album*', on note que

- l'élément variable s'appelle `:id`
- cet élément `:id` est optionnel (présence des crochets `[ ]`)
- si cet élément `:id` est omis dans l'url, alors par défaut, on considèrera que c'est l'id *1*

Cette requête `monsite.com/album` va utiliser le contrôleur `AlbumController` et l'action `IndexAction` et l'`id = 1`
Cette requête `monsite.com/album/2` va utiliser le contrôleur `AlbumController`et l'action `IndexAction`et l'`id = 2`

Dans la route '*produit*', on note que

- il y a deux éléments variables : `:action` et `:id`
- les deux éléments variables sont optionnels ensemble.
- il n 'y a pas de valeur par défaut pour `:id` mais il y a une action par défaut.

Cette requête `monsite.com/produit` va utiliser le contrôleur `ProduitController` et l'action `IndexAction`
Cette requête `monsite.com/produit/read/1` va utiliser le contrôleur `ProduitController`, l'action `ReadAction` et l'`id = 1`
Cette requête `monsite.com/produit/edit/1` va utiliser le contrôleur `ProduitController`, l'action `EditAction` et l'`id = 1`
Cette requête `monsite.com/produit/delete/1` va utiliser le contrôleur `ProduitController`, l'action `DeleteAction` et l'`id = 1`

En revanche, cette requête `monsite.com/produit/read` va retourner une erreur parce qu'il manque l'élément `id`.

### Une arborescence de routes

A partir de là, vous pouvez combiner vos routes :

```php
// module/MON_MODULE/config/module.config.php
return array(
  'controllers' => array(
    'invokables' => array(
      'CatalogueController' => 'MON_MODULE\Controller\StoreController',
      'LivreController' => 'MON_MODULE\Controller\BookController',
    ),
  ),
  'router' => array(
    'routes' => array(
      // nom de la route
      'ma_route_catalogue' => array(
        'type' => 'literal',
        'options' => array(
          'route' => '/catalogue',
          'defaults' => array(
            'controller' => 'CatalogueController',
            'action' => 'index', // CatalogueController::IndexAction()
          ),
        ),
        'may_terminate' => true,
        'child_routes' => array(
          // nom de la route
          'ma_route_lecture' => array(
            'type' => 'literal',
            'options' => array(
              'route' => '/lecture',
              'defaults' => array(
                'controller' => 'BookController',
              ),
            ),
            'child_routes' => array(
              // nom de la route
              'ma_route_auteur' => array(
                'type' => 'segment',
                'options' => array(
                  'route' => '/auteur/:id'
                  'constraints' => array(
                    'id' => '['a-zA-Z']',
                  ),
                  'defaults' => array(
                    'action' => 'auteur', // BookController::AuteurAction()
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
```

Cette requête `monsite.com/catalogue` (`CatalogueController::IndexAction`) est possible parce qu'on a signalé que la route '`ma_route_catalogue`' pouvait se terminer. (`may_terminate = true`)

Cette requête `monsite.com/catalogue/lecture` (`BookController`, pas d'action) n'est pas possible parce qu'on a signalé que la route '`ma_route_catalogue/ma_route_lecture`' ne pouvait pas se terminer à ce moment de l'arbre (`may_terminate` non défini, *false* par défaut)

Cette requête `monsite.com/catalogue/lecture/auteur` (`BookController::AuteurAction`) n'est pas possible parce que dans la route '`ma_route_catalogue/ma_route_lecture/ma_route_auteur`', le paramètre `id` est obligatoire

Cette requête `monsite.com/catalogue/lecture/auteur/1` (`BookController::AuteurAction`, `id = 1`) est possible.

## Utiliser les routes

Définir des routes, c'est bien. Encore faut il pouvoir en faire usage.

### Configuration de la navigation

Lorsque vous configurez l'arborescence de votre navigation, vous utiliser les noms des routes

```php
// module/MON_MODULE/config/module.config.php

return array(
  'navigation' => array(
    'default' => array(
      array(
        'label' => 'Catalogue',
        'route' => 'ma_route_catalogue',
      ),
    ),
  ),
);
```

### Faire des liens dans les vues

A partir de n'importe lequel de vos fichiers .phtml, vous pouvez accéder à vos routes ainsi

`<a href='<?php echo $this->url('ma_route_catalogue') ; ?>'>Le catalogue</a>`

`<form action='<?php echo $this->url('ma_route_catalogue/ma_route_lecture/ma_route_auteur', array('id' => 4)) ; ?>' 
    method='post'>`

`<a href='<?php echo $this->url('ma_route_catalogue/ma_route_lecture/ma_route_auteur', array('id' => 5)) ; ?>'>
    Voir la fiche de l'auteur avec id = 5</a>`

La clé du tableau `array('id' => 5)` est déterminée lorsque vous créez votre route. Si votre élément variable de votre route s'appelle `:id`, la clé du tableau plus tard sera `'id'`. Si votre élément variable est `:toto`, alors `$this->url('nom_de_la_route', array('toto' => $valeur)) ;`

### Faire les redirections dans vos contrôleurs

A partir de n'importe laquelle de vos contrôleurs, vous pouvez faire une redirection comme ceci :

```php
class MonController extends AbstractActionController
{
  public function toDoAction()
  {
    // faire sa tambouille

    return $this->redirect()->toRoute('nom_de_la_route', array('name' => $name));
  }
}
```

### Récupérer la portion variable pour la traiter

Dans le contrôleur, pour récupérer les paramètres de votre URL :

```php
class ProfilController extends AbstractActionController
{
  public function indexAction()
  {
    $nom = $this->params()->fromRoute('name');

    // faire sa tambouille
  }
}
```

(souvenez vous, c'était la route '*profil*' avec une route comme ceci : `'route' => '/profil/:name'`)

### Pour récupérer les informations de la route avant le contrôleur

Pour savoir quelle route est utilisée, le composant **MVC** de l'application **Zend Framework** retourne un composant **RouteMatch** qui contient toutes les informations de la route :

Attention (contrairement à ce que j'ai pu dire), la route n'existe pas encore au moment du bootstrap. Pour déterminer de quelle route il s'agit, il faut le faire en deux temps :

1. Créer un listener dans lequel on pourra tester la route
2. Attacher le listener à l'événement `MvcEvent::EVENT_DISPATCH`

*Petites explications très rapides : Lorsqu'une "page" se charge avec une application Zend Framework, entre le moment - très rapide - où on présente la requête et le moment où l'application apporte la réponse (la page), il y a plusieurs étapes qui se franchissent les unes après les autres, chacune de ces étapes étant marquées par un événement. Vous trouverez la liste des événements dans la <a href="http://framework.zend.com/manual/current/en/modules/zend.mvc.mvc-event.html#order-of-events" target="_blank">documentation de l'objet MvcEvent</a>.*

*Si vous souhaitez que quelquechose se passe AVANT d'arriver au contrôleur, je vous invite à reproduire le même principe, en changeant l'événement si nécessaire.*

```php
class Module
{
  public function checkMatchedRouteName($mvcEvent)
  {
    $routeMatch = $mvcEvent->getRouteMatch() ;
    // pour trouver l'alias de votre contrôleur (celui qui est déclaré dans la route)
    $routeMatch->getParam('controller') ;

    // pour trouver la classe Controller du contrôleur
    // c'est le ControllerManager qui sait à quel alias correspond quelle classe
    // le ServiceManager sait où trouver le ControllerManager
    // l'Application sait où trouver le ServiceManager
    // la classe MvcEvent sait trouver l'Application

    // trouver l'Application
    $application = $mvcEvent->getApplication() ;
    // trouver le ServiceManager
    $serviceManager = $application->getServiceManager() ;
    // trouver le ControllerManager
    $controllerManager = $serviceManager->get('ControllerManager') ;
    // trouver la classe qui correspond à l'alias de contrôleur (aliasDeController)
    get_class($controllerManager->get(aliasDeController)) ;

    // pour trouver l'action
    $routeMatch->getParam('action') ;

    // pour trouver la route
    $routeMatch->getMatchedRouteName() ;

    // pour trouver les autres param
    $routeMatch->getParam('name') ; //(si la route a un paramètre :name)
  }
 
  public function onBootstrap(MvcEvent $e)
  {
    // attacher le callback à l'événement dispatch
    $eventManager = $e->getApplication()->getEventManager() ;
    $eventManager->attach(MvcEvent::EVENT_DISPATCH, array($this, 'checkMatchedRouteName')) ;
  }
}
```

NOTE : la méthode `Module::onBootstrap()` admet TOUJOURS un paramètre de type `MvcEvent`. Vous n'avez pas votre mot à dire et vous n'avez pas le choix. Grâce à cet `MvcEvent`, vous pouvez accéder à votre application et de là, à tous les autres managers : **service manager, module manager, event manager** etc... si nécesssaire.

Si vous attachez un callback à un des événements de l'objet `MvcEvent`, vous aurez toujours un objet de type `MvcEvent` en paramètre de votre callback parce qu'au moment où l'application déclenche son événement, c'est un objet `MvcEvent` qu'elle envoie...

Vous pouvez également récupérer votre objet `routeMatch` dans le contrôleur puisque n'importe quel contrôleur qui hérite de `AbstractActionController` accède à l'objet `MvcEvent` ainsi :

`AbstractActionController::getEvent()`

Ainsi, vous savez comment faire vos routes avec Zend Framework 2. Grâce aux routes, vous pouvez construire votre navigation, faire vos liens (sans avoir à écrire la vraie URL, cela devient bien pratique le jour où vous décidez de changer les URL) dans les vues, faire les redirections dans les contrôleurs et identifiez les routes les unes des autres grâce à l'objet **RouteMatch**.
