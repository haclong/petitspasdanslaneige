---
title: "HOWTO - Creating an online manual with DocBook - Customization"
permalink: "en/posts/howto-creating-online-manual-docbook-customization.html"
date: "2012-08-15T15:57"
slug: howto-creating-online-manual-docbook-customization
layout: post
drupal_uuid: 4fe95ced-5beb-4974-8638-00e008afc8cb
drupal_nid: 20
lang: en
author: haclong

media:
  path: /img/teaser/old-books.jpg

tags:
  - "docbook"
  - "xml"
  - "XSL"

sites:
  - "Développement"
  - "Haclong projects"

summary: "We have successfully generated our first book (in draft status). We have build a draft of our book skeletton (but it still miss the most interesting part, of course. We use the standard DocBook XSL library to generate the HTML pages. The pages we get need some customization but links are working and everything seems to be at its right place."
---

We have successfully generated our first book (in draft status). We have build a draft of our book skeleton (but it still miss the most interesting part, of course). We use the standard DocBook XSL library to generate the HTML pages. The pages we get need some customization but links are working and everything seem to be at its right place.

## Chunking the book

Ok, first thing first. We processed our book with the **xsl/html/chunk.xsl** stylesheet.

What's this file anyway ?

With the DocBook XSL library and the correct XSL processor, our book can be published either in HTML, in PDF format, in epub and many other format. All informations can be found at the <a href="http://sagehill.net/docbookxsl/index.html" target="_blank">DocBook XSL documentation</a>. We want to publish our book in HTML only.

In HTML format, DocBook XSL library can either output a single HTML file or a chunked book meaning one book = several HTML files with links from one file to other files. This is the current option we choose. We do want our book to be published in HTML ? so explore **xsl/html** directory, although most of the files are libraries that "main" stylesheets include. **chunk.xsl** is one of those "main" stylesheet. This one has all the correct rules to parse and split your book into several .html files.

If you wish to publish your book into one single HTML file, you ought to use the **docbook.xsl** stylesheet. You'll also need to update the xsltproc command.

### Updating the book.xsl file to publish the book into one single HTML page.

1. First, edit your **sources/book.xsl** file.
2. Replace this element

```xml
<xsl:import href="xsl/html/chunk.xsl"/>
```
by this element

```xml
<xsl:import href="xsl/html/docbook.xsl"/>
```

3. Save your file.

### Updating the book.bat file to publish the book into one single HTML page.

1. First, edit your **book.bat** file.
2. Replace this command

```sh
$ xsltproc sources/book.xsl sources/xml/book.xml
```

by this command

```sh
$ xsltproc -o html/index.html sources/book.xsl sources/xml/book.xml
```

3. Save your file.

You can now process your book (double clicking on **book.bat**). Your html page is the **index.htm** file in the **html/** directory. Drag and drop your index.htm file and enjoy your single HTML page book.

All the paths are relatives to the .bat location.


Please, revert your changes now for the book.bat and the book.xsl files so we can process.

## What about our filesystem

We have build a nice filesystem in previous posts but once we processed the XML, files were generated on the root directory, and although it is not this bad, it's quite a mess.

The DocBook XSL stylesheets has some parameters we can use to set the stylesheet. The documentation about those parameters can be found at the <a href="http://docbook.sourceforge.net/release/xsl/current/doc/" target="_blank">DocBook Reference Documentation</a>.

### Drive all generated files into the correct directory

From now on, we'd like to have all our html files hosted under our **html/** directory. You can delete all html files generated earlier so it will look cleaner.

1. Edit your customization layer file : **sources/book.xsl**
2. In the **param area**, add this element

```xml
<xsl:param name="base.dir">A:/bsolute/path/to/your/book_directory/html/</xsl:param>
```

3. Save the file.

If you try to publish the book, your HTML files will be in the **html/** directory now.

The path have to be an absolute path. Link to the full documentation for the <a href="http://docbook.sourceforge.net/release/xsl/current/doc/html/base.dir.html" target="_blank">base.dir</a> parameter.

### Get nice names for our HTML files

Now let's get a look at our generated HTML files. DocBook XSL generated the default **index.html** filename and then, there's html files with automated filename generated. **pt01.html** will stand for the first `<part>` element of my book. **pt02.html** stands for the second `<part>` element of the book. A `<book>` element will generate a bk* name while a `<chapter>` element will generate a ch* name. This is nice and as we can see, DocBook XSL handle this naming thing quite well. But we'd like to have more human readable filenames.

We will use the **xml:id** attribute. For each `<part>`, `<book>`, `<chapter>` and so on element, we can assign an xml:id attribute and we can tell DocBook XSL to use this xml:id as a filename.

1. Edit your customization layer file : **sources/book.xsl**
2. In the **param area**, add this element :

```xml
<xsl:param name="use.id.as.filename">1</xsl:param>
```

3. Save the file.

If you try to publish the book, your HTML will have nice names matching the ids now. Link to the full documentation for the <a href="http://docbook.sourceforge.net/release/xsl/current/doc/html/use.id.as.filename.html" target="_blank">use.id.as.filename</a> parameter.

## Getting some nicer look 'n feel

The HTML generated by the DocBook XSL stylesheets are nice and readable, indeed, but they look quite rough and primitive. We would like to exerce our CSS skills and style all this.

1. Edit your customization layer file : **sources/book.xsl**
2. In the **param area**, add this element :

```xml
<xsl:param name="html.stylesheet">css/style.css</xsl:param>
```

3. Save the file

The path is relative to the **index.html** file. You can add as many CSS stylesheets as you want. Link to the full documentation for the <a href="http://docbook.sourceforge.net/release/xsl/current/doc/html/html.stylesheet.html" target="_blank">html.stylesheet</a> parameter.

### Create the stylesheet

We have linked our HTML to a style.css file. We need now to create it.

1. Create a **style.css** file.
2. Save it in **html/css** directory.
3. Write some CSS properties.

```css
body {background-color : #ffffff ; color : #000000 ; font-family : arial }
```

4. Save the file

You can publish your book now.

Well, it looks way nicer, right ? You can customize your book using the CSS as you want.

We are not done with the settings and customization thing but the book look real nice now. We need now to add some informative texts and we will work on new DocBook elements in the next post. Stay tuned !
