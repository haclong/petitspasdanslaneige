---
title: "Utiliser les tags du container pour vérifier l'état d'un ensemble de services."
permalink: "fr/posts/utiliser-les-tags-du-container-pour-verifier-letat-dun-ensemble-de-services.html"
date: "2016-10-19T14:06"
slug: utiliser-les-tags-du-container-pour-verifier-letat-dun-ensemble-de-services
layout: post
drupal_uuid: 196f7f0a-d0ce-4809-b349-fa94e703dfce
drupal_nid: 158
lang: fr
author: haclong

media:
  path: /img/teaser/apprets-3-perles-poupee-russe-matriochka-e-332162-p1160248-d3e57_big.jpg

tags:
  - "symfony"
  - "gestionnaire de service"
  - "interface"
  - "OOP"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Dans mon application, je souhaite vérifier que tous les objets que je stocke en session sont tous correctement initialisés. Si au moins l'un d'entre eux n'est pas initialisé correctement, je dois faire une redirection dans mon controller. Voyons comment je peux m'en sortir avec les tags du container de Symfony."
---

Dans mon application, je souhaite vérifier que tous les objets que je stocke en session sont tous correctement initialisés. Si au moins l'un d'entre eux n'est pas initialisé correctement, je dois faire une redirection dans mon controller. Voyons comment je peux m'en sortir avec les tags du container de Symfony.

Pour une petite application sans ambition, qui tient plus de l'exercice d'école, je stocke des objets en session.

Dans mon controleur, je souhaite vérifier que tous mes objets en session sont correctement initialisés.

## Un objet pour gérer la session

J'ai commencé par monter un objet `MySession` qui me servirait à gérer ma session et tous les objets qui étaient stockés dedans. Il se trouve alors que, durant le développement de l'application, à chaque fois que je déployais un nouvel objet, je devais retoucher à mon objet `MySession`. Ainsi qu'aux tests de associés à `MySession`.

*Cela me pose un problème parce que, pour ce que j'ai compris de l'objet, une évolution dans l'application ne doit pas (ou vraiment de manière minimale) impacter les autres objets. Il n'est pas du tout prévu, dans les principes du développement orienté objet, de revenir modifier de manière constante un objet sous prétexte qu'on lui ajoute des dépendances régulièrement.*

En effet, voici à quoi ressemble `MySession` :

```php
// mySession
class MySession {
  public function __construct(Session $session, ObjetA $dependanceA, ObjetB $dependanceB)
  {
    $this->setObjetA($dependanceA) ;
    $this->setObjetB($dependanceB) ;
    $this->session = $session ;
  }

  public function isReady()
  {
    if(!isnull($this->getObjetA()) &amp;&amp; !isnull($this->getObjetB()))
    {
      return true ;
    }
    return false ;
  }

  public function setObjetA(ObjetA $a)
  {
    $this->session->set('myObjetA', $a) ;
  }
 
  public function getObjetA()
  {
    return $this->session->get('myObjetA') ;
  }

  public function setObjetB(ObjetB $b)
  {
    $this->session->set('myObjetB', $b) ;
  }
 
  public function getObjetB()
  {
    return $this->session->get('myObjetB') ;
  }
}
```

La méthode qui nous intéresse ici est `MySession::isReady()`.

`MySession::isReady` vérifie que les deux dépendances (**objetA** et **objetB**) ne sont pas nulles. Si elles ne sont pas nulles, alors `MySession->isReady` retourne vrai.

Mais si je dois rajouter un 3me objet que je vais stocker dans la session et pour lequel je dois contrôler l'initialisation avant de continuer dans l'exécution de mon application, je serais obligé de

- modifier le constructeur de `MySession` (ajouter une dépendance)
- ajouter le *getter* et *setter* pour la nouvelle dépendance
- modifier `isReady()` en lui ajoutant la nouvelle dépendance dans le test.

Et évidemment, ne pas oublier d'aller modifier le fichier de configuration du gestionnaire de services.

Et modifier les tests de `MySession`.

Ce n'est pas très efficace et définitivement pas propre du tout.

J'ai alors pensé à une autre méthode qui se base sur les principes de *Single Responsability* du développement orienté objet.

## Un objet responsable par objet en session.

Afin de gérer chaque objet en session, je crée un objet qui va faire la gestion de cet objet en session.

```php
class ObjetASession {
  public function __construct(Session $session, ObjetA $dependanceA)
  {
    $this->session = $session ;
    $this->setObjetA($dependanceA) ;
  }

  public function isReady()
  {
    if(!isnull($this->getObjetA()))
    {
      return true ;
    }
    return false ;
  }
 
  public function setObjetA(ObjetA $a)
  {
    $this->session->set('myObjetA', $a) ;
  }
 
  public function getObjetA()
  {
    return $this->session->get('myObjetA') ;
  }
}
```

