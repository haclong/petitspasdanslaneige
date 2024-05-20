---
title: "HOWTO - Créer une documentation en ligne avec DocBook - Le fond"
permalink: "fr/posts/howto-creer-une-documentation-en-ligne-avec-docbook-le-fond.html"
date: "2012-08-07T21:05"
slug: howto-creer-une-documentation-en-ligne-avec-docbook-le-fond
layout: post
drupal_uuid: 8828993e-c278-4515-8472-3274007c80c5
drupal_nid: 19
lang: fr
author: haclong

book:
  book: howto-creer-un-manuel-en-ligne-avec-docbook
  rank: 2,
  top: 
    url: /fr/books/howto-creer-un-manuel-en-ligne-avec-docbook.html
    title: HOWTO - Créer un manuel en ligne avec DocBook
  next: 
    url: /fr/posts/howto-creer-une-documentation-en-ligne-avec-docbook-personnalisation.html
    title: HOWTO - Créer une documentation en ligne avec DocBook - Personnalisation
  previous:
    url: /fr/posts/howto-creer-une-documentation-en-ligne-avec-docbook-preparations.html
    title: HOWTO - Créer une documentation en ligne avec DocBook  - Préparations

media:
  path: /img/teaser/old-books.jpg

tags:
  - "docbook"
  - "xml"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Toute la structure de fichier est désormais prête. Nous avons également préparé tous les outils dont nous allons avoir besoin pour notre livre. Nous somme impatients de commencer et de voir cette merveille (DocBook) en action... Heureusement, nous avons déjà une petite idée du type de livre que nous allons faire. C'est parti !"
---

Toute la structure de fichier est désormais prête. Nous avons également préparé tous les outils dont nous allons avoir besoin pour notre livre. Nous somme impatients de commencer et de voir cette merveille (DocBook) en action... Heureusement, nous avons déjà une petite idée du type de livre que nous allons faire. C'est parti !

## Notre livre

Nous allons faire une documentation technique

- Le livre sera composé de
- une introduction
- quelques paragraphes explicatifs
- des synopsis de classes avec les propriétés et les méthodes ordonnées par chapitre, chaque chapitre étant un sujet.


- des tables de matières succintes seront disponibles pour chaque chapitre et pour chaque classe
- un réseau de liens de références entre chaque pages
- le livre sera rédigé dans une seule langue
- il sera publié au format HTML seulement
- le livre s'adressera à deux types d'audience : les utilisateurs standard et les développeurs
- si on considère la possibilité de faire du livre un travail collaboratif, il faut envisager de diviser les sources en petits fichiers séparés
- le livre bénéficiera de liens de navigation : page "précédente", page "suivante", "remonter d'un niveau" et "home"
- et pourquoi pas, d'autres fonctionnalités à venir...

## Construire le livre

Le livre sera composé d'un élément `<book>` contenant plusieurs éléments `<part>`. Chaque classe sera un élément `<reference>` contenant plusieurs éléments `<refentry>`.

Dans l'élément `<book>`, nous aurons le titre du livre et quelques mots en guise de préface.

Dans nos éléments `<reference>`, nous aurons le nom de la classe, son synopsis et chaque méthode listée dans le synopsis sera un lien vers une page dédiée à cette méthode.

1. Créer un fichier `book.xml`.
2. L'enregistrer dans `sources/xml/`.
3. Ecrire le prologue

```xml
 <?xml version="1.0" encoding="utf-8"?>
```

Dans la mesure où je peux être amenée à écrire en français, anglais ou viêtnamien, je préfère utiliser l'encodage **utf-8** par défaut. Cela facilite grandement les problèmes de conversion de caractères. Et puis, il faut bien reconnaître que depuis l'avènement de l'unicode, écrire le viêtnamien à l'ordinateur est si facile ! ^____^.

4. Ecrire la déclaration du type de document (Document Type Declaration)

```xml
<!DOCTYPE book [
   <!ENTITY % snippets SYSTEM "snippets.xml">
   %snippets;
]>
```

