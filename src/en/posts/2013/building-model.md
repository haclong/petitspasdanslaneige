---
title: "Building the model"
permalink: "en/posts/building-model.html"
date: "2013-01-28T18:04"
slug: building-model
layout: post
drupal_uuid: 07ace1a2-cb80-4792-a9ca-edc78932aac7
drupal_nid: 27
lang: en
author: haclong

media:
  path: /img/teaser/coding_lg.jpg

tags:
  - "OOP"
  - "MVC"

sites:
  - "Développement"
  - "Haclong projects"

summary: "As you ought to know by now, i'm currently discovering the MVC pattern. For someone who wrote few php websites in procedural way, i can hold the Controller and the View concept. The View is the templating part. The Controller is the old index page I used to code with the switch case instruction which would include the correct php script depending on the HTTP request. Plus, the coding / relationship of the View and the Controller are obvious while using Zend Application. It’s maybe too obvious but we may want to see this bound later. But then : What is the third part of the MVC pattern ? What is a Model ??"
---

As you ought to know by now, i'm currently discovering the MVC pattern. For someone who wrote few php websites in procedural way, i can hold the Controller and the View concept. The View is the templating part. The Controller is the old index page I used to code with the switch case instruction which would include the correct php script depending on the HTTP request. Plus, the coding / relationship of the View and the Controller are obvious while using Zend Application. It’s maybe too obvious but we may want to see this bound later. But then : What is the third part of the MVC pattern ? What is a Model ??

Searching the net does not give you a straight definition of what a model is. The model is kind of an abstraction out there but it ought to include real concepts at last. For example I’ve read a lot about the issue concerning the model size against the controller size. Except the fact that many are arguing about thin model against fat controller or the other way around, I still don’t get a clue about what a model is. And if i can’t grab this idea, how to know which way is better ?

While I was still digging into the model concept, I started two differents web applications, each one for two differents projects.

### A first project : a community website

My A project is a community website.
This means a user list with several datas.
This also means dealing with authentication, ACL and security.
This also means user friendly access to forms and screen and whatever.

For this project, my models architecture looks quite easy to create.
The first obvious object to code is the user, of course. I can easily imagine that the user object will be the result of the user datas stored in the database merged with datas from all the minor reference tables for example.
There won’t be much I/O access to the database : since all the datas are loaded in the objects, and unless there’s a need to modify the raw datas in the database, there’s no need to keep the link to the database.
Then I realize I may have to identify the current logged in user versus the community users of the website. Current logged in user has to be identified peculiarly because it gets dedicated security and access while other users are just passive datas. So I start to ask myself if this means that I have two different objects : is there a “me” object and a “user” object ? But a “me” object is a variation of the “user” object since all properties should be the same modulo few ACL / security datas. Does it means that my “me” object inherits from the “user” object ? This might be the correct option...

### Another project : administrating a personal DVD database

On the other side, my B project is a database administration website.
Since it will be accessed by one user only, there’s no real need to deal with ACL and security and I can mandate Apache and its HTTP authentication process to take care of this part.
But in the B case, does it means that there will be an object for each table of the “real” database ? And what about all my references tables which have roughly two columns : id and value ? Should I create one distinct object for each reference tables ? Doesn’t this look to repetitive and redundant ?
As for database access, I can suppose this time there will be more often access to the database. Since it’s a database administration website, we can say that database access will be constant.
And there one more feature : datas should be massively loaded through csv/excel documents.
This last feature tells me that datas can comes from an HTML form as an imported documents as well. This is obviously two differents methods to load datas to my database. This means that I have to think my objects wisely. And I have to build comprehensive and trustworthy logs and tons of reports since massive loads can lead to a mess if there’s any errors in the process.

### Firsts attempts

As you can see, I was in two different situations. Project A will have to deal with a lot of front office issues while project B will deal with backoffice issues.

