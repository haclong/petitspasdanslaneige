---
title: "Solveur de Sudoku - L'objet Chiffre"
permalink: "fr/posts/solveur-de-sudoku-lobjet-chiffre.html"
date: "2014-04-27T19:54"
slug: solveur-de-sudoku-lobjet-chiffre
layout: post
drupal_uuid: efb65f73-f1df-4a10-835e-723b14fd4a7c
drupal_nid: 59
lang: fr
author: haclong

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "POO"

sites:
  - "Développement"

summary: "Notre grille de sudoku est donc prête. Mais, reconnaissons le, ce n'est pas vraiment cette partie là qui nous intéresse, n'est ce pas ? Explorons donc notre modèle... Explorons, inventons, découvrons, concevons..."
---

Notre grille de sudoku est donc prête. Mais, reconnaissons le, ce n'est pas vraiment cette partie là qui nous intéresse, n'est ce pas ? Explorons donc notre modèle... Explorons, inventons, découvrons, concevons...

### Un petit rappel

Nous allons mettre en place 3 objets : le **Chiffre**, la **Case**, et la **Grille**.

Parlons d'abord de notre objet **Chiffre**.

L'objet **Chiffre** est l'ensemble des numéros possibles sur une seule case. Pour chacune des possibilités, un statut lui est associé.

Appliqué au développement, cela donne plusieurs réflexions :

1. on peut créer pour l'objet **Chiffre** une propriété par numéro. Toutefois, en y réfléchissant un peu, on s'aperçoit vite que ça va être difficile de parcourir toutes les possibilités puisque toutes les propriétés sont indépendantes les unes des autres. La conclusion évidente est donc que les possibilités doivent être gérées dans un tableau que l'on pourra parcourir librement.
2. si on crée un tableau comprenant toutes les possibilités, il faut savoir de combien de possibilités on parle. Il y a autant de numéros possibles pour un chiffre que de numéros dans un grille de sudoku. On arrive ainsi rapidement à la conclusion qu'il faut que l'objet **Chiffre** connaisse la taille de la grille.

Le tableau des possibilités peut être de cette forme :
- `$possibilites[] = array("numero" => 1; "statut" => "statut_option") ;`
- `$possibilites[] = array("numero" => 2; "statut" => "statut_option") ;`

Pour récupérer un statut quand on a un numéro, il faudrait parcourir le tableau `$possibilites` dans son intégralité, sans pouvoir utiliser sa clé, et tester si la valeur "numero" correspond bien à la valeur qu'on cherche...

Quelquechose comme ça :

```php
foreach($possibilites as $possibilite) {
  if($possibilite['numero'] = "le_numero_qu_on_cherche") {
    return $possibilite['statut']
  }
}
```

Ce n'est pas grand chose, pas très contraignant, mais je ne sais pas... j'ai pour principe d'éviter de parcourir invariablement des tableaux... Ah tiens, il faudrait voir si on ne pourrait pas avoir un opérateur de type *foreach while*... ça pourrait être super pratique... bref...

De plus, avec ce montage, en y songeant, il y aurait un peu de redondance puisqu'il y aurait la clé "numero" qui serait invariablement un nombre entre 1 et 9 et la clé du tableau `$possibilites` qui serait un nombre entre 0 et 8 (la plupart du temps)...

Du coup, on pourrait plutôt monter notre tableau des possibilités comme ceci :

- `$possibilites[1] = "statut_option" ;`
- `$possibilites[2] = "statut_option" ;`

On pourrait accéder facilement au statut si on a un numéro en faisant

`$statut = $possibilites["le_numero_qu_on_cherche"] ;`

Et ça, je préfère quand même...

Et bien voilà, notre objet **Chiffre** a donc une propriété obligatoire, un tableau `$possibilites`. La taille du tableau `$possibilites` est de la taille de la grille de sudoku. Optionnellement, on pourrait garder la taille de la grille de sudoku dans l'objet **Chiffre** mais honnêtement, je n'en vois pas l'utilité.

```php
// module/Application/src/Application/Model/Chiffre.php

<?php
namespace Application\Model ;

class Chiffre
{
  /**
   * @var array $possibilites ensemble des possibilités pour une case de la grille de sudoku
   */
  protected $possibilites = array() ;
}
```

Très rapidement, chaque numéro a un statut. Arbitrairement, on décide que un numéro peut avoir les statuts suivants :

- c'est un statut "*possible*" = le numéro peut être dans la case comme il peut ne pas l'être, on ne sait pas encore
- c'est un statut "*éliminé*" = le numéro ne peut pas être dans la case, en vertu des règles du sudoku
- c'est un statut "*validé*" = le numéro est dans la case, en vertu des règles du sudoku

