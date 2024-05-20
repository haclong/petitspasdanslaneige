---
title: "Composer avancé"
permalink: "fr/posts/composer-avance.html"
date: "2014-09-05T15:17"
slug: composer-avance
layout: post
drupal_uuid: 7bef63cf-7abc-4542-b853-614d5a5c4f07
drupal_nid: 88
lang: fr
author: haclong

media:
  path: /img/teaser/Composer-A-Dependency-Manager-for-PHP-1030x360.jpg
  credit: "getcomposer"

tags:
  - "composer"
  - "dépôt"
  - "repository"
  - "développement"
  - "automatisation"

sites:
  - "Développement"

summary: "Composer quand on commence à l’utiliser, on est plutôt consommateur. On l’installe, on l’utilise pour installer les projets, pour installer les dépendances et voilà… Mais voilà, on finit par se dire : ce qui est bien pour les autres, serait tout aussi bien pour moi…

Je n’ai pas la prétention de pouvoir mettre un de mes packages à dispo pour la communauté… Cependant, j’aimerais bien que mes petits modules soient dispo, à minima, pour ma propre utilisation. "
---

**Composer**, quand on commence à l’utiliser, on est plutôt consommateur. On l’installe, on l’utilise pour installer les projets, pour installer les dépendances et voilà… Mais voilà, on finit par se dire : ce qui est bien pour les autres, serait tout aussi bien pour moi…

Je n’ai pas la prétention de pouvoir mettre un de mes packages à dispo pour la communauté… Cependant, j’aimerais bien que mes petits modules soient dispo, à minima, pour ma propre utilisation.

### Composer ready

Veillez à ce que votre librairie / module / code soit **PSR-0** compliant. Cet aspect du code doit avoir été prévu dès le début. Ce n’est pas au moment de décider d’utiliser **Composer** qu’il faut s’inquiéter des normes de votre code.

Ensuite, tout ce que vous avez à faire, c’est de nommer votre module. **Composer** admet des noms de packages au format `{vendor}/{package}`. Le *vendor*, c’est vous… donnez votre nom, vos initiales, votre alias… pour la sémantique, c’est comme une marque et pour le côté pratique, c’est pour éviter que deux packages qui porteraient le même nom (user ou client par ex) puissent être confondus.

Créez un fichier `composer.json` dans votre module et déclarez y **le nom de votre package**.

```json
// composer.json

{
    "name": "vendor/package"
}
```

Et c’est (presque) tout.

Si vous bricolez tout à la main parce que vous n’avez pas un process d’intégration continue bien rodé (comme moi), vous allez devoir ajouter **le numéro de version** à la main dans le fichier `composer.json`

```json
// composer.json

{
    "name": "vendor/package",
    "version": "version"
}
```

Déclarez votre **namespace** (c’est plus propre)

```json
// composer.json

{
    "autoload": {
        "psr-4"|"psr-0": {
            "Namespace\\": "/path/to/files"
        }
    }
}
```

Entre les normes **psr-4** et **psr-0**, il y a une subtile différence. Je vous invite à voir les docs associées : celle de <a href="https://getcomposer.org/doc/04-schema.md" target="_blank">Composer</a> et celles de la norme <a href="http://www.php-fig.org/psr/psr-0/" target="_blank">psr-0</a> et <a href="http://www.php-fig.org/psr/psr-4/" target="_blank">psr-4</a>. **PSR-4** étant la dernière arrivée, il y a fort à parier qu’elle va rester pour durer.

Après, c’est que de l’optionnel.

**Votre module a des dépendances ?**

```json
// composer.json

{
    "require": {
        "vendor/package": "version",
        "vendor/package2": "version",
    }
}
```

**Votre module est en conflit avec un autre package, ne fonctionne pas avec ?** Signalez le.

```json
// composer.json

{
    "conflict": {
        "vendor/package": "version",
        "vendor/package2": "version",
    }
}
```

**Pour une meilleure utilisation de votre module, vous pensez que l’installation d’autres packages serait un must ?** 

```json
// composer.json

{
    "suggest": {
        "vendor/package": "explication",
        "vendor/package2": "explication",
    }
}
```

Vous comptez déployer votre module à la communauté ? **Ajoutez des métadonnées** :

```json
// composer.json

{
    "description": "description du package",
    "keywords": {
        "tag1",
        "tag2"
    },
    "homepage": "http://site_web_du_projet",
    "license": "la licence qui va bien",
    "authors": [
        {
            "name": "nom de l'auteur",
            "email": "son email",
            "homepage": "son site",
            "role": "son role dans le projet"
        }
    ],
    "support": {
        "email": "boite.mail.du.support@domaine.tld",
        "issues": "http://url_du_site_issue_tracker",
        "forum": "http://url_du_forum",
        "wiki": "http://url_du_wiki",
        "irc": "irc://serveur/channel",
        "source": "http://url_où_trouver_les_sources_du_projet"
    }
}
```

