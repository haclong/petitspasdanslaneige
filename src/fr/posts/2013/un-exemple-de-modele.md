---
title: "Un exemple de modèle"
permalink: "fr/posts/un-exemple-de-modele.html"
date: "2013-03-15T13:48"
slug: un-exemple-de-modele
layout: post
drupal_uuid: b4c1abc5-6cd0-41c1-b897-6f93adfa6d05
drupal_nid: 29
lang: fr
author: haclong

media:
  path: /img/teaser/600_prometheus-prom-007_rgb1.jpg
  credit: "20th century fox"

tags:
  - "OOP"
  - "modèle"
  - "architecture logicielle"

sites:
  - "Développement"

summary: "En suivant les principes SOLID et en me basant sur les réflexions de Rob Allen et de Matthew Weier O'Phinney, je vais vous présenter le modèle objet que j'ai choisis de monter."
---

En suivant les <a href="http://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29" target="_blank">principes SOLID</a> et en me basant sur les réflexions de <a href="http://akrabat.com/zend-framework/on-models-in-a-zend-framework-application/" target="_blank">Rob Allen</a> et de <a href="http://www.mwop.net/blog/202-Model-Infrastructure.html" target="_blank">Matthew Weier O'Phinney</a>, je vais vous présenter le modèle objet que j'ai choisis de monter.

### Les différents types d'objets

Mon modèle est quasiment centralisé sur des objets **Domain**. Extrêmement simples à appréhender, il m'a fallu un peu plus de réflexion pour me convaincre qu'ils étaient un élément indispensable à toute mon architecture.

En effet, une partie de mes objets auront pour fonction de créer et alimenter mes objets **Domain** et l'autre partie de mes objets pourront les utiliser.

Les objets **Service**, les objets **Data** et les objets **Mapper** vont créer mes objets **Domain**. Cela signifie notamment qu'une fois que j'aurais construit mes objets **Domain**, je n'aurais plus à faire appel à eux.

Les objets **Gateway** ou les objets de l'application sont des objets de niveau supérieur. Ils ne savent manipuler que des objets **Domain** : ils les utilisent et leur appliquent des règles métiers.

Au delà de ces objets, j'ai des objets **Helpers**, des **Snippets** etc...

Pour ceux qui sont intéressés de savoir comment j'ai fait pour en arriver là, je vous invite à lire <a href="/fr/posts/cerner-le-modele.html" target="_blank">mon post précédent</a> sur le sujet.

### L'objet Domain

Sans aller jusqu'à dire que les objets **Domain** sont le coeur de mon modèle, ils en forment au moins un élément pivot.

Chacun des objets Domain ne contiennent que les propriétés de l'objet, quelques méthodes et les accesseurs et les mutateurs pour chacune des propriétés. Je pourrais faire des objets beaucoup plus simple et beaucoup plus souples, en définissant par défaut les méthodes magiques `__get()` et `__set()` mais je souhaite que la liste des propriétés d'un objet Domain ne soit pas extensible.

J'ai opté pour des propriétés protégées (`protected`). Certains préfèreront utiliser un tableau php `$data` pour lequel chacune des clés du tableau seront une des propriétés de l'objet.

Pour construire l'objet, j'ai choisi d'utiliser des méthodes publiques `$this->set{propertyName}($propertyValue)`. Mais je dois bien reconnaître que j'hésite avec la construction de mon objet en passant un tableau php au constructeur de l'objet. Cette seconde option me permettrait de construire mes objets **Domain** beaucoup plus rapidement. En contrepartie, dans le constructeur de mon objet, je serais obligée d'ajouter des tests if/else pour vérifier que le tableau que je passe en argument a bien les clés correspondantes aux propriétés de mon objet...

```php
// un objet Domain actuellement

class My_Domain_User
{
    protected $_nom ;
    protected $_prenom ;
    protected $_dob ;

    public function setNom($value)
    {
        $this->_nom = $value ;
    }
    public function getNom()
    {
        return $this->_nom ;
    }
}

// Eventuellement, un objet Domain demain
class My_Domain_User
{
    protected $_nom ;
    public function __construct($array)
    {
        if(array_keys_exists('nom', $array))
        {
            $this->_nom = $array['nom'] ;
        }
    }
    public function getNom()
    {
        return $this->_nom ;
    }
}
```

Comme mentionné plus haut, vous avez plusieurs façons de créer votre objet **Domain**. Ce qui compte, c'est que l'objet **Domain** doit juste contenir les informations sur l'objet. Il n'essaie pas de trouver des informations, il n'essaie pas de trier des objets. Tout au plus, dans le cadre d'un site de vente par exemple, l'objet peut avoir une méthode de type `total()` dans lequel il multiplierait le prix unitaire de l'objet fois la quantité de l'objet... Je n'ai pas encore bien réfléchi à ce cas mais je pense que j'articulerais la situation en deux objets domain : d'un côté, l'objet "produit" qui comprend son prix unitaire et de l'autre, l'objet "élément du panier" qui comprend le produit et la quantité du produit.

