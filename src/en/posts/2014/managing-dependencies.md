---
title: "Managing Dependencies"
permalink: "en/posts/managing-dependencies.html"
date: "2014-12-04T15:06"
slug: managing-dependencies
layout: post
drupal_uuid: 99a0513a-993c-4916-88e7-2e8792d78cb4
drupal_nid: 102
lang: en
author: haclong

media:
  path: /img/teaser/jeu_de_contruction.jpg

tags:
  - "dépendances"
  - "dependency injection"
  - "code"

sites:
  - "Développement"
  - "Haclong projects"

summary: "As far as I get it and though I don’t really know if i can convince you, i realize that models/entities/classes shouldn’t be dependant of each other. The less they are dependant, the better."
---

As far as I get it and though I don’t really know if i can convince you, i realize that models/entities/classes shouldn’t be dependant of each other. The less they are dependant, the better.

This, translated to common words, can be sum up VERY ROUGHLY :

<cite>Do not use `new` keyword within any of your classes.</cite>

Another way to check if your class is tightly dependent : check the `use` keyword : if your object is using TOO much different objects and moreover from different modules/libraries/concepts, than we can say there’s something wrong with the way you build it up.

Then, HOW to use other classes without creating new objects ?

We instanciate objects and then, INJECT them into our classes.

### How to inject dependencies ?

There’s different strategies :

You can use the **constructor**, create a constructor with as many arguments as you have dependencies and set each argument to a property. From outside that object, you create all the objects you need and pass them through the constructor. With this strategy, you ensure that the dependencies are mandatory.

You can use **setter methods**, just like for any of your property. With this strategy, you cannot be sure the dependencies are mandatory. You have to manage de default status if any.

You can use **interfaces**, though i don’t get this right so i won’t talk about that part.

Within our class, the dependency will be a property just like another and, still within the class, we will manipulate and return such property and barely not caring whether the dependency is an instance of class A or class B… All our class has to know is just HOW to use its dependency.

There are exceptions to this rule :

**Factory** object HAS to use the `new` keyword. It is because they are factories. They are meant to return a new object.

And for my part, I don’t inject `ArrayObject` either. I consider it as a type more than a dependency… But it is a personal point of view and i am still thinking whether it is right or wrong.

### Instanciating objects

Oh… of course… I said earlier : *We instanciate objects and then, INJECT them into our classes.* I have covered roughly the injection part but now, WHERE to instanciate objects, since no classes can use the `new` keyword…

We will use a higher level object. In that object, we will instanciate all our objects : the dependencies and all the other objects, with the injections whether by constructor or by setters.

Zend Framework 2 has that kind of useful component : the **Service Manager**. I’m quite sure that other frameworks do have a similar component but i haven’t tested them yet so i don’t know how the Service Manager is called with Symfomy, Laravel etc… Just find out how to use it.

The **Service Manager** is a kind of index where we can declare each of your classes. This is, roughly, the only component of the module where we will use all our `new` instructions and instanciate each of our objects at least once. The only one.

### Using the objects

All our **model** objects (entities, mappers, factories, forms) are instanciated (therefore created) within the **Service Manager** as well as their dependencies. So, technically, you won’t need to access the **Service Manager** from within the model objects. Because you won’t have to call for any external classes from within your class since all the dependencies are already injected from the **Service Manager**.

For the particular case of an array of object, the old fashioned way to do this is to have a `foreach` loop and instanciate a `new` object for each iteration. Since the object is injected only once in our object, use the `clone` functionality instead. Do the `foreach` loop and `clone` the injected dependency rather than instanciating from nowhere.

It leaves the **Views** : objects used by the view should be pushed by the **Controller**. It leaves the **plugins**… I’ll cover that part once i’ll have to work with views plugins more…

Then the **Controller** : Controller classes in Zend Framework implements the **ServiceLocatorAware** interface which allow them to access to the **Service Manager**.

When i started to use ZF2, i was looking everywhere for tips on how to access the **Service Manager**. But you likely do not need that answer. You shouldn’t need that answer.

I find benefits while instanciating all my objects in the **Service Manager** : if i ever do a refactoring of my code, rearranging the namespace, splitting one module in two differents modules, it is easy peasy… just change the links in your **Service Manager** and the rest of the code remain unmoved. This save my time several time.
