---
title: "HOWTO - Creating an online manual with DocBook - The Book"
permalink: "en/posts/howto-creating-online-manual-docbook-book.html"
date: "2012-08-07T10:10"
slug: howto-creating-online-manual-docbook-book
layout: post
drupal_uuid: 8828993e-c278-4515-8472-3274007c80c5
drupal_nid: 19
lang: en
author: haclong

media:
  path: /img/teaser/old-books.jpg

tags:
  - "docbook"
  - "xml"

sites:
  - "Développement"
  - "Haclong projects"

summary: "All the directories structure is ready now. We also have prepared successfully all the tools we'll need to do our book. We are eager to start, and see this wonder (DocBook) in action. Hopefully, we have a little idea of the kind of book we would like to achieve. So let's start !"

---

All the directories structure is ready now. We also have prepared successfully all the tools we'll need to do our book (see <a href="/en/posts/howto-creating-online-manual-using-docbook-getting-ready.html">previous post</a>). We are eager to start, and see this wonder (DocBook) in action. Hopefully, we have a little idea of the kind of book we would like to achieve. So let's start !

## Our book

Our book will be a technical documentation.

- It will be composed of
- an introductory section
- few explicatives paragraphs
- class synopsises with properties and methods ordered by chapters, each chapter being a topic.

- Light tables of contents will be available for each chapter and for each class pages
- Full set of cross-references links will link pages altogether
- Our book is one language only
- Our book will be published in HTML only
- Our book targets two different audiences : standard user and developers
- Hopefully, we'll get help from friends so we will try to split our source into small physical parts
- Our book will display links to "previous" page and "next" page, to "home" page and we will be able to go up one level
- And many more features to come...

## Building our book

Our book will be composed of one `<book>` element containing several `<part>` elements. Our classes will be displayed in a `<reference>` element containing several `<refentry>` elements.

In our `<book>` element, we will have the book title, and a few words.

In our `<reference>` element, we will have the class name, its synopsis and each methods listed in the synopsis will link to a page dedicated to the method.

