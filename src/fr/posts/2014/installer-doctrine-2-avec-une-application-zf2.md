---
title: "Installer Doctrine 2 avec une application ZF2"
permalink: "fr/posts/installer-doctrine-2-avec-une-application-zf2.html"
date: "2014-07-07T11:56"
slug: installer-doctrine-2-avec-une-application-zf2
layout: post
drupal_uuid: 3e31292f-87e9-4c84-be38-ea8822ed59ce
drupal_nid: 84
lang: fr
author: haclong

media:
  path: /img/teaser/ateneo03.jpg

tags:
  - "Doctrine"
  - "zend framework 2"
  - "modèle"
  - "Modules"
  - "architecture trois tiers"
  - "accès aux données"

sites:
  - "Développement"

summary: "Pour gérer la couche persistence des données, Zend Framework 2 propose Zend Db TableGateway. Zend Db TableGateway est un bon composant du framework mais demande un peu d'investissement. En remplacement au TableGateway, vous pouvez ajouter la librairie Doctrine à votre application.
"
---

Pour gérer la couche persistence des données, Zend Framework 2 propose <a href="http://framework.zend.com/manual/2.3/en/modules/zend.db.table-gateway.html" target="_blank">**Zend Db TableGateway**</a>. **Zend Db TableGateway** est un bon composant du framework mais demande un peu d'investissement. En remplacement au **TableGateway**, vous pouvez ajouter la librairie <a href="http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/" target="_blank">**Doctrine**</a> à votre application.

### Doctrine

**Doctrine** a ses partisans et ses détracteurs. Une fois que le paramétrage est fait, **Doctrine** fait les choses toutes seules... c'est magique.

Magique et donc super pratique... Certains n'aimeront pas le côté magique. D'autres en seront fans... Mais pour choisir votre camp, il faut l'installer, bien sûr.

### Prérequis

Vous avez installé <a href="https://github.com/zendframework/ZendSkeletonApplication" target="_blank">**Zend Skeleton Application**</a> (encore lui). Et vous avez <a href="https://getcomposer.org/" target="_blank">**composer**</a> installé.

### Installation

Vérifier que votre version de **composer** est toujours d'actualité :

```sh
sudo php composer.phar self-update
```

Installer le module **Doctrine**.

Ce module installera toutes les dépendances qui vont bien, la librairie **Doctrine** au passage donc.

```sh
sudo php composer.phar require doctrine/doctrine-orm-module:0.7.*
```

Pendant votre développement, vous aurez besoin du module **zend-developer-tools** afin de vérifier que la magie de **Doctrine** ne génère pas des requêtes un peu trop lourdes par exemple.

```sh
sudo php composer.phar require zendframework/zend-developer-tools:dev-master
```

Copier le fichier de config de **Zend Developer Tools** dans le répertoire d'autoload de configuration.

```sh
sudo cp vendor/zendframework/zend-developer-tools/config/zenddevelopertools.local.php.dist config/autoload/zdt.local.php
```

Mettre le fichier d'index à jour

```php
// public/index.php
define('REQUEST_MICROTIME', microtime(true));
```

Une fois que toutes les librairies sont installées, n'oublions pas de les activer.

```php
// config/application.config.php

return array(
  'modules' => array(
    'DoctrineModule',
    'DoctrineORMModule',
    'ZendDeveloperTools',
    'Application',
  ),
) ;
```

### Configuration

Configuration de **Doctrine** :

```php
// module/MON_MODULE/config/module.config.php

<?php
return array(
  'doctrine' => array(
    'driver' => array(
      // vous êtes libre de mettre la clé que vous voulez ici pour déclarer ce que sont et où sont vos entités
      'MON_MODULE_entities' => array(
        // Doctrine admet d'autres classes pour paramétrer les entitées (YAML ou XML)
        // voir la doc de Doctrine
        'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
        'cache' => 'array',
        // Chemin où on trouvera la définition de les entités de votre modèle
        'paths' => array(__DIR__ . '/../src/MON_MODULE/pathToEntities'),
      ),
      // cette clé semble être obligatoire et fixe
      'orm_default' => array(
        'drivers' => array(
          // pour être PSR, le namespace va forcément correspondre au path déclaré plus haut.
          'MODULE_NAMESPACE\pathToEntities' => 'MON_MODULE_entities',
        ),
      ),
    ),
  ),
);
```

Configurer la connection à la base de données

