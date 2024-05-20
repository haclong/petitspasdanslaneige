---
title: "HOWTO - Creating an online manual using DocBook - Getting ready"
permalink: "en/posts/howto-creating-online-manual-using-docbook-getting-ready.html"
date: "2012-07-31T12:13"
slug: howto-creating-online-manual-using-docbook-getting-ready
layout: post
drupal_uuid: b56736ad-fc5f-4086-80f9-d7435c559b21
drupal_nid: 17
lang: en
author: haclong

book:
  book: howto-creating-online-manual-docbook
  rank: 1,
  top: 
    url: /en/books/howto-creating-online-manual-docbook.html
    title: HOWTO - Creating an online manual with DocBook
  next: 
    url: /en/posts/howto-creating-online-manual-docbook-book.html
    title: HOWTO - Creating an online manual with DocBook - The Book

media:
  path: /img/teaser/old-books.jpg

tags:
  - "HOWTO"
  - "docbook"
  - "xml"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Although i've already exposed my attempts to publish a DocBook manual, my purpose here is to give straight forward directives to achieve a Docbook manual."
---

Although i've already exposed my attempts to publish a DocBook manual, my purpose here is to give straight forward directives to achieve a Docbook manual.

## Purpose

We will create an online manual very like the <a href="http://www.php.net/manual/en/" target="_blank">php.net manual</a>. The book content will be divided into several HTML pages. Each main parts will have its own table of contents. Classes and functions in the book will be able to reference each other. We will be able to browse the book page per page or go up to the table of content.

## Requirements

To achieve a DocBook manual, we will need

- XSL stylesheets to style and template our book
- an XSL processor to publish our book

As for your competences, you'll need to know

- some few things about <a href="http://www.w3.org/TR/REC-xml/" target="_blank">XML schemes</a> : Document type declaration, well-formedness and validation constraints
- few other things about <a href="http://www.w3.org/TR/xslt" target="_blank">XSL</a> and <a href="http://www.w3.org/TR/xpath/" target="_blank">XPATH</a>
- few things about <a href="http://www.w3.org/TR/CSS21/" target="_blank">CSS</a> too

Those won't be covered at all in this tutorial.

## Installing xsltproc on Windows system

As for a XSL processor, we will install **xsltproc** which is a light processor working with command-line. Of course, if you already have a XSL processor installed on your computer, you can skip this step.

1. go to <a href="http://www.zlatkovic.com/libxml.en.html" target="_blank">Igor Zlatkovic's website</a>
2. go to <a href="ftp://ftp.zlatkovic.com/libxml/" target="_blank">Igor Zlatkovic's download area</a>
3. download the following packages :

- iconv-x.x.x.win32.zip
- libxml2-x.x.x.win32.zip
- libxslt-x.x.x.win32.zip
- zlib-x.x.x.win32.zip

4. create a **xsltproc** directory on your computer
5. unzip all downloaded archives inside your xsltproc directory

You should get this arborescence :

```
path/to/xsltproc_dir/
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

6. copy/paste all the bin/*.dll and all the bin/*.exe found in each archives into your xsltproc directory

You should now have all those files and directories in your xsltproc directory

```
path/to/xsltproc_dir
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

### Adding xsltproc directory to the PATH variable

Since the binary **xsltproc.exe** should be able to run from anywhere on the computer, we'll have to add its path to the PATH environment variable.

For Windows XP users,

1. go here : **My Computer > Properties > Advanced > Environment Variables**.
2. in the **System variables** area, edit the **Path** system variables
3. add the path for your xsltproc directory at the end of the variable value line (which can reveal to be quite long). Do not forget to add a semicolon (;) as separator and do not add trailing slash.
4. restart computer

For non XP users : please refer to the numerous documentation available out there to make this working.

## Installing xsltproc on Ubuntu

I guess an **apt-get xsltproc** should do the trick.

## Getting the DocBook XSL stylesheets package

1. go to the <a href="http://sourceforge.net/projects/docbook/files/#files" target="_blank">Sourceforge DocBook XSL download area</a>
2. go to **docbook-xsl-ns** project and choose the latest version
3. download the archive (either the .zip or the .tar.bz2)
4. unzip the archive

## Preparing the filesystem

Now that the XSL processor is ready, we can prepare the filesystem for our book.

Create the following filesystem :

```
path/to/your/book_directory/
---html/
------css/
---sources/
------xml/
------xsl/
------myxsl/
```

Copy/Paste the content of the unzipped docbook-xsl-ns archive into the **book_directory/sources/xsl** directory

- The DocBook XSL stylesheets will be hosted in the **sources/xsl/** directory
- Your book (XML pages) will be in the **sources/xml/** directory
- Your book (HTML pages) will be in the **html/** directory

## Getting an XML Editor

I do not really fancy WYSIWYG XML Editor. I'm strongly convinced that those tools made their own arrangement with your final code and you won't get what really want to have. I may be very wrong about this point and I definitively have to take time to install some editors but I don't feel like spending time to do that.

Anyway, through the network, you'll learn that there's <a href="http://www.xmlmind.com/" target="_blank">XMLMind</a> or <a href="http://www.syntext.com/" target="_blank">Syntext Serna</a> free XML editors which are able to handle DocBook format and there's also <a href="http://www.oxygenxml.com/" target="_blank">OxygenXML</a> which is not free but looks real nice through its numerous screenshots.

Follow this tutorial to learn how to create an online manual using DocBook !! Stay tuned !