1. Create a **book.xml** file.
2. Save it in **sources/xml/**.
3. Write the prologue

```xml
<?xml version="1.0" encoding="utf-8"?>
```

On a daily basis, I may need to write either in french, in english or in vietnamese. Therefore I used the **utf-8** encoding a lot to ease any character conversion issue. Beside, since the advent of the unicode, writing in vietnamese is so much easier ^____^.

4. Write the document type declaration

```xml
<!DOCTYPE book [
   <!ENTITY % snippets SYSTEM "snippets.xml">
   %snippets;
]>
```

Several reasons for this code

- Since DocBook v5.0 is using RELAX NG language scheme, it does not need to have a document type declaration anymore. Please refer to the <a href="http://www.docbook.org/tdg5/en/html/ch01.html#introduction-ns" target="_blank">DocBook documentation about this move</a>.

- Although we still need to have a `<!DOCTYPE>` element because we will use entities to store some snippets (repetitive texts for example).
- The **root node** will be a `<book>` element
- We then add the `<!ENTITY>` element which references - as you can see - a **snippets.xml** file which will be saved in **sources/xml/**.
- And we define the entity **%snippets;**

5. Write the root node

```xml
<book
    xmlns="http://docbook.org/ns/docbook"
    version="5.0"
    xml:id="home"
    xml:lang="en"
    xml:xi="http://www.w3.org/2001/XInclude"
    xml:xlink="http://www.w3.org/1999/xlink"
>
```

- we set the **namespace** for the DocBook elements. (RELAX NG language schema)
- we set the docbook **version** number
- we set the **id** attribute of this node. This is not mandatory. We will see that DocBook XSL will deal with generated Id if you set none
- we set the **lang** attribute of this node - which is, of course, not mandatory. Here is a link to the <a href="http://www.w3.org/International/articles/language-tags/" target="_blank">languages codes specifications</a>. From there, you'll be able to access to more complete specifications (link to BCP 47/RCF 5646 in plain text version or in html)
- we set the **namespace** for the XInclude elements. We will use this later.
- we set the **namespace** for the xlink elements.
- Of course, do not forget to close the `<book>` element at the end of your file

6. Write the info node

```xml
<info>
    <title>Title of your book</title>
    <author>
        <personname>Author's name</personname>
        <copyright><year>2012</year><holder>Owner's name</holder></copyright>
    </author>
</info>
```

This node is totally optional. You can include several meta informations about your book here. Please refer to the <a href="http://www.docbook.org/tdg5/en/html/chunk-part-d64e8789.html" target="_blank">Docbook documentation for all the available elements</a>. The `<title>` data is interesting though.

7. Write the foreword part

```xml
<simplesect>
    <info>
        <title>Foreword</title>
        <abstract><simpara>This is the foreword of this book. Please enjoy it</simpara></abstract>
    </info>
    <para>Welcome to my first book. This is the some words to begin with</para>
    <para>Another paragraph</para>
</simplesect>
```

The `<preface>` element exists but in my case, it generates automatically a page break and a new entry in the table of contents. Since i'd like to have a few words to start the book but not a brand new page, i choose to use another element. In the case of more consequent foreword, or printed book with the preface on a new page after the title page, of course, it is far better to use the `<preface>` element.

8. The book parts


```xml
<!-- Introductive part with chapters like : "getting started", "installation", "requirements"... -->
<part xml:id="introduction">
    <info>
        <title>Introduction</title>
    </info>
</part>
<!-- Technical part with the API references -->
<part xml:id="components">
    <info>
        <title>The librarie components</title>
    </info>
</part>
```

OK. The rough skeleton is done now. There's still the part with references and methods but let's test this first skeleton first.

## Automated the processing of our book

Since we will be processing the book a lot of time (customizing and debugging purpose...), we will build a script file so we will be able to process the book whenever we need it.

1. Create a **book.bat** file.
2. Save it in **the root directory** (same level of the sources and html directories)
3. Write the **xsltproc command**.

```sh
$ xsltproc sources/book.xsl sources/xml/book.xml
```

- The book.xml is the XML file we are written. Of course, if you choose to use another path, change the path accordingly.
- Since we will customize (and override some DocBook XSL rules), we will need a customizing layer. So we prepare this layer with the book.xsl file.

## Creating the customizing layer

1. Create a **book.xsl** file.
2. Save it in **sources**.
3. Write the **customization layer**.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <!-- import area -->
    <xsl:import href="xsl/html/chunk.xsl"/>
    <!-- param area -->
    <!-- include area -->
</xsl:stylesheet>
```

The `html/chunk.xsl` file is an XSL stylesheet from the DocBook XSL library. Let's say this is the stylesheet we want to use for now. I'll talk about this library in my next post so stay tuned !

Pay attention to the comment lines. We will use them later. The area order (import, then param, then include) is important. It has to be this order.

## Preparing the snippets file

We will create several entities for our book. Those entities might be different elements :

- external URL we would like to reference inside our book. We want to have the URL write down once so if it changes, we won't have to find and replace it in all our files.
- repetitive texts such as section titles, special characters etc...
- included pages.

1. Create a **snippets.xml** file.
2. Save it in **sources/xml**.
3. Write the prolog

```xml
 <?xml version="1.0" encoding="utf-8"?>
```

## What we do have now

Here is our filesystem now :

```
book_directory/
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

- **sources/xsl/*** : contains the whole DocBook XSL library
- **sources/xml/book.xml** : is the content of your book
- **sources/xml/snippets.xml** : will host entities useful for your book
- **sources/book.xsl** : is the stylesheet customization layer
- **book.bat** : is the script to process the book with the xsltproc command

Now you can test and process your first book by double clicking on the **book.bat** file.
Once you run your **book.bat** script, let's go check its gorgeous result : there's an **index.html** file on your root directory. Drag and drop this file into your favorite navigator. You'll get your book.

Ok.

It's not _THAT_ gorgeous but you have your title, your foreword, links to the introductive part and to the API component part. There's also the navigation links to previous/next page on each page. (Ok, there's only three of them). And as you have seen it, our neat filesystem is a complete mess !! We'll fix that in our next post.

Let's do some settings and some customization on the next post ! Stay tuned !!
