---
title: "Zend Application starter"
permalink: "en/posts/zend-application-starter.html"
date: "2012-06-09T13:37"
slug: zend-application-starter
layout: post
drupal_uuid: fc7b811f-cf3f-4511-a720-68470f4892aa
drupal_nid: 9
lang: en
author: haclong

media:
  path: /img/teaser/e5278cccdd3b6a084bc93def29692b40.jpg
  credit: "Garth Britzman"
  url: "http://www.behance.net/gallery/%28POP%29culture/3874285"

tags:
  - "Zend Framework"
  - "web application"

sites:
  - "Développement"

summary: "This tutorial, part of many to come, may not differ from other tutorials out there about Zend Application. There's a lot of tutorials out there showing how to build a Zend Application using Zend Tool (with the command line instruction). This is useful but if you wish to adapt your filesystem, you can't use Zend Tool that easily."
---

This tutorial, part of many to come, may not differ from other tutorials out there about Zend Application. There's a lot of tutorials out there showing how to build a Zend Application using Zend Tool (with the command line instruction). This is useful but if you wish to adapt your filesystem, you can't use Zend Tool that easily.

I'm using Zend Framework 1.11.

Zend_Application will help you build a web application based on the MVC design pattern. That means you'll deal with Models, Controllers and Views. But first thing first, how to start ?

To build a web application with the Zend_Application component, you'll need at least 6 files.

### **The index file**

As for many web applications, all started with an index.php file. It will be the same story for our website.

Our index.php file will always have the same parts :

- Constant definitions
- Include paths settings
- Run Zend Application

#### Constant definitions

As for the **constant definitions** part, we will have to define _AT LEAST_ two constants : one for the path of the application directory and the other one for the environment level.

You can name both constants whatever you want. Recommandations are, of course, that your constant name should be understandable. For this tutorial, i can't use a name such as WHICHEVER_CONSTANT_NAME_YOU_CHOOSE_FOR_YOUR_APPLICATION_PATH so let's say first constant will be APPLICATION_PATH and the other one APPLICATION_ENV. This is not very original but at least, we know what they are.

```php
// Define path to application directory
defined('APPLICATION_PATH') || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/application')) ;

// Define application environment
defined('APPLICATION_ENV') || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'development')) ;
```

##### APPLICATION_PATH - what you need to know

This code is readable for someone used to PHP : check if APPLICATION_PATH exists. If not, defines it. See the PHP documentation for following functions : <a href="http://php.net/manual/fr/function.define.php" target="_blank">define()</a>, <a href="http://fr2.php.net/manual/fr/function.realpath.php" target="_blank">realpath()</a> and <a href="http://fr2.php.net/manual/fr/function.dirname.php" target="_blank">dirname()</a>.

As you may have understand now, all your application php files will be hosted under an application directory. Non php files which will be needed by the HTML code will be hosted wherever you want. The application directory can be named as you want. Just make sure that when you define the APPLICATION_PATH constant, you use the correct name. The application directory can be wherever you want. Just make sur that when you define the APPLICATION_PATH constant, you use the correct path. As you can see, ZF is a very flexible and free to use framework.

This application directory will be a reference for all other paths. This will be like a "starting point".

##### APPLICATION_ENV - what you need to know

Again, this code is really easy. Check if APPLICATION_ENV exists, if not check if it exists in the $_ENV or the $_SERVER array, else, apply a user defined string (which is, in our case 'development').

As for the environment value, this will allow us to toggle between different configuration settings (for development and for production settings for example). As for the other constant, you can name your environment value as you want.

You can, of course, define more constants if you need / want. As for my part, since i will log files with current date, I define a TODAY constant with the current date. Of course, this is for a convenient and quick insertion of date in the filesystem. It is obvious that if you need to do more manipulation with date, this is the place to do that.

#### Include paths settings

As for the **include path settings** part, we will have at least one path to declare : the one to the Zend Framework library.

```php
// ensure Zend Framework parent directory is on include path
set_include_path(implode(PATH_SEPARATOR, array(
    get_include_path(), 
    realpath(APPLICATION_PATH . '/../../libraries')
)));
```

As you can see, you can create your **libraries** directory wherever you want. Add its path to the include_path value. Use the APPLICATION_PATH we defined earlier to make sure all paths will be relative to the same origin point (the application directory). Of course, if your constant name is different, don't forget to adapt this code. Of course (2), if your libraries directory is situated elsewhere, do not use this path but yours.

IMPORTANT : Do not include the Zend directory. You have to include (in the include path), the Zend parent directory.

#### Run Zend Application