### Pas encore prêt pour Packagist ?

Mais voici la partie qui nous intéresse le plus : personnaliser le dépôt.

Par défaut, **Composer** récupère les packages qu’il installe à partir de <a href="http://packagist.org" target="_blank">**Packagist**</a>. Cela veut notamment dire que si vous souhaitez utiliser **Composer**, il faudra publier vos modules sur **Packagist**.

Mais attendez… On n’avait pas dit qu’on était timide, que notre module n’était pas prêt à être partagé dans la communauté ? Mais alors, que faire ?

Heureusement, **Composer** admet d’autres dépôts.

#### Github / Bitbucket

Si vous utilisez **github** (ou **bitbucket**), vous pouvez dire à **Composer** que votre module ne se trouve pas sur **Packagist** mais plutôt sur **github** (ou **bitbucket**).

```json
// composer.json

{
    "repositories": [
        {
            "type": "vcs",
            "url": "https://github.com/path/to/project"
        }
    ]
}
```

#### Dépôt local

Vous pouvez également dire à **Composer** que votre module se trouve sur votre machine locale. Et ça, c’est ce qui nous intéresse le plus pour le moment.

```json
// composer.json

{
    "repositories": [
        {
            "type": "artifact",
            "url": "/path/to/local/repository/"
        }
    ]
}
```

Et voila !!

##### Vous développez des petits modules perso cuisinés aux petits oignons et vous souhaitez pouvoir intégrer ces modules sur vos projets

Il faut :

1. que le module soit impérativement zippé
2. que le zip soit déposé dans `/path/to/local/repository`
3. qu’à la racine du module, il y ait impérativement un fichier `composer.json` avec au minimum le nom du package et son numéro de version.

```json
// composer.json du module

{
    "name": "vendor/package",
    "description": "Module pour app ZF2",
    "version": "0.1",
    "autoload": {
        "psr-0": {
            "module_namespace": "src/"
        },
        "classmap": [
            "./Module.php"
        ]
    }
}
```

##### Vous souhaitez utiliser un de vos modules perso 

```json
// composer.json du projet

{
    "name": "vendor/projet",
    "description": "Projet avec module perso en local",
    "require": {
        "php": ">=5.3.3",
        "zendframework/zendframework": "2.2.*", // package sur Packagist
        "vendor/package": "0.1", // module perso en local
        "vendor/package2": "1.0" // module perso sur github
    },
    "repositories": [
        {
            "type": "artifact",
            "url": "/path/to/local/repository"
        },
        {
            "type": "vcs",
            "url": "https://github.com/vendor/package2"
        }
    ]
}
```

##### Vous souhaitez créer un projet installable intégralement par Composer (la commande composer create-project)

Il faut :

1. que votre projet soit zippé
2. que le zip soit déposé dans `/path/to/local/repository`
3. qu’à la racine du module, il y ait impérativement un fichier `composer.json` avec au minimum le nom du package et son numéro de version.
4. que votre projet figure dans un fichier `package.json`

```json
// packages.json dans le repository

{
    "package": {
        "name": "vendor/project",
        "version": "1.0",
        "dist": {
            "url": "path/to/project.zip",
            "type": "zip"
        }
    }
}
```

Pour l’installer :

```sh
 composer create-project -sdev 
       --repository-url="/path/to/local/repository/packages.json" 
        vendor/project path/to/install
```

Et tadaaa !! Très utile si vous souhaitez personnaliser le Zend Framework Skeletton par ex, en y intégrant d’autres librairies par défaut et créer des frameworks de projets plus rapidement.

***NOTE***: pourquoi `composer install` et `composer create-project` ?

**composer install**

- crée un répertoire `vendor/` (s’il n’existe pas déjà),
- installe la dépendance,
- ajoute le namespace de la dépendance dans le fichier d’autoload

C’est prêt à utiliser.

**composer create-project**

- copie/colle l’arborescence de fichiers de votre projet (répertoire `app/`, `config/`, `datas/`, `modules/`, `public/`, `vendor/` et tout le bataclan),
- crée si nécessaire le répertoire `vendor/`,
- installe les dépendances du projet,
- ajoute le namespace de chacune des dépendances dans le fichier d’autoload

C’est prêt à utiliser.

En d’autres termes, très très rapidement dit, la différence entre les deux, c’est la présence du fichier `index.php` initial. Si vous avez un fichier `index.php` dans le .zip, c’est que vous avez très probablement besoin de `composer create-project`. Si vous n’avez pas de fichier `index.php`, c’est que vous avez besoin de `composer install`…

*C’est affreux ce que je viens de dire… Les raccourcis, c’est bien, sauf quand c’est fait comme un barbare… C’est comme dire Star Wars, c’est l’histoire d’un gars qui cherche son père et qui le retrouve quand son père va mourir…*
