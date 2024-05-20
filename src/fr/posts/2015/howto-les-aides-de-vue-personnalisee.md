---
title: "HOWTO Les aides de vue personnalisée"
permalink: "fr/posts/howto-les-aides-de-vue-personnalisee.html"
date: "2015-06-23T08:06"
slug: howto-les-aides-de-vue-personnalisee
layout: post
drupal_uuid: f8313ea1-14c5-4fc9-a91e-5d957257c12f
drupal_nid: 136
lang: fr
author: haclong

media:
  path: /img/teaser/lock-clock-widget-cm.jpg

tags:
  - "zend framework 2"
  - "POO"
  - "aide de vue"
  - "HOWTO"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Une aide de vue, c'est un moyen de rajouter un plugin dans vos vues (soit partout, soit dans une vue particulière) : un encart, un sous-menu, une liste des derniers commentaires etc..."
---

Très rapidement, je vous monte un petit guide pour ajouter une aide de vue.

Une aide de vue, c'est un moyen de rajouter un plugin dans vos vues (soit partout, soit dans une vue particulière) : un encart, un sous-menu, une liste des derniers commentaires etc...

## Pourquoi faire une aide de vue ?

- Parce que vous allez vous retrouver à reformater toujours la même donnée plusieurs fois dans le site.
- Parce que vous voulez que le contenu de votre site soit composite : la page principale et les marges sur les deux côtés avec différentes informations dedans.
- Parce que même si l'encart apparaît sur toutes les pages du site, le contenu de l'encart ne concerne qu'un seul module. Il vous semble donc plus judicieux de créer une aide de vue dédiée qui peut être facilement retirée si vous changez de module.

Pour créer une aide de vue, vous allez avoir besoin **d'un objet** (l'aide de vue), et **d'un template** (la vue). Vous ne pourrez utiliser les aides des vues que dans les fichiers de vues (tels que les fichiers phtml (pour une application **Zend Framework 2** standard par exemple).

Il y a plusieurs façons de faire une aide de vue : soit votre aide de vue est - disons le simplement - juste une fonction pour formater de la donnée, alors tout ce que vous attendez d'elle, c'est d'afficher une chaîne de caractères, soit l'aide de vue est plus complexe et affiche un peu de code HTML, soit l'aide de vue interagit fortement avec votre modèle de données et affiche dans un fragment de code HTML des informations de votre système.

## Afficher une chaîne de caractères

Votre aide de vue retourne une chaîne de caractères, de préférence recalculée ou reformatée. Vous allez l'utiliser pour afficher une date par ex, ou une conversion d'un montant à un autre, ou bien afficher la température...

Dans ce cas, vous saurez comment créer une aide de vue et somme toute, passer un argument à votre aide de vue se fait aussi facilement qu'avec une simple fonction, du temps de notre bon vieux PHP.

Voici l'aide de vue :

```php
// module/MonModule/src/MonModule/View/Helper/Temperature.php

<?php
namespace MonModule\View\Helper;

use Zend\View\Helper\AbstractHelper ;

class Temperature extends AbstractHelper
{
  public function __invoke($temperature, $locale = null)
  {
    // pseudo code
    if($locale->useFahrenheit == true)
    {
      return $this->convertToFahrenheit($temperature) . ' °F' ;
    }
    return $temperature . ' °C' ;
  }
}
```

Pour inscrire notre aide de vue dans le gestionnaire d'aides de vue :

Soit dans la classe Module du module

```php
// module/MonModule/Module.php

<?
class Module
{
  public function getViewHelperConfig()
  {
    return array(
      'invokables' => array(
        'afficheTemperature' => 'MonModule\View\Helper\Temperature',
      ),
    ) ;
  }
}
```

Soit dans le tableau de configuration

```php
// module/MonModule/config/module.config.php

<?php
return array(
  'view_helpers' => array(
    'invokables' => array(
      'afficheTemperature' => 'MonModule\View\Helper\Temperature',
    ),
  ),
) ;
```

