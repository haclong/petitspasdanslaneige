---
title: "CMS, oh my CMS"
permalink: "en/posts/cms-oh-my-cms.html"
date: "2012-05-29T09:45"
slug: cms-oh-my-cms
layout: post
drupal_uuid: be1ee9e1-6df7-45a9-ad8a-9c0d9e200f80
drupal_nid: 3
lang: en
author: haclong

media:
  path: /img/teaser/il_fullxfull.272900426.jpg
  credit: "racetay"

tags:
  - "internet"
  - "CMS"
  - "Drupal"

sites:
  - "Haclong projects"

summary: "When I decided to refactor my own website, I was hesitating between a couple of options : building it from scratch ? Too tedious and after all, i will not reinvent the wheel yet one more time. Giving up my website project and use social network and their tools instead ? Not personal enough and I don't like their philosophy : Social network are not really public datas. You have to subscribe to access the content of the network. So here I am, back to my project. With my last but not least issue : should I build the site using a CMS or build it with a framework ?"
---

When I decided to refactor my own website, I was hesitating between a couple of options : building it from scratch ? Too tedious and after all, i will not reinvent the wheel yet one more time. Giving up my website project and use social network and their tools instead ? Not personal enough and I don't like their philosophy : Social network are not really public datas. You have to subscribe to access the content of the network. So here I am, back to my project. With my last but not least issue : should I build the site using a CMS or build it with a framework ?

I was thinking to start with a sandbox project to test CMS in real-time.

But who's there ? Here he is again, Mr Please-Can-You-Build-Me-A-Website. I know him for a long time. He's asked me for website from time to time and there's already two failed attempts but, from time to time, here he is again. And again and again. In fact, he's not truly troublesome. He just asks me for a site. Another one. The one thing he has not realized yet that is beyond the site, he'll need to maintain it and add content to it. An empty site does not interest anybody over here. But, well, I do like him. Not enough to do the job, but enough to build the site. Plus, i do like building sites so, it's just training for me.

Since I predict a yet-another-failed-project again, i try to do this quick and as clean as possible. And it gives me the perfect situation to test a CMS.

Here are the requirements :

- The site is build for an association
- The site should be multilingual
- The site includes members
- The site contents are events for one part and names for the other part.
- Events are displayed in a calendar, by event dates, of course.
- Names fill in an address book
- Authenticated users can add either events or names.

Sounds easy.

CMS stands for Content Management System. As it is stated, it is a system which allow you to manage content without worrying about the how tos. It does include an administrative panel. Depending on lists of CMS found on Wikipedia, i finally narrow down the choice to two options : **Wordpress** which is most famous but still get its historical "blog" aura and **Drupal** which sounds more complex, which sounds to be able to do anything, to pretend to be anything. The more it's complex, the more you can bend it to your will... This is my belief... Obviously, I prefer not to pay attention to this voice inside my head mumbling : The more it's complex, heavier it gets. So I finally choose Drupal. Beside, I'm very curious about Drupal so I want to test it. I want to apologize to all of you who fancy other CMS solutions and/or who despise Drupal.

Drupal 7.x was on beta then and my friend is very anxious to get his site ready so I prefer install Drupal 6.x.

**Multilingual Drupal**
The site should be in english (Drupal native language), in french and in vietnamese too. So after reading a few blogs about multilingual Drupal, i choose to install a Drupal profile which includes the **localization update** and the **localization client** modules. With this profile, you can choose the language used for installing Drupal. Once the language chosen, all the translation files are downloaded and we proceed with the installation process. I add extra modules for more multilingual features : **transliteration** module will ensure that there's no filename with unicode character which can mess with the filesystem, **internationalization** module will allow me to translate blocks, menus, taxonomies, nodes and keeps nodes informations synchronized when needed, **language icons** module is a small module to get flags instead of language links, **tContact** module will allow the have a site contact form multilingual and **poll aggregate** module which will allow to aggregate votes of a multilingual poll. Remember that a poll is a node in Drupal. When you translate the poll, you create another node which are somehow linked. Users can vote on any of the poll translation nodes. Vote are attached to the node where the user has voted. When it comes to gather votes, you'll have to sum the votes of all the translated nodes. This is what poll aggregate will do. Beside, it will forbid the same user to vote for each translation of the poll.
There's a last thing I need to translate : when a user becomes member of the site, Drupal send preformatted welcome email. By default, those preformatted emails are in the Drupal native language. How translate those messages so each user can get the email in its own language ? After few hours browsing internet once more, i realize i have to edit the drupal configuration file (settings.php) and declare all native variables as translatable variables. This is not really user friendly and i was not happy with it. Remember, my primary target is to build a ready-to-go website - with a documentation - and never ever get involved into this website again. Ever. Editing the settings file can not be an option when you know you'll give the keys to a real noob. But... I have no better solution - with Drupal yet. So I go on with the building and try to write down the clearest documentation I can imagine for this part. This is not fun anyway because then, I have to write down a super documentation which, as all of you know, is the thing nobody really like to do, even when it can save your life sometimes...

