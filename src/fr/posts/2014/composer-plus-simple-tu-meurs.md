---
title: "Composer, plus simple, tu meurs"
permalink: "fr/posts/composer-plus-simple-tu-meurs.html"
date: "2014-08-27T14:31"
slug: composer-plus-simple-tu-meurs
layout: post
drupal_uuid: 1319ef81-eeee-4e5f-a801-6aa8a44d240d
drupal_nid: 87
lang: fr
author: haclong

media:
  path: /img/teaser/nature-morte-6_2.jpg
  credit: "Stefano Paolini"

tags:
  - "composer"
  - "PHP"
  - "dépendances"
  - "librairies"
  - "développement"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Dernièrement, dans le monde PHP, un outil a vu le jour : Composer. Ce gestionnaire de dépendances se révèle extrêmement pratique et facile d’utilisation. Pourtant, il ne rencontre pas le succès escompté, notamment auprès des débutants."
---

Dernièrement, dans le monde PHP, un outil a vu le jour : **Composer**. Ce gestionnaire de dépendances se révèle extrêmement pratique et facile d’utilisation. Pourtant, il ne rencontre pas le succès escompté, notamment auprès des débutants.

## Les débutants ne l’utilisent pas.

Au mieux, **Composer** est mis de côté : *mmh, c’est intéressant, je verrais ça après…* Mais pourquoi voir ça “*Après*” puisque **Composer**, vous en avez besoin notamment pour installer (donc “*Avant*”)...

Au pire, ils l’évitent. J’ai l’impression qu’ils pensent qu’une installation avec **Composer** revient à dire : compilez le avant de l’utiliser…

J’ai déjà vu quelqu’un demander comment installer le Zend Framework Skeleton Application mais de manière simple, sans la version compliquée avec **Composer**…

J’ai vu quelqu’un d’autre qui voulait installer Doctrine mais “juste Doctrine”... parce que le manuel de Doctrine recommandait d’installer avec **Composer**…

De temps en temps, un débutant qui n’a pas encore compris ce qu’était Composer hurle : *où est le zip ? comment j’installe sans le zip ?*

### Mais avec Composer !

<a href="https://getcomposer.org/" target="_blank">**Composer**</a>, c’est un gestionnaire de dépendances.

**Composer** sait quelles sont les librairies dont vous avez besoin pour installer votre application.

Et quand vous vous lancez dans l’installation avec **Composer**, **Composer** va vous installer l’application qui va bien, puis il va télécharger toutes les librairies dont vous avez besoin pour utiliser votre application. Et, cerise sur le gâteau, **Composer** crée le fichier qui va bien pour gérer l’autoload… Plus la peine de faire des includes chaque fois que vous invoquez un nouvel objet. (enfin, si, il faudra faire l’include du premier fichier quand même…)

En fait, les gens semblent s’imaginer que **Composer** rajoute une couche de complication sur leur bon vieux PHP-do-it-yourself-bricolage-dans-le-garage… Alors qu’en fait, c’est plus simple que simple.

Tout ce que vous avez à faire, c’est de l’installer (ça peut être bien pour commencer).

L’installation étant dépendante du système sur lequel vous êtes, je ne pourrais vous parler que de l’installation sur système Unix (Ubuntu +12.x)

Ouvrez un terminal et tapez en ligne de commande :

```sh
 curl -sS https://getcomposer.org/installer | php
```

Normalement, vous devriez avoir (entre autre) téléchargé le fichier `composer.phar`.

Essayez maintenant de faire

```sh
 php path/to/composer.phar --help
```

L’aide de **Composer** devrait s’afficher.

Voilà, vous avez installé **Composer** avec succès.

Avant d’utiliser **Composer**, prenez l’habitude de le mettre à jour :

```sh
 php path/to/composer.phar self-update
```

C’est tout.

### Votre premier contact avec Composer

A n’en pas douter, votre premier contact avec **Composer** sera lorsque vous voudrez installer un projet et que la documentation va vous dire : *vous pouvez l’installer avec **Composer***. Selon les projets, soit vous aurez le .zip du projet à télécharger et ensuite, **Composer** chargera les dépendances du projet, soit vous n’aurez (presque) rien à faire et **Composer** installera les fichiers du projet ET ses dépendances.

**Voyons la première version qui nous rappelle nos belles heures :**

- télécharger le .zip (sur github ou n’importe où ailleurs)
- dézipper l’archive et installer les fichiers dans le répertoire de votre projet, sur votre serveur. En principe, il devrait y avoir un fichier `composer.json` présent. S’il n’est pas là, adressez vous à la team qui a développé le projet que vous cherchez à installer.

Ouvrez un terminal, allez dans le répertoire du projet et tapez :

```sh
 php path/to/composer.phar install
```

**Composer** installe toutes les dépendances du projet listées dans le fichier `composer.json` dans le répertoire `vendor/`.

Et voilà ! Y’a plus qu’à…

**Encore plus simple !** 

La documentation du projet que vous souhaitez installer ne vous fait pas du tout télécharger un fichier .zip.

Dans ce cas là, ouvrez un terminal et tapez la ligne de commande que vous donne la doc. Ca devrait en principe ressembler à ça :

