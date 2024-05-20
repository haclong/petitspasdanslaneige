---
title: "CoffeeBar Application 1/19 - Introduction to event driven programmation"
permalink: "en/posts/coffeebar-application-119-introduction-event-driven-programmation.html"
date: "2014-12-22T18:33"
slug: coffeebar-application-119-introduction-event-driven-programmation
layout: post
drupal_uuid: 4b9b6772-9dc9-4053-9db3-212dea959c39
drupal_nid: 104
lang: en
author: haclong

book:
  book: manage-coffeebar-event-driven-programming
  rank: 1,
  top: 
    url: /en/books/manage-coffeebar-event-driven-programming.html
    title: Manage a coffeebar with event driven programming
  next: 
    url: /en/posts/coffeebar-application-219-install-framework.html
    title: CoffeeBar Application 2/19 - Install the framework

media:
  path: /img/teaser/file9271237667217.jpg
  credit: "Morguefile.com"

tags:
  - "events"
  - "programmation événementielle"

sites:
  - "Développement"

summary: "Though i feel it easier to do applications with procedural programmation, i know it exists other ways to build applications, based on event driven programmation. Even though PHP does not look like the right language to do event driven programmation, we will see how Zend Framework 2 framework will help us set components to wrap a nice event driven application for the web."
---

Though i feel it easier to do applications with procedural programmation, i know it exists other ways to build applications, based on event driven programmation. Even though PHP does not look like the right language to do event driven programmation, we will see how Zend Framework 2 framework will help us set components to wrap a nice event driven application for the web.


## Procedural vs Event driven ?

<a href="http://en.wikipedia.org/wiki/Procedural_programming" target="_blank">Procedural programming</a> is the most basic way to start coding. All you have to know/do is to define a list of ordered directives and the program is meant to run each directives one after another always in the same order. When you start to learn programming, everybody will tell you to sketch organigrams to settle the logic of your code. This is exactly how procedural programming is working. One step after another.

<a href="http://en.wikipedia.org/wiki/Event-driven_programming" target="_blank">Event driven programming</a> is another way to consider programming. We don't code with a list of ordered directives anymore but we base the code on a list of events. The application is running and '**something happens**' when an event is happening. Of course, we can say that in procedural programming too, '**something happens**' when an event is happening : when i click on a button, something happens. But between both ways, the difference is in the way you write the code. Not in what's happening at all.

In **procedural programming**, you would write :

```php
if (bouton_clicked())
{
  prog->do_something() ;
}
```

This means - at the architecture level of your application - when you have the method / functions which says (`bouton_clicked()`) you HAVE TO KNOW all the elements which will do something once the button have been clicked : this means **dependencies management**.

In **event driven programming**, you shouldn't need to manage the dependencies.

On one side, you will have the button in the code :

```php
// bouton
trigger (oh ! i’ve been clicked !) ;
```

and on the other side, an element will do something because he knows the button have been clicked.

```php
// prog
when(bouton: oh! i’ve been clicked !)
{
   then do_something() ;
}
```

The element reacting does not need to know WHICH button have been clicked and the button, on his side, does not need to know WHO'S doing what when he has been clicked... On the dependencies issue, we are more than ok. But you'll need to be clean and straight... we shouldn't spread our listeners (elements reacting to events) anywhere and we should keep an eye on elements which are triggering events because, in my opinion, we can't identify the link between both components...

In the end, you can choose either paradigms, procedural or event-driven, your program will do the same thing (because, in the end, this is what is expected of you : to code an application which is doing what we need/want it to do). In web applications, i think it is easier to use procedural programming because the web is based on request and response pairs (do this when i do that, do that when i do this)... but in gaming applications, in exemple, the event driven programming is more relevant.

## The project

I find out the event-driven programming when i was looking for a completely another thing... Talk about serendipity... I wanted to have more informations on the <a href="http://en.wikipedia.org/wiki/Command%E2%80%93query_separation" target="_blank">Command-Query Responsibility Segregation</a> principle. The tutorial i've found meant to explain the principle through an example but then i find myself in a middle of another way to use the code. The <a href="http://www.cqrs.nu/tutorial/cs/01-design" target="_blank">original tutorial</a> is meant for the the **.Net** language (i think). We will reuse the tutorial but doing it for PHP.