```php
// module/Application/src/Application/Model/Chiffre.php

<?php
namespace Application\Model ;

class Chiffre
{
  // Ajouter les constantes
  /**
   * @const
  */
  const ELIMINE = 0 ;
  const VALIDE = 1 ;
  const POSSIBLE = 2 ;
}
```

Commençons l'écriture des méthodes en commençant par le constructeur : celle ci va initialiser la propriété protégée `$figures` et créer autant de numéro qu'il y a de chiffres dans la grille de sudoku.

```php
// module/Application/src/Application/Model/Chiffre.php

<?php
namespace Application\Model ;

class Chiffre
{
  // ajouter le constructeur
  /**
   * Constructeur
   *
   * @param int $taille // taille de la grille de sudoku : 4, 9, 16, 25...
   */
  public function __construct($taille)
  {
    // on initialise la propriété $possibilites
    $this->possibilites = array() ;
    // bien penser à commencer l'index à 1 et non pas à 0 comme de coutume, puisqu'il n'y a pas de numéro 0 dans une grille de sudoku.
    for($i=1; $i<=$taille; $i++)
    {
      // on génère autant de numéros possibles qu'il y a de chiffres dans la grille
      // tous les numéros sont en statut "option"
      $this->possibilites[$i] = self::POSSIBLE ;
    }
  }
}
```

Le constructeur initialisant un objet avec une propriété "protégée", il n'est pas facile de rédiger un test unitaire sur ce constructeur, le test vérifiant si la propriété protégée existe dans la mesure où, puisqu'elle est protégée, on ne peut pas y accéder. Si on le souhaite néanmoins, il y a plusieurs façons d'y parvenir. Il est possible de construire nos cas de tests sur un objet comportant une instance d'un `ReflectionClass()` qui permettrait alors d'accéder aux propriétés et aux méthodes protégées. Sinon, il est également possible de construire une méthode qui retourne la propriété protégée qui nous intéresse. Dans le cas présent, j'ai trouvé une autre façon de tester la propriété $possibilites mais nous verrons cela à la fin de cet objet.

Le constructeur initialise la propriété `$possibilites` avec pour chaque numéro un statut "*POSSIBLE*". Voyons maintenant les méthodes pour changer le statut d'un numéro. On peut soit écrire une méthode générique où on passerait le statut dans les arguments de la méthode, ou bien, dans le cas présent et dans la mesure où on a un nombre limité et fini de statuts, on peut écrire autant de méthodes qu'il y a de statuts.

```php
// module/Application/src/Application/Model/Chiffre.php

<?php
namespace Application\Model ;

class Chiffre
{
  /**
   * Valide un chiffre parmi les autres
   * Elimine les autres numéros (les autres numéros possibles dans la même case)
   *
   * @param int $chiffre
   *
   * @throw \Exception renvoie une exception si on essaye de valider un numéro qui a été éliminé précédemment.
   */
  public function validerChiffre($chiffre)
  {
    // détection de l'exception
    if($this->possibilites[$chiffre] == self::ELIMINE)
    {
      throw new \Exception('Impossible de valider un numéro qui a été éliminé') ;
    }

    // on commence par éliminer toutes les possibilités
    $possibilites = array() ;
    foreach($this->possibilites as $numero => $statut)
    {
      $possibilites[$numero] = self::ELIMINE ;
    }
    $this->possibilites = $possibilites ;
    $this->possibilites[$chiffre] = self::VALIDE ;
  }

  /**
   * Elimine un chiffre
   *
   * @param int $chiffre
   *
   * @throw \Exception renvoie une exception si on essaye d'éliminer un numéro qui a été validé ou initialisé précedemment.
  */
  public function eliminerChiffre($chiffre)
  {
    // détection de l'exception
    if($this->possibilites[$chiffre] == self::VALIDE)
    {
      throw new \Exception('Impossible d\'éliminer un numéro qui a été initialisé ou validé') ;
    }

    $this->possibilites[$chiffre] = self::ELIMINE ;
  }

  /**
   * Rétablit tous les numéros en statut "POSSIBLE"
   */
  public function retablirTout()
  {
    $possibilites = array() ;
    foreach($this->possibilites as $numero => $statut)
    {
      $possibilites[$numero] = self::POSSIBLE ;
    }
    $this->possibilites = $possibilites ;
  }
}
```

3 statuts, 3 méthodes.

Sur les 3 statuts, un statut indique qu'on sait quel chiffre occupe la case et deux autres statuts ne nous permettent pas de le savoir. Nous pouvons donc mettre en place les méthodes qui vont tester ces états.

