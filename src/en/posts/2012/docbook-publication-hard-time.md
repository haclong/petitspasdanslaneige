---
title: "Docbook, publication hard time"
permalink: "en/posts/docbook-publication-hard-time.html"
date: "2012-06-28T16:55"
slug: docbook-publication-hard-time
layout: post
drupal_uuid: 6c4e7801-27e8-4a44-be53-736e4e84085f
drupal_nid: 15
lang: en
author: haclong

media:
  path: /img/teaser/books.jpg

tags:
  - "docbook"
  - "xml"
  - "xslt"

sites:
  - "Développement"

summary: "Few weeks ago, i've decided to build a manual with docbook. I have found the Docbook Definitive Guide and though I didn't read it in its integrality, i've got a pretty good look at how this is working. Then I tried to publish my book using the Docbook-Xsl package available out there. As you all know with my previous post on this subject, I have tried a quick and dirty transformation method and it is working. Now, of course, I'd like to have a more definitive one. "
---

Few weeks ago, i've decided to build a manual with docbook. I have found the <a href="http://www.docbook.org/tdg/en/html/docbook.html" target="_blank">Docbook Definitive Guide</a> and though I didn't read it in its integrality, i've got a pretty good look at how this is working. Then I tried to publish my book using the Docbook-Xsl package available out there. As you all know with <a href="/en/posts/nice-meet-you-mr-docbook.html">my previous post on this subject</a>, I have tried a quick and dirty transformation method and it is working. Now, of course, I'd like to have a more definitive one.

**Quick and dirty publication**

As you already know, you can transform your .xml file into a nice HTML view while adding an *xml-stylesheet* declaration into your .xml file.

```xml
<?xml-stylesheet type="text/xsl" href="path_to_your_xsl_directory/html/docbook.xsl"?>
```

After adding this declaration, just open your .xml file (drag and drop may be enough), into your favorite browser. Your .xml file content will display as a HTML page.

But with this method, you can only use the html/docbook.xsl stylesheet. You can't try with the html/chunk.xsl because the html/chunk.xsl stylesheet will create html pages. It will need a real xslt processor.

**Introducing XSL processor**

There's several XSL processors out there. The <a href="http://www.sagehill.net/docbookxsl/index.html" target="_blank">Docbook XSL : The Complete Guide</a> will list the most important ones : Saxon, Xalan, xsltproc, MSXSL etc... Most of them sound familiar to me although I never really installed or use any of them.

I've hoped that my XML editor (Altova) includes a full XSL processor with it. But all I can do is doing the quick and dirty publication nicer... Plus, Altova can't validate the docbook XML because there's no DTD included (since in the Docbook 5 documentation, they explain that you don't need DTD anymore but the schema is on RELAX-NG type)...

So I realize that I have more powerful IDE : Eclipse. I don't know how to use Eclipse. My friend installed it to me because I was collaborating with his full javaproject and he needs me to commit few css and few xsl stylesheets only. So my Eclipse, for all I know, is a customized one, based on the Ganymede version, with customized packages etc... Meaning : don't touch it because whatever you'll do, you'll break it... My friend project is over but I kept this Eclipse, you never know...

I've found a step by step tutorial to publish docbook with Xalan using Eclipse. But the tutorial was meant for Eclipse Europa... Following the tutorial, i have created my project, add my XML files, my stylesheets and the xalan jar. I've written the build.xml just like they tell me to do. Not working. I've get an error. Something is missing... Since I just want to publish my book and not learning the how and why of the Ant, I didn't want to read more documenation for extra features which does not concern my objective directly.

I installed then the Saxon jar. Changed the build.xml accordingly. This processor seems to work better but now, it pretends that my entities in my XML do not exist... Since this is not working and since i still have cards in my sleeve, I just delete my failed project.

I decided to add the Docbook XSL and my XML to my friend existing java project, which includes a XML/XSL transformation with a lot of java libraries and development. I copy all my files to his project and update his configuration files to match my files names. This won't do. The application returns that it can't find my transformation... Dammit...

