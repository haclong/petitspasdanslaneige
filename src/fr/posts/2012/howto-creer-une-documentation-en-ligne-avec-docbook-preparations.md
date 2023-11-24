---
title: "HOWTO - Créer une documentation en ligne avec DocBook  - Préparations"
permalink: "fr/posts/howto-creer-une-documentation-en-ligne-avec-docbook-preparations.html"
date: "2012-07-31T21:04"
slug: howto-creer-une-documentation-en-ligne-avec-docbook-preparations
layout: post
drupal_uuid: b56736ad-fc5f-4086-80f9-d7435c559b21
drupal_nid: 17
lang: fr
author: haclong

book:
  book: howto-creer-un-manuel-en-ligne-avec-docbook
  rank: 1,
  top: 
    url: /fr/books/howto-creer-un-manuel-en-ligne-avec-docbook.html
    title: HOWTO - Créer un manuel en ligne avec DocBook
  next: 
    url: /fr/posts/howto-creer-une-documentation-en-ligne-avec-docbook-le-fond.html
    title: HOWTO - Créer une documentation en ligne avec DocBook - Le fond

media:
  path: /img/teaser/old-books.jpg

tags:
  - "HOWTO"
  - "docbook"
  - "xml"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Malgré le fait que j'ai déjà exposé ici mes tentatives pour publier un document DocBook, mon but cette fois ci est de donner des instructions plus claires pour arriver à créer une vraie documentation DocBook."
---

Malgré le fait que j'ai déjà exposé ici mes tentatives pour publier un document DocBook, mon but cette fois ci est de donner des instructions plus claires pour arriver à créer une vraie documentation DocBook.

## Objet

Nous allons créer une documentation en ligne assez proche de ce qu'on peut trouver avec le <a href="http://fr.php.net/manual/fr/manual.php" target="_blank">manuel en ligne du site php.net</a>. Le contenu du livre va être réparti sur plusieurs pages HTML. Chaque section principale aura son propre sommaire. Les classes et les fonctions du livre vont pouvoir se référencer mutuellement. Nous serons capable de parcourir le livre de page en page ou bien de remonter au sommaire de la section courante.

## Prérequis

Pour faire une documentation **DocBook**, nous allons avoir besoin de :

- feuilles de style XSL pour mettre en forme notre livre
- un processeur XSL pour publier notre livre

Quant à vos compétences, vous devrez connaître :

- les bases concernant les <a href="http://www.w3.org/TR/REC-xml/" target="_blank">schémas XML</a> : la déclaration du type de document (Document Type Declaration), les notions de documents bien formés et valides
- les bases concernant <a href="http://www.w3.org/TR/xslt" target="_blank">la norme XSL</a> et <a href="http://www.w3.org/TR/xpath/">XPATH</a>
- les bases des <a href="http://www.w3.org/TR/CSS21/" target="_blank">CSS</a> également

Ces sujets ne seront pas du tout abordés dans ce tutoriel.

## Installer xsltproc sur un système Windows

Comme processeur XSL, nous allons installer **xsltproc** qui me semble être un processeur léger qui fonctionne en ligne de commande. Bien entendu, si vous avez déjà un processeur XSL sous la main, vous pouvez passer à l'étape suivante.

1. aller sur le <a href="http://www.zlatkovic.com/libxml.en.html" target="_blank">site de Igor Zlatkovic</a>
2. sur le site de Igor Zlatkovic, aller sur sa <a href="ftp://ftp.zlatkovic.com/libxml/" target="_blank">page de téléchargement (download area)</a>
3. télécharger les paquets suivants :

- `iconv-x.x.x.win32.zip`
- `libxml2-x.x.x.win32.zip`
- `libxslt-x.x.x.win32.zip`
- `zlib-x.x.x.win32.zip`

4. créer un répertoire `xsltproc/` sur votre poste
5. dézipper toutes les archives téléchargées dans le répertoire `xsltproc/`

Vous devriez obtenir ce type d'arborescence :

```
chemin/pour/xsltproc_rep/
---iconv-x.x.x.win32/
------bin/
------include/
------lib/
---libxml2-x.x.x.win32/
------bin/
------include/
---------libxml/
------lib/
---libxslt-x.x.x.win32/
------bin/
------include/
---------libexslt/
---------libxslt/
------lib/
---zlib-x.x.x/
------bin/
------include/
------lib/
```

