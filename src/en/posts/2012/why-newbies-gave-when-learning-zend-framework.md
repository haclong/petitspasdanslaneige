---
title: "Why newbies gave up when learning Zend Framework ?"
permalink: "en/posts/why-newbies-gave-when-learning-zend-framework.html"
date: "2012-06-04T14:00"
slug: why-newbies-gave-when-learning-zend-framework
layout: post
drupal_uuid: 2a32973e-71b0-49a4-92d7-795c53fbbb85
drupal_nid: 8
lang: en
author: haclong

media:
  path: /img/teaser/bookshelf.jpg
  credit: "estudio breder"

tags:
  - "Zend Framework"

sites:
  - "Développement"

summary: "Beside the discovery of CMS through Drupal, i also wished to code my own web applications. So I was looking for tools, library, thing that will help me to code those applications without, you know, reinventing the wheel once again. Here I met the framework. More precisely, the Zend Framework. They are more, out there, but even I don't know why I chose ZF. Again, as for Drupal, this framework just look like a real swiss army knife php library and I always liked tools where each things are in its own place and... well... you know. "
---

Beside the discovery of CMS through Drupal, i also wished to code my own web applications. So I was looking for tools, library, thing that will help me to code those applications without, you know, reinventing the wheel once again. Here I met the framework. More precisely, the Zend Framework. They are more, out there, but even I don't know why I chose ZF. Again, as for Drupal, this framework just look like a real swiss army knife php library and I always liked tools where each things are in its own place and... well... you know.

I downloaded Zend Framework 1.11 version because the Zend Framework 2 is still in dev status and nothing is more difficult than learning new concepts while you have to test the tool you're using... While browsing the Zend Framework manual, it looks like there's a lot of packages / objects there who might be useful for a regular website. The Zend Framework online documentation also owns few quickstart tutorials to help understand the framework. Searching Internet will, of course, also helps... So it seems.

**Beginner hard time**

Applying the framework quickstart tutorial is successful. This is reassuring.

Then I try to learn more. I found some other ZF tutorials out there and try to apply them for my own benefit. There I discover the "pot-aux-roses"... I discover the first ugly thing which lie beneath... There's a HUGE difference between ZF 1.8 and ZF 1.11. Although there's only 3 minor versions between 1.8 and 1.11, if you choose to follow ZF 1.8 tutorials mixing with ZF 1.11 tutorials for a beginning, it will just drive you mad. Instructions for ZF 1.11 will contradict what said in ZF 1.8 tutorials. You won't know what's true and what's not. This was a living nightmare. I have to dig for more or to forget all about ZF.

More, I used to code in procedural fashion. One instruction after another. Scope and range do not mean anything for me. And all I know about object is some beginners notions such as *a car is an object. my car object can have properties such as its color (red) and its wheels number (4). my car object can also have methods such as my can can start(), stop() and drive() for example. objects can inherits methods and properties from other objects. For example, my car object extends a vehicle object.*That's fine. That's pretty clear. But now what ? When I try to apply it to a web application, where's my car ?

Learning ZF means - at least for me - learn a framework _AND_ learn OOP. While reading ZF documentation, it is said that ZF build MVC application... Damned... another concept to deal with. Added MVC to my class program...

As you can see, i have now a lot of things to learn... I just don't know why, but I didn't give up. I just try and try more and more. It sometimes drives me mad but things slowly build up themselves... My web project is far from finishing yet but there are things which seems more clear today.

**Zend Framework online documentation difficulties**

Sadly, the ZF documentation is far from clear. This is the second big ugly thing which lie beneath the ZF.

There's a lot of users who compare the ZF documentation with the PHP documentation. Of course, the PHP documentation is _THE_ online documentation reference for a lot of beginners in php out there. It is, for my part, the most clear documentation I ever read about a scripting language. With a wonderful search engine which can help you find _THE_ function you're looking for. If you ever get to read the ZF online documentation, you'll be agree with me and many others : it has _NOTHING_ to do with the clean and clear PHP online documentation. It's confuse, there are advises, proposals, debates, notifications, even howtos but nothing really about the real thing... This is very frustrating.

As I learn more and more about ZF, I realize now that's not that easy. The ZF online documentation shows how it works (it really does !) but it does not mention anything about ranges and scopes of objects... Therefore, if you don't know how to deal with **$this**, $this cannot help... and in the documentation, there's plenty of $this... but who's $this... this remains unclear.

This for one part. For another part, the ZF online documentation said somewhere that its classes can be used in standalone. Meaning you can pick any class you want/need and use it by itself. You won't need to load another ZF class. ZF classes can be used separately. Since I start brand new applications, I won't need to use them separately but in case you have existing web applications and you don't want to refactor them, this is pretty useful. Problem is, again, that the ZF online documentation is not clear on this part and when you read it, it makes you believe that you'll need several ZF classes to build a new feature for your web application. It delivers a very bad message since for one hand, it says that you can use any ZF class when on the other hand, it shows what seems to be the exact contrary. Very confusing.

And last but not least : the ZF can be used to build whole application. As used in application option, ZF classes are used here altogether, interacting one with another, not as in the standalone option. Most tutorials out there concerns mostly ZF in "application" option. You build an application using **Zend Application**. I know, it sounds so evident but of course, when you're a noob, it's not that clear. Anyway. The application has an entry point and a bootstrap... Again, for me, new words, new concepts... Zend Application when used with a proper configuration file will load a lot of "things" you won't need to create, to declare... it's already there... Oh yeah ? Don't even speak about the Where, as for noobs, we don't even know the What... This is confusing.

Once you understand each of these points, I don't pretend you'll find ZF more friendly but this is my way to explain how ZF is that much unpopular out there. As I'm still in the middle of my learning curve and learning more and more concepts every week, i'll try to add more and more tutorials here hoping to help beginners.