### The scenario

We will code an application for a small coffeebar. We will focus on the **tab**. One tab will help us keep track of our clients who are showing at our coffeebar. When the clients come to the coffeebar, they take a table and a **tab is opened**. Clients then can **order drinks or food**. **Drinks are served** by the waiter but **food need to be prepared** by the cook before **being served** by the waiter.

All the time the clients are in the coffeebar, they can order new drinks or new food. They can** cancel food** only if the food has not been prepared yet and they can **cancel drink** only if the drink has not been served.

In the end, we can** close a tab** when the client is paying for it. A tab can't be paid if there's still food or drinks unserved or not cancelled. Our coffeebar does not allow credit so a tab need to be fully paid. The client can add a tip though.

### Events

If we were doing **procedural programming**, i can imagine you squirming and ready to create your entities already : client, drink, food etc... For your food and your drinks, you'll have a property which will hold the status : ordered, prepared, served... If the drink is ordered, update the status... etc... we all done that.

In **event driven programming**, all those objects does not interest us yet. What is catching our attention here, is what is happening. And each time it is happening something, it is an event in our application. And keep in mind that an event is always something who alrealdy happened. Always in the past.

Lets look at our scenario again, with some code this time :

*When the clients come to the coffeebar, they take a table and a tab is opened*.

- a ***Command***: OpenTab
- an ***Event***: TabOpened
- an ***Exception***: TableNumberUnavailable

*Clients then can order drinks or food.*

- a ***Command***: PlaceOrder
- an ***Event***: DrinksOrdered
- an ***Event***: FoodOrdered
- an ***Exception***: TabNotOpened

*Drinks are served by the waiter*

- a ***Command***: MarkDrinksServed
- an ***Event***: DrinksServed

*but food need to be prepared by the cook*

- a ***Command***: MarkFoodPrepared
- an ***Event***: FoodPrepared

*before being served by the waiter.*

- a ***Command***: MarkFoodServed
- an ***Event***: FoodServed

*All the time the clients are in the coffeebar, they can order new drinks or new food*.

- a ***Command***: PlaceOrder
- ...

*They can cancel food only if the food has not been prepared yet and they can **cancel drink** only if the drink has not been served.*

- a ***Command***: AmendOrder
- a ***Command***: MarkFoodCancelled
- a ***Command***: MarkDrinksCancelled
- an ***Event***: FoodCancelled
- an ***Event***: DrinksCancelled
- an ***Exception***: CannotCancelledServedItem
- an ***Exception***: CannotCancelledPreparedItem

*In the end, we can close a tab when the client is paying for it. A tab can't be paid if there's still food or drinks unserved or not cancelled. Our coffeebar does not allow credit so a tab need to be fully paid. The client can add a tip though.*

- a ***Command***: CloseTab
- an ***Event***: TabClosed
- an ***Exception***: TabHasUnservedItem
- an ***Exception***: MustPayEnough

The original tutorial does insist on the fact that we need to keep as close to the business rules (and lexicon) as possible, it is important to keep clear and understandable entities and it is unwise to use of shortcuts : we need an **OpenTab** command to get a **TabOpened** event. Please do not hesitate to refer to the original tutorial where the <a href="http://www.cqrs.nu/tutorial/cs/02-domain-logic" target="_blank">whole business logic mechanism is described in detail</a>. The tutorial includes Behaviour Driven Tests.

I wasn't able to successfully install Behat but if you pay attention to the test scenarii of the original tutorial, the **Command/Event logic takes all its meaning.**

Do not hesitate to create clear and distincts events. Avoid generic names such as 'Created' or 'Updated' etc... because all your events will finally end up by looking all alike otherwise.

Now let's get into the subject. Please keep the scenario in mind.

This tutorial will be long. It's better to get it from the beginning since i will only expose chunks of code and later parts won't include parts which are already being told about. For example, i won't repeat basic instructions such as implements, extends, use etc... Thanks for your fidelity. Sorry for my english, i'm not that good sometimes and other times, i feel it's getting worse.

*You'll find the full application in my<a href="https://github.com/haclong/coffeebar" target="_blank">github</a>*