```php
// config/autoload/doctrine.local.php
// ne pas oublier .local. pour que le fichier soit ignoré par git (vérifier le fichier config/autoload/.gitignore si nécessaire)

<?php
return array(
  'doctrine' => array(
    'connection' => array(
      // veillez à ce que ce soit la même clé que dans le fichier module.config.php
      'orm_default' => array(
        // Doctrine a d'autres drivers. Voir la doc
        'driverClass' => 'Doctrine\DBAL\Driver\PDOMySql\Driver',
        'params' => array(
          'host' => 'YOUR_HOST',
          'port' => 3306,
          'user' => 'YOUR_MYSQL_USER',
          'password' => 'YOUR_USER_PASSWORD',
          'dbname' => 'YOUR_BASE_NAME',
          'driverOptions' => array('1002' => 'SET NAMES utf8') // UTF-8 support
        ),
      ),
    ),
  ),
);
```

Voila ! **Doctrine** est installé.

Bon, installé, c'est bien, mais comment l'utiliser ?

### Faire de vos entités des entités reconnues par Doctrine

Souvenez vous, nous avons dit que le driver pour mapper nos entités était **AnnotationDriver** (voir le fichier `module.config.php`).

Du coup, dans chacune de nos entités, nous allons rajouter les annotations style **Doctrine** qui vont bien.

```php
// /module/MON_MODULE/src/MON_MODULE/pathToEntities/MonObjet.php

<?php
namespace MON_MODULE\pathToEntites ;

use Doctrine\ORM\Mapping as ORM ;

// Toutes les annotations Doctrine telles que décrite dans leur documentation doivent être déclarée dans l'espace de nom ORM
/**
 * @ORM\Entity // dans la doc de Doctrine, l'annotation est @Entity tout court
 * @ORM\Table (name="mysql_table") // @Table dans la documentation Doctrine
 */
class MonObjet
{
    /**
     * @ORM\Column(type="string", length=32, name="nom_de_ma_colonne")
     */
    protected $propriete ;
}
```

Ajoutez également les annotations pour chacune des propriétés de votre objet (propriétés qui a un sens dans la base de données, bien sûr).

Si vos tables existent déjà, pour chacune des entités, rajoutez l'annotation `@Table (name="nom_de_votre_table")`.

Si le nom de vos champs ne corresponds pas au nom de la propriété, rajoutez pour chaque propriété avec un nom différent l'annotation `@Column (name="nom_de_votre_colonne")`.

Pour les types **Doctrine**, voir <a href="http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/reference/basic-mapping.html#doctrine-mapping-types" target="_blank">leur doc</a> mais c'est assez basique en fait.

Une fois que vous avez paramétré vos entités pour **Doctrine**, il faut maintenant déclarer **Doctrine** dans notre **Service Manager**.

### Charger Doctrine dans le Service Manager

**RAPPEL**

<a href="http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/tutorials/getting-started.html" target="_blank">La doc de **Doctrine**</a> dit de créer son **EntityManager** quand on bootstrappe **Doctrine** (extrait de la documentation de **Doctrine**)

```php
// bootstrap.php original de Doctrine, hors framework

<?php
use Doctrine\ORM\EntityManager ;

// ... plein d'autres choses ici

// bootstrapper l'entity manager
$entityManager = EntityManager::create($conn, $config) ;
```

Dans **Doctrine**, quand on a créé son **EntityManager**, on peut ensuite l'utiliser (toujours extrait de la documentation de **Doctrine**)

```php
//list_products.php

<?php
require_once "bootstrap.php";

$productRepository = $entityManager->getRepository('Product') ;
$products = $productRepository->findAll() ;

foreach($products as $product) {
    echo sprintf("-%s\n", $product->getName()) ;
}
```

Pour faire la même chose dans une application Zend Framework 2, il faut créer (*boostrapper*) son **EntityManager**. En fait, à l'installation des modules **Doctrine** et **Doctrine ORM**, ceux ci ont chargé la librairie **Doctrine** (et ses dépendances), mais chacun des modules a également chargé plusieurs services dans le **Service Manager**, notamment l'**EntityManager** de **Doctrine**. Du coup, le module **Doctrine ORM** nous a déjà créé notre **EntityManager**, il ne reste plus qu'à l'utiliser.

Pour utiliser l'**EntityManager** de **Doctrine**, il faut (comme toujours dans Zend Framework 2 finalement), savoir comment accéder à son **Service Manager**. A partir du moment où on peut récupérer le **Service Manager**, on récupère au passage l'**EntityManager**.

