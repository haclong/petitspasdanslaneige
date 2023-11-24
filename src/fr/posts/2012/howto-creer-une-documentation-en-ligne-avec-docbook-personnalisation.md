---
title: "HOWTO - Créer une documentation en ligne avec DocBook - Personnalisation"
permalink: "fr/posts/howto-creer-une-documentation-en-ligne-avec-docbook-personnalisation.html"
date: "2012-08-15T21:07"
slug: howto-creer-une-documentation-en-ligne-avec-docbook-personnalisation
layout: post
drupal_uuid: 4fe95ced-5beb-4974-8638-00e008afc8cb
drupal_nid: 20
lang: fr
author: haclong

book:
  book: howto-creer-un-manuel-en-ligne-avec-docbook
  rank: 3,
  top: 
    url: /fr/books/howto-creer-un-manuel-en-ligne-avec-docbook.html
    title: HOWTO - Créer un manuel en ligne avec DocBook
  previous:
    url: /fr/posts/howto-creer-une-documentation-en-ligne-avec-docbook-le-fond.html
    title: HOWTO - Créer une documentation en ligne avec DocBook - Le fond

media:
  path: /img/teaser/old-books.jpg

tags:
  - "docbook"
  - "xml"
  - "XSL"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Nous avons généré avec succès notre premier livre (bon, en version brouillon...). Nous avons construit les grandes lignes de la structure de notre livre (bon, il manque la partie la plus intéressante, évidemment). Nous avons utilisé la librairie de feuilles de styles standard DocBook XSL pour générer nos pages HTML. Même si les pages méritent un minimum d'amélioration, les liens fonctionnent et tout semble s'afficher à sa place."
---

Nous avons généré avec succès notre premier livre (bon, en version brouillon...). Nous avons construit les grandes lignes de la structure de notre livre (bon, il manque la partie la plus intéressante, évidemment). Nous avons utilisé la librairie de feuilles de styles standard **DocBook XSL** pour générer nos pages HTML. Même si les pages méritent un minimum d'amélioration, les liens fonctionnent et tout semble s'afficher à sa place.

## Découper le livre

Ok, chaque chose en son temps. Nous avons généré notre livre avec la feuille de style `xsl/html/chunk.xsl`.

Qu'est ce que c'est que ce fichier ?

En combinant la librairie de feuilles de style **DocBook XSL** et le processeur XSL qui va bien, le livre peut être publié soit en HTML, soit au format PDF, soit même au format epub et en d'autres formats également. Plus d'informations sont disponibles dans la documentation des <a href="http://sagehill.net/docbookxsl/index.html" target="_blank">feuilles de styles DocBook XSL</a>. De toutes façons, pour notre part, nous souhaitons uniquement la publication en HTML seulement.

Au format HTML, la librairie **DocBook XSL** peut publier soit un fichier HTML unique contenant tout le livre ou une version découpée du livre soit un livre = plusieurs fichiers HTML avec des liens des uns vers les autres. C'est clairement l'option que nous avons préféré.

Vous souhaitez publier votre livre en HTML ? Alors explorez le répertoire `xsl/html`, même si la majorité des fichiers qui se trouvent là sont des librairies qui sont appelées par les feuilles de style "maîtresse". `chunk.xsl` est l'une de ces feuilles de style "maîtresse". Celle ci a les règles correctes pour parcourir et découper le livre en plusieurs fichiers HTML.

Si vous souhaitez publier votre livre en un seul fichier HTML, vous devrez utiliser plutôt la feuille de style `docbook.xsl`. Il faudra également mettre à jour la commande `xsltproc`.

### Modifier le fichier book.xsl pour publier le livre en une seule page HTML.

1. D'abord, éditer le fichier `sources/book.xsl`.
2. Remplacer cet élément

```xml
<xsl:import href="xsl/html/chunk.xsl"/>
```

par cet élément

```xml
<xsl:import href="xsl/html/docbook.xsl"/>
```

3. Enregistrer le fichier.

### Mettre à jour le fichier book.bat pour publier le livre en une seule page HTML.

1. Editer le fichier `book.bat`.
2. Remplacer cette commande

```sh
xsltproc sources/book.xsl sources/xml/book.xml
```

