---
title: "Sérializer un objet"
permalink: "fr/posts/serializer-un-objet.html"
date: "2016-10-03T15:52"
slug: serializer-un-objet
layout: post
drupal_uuid: 0be9f5f7-3efa-40f1-9550-1ead427de59b
drupal_nid: 153
lang: fr
author: haclong

media:
  path: /img/teaser/search_engine_friendly.jpg

tags:
  - "PHP"
  - "OOP"

sites:
  - "Développement"

summary: "En français, on dit linéariser... Voyons comment on peut stocker un objet.
"
---

En français, on dit linéariser... Voyons comment on peut stocker un objet.

En développant avec des objets, il peut nous arriver de vouloir stocker des objets entiers soit temporairement (dans un cache user ou bien en session) ou de manière persistante (en base de données).

On souhaite pouvoir faire quelque chose comme ça :

```php
$panier = new Panier() ;
$_SESSION['panier'] = $panier ;
```

Et hop, une fois notre objet `$panier` dans la SESSION, on souhaite pouvoir l'utiliser en faisant :

```php
$panier = $_SESSION['panier'] ;
var_dump($panier->produits) ;
```

Afin de stocker proprement l'objet `$panier` dans la SESSION, (ou le cache user ou la base de données), il faut le **linéariser**.

```php
$panier = new Panier() ;
$_SESSION['panier'] = serialize($panier) ;
```

et pour le récupérer

```php
$panier = unserialize($_SESSION['panier']) ;
var_dump($panier->produits) ;
```

Linéariser un objet, c'est - comme le dit si bien la doc - <a href="http://php.net/manual/fr/language.oop5.serialization.php" target="_blank">générer une représentation stockable d'une valeur</a>. C'est une empreinte toute plate, linéaire, de l'objet, débarrassé de ses méthodes, représenté uniquement par ces données. Pour récupérer les méthodes, il faut penser à faire l'`include` de l'objet (ou utiliser un `autoload`) pour que PHP sache que votre objet est une instance de cette classe et que cette classe contient ces méthodes...

La doc dit également que la fonction `session_register()` fait la linéarisation / délinéarisation automatiquement. Mais comme la fonction tend à être obsolète, je recommande de prendre les bonnes habitudes d'office. Il faut savoir que les frameworks avec des objets `Session()` prévoient sûrement de faire cette opération de linéarisation et délinéarisation automatiquement.

## Linéariser un objet

Pour linéariser / délinéariser un objet, nous avons à notre disposition les fonctions

```php
$serialized_object = serialize($myObject) ;
$deserialized_object = unserialize($serialized_object) ;
```

Lorsqu'on utilise <a href="http://php.net/manual/fr/function.serialize.php" target="_blank">`serialize()`</a>, grosso modo, PHP va regarder l'objet, récupérer toutes les propriétés et construire une chaîne de caractères avec.

Si vous voulez changer cette logique - parce que vos données ont besoin d'un traitement avant d'être stockées, parce que votre objet est trop gros et que vous ne souhaitez pas tout conserver - vous pouvez utiliser la fonction magique <a href="http://php.net/manual/fr/language.oop5.magic.php#object.sleep" target="_blank">`__sleep()`</a>.

Dans ces cas là, lorsque vous utilisez `serialize()`, PHP va regarder les instructions que vous avez laissé dans `__sleep()` et il utilisera ces instructions pour linéariser votre objet.

```php
class Panier
{
  protected $datetime ;
  protected $strippedDate ;
  protected $products ;
  protected $total ;
  protected $id ;
  public function __construct()
  {
    $this->id = uniqid() ;
    // la propriété datetime est un objet Datetime.
    // on pourrait linéariser l'objet DateTime intégralement
    // mais on pourrait aussi ne garder que la date
    // parce qu'on n'a pas envie de garder les autres propriétés de l'objet DateTime
    $this->datetime = new DateTime() ;
    $this->products = array() ;
  }

  public function addProductToCart($product)
  {
    $item['designation'] = $product->getName() ;
    $item['quantite'] = $product->getNumber() ;
    $item['price'] = $product->getPrice() ;
    $this->products[] = $item ;
  }

  // la propriété $total est calculée
  // on n'est donc pas obligée de la gardée stockée au moment de la linéarisation
  protected function setTotal()
  {
    $this->total = 0 ;
    foreach($this->products as $product)
    {
      $this->total += $product['quantite'] * $product['price'] ;
    }
    return $this->total ;
  }

  // on simplifie la propriété DateTime
  // on ne conserve pas le total
  public function __sleep()
  {
    $this->strippedDate = $this->datetime->format('Y-m-d H:i:s') ;
    return ['id', 'strippedDate', 'products'] ;
  }

  // au moment de délinéariser, on rétablit $datetime et $total
  public function __wakeup()
  {
    $this->datetime = new DateTime($this->strippedDate) ;
    $this->setTotal() ;
  }
}
```

Notons bien que la fonction `__sleep()` retourne **TOUJOURS** un tableau avec le nom des propriétés qu'on souhaite linéariser.

Si vous obtenez l'erreur ***__sleep should return an array only containing the names of instance-variables to serialize***, c'est que vous avez probablement écrit un truc dans le genre :

```php
// retourne une erreur __sleep should return an array only containing 
// the names of the instance-variables to serialize
public function __sleep()
{
  return [$this->strippedDate, $this->products] ;
}

// ce qu'il faut faire
public function __sleep()
{
  return ['strippedDate', 'products'] ;
}
```