6. copier/coller tous les fichiers `bin/*.dll` and `bin/*.exe` trouvés dans chacune des archives dans le répertoire `xsltproc/`

Vous devriez maintenant obtenir ce type d'arborescence dans le répertoire `xsltproc/`

```
chemin/pour/xsltproc_rep/
---iconv.dll
---iconv.exe
---libexslt.dll
---libxml2.dll
---libxslt.dll
---minigzip.exe
---xmlcatalog.exe
---xmllint.exe
---xsltproc.exe
---zlib1.dll
---iconv-x.x.x.win32/
------bin/
------include/
------lib/
---libxml2-x.x.x.win32/
------bin/
------include/
---------libxml/
------lib/
---libxslt-x.x.x.win32/
------bin/
------include/
---------libexslt/
---------libxslt/
------lib/
---zlib-x.x.x/
------bin/
------include/
------lib/
```

### Ajouter le répertoire xsltproc à la variable PATH

Dans la mesure où l'exécutable `xsltproc.exe` doit pouvoir être lancé de n'importe où sur le disque, nous allons rajouter le répertoire `xsltproc/` à la variable d'environnement `Path`.

Pour les utilisateurs de Windows XP,

1. aller ici : **Poste de travail > Propriétés > Avancé > Variables d'environnement**.
2. dans les **variables système**, éditer la variable de système `Path`
3. ajouter le chemin pour votre répertoire `xsltproc/` à la fin du champ **Valeur de la variable** (attention, elle peut être assez longue). Mettre un point virgule (;) pour séparateur et ne pas inclure le dernière slash du chemin.
4. redémarrer

Pour les autres utilisateurs Windows : merci de vous reférer à la documentation disponible en ligne pour réaliser cette étape.

## Installer xsltproc sur Ubuntu

Je suppose qu'un simple `apt-get xsltproc` fera tout à fait l'affaire...

## Récupérer le paquet de feuilles de style DocBook XSL

1. aller sur les <a href="http://sourceforge.net/projects/docbook/files/#files" target="_blank">pages de téléchargement du projet **DocBook XSL** sur Sourceforge</a>
2. aller dans le projet **docbook-xsl-ns** et choisissez la dernière version
3. télécharger l'archive (le .zip ou le .tar.bz2)
4. dézipper l'archive

## Préparer votre répertoire

Maintenant que le processeur XSL est prêt, nous pouvons préparer nos répertoires pour notre livre.

Créer ce type d'arborescence :

```
chemin/pour/le/répertoire/de/votre/livre
---html/
------css/
---sources/
------xml
------xsl/
------myxsl/
```

Copier/Coller le contenu dézippé de ***docbook-xsl-ns** dans `répertoire/de/votre/livre/sources/xsl/`

- Les feuilles de styles **DocBook XSL** vont être dans le répertoire `sources/xsl/`
- Les pages XML de votre livre seront dans le répertoire `sources/xml/`
- Les pages HTML de votre livre seront dans le répertoire `html/`

## Installer un éditeur XML

Je ne suis décidemment pas fan des éditeurs XML WYSIWYG. Je reste convaincue que ces outils font leurs propres arrangements de votre code et qu'au final, vous n'obtenez pas vraiment ce que vous attendiez. Je dois très certainement être complètement à côté de la plaque, depuis le temps que ces outils s'améliorent et je devrais, un de ces jours, prendre un temps certain pour installer quelques éditeurs pour apprendre à les utiliser, mais là maintenant tout de suite, je ne suis pas trop dans cet objectif.

Enfin, de toutes les façons, vous pourrez découvrir sur le réseau<a href="http://www.xmlmind.com/" target="_blank">XMLMind</a> or <a href="http://www.syntext.com/" target="_blank">Syntext Serna</a> qui sont deux éditeurs XML gratuits, capables de gérer le format DocBook. Vous pourrez également trouver <a href="http://www.oxygenxml.com/" target="_blank">OxygenXML</a> qui semble très intéressant et très riche (merci les très nombreuses captures d'écran disponibles sur leur site) mais qui n'est pas gratuit.

Attendez la suite de ce tutoriel pour apprendre à créer votre manuel en ligne en utilisant DocBook !