```php
// module/Application/src/Application/Model/Chiffre.php

<?php
namespace Application\Model ;

class Chiffre
{
  /**
   * On vérifie si le chiffre est connu par déduction
   *
   * return bool
   */
  public function estValide()
  {
    foreach($this->possibilites as $numero)
    {
      if($numero == self::VALIDE)
      {
        return true ;
      }
    }
 
    return false ;
  }

  /**
   * On vérifie si l'objet Chiffre n'est pas connu
   *
   * return bool
   */
  public function estInconnu()
  {
    foreach($this->possibilites as $numero)
    {
      if($numero == self::VALIDE)
      {
        return false ;
      }
    }
    return true ;
  }
}
```

Nous avons désormais des méthodes pour vérifier si un chiffre est identifié ou pas et des méthodes pour changer le statut d'un numéro. Mais l'assignation est volontaire. En effet, lorsqu'on valide un numéro, la méthode admet qu'on a déjà identifié quel est le numéro qui est déduit. Mais il n'y a pas, finalement, de véritable mécanisme de déduction. Il faut donc expliquer à notre programme comment déduire un numéro.

Dans une grille de sudoku de 9x9, chaque case comprend au début les 9 numéros possibles.

Si un numéro est identifié dans une case, cela signifie que tous les autres numéros sont éliminés.

La réciproque est alors vrai : si tous les numéros sont éliminés, alors le dernier numéro restant est obligatoirement le numéro identifié.

```php
// module/Application/src/Application/Model/Chiffre.php

<?php
namespace Application\Model ;

class Chiffre
{
  /**
   * On vérifie qu'il ne reste plus qu'un et un seul numéro possible
   *
   * return bool
   */
  protected function estDerniereOption()
  {
    $i = 0 ;
    foreach($this->possibilites as $numero)
    {
      if($numero == self::POSSIBLE)
      {
        $i++ ;
      }
    }
 
    if($i == 1)
    {
      return true ;
    }
 
    return false ;
  }
}
```

Une fois qu'on sait identifier s'il ne reste qu'une seule option, on va pouvoir aller modifier la méthode `eliminerChiffre()` écrite plus haut. On lui rajoutera le raisonnement qui va permettre de valider le dernier chiffre restant.

```php
// module/Application/src/Application/Model/Chiffre.php

<?php
namespace Application\Model ;

class Chiffre
{
  /**
   * Elimine un chiffre
   *
   * @param int $chiffre
   *
   * @throw \Exception renvoie une exception si on essaye d'éliminer un numéro qui a été validé ou initialisé précedemment.
   */
  public function eliminerChiffre($chiffre)
  {
    // détection de l'exception
    if($this->possibilites[$chiffre] == self::VALIDE)
    {
      throw new \Exception('Impossible d\'éliminer un numéro qui a été initialisé ou validé') ;
    }

    $this->possibilites[$chiffre] = self::ELIMINE ;
    if($this->estDerniereOption())
    {
      foreach($this->possibilites as $numero => $statut)
      {
        if($statut == self::POSSIBLE)
        {
          $this->validerChiffre($numero) ;
        }
      }
    }
  }
}
```

Il ne reste plus qu'à mettre en place les méthodes qui nous serviront à retourner le bon numéro.

Retourner le statut d'un numéro.

```php
// module/Application/src/Application/Model/Chiffre.php

<?php
namespace Application\Model ;

class Chiffre
{
  /**
   * Récupérer le statut d'un numéro
   *
   * @param int $numero
   *
   * return int
   */
  public function getStatutDuNumero($numero)
  {
    return $this->possibilites[$numero] ;
  }
}
```

Retourner l'état définitif de la case : retourner le numéro si on sait quel est le numéro de la case ou ne rien retourner si on ne sait pas.

```php
// module/Application/src/Application/Model/Chiffre.php

<?php
namespace Application\Model ;

class Chiffre
{
  /**
   * Retourner l'état définitif
   *
   * return string
   */
  public function getNumero()
  {
    foreach($this->possibilites as $numero => $statut)
    {
      if($statut == self::VALIDE)
      {
        return $numero ;
      }
    }
    return '' ;
  }
}
```

Nous avons donc à peu près toutes nos méthodes. Ne vous en faites pas si vous n'avez pas toutes les méthodes du premier coup, vous les rajouterez au fur et à mesure que vous codez. En revanche, une des règles de la programmation orientée objet dit : *une classe doit être ouverte à l'extension mais fermée à la modification*. A l'application, cela veut dire notamment que, une fois que votre classe est utilisée, vous devez vous contraindre à ne plus modifier ses propriétés, ni ses méthodes.

Si vous êtes en cours de développement, vous pouvez vous permettre de rajouter des méthodes, rarement des propriétés.

Si votre application commence à être en production, il n'est pas recommandé de rajouter des nouvelles méthodes.

Dites vous que si vous aviez besoin de ces méthodes, vous auriez découvert plus tôt que vous en aviez besoin. Si le besoin est tardif, alors c'est parce qu'il concerne un autre objet, une autre fonctionnalité.
