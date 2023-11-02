---
title: "Implémenter une navigation dans une application ZF2 avec des modules"
permalink: "fr/posts/implementer-une-navigation-dans-une-application-zf2-avec-des-modules.html"
date: "2014-06-22T14:22"
slug: implementer-une-navigation-dans-une-application-zf2-avec-des-modules
layout: post
drupal_uuid: 3e2a9256-f9f1-4692-9a8d-29395a62500a
drupal_nid: 75
lang: fr
author: haclong

media:
  path: /img/teaser/ZendFramework.png
  credit: "zend framework"

tags:
  - "ZF2"
  - "Zend Framework"
  - "MVC"
  - "Zend Navigation"

sites:
  - "Développement"
  - "Haclong projects"
  - "Footprints in the snow"

summary: "Développer une application avec des modules a des avantages certains : séparation des éléments, diminution des dépendances... On ne va pas refaire l'histoire. Mais on ne peut pas nier qu'il y a des éléments dans un site web, qui sont cross-modules. La navigation est l'un de ces éléments. Chaque élément d'un menu correspond forcément à un module différent. Alors comment implémenter cette particularité ?"
---

Développer une application avec des modules a des avantages certains : séparation des éléments, diminution des dépendances... On ne va pas refaire l'histoire. Mais on ne peut pas nier qu'il y a des éléments dans un site web, qui sont cross-modules. La navigation est l'un de ces éléments. Chaque élément d'un menu correspond forcément à un module différent. Alors comment implémenter cette particularité ?

### Prérequis

- Vous avez installé le Zend Skeletton Application
- Vous savez - a peu près - ce qu'est une route dans une application ZF2
- Vous avez codé le module Album tel que présenté dans le tutorial Getting Started de la documentation de ZF2.

Après avoir installé le squelette d'application, vous avez commencé à enquiller sur les modules, les uns après les autres. Dans `module/Application/view/layout/layout.phtml`, a chaque nouveau module, vous avez édité le template et vous avez ajouté un nouveau lien dans le menu.

Mais voila, au fil du développement, vous avez retiré des modules, peut être parce qu'ils n'étaient pas utiles ou parce que vous avez une régression et que vous essayez de repartir de zéro pour voir à quel moment votre application se crashe... Si vous retirez des modules, vous avez obligatoirement une erreur qui va venir du renderer qui va vous signaler qu'une route n'existe pas. Il faut rééditer `layout.phtml` et retirer des entrées de menu.

Et quand vous aurez trouvé la faille, il va également falloir rééditer `layout.phtml` et cette fois ci, réactiver votre entrée de menu : soit en la réécrivant, soit en la décommantant... Tout ceci est bien fastidieux, si vous ajoutez à cela que pour activer / désactiver un module, vous devez obligatoirement éditer le fichier `config/application.config.php`. Voici beaucoup de manipulation pour activer / désactiver un module.

Heureusement, le composant `Zend\Navigation` va nous aider à faire ça "tout seul".

### Le composant Zend\Navigation

Toute la <a href="http://framework.zend.com/manual/2.3/en/modules/zend.navigation.intro.html" target="_blank">documentation du composant</a> se trouve sur le site de Zend Framework. Le principe est le même que dans Zend Framework 1 : on définit un **conteneur** qui contient soit des **pages**, soit des **conteneurs** qui contiennent à leur tour soit des **pages** soit des **conteneurs** etc... L'arborescence conteneurs/pages va reproduire la hiérarchie de votre site. Aussi simplement que ça.

### Définir les routes

Si vous avez suivi le tutorial <a href="http://framework.zend.com/manual/2.3/en/user-guide/overview.html" target="_blank">Getting Started</a> de la documentation de ZF2, vous savez qu'il faut définir les routes de votre module. Il est important de noter que chaque module a sa ou ses route(s). Pas question, par paresse ou pour toutes autres raisons, de définir toutes vos routes dans le module **Application** par ex, sous prétexte qu'il est toujours là... De toutes façons, normalement, ça ne devrait que vous compliquer la tâche puisque les controllers invoqués ne sont pas toujours présent en fonction de l'activation/désactivation des modules.

### Définir l'arborescence des pages

Le moyen le plus simple pour utiliser `Zend\Navigation` : il suffit de rajouter une clé *navigation* dans la configuration de votre module.