Et pour utiliser l'aide à partir de n'importe lequel des fichiers phtml de votre application Zend Framework 2.

```php
// module/MonAutreModule/view/mon-autre-module/index/index.phtml

<div>
Il fait <?php echo $this->afficheTemperature(18, 'fr_FR') ; ?>.
</div>
```

## Préparer une chaîne de caractère avec une présentation dédiée.

Cela peut être le cas pour un plugin, un menu dans le site. Vous allez l'utiliser pour afficher un menu pour les utilisateurs qui sont connectés afin qu'ils accèdent à des pages dédiées de leur compte.

Dans ce cas, contrairement au cas précédent, vous préparez un bloc intégral d'informations en HTML (une vue) que vous insérerez dans les autres vues de votre application Zend Framework 2. Dans la mesure où la vue que vous allez préparer EST une vue, vous pouvez utilisez d'autres aides de vue (dont les aides de vue mise à disposition par Zend Framework 2) pour générer de l'intéraction / du dynamisme.

Voyons d'abord l'objet aide de vue :

```php
// module/MonModule/src/MonModule/View/Helper/UserMenu.php

<?php
namespace MonModule\View\Helper;

use Zend\View\Helper\AbstractHelper ;

class UserMenu extends AbstractHelper
{
  public function __invoke()
  {
    return $this->getView()->render('mon-module/plugin/user') ;
  }
}
```

Comme on peut le constater, l'aide appelle juste une vue.

Voyons donc cette vue :

```html
// module/MonModule/view/mon-module/plugin/user.phtml

<!-- $this->identity() est une aide de vue qui existe déjà dans la librairie Zend Framework 2. 
     On ne va pas se priver de l'utiliser dans notre cas. -->

<?php if ($this->identity()) : ?>

  <div>Bonjour <?php echo $this->identity() ?></div>
  
  <ul>
    <li>Réinitialiser le mot de passe</li>
    <li>Voir mon compte</li>
    <li>Se déconnecter</li>
  </ul>

<?php else: ?>

  Vous n'êtes pas loggé. Merci de vous logger d'abord.

<?php endif; ?>
```