par celle ci

```sh
xsltproc -o html/index.html sources/book.xsl sources/xml/book.xml
```

3. Enregistrer le fichier.

Vous pouvez publier votre livre (en double cliquant sur `book.bat`). Votre page HTML est le fichier `index.htm` dans le répertoire `html/`. Glisser déposer index.htm dans votre navigateur et admirez le travail !

Les chemins doivent être relatifs au fichier .bat.

Merci d'inverser les modifications et de revenir à l'initial (version chunk.xsl) pour que l'on puisse continuer.

## Et pour notre arborescence de fichiers ?

Nous avons mis en place une très jolie arborescence de fichiers dans les posts précédents mais une fois que nous avons publié notre livre, les fichiers ne sont pas allés se mettre là où on les attendait. Ce n'est pas grave en soit, mais c'est un peu fouilli depuis.

Les feuilles de styles **DocBook XSL** ont quelques paramètres qui peuvent être utilisés pour personnaliser la publication du livre. La documentation complète se trouve dans le manuel <a href="http://docbook.sourceforge.net/release/xsl/current/doc/" target="_blank">DocBook Reference Documentation</a>.

### Drive all generated files into the correct directory

From now on, we'd like to have all our html files hosted under our `html/` directory. You can delete all html files generated earlier so it will look cleaner.

1. Edit your customization layer file : `sources/book.xsl`
2. In the **param area**, add this element

```xml
<xsl:param name="base.dir">A:/bsolute/path/to/your/book_directory/html/</xsl:param>
```

3. Save the file.

If you try to publish the book, your HTML files will be in the `html/` directory now.

The path have to be an absolute path. Link to the full documentation for the `<a href="http://docbook.sourceforge.net/release/xsl/current/doc/html/base.dir.html" target="_blank">base.dir</a>` parameter.

### Get nice names for our HTML files

Now let's get a look at our generated HTML files. **DocBook XSL** generated the default `index.html` filename and then, there's html files with automated filename generated. `pt01.html` will stand for the first `<part>` element of my book. `pt02.html` stands for the second `<part>` element of the book. A `<book>` element will generate a `bk*` name while a `<chapter>` element will generate a `ch*` name. This is nice and as we can see, **DocBook XSL** handle this naming thing quite well. But we'd like to have more human readable filenames.

We will use the `xml:id` attribute. For each `<part>`, `<book>`, `<chapter>` and so on element, we can assign an `xml:id` attribute and we can tell **DocBook XSL** to use this `xml:id` as a filename.

1. Edit your customization layer file : `sources/book.xsl`
2. In the **param area**, add this element :

```xml
 <xsl:param name="use.id.as.filename">1</xsl:param>
```

3. Save the file.

If you try to publish the book, your HTML will have nice names matching the ids now. Link to the full documentation for the `<a href="http://docbook.sourceforge.net/release/xsl/current/doc/html/use.id.as.filename.html" target="_blank">use.id.as.filename</a>` parameter.

## Getting some nicer look 'n feel

The HTML generated by the DocBook XSL stylesheets are nice and readable, indeed, but they look quite rough and primitive. We would like to exerce our CSS skills and style all this.

1. Edit your customization layer file : `sources/book.xsl`
2. In the **param area**, add this element :

```xml
<xsl:param name="html.stylesheet">css/style.css</xsl:param>
```

3. Save the file

The path is relative to the `index.html` file. You can add as many CSS stylesheets as you want. Link to the full documentation for the <a href="http://docbook.sourceforge.net/release/xsl/current/doc/html/html.stylesheet.html" target="_blank">html.stylesheet</a> parameter.

### Create the stylesheet

We have linked our HTML to a `style.css` file. We need now to create it.

1. Create a `style.css` file.
2. Save it in `html/css/` directory.
3. Write some CSS properties.

```css
body {background-color : #ffffff ; color : #000000 ; font-family : arial }
```

4. Save the file

You can publish your book now.

Well, it looks way nicer, right ? You can customize your book using the CSS as you want.

We are not done with the settings and customization thing but the book look real nice now. We need now to add some informative texts and we will work on new DocBook elements in the next post. Stay tuned !
