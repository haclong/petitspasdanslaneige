---
title: "CI - Intégration Continue avec ContinuousPHP"
permalink: "fr/posts/ci-integration-continue-avec-continuousphp.html"
date: "2016-12-17T09:12"
slug: ci-integration-continue-avec-continuousphp
layout: post
drupal_uuid: 15628497-a127-4fc0-b696-23c8b8f4eff4
drupal_nid: 163
lang: fr
author: haclong

media:
  path: /img/teaser/9363900-los-engranajes-de-los-viejos-billetes.jpg

tags:
  - "intégration continue"
  - "zend framework 3"
  - "TDD"
  - "phpunit"
  - "continuousPHP"
  - "bitbucket"

sites:
  - "Développement"

summary: "Suite à mon laius sur l'intégration continue, je poste mes notes sur le paramétrage que j'utilise sur ContinuousPHP."
---

Pour ceux que ça peut intéresser, je vais vous donner le paramétrage utilisé pour un projet Zend Framework 2+ avec <a href="https://continuousphp.com/" target="_blank">ContinuousPHP</a>

## Caractéristiques du projet

- **Dépôt de sources sur Bitbucket**
- **Framework Zend Framework MVC Skeleton v 3.0.2dev installé avec Composer**

C'est une installation minimale mais avec <a href="https://getcomposer.org/" target="_blank">**Composer**</a>, j'ai ajouté les packages qui m'intéressaient. Les nouveaux packages ont été inscrits dans le fichier `composer.json`. Pour les tests, il faut penser à ajouter <a href="https://docs.zendframework.com/zend-test/" target="_blank">**zend-test**</a>

```sh
composer require zendframework/zend-test
```

- **Suite de tests PHPUnit**

C'est la librairie <a href="https://phpunit.de/" target="_blank">**PHPUnit**</a> qui est utilisée pour faire des tests unitaires. Si vous créez un nouveau module pour votre application (ce que j'ai fait), il faut désormais gérer l'autoloading de votre module et des fichiers de tests dans le fichier `composer.json`.

**RAPPEL** : Lorsqu'on créait un nouveau module dans ZF2 anciennement, on rajoutait un snippet dans chacune de nos classes `Module` pour que notre module soit automatiquement chargé au besoin. Cela permettait au framework de faire la correspondance entre un nom d'espace et son chemin dans le système de fichiers.

```php
// module/MonModule/Module.php

Class Module {
  public function getAutoloaderConfig()
  {
    return array(
      'Zend\Loader\StandardAutoloader' => array(
        'namespaces' => array(
          __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
        ),
      ),
    ) ;
  }
}
```

Désormais, on ne rajoute plus le code ci-dessus dans les classes `Module` mais ce code directement dans le fichier `composer.json` :

```json
// composer.json
  
  "autoload": {
    "psr-4": {
      "Application\\": "module/Application/src/",
      "MonModule\\": "module/MonModule/src/"
    }
  },
  "autoload-dev": {
    "psr-4": {
      "ApplicationTest\\": "module/Application/test/",
      "MonModuleTest\\": "module/MonModule/test/"
    }
  },
```

Evidemment, même si on ne le fait pas trop, vous êtes libre de donner le nom que vous souhaitez pour votre espace de nom. Maintenant, c'est sûr que ce serait moins se couper les cheveux en quatre si l'espace de nom correspondait au nom du module... Je dis ça, mais je dis rien...

Afin que ce soit clair pour tout le monde, on est bien d'accord :

```json
// composer.json
 
  "autoload": {
    "psr-4": {
      ...,
      "MonModule\\": "module/MonModule/src/"
    }
  },
```
désigne le chemin où se situent les sources de votre module et
```json
// composer.json
  
  "autoload-dev": {
    "psr-4": {
      ...,
      "MonModuleTest\\": "module/MonModule/test/"
    }
  },
```
désigne le chemin où se situent vos tests unitaires.

Assurez vous également que vos fichiers de tests sont bien ajoutés au paramétrage de PHPUnit (qui ne puise pas ses informations dans `composer.json` mais dans le `phpunit.xml.dist`).

