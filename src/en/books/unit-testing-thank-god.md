---
title: "Unit testing, thank god"
permalink: "en/books/unit-testing-thank-god.html"
date: "2016-12-12T15:38"
slug: unit-testing-thank-god
layout: post
drupal_uuid: 1f610593-5abd-47f6-be3f-0e642f158cd4
drupal_nid: 168
lang: en
author: haclong

media:
  path: /img/teaser/2048x1536-fit_illustration-laboratoire-antidopage.jpg

sites:
  - "Développement"
  - "Haclong projects"

---

I've already talked about unit testing. I've done it. At least a few. Without much success. But strongly believe this is THE thing to do. Nonetheless. If only i had enough time, of course, if only... i'd spent more time writing unit tests.

I did it. Then did not.

Then did it again.

On one hand, i use unit testing because i don't have the opportunity to code regularly (not as much as i'd wish i could), so, when i have to resume one of my code, i may feel a little bit lost. My solution then is to re edit my existing code, over using `var_dump()` to reconnect to the current state of my application. Do this a couple times, sprinkle in some doubt about the decision you made then and believe me, you'd think seriously about unit testing. At least, i don't use `var_dump()` anymore.

The most difficult part when i start unit testing is to know what to test. When you're not skilled in unit testing, you are prompt to get confused and you may think you need to test more than necessary. Although all the current recommendations on that topic are clear : unit testing must be concise and precise. The test aims to verify our application in an atomic way : function by function, line after line. So when one test fails, you know precisely what goes wrong. And where. And why... (easier said that done !)

When you don't know what you are doing (which is often the case for noobs), you may want to write a lot of tests, testing everything, anything, just to be sure. But you ought to know that too much tests are counter productives because there's too much duplicated code : multiple tests testing the same thing. Once we have checked that something worked fine in our application, you don't need to check again. Beside, if you decide to change anything in your application, you'd need to update many tests because your changes will impact all your tests.

I won't try to convince you to do unit testing. I won't tell you how much it is useful and important and modern to do it. Nope. Because i had some difficulties to write my own tests with the help i manage to find out there, i'd rather talked here about how i've done them.

There might be better ways to do them. Maybe i don't use the best solution. But it worked. At least for me. And i hope it will help you give a kick off for your first test suite.

So stay tuned. Be ready. A series is coming. I will talk about unit testing and unit testing only. I will use **PHPUnit** mostly but i am looking for a new project where i'd use **Codeception**.
