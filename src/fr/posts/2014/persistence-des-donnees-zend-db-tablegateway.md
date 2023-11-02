---
title: "Persistence des données - Zend Db TableGateway"
permalink: "fr/posts/persistence-des-donnees-zend-db-tablegateway.html"
date: "2014-07-11T13:11"
slug: persistence-des-donnees-zend-db-tablegateway
layout: post
drupal_uuid: 2c384f90-2ac4-418a-acff-b63c7f5140f8
drupal_nid: 85
lang: fr
author: haclong

media:
  path: /img/teaser/nature-morte-6_2.jpg
  credit: "Stefano Paolini"
  url: http://www.caponzio.it/index.html

tags:
  - "hydrator"
  - "architecture trois tiers"
  - "accès aux données"
  - "zend framework 2"
  - "POO"
  - "modèle"

sites:
  - "Développement"

summary: "En architecture trois tiers, le troisième tiers est la couche d'accès aux données. Afin d'accéder à votre couche d'accès aux données, Zend Framework a créé la classe TableGateway (et consoeurs)."
---

En architecture trois tiers, le troisième tiers est la couche d'accès aux données. Afin d'accéder à votre couche d'accès aux données, **Zend Framework** a créé la classe **TableGateway** (et consoeurs).

### Périmètre

Dans les grosses lignes (et c'est ma vision, d'autres auront une autre vision de la chose), votre application ne travaille qu'avec des objets. Vous développez une application avec un développement orienté objet, comme son nom l'indique, vous ne manipulez que des objets.

Donc, en EXAGERANT, les objets, éclatés, itérés et affichés entre des balises HTML ou dans un json, c'est la première des couches d'une architecture trois tiers : c'est la couche présentation. C'est la partie où on ne fait que des echo, où on gère les javascripts, les css et les balises HTML.

Dans l'autre sens, dès que vous devez éclater votre objet pour le remettre au format d'une base de données, le nettoyer etc... c'est la troisième couche : celle qui accède aux données.

Du coup, on peut dire que** la couche d'accès aux données commence à la base de données (et donc la requête) et finit au moment où on retourne un objet (complet de préférence)**.

Pour vous en convaindre, testez **Doctrine** : c'est exactement ce qu'il fait. Du coup, vous ne manipulez que des objets... vous en avez même oublié comment s'écrit une requête SQL.

### Votre propre couche d'accès aux données

Fi de **Doctrine**, vous saurez bien faire votre code vous même.

#### A partir de la base de données

Pour cela, vous allez commencer par utiliser la classe <a href="http://framework.zend.com/manual/2.3/en/modules/zend.db.table-gateway.html" target="_blank">**Zend Db TableGateway**</a>. Beaucoup de tutoriaux vous indiqueront comment faire. Maintenant, les tutoriaux vous montrent toujours des exemples simples, voire idéaux. Evidemment, dans la vraie vie, ce ne sera jamais le cas...

Les options qui s'offrent à vous (et je ne vous donnerais pas la réponse, je ne l'ai pas encore trouvée moi même) :

- soit vous faites un **TableGateway** par objet métier, et le **TableGateway** comporte une requête SQL avec plusieurs jointures entre vos tables et avec le résultat d'une telle requête, vous instanciez des objets à partir des champs requêtés... Je pense toutefois que ce sont des **TableGateway** complexe à maintenir et pas toujours facile à réutiliser.
- soit vous faites un **TableGateway** par objet métier, et les jointures s'effectuent dans un second temps, dans une couche intermédiaire. Dans ce cas, il faut se renseigner sur les performances d'un tel choix : est-ce plus coûteux de requêter itérativement sur une table de la base de données, ou bien vaut-il mieux requêter sur tous les enregistrements d'une table pour filtrer ensuite les résultats côté applicatif ? Il y a des partisans pour les deux solutions. A vous de vous faire votre idée. Même si les instructions ORDER BY, WHERE, LIMIT dans MySQL semblent super pratique, est-ce la solution la plus économique de laisser la requête faire les tris à la place de notre application ?

#### Hydrater les données

Oui, le mot à la mode, c'est hydrater... Mais quand vous cherchez sur Google, vous avez plein de conseils santé sur la manière la plus efficace de s'hydrater... pas tout à fait notre champ de recherche...

Vous allez devoir convertir les données retournées dans la requête (typiquement des *strings* la plupart du temps), vers des types de vos propriétés.

L'exemple le plus parlant est un champ *Date*. Dans la table MySQL, le type du champ est forcément **DATETIME**, **DATE** ou **TIMESTAMP** (un type MySQL quoi). Une fois que vous aurez fait un SELECT dessus, vous allez récupérer une *string*. Mais ce serait tellement plus logique que la donnée soit un objet <a href="http://fr.php.net/manual/fr/class.datetime.php" target="_blank">**DateTime**</a>. Comme ça, pas de problème pour manipuler les dates si nécessaire, et quand il s'agira d'afficher la date à l'écran (un peu plus tard dans notre application), un `$date->format('c')` serait tellement plus pratique.