```xml
// phpunit.xml.dist

<phpunit colors="true">
  <testsuites>
    <testsuite name="ZendSkeletonApplication Test Suite">
      <directory>./module/Application/test</directory>
    </testsuite>
    <testsuite name="MonModule Test Suite">
      <directory>./module/MonModule/test</directory>
    </testsuite>
  </testsuites>
</phpunit>
```

- **Utilisation d'une base de données MySQL**

La présence de la base de données est intéressante parce que cela signifie qu'il y a forcément un fichier `config/autoload/dbadapter.local.php` qui contient les informations - sensibles - de la chaîne de connexion à la base de données et qui a été ignoré par git pour des raisons évidentes de sécurité.

Le fichier `config/autoload/dbadapter.local.php` contient en principe le nom du serveur de base de données, le user, le mot de passe pour accéder à la base de données.

En principe, git ignore ce fichier parce qu'on lui a dit que tous les fichiers `*.local.php` ne doivent pas être commités (règle de sécurité de base, incluse par défaut dans le framework et visible dans le fichier `.gitignore`) :

```php
// .gitignore
local.php
*.local.php
```

On est bien d'accord, si vous souhaitez exécuter votre application SANS ce fichier de configuration `dbadapter.local.php`, vous allez FATALEMENT obtenir une exception.

En même temps, vous voulez faire de l'intégration continue. Donc vous voulez FATALEMENT installer votre projet à la volée et exécuter ledit projet A CHAQUE FOIS.

Voyons comment.

## S'identifier sur Continuous PHP

Pour commencer, il faut s'identifier sur **ContinuousPHP** avec un compte **github** / **bitbucket** / **gitlab**. De toutes évidences, il faut utiliser le compte sur lequel se trouve vos sources.

Lorsque vous vous identifierez pour la première fois, **ContinuousPHP** va demander votre autorisation pour faire plein de choses (assez effrayantes au demeurant) sur votre compte **<a href="https://bitbucket.org/">Bitbucket</a>**. Vous n'avez que deux choix possibles : soit la pilule rouge et vous êtes d'accord (pour tout dans son intégralité) et vous continuez, soit la pilule bleue et tout s'arrête là.

A votre accord, **ContinuousPHP** va récupérer la liste de tous les dépôts que vous avez sur votre compte **github** / **bitbucket** / **gitlab**. Cliquez sur `[Setup]` (face au projet que vous souhaitez intégrer avec **ContinuousPHP**) pour continuer. Ainsi **ContinuousPHP** saura OÙ sont vos sources (souvenez vous, il faut dire au serveur d'intégration OÙ sont les sources pour qu'il puisse faire ce qu'il a à faire).

Qu'on soit bien d'accord, **ContinuousPHP** n'a pas vocation de transformer votre projet, de modifier votre projet ou d'y faire quoique ce soit. Il n'y a aucune modification opérée dans vos fichiers. Concernant **Bitbucket** (parce que c'est mon cas), il y a éventuellemment des modifications sur votre compte **Bitbucket** afin que **ContinuousPHP** puisse accéder au compte.

## Paramétrage du build

Maintenant que **ContinuousPHP** sait où sont vos sources, on va lui demander d'installer notre projet. On choisit à ce moment là quelle branche **ContinuousPHP** doit surveiller. Comme c'est un projet monté sur un framework moderne, il y a forcément des dépendances qui ne sont pas présentes dans les sources mais dont l'application a besoin pour fonctionner (typiquement, les modules Zend Framework qui vont bien pour faire tourner A MINIMA le socle MVC de base.)

Avec **ContinuousPHP** (comme avec d'autres), on peut lui demander d'installer le projet sur plusieurs instances différentes de PHP. On peut donc en profiter pour tester l'installation du projet sur plusieurs versions différentes de PHP.

Il est toujours bon, dans le cadre d'une application web, d'indiquer au serveur d'intégration continue quel est le fichier web principal (en principe, le fichier `index.php` qui lance l'application). Dans le cadre d'un MVC Skeleton de Zend Framework, le *Document Root* est `/htdocs/index.php`