Ainsi, chaque classe `ObjetXSession` gère ses propres *setter* et *getter* et vérifie si l'objet X est bien stocké en session ou pas.

A chaque nouvelle classe à stocker en session, on ne touche plus aux objets `ObjetXSession` existant mais on crée un nouvel objet `ObjetXSession` dédié à notre nouvelle classe.

Dans mon contrôleur, il faudrait appeler chaque objet `ObjetXSession` et vérifier pour chacun que l'objet est initialisé.

```php
class Controller {
  public function action() {
    if($objetASession->isReady() &amp;&amp; $objetBSession->isReady() &amp;&amp; $objetCSession->isReady()...)
    {
      // exécuter ce qu'il faut puisque tout les objets sont bien initialisés
    } else
    {
      // rediriger vers une page pour initialiser les objets
    }
  }
}
```

Allons bon, voila que je n'ai fait que déplacer le problème :

- On s'est (presque) débarrassé des problèmes de dépendance : Les contrôleurs de Symfony accèdent toujours au container, le service manager. ATTENTION : chez Zend Framework, le service manager n'est plus disponible dans les contrôleurs. Il faut des fabriques pour injecter les dépendances dans les contrôleurs de Zend Franemwork (à partir du 3), qu'on se le tienne pour dit.
- Mais chaque fois qu'on rajoute un nouvel objet à vérifier, il faut penser à l'ajouter dans le test de chaque contrôleur...

On peut tout redéplacer dans un objet fédérateur, genre façade : revoila notre objet `MySession` mais drôlement plus allégé :

```php
class MySession
{
  public function __construct(Session $session, ObjetASession $aSession, ObjetBSession $bSession)
  {
    $this->session = $session ;
    $this->ASession = $aSession ;
    $this->BSession = $bSession ;
  }

  public function isReady()
  {
    if($objetASession->isReady() &amp;&amp; $objetBSession->isReady())
    {
      return true ;
    }
    return false ;
  }
}
```

Dans le contrôleur, il ne restera plus qu'à tester `$mySession->isReady() ;`

Si on a réussit à se débarrasser des *getter* et *setter* (qui ont tous été déplacés dans les objets `ObjetXSession` qui vont bien), on a toujours un problème pour déclarer toutes nos dépendances dans le constructeur de `MySession`

## Utiliser une collection d'objets

*Actuellement, en PHP, il n'y a pas véritablement de type 'collection'. Au mieux, c'est juste un tableau d'objets. J'utilise le terme 'collection' ici juste pour clarifier mon propos, mais ne cherchez pas un type 'collection' comme on peut en trouver dans les autres langages.*