Comme Zend Framework le présente (y compris dans quelques tutoriaux), il existe maintenant des classes **Hydrator** qui permettent de convertir un tableau de données en un objet en faisant correspondre pour clé du tableau en entrée son format au format de la propriété de l'objet (ça ne vous dit rien ça ? convertir d'une *string* à un **DateTime** ?) Il faudra donc soit utiliser <a href="http://framework.zend.com/manual/2.3/en/modules/zend.stdlib.hydrator.html" target="_blank">les hydrators existant dans Zend Framework</a>, soit créer vos propres hydrators. N'hésitez pas à ajouter des stratégies aux hydrators existants (<a href="https://juriansluiman.nl/article/125/strategies-for-hydrators-a-practical-use-case" target="_blank">voir les conseils de Jurian Sluiman ici</a>). Comme ça, vous pourrez surclasser certaines règles des hydrators existants. De même, <a href="http://www.masterzendframework.com/tutorial/zendframework2-hydrators-models-tablegateway-pattern" target="_blank">Matthew Setter dans son blog</a> nous propose d'écrire notre propre hydrator avec la possibilité de faire le mapping (nom de colonne / nom de la propriété) dans la configuration de l'hydrator.

Les hydrators sont simplissimes d'utilisation. Quand on transforme un tableau de données en un objet, on **hydrate**. Quand on transforme un objet en tableau de données, on **extracte**. Il y encore peu, on pouvait faire la même chose avec `$this->toArray()` pour extraire les données, mais si on voulait extraire les données vers différentes destinations (`XML, JSON, HTML FORM, MYSQL`), on était peut être contraint de reconvertir une fois après encore.

Zend Framework 2 propose 3 hydrators de base :

##### Zend\Stdlib\Hydrator\ArraySerializable

pour que celui ci fonctionne, il faut impérativement que l'objet ait une méthode `exchangeArray()` ou `populate()` pour hydrater et une méthode `getArrayCopy()` pour extraire.

```php
class MonObjet
{
    protected $prop1 ;
    protected $prop2 ;
    protected $prop3 ; // cette propriété ne vient pas de l'exterieur et n'est pas extraite

    public function exchangeArray(array $data)
    {
        $this->prop1 = $data['donnee1'] ;
        $this->prop2 = $data['donnee2'] ;
    }

    public function getArrayCopy()
    {
        $array = array() ;
        $array['donnee1'] = $this->prop1 ;
        $array['donnee2'] = $this->prop2 ;
        return $array ;
    }
}
```

C'est tout. Quand vous utilisez l'hydrator, les données seront automatiquement assignées.

##### Zend\Stdlib\Hydrator\ClassMethods

pour que cet hydrator fonctionne, il suffit que l'objet ait des setters et des getters et que le nom des propriétés correspondent aux données du tableau

```php
class MonObjet
{
    protected $prop1 ;

    public function setProp1($prop1)
    {
        $this->prop1 = $prop1 ;
    }

    public function getProp1()
    {
        return $this->prop1 ;
    }
}
```

Tout simplement. J'ai toutefois lu quelque part que cet hydrator était assez coûteux en ressources... à voir...

##### Zend\Stdlib\Hydrator\ObjectProperty

la dernière implémentation standard de Zend Framework 2. Pour que cet hydrator fonctionne, il suffit que la propriété soit publique. En revanche TOUTES les propriétés publiques seront extraites...

```php
class MonObjet
{
    public $prop1 ; // sera hydraté et sera extrait
    protected $prop2 ; // ne sera pas hydraté et ne sera pas extrait
}
```

Grâce aux hydrators, vous avez désormais transformés le résultat de la requête de votre **TableGateway** en un objet.

Soit vous le faites en deux temps :

```php
public function fetchAll()
{
    // en principe, ces dépendances sont déclarées dans le Service Manager.
    $this->hydrator = new Zend\Stdlib\Hydrator\ClassMethods<span style="color: #339933;">;</span>
    $this->objet = new MON_MODULE\Entities\Objet ;
    $this->tableGateway = new Zend\Db\TableGateway\TableGateway ('Produit', $dbAdapter) ;
    
    // on récupère le tableau des résultats de la requête.
    // resultSet sera la classe ResultSet par défaut de Zend Framework
    $resultSet = $this->tableGateway->select() ;

    // on construit un autre tableau contenant cette fois des objets.
    $collection = array() ;
    foreach($resultSet as $result)
    {
        $collection[] = $this->hydrator->hydrate($result, $this->object) ;
    }
    return $collection ;
}
```

Prétendons que nous avons une table `Produit` sur laquelle pointe notre `tableGateway`. La table `Produit` a 15 enregistrements.