Je n'ai (pour le moment) eu aucune utilité pour les rubriques **Environment Variables**, **Phing**, **Shell Scripts**, **Credentials**, **SSH Keys** et **HTTP Basic Authentication**. En revanche, pour l'installation des dépendances, c'est l'affaire de **Composer**. En principe, avec la présence du fichier `composer.json`, **ContinuousPHP** devrait pré-remplir ce champ. Les options "*Enable caching of Composer packages*" et "*Run Composer Hooks*" sont cochés.

## Paramétrage des tests

Maintenant que **ContinuousPHP** sait comment installer le projet, on va pouvoir lui dire d'exécuter les tests.

Avec la présence du fichier `phpunit.xml.dist` et `phpcs.xml`, **ContinuousPHP** a détecté qu'on avait des tests unitaires et qu'on souhaitait également tester la qualité de notre code. Ainsi dans le paramétrage des tests de **ContinuousPHP**, le serveur a bien pris en compte des tests **PHPUnit** ainsi que des tests **PHPCS**. Comme je n'ai rien de prêt et sérieux pour **PHPCS**, j'ai désactivé cette partie là et ai choisi délibéremment de me concentrer sur les tests unitaires. Mais rien ne vous empêche de tester la qualité de votre code.

Concernant **PHPUnit**, on choisit que les tests soient bloquant (on coche la case) et on dit que le fichier de bootstrap de **PHPUnit** est effectivement `phpunit.xml.dist`.

Arrivé à ce moment, vous n'arriverez pas à exécuter votre projet. A l'exécution, vous allez attrapper une exception concernant l'absence de chaîne de connexion à la base de données.

Afin d'y arriver, il va falloir apporter quelques modifications à notre projet et y ajouter quelques scripts.

#### Créer le script de connexion à la base de données.

Il faut tout d'abord le script de connexion à la base de données (le fameux fichier `config/autoload/dbadapter.local.php` qui nous fait défaut).

Moi j'ai opté pour un script dans lequel je me proposais de créer un fichier `dbadapter.local.php` à partir d'une chaîne de caractères. Comme c'est un script, j'ai décidé également de stocker tous mes scripts dans un répertoire `scripts/` qui sera commité par **git**. Evidemment, dans le cadre de l'intégration continue, la base de données qui va être installée ne va être installée que temporairement, le temps d'exécuter le projet et ses tests. A la fin du build, il ne restera plus rien de cette base. Pour accéder à cette base temporaire créée à la volée au moment où on exécute le projet, la documentation de **ContinuousPHP** nous donne les <a href="https://continuousphp.com/documentation/databases/mysql/" target="_blank">informations de la chaîne de connexion</a> sur le serveur Mysql utilisé par **ContinuousPHP**.

```sh
// scripts/continuousphp_dbadapter.config.sh
#!/bin/bash

cat > ../config/autoload/dbadapter.local.php << EOF
<?php

return [
 'db' => [
 'adapters' => [
 'MyDbAdapter' => [
 'driver' => 'Pdo_Mysql',
 'database' => 'mydatabase',
 'dsn' => 'mysql:dbname=mydatabase;host=localhost',
 'username' => 'root',
 'password' => '',
 'driver_options' => [
 PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''
 ],
 ],
 ],
 ],
];
EOF
```

Il faudra veiller à ce que ce script soit bien inclus dans les sources du projet afin de pouvoir l'envoyer jusqu'au serveur **ContinuousPHP**.

Dans la configuration du build dans **ContinuousPHP**, on va ouvrir l'onglet **Tests Settings** et ajouter un premier script **Shell** :

On donne les droits d'exécution sur le script `scripts/continuousphp_dbadapter.config.sh`

```sh
cd scripts &amp;&amp; chmod 764 continuousphp_dbadapter.config.sh
```

Le script `scripts/continuousphp_dbadapter.config.sh` qu'on va exécuter maintenant va créer le fichier `config/autoload/dbadapter.local.php`

```sh
cd scripts &amp;&amp; ./continuousphp_dbadapter.config.sh
```

Notez qu'il faut RETOURNER dans le répertoire `scripts/` puisqu'à chaque script, on repart à la racine du projet.

Si vous ne vous êtes pas trompé dans votre script, le fichier `dbadapter.local.php` est bien installé dans le bon dossier `config/autoload/`

#### Maintenant installer la base de données.

Pour installer la base de données, nous avons besoin d'un second script :