Afin de limiter les modifications et manipulations sur notre objet `MySession` (avoir à modifier son constructeur (et le test de la méthode `isReady()`) à chaque fois qu'il y a un nouvel objet à vérifier, on peut faire un réarrangement en créant une collection `SessionContentCollection` qui contiendra l'ensemble des objets à vérifier.

**Deux avantages :**

- on va arrêter de modifier SYSTEMATIQUEMENT le constructeur de l'objet `MySession`.
- pour le test, on va pouvoir faire une boucle et tester automatiquement le statut de tous les objets à vérifier.

Là, je sens qu'on a atteint un véritable progrès.

Voici notre objet `SessionContentCollection`.

```php
class SessionContentCollection
{
  public $contents = [] ;
  public function __construct(ObjetASession $aSession, ObjetBSession $bSession)
  {
    $this->addContent($aSession) ;
    $this->addContent($bSession) ;
  }

  protected function addContent($content)
  {
    $this->contents[] = $content ;
  }
}
```

Et voici ce que devient notre objet `MySession`

```php
class MySession
{
  public function __construct(Session $session, SessionContentCollection $collection)
  {
    $this->session = $session ;
    $this->contents = $collection ;
  }

  public function isReady()
  {
    foreach($this->contents as $content)
    {
      if(!$content->isReady())
      {
        return false ;
      }
    }
    return true ;
  }
}
```

Et voila

Notre objet `MySession</code>` est propre et ne sera plus dérangé chaque fois qu'on veut tester l'état d'un objet dans la session. C'est l'objet `SessionContentCollection` qui sera dérangé à chaque fois.

Même si on n'a fait - encore une fois - que déplacer le problème un peu ailleurs à chaque fois, on pourrait s'arrêter là. Après tout, sur un principe de* Single Responsability*, notre classe `SessionContentCollection` n'a qu'une et une seule responsabilité : maintenir la liste des objets concerné par la validation en session. La session (`MySession` et les `ObjetXSession` gèrent quant à eux la session en elle-même)

Mais notre secrète ambition, c'est que l'objet `SessionContentCollection` puisse être alimenté automatiquement. C'est ça qui serait super classe...

Et pour faire cela, Symfony a exactement le mécanisme qui va bien. Le gestionnaire de services de Symfony peut travailler avec des <a href="http://symfony.com/doc/current/service_container/tags.html" target="_blank">tags</a>. On peut identifier facilement et rapidement tous les services déclarés dans le gestionnaire de services qui partagent le même tag. Une fois que les objets sont tous identifiés, on peut leur faire faire ce qu'on veut... comme par exemple s'ajouter d'eux même sur une collection d'objet comme `SessionContentCollection`.

Voyons le gestionnaire de service :

```yml
// service.yml

services:
  sessionCollection:
    class: AppBundle\SessionContentCollection

  objetASession:
    class: AppBundle\ObjetASession
    tags:
      - {name: session.to.verify}
  
  objetBSession:
    class: AppBundle\ObjetBSession
    tags:
      - {name: session.to.verify}
```

Ainsi, tous nos services `objetXSession` portent le même tag '*session.to.verify*'. Le nom est complètement aléatoire et vous pouvez choisir le vôtre.

Maintenant, on va vouloir que tous les services qui portent le tag '*session.to.verify*' viennent se mettre dans le tableau `$contents` de notre objet `SessionContentCollection`.

Il faut pour cela créer ce que Symfony appelle un *CompilerPass*

```php
namespace AppBundle;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class SessionCollectionPass implements CompilerPassInterface
{
  public function process(ContainerBuilder $container)
  {
    // comme on veut que tous les services qui portent le même tag
    // alimentent un même objet collection sessionCollection
    // il faut s'assurer que l'objet collection est bien déclaré dans le gestionnaire de service
    if (!$container->has('sessionCollection')) {
      return;
    }

    // on récupère le service collection
    $definition = $container->findDefinition('sessionCollection');

    // on identifie tous les services qui portent le tag qui nous intéresse dans notre cas
    $taggedServices = $container->findTaggedServiceIds('session.to.verify');

    // c'est là que la magie opère :
    // on boucle sur tous les services qui portent le même tag
    // on dit quoi faire : ici, on veut que le service qui porte le tag s'ajoute dans la collection sessionContent
    foreach ($taggedServices as $id => $tags) {
      $definition->addMethodCall('addContent', array(new Reference($id)));
    }
  }
}
```

Enfin, il faut que notre `SessionCollectionPass` soit enregistré dans le gestionnaire de service afin qu'il soit exécuté.

```php
// src/AppBundle/AppBundle.php

use Symfony\Component\DependencyInjection\ContainerBuilder;
//...

class AppBundle extends Bundle
{
  public function build(ContainerBuilder $container)
  {
    $container->addCompilerPass(new SessionCollectionPass());
  }
}
```

Et voila !!

Maintenant que `SessionContentCollection` va être alimenté dynamiquement, on n'a plus besoin de son constructeur

```php
class SessionContentCollection
{
  public $contents = [] ;
  
  protected function addContent($content)
  {
    $this->contents[] = $content ;
  }
}
```

Tout ce qu'il vous reste à faire si vous souhaitez ajouter un nouvel objet qui doit être initialisé avant l'exécution de votre application, il faut penser à tagger le service dans le gestionnaire de service.

## Le ++

Rappelons nous de notre classe `MySession` :

```php
class MySession
{
  public function __construct(Session $session, SessionContentCollection $collection)
  {
    $this->session = $session ;
    $this->contents = $collection ;
  }

  public function isReady()
  {
    foreach($this->contents as $content)
    {
      if(!$content->isReady())
      {
        return false ;
      }
    }
    return true ;
  }
}
```

Pour que ce code fonctionne correctement, il est évident que tous les objets qui sont dans la collection `SessionContentCollection` doivent obligatoirement implémenter la méthode `isReady`.

Du coup, un petit coup d'interface pour sécuriser tout ça...

Créer une interface `IsReadyInterface`

```php
interface IsReadyInterface {
  public function isReady() ;
}
```

Toutes nos classes `ObjetASession`, `ObjetBSession` etc... implémentent notre interface `IsReadyInterface`

Et notre classe `SessionContentCollection` va vérifier que l'objet que le `SessionCollectionPass` veut lui assigner implémente bien une interface `IsReadyInterface`

```php
class SessionContent
{
  public $contents = [] ;
  
  protected function addContent(IsReadyInterface $content)
  {
    $this->contents[] = $content ;
  }
}
```
Et voila. Finalement.

Net, propre et sans bavure :) Enjoy !
