---
title: "Installing Drupal in subdirectory"
permalink: "en/posts/installing-drupal-subdirectory.html"
date: "2012-06-14T12:38"
slug: installing-drupal-subdirectory
layout: post
drupal_uuid: bce95fd6-7e42-4fc7-b632-a6ad6783d9c1
drupal_nid: 6
lang: en
author: haclong

media:
  path: /img/teaser/hi_tech.jpg

tags:
  - "Drupal"
  - "tutorial"
  - "web coding"
  - "Online.net"
  - "redirection rules"

sites:
  - "Développement"
  - "Haclong projects"

summary: "For a straight forward installation of the Drupal CMS, as stated in their install manual, you ought to unzip the drupal archive and with an FTP client, drag and drop the content of the archive into your public directory. Of course, for my part, there is here a couple of issues which I don't really like, first of all, the fact that you can't host your drupal install into a subdirectory and access it straight through your domain name. Searching the web tends to prove that I'm not the only one in need of this option."
---

For a straight forward installation of the Drupal CMS, as stated in their install manual, you ought to unzip the drupal archive and with an FTP client, drag and drop the content of the archive into your public directory. Of course, for my part, there is here a couple of issues which I don't really like, first of all, the fact that you can't host your drupal install into a subdirectory and access it straight through your domain name. Searching the web tends to prove that I'm not the only one in need of this option.

Searching the web with keywords "drupal install subdirectory" returns 137 000 results... Amongst those, the regular set of incomplete solutions, deprecated informations, forum debates about the "what for" opportunity of such a requirement and of course, valid solutions which does not match my case or even solutions, nevertheless, but not corresponding to what I have in mind.

**My purpose**

As said above, I want to install Drupal in a subdirectory but the Drupal website should be accessed as root. Installing Drupal in a subdirectory will ensure you a clean filesystem to manage / manipulate / backup / update.

Consider this :
- the Drupal package (version 7.14 taken for example) installs 20 files and 7 directories,
- add a wiki engine, say Mediawiki package (version 1.12.0 taken for example) who installs 20 files and 11 directories,
- add a gallery, lets say Coppermine (version 1.5.18) who installs 66 files and 12 directories,
- add a CRM, lets say Dolibarr (version 3.1.1) who installs 7 files and 5 directories,
- add an alternative to phpMyAdmin : SQLBuddy (version 1.3.3) who installs 27 files and 6 directories...

You can't possibly install all those packages in the same root directory. Beyond the facts that several packages share the same filenames and same directory names ("includes" for example), your root directory will soon be a total mess. Therefore, you can install all the packages in subdirectories, one per package. Good fences make good neighbours. And there's no valid reason to do an exception for Drupal. The lazziest option is to install the whole Drupal package into the root directory and all others packages in subdirectory but then, you'll have a filesystem with 20 files, all belongings to Drupal and 11 directories which are not entirely belonging to Drupal. This may be an acceptable option but I am still not easy with this.

**My intall**

I have a web hosting solution at <a href="http://www.online.net/" target="_blank">Online.net</a>.
I have, of course, my own domain, say *mydomain.com*
I'll install Drupal 7.
Based on the host phpinfo file, it's an Apache 1.3.34 install, customized for Online.
According to Online online documentation, mod rewrite is enabled.

**The thing**

1. Unzip and install your Drupal package in the www/drupal directory
2. Unzip and install your Wiki package in the www/wiki directory
3. Unzip and install your Coppermine package in the www/gallery directory
4. Create a .htaccess in your web root directory.

Edit your www/.htaccess file

```
RewriteEngine on

RewriteRule (.*) /drupal/$1 [L]
RewriteRule (.*) /drupal/index.php?q=$1 [QSA]
```

*What we've just done :*

```RewriteEngine on```  
We enable the Apache Rewrite engine. Starting from now on, we can add rules and conditions so the Apache will be able to rewrite the http request. There's plenty of sites out there who can explain this part better than me.

```RewriteRule (.*) /drupal/$1 [L]```  
```RewriteRule (.*) /drupal/index.php?q=$1 [QSA]```  
Those are rules which says, basically : *anything* (.*) comes to the navigator, translate to *drupal/anything*

