---
title: "HOWTO - Creating an online manual with DocBook"
permalink: "en/books/howto-creating-online-manual-docbook.html"
date: "2012-07-30T16:54"
slug: howto-creating-online-manual-docbook
layout: post
drupal_uuid: 1ab1324a-46c4-4138-88d6-7822ea775346
drupal_nid: 16
lang: en
author: haclong

media:
  path: /img/teaser/old-books.jpg

sites:
  - "Développement"

---

DocBook is a XML schema used to create any kind of documentation. Its first purpose was to focus on technical documentation but since its format is large, with a full set of markups matching any kind of book formats, it can be used to write many different books now, including essays and novels.

DocBook claims that it can be used "out of the box", making its usage sound really easy. And it is really easy indeed. You'll have to grab several meaningful markup to write the rough skeleton of your book (one **book** divided in **chapter**s. Each **chapter** having **paragraph**s etc...). If you are planning to use (and you will) the matching DocBook XSL stylesheets package, you won't have to worry about chapter numbering and table of content generation. All those nice features will be generated at the publication step. However, when it comes to a more detailed purpose, you'll need to read the documentation further, meaning altogether the <a href="http://www.docbook.org/tdg5/en/html/docbook.html" target="_blank">DocBook Definitive Guide</a>, the <a href="http://www.sagehill.net/docbookxsl/index.html" target="_blank">DocBook XSL Stylesheets Complete Guide</a> and the <a href="http://docbook.sourceforge.net/release/xsl/current/doc/" target="_blank">DocBook XSL Stylesheets Reference Documentation</a>.

The purpose of this tutorial will be to create an online API manual. We will include few nice features to customize further the rendering of our book.