Petites explications :

- Depuis que DocBook v5.0 utilise un schéma de type RELAX NG, il n'a plus besoin de la déclaration de type de document. Merci de vous référer à la <a href="http://www.docbook.org/tdg5/en/html/ch01.html#introduction-ns" target="_blank">documentation à ce sujet</a> pour de plus amples informations.
- Toutefois, nous avons toujours besoin d'un élément `<!DOCTYPE>` pour utiliser les entités qui gèreront quelques extraits de code (textes répétitifs par exemple).
- L'élément racine (root) sera un élément `<book>`
- Nous ajoutons un élément `<!ENTITY>` qui assurera l'inclusion d'un fichier `snippets.xml` enregistré dans le répertoire `sources/xml/.`
- Nous définissons l'entité `%snippets;`

5. Ecrire l'élément racine

```xml
<book
    xmlns="http://docbook.org/ns/docbook"
    version="5.0"
    xml:id="home"
    xml:lang="fr"
    xml:xi="http://www.w3.org/2001/XInclude"
    xml:xlink="http://www.w3.org/1999/xlink"
>
```

- Déclaration de l'**espace de nom** (namespace) pour les éléments du schéma **DocBook**. (Contrainte du schéma de type RELAX NG )
- Déclaration du numéro de **version** de **DocBook**
- Déclaration de l'attribut **id** de cette node. Ceci n'est pas obligatoire et nous verrons que les feuilles de styles DocBook XSL peuvent gérer des ID automatiques si nécessaires.
- Déclaration de l'attribut **lang** pour cette node. Ceci n'est pas obligatoire. Voici un lien sur les <a href="http://www.w3.org/International/articles/language-tags/" target="_blank">spécifications des codes languages</a>. A partir de cette page, vous aurez accès aux spécifications complètes (liens vers le BCP 47/RFC 5646 en version txt ou en version html un peu plus bas)
- Déclaration de l'**espace de nom** pour les éléments du schéma **XInclude**. Nous en aurons besoin plus tard.
- Déclaration de l'**espace de nom** pour les éléments du schéma **xlink**.
- Merci de ne pas oublier de refermer l'élément `<book>` à la fin du fichier, bien sûr.

6. Ecrire les métadonnées

```xml
<info>
    <title>Titre du livre</title>
    <author>
        <personname>Nom de l'auteur</personname>
        <copyright><year>2012</year><holder>Nom du propriétaire</holder></copyright>
    </author>
</info>
```

Cette node est complètement optionnelle. Vous pouvez ajouter autant de méta données que vous souhaitez pour votre livre. Merci de vous reférer à la <a href="http://www.docbook.org/tdg5/en/html/chunk-part-d64e8789.html" target="_blank">documentation **DocBook** pour l'accès aux différents éléments disponibles</a>. L'élément le plus intéressant reste l'élément `<title>`

7. Ecrire la préface

```xml
<simplesect>
    <info>
        <title>Préface</title>
        <abstract><simpara>Voici la préface du livre</simpara></abstract>
    </info>
    <para>Bienvenu dans mon premier livre. Voici quelques mots pour commencer.</para>
    <para>Un autre paragraphe</para>
</simplesect>
```

L'élément `<preface>` existe mais il génère automatiquement un saut de page et une entrée dans la table des matières. Puisque nous souhaitons seulement introduire le livre avec quelques mots et non pas avec une page neuve, j'ai préféré utiliser un autre élément. Dans le cas où nous aurions besoin d'une préface plus conséquente, ou éventuellement un livre imprimé incluant une préface dans une nouvelle page, il va sans dire que l'élément `<preface>` serait plus adapté pour cela.

8. Les parties du livre

```xml
<!-- Partie introductive avec des chapitres de type : "commencer avec la librairie", "installation", "prérequis" etc...-->
<part xml:id="introduction">
    <info>
        <title>Introduction</title>
    </info>
</part>
<!-- Partie technique référençant l'API de la librairie -->
<part xml:id="components">
    <info>
        <title>Les composants de la librairie</title>
    </info>
</part>
```