At least !! Here we are !

For running the Zend_Application component, you'll need, of course, to

- include the Zend/Application.php file
- instantiate the object
- run it

```php
// include the Zend/Application.php file
require_once 'Zend/Application.php' ;

// instantiate the object
$application = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH . '/path/to/application.ini');

// run it
$application->bootstrap()
            ->run() ;
```

##### Including the Zend/Application.php file

Since we have included the Zend parent directory into the include path, the require_once instruction will work correctly.

##### Instantiate the object

We will instantiate a Zend_Application instance. The Zend_Application constructor need as first argument the environment value and then, as second value, the application config file.

In many tutorials i've seen, the configuration file is an .ini file. But I'm sure it is possible to use an .xml file. Since Zend_Application use a Zend_Config object to parse and load all values from the configuration file, all file formats accepted by Zend_Config should work.

Again, ZF is really flexible. You can put your configuration anywhere you want. Just make sure to use the correct path. You can name your configuration file as you want. Make sure to use the correct name.

##### Run it

Once we have the Zend_Application instance, we can bootstrap it (just do bootstrap) and run it. Each time I say bootstrap here, I mean "load"... I believe "bootstrap" is more technical term and on the contrary, "load" is too much generic : you have to load a file (doing an include), upload a file, load a form, load ressources... But, anytime I say bootstrap, there's a voice echoing "load" in my head... so you can do the same thing if it suits you.

Now we're done with the index.php file. We need more files to go.

### The .htaccess file

We need to set some rewriting rules.

```
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} -s [OR]
RewriteCond %{REQUEST_FILENAME} -l [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^.*$ - [NC,L]
RewriteRule ^.*$ index.php [NC,L]
```

That's all. Don't ask. It works.

What it does : as for all other websites, you'll have URL to reach your pages. With those rewriting rules, we ensure that all links to your website will go through the index.php file (we've just created).

What happens then ? The HTTP request (the link) will enter the index.php. Inside index.php, we instantiated, bootstrapped and run the Zend_Application component. The running process will parse the HTTP request and reroute to the correct page inside the application. Said differently : you have a link to this page say : <a href="http://mydomain.com/blog/user/create">http://mydomain.com/blog/user/create</a>. Of course, there will be no page located at ~www/blog/user/create. In reality, when you try to get to that page, you'll go through the index.php page of the application. The index.php page will instantiate the Zend_Application component, will bootstrap the application, will run it. The application will check the request (<a href="http://mydomain.com/blog/user/create">http://mydomain.com/blog/user/create</a>) and will parse it. It will then return what it is expected for a page situated in a blog module, in a user component and for a create action (standard Zend_Application route). But we will see all those details later on. Just remember that you need these rewriting rules because all request HAS to go through the index.php file.

### The bootstrap.php file

As we saw it before, the application is instantiated then bootstrapped before it is run. For bootstrapping it, we need a bootstrap.php file. This bootstrap.php file is located in the application directory.

```php
<?php
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
}
```

Again. That's all. Easy peasy.

In fact, in several ZF 1.8 tutorials, the bootstrap file contains a lot of instructions for bootstrapping (loading) several ressources required for a web application. In the ZF 1.11 version, most of those instructions are no more needed. Depending on the settings in the application configuration file, all the ressources are bootstrapped in the background.

The only problem is to know what is bootstrapped since it is transparent... But don't worry, the most essential part is working so it's more than fine for a starter.

Can't we get rid of this bootstrap.php file since it is empty ? Of course not. First of all, Zend_Application will look for it. I bet all the transparent bootstrapping instructions are somewhere in the Zend_Application_Bootstrap_Boostrap object. So this empty file is not that much empty finally. And second : if you need to customize your bootstrap sequence and add more resources, you'll need that file.

### The configuration file

Short tutorial about the format of the .ini as Zend_Config is expecting it.

The config file will be separated by sequence or block. Each sequence is introduced by its name inside square brackets. One sequence will inherits settings of another sequence with column sign. Sequence's names are up to you.

```
[bootstrap]
;settings go here

[production : bootstrap]
;production sequence inherits from the bootstrap sequence.
;settings which are not in the bootstrap sequence (but specifically for a production environement) can go here
;settings which are in the bootstrap sequence but which have to be updated for production environment can go here and override the bootstrap settings.
;settings identical to the bootstrap settings do not need to be rewrite here.

[development : production]
;development sequence inherits from the production sequence (who inherits from the bootstrap sequence).
```

With this kind of configuration file, we created three environment values (development, production, bootstrap).