L'objet **Domain** peut avoir une propriété qui est elle-même un autre objet **Domain**. Par exemple, un objet **Domain** "User" peut avoir une propriété de type "Date de naissance". Cette propriété peut elle même être un objet **Domain** "Date". L'objet **Domain** Date comprenant toutes les méthodes pour manipuler les dates et les reformater à la volée, il est plus judicieux de stocker dans l'objet User une date comme un objet Date...

Parmi les objets **Domain** remarquables que j'ai créé, il faut noter l'objet **Collection** d'une part et l'objet **Service_Response** d'autre part.

L'objet **Domain** **Collection** est un objet comptable, itérable etc... Il est en fait un tableau d'objets. Il va être utile notamment pour afficher la liste des utilisateurs. Ses méthodes principales vont être `addItemInCollection($item)` et `countItems()` par exemple.

L'objet **Service_Response** est un objet qui va être utilisé par les objets de type **Service**. Il va contenir plusieurs propriétés de type `$_success`, `$_domain`, `$_error`.

```php
 // Un brouillon de mon objet Service_Response

class Service_Response
{
    protected $_success = FALSE ;
    protected $_domain ;
    protected $_error ;

    public function Succeeded()
    {
        $this->_success = TRUE ;
    }

    public function isSuccess()
    {
        return $this->_success ;  
    }
    
    public function Failed($error_message)
    {
        $this->_error = $error_message ;
    }
    
    public function setDomain($domain)
    
    public function getDomain()
}
```

Dans les grandes lignes, l'objet **Service_Response** va ressembler à ça. En fonction de ma réflexion, c'est un objet qui a tendance à disparaître puis à réapparaître. Mais s'il disparaît, ses différentes méthodes seront nécessairement transmises à un autre objet du même type. De même, la propriété `$_error` va surement se finaliser par un objet **Domain** **Error** composé d'un code et d'un message avec des méthodes de type `getCode()` et `getMessage()`.

Comme on peut le constater, ne serait-ce que pour la partie **Domain**, il y a encore long à dire mais je pense que l'essentiel est dit.

### L'objet Service

L'objet **Service_Response** nous permet habilement d'introduire les objets de type **Service**.

Les objets de type **Service** sont, contrairement aux objets **Domain** qui sont centralisés sur leurs propriétés, axés sur leurs méthodes.

Mes objets **Service** retournent invariablement, sauf erreur, un objet **Domain**. Là encore, en cours de conception, j'ai deux façons d'y parvenir mais dans les grosses mailles, à la sortie d'un objet **Service**, on pourra trouver l'objet **Domain** "promis". Les méthodes de mes objets **Service** seront du type `getUserFromDatabase()`, `findDisabledUser()` etc...

```php
// Objet Service retournant un objet Service_Response

class My_Service_User
{
    public function getUserById($id)
    {
        $response = new My_Domain_Service_Response() ;
        // operation pour récupérer My_Domain_User() ;
        
        // On a récupérer My_Domain_User() sans problème 
        $response->succeeded() ; // la propriété $_success = TRUE maintenant
        $response->setDomain($user) // $user = l'instance de My_Domain_User() obtenu plus tôt
        return $response ; // Rappelez vous, c'est un objet Domain Service_Response
    }
}
```

Vous vous en doutez bien, l'objet **Service** **User** est utilisé par un autre objet, de niveau supérieur.

```php
// Objet de niveau supérieur utilisant My_Service_User

class My_Application_Class
{
    public function findUser($id)
    {
        $service = new My_Service_User() ;
        $response = $service->getUserById($id) ;

        if($response->isSuccess())
        {
             $user = $response->getDomain() ;
             return $user ;
        }
        else
        {
             return $response->getError() ;
        }
    }
}
```

Comme mentionné plus tôt, je suis actuellement dans la phase "oui-il-me-faut-l'objet-Service-Response".

Revenons rapidement à l'objet **My_Service_User**. Comme on le sait, le service est instancié, il fait sa tambouille et il retourne un objet **Domain**. Mais que fait il exactement ? En fait, tel que je le vois, mon objet **Service** va chercher l'objet **Data** qui va bien, demander à l'objet **Data** de retourner les informations brutes et l'objet **Service** utilisera l'objet **Mapper** pour transformer les informations brutes en objet Domain.

```php
// Objet Service retournant un objet Service_Response

class My_Service_User
{
    public function getUserById($id)
    {
        $response = new My_Domain_Service_Response() ;

        // operation pour récupérer My_Domain_User() ;
        $dataSource = new My_Datas_A_User() ; // on instancie un objet Data qui gère l'accès aux données brutes
        $datas = $dataSource->findById($id) ; // on requête la source pour récupérer les données brutes
        $mapper = new My_Mapper_User() ; // on instancie un objet Mapper
        $user = $mapper->mapFromSourceA($datas) ; // l'objet Mapper retourne l'objet Domain attendu
        
        // On a récupérer My_Domain_User() sans problème 
        $response->succeeded() ; // la propriété $_success = TRUE maintenant
        $response->setDomain($user) // $user = l'instance de My_Domain_User() obtenu plus tôt
        return $response ; // Rappelez vous, c'est un objet Domain Service_Response
    }
}
```