```php
//module/Album/config/module.config.php

<?php
return array(
  // la liste de vos controllers
  'controllers' => array(
    'invokables' => array(
      'Album\Controller\Album' => 'Album\Controller\AlbumController',
    ),
  ),

  // définition de la route
  'router' => array(
    'routes' => array(
      // nom de la route
      'album' => array(
        'type' => 'segment',
        'options' => array(
          'route' => '/album[/][:action][/:id]',
          'constraints' => array(
            'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
            'id' => '[0-9]+',
          ),
          'defaults' => array(
            'controller' => 'Album\Controller\Album',
            'action' => 'index',
          ),
        ),
      ),
    ),
  ),

  // la configuration pour le manager de vue
  'view_manager' => array(
    'template_path_stack' => array(
      'album' => __DIR__ . '/../view',
    ),
  ),

  // ajouter cette clé.
  'navigation' => array(
    // c'est 'default' par défaut... si vous souhaitez mettre autre chose, il faudra étendre le service Zend\Navigation\Service\DefaultNavigationFactory qui existe par défaut dans la librairie ZF2.
    'default' => array(
      // ce tableau correspond à une de vos pages (ou à un de vos conteneurs)
      array(
        'label' => 'Mes Albums', // le texte qui va apparaitre dans le menu
        'route' => 'album', // le nom de la route que vous avez défini plus haut. Si votre entrée de menu n'est pas une de vos pages mais un lien vers une page externe, évidemment, il ne faut pas utiliser 'route'
        'order' => 100, // la priorité de entrée de menu
      ),
    ),
  ),
);
```

Et voila, vous avez une entrée de menu (mais pas de menu sur le site, pas encore).

N’oublions surtout pas de déclarer le **Service Navigation** afin que notre clé *navigation* soit exploitée.

### Charger un service pour Zend\Navigation

Tout d’abord, il faut dire à l’application qu’on va travailler avec une instance de `Zend\Navigation`. Jusqu’à nouvel ordre, on ne devrait pas avoir besoin de truc bien complexe pour ça.

Arbitrairement, je choisis de déclarer mon service dans le module **Application**, justement - cette fois ci - parce qu'il est là tout le temps.

```php
//module/Application/config/module.config.php

return array(
  // ajouter une clé 'service_manager' si elle n'y est pas encore (elle devrait être là)
  'service_manager' => array(
    // ajouter la clé 'factories' si elle n'y est pas encore (elle devrait y être)
    'factories' => array(
      // factories diverses …
      // ajouter le service 'navigation'
      // DefaultNavigationFactory est la factory par défaut pour Zend\Navigation.
      // Si vous souhaitez avoir votre propre factory, il faut étendre cette classe.
      'navigation' => 'Zend\Navigation\Service\DefaultNavigationFactory',
    ),
  ),
);
```

Maintenant, allons afficher tout ça.

En principe, si vous avez suivi le tutoriel Getting Started avec le module **Album**, vous devriez avoir ce type de code dans le template du layout :

```php
//module/Application/view/layout/layout.phtml

<div class="nav-collapse collapse">
  <ul class="nav">
    <li><a href="<?php echo $this->url('home') ?>"><?php echo $this->translate('Home') ?></a></li>
    <li><a href="<?php echo $this->url('album') ?>"><?php echo $this->translate('Album') ?></a></li>
  </ul>
</div><!--/.nav-collapse -->
```

Remplacez le par ce code :

```php
//module/Application/view/layout/layout.phtml

<div class="collapse nav-collapse">
  <?php echo $this->navigation('navigation')->menu()->setUlClass('nav navbar-nav')->setMaxDepth(0) ;?>
</div><!--/.nav-collapse -->
```

Et Tadaaaa... Ah non, il nous manque le bouton **Accueil**... Et pourquoi il nous manque le bouton Accueil, parce que sot comme on est, on a oublié d'aller définir notre entrée de menu dans le module **Application**.

```php
//module/Application/config/module.config.php

<?php
return array(
  // ajouter la clé navigation en bas du fichier de configuration (comme pour le module Album)
  'navigation' => array(
    'default' => array(
      array(
        'label' => 'Home',
        'route' => 'home',
      ),
    ),
  ),
);
```

Comme on peut le voir, les clés *navigation* et *default* sont les mêmes dans le module **Application** et dans le module **Album**.

Voyons voir notre site. Lancer le site dans le navigateur. Tadaaaaa. Vous avez dans le menu un bouton "Accueil" et un bouton "Mes Albums". Maintenant, si vous allez dans `config/application.config.php` et que vous désactivez votre module **Album**, de retour sur votre site, le bouton "Mes Albums" aura disparu gentimment... Plus besoin d'aller éditer d'autres fichiers...

<cite>SCOOP !! Alors que j'écris ce post, je m'aperçois que le menu généré automatiquement par Zend\Navigation est multilingue (à condition d'avoir traduits toutes les entrées... je ne sais pas comment ça marche mais ça marche, j'explorerais cet aspect plus tard).</cite>