**Privacy &amp; Security**
Once I was able to build a correct multilingual site, I try to build content as he wished them to be meaning : events for one part, and then name (for the address book) on the other part. Events have dates, descriptive text, maybe a contact field for those who wants more details. Name have name of course, and then addresses, phone numbers and so on. So I decided to install the famous **CCK** module which allow you to create as many custom fields as you want for any of your content types. I have to install **calendar** module and **date** module as well. Somehow, i had to install **views** too. With all those new modules, i can create both new content types. Whence I was thinking about it, i realized that for both content types, there are fields with personnal datas and we sure do not want to give access to those informations without at least some kind of confidence relationship. So, with the content permission sub module, i forbid access to personnal datas fields to anonymous users. Only authenticated users can have access to those informations. I'm quite worry about this part since my friend do not have a realistic overview of the use of Internet. Does he even care if his mail address is showing up from here to there on the web ? I don't even know. But for sure, i don't want that a site I've done show those informations, at least, not at delivery time. By the way, my friend reveals his complete innocence when I show him the **CAPTCHA** module i've just installed. He doesn't even see the slightiest interest of this kind of feature... And I keep asking somebody overthere : why me ???
I set up the display of fields for each content types, manage to create several views for archives and upcoming events lists. I get stuck there. Truly. When I manage to create the archived events menu (you know, you have this list of month - year and when you click on the link, you'll have all the events matching the said month and year. This is working wonderfully well. You have to detail the granularity which is fixed to month at large. But then, I have an issue with the current month. Since we are talking about events to come, you may have for the current month events which are already passed and are therefore archived and you can also have events to come, let say, no later that tomorrow... I discover after a lot of tests and trials that I can't separate the granularity options for filtering datas and then, the granularity to display in the link. If I want to get events which have already expired and events which are still to come, both cases in one single month, my granularity should be at the day level. If I select the day level, then I won't have the menu by month/year but by day/month/year... I've tried several combinations but cannot get the result I was expecting. I'm kinda disappointed on this point but, well, there's no *that* much sites with calendar and events to manage...

**Gadgetization**
I'm a straight plain text style person. Pictures worth a thousand words but silly as I am, i'd rather choose the thousand words more than choosing the picture... Unless I really have too. That's truly stupid, I know, because pictures are also very nice. Yeah I know... I quit trying to list all those stupidities of mine... Events should have pictures or posters. Users should be able to add pictures to their event contents. And why not video too, let say, for a demo or a clip about the event ? So I add the whole **emfield** module with all the **media:** libraries attached to it. Now, with this module, inserting youtube video is easy as pie. Drupal URL are ugly... one thing you can't deny truly. So I have to install **pathauto** and **token** modules. Now all urls are nice and clean.
About images, my next target is to allow users to upload images from their computer to the site. This I don't like because the diskspaces is not very big (the choice was not mine), and internet users nowadays do not really realize how much spaces is a picture... I first install **node_images** module and making this kind of collaborative work. This my friend don't like. He's not really into the collaborative think yet... So I install several other different modules but in fact, any uploading module I install, I still kept having an AJAX HTTP recurrent error I cannot get rid of. It keeps showing up no matter the patchs I tried to install. I was loosing my time and beside, remember, there's still no more diskspaces for allowing a lot of uploaded files. So I drop this feature... maybe later.
I add few other gadgets such as polling feature, the **404 blocks** module so the site theme will not disappear when there's a 404 or a 403 error and the **custom search** which will allow to search in the address book only.

The site was launched on october 2011 after long months of preparation. In fact, the site was ready pretty soon with all its features but my friend wants a full documentation and frankly, i don't even know how to write down a manual for tools such as wordpress or drupal. I manage to write one down anyway. I refrain to put the manual into the Drupal site since there's information there to reinstall the site if needed... Figure it out : how to access the manual inside Drupal if the Drupal installation is corrupted ? Since then, there's no activity at all on his site. I knew it. Another dead site out there.

But this is a good experience. I have the opportunity to test Drupal in real situation with real requirements. Their modules library includes tons of features but sometimes, there are overlapping functionnalities from one to another module. What I really don't appreciate is how much modules you have to install to get a decent website. This part is really bothering me. Even if the site i've done is a total failure, my first attempt with CMS turns out to be pretty successful.