I quit my attempts with Eclipse for now. Microsoft has its own xsl processor. I'll try this one. I installed their msxsl.exe into the C:/Windows/System32 directory and run it with the command line. I get an error involving the docbook XSL package... Something about a variable (or a parameters) which is not matching its type...

I tried to install the xsltproc package so there's few pages out there linking to <a href="http://www.zlatkovic.com/libxml.en.html" target="_blank">Igor Zlatkovic's website</a> where I can find the binaries to run xsltproc. But the install process tell that's better to unzip all the zips (4 at least) and copy and paste all the binaries into the C:\Windows\System32 directory. Which makes me uneasy on a Windows system. (Don't ask why...)

I decided to install the same xsltproc into my linux machine. Publicating my book works well except there's few docbook tags which do not seem to be taken into account by the Docbook XSL stylesheets... I'll see this later. I've tried with the html/chunk.xsl stylesheets and once again, it is working well.

So back to my Windows machine where I installed successfully the binaries.

- On Igor Zlatkovic's website, download those packages : iconv, libxml2, libxslt, zlib. The xsltproc.exe is inside the libxslt archives.
- Unzip all archives.
- If, like me, you don't want to mix those binaries with the Windows binaries, just create a new directory (C:\Program Files\xsltproc)
- In each archives, copy all the bin/*.dll and all the bin/*.exe into your C:\Program Files\xsltproc directory

**Check 1 : is xsltproc running correctly ?**

- Open a command prompt.
- Browse to the correct directory (meaning C:\Program Files\xsltproc).
- Type "xsltproc" in the command prompt. xsltproc help page should displayed. xsltproc is running correctly.

This is positive. You can try to publish your first docbook typing

```sh
$ xsltproc path_to_your_docbook-xsl-stylesheet/html/docbook.xsl path_to_your_docbook/docbook.xml
```

You'll get the entire html content inside your command prompt. Except the fact that the html is inside the command prompt, we can see that we have two issues here

1. when we want to publish our docbook, we have to browse to our xsltproc directory first
2. then we have to type in the whole path to our stylesheet and to our xml file.

This is tiresome. What we would like most : be able to browse to our docbook directory (hopefully, our stylesheets and our xml are located closeby), then run xsltproc from there. This will allow us to shorten the relative paths to the stylesheet and the xml.

If we need the xsltproc to be able to run from anywhere, we have to add its directory to the PATH environment variable. Adding new directory to the PATH variable tutorials are easily available on the web. Basically, for Windows users, the variable settings are inside one of the "My Computer" properties tabs.

For Windows XP, you'll find your PATH variable here : "My Computer > Properties > Advanced > Environment Variables". There you can edit your "Path" system variables. At the end of the variable value line, add the path to the directory where you dropped the xsltproc binaries (in our case, C:\Program Files\xsltproc). Do not add trailing slash. It seems that we have to restart the computer.

**Check 2 : is xsltproc running from anywhere ?**

- To be sure if this is working from anywhere, just open a command prompt.
- Make sure you're not in the xsltproc directory.
- Type "xsltproc" from there. xsltproc help page should be displayed.

This is positive. You can try, again, to publish your docbook

```sh
$ xsltproc -o index.html relative_path_to_your_docbook-xsl-stylesheet/html/docbook.xsl relative_path_to_your_docbook/docbook.xml
```

Note that we add `-o index.html` options. This will put the xsltproc output inside a file, we named `index.html`. The html content is now inside an index.html file.

Drag and drop the index.html file into your favorite browser. Your book is there. Not as clean as you'll may like it and not as perfect as you'll may wish it to be but it's there nevertheless.

For my part, the Docbook XSL stylesheets eases the work load and displays a first draft of my book. But there are still issues :

1. The layout is basic and not-so-nice
2. TOC seems sometimes misplaced (for my opinion)
3. Some Docbook 5 tags are not managed. I believe i'll have to do it.

CONCLUSION : I'll have to

1. Create a correct CSS stylesheet to put some nicer prez
2. Set some Docbook XSL Stylesheets params
3. Customize my own XSL stylesheets.