Si vous voulez accéder à l'**EntityManager** de **Doctrine** directement (à partir de vos controleurs par ex, ce n'est toutefois pas conseillé) :

```php
// /module/MON_MODULE/src/MON_MODULE/Controller/IndexController.php

<?php
namespace MON_MODULE\Controller ;

use Zend\Mvc\Controller\AbstractActionController ;

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        $em = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager') ;
    }
}
```

Le nom `Doctrine\ORM\EntityManager` est créé dans la configuration du **Service Manager** dans le module **Doctrine ORM**.

Mon utilisation plus courante, est de d'injecter l'**EntityManager** dans mes services qui l'utilisent, à partir de la classe `Module` de mon module.

```php
// /module/MON_MODULE/Module.php

<?php
namespace MON_MODULE ;

use MON_MODULE\Mapper\MonObjetMapper ;

class Module
{
    public function getAutoloaderConfig() {} // vous savez ce qu'il y a ici

    public function getConfig() {} // vous savez ce qu'il y a ici

    public function getServiceConfig() 
    {
        'factories' => array(
            'MonObjetMapper' => function($sm) {
                $entityManager = $sm->get('Doctrine\ORM\EntityManager') ;
                return new MonObjetMapper($entityManager) ;
            },
        );
    }
}
```

```php
// /module/MON_MODULE/Mapper/MonObjetMapper.php

<?php
namespace MON_MODULE\Mapper ;

use Doctrine\ORM\EntityManager ;

class MonObjetMapper
{
    protected $entityManager ;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager ;
    }

    // pour accéder à un repository dans Doctrine
    $this->repository = $this->entityManager->getRepository('MON_MODULE\pathToEntities\MonObjet') ;

    // pour récupérer toute la table 
    $this->repository->findAll() ;

    // pour récupérer un enregistrement par l'ID
    $this->repository->find($id) ;

    // pour mettre à jour un enregistrement 
    $this->entityManager->flush() ;

    // pour créer un nouvel enregistrement
    $this->entityManager->persist(new MonObjet()) ;
    $this->entityManager->flush() ;

    // pour supprimer un enregistrement
    $this->entityManager->remove($objet) ;
    $this->entityManager->flush() ;
}
```

Voilà.

Evidemment, **Doctrine** ne se limite pas à ces quelques lignes...

En gros, on conçoit nos objets.

On installe **Doctrine**.

On fait le mapping en expliquant pour chacun de nos objets où sont stockées les données dans la base de données. Cette partie fait la force de **Doctrine**, je dois le reconnaître. Pour ce que j'ai vu (survol rapide de la doc, pas d'expérimentations très poussées), **Doctrine** gère beaucoup de type de modèles de données différents et donc permet au concepteur de faire librement son architecture sans être trop contraint. De plus, **Doctrine** peut générer la base de données à partir du paramétrage que vous aurez mis dans vos objets (base de données toute neuve donc) ou bien **Doctrine** s'adapte à votre base de données et à vos champs (base de données existantes).

Dans le code, on appelle l'**Entity Manager** de **Doctrine**, on va chercher les repository correspondant à nos objets pour faire des SELECT dedans. Sinon, on se contente de manipuler nos propres objets. Ce n'est qu'à la fin du process qu'on dit à **Doctrine** de sauvegarder toutes les opérations (en une fois) dans la base de données.

Et c'est tout.

J'ai eu des avertissements toutefois. **Doctrine** fait lui même ses requêtes. Du coup, il faut un peu surveiller ce qu'il fait. En plus, le requêtage dans **Doctrine** est tellement simplifier qu'on arrive vite à oublier ce que ça représente. Du coup, on peut s'oublier et confondre simplicité de l'API et complexité des exécutions. Evitez par exemple de faire un SELECT dans un premier repository, faire une boucle foreach sur ce premier résultat, et requêter un second repository à chaque itération de la boucle... **Doctrine** a beau être magique, vous mettrez la machine à genoux quand même...

Si vous avez des modèles trop complexes, **Doctrine** parle un peu le requêtage avec un langage à lui : le DQL... genre SQL en plus fonctionnel... qu'on pourra utiliser pour finetuner nos requêtes au cas où (je pense aux jointures notamment). Encore une fois, **Doctrine** fait les jointures... mais certains modèles de données complexes peuvent avoir trop de jointures complexes... ça vaut peut être le coup de faire une jointure manuelle directement plutôt que de laisser **Doctrine** démêler les fils de vos associations...