**Edit** : Effectivement : <a href="http://framework.zend.com/manual/2.3/en/modules/zend.navigation.view.helpers.html" target="_blank">ici</a>, les aides de vues (**View Helper**) intègrent toutes des fonctionnalités ACL et des fonctionnalités Translation. Voir les méthodes `getTranslator()`, `setTranslator()`, `getUseTranslator()` et `setUseTranslator()`... Le squelette d’application ZF2 implémente un objet `Translator` dès le lancement de l’application.

```php
//module/Application/config/module.config.php

  'service_manager' => array(
    'factories' => array(
      'translator' => 'Zend\I18n\Translator\TranslatorServiceFactory',
    ),
  ),
  'translator' => array(
    'locale' => 'fr_FR',
    'translation_file_patterns' => array(
      array(
        'type' => 'gettext',
        'base_dir' => __DIR__ . '/../language',
        'pattern' => '%s.mo',
      ),
    ),
  ),
```

### La navigation avec Zend Framework

En fait, les débutants confondent très souvent le composant `Zend\Navigation` et le résultat qu’ils souhaitent obtenir. En effet, ZF2 (comme ZF1) sépare les données (le modèle) du rendu (la ou les vues) :

- `Zend\Navigation` construit une hiérarchie de pages : on ne fait que définir notre arborescence de page mais on ne peut pas la voir...
- Ensuite, dans un second temps, une fois (ou pendant) que nous montons l’arborescence des pages, ZF met à disposition des aides de vues qui vont exploiter cette arborescence de pages et qui feront les affichages comme on le souhaite :
- le petit poucet / fil d’ariane / breadcrumbs
- le ou les menus
- le plan du site

### Commençons par Zend\Navigation

<a href="http://framework.zend.com/manual/2.3/en/modules/zend.navigation.pages.html" target="_blank">La documentation</a> de `Zend\Navigation` est assez claire et je n’ai pas eu besoin de trop chercher pour le faire fonctionner.

`Zend\Navigation` définit deux types de pages :

- Les pages de notre application, généralement définies par les éléments suivants : action / controller ou route avec ou sans les paramètres supplémentaires. Ce sont les pages de type **MVC**
- Les pages hors de l'application, généralement définies par une adresse. Ce sont les pages de type **URI**

Dans une utilisation de base, vous aurez besoin des clés suivantes :

- **label** : pour donner un libellé à votre lien (ce qui s’affiche sur le site)
- **active** : cette option va être utile pour “marquer” visuellement le bouton de menu de la page active
- **privilege** : les autorisations d’accès (voir la doc)
- **visible** : il arrive parfois qu’on ne souhaite pas qu’un menu apparaisse sur le site (par exemple, on peut avoir une hiérarchie avec un niveau qui dit : menu principal / menu sidebar / menu footer : clairement, vous ne souhaitez pas que ces trois entrées de menu apparaissent à l’écran mais c’est plutôt une méthode pour séparer les sujets) : utiliser l’option ‘visible’
- **order** : expérimentez avec pour réorganiser votre menu
- **pages** : les pages enfant dans votre hiérarchie de pages

Pour des pages de type **MVC**, ajoutez les options suivantes :

- **route** : le nom de la route dans votre application
- **controller** : le controller de l’application... depuis ZF2, avec l’intervention du **Service Manager**, je ne sais pas encore quelles sont les astuces pour invoquer le controller à partir de `Zend\Navigation`
- **action** : l’action - ici, c’est comme pour ZF1, on saisit juste le nom de l’action sans la partie “Action”
- **params** : les autres paramètres éventuellement tels que définis dans votre route.

Pour les pages de type **URI**, ajoutez l’option suivante :

- **uri** : l’URL de la page que vous souhaitez ajouter

`Zend\Navigation` définit également des conteneurs mais pour une utilisation basique, ne retenez que la partie sur les pages. Sinon, référez vous à la <a href="http://framework.zend.com/manual/2.3/en/modules/zend.navigation.containers.html" target="_blank">documentation officielle</a>.

Au delà des deux types de pages définis par `Zend\Navigation`, vous êtes évidemment libre d’étendre la fonctionnalité et de créer vos propres types de page... Perso, je ne vois pas encore à quelle occasion j’aurais besoin de cette fonctionnalité... Peut-etre si je veux gérer un système d’autorisation d’accès complexe... à voir...

### Pour le rendu

La <a href="http://framework.zend.com/manual/2.3/en/modules/zend.navigation.view.helpers.html" target="_blank">documentation est ici</a> et elle est assez bien documentée en exemple. En tatonnant, on arrive assez facilement au résultat qu’on souhaite obtenir.

Si en revanche vous souhaitez des rendus de types menus déroulants, je suppose qu’il faut voir soit avec les classes de Twitter Bootstrap (installé par défaut avec le squelette d’application), soit avec un autre framework javascript.
