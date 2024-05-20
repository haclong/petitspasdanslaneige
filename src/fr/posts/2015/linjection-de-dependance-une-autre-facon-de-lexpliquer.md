---
title: "L'injection de dépendance, une autre façon de l'expliquer"
permalink: "fr/posts/linjection-de-dependance-une-autre-facon-de-lexpliquer.html"
date: "2015-05-19T12:41"
slug: linjection-de-dependance-une-autre-facon-de-lexpliquer
layout: post
drupal_uuid: c9a91db8-184d-43f3-adb4-0cc7b08c0d63
drupal_nid: 133
lang: zxx
author: haclong

media:
  path: /img/teaser/b17a8ea53cf35133ff578301dcf9149514b52e94.jpg

tags:
  - "code"
  - "injection de dépendance"
  - "gestionnaire de service"

sites:
  - "Développement"

summary: "Bon, j'ai du déjà faire cet exercice. Je le referrais encore probablement. Mais je vous (re) présente une explication sur l'injection de dépendance : en quoi c'est utile, pourquoi la faire."
---

Bon, j'ai du déjà faire cet exercice. Je le referrais encore probablement. Mais je vous (re) présente une explication sur l'injection de dépendance : en quoi c'est utile, pourquoi la faire.

## Injection de dépendance

Tout part d'une volonté initiale de limiter les dépendances entre nos objets et, si on étend cette logique, on veut également limiter la dépendance entre nos différents modules. Afin de limiter les dépendances d'une classe à l'autre, il ne faut pas qu'une classe qui a besoin d'une autre classe l'appelle par son nom.
Dans la vraie vie, c'est le même principe. Que faites vous si vous voulez consommer du pain ?

```php
classe Moi
{
  function JeVeuxDuPain()
  {
    $boulangerie = new BoulangerieDeMonQuartier() ;
    $pain = $boulangerie->fournitLePain() ;
  }
}
```

Vous voulez du pain, vous vous adressez à la boulangerie de votre quartier qui va vous fournir du pain.

Mais que se passe-t-il en Août quand la boulangerie est fermée ? ou quand vous êtes en vacances loin de chez vous ? Que devient la classe `Moi` ?

Forcément, vous allez avoir une erreur : la classe `BoulangerieDeMonQuartier()` n'est pas disponible. Vous serez obligé de mettre à jour votre classe `Moi` comme ceci :

```php
classe Moi (mise à jour)
{
  function JeVeuxDuPain()
  {
    $boulangerie = new BoulangerieDuLieuDeMesVacances() ;
    $pain = $boulangerie->fournitLePain() ;
  }
}
```

Je ne vous parle même pas de l'aberration de faire une classe `Moi2`...

Et à votre retour de vacances, il va falloir remettre les choses d'aplomb en réutilisant votre bonne vieille classe `BoulangerieDeMonQuartier()`.

Ce problème peut semble minime exprimé ici mais imaginez le démultiplié à l'échelle d'une application : votre pain, un marteau, vos courses, le boucher, les fruits et légumes, le plombier, les assurances... Ce problème est ce qu'on appelle un problème de dépendance fortes entre les différentes classes de votre application.

Pour limiter les problèmes de dépendances entre les classes de votre application, on est arrivé à la conclusion que les instanciations de classes devaient se situer à l'extérieur de votre classe.

Dans la vraie vie, c'est ce que vous faites quand vous dites :

- J'ai repéré le boulanger (celui qui fournit le pain)
- J'ai repéré la quincaillerie (celui qui fournit le marteau)
- J'ai repéré le boucher (celui qui fournit la viande)
- etc...

Et quand vous voulez consommer du pain, voici ce que vous faites maintenant :

```php
classe Moi (avec peu de dépendance)
{
  function __construct(FournisseurDePain $boulangerieLaPlusProche)
  {
    $this->monFournisseurDePain = $boulangerieLaPlusProche ;
  }

  function JeVeuxDuPain()
  {
    $pain = $this->monFournisseurDePain->fournitLePain() ;
  }
}
```

lorsqu'on instancie la classe Moi, on lui fournit l'adresse de la boulangerie la plus proche

```php
$moi = new Moi(new BoulangerieDeMonQuartier) ;
$moi->JeVeuxDuPain() ;
```

et lorsqu'on est en vacances, on fait :

```php
$moi = new Moi(new BoulangerieDuLieuDeMesVacances) ;
$moi->JeVeuxDuPain() ;
</pre>
```

Evidemment, me direz vous, vous êtes QUAND MEME obligé de changer la classe qui fournit le pain. Mais cette fois ci, vous le faites dans des niveaux supérieurs de votre application. Plutôt dans les niveaux qui utilisent et organisent ces classes (comme un contrôleur par ex) et non plus dans les entrailles de votre code... Moins vous touchez aux rouages du truc, moins vous avez de chance de planter le truc...

Maintenant, on peut encore remonter tout ça dans un niveau encore supérieur. Et c'est là que le gestionnaire de service intervient.

Globalement ça va donner maintenant :

```php
class GestionnaireDeService {
    $fournisseurDePain = new BoulangerieDeMonQuartier() ;
    $fournisseurDeFruitsEtLegumes = new PrimeurDeMonQuartier() ;
    // etc...
}
```

et pour instancier Moi :

```php
$moi = new Moi($gestionnaireDeService->fournisseurDePain)
$moi->JeVeuxDuPain() ;
```

Bon, c'est du pseudo code tout ça mais j'espère que vous entrevoyez le principe quand même.

## Comment faire

Pour gérer (et injecter) les dépendances, vous avez plusieurs méthodes à votre disposition.

### Injection par le constructeur

#### La classe Moi

