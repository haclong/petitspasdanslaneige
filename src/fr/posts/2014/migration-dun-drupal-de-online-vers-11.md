---
title: "Migration d'un Drupal de Online vers 1&1"
permalink: "fr/posts/migration-dun-drupal-de-online-vers-11.html"
date: "2014-09-16T13:02"
slug: migration-dun-drupal-de-online-vers-11
layout: post
drupal_uuid: b0620208-04a2-4fa2-89f3-202d7ccd0d0f
drupal_nid: 90
lang: fr
author: haclong

media:
  path: /img/teaser/goutte.jpg

tags:
  - "1&1"
  - "Drupal"
  - "migration"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Changement d’hébergeur pour un site Drupal. Comme j’ai bien galéré, peut être finalement que ce que j’ai fait peut être utile à d’autres."
---

Changement d’hébergeur pour un site Drupal. Comme j’ai bien galéré, peut être finalement que ce que j’ai fait peut être utile à d’autres.

### Préparer le site

Récupérer les fichiers du répertoire `sites/`.

Faire un dump de la base de données. De préférence sans les données des tables caches.

### Uploader le site sur 1&amp;1

Installer un Drupal vierge, de préférence, la version de votre site (si le site n’était pas à jour à la migration).

ATTENTION !! ne pas utiliser leur Drupal en un clic… Installer Drupal vous même avec votre serveur FTP. Vous aurez la maîtrise des fichiers. Face aux problèmes de la migration, j’avoue avoir été prêt de craquer et de prendre leur solution, mais vous devez perservérer. Vous finirez par y arriver...

Sur 1&amp;1, pour que les règles de réécriture Apache fonctionne, il faut corriger la ligne `RewriteBase /` dans le fichier `.htaccess` à la racine de Drupal.

Uploader les fichiers du répertoire `sites/`.

Importer les données de la base de données.

Editer le fichier `sites/default/settings.php` et corriger les informations de la base de données.

Lancer votre site Drupal dans votre navigateur. Toutes vos informations devraient apparaître ok.

### Les vérifications de base.

Hormis les vérifications de type :

- les nodes s’affichent,
- on peut rajouter des articles,
- on peut rajouter des commentaires

Voici les différentes vérifications qui peut être utile de faire.

**Installation de nouveaux modules**

Vérifier que le formulaire pour installer les nouveaux modules à partir d’un URL fonctionne toujours.

**Module Backup and Migrate**

J’ai un module Backup and Migrate qui écrit dans le système de fichiers. Evidemment, si l’utilisateur de Backup and Migrate (probablement l’utilisateur Apache ?) n’a pas les droits pour écrire sur le disque, c’est mort.

Après avoir épluché et retourné toutes les permissions de mes répertoires, j’ai fini par faire, dans le désordre :

- Désinstaller la version Backup and Migrate 7.x-2.8
- Réinstaller avec Backup and Migrate 7.x-3.0.
- Aller dans** Configuration > Media > File system** et définir le chemin pour les fichiers private (privés).

En faisant cela, Drupal va créer le répertoire et lui donner les droits qui vont bien. J’ai préféré créer un tout nouveau répertoire privé parce que Drupal change les droits des répertoires et rajoute des fichiers `.htaccess`. Or, si vous étiez chez **Online**, vous savez que vous aviez du bidouiller ces mêmes fichiers parce qu’**Online** n’admettait ni les instructions `Options FollowSymLinks` ni `SetHandler`.

- Aller dans **Reports > Status report** et reconstruire les droits d’accès…
- Tester avec un backup manuel. Ca devrait fonctionner.

A toutes fins utiles, voici les permissions des répertoires :

- Le owner = compte utilisateur 1&amp;1
- Le groupe = groupe d’utilisateur FTP

| drupal/ | 755 |
| drupal/sites/ | 755 |
| drupal/sites/default/ | 555 |
| drupal/sites/default/files/ | 775 |
| drupal/sites/default/files/private/ | 705 | 
| drupal/sites/default/files/private/backup_migrate/ | 705 | 
| drupal/sites/default/files/private/backup_migrate/manual/ | 775 |

