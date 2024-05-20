---
title: "Nice to meet you, Mr Docbook"
permalink: "en/posts/nice-meet-you-mr-docbook.html"
date: "2012-06-22T15:27"
slug: nice-meet-you-mr-docbook
layout: post
drupal_uuid: 5612e44c-d31b-4d87-828c-8df3df9976ff
drupal_nid: 13
lang: en
author: haclong

media:
  path: /img/teaser/detail_livre.png

tags:
  - "docbook"
  - "xml"

sites:
  - "Développement"

summary: "While discovering Zend Framework and Drupal, i was in need for a tool which will allow me to gather the notes i may have to write down during my learning. Those notes were planned for a private usage first so I started to install a mediawiki engine. I started to add some entries into the wiki. As entries are multiplying, it appears to me that others may be in need for my observations too, that I should form a small public documentation for all to use. Beside, my wiki articles are looking somehow like any online documentation pages (mainly PHP manual pages). That's when I heard about DocBook.
"
---

While discovering <a href="http://framework.zend.com/" target="_blank">Zend Framework</a> and <a href="http://drupal.org/" target="_blank">Drupal</a>, i was in need for a tool which will allow me to gather the notes i may have to write down during my learning. Those notes were planned for a private usage first so I started to install a wiki engine. I started to add some entries into the wiki. As entries are multiplying, it appears to me that others may be in need for my observations too, that I should form a small public documentation for all to use. Beside, my wiki articles are looking somehow like any online documentation pages (mainly PHP manual pages). That's when I heard about DocBook.

<a href="http://www.docbook.org/whatis" target="_blank">DocBook</a>, as it defines itself, is a schema maintained by the <a href="mailto:docbook-tc@oasis-open.org">DocBook Technical Committee</a> of <a href="http://www.oasis-open.org/" target="_blank">OASIS</a>. It is a very large and robust schema. That's mean somehow, for newbie, a lot of forking, a lot of possibilities and a complexification which may not be there.

## Installation

Since DocBook is an XML schema and only a schema, there's basically nothing to install. All you need is a text editor or, even better, an XML editor. Of course, as for anything coding related, do not use word processor (such as Word or Open Office...).

That's it. You can create your book now.

## Creating a book

Since DocBook is still an XML schema, you'll be tied to the XML constraints : doctype and/or namespace.

Depending on the DocBook version you want to use, you may need either the doctype or the namespace. For my part, since I was still experimenting DocBook 5, i didn't declare the doctype (don't have to), but I didn't declare the namespace either because the page rendering is not working once the namespace is added to the root node...

The Doctype is a regular file, its extension is .dtd. This is good to know because I have found some notes out there referencing DTD which, when applied, returned "not found errors". In this case, just browse the net looking for the right DTD file by following backward the path given.

As you may know, an XML file may not have doctype declaration neither namespace declaration and keep working although it won't pass successfully the XML validators. So you really don't have to worry about Doctype or namespace although, of course, it's cleaner to have a well-formed valid XML source.

The DocBook documentation will give the complete schema, of course.

A book can start with a `<book>` or a `<set>` root node.
A `<set>` can have one or several `<book>` nodes or may have one or several `<set>` nodes.
A `<book>` can have several differents elements such as dedication page, navigational components such as table of contents, lists of figures, tables... or indexes and components such as preface, chapter, article, appendix, glossary, bibliography.

## But how can this looks like an online manual ?

At this point, you feel somehow cheated because you have subscribed for something like the PHP online manual and all you have is just an XML file without any link and any presentation at all.

This takes me some time to figure it out but DocBook is basically _ONLY_ this ugly XML file. You can make physical division and explode your book contents into several XML files but that's all.

Fortunately, in conjonction with the DocBook schema, there's also Docbook XSL which is a collection of XSL files which will template the DocBook XML file.

### Install DocBook XSL

The DocBook XSL is a collection of .xsl files. On the SourceForge.net site, you'll find several **docbook-xsl-*** package to download (and even packages which are not prefixed by **docbook***). For my part, I've downloaded the **docbook-xsl** package. Again, all you have to do is to extract the archive and put all the files into one directory.

### HTML rendering quick and dirty

At least for the HTML rendering, you can just add the XSL file into your XML file (the one containing the root element).

```xml
<?xml-stylesheet type="text/xsl" href="path_to_your_xsl_directory/html/docbook.xsl"?>
```

Drag and drop the XML into a browser (or use your XML editor processor if there's one). Your XML should look more like an online manual now.

### Going further

Now, if you want to go further, you'll have to install a real XSL processor and if you want to have a book in PDF, you'll have to install a XSL-FO processor. Those processors - at least on Linux - use command line instructions.

I'm not there yet but my quick and dirty method reaches its limits so I guess my next step will be to install an XSL processor which will allow me to use the html/chunck.xsl stylesheet instead of the html/docbook.xsl stylesheet.

NOTE : The docbook.xsl stylesheet will create the book in one html page while the chunk.xsl stylesheet will create several .html files with appropriate links.

You can customize the result of the book while using the DocBook XSL. I'm not there yet also so you'll have to find this out by yourself or wait for my next post on this subject.

I've tried to add customized nodes with a dedicated namespace but this need to dig deeper into the XSL customization layer to get a satisfying result so I quite gave up this point.

Here we are. I hope you enjoyed this article also.