```php
classe Moi 
{
  // on déclare la dépendance dans le constructeur
  function __construct(FournisseurDePain $boulangerieLaPlusProche)
  {
    $this->monFournisseurDePain = $boulangerieLaPlusProche ;
  }

  function JeVeuxDuPain()
  {
    $pain = $this->monFournisseurDePain->fournitLePain() ;
  }
}
```

#### Utiliser la classe Moi dans un fichier php (hors MVC) :

```php
<?php
  $boulangerie = new BoulangerieDeMonQuartier() ;
  $moi = new Moi($boulangerie) ;
  echo $moi->JeVeuxDuPain() ;
```

#### Utiliser la classe Moi dans un contrôleur :

```php
class IndexController
{
  function indexAction
  {
    $boulangerie = new BoulangerieDeMonQuartier() ;
    $moi = new Moi($boulangerie) ;
    return $moi->JeVeuxDuPain() ;
  }
}
```

#### Instancier les dépendances avec un gestionnaire de service

```php
class GestionnaireDeService
{
  function setFournisseurDePain()
  {
    $fournisseurDePain = new BoulangerieDeMonQuartier() ;
  }

  function getFournisseurDePain()
  {
    return $fournisseurDePain ;
  }
}

// soit dans un fichier php direct 
<?php
  $boulangerie = $gestionnaireDeService->getFournisseurDePain() ;
  $moi = new Moi($boulangerie) ;
  echo $moi->JeVeuxDuPain() ;

// soit dans un controleur 
class IndexController
{
  function indexAction
  {
    $boulangerie = $gestionnaireDeService->getFournisseurDePain() ;
    $moi = new Moi($boulangerie) ;
    return $moi->JeVeuxDuPain() ;
  }
}
```

#### Full gestionnaire de service
Parce que même la classe `Moi` peut changer après tout

```php
class GestionnaireDeService
{
  function getFournisseurDePain()
  {
    $fournisseurDePain = new BoulangerieDeMonQuartier() ;
    return $fournisseurDePain ;
  }

  function getMoi()
  {
    $moi = new Moi($this->getFournisseurdePain()) ;
    return $moi ;
  }
}

// soit dans un fichier php direct 
<?php
  $moi = $gestionnaireDeService->getMoi() ;
  echo ->JeVeuxDuPain() ;

// soit dans un controleur 
class IndexController
{
  function indexAction
  {
    $moi = $gestionnaireDeService->getMoi() ;
    return $moi->JeVeuxDuPain() ;
  }
}
```

### Injection par les setters

#### La classe Moi

```php
classe Moi 
{
  protected $monFournisseurDePain ;

  // on déclare la dépendance dans les setters
  function setMonFournisseurDePain(FournisseurDePain $boulangerieLaPlusProche)
  {
    $this->monFournisseurDePain = $boulangerieLaPlusProche ;
  }

  function JeVeuxDuPain()
  {
    $pain = $this->monFournisseurDePain->fournitLePain() ;
  }
}
```

#### Utiliser la classe Moi dans un fichier php (hors MVC) :

```php
<?php
  $boulangerie = new BoulangerieDeMonQuartier() ;
  $moi = new Moi() ;
  $moi->setMonFournisseurDePain($boulangerie) ;
  echo $moi->JeVeuxDuPain() ;
```

#### Utiliser la classe Moi dans un contrôleur :

```php
class IndexController
{
  function indexAction
  {
    $boulangerie = new BoulangerieDeMonQuartier() ;
    $moi = new Moi() ;
    $moi->setMonFournisseurDePain($boulangerie) ;
    return $moi->JeVeuxDuPain() ;
  }
}
```

#### Instancier les dépendances avec un gestionnaire de service

```php
class GestionnaireDeService
{
  function setFournisseurDePain()
  {
    $fournisseurDePain = new BoulangerieDeMonQuartier() ;
  }
  
  function getFournisseurDePain()
  {
    return $fournisseurDePain ;
  }
}

// soit dans un fichier php direct 
<?php
  $boulangerie = $gestionnaireDeService->getFournisseurDePain() ;
  $moi = new Moi() ;
  $moi->setMonFournisseurDePain($boulangerie) ;
  echo $moi->JeVeuxDuPain() ;

// soit dans un controleur 
class IndexController
{
  function indexAction
  {
    $boulangerie = $gestionnaireDeService->getFournisseurDePain() ;
    $moi = new Moi() ;
    $moi->setMonFournisseurDePain($boulangerie) ;
    return $moi->JeVeuxDuPain() ;
  }
}
```

#### Full gestionnaire de service

Parce que même la classe `Moi` peut changer après tout

```php
class GestionnaireDeService
{
  function getFournisseurDePain()
  {
    $fournisseurDePain = new BoulangerieDeMonQuartier() ;
    return $fournisseurDePain ;
  }

  function getMoi()
  {
    $moi = new Moi() ;
    $moi->setMonFournisseurDePain($this->getFournisseurdePain()) ;
    return $moi ;
  }
}

// soit dans un fichier php direct 
<?php
  $moi = $gestionnaireDeService->getMoi() ;
  echo ->JeVeuxDuPain() ;

// soit dans un controleur 
class IndexController
{
  function indexAction
  {
    $moi = $gestionnaireDeService->getMoi() ;
    return $moi->JeVeuxDuPain() ;
  }
}
```

Plus vous parvenez à abstraire votre code, vous détacher de votre boulangerie et si vous focalisez sur le fournisseur de pain (peu importe la boulangerie), alors vous parviendrez à créer des codes de plus en plus souples et malléables. Attention toutefois de ne pas pousser trop loin et d'obtenir l'effet contraire... ce qui serait bien dommange.