Remember our APPLICATION_ENV we defined earlier ? (in the index.php file). The value expected for the APPLICATION_ENV constant is one of the configuration sequence name.

Remember how we instantiated the Zend_Application object ? We pass the environment value as first argument and the configuration file path as second argument. Therefore, Zend_Application will open the configuration file and it will parse/read all the settings expected for one sequence (+ inheritance).

##### Bootstrapping the FrontController ressource

You need to bootstrap a front controller ressource. In your application, you'll have several controller files but only one front controller ressource which will do all the job (very quick and dirty explanation).

```
resources.frontController.controllerDirectory = APPLICATION_PATH "/controllers
```

To bootstrap the frontController ressource, all you need to do is to tell the application where the controller files will be stored. Most of the time, you'll put the controller files in a controllers directory.

### The IndexController.php file

In the controllers directory, we will create our first controller file. There's two reserved names for controllers : the Index controller and the Error controller. Beside those names, you can name your controller as you want. CAUTION : Index and Error are reserved names for controllers, but both controllers do not exist. We have to create them.

Remember our rewriting rules and the HTTP request chapter ? The HTTP Request used in the example does include a module name, a controller name and an action name. What if there's none of those names ? Then our Front Controller will use default names : "default" will be the module default name, "index" will be the controller default name and "index" will be the action default name.

As for the Error Controller, it will handle errors. We will see it later.

We will create the index controller now. Once you have your controller name, the controller filename will be (this is mandatory) the controller name (initial uppercased) appended with the word Controller (initial uppercased). Therefore, the index controller filename will be IndexController.php.

```php
<?php
class IndexController extends Zend_Controller_Action
{
   public function indexAction()
   {
      $this->view->title = "Hello World" ;
   }
}
```

I won't explain how it works here. I'll do it in my next post. Stay tuned :p

All you need to know for now :

Controllers extends Zend_Controller_Action

Controllers objects have someAction() methods

SomeAction() method processes request and things and stuff and then, all informations which should be displayed will be sent to the View element. For doing so, the Controller has a property $view which is an object with a non finite properties list. Therefore, you can add as many property $variable1, $variable2, $array[] etc... as you want. In your Controller, you'll set all those new properties like this :

```php
$this->view->variable1 = "my first variable i'll send to the view element" ;
$this->view->variable2 = "my second variable i'll send to the view element" ;
$this->view->array[] = "first value in my array i'll send to the view element" ;
$this->view->array[] = "second value in my array i'll send to the view element" ; 
```

### The View file

Last but not least, we will create our view file. Here again, my explanation will be short and maybe dirty but this post is lengthy enough and the logic FrontController/Controller file/View file need more thorough explanations.

By default, each someAction() will need a some.phtml view file.

Here how it works :

All the views will be in a views/scripts directory. This is the first Zend Framework constraint :

- the views directory **has to be** at the same level of the controllers directory. You may change this in the bootstraping process but do you _REALLY_ want to do it ?
- you **have** to create a scripts subdirectory under your views directory
- under **views/scripts**, you'll create as much directories as you have controllers. IndexController will match a views/scripts/index path while ErrorController will match a views/scripts/error path
- under each **views/script/{controllername}**, you'll create as much .phtml files as you have actions. IndexController->indexAction will match a views/scripts/index/index.phtml file while an IndexController->loginAction will match a views/scripts/index/login.phtml file.

Zend_Application will do the trick once your filesystem is correctly build.

In your controller file, you set several $this->view->{properties}.

You can echo them in your views. The $this->view->{properties} are now $this->{properties} in your .phtml.

```php
// echo the variable1 property
echo $this->variable1 ;

// results on screen : my first variable i'll send to the view element

// echo the variable2 property
echo $this->variable2 ;

// results on screen : my second variable i'll send to the view element

// echo the array property
foreach($this->array as $rows)
{
   echo $rows . '<br>' ;
}

// results on screen : 
// first value in my array i'll send to the view element
// second value in my array i'll send to the view element
```

That's it.

### The filesystem

Here is the filesystem as it was explained in this tutorial. I hope it will help.

```
libraries/
   Zend/
      Application.php
www/
   index.php
   .htaccess
   application/
      bootstrap.php
      conf/
         application.ini
      controllers/
         IndexController.php
      views/
         scripts/
            index/
               index.phtml
```

I've tried to explain things but since i'm still learning, excuse me if what i'm saying is wrong and please, provide your explanations in the comment. I'm eager to learn more about this framework. And refrain to be TOO technic... i can only speak human language...

Stay tuned for more to come, since this tutorial introduce only the basics and I know we won't get far with only this.