On the first weeks, i was coding two models, both very differently, depending on the website I was developping. This does not please me since there might be functionnalities I can’t reuse from one website to the other one. But I was in the middle of my experimentations so I keep going my way.

My chief concern is the nature of my object. At this step, I’ve read a few posts on the web concerning the object which is a “has-a” versus a “is-a” issue... Obviously, an object can contains other objects or an object is something but not both at the same time.

For my project A, i ended with a UserObject object with a getUser() method.
The getUser() method instantiate a UserDatas object which will deal with SQL query.
Therefore, UserDatas->selectUserById($id) will return the raw SQL ressources.
The UserObject->getUser() will parse the raw SQL ressources and bind each datas to a UserObject properties. Once my UserObject is instantiated, I can manipulate it without connecting / disconnecting constantly from the database.

For my project B, i ended with a TableAObject object which will deal with the SQL query, return the raw SQL ressource and bind the raw datas to TableAObject properties... This is still not satisfactory... And I realize with fright that my controllers get bigger and bigger because I instantiate my TableAObject and use all the object methods one after another...

Obviously, this is not the correct way to do things.

### The SOLID principles

I browse the internet some more, read few things about the <a href="http://en.wikipedia.org/wiki/SOLID" target="_blank">SOLID principles</a> and somehow, decide I should stick to it, more or less. I also have the opportunity to dig into a code built by experienced coders and since it’s the only object oriented code at hand, I also learn from it.

The more I learn, the more i split my objects to smaller chunks. I was worried about the demultiplication of my objects but at last, following the SOLID principles, it seems the objects oriented programming ought to be chunked into small parts...

### My model structure

Here is my model by now :

I created ***_domain objects**.
*_domain objects just define your object, its protected properties and barely no methods except getters and setters. And of course a constructor, if needed a toArray() method and a toString() method. Then, when you will use your object, it will be loaded with only it’s properties and no extra informations that you will need to build things up but that you won’t need anymore once the things are built.
For my part, my *_domain objects

Then there’s all those ***_service objects.**
*_service objects purpose is to return your *_domain objects. Each *_service objects methods should return a *_domain object. So the *_service objects methods is very crucial because it will build your object : querying the database, processing date/time value if needed, formatting number if needed etc... and then, binding each datas to your *_domain object properties.

Since, of course, there will be several *_service which will query the same database table, I create ***_table objects.** 
Each *_table objects is bound to a database table. The only purpose of *_table objects is to querying the table with SELECT query or INSERT/UPDATE or DELETE queries. The *_service object will instantiate the correct *_table object and get the SQL ressources my *_table object will return.
Since the queries will not change often, i can create several method for my *_table object and each method will return the result of a particular query.
*_table->getDatasById($id) ;
*_table->getDatasByLabel($label) ;
etc...

Applied to my B project, i will (it should work but it is not verified yet) create *_csv objects. The *_csv object will parse the CSV file and return an array containing all the file content. Then the *_service object will parse the returned array and bind the datas to the *_domain. So at last, I still manipulate my *_domain objects and barely do not bother about the datas source and format. I will try to stick to this principle.

On the other way around, if I want to update datas in the database, I use the *_service object, fetching the *_service object with a *_domain object with updated (or new) datas. The *_service object will parse, sort, format the datas and instantiate finally the *_table object which will perform the query.

*_service objects and *_table objects are technical objects. They do not include any business rules. They are useful to return raw datas although the *_services objects are already formatting the datas somehow. On the final, we only need to manipulate *_domain objects to make the job done. *_domain objects are used by upper level objects which will sort them, use datas to display on the view, load them into AJAX script etc...

This is by far the structure I am currently using. Since i’m still coding both my applications, I don’t know if the model is viable yet but I’ll try to stick with it for some weeks and see how it can evolves.

I hope this is helping some of you who are still wondering how to build a model.
Please feel free to comment and tell me if i’m too verbose and not directive enough... I didn’t want to get too detailed in this post since this is only about rough design but if you need more detail, i’ll repost something more detailed on this subject.