For example :
- <a href="http://domain.com/">http://domain.com/</a> results in the drupal site (meaning there's a translation to <a href="http://domain.com/drupal/">http://domain.com/drupal/</a>)
- <a href="http://domain.com/admin/people">http://domain.com/admin/people</a> results in the drupal use administration page (meaning there's a translation to <a href="http://domain.com/drupal/admin/people">http://domain.com/drupal/admin/people</a>)
- <a href="http://domain.com/gallery">http://domain.com/gallery</a> results in an 404 error page (the translation should be <a href="http://domain.com/drupal/gallery">http://domain.com/drupal/gallery</a> which does not match any page in the drupal site)

This is basically what we want for a start...

Now, what about our subdirectories ? What about our wiki, our gallery and other applications ?

Edit your www/.htaccess file again

```
RewriteEngine on

RewriteCond %{REQUEST_URI} !gallery/
RewriteCond %{REQUEST_URI} !wiki/
RewriteCond %{DOCUMENT_ROOT}/drupal%{REQUEST_URI} -f
RewriteRule (.*) /drupal/$1 [L]
RewriteRule (.*) /drupal/index.php?q=$1 [QSA]
```

*What we've just done :*

As you can see, we add three RewriteCond line to our rewriting rules.

```RewriteCond %{REQUEST_URI} !gallery/```  
We add a condition to our rewriting rules. Basically, now, we say : Apache, you can translate anything to a drupal URL as we said before, except for any URL with a **gallery** subdirectory.
We can add as many condition of the same type for each of our subdirectory which should not be a "drupal" thing.
As for the third line here `RewriteCond %{DOCUMENT_ROOT}/drupal%{REQUEST_URI} -f`, i don't honestly know why it's here and what's its purpose but 1/ it's working and 2/ any tutos I've found out there have one so... can't hurt, right ?

Now shall we test our site ?
- <a href="http://domain.com/">http://domain.com/</a> results in the drupal site (meaning there's a translation to <a href="http://domain.com/drupal/">http://domain.com/drupal/</a>)
- <a href="http://domain.com/admin/people">http://domain.com/admin/people</a> results in the drupal use administration page (meaning there's a translation to <a href="http://domain.com/drupal/admin/people">http://domain.com/drupal/admin/people</a>)
- <a href="http://domain.com/gallery">http://domain.com/gallery</a> results in an 404 error page (what the... ?)

In fact, you have to add another .htaccess in each of your subdirectory :

Edit your www/gallery/.htaccess file

```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} -s [OR]
RewriteCond %{REQUEST_FILENAME} -l [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^.*$ - [NC,L]
```

If the package you're installing already has rewriting rules, you shouldn't get any issue and if you do, i believe you have to adapt those rewriting rules.

Shall we test the site once more ?
- <a href="http://domain.com/">http://domain.com/</a> results in the drupal site (meaning there's a translation to <a href="http://domain.com/drupal/">http://domain.com/drupal/</a>)
- <a href="http://domain.com/admin/people">http://domain.com/admin/people</a> results in the drupal use administration page (meaning there's a translation to <a href="http://domain.com/drupal/admin/people">http://domain.com/drupal/admin/people</a>)
- <a href="http://domain.com/gallery">http://domain.com/gallery</a> results in the Coppermine page. Whohoo !

Job is done...

You can browse freely and happily your different pages / packages knowing in the same time that your filesystem is neat and clean and... what's this ?? When you're in your drupal site, all the link are drupal/admin/people, drupal/node etc... This is definitely not what you were expecting...

Although this is not really blocking and since all things are working well, we can close our eyes and pretend we haven't see anything... but you know this drupal ghost will come back in the shadow of the night and haunt your night... and it looks definitely nicer without the drupal directory which just show up everywhere. Beside, this is what I want.

For cleaning the "drupal" trace everywhere, just edit the drupal/sites/default/settings.php. Find the $base_url variable (which is a fake commented value). You can uncomment this line or add yours (keeping the initial one as history).

```php
$base_url = 'http://domain.com' ;
```

Here you are. Nice and clean.

Hope this tutorial will help you.