Normalement, si vous faites une install propre à partir du zip de Drupal, toutes les permissions devraient être gérées par Drupal.

**Les fichiers .htaccess**

Vous trouverez ce fichier `.htaccess` dans les répertoires suivants :

- `drupal/sites/default/files/prive/backup_migrate/manual`
- `drupal/sites/default/files/prive`

```sh
Deny from all
# Turn off all options we don't need.
Options None
Options +FollowSymLinks
# Set the catch-all handler to prevent scripts from being executed.
SetHandler Drupal_Security_Do_Not_Remove_See_SA_2006_006

<Files *>
  # Override the handler again if we're run later in the evaluation list.
  SetHandler Drupal_Security_Do_Not_Remove_See_SA_2013_003
</Files>

# If we know how to do it safely, disable the PHP engine entirely.
<IfModule mod_php5.c>
  php_flag engine off
</IfModule>
```

Vous trouverez ce fichier `.htaccess` dans le répertoire suivant

- `drupal/sites/default/files/`

```sh
# Turn off all options we don't need.
Options None
Options +FollowSymLinks
# Set the catch-all handler to prevent scripts from being executed.
SetHandler Drupal_Security_Do_Not_Remove_See_SA_2006_006

<Files *>
  # Override the handler again if we're run later in the evaluation list.
  SetHandler Drupal_Security_Do_Not_Remove_See_SA_2013_003
</Files>

# If we know how to do it safely, disable the PHP engine entirely.
<IfModule mod_php5.c>
  php_flag engine off
</IfModule>
```

**Le champ Image avec le navigateur de média**

Je n’ai pas eu de problème pour accéder au navigateur de média, uploader un nouveau fichier et l’afficher par la suite.

**Insertion d’images dans le corps d’un article avec le navigateur de média.**

Il est possible d’insérer des images dans le corps d’un article en combinant le module **WYSIWYG**, **Media** et la librairie **CKEditor version 3.6.5.7647**.

En paramétrant le module **WYSIWYG** en utilisant un bouton **navigateur de média**, on peut accéder à la bibliothèque de media et insérer des images à partir de cette bibliothèque dans le corps de l’article OU ajouter des contenus média à ladite bibliothèque.

<u>**L’upload dans la bibliothèque de média fonctionne bien.**</u>

Pour tester :

- ajouter un contenu,
- aller dans le champ corps du contenu,
- cliquer sur le bouton de la barre WYSIWYG navigateur de média,
- choisir un fichier media de votre disque local,
- cliquer sur Upload
- valider

Le navigateur de média va disparaitre.

L’image ajoutée à la bibliothèque apparaît dans le corps de l’article.

Si on rouvre la bibliothèque de média (pour ajouter une autre image par ex), la nouvelle image apparaît dans la bibliothèque de média.

**<u>L’insertion de média existant dans la bibliothèque.</u>**

Pour tester :

- ajouter un contenu,
- aller dans le champ corps du contenu,
- cliquer sur le bouton de la barre WYSIWYG navigateur de média,
- choisir un fichier media qui existe déjà dans la bibliothèque,
- valider.

Le navigateur de média va disparaitre.

L’image choisie apparaît dans le corps de l’article.

J’ai eu un peu du mal à obtenir ce résultat après la migration.

- aller dans **Configuration > Development > Performance** et vider les caches.
- aller dans **Configuration > Content authoring > Wysiwyg profiles**, éditer chacun des profils wysiwyg que vous avez défini et (ré)enregistrer les.
- aller dans **Configuration > Content authoring > Text format**, éditer chacun des formats de texte définis et (ré)enregistrer les.

Normalement, ça devrait refonctionner.

Je suis désolé si ces instructions ne débloquent pas votre migration. J’ai cliqué dans tous les sens et un peu partout et ça a fini par fonctionner et par élimination, je pense que ce sont ces actions qui ont finalement réussi à débloquer la situation.

Sur 1&amp;1, toutes ces fonctionnalités marchent. Si elles ne marchent pas sur votre site existant, il faut tenter de rafraichir, réinstaller, repartir à partir de données neuves…
