---
title: "Conceiving a website with Zend Framework"
permalink: "en/posts/conceiving-website-zend-framework.html"
date: "2012-09-26T12:49"
slug: conceiving-website-zend-framework
layout: post
drupal_uuid: 8cc9bdb2-1d78-42a4-a6fe-e3930068c785
drupal_nid: 23
lang: en
author: haclong

media:
  path: /img/teaser/search_engine_friendly.jpg

tags:
  - "Zend Framework"
  - "web coding"

sites:
  - "Développement"

summary: "Here are some basics about building an MVC application with Zend Framework 1.1x. These may sound really logic and all of you, advanced developers, may already know all of this but since i have to find out it all by myself (and it may be still on development), i thought it is good to add some development reflexion here. "
---

Here are some basics about building an MVC application with Zend Framework 1.1x. These may sound really logic and all of you, advanced developers, may already know all of this but since i have to find out it all by myself (and it may be still on development), i thought it is good to add some development reflexion here.

As I stated it on my intro, my conclusions about development strategies may change in the future, depending on my observations and my experimentations. On your side, you are also free to get your own conclusions. But as I started to build my first web application with Zend Framework, i also have to learn more about MVC pattern. In fact, I already heard about this pattern but only on a theorical basis. I never had the opportunity to apply an MVC application.

Applied to the Zend Framework, here is what i find out :

The VIEW part of the MVC pattern will only manage the HTML of your website. This is the easiest part. To manage correct views, just imagine you're teaming with an HTML integrator/web graphist who knows nothing about php and dev. So you have to build for him neat and clean datas so he can decide how all those datas will display on screen. He shouldn't be bothered with test pattern or with looping pattern. This is still an issue for me since i had not yet think about how to prepare datas for a search result display for example... or any kind of listing type of display... But, for example, for links, i build view helpers which will build the correct &lt;A&gt; tag except the label of the link which will be the only one argument of my helper. This argument, for me, is the responsibility of my graphist. This is working for static link such as the contact page, the logout page or the homepage for example...

The CONTROLLER part of the MVC pattern will only manage the HTTP requests (this is a really basic summary). When you build your controllers, all you have to ask yourself are those kind of questions : what is the HTTP request ? With the elements in this HTTP request, what should I do ? And the answer should be stuff like : instanciation of one of your business object and calling its methods. But you shouldn't instantiate an object, assigning properties, calling several methods and then return datas. The big part of the work should be inside the next MVC component. The controller should stay as light as possible.

The MODEL part of the MVC pattern. This part will contain all the logic and all the classes which is really your business. If you're doing a blog, this means your model should have at least classes such as Post, User, Comments for example. If you're doing an online shop, your model should have classes such as User, Basket, Item as example...

As you create your model, you'll find that you'll need to create classes which are more technical or even abstract. Classes such as database connection, xml parser, file system manipulation, privileges handling, configuration management... For my point of view, if you're building your one and only one web application, all those utility classes can be stored inside your app/model folder. No need to put them elsewhere. But if you plan to build more than one web applications, so you should consider creating your own toolbox with all your utility classes. Such toolbox then should be stored inside the lib folder, side by side with the Zend folder. Indeed, while building a web application with Zend Framework, the Zend library will be stored in a lib/library folder. This library folder is meant to host The Zend library, any other third party library if needed and yours, if any.

As for your library, you can build it with raw php functions (see the php.net manual) or you can use any framework, ie Zend. Using existing framework will ease the job but then, you'll be tight to this library. This is a choice to make. You should do the same choice while building your models. Should they use Zend components or should they use raw functions ? Or any other framework ? The point is : Zend Application will create all you need for the bootstrapping, the controller and the view part. Zend Application also instantiate the Zend Loader component which will be able to load any classes using the same naming pattern. This mean : you can create your own objects, outside any Zend Component but you'll have to keep the naming as Zend Loader expect it to be so you will be able to use the Zend Loader component. This also mean that if you already have an MVC web application that you need to move to Zend Framework, you will only need to refactor the bootstrapping and the controller/view association... the model should remain untouched...

As I've stated it before, Zend Framework is a really good library. Its learning curve is - for my part - long and hard on the beginning because i have to learn a lot of thing outside Zend, meaning the MVC pattern logic and the OOP logic also. Once i've grabbed all those infos, once i've understood where each elements belong to which elements and what is the scope of each elements, the learning is way easier and as I was blaming the documentation of Zend Framework to be confused on my first weeks, it's now so much clearer to me. Really. Since I still remember where were my difficulties while learning ZF, I'll try to explain things here.