Comme on peut le voir, tout se passe dans le template (merci à l'aide `$this->identity()` qui existe déjà). Pour utiliser l'aide de vue `$this->identity()`, je vous invite à voir <a href="http://framework.zend.com/manual/current/en/modules/zend.view.helpers.identity.html" target="_blank">sa documentation</a>.

Allons maintenant déclarer notre aide dans le gestionnaire d'aides de vue

Soit dans la classe Module du module

```php
// module/MonModule/Module.php

<?
class Module
{
  public function getViewHelperConfig()
  {
    return array(
      'invokables' => array(
        'insereMenuUser' => 'MonModule\View\Helper\UserMenu',
      ),
    ) ;
  }
}
```

Soit dans le tableau de configuration

```php
// module/MonModule/config/module.config.php
<?php
return array(
  'view_helpers' => array(
    'invokables' => array(
      'insereMenuUser' => 'MonModule\View\Helper\UserMenu',
    ),
  ),
) ;
```

Et pour utiliser notre aide de vue.

On pourrait par exemple l'utiliser dans le fichier layout.phtml puisque, très probablement, on va souhaiter que ce menu s'affiche sur toutes les pages, par exemple, juste en dessous du contenu.

```php
// module/Application/view/layout/layout.phtml

<div class="container">
  <?php echo $this->content; ?>
  <?php echo $this->insereMenuUser() ; ?>
</div> <!-- /container -->
```

On note que cette aide de vue n'admet aucun argument mais utilise d'autres aides de vue (`$this->identity()`) pour changer son affichage.

## Gérer les dépendances dans les aides de vue.

Cela peut être le cas pour un bloc qui affiche les dernières infos de votre site, ou bien les derniers commentaires. Typiquement, pour ce type de bloc, vous allez vouloir accéder à votre modèle afin d'en extraire les données.

```php
// module/MonModule/src/MonModule/View/Helper/LastNews.php

<?php
namespace MonModule\View\Helper;

use Zend\View\Helper\AbstractHelper ;

class LastNews extends AbstractHelper
{
  protected $lastNews ;

  public function __construct($newsCollection)
  {
    $this->lastNews = $newsCollection ;
  }
 
  public function __invoke()
  {
    $news = $this->lastNews->fetchRecent(10) ;
    return $this->getView()->partial('mon-module/plugin/news', array('lastNews' => $news)) ;
  }
}
```

Allons maintenant déclarer notre aide dans le gestionnaire d'aides de vue. Puisqu'il y a des dépendances, il faut obligatoirement passer par une fabrique (*factory*).

Soit dans la classe `Module` du module

```php
// module/MonModule/Module.php

<?
class Module
{
  public function getViewHelperConfig()
  {
    return array(
      'factories' => array(
        'listeDernieresInfos' => function($sm) {
          $news = $sm->getServiceLocator()->get('Path\To\Model\News') ;
          return new MonModule\View\Helper\LastNews($news) ;
        }
      ),
    ) ;
  }
}
```

Soit dans le tableau de configuration. *A vérifier. J'ai lu quelque part que la fabrique passait mal si on l'écrivait directement dans le fichier de configuration.*

```php
// module/MonModule/config/module.config.php
<?php
return array(
  'view_helpers' => array(
    'factories' => array(
      'listeDernieresInfos' => function($sm) {
        $news = $sm->getServiceLocator()->get('Path\To\Model\News') ;
        return new MonModule\View\Helper\LastNews($news) ;
      }
    ),
  ),
) ;
```

L'autre alternative est de créer une classe de fabrique.

```php
// module/MonModule/config/module.config.php
<?php
return array(
  'view_helpers' => array(
    'factories' => array(
      'listeDernieresInfos' => new MonModule\Factory\LastNewsViewHelperFactory ;
    ),
  ),
) ;
```

et de mettre le code de la fabrique dans la classe `LastNewsViewHelperFactory` dedans.

```php
// module/MonModule/src/MonModule/Factory/LastNewsViewHelperFactory

<?php
namespace MonModule\Factory ;

use Zend\ServiceManager\FactoryInterface ;
use Zend\ServiceManager\ServiceLocatorInterface ;

class LastNewsViewHelperFactory implements FactoryInterface
{
  public function createService(ServiceLocatorInterface $serviceLocator)
  {
    $news = $serviceLocator->getServiceLocator()->get('Path\To\Model\News') ;
    return new LastNewsViewHelper($news) ;
  }
}
```

Préparer le template :

```html
// module/MonModule/view/mon-module/plugin/news.phtml

<ul>
  <?php foreach ($this->lastNews as $key => $val): ?>
    <li><?php echo ($val['news']) ?></li>
  <?php endforeach ; ?>
</ul>
```

Et utiliser notre aide de vue à partir de n'importe quel template au choix, dans une colonne, par ex.

```html
// module/MonModule/view/mon-module/index/index.phtml

<?php echo $this->listeDernieresInfos() ?>
```

Voilà. Avec ce dernier exemple, vous savez faire venir une ou plusieurs dépendances dans votre objet aide de vue. Renseignez vous sur les différentes méthodes pour injecter les dépendances éventuellement.

Il me semble que j'ai tous les cas de figure basiques. A partir de là, je vous laisse composer et imaginer des aides de vues de plus en plus complexes et intéressantes, bien sûr.

Vous trouverez le code des exemples sur <a href="https://github.com/haclong/viewHelper">mon **github**</a>.

Concernant l'aide de vue des dernières infos, je suis allée un peu plus loin. Dans cet article, la dépendance est l'objet qui se connecte sur la base de données, d'où la ligne `$news = $this->lastNews->fetchRecent(10) ;` dans l'objet `MonModule\View\Helper\LastNews`. Sur mon github, c'est un objet **NewsService** qui retourne le résultat de la requête à la base de données. Les deux versions sont justes, bien entendu. A vous de choisir sur les niveaux d'objets à mettre en place.
