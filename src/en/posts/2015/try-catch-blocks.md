---
title: "Try Catch blocks"
permalink: "en/posts/try-catch-blocks.html"
date: "2015-10-20T08:03"
slug: try-catch-blocks
layout: post
drupal_uuid: f72e69a7-45af-4ed9-a4bc-c2ea0deb59f5
drupal_nid: 146
lang: zxx
author: haclong

media:
  path: /img/teaser/capture_0.png

tags:
  - "programming"
  - "PHP"

sites:
  - "Développement"

summary: "Lately, someone asked me to explain the try catch and how it works."
---

Lately, someone asked me to explain the **try catch** and how it works.

## What is it ?

**Try/catch** is a mecanism who allows you to handle **exceptions** in your application.

## Say it again ?

Programming in object is like having a set of russian dolls : one object A calling for an object B calling for an objet C calling for an object D. Each objects knows which object it has called and each object returned values are used by the caller object.

A calls for B. B calls for C. C calls for D. D returns values to C. C will process those values and return processed values to B. B will process those values and return processed values to A. And so on. A don't know D and nobody care. The chain is perfect.

But what if something goes wrong ? Shouldn't A be noticed ?

We could use the same process :

D returns the error code to C. C barely process the error code and pass it to B. B pass the error code to A. That could work just fine. But in object programming, it might be tricky, because then, C will expect (from D) either a valid return values, either an error code. Though C does not need that error code, it will have to deal with it. Then C will pass that same error code to B who expects, of course, either valid return values from C, either an error code which does not mean anything to B. Now B has to deal with it though B does not need it. Of course, C and B do already have error codes they have to deal with on the other hand, but not that one so why bother ? Then B will finally pass that error code to A and A have to use that error code finally because everybody is passing that error code from D to A so, at least, somebody has to use it in a way or another !

This is very cumbersome, not very efficient and just imagine what could happen if you need D to return a second error code... Each objects in between will have to deal with that new code. I can't imagine the kind of switch case we could generate !

## Is there another way to do it ?

Since other languages have already usage of the **try/catch** syntax and it works just fine, PHP adopts that syntax since PHP 5.x. Basically, on one side, when you have an exception (an error) and you want it handled correctly, you just want to **throw** that exception. Just **throw** it. Somewhere. Anywhere. Just like a bottle in the sea. And hope somebody would catch it.

On the other side, you want to **try** something. And you just want to check if that something has thrown any exception... who knows ? So you **try** and if there's any exception thrown, the code will **catch** it for you. Once the exception is caught, you'll know what to do with it.

Let's see it :

```php
try {
  $A-Team->execute($planA) ;
  echo "Let's celebrate ! " ;
} catch (\Exception $exception) {
  echo "something goes wrong somewhere" ;
}
```

Let's see the A-Team class :

```php
class A-Team
{
  function execute($plan)
  {
    $plan->executeSteps() ;
  }
}
```

now the PlanA class :

```php
class PlanA
{
  function executeSteps()
  {
    foreach($this->steps as $step)
    {
      $step->run() ;
      if($step->failed == TRUE)
      {
        throw new Exception() ;
      }
    }
  }
}
```

If one step of the plan fails, it will throw a `new Exception`. The main code will `catch` the `exception` no matter how deep it is thrown from and it will stop the execution of the plan.

Either the mission is successful and everybody can celebrate the victory, either we get "*something goes wrong somewhere*" message. Note that if an exception is thrown, we won't read "*Let's celebrate !*" string. The code will jump straight to the catch block.

You can nest several try/catch : if plan A failed, try plan B.

```php
try {
  $A-Team->execute('PlanA') ;
} catch (\Exception $exception) {
  try {
    $A-Team->execute('PlanB') ;
  } catch (\Exception $exception) {
    echo "something goes wrong somewhere" ;
  }
}
```

But the "*Something goes wrong somewhere*" message is not very helpful, is it ? We'd like to know more of it.

Let's see this case :

```php
try {
  $user->findByName('John Doe') ;
} catch (NotFoundException $exception) {
  echo $exception->getMessage() ;
} catch (DuplicateNameException $exception) {
  echo $exception->getMessage() ;
}
```

And take a closer look at our `$user` class :

```php
class User
{
  function find($name) {
    $result = $this->select($name) ;
    
    if(count($result) > 1)
    {
      throw new DuplicateNameException('There is more than one result, narrow your search criteria') ;
    }
 
    if(count($result) == 0)
    {
      throw new NotFoundException('There is no result for your search') ;
    }
  
    return $result ;
  }
}
```

As we can see, for one `$user->find()` method, we prepare 2 differents `exceptions`. Depending on the result, we will throw either one or another `exception` and only if there's only one result will it be used properly.

Note that the `DuplicateNameException()` class and the `NotFoundException()` class inherit from the **`PHP Exception`** class and that's all. For more info on the `**Exception**` class, please refer to the <a href="http://be2.php.net/manual/en/class.exception.php">official documentation</a>.

But of course, last but not least, we can try and catch exceptions from... would i say it, anybody.

```php
try {
  $gandalf->fight('Balrog') ;
  $frodo->save('Gandalf') ;
} catch (FailedFightException $e) {
  echo "Run you fools !"
} catch (FailSavingException $e) {
  $frodo->weep() ;
}
```

In the **Inception** movie, at *Reality Level*, everybody is asleep and from outside observator, nothing happen to them. When they'll wake up, the mission will be either a success, or a failure.

```php
$reality->startMission() ;
```

but then, if we take a closer look :

```php
class Reality {
  function startMission() {
    try {
      $this->takeAPlane() ;
      $level1->startMission($yusuf) ;
    } catch (Level1KickException $e) {
      $everybody->wakeup() ;
    }
  }
}
```

then diving in

```php
class level1 {
  function startMission($dreamer) {
    try {
      $dreamer->driveACar() ;
      $level2->startMission($arthur) ;
    } catch (Level2KickException $e) {
      $dreamer->wakeup() ;
    }
    
    if(timeOut())
    {
      throw new Level1KickException() ;
    }
  }
}
```

then diving deeper in

```php
class level2 {
  function startMission($dreamer) {
    try {
      $dreamer->setBombInHotel() ;
      $level3->startMission($eames) ;
    } catch (Level3KickException() $e) {
      $dreamer->wakeup() ;
    }

    if(timeOut())
    {
      throw new Level2KickException() ;
    } 
  }
}
```

and then

```php
class level3 {
  function startMission($dreamer) {
    $dreamer->setBunkerSettings() ;
    $dreamer->takingBunker() ;
 
    if(timeOut())
    {
      throw new Level3KickException() ;
    }
  }
}
```

Hehe, i have not quite understood the movie right, i don't think so. But when i was looking for examples to explain the try/catch, that movie and the way each levels are locked one inside the other just makes me feel like it is a good image to use. Well... it was just for the fun and i hope it has at least helped some of you to get the try/catch command. Don't think too hard of Inception because then, you'll be saying that I didn't get the movie at all :)
