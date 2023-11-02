---
title: "Zend Application : Scope issues"
permalink: "en/posts/zend-application-scope-issues.html"
date: "2012-10-30T17:44"
slug: zend-application-scope-issues
layout: post
drupal_uuid: 0806b040-2e6c-424d-b463-29964f24fcd1
drupal_nid: 25
lang: en
author: haclong

media:
  path: /img/teaser/interlocking-balls.jpg

tags:
  - "zend application"
  - "Zend Framework"
  - "MVC"

sites:
  - "Développement"

summary: "One thing i have to learn when coding with Zend Framework is the issue of scopes. When coding with procedural method, i never really care about the scope. If i'm not clear here (maybe because i'm not using the correct word), i mean : where, in your code, your variable is valid (meaning : exists). "
---

One thing i have to learn when coding with Zend Framework is the issue of scopes. When coding with procedural method, i never really care about the scope. If i'm not clear here (maybe because i'm not using the correct word), i mean : where, in your code, your variable is valid (meaning : exists).

When coding with the procedural method, I never really care about this scope stuff. All I know was a variable is valid in the php file i were coding and not outside. So, basically, a variable is valid when i create it and disappears at the end of the page. If i need variables to be accessible outside the page, i simply store it into my _SESSION array.

### Now, what with Zend Framework ?

In a lot of tutorials and even in the ZF documentation, they just told you : add this code {blabla} and it should be working like a charm... It's soooooo simple that most of their authors did not even bother to mention WHERE to put the sample code. And either you can't help but think angrily all alone in front or your blank screen : "WHERE ?, or you can post a comment where you can express all your frustration to get so close to the solution without getting what looks like the most important information.

This is not even clearer when I discover that you can use Zend Framework as a simple toolbox _OR_ as a full MVC framework.

In the case you planned to use the components of Zend Framework as a regular library (or a toolbox) with a procedural coding method, the scope of each classes and variables depends on the persistency of your datas : either the $_SESSION array or the single page scope etc... I mean, this usage should be "as usual". Just instanciate the object and use its properties and its methods as you used to use other PHP objects, functions and variables.

In the case you planned to use Zend Framework as a MVC application (as is my case), the scope is slightly changed. This is what i'll try to explain here.

### The index.php step

Building an application with Zend Framework starts with the index.php file AND the .htaccess including the rewriting rules. The .htaccess will ensure that all HTTP requests (meaning : ANYTHING) going to your application will _MANDATORY_ go through your index.php page.

Therefore, the scope of index.php is rather wide. You can set your CONSTANT there. Or call for static methods. But, on the other side, nothing about your application was instanciated yet. So you are barely in a "procedural" state and not yet in the MVC application.

Since we are working in a MVC application framework, better to use the application scope.

Therefore, index.php is instanciating Zend Application, bootstrap it and run the application.

### The bootstrap step

Zend Application will use the bootstrap.php file AND the application.ini file to bootstrap the application. This means that components considered as mandatory for a MVC application will all be instantiated at this step.

First component to be instantiated : Zend_Loader and Zend_Application (of course).

With the help of the application.ini file, Zend Application will instantiate several components called **application resources**. The list of available resources is <a href="http://framework.zend.com/manual/1.12/en/zend.application.available-resources.html" target="_blank">here</a>.

Resources are instantiation of other Zend Components such as Zend_Cache, Zend_Db, Zend_Dojo, Zend_Controller_Front, Zend_Layout, Zend_Locale, Zend_Log, Zend_Mail, Zend_Application_Module, Zend_Navigation, Zend_Controller_Router, Zend_Session, Zend_Translate, Zend_Http_UserAgent and Zend_View.

Each resources are, basically, the component you may know. But with the help of the application.ini file, you won't have to instantiate it yourself. I older version of Zend Framework, you have to instantiate them in the bootstrap file with method such as _initView()... but all this part is automated since ZF 1.1x. Each resources is a resource of the application bootstrap. Meaning that the component is "alive" somewhere within the application. All you have to do is to get your bootstrap instance to get to each resource.

From within an action controller for example :

```php
$bootstrap = $this->getInvokeArg('bootstrap') ; // $this = Zend_Controller_Action

// You can test either the resource exists or not
$bootstrap->hasPluginResource(RESOURCE_NAME) ; // return true or false

// Access the resource
$resource = $bootstrap->getResource(RESOURCE_NAME) ;

// Once you have the reference to your resource, you can use it.
$resource->RESOURCE_METHOD() ; // RESOURCE_METHOD depends on the corresponding Zend_Component.
```
From another application resource for example :

```php
$this->getBootstrap()->getResource(RESOURCE_NAME) ; // $this = implementation of Zend_Application_Resource_ResourceAbstract
```

In the case you are running a regular Zend Application (you have the `$application->bootstrap()` method in your index.php file), you won't have to bootstrap your resource once more. All available resources are already bootstrapped.

Beyond the available resources, you can use the bootstrap file to bootstrap customized resources, ie Controller plugins, set values in the Registry, maybe settings Gdata settings etc... Once you have bootstrapped those customized resources, you'll be able to access them in the same way with the `$bootstrap->getResource(resource_name) ;` method (or any other available method).

### The Controller step and the View step

Once all elements have been bootstraped in the previous step, you will code you Controllers. All controllers are instance of Zend_Controller_Action. Meaning the $this is a Zend_Controller_Action instance.

In an MVC application, the Controller and the View are tightly tied. Controller's job is to dispatch informations. Therefore, controllers manage the HTTP request, check the request, evaluate it, validate it and send back a response (most of the time, the response is another url or page contents). View's job is to display informations. Therefore, the controller, after validating a HTTP request, send back a response by passing page contents and informations to Zend_View. Zend View is materialized as phtml pages. Like a template page, the datas from Zend Controller will be displayed in the .phtml pages.

Zend_Controller_Action stores page contents in its property $view. $view is an instance of Zend_View.

In the phtml page, $this is a Zend_view instance.

```php
// datas set in a zend_Controller_Action instance
// application/controllers/indexController.php
public function indexAction()
{
  $this->view->pageTitle = "my page title" ; // $this = instance of Zend_Controller_Action
}

// datas accessed from a phtml page
// application/views/scripts/index/index.phtml
<html>
  <body>
    <h1>
      <?php echo $this->pageTitle ; ?>
    </h1>
  </body>
</html>
```

### Zend_Registry

You can access the registry wherever you are in your application (or even outside, ie your library).

Just use Zend_Registry static methods `Zend_Registry::set()` and `Zend_Registry::get()`

There's others Zend Components with static method which can be accessed from anywhere in your code.

### Zend_Db_Adapter

Zend_Db_Adapter is an important case because the adapter will be bootstraped in the application, thanks to resources.db properties.

But in opposite with Zend_View which you will likely not need anywhere, you'll need the Db Adapter from several places of your application, mostly from your models and from classes in your library.

So, how to get to the Db Adapter, knowing that you can't likely connect twice to your database (once from bootstrap and another one from outside your application). The best solution would be to access the existing Db Adapter.

This is easily done while using a Zend_Db_Table static method : `Zend_Db_Table::getDefaultAdapter()`

### Conclusion

For those who are not used with object oriented programmation (OOP) as i am, this is quite confusing for a start. But the thing we have to get is : for each method, which is the object which is returned. If you get the nature of the returned object, you can move on with properties and methods of the returned object etc...

Once you grab this logic, you can develop your library and your models based on it. Objects calling to objects, instantiating objects and returning objects...
