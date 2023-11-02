---
title: "Insérer des vidéos YouTube dans un site Drupal 7"
permalink: "fr/posts/inserer-des-videos-youtube-dans-un-site-drupal-7.html"
date: "2015-06-30T06:45"
slug: inserer-des-videos-youtube-dans-un-site-drupal-7
layout: post
drupal_uuid: c43b824b-5dc0-42bf-a9a1-7eccac4bf44c
drupal_nid: 138
lang: fr
author: haclong

media:
  path: /img/teaser/logo-drupal-name.jpg
  credit: "Drupal"

tags:
  - "drupal 7"
  - "Media 2"
  - "YouTube"
  - "WYSIWYG"

sites:
  - "Développement"
  - "Haclong projects"
  - "Footprints in the snow"

summary: "Dans les anciennes versions du module Media, il suffisait d'installer le module Media: YouTube pour avoir facilement (sic) une vidéo Youtube insérée dans son article. Depuis la version 2 du module Media, ce n'est pas aussi simple... Il a fallu que je fouille un peu. "
---

Dans les anciennes versions du module **Media**, il suffisait d'installer le module **Media: YouTube** pour avoir facilement (sic) une vidéo Youtube insérée dans son article. Depuis la **version 2** du module **Media**, ce n'est pas aussi simple... Il a fallu que je fouille un peu.

Finalement, la **version 2** du module **Media** offre une gestion plus pointue de la librairie de fichiers de votre site. Plus pointue, donc plus de liberté. Plus de liberté, le champ des possibles s'élargit considérablement, il faut donc s'attendre à trouver plus de paramétrages.

## Faire l'installation

Installer **Drupal 7**.

Installer et activer les modules

- **Media** 7.x-2.0-alpha4
- **Media Internet Sources** 7.x-2.0-alpha4
- **Media: YouTube** 7.x-3.0
- **File entity** 7.x-2.0-beta1
- **Wysiwyg** 7.x-2.x

Installer une **librairie Wysiwyg**

- Télécharger <a href="http://ckeditor.com/download" target="_blank">CKEditor 3.6.5.7647</a>
- Dézipper l'archive et la déposer en FTP à l'adresse `sites/all/libraries/ckeditor`

## Paramétrer l'éditeur wysiwyg

Allez dans `Configuration > Wysiwyg profiles`

De base, Drupal s'installe avec trois formats de texte : le *Filtered HTML*, le *Full HTML* et le *Plain Text*.

- Editez successivement le *Full* et le *Filtered HTML*.
- Rajoutez dans les boutons le bouton **Media Browser** (ou **Explorateur de médias**).

A titre indicatif, j'ai laissé les autres options telles quelles mais vous pouvez les modifier.

Maintenant qu'on a ajouté le bouton **Media browser** à notre **éditeur Wysiwyg**, il faut modifier les filtres des formats textes.

## Modifier les filtres textes

Allez dans `Configuration > Text formats`

- Pour chacun des formats pour lesquels on a activé le bouton **Media browser**, cliquez sur configurer
- Activez le filtre "*Convertir les balises Media en balises HTML*".

Dans l'ordre de priorisation des filtres, je l'ai positionné après la conversion des URL en liens et le filtre des balises HTML autorisées mais vous pouvez tester un autre ordre. Méfiez vous toutefois qu'un filtre ne modifie pas l'HTML d'un filtre précédent.

- Enregistrez

## Rajouter le type de média Youtube

Allez dans `Structure > File types`

- Ajoutez un type de fichier
- **Nom** : *Youtube*
- **Description** : le contenu du site Youtube
- **Mimetypes** : *video/youtube* (Drupal va remplacer ce faux mimetype par les vrais)
- Enregistrez
- Editez maintenant votre nouveau type de fichier Youtube.

Pas la peine en principe d'ajouter de champs supplémentaires, passons directement à la gestion de l'affichage de notre video Youtube.

Typiquement, et cela va fonctionner de paire :

#### Je veux que la video soit lisible à l'intérieur du corps de l'article. C'est le mode WYSIWYG.

- **Manage Display** (Gérer l'affichage) **>** **mode WYSIWYG** : Le format du champ "**File**" doit être "*Visible*"
- **Manage File Display** (Gérer l'affichage des fichiers) **> mode WYSIWYG** : Les affichages possibles vont être **YouTube Video** en priorité et **YouTube Preview Image** au cas où. Pour la configuration de **Youtube Preview Image**, choisir "*None (original image)*". Faites les paramétrages que vous préférez pour la configuration du format **YouTube video**.

#### Je veux pas que la video soit visible à partir de la liste des articles. C'est le mode Teaser.

- **Manage Display** (Gérer l'affichage) **> mode Teaser** : le format du champ "**File**" doit être "*Hidden*"

#### Je veux que la video soit visible comme une image fixe dans l'explorateur de média et dans la liste des contenus media. C'est le mode Preview.

- **Manage Display** (Gérer l'affichage) **> mode Preview** : le format du champ "**File**" doit être "*Visible*"
- **Manage File Display** (Gérer l'affichage des fichiers) **> mode Preview** : les affichages à choisir sont **YouTube Preview Image**. Pour sa configuration, choisir le même **image_style** que pour les autres images de votre librairie, si vous souhaitez que les formats soient harmonisés.

Sauvegardez à chaque fois.

## Configurer les types de fichiers disponibles dans l'explorateur de media

Allez dans `Configuration > Media browser settings` (Paramètres de l'explorateur de média)

- Assurez vous que votre nouveau type de fichiers Youtube est coché dans la liste des **Allowed types in WYSIWYG**
- Enregistrez

Si vous avez une configuration pour le mode d'affichage Wysiwyg, il vous reste à paramétrer le menu `Configuration > Media Wysiwyg View Mode`. Pour ma part, je n'ai rien de particulier dans ce menu.

## Ajouter une vidéo à votre contenu

Maintenant, lorsque vous ajoutez un nouveau contenu et que vous ajoutez un fichier média à votre article,

- cliquez sur le bouton** Media browser** de votre **éditeur Wysiwyg**.
- dans l'**onglet Web**, copiez l'adresse de votre **video Youtube**
- cliquez sur **suivant**
- à l'écran suivant, choisissez l'**affichage** comme **WYSIWYG**
- cliquez sur le bouton **Soumettre**

La video est insérée dans votre article.