Prétendons que les dépendances sont gérées dans le **Service Manager** et correctement injectées là où il faut (`Module.php` ou `module.config.php`)

`$resultSet` devrait être un premier tableau contenant 15 tableaux associatifs (chaque tableau = un enregistrement de la table `Produit`).

On peut accéder à un champ de chaque enregistrement en faisant `$resultSet[$i]['nomProduit']`

`$collection` devrait donc en principe être un autre tableau de la même taille que `$resultSet` mais contenant cette fois 15 objets (chaque objet = un enregistrement de la table `Produit`).

Pour accéder à un champ de chaque enregistrement, on ferait `$collection[$i]->getNomProduit()` (évidemment, la méthode correspond aux méthodes définies dans l'objet `$objet`).

Soit on le fait en un temps :

```php
public function fetchAll()
{
    // en principe, ces dépendances sont déclarées dans le Service Manager.
    $this->objet = new MON_MODULE\Entities\Objet ;
    $this->hydrator = new Zend\Stdlib\Hydrator\ClassMethods ;
    $this->resultSet = new Zend\Db\ResultSet\HydratingResultSet($this->hydrator, $this->objet) ;
    $this->tableGateway = new Zend\Db\TableGateway\TableGateway ('Produit', $dbAdapter, null, $this->resultSet) ;
    
    // on récupère le tableau des résultats de la requête.
    // resultSet sera la classe HydratingResultSet tel que défini au moment où on a construit notre TableGateway
    $resultSet = $this->tableGateway->select() ;

    foreach($resultSet as $result)
    {
        echo ($result instanceOf MON_MODULE\Entities\Objet) ; // TRUE
    }
}
```

Et voila, en deux coups de cuillères à pot, c'est fait...

### Presque fini

Evidemment, ça c'est l'explication du modèle simple : un objet = une table et hop, roulez jeunesse ! Forcément, dans la vraie vie, un objet = une multitude de tables, ne serait ce que les tables de références où vous aurez qu'une liste d'ID dans votre table initiale et qu'il va falloir les valeurs de chaque ID...

Du coup, ma conclusion, c'est qu'il faut rajouter un niveau de manipulation après encore, un niveau dans lequel on aggrègerait les objets les uns avec les autres pour enfin obtenir un objet propre, complet et manipulable par l'application.

Dans l'état actuel de ma réflexion, ça reviendrait à faire quelque choses comme ça :

```php
foreach($produitsResultSet as $produit)
{
    $categorie_id = $produit->getCategorieId() ;
    $produit->setCategoryObject($categoriesResultSet->getById($categorie_id)) ; // attention, getById() ne génère pas de requête SQL, c'est une recherche dans le tableau $categoriesResultSet uniquement, plus de lien avec la base de données à ce niveau
    $produit->setRayonObjet($rayonsResultSet->getById($produit->getRayonId()) ;
}
```

Je ne suis pas vraiment convaincu que ce soit la stratégie à faire, mais pour le moment, j'en suis là...

### Reflexions pour la fin

NB : En principe vous avez deux jeux d'hydrator : l'hydrator qui fait la conversion entre l'enregistrement MySQL et votre objet et un second hydrator qui fait la conversion entre votre objet et les champs d'un formulaire HTML. Typiquement, encore une fois, vous verrez l'intérêt quand vous commencerez à manipuler les dates.

Dans la base de données : type **DATETIME**

Dans l'objet : classe `DateTime()`

Dans le formulaire : *string*

De la base de données vers l'objet -> on passe d'une *string* (`Y-m-d H:i:s`) vers `new DateTime() ;` (hydratation)

De l'objet vers le formulaire -> de préférence, on ne convertit pas à ce moment là. Le formatage doit se faire dans les aides de vues. De mémoire, les aides de vues des `Zend\Form\Element\Date` font très bien ce boulot. (extraction)

Du formulaire vers l'objet -> on passe d'une *string* (par ex `d/m/Y`) vers `new DateTime() ;` (hydratation)

De l'objet vers la base de données -> on passe de **DateTime** à une *string* formatée (`Y-m-d H:i:s`) (extraction)

Il est impossible de faire quelque chose d'évolutif si vous faites l'économie d'un hydrator.

Pour ceux qui utilisent **Doctrine**, ils n'ont qu'un seul hydrator à développer (celui qui se situe entre l'objet et le formulaire), mais en fait, **Doctrine** gère dans sa librairie l'autre hydrator. Du coup, en pratique, ils ont EFFECTIVEMENT deux hydrators...

Sur ce, ceux qui auraient une proposition à me faire sur comment mapper mes objets élégamment, je suis preneur... la plupart des réponses que j'obtiens est : **Doctrine** fait ça très bien... ce qui n'est pas une réponse en soit à mon sens.