OK. Le squelette, dans les grandes lignes, est prêt. Il reste à traiter les détails mais testons d'abord cette première structure.

## Automatiser la génération du livre

Puisque nous allons générer le livre plusieurs fois (pour tester, personnaliser et débugger...), nous allons mettre les lignes de commande dans un fichier script ce qui nous permettra de lancer la génération du livre facilement.

1. Créer un fichier `book.bat`.
2. L'enregistrer dans le **répertoire racine** (au même niveau que les répertoires `sources/` et `html/`)
3. Ecrire la commande `xsltproc`.

```sh
xsltproc sources/book.xsl sources/xml/book.xml
```

- Le fichier `book.xml` est le fichier XML que nous sommes en train d'écrire. Bien sûr, si vous avez fait le choix d'une autre arborescence, il ne faut pas oublier de changer le chemin en conséquence.
- Puisque nous allons personnaliser (et surcharger quelques règles mises en place par les feuilles de styles **DocBook XSL**), nous aurons besoin d'une couche de personnalisation (customization layer). Le fichier `book.xsl` sera cette couche.

## Créer la couche de personnalisation

1. Créer un fichier `book.xsl`.
2. L'enregistrer dans `sources/`.
3. Ecrire la **couche de personnalisation**.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <!-- Zone de import -->
    <xsl:import href="xsl/html/chunk.xsl"/>
    <!-- Zone de param -->
    <!-- Zone d'include -->
</xsl:stylesheet>
```

Le fichier `html/chunk.xsl` est une des feuilles de style XSL de la librairie **DocBook XSL**. Disons pour le moment que c'est le fichier qu'il nous faut. Je reviendrais sur ces fichiers dans un prochain post. Restez connectés !

Remarquez les lignes en commentaires. Nous les utiliserons bientôt. L'ordre des zones (*import* puis *param* puis *include*) est très important. Il doit être respecté.

## Préparer le fichier d'extraits de code

Nous allons créer plusieurs entités pour notre livre. Ces entités peuvent être :

- des URL externes que nous souhaitons référencer dans le livre. Les URL seront rassemblées au même endroit pour faciliter la maintenance.
- des textes répétés comme les titres de section, les caractères spéciaux etc...
- l'inclusion de pages.

1. Créer un fichier `snippets.xml`.
2. L'enregistrer dans `sources/xml`.
3. Ecrire le prologue

```xml
 <?xml version="1.0" encoding="utf-8"?>
```

## Voyons ce que nous avons maintenant :

Voici notre système de fichier désormais :

```
dossier_racine_du_livre/
---html/
------css/
---sources/
------myxsl/
------xsl/
------xml/
---------book.xml
---------snippets.xml
------book.xsl
---book.bat
```

- `sources/xsl/` : contient l'intégralité de la librairie de feuilles de styles **DocBook XSL**
- `sources/xml/book.xml` : le contenu du livre
- `sources/xml/snippets.xml` : contient les entités utiles pour le livre
- `sources/book.xsl` : la couche de personnalisation
- `book.bat` : le script de génération du livre avec la commande `xsltproc`

Maintenant, vous pouvez tester et générer votre premier livre en double cliquant sur le fichier `book.bat`.
Une fois que le script s'est déroulé sans problème, voyons son glorieux résultat : il y a un fichier `index.html` dans le répertoire racine de votre livre. Glisser déposer ce fichier dans votre navigateur préféré. Voici votre livre.

Ouais.

Bon, il n'est pas _SI_ glorieux mais bon, on a le titre, la préface, le lien vers la partie introductive et la partie sur l'API. Nous avons également les liens précédent / suivant sur chaque page (bon, ok, il n'y a que trois pages). Bon. On aura également constaté que notre si jolie arborescence de fichier est complèment bouleversée !! Nous nous occuperons de cela dans notre prochain post.

Allons faire quelques paramétrages et un peu de personnalisation dans le prochain post ! Restez avec moi !!
