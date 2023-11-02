---
title: "Encoding and unicode"
permalink: "en/posts/encoding-and-unicode.html"
date: "2014-07-15T13:53"
slug: encoding-and-unicode
layout: post
drupal_uuid: 714d8106-ab55-40d9-899a-d0510c07e8f3
drupal_nid: 81
lang: en
author: haclong

media:
  path: /img/teaser/toptal-blog-image-1397163994568.png
  credit: "Toptal"

tags:
  - "multilingual"
  - "unicode"
  - "utf8"
  - "encoding"
  - "mysql"

sites:
  - "Haclong projects"

summary: "The international topic, and in the case of websites, the issue about the numerous character sets is very dear to me as you may have noticed from that blog. This is unfortunately widely ignored by most of web dev and i still find html entities filling entire databases while we could easily use correct character sets there.
"
---

The international topic, and in the case of websites, the issue about the numerous character sets is very dear to me as you may have noticed from <a href="/fr/posts/its-small-world-after-all.html">that blog</a>. This is unfortunately widely ignored by most of web dev and i still find html entities filling entire databases while we could easily use correct character sets there.

We could, but we have to know why.. and how.

I'd love to write more about this but Toptal has made a <a href="http://www.toptal.com/php/a-utf-8-primer-for-php-and-mysql">very complete document</a> about that topic so better refer to their work.

In short, this is what i'm doing (because Toptal HOWTO is reaaaaally complete) and for my part, you can do a correct UTF-8 ready websites with lesser steps :

Since all the site should be in UTF-8 (or any other encoding character. Just make sure to be coherent), everything you're writing and you're saving into files should be in UTF-8.

- Make sure your IDE or notepad or whatever you're using to write your code is saving the file in UTF-8. Windows is reaaallly bad for this job and it kept inserting BOM character from time to time but Ultra Edit and Netbeans make a pretty good job : So any special characters you write into your code is encoded in UTF-8.
- While writing the HTML layout (or the XML page or any other output), make sure you add the charset or the encoding attribute (refer to Toptal for the correct syntax) : that means the UTF-8 encoding instruction in the HTML header and the XML prologue
- Thanks to Toptal, i have forgotten to force the form to accept the correct charset so don't forget to add that part too.

At this point, any output to your navigator should be roughly in UTF-8. You should see it from the navigator encoding charset menu. Basically, the HTML output should be in UTF-8, starting from the `<html>` tag on top of the page to the last `</html>` tag.

If the HTML is output by php, so PHP should write all texts and instructions and things in UTF-8 too. That means putting a string with special chars into a php variable and echoing that variable into an HTML page should work.

Now the most tricky part is the data persistence layer, most of the time meaning MySql :

### Saving UTF-8 encoded strings into MySQL :

- If you can choose the character encoding of your database, choose wisely (there's a lot of utf-8 charset collation in mysql, so just choose the one which fits better... I use utf8_general_ci most of the time).
- When you create your table, make sure its collation is UTF8 too.
- When you create the columns, any columns with string type (CHAR, VARCHAR, *TEXT) should have UTF8 collation charset too.

At this point, when you do an INSERT or an UPDATE query, the datas should be encoded from your php code to the MySQL fields with the correct charset.

### Retrieving UTF-8 encoded strings from MySQL :

Now, your UTF8 strings are stored in a UTF8 collation column in an UTF8 collation table in (hopefully) an UTF8 collation database so doing a SELECT query on that column should do the trick. Just make sure that MySQL won't render datas in its own way so force the output with that MySQL command : SET NAMES UTF-8 somewhere in your code (for example, when you connect to your database with mysql_connect (i know, mysql_* functions are deprecated, just use the correct one, i don't remember the correct function since the framework i'm using is doing the trick for me now :p).

Note that i never bother to update my php.ini nor my my.ini : i'm using shared hosting so most of the time, i'm not allowed to edit those files. So maybe i'm lucky and my host provider has already set the correct encoding in both conf files...

Good luck and for those who don't see how they are involved with the charset topic, please please please, pay attention because the world is wide and beyond your walls, there's so much more things to learn !