```sh
// scripts/continuous_db_create.sh
#!/bin/bash

mysqladmin -u root create mydatabase

mysql --user=root mydatabase < mydatabase.sql
```

en s'assurant que le script `mydatabase.sql` est bien envoyé vers **ContinuousPHP** également. Pour ma part, on trouvera le fichier `mydatabase.sql` dans le répertoire `scripts/` et c'est le fichier sql obtenu à l'exportation à partir de phpMyAdmin. Comme je n'ai pas besoin de tester les données de la base de données (pour le moment), le fichier .sql ne contient que la structure de la base de données.

Dans **ContinuousPHP**, toujours dans le paramétrage des tests, on va également ajouter :

```sh
cd scripts &amp;&amp; chmod 764 continuous_db_create.sh
```

et

```sh
cd scripts &amp;&amp; ./continuousphp_db_create.sh
```

## Paramétrage du package

Nos tests sont enfin prêts. Il faut maintenant choisir le format du package.

Pour ma part, je n'ai pas trouvé d'options intéressantes à ce jour sur le paramétrage du package. J'ai choisi **Generic Tarball** pour le type de package et j'ai laissé les valeurs par défaut (majoritairement des champs laissés vides) et je suis passé directement sur le paramétrage du déploiement.

## Paramétrage du déploiement

Je n'ai rien fait à cette étape. J'ai bien essayé de rajouter des scripts afin que le projet, une fois qu'il a passé avec succès les tests, soit mergé et poussé vers une branche de prod par exemple mais **ContinuousPHP** ne permet pas de le faire.

## Le déroulement

Lorsque vous poussez votre code sur votre dépôt **Bitbucket**, **ContinuousPHP** va s'en apercevoir.

- Il va cloner vos sources vers plusieurs instances dédiées à votre build (une pour chaque version de PHP sur laquelle vous souhaitez tester votre projet)
- Il va lancer `php -d memory_limit=-1 composer install -o --no-interaction --ansi --no-progress` afin d'installer toutes les dépendances
- Il va faire pointer le serveur web vers le fichier `htdocs/index.php` comme indiqué
- Il va exécuter les scripts concernant la base de données sur chacune des instances

```sh
cd scripts &amp;&amp; chmod 764 continuousphp_dbadapter.config.sh
cd scripts &amp;&amp; chmod 764 continuous_db_create.sh
cd scripts &amp;&amp; ./continuousphp_db_create.sh
cd scripts &amp;&amp; ./continuousphp_dbadapter.config.sh
```

- Il va lancer `phpunit`

Une fois que tous les tests auront été joués, **ContinuousPHP** va effacer tous les fichiers temporaires, la(es) base(s) de données, le projet intégralement. Il ne restera plus que les packages téléchargeables :

Le package de déploiement comprenant :
- l'intégralité de vos sources (le répertoire `scripts/` qui fait parti de votre projet),
- pas de fichier `config/autoload/dbadapter.local.php`
- l'intégralité des packages des dépendances installés par **Composer** (soit tous les modules Zend Framework nécessaires etc...)

quelques fichiers en plus :

- `continuousphp.package`
- `phing.phar`

- Le package utilisé pour les tests. En fonction du paramétrage que je vous ai présenté, j'obtiens exactement les mêmes fichiers que pour le package de déployment. Mais je suppose qu'il doit y avoir des versions où on devrait obtenir des fichiers temporaires en plus.

- Les rapports de coverage sur chaque version de PHP si vous souhaitez que **phpUnit** vous calcule le taux de coverage de vos tests

- Les rapports de tests pour chaque version de PHP.

## Rajoutez le calcul de couverture des tests.

Pour que **PHPUnit** calcule le taux de couverture de vos tests, il faut ajouter un filtre dans le fichier de paramétrage de phpUnit

```xml
// phpunit.xml.dist

  <filter>
    <whitelist processUncoveredFilesFromWhitelist="true">
      <directory suffix=".php">module/Application/src</directory>
      <directory suffix=".php">module/MonModule/src</directory>
    </whitelist>
  </filter>
```
Et voila !!

C'est un long post mais j'espère qu'il va être utile pour certains d'entre vous.

Mon prochain post sur l'intégration continue va concerner le server Go CD.