Il y a une interface assez récente qui peut faire la même chose: <a href="http://php.net/manual/fr/class.serializable.php" target="_blank">`Serializable`</a>. Par contre, soit vous utilisez les fonctions magiques `__sleep()` et `__wakeup()`, soit l'interface. Les deux jeux de fonctions ne sont pas compatibles.

Si vous choisissez de choisir l'interface, voici notre objet `Panier`

```php
class Panier implements Serializable
{
  protected $datetime ;
  protected $strippedDate ;
  protected $products ;
  protected $total ;
  protected $id ;

  public function __construct()
  {
    $this->id = uniqid() ;
    // la propriété datetime est un objet Datetime.
    // on pourrait linéariser l'objet DateTime intégralement
    // mais on pourrait aussi ne garder que la date
    // parce qu'on n'a pas envie de garder les autres propriétés de l'objet DateTime
    $this->datetime = new DateTime() ;
    $this->products = array() ;
  }

  public function addProductToCart($product)
  {
    $item['designation'] = $product->getName() ;
    $item['quantite'] = $product->getNumber() ;
    $item['price'] = $product->getPrice() ;
    $this->products[] = $item ;
  }

  // la propriété $total est calculée
  // on n'est donc pas obligée de la gardée stockée au moment de la linéarisation
  protected function setTotal()
  {
    $this->total = 0 ;
    foreach($this->products as $product)
    {
      $this->total += $product['quantite'] * $product['price'] ;
    }
    return $this->total ;
  }

  // on simplifie la propriété DateTime
  // on ne conserve pas le total
  public function serialize()
  {
    $this->strippedDate = $this->datetime->format('Y-m-d H:i:s') ;
    return serialize([$this->id, $this->strippedDate, $this->products]) ;
  }

  // au moment de délinéariser, on rétablit $datetime et $total
  public function unserialize($data)
  {
    list($this->id, $this->strippedDate, $this->products) = unserialize($data) ;
  }
}
```

Nos deux classes `Panier` feront EXACTEMENT la même chose. Deux façons de le faire, c'est tout.

ATTENTION !! contrairement à `__sleep()`, la méthode `serialize()` de l'interface `Serializable` n'utilise pas les mêmes informations.

```php
// voici ce qu'il faut faire dans __sleep() 
public function __sleep()
{
  return ['strippedDate', 'products'] ;
}

// voici la même chose quand c'est une interface Serializable
public function serialize()
{
  return serialize([$this->strippedDate, $this->products]) ;
}
```

## Ce qu'on ne peut pas linéariser.

Bon, on peut linéariser nos objets. Pratiquement TOUS.

On peut filtrer ce qu'on veut linéariser.

Mais il y a QUAND MÊME des choses que PHP, tout almighty qu'il est, ne peut pas faire : **linéariser des ressources**.

*Ah, mais qu'est ce que cela, des ressources ?*

Vous en avez sûrement croisés dans la doc de PHP. Typiquement, quand vous utilisez une connexion à une base de données, ce qui est retourné à ce moment là, c'est une ressource. Un truc qui fait que ça marche. Et quand c'est une ressource, on ne peut pas linéariser.

Et là, j'ai un problème.

J'ai écrit une belle classe. Dans ma classe, une méthode qui renvoie un événement chaque fois que la méthode est appelée. Voici ce que donne le résumé de ma classe :

```php
class Box implements Serializable
{
  protected $eventManager ;
  protected $openEvent ;
  protected $content ;
  protected $id ;

  // en vertu des principes d'injection de dépendances,
  // j'injecte dans le constructeur le gestionnaire d'événement et l'événement
  public function __construct($eventManager, $openEvent)
  {
    $this->openEvent = $openEvent ;
    $this->eventManager = $eventManager ;
  }

  public function openMe()
  {
    $this->openEvent->setBoxContent() ;
    $this->eventManager->trigger('open.box', $this->openEvent) ;
  }

  public function serialize()
  {
    return serialize([$this->content, $this->id]) ;
  }

  public function unserialize($data)
  {
    list($this->content, $this->id) = unserialize($data) ;
  }
}
```

Si vous faites un contrôle sur votre objet et que vous faites :

```php
var_dump($maBoite)
```

vous verrez que les propriétés `$eventManager` et `$openEvent` sont bien remplies.

Si vous linéarisez votre objet et puis délinéariser, vous vous apercevrez que les propriétés `$eventManager` et `$openEvent` sont `null` désormais.
-> vous ne pouvez pas linéariser la propriété `$eventManager` parce que c'est un lien vers une ressource
-> vous n'avez pas linéarisé `$openEvent`

Comme ce sont des dépendances, vous ne pouvez pas les reconstruire dans la méthode `unserialize()`.

Coincé.

Ce que j'ai réussi à glaner et qui maintenant paraît tellement évident que je ne comprends pas pourquoi j'ai pu me fourvoyer à ce point : un objet de type Model ou Entity de votre application, qui correspond à une vraie donnée (la voiture quoi), ne *doit contenir QUE des propriétés* et éventuellement quelques méthodes pour assigner / retourner les propriétés, contrôler l'intégrité des données, les filtrer etc... c'est tout. Aucune autre forme d'interaction.

Si vous devez interagir avec votre objet, il faut utiliser un objet qui ne fera que ça : *intervenir sur l'objet*. Ce sera donc cet objet qui va porter les dépendances.

Le développement objet est sans pitié. J'ai voulu faire ma radine, faire vite et crade et non... pas vite. pas crade. Enfin, peut être que si, un peu :p