Et voila.

Evidemment, en fonction des cas, on peut ajouter des tests et des contrôles pour vérifier que tout s'est bien passé. Par exemple, avant d'invoquer l'objet **Mapper**, on peut tester si l'objet **Data** retourne au moins un résultat.

Si on rappelle le principe de **Single responsability**, je m'interroge sur la responsabilité de mon service : est ce que j'attends de mon service qu'il me retourne un objet **Domain**, auquel cas je créerais quasiment un objet **Service** par objet **Domain** ou bien est-ce que j'attends de mon service qu'il me retourne un "objet **Domain** extrait d'une source donnée", auquel cas, je manipulerais autant d'objet **Service** qu'il y a de source de données fois d'objet **Domain**. Ce qui va déterminer le choix final, ce seront les impacts dans les scenarii de maintenance : dans le cas d'un objet **Service** unique par objet **Domain**, si je modifie une source, est-ce que cela va avoir des conséquences sur les autres méthodes de mon objet **Service** ? Et dans l'autre cas, si je modifie mon objet **Domain**, est-ce que je devrais intervenir sur les nombreux objets **Service** qui retournent l'objet **Domain** (en fonction de la source). J'ai tendance à penser que je vais organiser mes objets **Service** en fonction des sources de datas. Tout d'abord parce qu'en fonction des sources de datas, je ne serais peut être pas amenée à utiliser les mêmes méthodes protégées : si les sources de type BDD sont bien gérées par les librairies existantes, les sources de types fichiers plats auront nécessairement besoin d'un script pour parser le fichier et les sources de type DOM auront également des librairies dédiées pour extraire les informations du flux XML.

Organiser les objets **Services** en fonction de l'objet **Domain** attendu _ET_ des sources de datas va probablement m'aider à respecter le principe de **substitution de Liskov** et le principe **ouvert/fermé**.

Enfin bref, comme tout, ça se joue entre le temps que ça va prendre pour l'écrire et le temps que ça va prendre pour le maintenir.

### L'objet Data

L'objet **Data** se subdivise en plusieurs sous catégorie en fonction des besoins de l'application. Si l'application est basée sur une base de données, alors les objets **Data_Db** seront construits. Dans le cadre d'un développement avec Zend Framework, les objets **Data_Db** hériteront de **Zend_Db_Table_Abstract** et en fonction des méthodes, retourneront soit un objet de type **Zend_Db_Table_Row_Abstract** soit un objet de type **Zend_Db_Table_Rowset_Abstract**. Si l'application utilise des sources de données issues de WebServices, alors il faudra utiliser des objets **Data_WS** par ex. Si l'application a des données stockées sur fichier .csv ou sur des fichiers XML, alors il faudra construire les objets associés. On peut même imaginer que des données sont stockées sur un cookie ou bien en session...

Chacun des objets **Data** ont pour seule et unique fonction de se connecter sur la source de données (base de données, source du webservice, chemin du fichier plat) et de retourner les données qu'on cherche à récupérer.

Cette règle respecte _au moins_ le principe de **Single responsability**. Un objet ne fait qu'une et une seule chose : on souhaite récupérer des données, il nous récupère nos données. Brutes. En utilisant une judicieuse couche d'abstraction, on peut même rêver qu'on a réussi à satisfaire le principe de **Dependency inversion**. Je dois reconnaitre que c'est l'un des principes que j'ai le plus de mal à appliquer...

### L'objet Mapper

Appelé par l'objet **Service**, l'objet **Mapper** va assurer la conversion des données brutes obtenues avec l'objet **Data** en un objet **Domain**. C'est grâce aux objets **Mapper** que je vais pouvoir récupérer un véritable objet **Domain**. En fait, je pourrais me passer des objets **Mapper**. La conversion se ferait alors directement dans les objets **Service**. Il suffit de créer un objet **Service** avec deux ou trois méthodes pour s'apercevoir que l'objet **Mapper** devient vite indispensable.

En terme de responsabilité, je me demande encore si c'est au mapper de gérer les valeurs par défaut (en cas où il manquerait certaines valeurs) ou si c'est l'objet **Datas** qui doit prendre en charge les valeurs en défaut... Ca reste à voir.

### En pratique

Nous avons vu que les objets de niveau supérieur font appel à un objet **Service**. La méthode qui sera utilisée ramènera le ou les objets Domain attendus. L'objet **Service** fait appel à un objet **Data** et récupère l'objet **Domain** grâce à l'objet **Mapper**. Ensuite, les objets de niveau supérieur exploiteront les informations qui se trouveront dans l'objet **Domain**.

On peut l'utiliser évidemment dans les deux sens. L'objet **Service** proposera des méthodes de type `getUsers()` by différents critères mais également des méthodes de type `insert()` et `delete()`. Dans le sens `insert()`, il faut encore décider si on passe un tableau php en argument à la méthode, un objet **Domain** ou autre... C'est une question d'organisation finalement... Il faudra juste choisir une option et s'y tenir.