```sh
 php composer.phar create-project {options} {projet} {path/to/install}
```

Et voilà. Projet installé, dépendances téléchargées… **tadaaaaa** !!

Franchement, faut tester… vous ne pourrez plus vous en passer… Simple, efficace… C’est si bon… Mais s’il n’y avait que ça, on n’en ferait pas tout un foin !! Non, y’a mieux !!

### Ajouter des librairies

Maintenant que vous savez installer un projet avec **Composer**, vous souhaitez ajouter des librairies à votre projet.

Tout d’abord, il vaut mieux identifier les librairies qui vous intéressent. Vous les trouverez principalement sur <a href="https://packagist.org/explore/" target="_blank">**Packagist**</a>. Tous les noms des packages sont composés du nom du *vendor* et du nom du *package*, séparés par un slash : `vendor/package`.

Lorsque vous consultez la page d’un package, vous aurez les différents numéros de version disponibles pour le package. Selon les besoins de votre projet, choisissez le numéro de version qui vous convient.

- Soit vous souhaitez travailler avec une seule version de la librairie, toujours la même (on ne sait jamais, vous ne souhaitez pas subir de dommages collatéraux suite à une mise à jour malencontreuse des autres dépendances…), on utilisera alors le numéro de version exact du package (versions mineures (les petites chiffres) comprises) : ***1.0.20***
- Soit vous souhaitez travailler avec une version majeure mais les versions mineures ne devrait pas poser de problèmes, il faudra utiliser le * : ***1.0.* *** ou même ***1.* ***
- Soit vous avez besoin d’une version minimum mais les prochaines mises à jour ne devrait pas vous poser de problème, il faudra utiliser ***>1.0*** ou ***>=1.0***. Le contraire est vrai, si votre projet ne fonctionne qu’avec des versions inférieures mais n’est pas compatible avec les versions supérieures : ***&lt;3.0*** ou ***&lt;=3.0***. Vous pouvez même mettre les deux pour définir un intervalle de versions acceptables ***>1.0, <=3.0***.
- Si vous voulez travailler avec une version de la librairie, accepter toutes les nouvelles mises à jour mais ne pas vous engager vers la prochaine version majeure par souci de compatibilité, vous pouvez utiliser l’opérateur ~ : ***~1.2&lt;***. C’est exactement la même chose que si vous aviez écrit l’intervalle ***>=1.2, <2.0***.

Revenez à votre projet et tapez dans le terminal

```sh
 php path/to/composer.phar require {vendor}/{package}:{version}
```

Cette commande `require` va rajouter la librairie dans votre fichier `composer.json` et installer la librairie. Et voila, vous pouvez l’utiliser.

Comme vous ajoutez des librairies à un projet que vous avez déjà installé avec **Composer**, le projet a déjà le code nécessaire pour autoloader les librairies qui suivent la norme PSR-0. A partir du moment que la nouvelle librairie est installée, vous pouvez l’utiliser dans votre code, sans rien ajouter.

Il se peut que vous ne sachiez pas quel est le *namespace*de votre nouvelle librairie. Vous le trouverez à deux endroits, soit dans le fichier `composer.json` de chacune des librairies installées dans `vendor/`, soit dans le fichier généré par **Composer** : `/vendor/composer/autoload_namespaces.php`

Dans le fichier `autoload_namespaces.php`, vous devriez voir un tableau php avec en clé le namespace et en valeur le chemin pour accéder à la librairie. Trouvez votre librairie, vous aurez le namespace.

Dans le fichier `composer.json`, une entrée mentionne *autoload*, puis *psr-0* ou *psr-4*. Le namespace est déclaré à cet endroit là.

*NOTE* : vous pouvez ajouter vos librairies à la main directement dans le fichier *composer.json* de votre projet si vous souhaitez. Il suffit de respecter la syntaxe json. Franchement, c’est pas la mort, ça se fait tout seul.

### Last but not least

**Composer** est plus que pratique pour installer les projets et les dépendances. Mais **Composer**, c’est encore mieux ! Régulièrement dans votre projet, faites

```sh
 php path/to/composer.phar update
```

Et hop, si une librairie a été mise à jour dans **Packagist**, elle va être mise à jour dans votre projet… Et, à moins d’avoir une mauvaise surprise de rétro compatibilité, ça devrait se passer tout seul…

Il existe des packages qui vont vous permettre de veiller à vos dépendances :

Le <a href="https://security.sensiolabs.org/" target="_blank">security checker de Sensiolabs</a> d’une part et <a href="https://www.versioneye.com/" target="_blank">Version Eye</a> d’autre part peuvent faire ça pour vous… Sinon, faire le check régulièrement fonctionne aussi très bien.

### Bonus

Sur les install *nix, petite cerise sur le gâteau, on va transformer notre binaire `composer.phar` en exécutable dans la console.

D’abord, ça va nous permettre de ne pas écrire

```sh
 php path/to/composer.phar install
```

mais plutôt

```sh
 composer install
```

C’est pas la classe ?

Allez, tout ce qu’il y a à faire, ouvrez votre console

```sh
 mv path/to/composer.phar /usr/local/bin/composer
 chmod +x /usr/local/bin/composer
```

Et Tadaaaaa… Fastoche je vous dis… fastoche...
