---
title: "Creating menu with Zend Navigation"
permalink: "en/posts/creating-menu-zend-navigation.html"
date: "2012-11-21T01:28"
slug: creating-menu-zend-navigation
layout: post
drupal_uuid: 5821cfe1-3291-4c54-a8d7-a5063ee3aa70
drupal_nid: 26
lang: en
author: haclong

media:
  path: /img/teaser/search_engine_friendly.jpg

tags:
  - "Zend Framework"
  - "Zend Navigation"
  - "HOWTO"

sites:
  - "Développement"

summary: "Zend Framework comes with a Zend Navigation component. With this component you can create a menu. Just let see how."
---

Zend Framework comes with a Zend Navigation component. With this component you can create a menu. Just let see how.

Zend Navigation is a component which allows you to build a navigation tree, with pages and subpages. You'll need Zend View Helpers to decipher your navigation tree and use it on your website.

As always when i start to give you tips about Zend Framework, there will be two available use cases :

- you are using Zend Application and you are building a web application based on the MVC design. This means you'll only have to declare your navigation tree to your application, Zend View being already autoloaded by the application bootstrap.
- you've got your own web site / web application and you are using Zend Controller as stand alone, eventually Zend View and of course, you wish to use Zend Navigation
- you've got your own web site / web application and you just want to benefit Zend Navigation functionnalities. You'll have to instantiate both Zend Navigation and Zend View. This is currently not my use case so i'll only give you hints...

### Building pages

Which ever use cases you are using, you'll have to build pages. A "page" in Zend Navigation is _NOT_ a php page (nor an html) but the datas to link to that page. To do it short (and dirty), it's the page url.

Full documentation for creating pages is <a href="http://framework.zend.com/manual/1.12/en/zend.navigation.pages.html" target="_blank">here</a>. You can extends the original page class if needed (see the previous link).

Zend Navigation provides two kind of pages :

- The MVC pages will define the link to the page using a "controller" and an "action" parameters that only Zend Controller can decipher. You can use MVC pages definition only if you're using Zend Controller as stand alone component or when you're using Zend Application (which will bootstrap (launch) Zend Controller all by itself). If you're not using either Zend Application or Zend Controller, i guess you'll have to parse MVC pages parameters and adapt your own controller class... You're on your own here.
- the URI pages defines the link to the page using an URI link (either relative link or absolute link). You can use URI pages when using Zend Controller (as stand alone or bootstrapped by Zend Application) by passing the controller/action parameters as a regular URL) or when linking to an external page (which does not belong to the current application). If you're not using either Zend Application or Zend Controller, I'll advise you to use URI pages when you want to manage your navigation (menu and sitemap etc...) with Zend Navigation component.

With Zend Navigation, you'll have to declare each of your pages either an MVC page or an URI page.

For each URI page, you'll need at least all those attributes :

- **label** : The label will be the text of the link... It's where you click.
- **id** : You'll need the id soon. Make sure that all your ids are different. We do not want Zend to mess up with our pages, right ?
- **uri** : The URI to the page. Can be NULL.
- **pages** : child pages of the page.

Please refer to the Zend Framework documentation (at Zend Navigation index) to get all informations about the URI pages properties.

For each MVC page, you'll need at least all those attributes :

- **label** : The label will be the text of the link... It's where you click.
- **id** : You'll need the id soon. Make sure that all your ids are different. We do not want Zend to mess up with our pages, right ?
- **controller** : The controller you're using for the link
- **action** : The action you're using for the link
- **pages** : child pages of the page.

As for my part, i'll use also the **module**, the **params** and eventually the **route** parameters. Please refer to the Zend Framework documentation (at Zend Navigation index) to get all informations about the MVC pages properties.

Zend Framework documentation has several examples for creating single Zend MVC or URI Pages (MVC and URI). Since our target is to build our whole sitemap by listing all our pages and ordering them into menus and submenus, I won't talk about single pages.

### Building the navigation tree

We will now build the navigation tree. Navigation tree is composed with menu containing pages and menu containing submenu containing pages...

Basically, we will assume that a menu containing pages is similar to a page containing pages. Zend Navigation calls a page containing pages a "container". Since a navigation tree is built with menu containing pages and menu containing menu containing pages, a full navigation tree is a container. And with this, we've got the whole Zend Navigation logic.

Let's pretend that we have our sitemap as follow :

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
 1.    Home // this is a single page
 2.    About // this will NOT link to a page but contains subpages
 2.1   Contact // this is a single page
 3.    Asia // this will link to a page and contains subpages too
 3.1   China // this is a single page
 3.2   Japan // this is a single page
 4.    Europe // this will link to a page and contains subpages too
 4.1   France // this will link to a page and contains subpages too
 4.1.1 Paris // this is a single page
 4.1.2 Lyon // this is a single page
 4.1.3 Marseille // this is a single page
 4.2   Germany // this will link to a page and contains subpages too
 4.2.1 Berlin // this is a single page
 4.3   Italy // this will link to a page and contains subpages too
 4.3.1 Roma // this is a single page
 4.3.2 Milano // this is a single page
 4.3.3 Firenze // this is a single page
</pre>

Zend Navigation allows you to build your navigation tree with several different formats (see <a href="http://framework.zend.com/manual/1.12/en/zend.navigation.containers.html" target="_blank">Zend Navigation Container documentation</a> for more details)

- using a php array

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
$container = new Zend_Navigation(
   array( // Zend Navigation array (building the main navigation tree container)
      array( // params needed for the Home page (URI page)
         'label' => 'Home',
         'id' => 'idHome',
         'uri' => '/'
      ),
      array( // params needed for the About page (URI page)
         'label' => 'About',
         'id' => 'idAbout',
         'type' => 'uri',
         'pages' => array( // building the About container
            array( // params needed for the Contact page (MVC page)
               'label' => 'Contact',
               'id' => 'idContact',
               'action' => 'index',
               'controller' => 'contact'
            )
         )
      ),
      array( // params needed for the Asia page (MVC page)
         'label' => 'Asia',
         'id' => 'idAsia', 
         'action' => 'index_action',
         'controller' => 'asia_controller',
         'pages' => array( // building the asia container
            array( // params needed for the china page
               'label' => 'China',
               'id' => 'idChina',
               'action' => 'china_action',
               'controller' => 'asia_controller'
            ),
            array( // params needed for the japan page
               'label' => 'Japan',
               'id' => 'idJapan',
               'action' => 'japan_action',
               'controller' => 'asia_controller'
            )
         )
      ),
      array( // params needed for the Europe page (MVC page)
         'label' => 'Europe',
         'id' => 'idEurope', 
         'action' => 'index_action',
         'controller' => 'europe_controller',
         'pages' => array( // building the europe container
            array( // params needed for the france page
               'label' => 'France',
               'id' => 'idFrance',
               'action' => 'france_action',
               'controller' => 'europe_controller',
               'pages' => array( // building the france container
                  array( // params needed for the paris page
                     'label' => 'Paris',
                     'id' => 'idParis',
                     'uri' => '/villes/fr/paris'
                  ),
                  array( // params needed for the lyon page
                     'label' => 'Lyon',
                     'id' => 'idLyon',
                     'uri' => '/villes/fr/lyon'
                  ),
                  array( // params needed for the marseille page
                     'label' => 'Marseille',
                     'id' => 'idMarseille',
                     'uri' => '/villes/fr/marseille'
                  )
               )
            ),
            array( // params needed for the germany page
               'label' => 'Germany',
               'id' => 'idGermany',
               'action' => 'germany_action',
               'controller' => 'europe_controller',
               'pages' => array( // building the germany container
                  array( // params needed for the berlin page
                     'label' => 'Berlin',
                     'id' => 'idBerlin',
                     'uri' => '/villes/de/berlin'
                  )
               )
            ),
            array( // params needed for the italy page
               'label' => 'Italy',
               'id' => 'idItaly',
               'action' => 'italy_action',
               'controller' => 'europe_controller',
               'pages' => array( // building the italy container
                  array( // params needed for the roma page
                     'label' => 'Roma',
                     'id' => 'idRoma',
                     'uri' => '/villes/it/roma'
                  ),
                  array( // params needed for the milano page
                     'label' => 'Milano',
                     'id' => 'idMilano',
                     'uri' => '/villes/it/milano'
                  ),
                  array( // params needed for the firenze page
                     'label' => 'Firenze',
                     'id' => 'idFirenze',
                     'uri' => '/villes/it/firenze'
                  )
               )
            )
         )
      )
   )
) ;
</pre>

Put this array in any php file for the moment. We will see later how to use it. You can use php array when you're using Zend Application or Zend Navigation as standalone component.

Of course, you'll be able to access the $navigation array while calling the variable name... We are merely manipulating standard php variables here, considering that $navigation is not only a simple array type but a Zend_Navigation object type. Do not bother for the type... it's just a variable and its value.

<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
 CONSTRAINTS :
 * 'label', 'id', 'uri', 'action', 'controller', 'pages' are mandatory
 * 'pages' expects an array ('pages' => array())
 * based on page properties, Zend_Navigation can determine either if the page is an MVC page type or an URI page type. But, note the case of the About page which does not link to any page... You have to precise the 'type' property otherwise, you'll catch an Exception.
</pre>



- using a Zend Config object

<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
; params needed for the home page
home.type = "Zend_Navigation_Page_Uri" 
home.label = "Home"
home.id = "idHome"
home.uri = "/"
; params needed for the about container
about.type = "Zend_Navigation_Page_Uri"
about.id = "idAbout"
about.label = "About us"
; params needed for the contact page
about.pages.contact.type = "Zend_Navigation_Page_Mvc"
about.pages.contact.label = "Contact"
about.pages.contact.id = "idContact"
about.pages.contact.action = "index"
about.pages.contact.controller = "contact"
; params needed for the asia page
asia.type = "Zend_Navigation_Page_Mvc" 
asia.label = "Asia"
asia.id = "idAsia"
asia.action = "index_action"
asia.controller = "asia_controller"
; params needed for the china page
asia.pages.china.type = "Zend_Navigation_Page_Mvc" 
asia.pages.china.label = "China"
asia.pages.china.id = "idChina"
asia.pages.china.action = "china_action"
asia.pages.china.controller = "asia_controller"
; params needed for the japan page
asia.pages.japan.type = "Zend_Navigation_Page_Mvc" 
asia.pages.japan.label = "Japan"
asia.pages.japan.id = "idJapan"
asia.pages.japan.action = "japan_action"
asia.pages.japan.controller = "asia_controller"
; params needed for the europe page
europe.type = "Zend_Navigation_Page_Mvc" 
europe.label = "Europe"
europe.id = "idEurope"
europe.action = "index_action"
europe.controller = "europe_controller"
; params needed for the france page
europe.pages.france.type = "Zend_Navigation_Page_Mvc" 
europe.pages.france.label = "France"
europe.pages.france.id = "idFrance"
europe.pages.france.action = "france_action"
europe.pages.france.controller = "europe_controller"
; params needed for the paris page
europe.pages.france.pages.paris.type = "Zend_Navigation_Page_Uri" 
europe.pages.france.pages.paris.label = "Paris"
europe.pages.france.pages.paris.id = "idParis"
europe.pages.france.pages.paris.uri = "/villes/fr/paris"
; params needed for the lyon page
europe.pages.france.pages.lyon.type = "Zend_Navigation_Page_Uri" 
europe.pages.france.pages.lyon.label = "Lyon"
europe.pages.france.pages.lyon.id = "idLyon"
europe.pages.france.pages.lyon.uri = "/villes/fr/lyon"
; params needed for the Marseille page
europe.pages.france.pages.marseille.type = "Zend_Navigation_Page_Uri" 
europe.pages.france.pages.marseille.label = "Marseille"
europe.pages.france.pages.marseille.id = "idMarseille"
europe.pages.france.pages.marseille.uri = "/villes/fr/marseille"
; params needed for the germany page
europe.pages.germany.type = "Zend_Navigation_Page_Mvc" 
europe.pages.germany.label = "Germany"
europe.pages.germany.id = "idGermany"
europe.pages.germany.action = "germany_action"
europe.pages.germany.controller = "europe_controller"
; params needed for the berlin page
europe.pages.germany.pages.berlin.type = "Zend_Navigation_Page_Uri" 
europe.pages.germany.pages.berlin.label = "Berlin"
europe.pages.germany.pages.berlin.id = "idBerlin"
europe.pages.germany.pages.berlin.uri = "/villes/de/berlin"
; params needed for the italy page
europe.pages.italy.type = "Zend_Navigation_Page_Mvc" 
europe.pages.italy.label = "Italy"
europe.pages.italy.id = "idItaly"
europe.pages.italy.action = "italy_action"
europe.pages.italy.controller = "europe_controller"
; params needed for the roma page
europe.pages.germany.pages.roma.type = "Zend_Navigation_Page_Uri" 
europe.pages.germany.pages.roma.label = "Roma"
europe.pages.germany.pages.roma.id = "idRoma"
europe.pages.germany.pages.roma.uri = "/villes/it/roma"
; params needed for the milano page
europe.pages.germany.pages.milano.type = "Zend_Navigation_Page_Uri" 
europe.pages.germany.pages.milano.label = "Milano"
europe.pages.germany.pages.milano.id = "idMilano"
europe.pages.germany.pages.milano.uri = "/villes/it/milano"
; params needed for the firenze page
europe.pages.germany.pages.firenze.type = "Zend_Navigation_Page_Uri" 
europe.pages.germany.pages.firenze.label = "Firenze"
europe.pages.germany.pages.firenze.id = "idFirenze"
europe.pages.germany.pages.firenze.uri = "/villes/it/firenze"
</pre>

Put this into a .ini file you'll put wherever you want. You can use Zend Config object either when using Zend Application or when using Zend Navigation as a standalone object. If you are using Zend Navigation as a standalone object, you'll need to instantiate the Zend Config component as well. For the above config file, you'll have to instantiate Zend_Config_Ini object to decipher this object. We'll see this later too.

Zend Config object also accept JSON, YAML and XML format. Please, refer to the <a href="http://framework.zend.com/manual/1.12/en/zend.navigation.containers.html" target="_blank">Zend Framework documentation</a> for that.

<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
 CONSTRAINTS :
 * 'label', 'id', 'uri', 'action', 'controller', 'pages' are mandatory
 * 'europe', 'italy' etc... are up to you.
</pre>



If you are using Zend Application object, a config file is already expected with your application parameters and ressources properties. You can include our navigation tree object into your config file.

NOTE : I'm familiar with the .ini format but the config file can be either an XML file, a Json file or a YAML file. Since i'm familiar with .ini format, the following sample is in this format. Please refer to <a href="http://framework.zend.com/manual/1.12/en/zend.config.introduction.html" target="_blank">Zend Config documentation</a> to know more about Zend Config objects and format.

<pre class="brush: plain; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
; regular application.ini params 
bootstrap.path = APPLICATION_PATH "/bootstrap.php"
bootstrap.class = "Bootstrap"
resources.frontController.controllerDirectory = APPLICATION_PATH "/controllers"
resources.view.helperPath.View_Helper = APPLICATION_PATH "/views/helpers"
resources.view.basePath = APPLICATION_PATH "/views"

; including Zend Navigation resources (same config object than above slightly changed)
; top level node - building the container
resources.navigation.type = "Zend_Navigation_Page_Uri"
resources.navigation.label = "" 
resources.navigation.id = "container"
; params needed for the home page
resources.navigation.pages.home.type = "Zend_Navigation_Page_Uri"
resources.navigation.pages.home.label = "Home"
resources.navigation.pages.home.id = "idHome"
resources.navigation.pages.home.uri = "/"
; params needed for the about container
resources.navigation.pages.about.type = "Zend_Navigation_Page_Uri"
resources.navigation.pages.about.id = "idAbout"
resources.navigation.pages.about.label = "About us"
; params needed for the contact page
resources.navigation.pages.about.pages.contact.type = "Zend_Navigation_Page_Mvc"
resources.navigation.pages.about.pages.contact.label = "Contact"
resources.navigation.pages.about.pages.contact.id = "idContact"
resources.navigation.pages.about.pages.contact.action = "index"
resources.navigation.pages.about.pages.contact.controller = "contact"
; params needed for the asia page
resources.navigation.pages.asia.type = "Zend_Navigation_Page_Mvc"
resources.navigation.pages.asia.label = "Asia"
resources.navigation.pages.asia.id = "idAsia"
resources.navigation.pages.asia.action = "index_action"
resources.navigation.pages.asia.controller = "asia_controller"
; params needed for the china page
resources.navigation.pages.asia.pages.china.type = "Zend_Navigation_Page_Mvc"
resources.navigation.pages.asia.pages.china.label = "China"
resources.navigation.pages.asia.pages.china.id = "idChina"
resources.navigation.pages.asia.pages.china.action = "china_action"
resources.navigation.pages.asia.pages.china.controller = "asia_controller"
; params needed for the japan page
resources.navigation.pages.asia.pages.japan.type = "Zend_Navigation_Page_Mvc"
resources.navigation.pages.asia.pages.japan.label = "Japan"
resources.navigation.pages.asia.pages.japan.id = "idJapan"
resources.navigation.pages.asia.pages.japan.action = "japan_action"
resources.navigation.pages.asia.pages.japan.controller = "asia_controller"
</pre>

When using Zend Application, you have to define your application config file. With all the properties inside this config file, Zend Application can automatically load Zend Component as resource plugins. (See <a href="http://framework.zend.com/manual/1.12/en/zend.application.available-resources.html" target="_blank">Zend Application Available Resource Plugin</a> documentation). In the purpose Zend Application will load our Zend Navigation object, it is **mandatory** to declare our whole navigation tree with the "resources.navigation" prefix (in the case the config file is a .ini file)

<pre class="brush: bash; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
 CONSTRAINTS :
 * 'label', 'id', 'uri', 'action', 'controller', 'pages' are mandatory
 * 'resources.navigation' keywords on beginning of the line are mandatory
</pre>

### Using the tree - instantiating the View Helper

Well, we now have a nice navigation object. How can we use it ? Of course, we can use it for echoing menus. Lets see...

First of all, you have to know that Zend Navigation only build the tree, and eventually, extract subtree from the main tree. It is not the job of Zend Navigation to echoing menus. In other words, do not look for Zend Navigation methods to echoing site map or menus.

Displaying Zend Navigation object on your web application is the job of Zend View Helper. So we need to know how and where accessing the Zend View Helper instance.

Frankly, i don't know how to use Zend Navigation object without a View Helper object but I guess that debugging the dedicated Helper will help if it is your wish.

#### Instanciating the View Helper while using Zend Application Resource Plugin
The easiest solution : your navigation tree is a Zend Application Resource Plugin. The tree is a Zend Config object in your config file and all pages are prefixed with the correct keywords ("resources" and "navigation").

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
 // app/config/application.ini
[production]
; where is the bootstrap file
bootstrap.path = APPLICATION_PATH "/bootstrap.php"
; what is the bootstrap class used
bootstrap.class = "Bootstrap"
; where are the Zend Controller instances
resources.frontController.controllerDirectory = APPLICATION_PATH "/controllers"
; where are the Zend View instances
resources.view.basePath = APPLICATION_PATH "/views"
; the navigation resources
resources.navigation.pages = ... your navigation tree here.
</pre>



<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
 // app/bootstrap.php
 class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
 {
 }
</pre>

With these elements, Zend Application knows it has to load a Zend Navigation object AND an Zend View Navigation Helper dedicated to handling Zend Navigation objects.

NOTE : i don't use Zend Navigation as Zend Application resources plugin because the config file will be too lengthy. So these instructions are only assumptions but it should work.

You can then access the Zend View Navigation Helper from any of the Zend View instances (meaning view pages or layout pages)

#### Instanciating the View Helper while using Zend Application without Resource Plugin
This is my favorite option since i can separate the navigation tree and the application config file. This is only to ease my reading and my editing tasks.

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
 // app/config/application.ini
[production]
; where is the bootstrap file
bootstrap.path = APPLICATION_PATH "/bootstrap.php"
; what is the bootstrap class used
bootstrap.class = "Bootstrap"
; where are the Zend Controller instances
resources.frontController.controllerDirectory = APPLICATION_PATH "/controllers"
; where are the Zend View instances
resources.view.basePath = APPLICATION_PATH "/views"
</pre>



<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
 // app/config/navigation.ini
; building the container
container.pages = ... your navigation tree here.</pre>



<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
 // app/bootstrap.php
 class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
 {
  protected function _initNavigation()
 {
 $config = new Zend_Config_Ini(APPLICATION_PATH . "/configs/navigation.ini") ;
 $navigation = new Zend_Navigation($config) ;

 $this->bootstrap("view") ;
 $view= $this->getResource('view') ;
 $view->navigation($navigation) ;
 }
}</pre>

Here are some explanations :

Since our navigation.ini config file is unknown to Zend Application, we have to declare it. Our config file is a .ini format file. We will use Zend_Config_Ini object to parse and load our navigation.ini file.

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
$config = new Zend_Config_Ini(APPLICATION_PATH . "/configs/navigation.ini") ;</pre>

Of course, you ought to use the dedicated Zend_Config_* object, depending on the config format you are using.

Then, we will have to build our Zend Navigation object.

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
$navigation = new Zend_Navigation($config) ;</pre>

Then, we will have to assign our Zend_Navigation instance to the Zend View Navigation helper.

First of all, get the Zend_View instance in our bootstrap file : (for informations on bootstrap() and getResource() methods, see the <a href="http://framework.zend.com/manual/1.12/en/zend.application.theory-of-operation.html" target="_blank">Zend Application Bootstrap</a> documentation. Frankly, i'm not fluent in Zend Application Bootstrap language yet so, i know _THIS_ is working. A View Helper is a Zend View object. I know I need to get a Zend View instance to make this work.

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
$this->bootstrap("view") ;
$view = $this->getResource('view') ;
</pre>

Once we have retrieved our Zend View object ($view), we can assign to its Navigation helper our Zend Navigation object.

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
$view->navigation($navigation) ;
</pre>

All this being bootstrapped in our Zend Application bootstrap, the Zend View Navigation helper will be available in any Zend View instances (meaning view pages or layout pages)



#### Instanciating the View Helper while using Zend Application with php array
I don't use this option. If i had to, i'll do something like this :

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
 // app/bootstrap.php
 class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
 {
 protected function _initNavigation()
 {
        $navigation = new Zend_Navigation(array( /* ... your navigation tree here. */ )) ;

 $this->bootstrap("view") ;
 $view= $this->getResource('view') ;
 $view->navigation($navigation) ;
 }
}</pre>

Or

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
 // app/bootstrap.php
 class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
 {
 protected function _initNavigation()
 {
        $container = array( /* ... your navigation tree here. */ ) ;
        $navigation = new Zend_Navigation($container) ;

 $this->bootstrap("view") ;
 $view= $this->getResource('view') ;
 $view->navigation($navigation) ;
 }
}</pre>

If i had to create my php array in a separate file, i'll have to find out how to include and access the $container array... I will not look for that yet... So feel free to experiment on your side.

#### Not using Zend Application at all
If you're not using Zend Application at all, remember to build your pages using Zend_Navigation_Pages_Uri rather than Zend_Navigation_Pages_Mvc. If you wish to use Zend_Navigation_Pages_Mvc, you'll have to instanciate Zend_Controller too build the correct href based on the "module", "controller" and "action" properties.

I'm assuming that if you're not using Zend Application at all, your website will be on regular .php file. But you'll have to create a "controller" type file, which will instantiate all the needed datas and then, call another php file for the rendering of those datas -> the view.

This also means that you'll have to perform some inclusion : with Zend_Application, all classes are autoloaded using Zend_Loader_Autoload object. If you're not using Zend Application, you'll have to create your own autoloader, use Zend_Loader component or include each classes manually.

Create a php page and include there all needed classes. This will be your controller page.

Instantiate your Zend Navigation object in your php page :

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
// controller page.php
$navigation = new Zend_Navigation($container) ;
</pre>

if $container is a php array, just create it either in the same php file, or in a separate php file. If you choose to create it in a separate file, use one of the require(), require_once(), include() or include_once php regular functions to include the file and use the $container array.

if $container is a Zend Config object, create it in a separate config file (INI, JSON, XML or YAML) and instantiate the Zend Config object with the config file. And then, instantiate your Zend Navigation object

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
// controller page.php
$container = new Zend_Config_***("path/to/my/config/file.ext") ;
$navigation = new Zend_Navigation($container) ;
</pre>

Instantiate the Zend_View object. Once the Zend_View object is instantiated, assign the Zend_Navigation object to the Zend View Navigation Helper.

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
// controller page.php
$view = new Zend_View() ;
$view->navigation($navigation) ;</pre>

Finally call another php file to render the datas.

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
// controller page.php
echo $view->render('myview.php') ;
</pre>

Once Zend View is instantiated, you can use your myview.php file as any other View scripts file.

### Echoing menus and links

Now.

We have our navigation tree. It is either a separate config file or a php array. With the config file, we have instantiated the Zend Navigation object using the correct Zend Config instance.

We have somehow instantiate Zend View and assigning the Zend Navigation object to the Zend View Navigation helper. This means that from now on, when using Zend View Navigation Helper, the helper will use the Zend Navigation object we have set. If needed, we can change the Zend Navigation object but you have to know that it will change _ALL_ the Zend View Navigation helper you are using.

Let's go to the fun part. You can use the Zend View Navigation Helpers in any Zend View type files. This means layout pages (.phtml) or view scripts pages (.phtml) in Zend Application use case or myview.php page in a stand alone use case. Zend View also allow to use template engine... For my part, I don't know how to use Zend View Helpers in template engine though... But you can experiment from here.

There's several Zend View Navigation Helpers :

- $this->navigation()->breadcrumbs() for generating breadcrumbs,
- $this->navigation()->links() for generating links (&amp;lt;link&amp;gt; header tags),
- $this->navigation()->menu() for generating menu,
- $this->navigation()->sitemap() for generating XML sitemap.

We will talk about $this->navigation()->menu() helper mainly.

#### Generating the full menu (expand all menu entries)
<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
// layout.phtml (or any other Zend View pages) or myview.php
// $this is the instance of Zend View
echo $this->navigation()->menu() ; 

// will generate this html code :
<ul class="navigation">
    <li>
        <a id="menu-idHome" href="/">Home</a>
    </li>
    <li>
        <span id="menu-idAbout">About</span>
        <ul>
            <li>
                <a id="menu-idContact" href="/inventaire/contact">Contact</a>
            </li>
        </ul>
    </li>
    <li>
        <a id="menu-idAsia" href="/inventaire/asia_controller/index_action">Asia</a>
        <ul>
            <li>
                <a id="menu-idChina" href="/inventaire/asia_controller/china_action">China</a>
            </li>
            <li>
                <a id="menu-idJapan" href="/inventaire/asia_controller/japan_action">Japan</a>
            </li>
        </ul>
    </li>
    <li class="active">
        <a id="menu-idEurope" href="/inventaire/europe_controller/index_action">Europe</a>
        <ul>
            <li class="active">
                <a id="menu-idFrance" href="/inventaire/europe_controller/france_action">France</a>
                <ul>
                    <li class="active">
                        <a id="menu-idParis" href="/villes/fr/paris">Paris</a>
                    </li>
                    <li>
                        <a id="menu-idLyon" href="/villes/fr/lyon">Lyon</a>
                    </li>
                    <li>
                        <a id="menu-idMarseille" href="/villes/fr/marseille">Marseille</a>
                    </li>
                </ul>
            </li>
            <li>
                <a id="menu-idGermany" href="/inventaire/europe_controller/germany_action">Germany</a>
                <ul>
                    <li>
                        <a id="menu-idBerlin" href="/villes/de/berlin">Berlin</a>
                    </li>
                </ul>
            </li>
            <li>
                <a id="menu-idItaly" href="/inventaire/europe_controller/italy_action">Italy</a>
                <ul>
                    <li>
                        <a id="menu-idRoma" href="/villes/it/roma">Roma</a>
                    </li>
                    <li>
                        <a id="menu-idMilano" href="/villes/it/milano">Milano</a>
                    </li>
                    <li>
                        <a id="menu-idFirenze" href="/villes/it/firenze">Firenze</a>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
</ul>
</pre>

Note the **class="active"** which identify the active branch (let's pretend we're on paris page)

#### Limit the depth of the menu
Use the setMaxDepth() method. This is one of the Zend View Navigation Menu Helper methods.

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
echo $this->navigation()->menu()->setMaxDepth(0) ; 

// will generate this html code :
<ul class="navigation">
    <li>
        <a id="menu-idHome" href="/">Home</a>
    </li>
    <li>
        <span id="menu-idAbout">About</span>
    </li>
    <li>
        <a id="menu-idAsia" href="/inventaire/asia_controller/index_action">Asia</a>
    </li>
    <li class="active">
        <a id="menu-idEurope" href="/inventaire/europe_controller/index_action">Europe</a>
    </li>
</ul></pre>

Note the **About** **menu** which can not expand (since there's no link defined for this page). Either add a link to this page in the navigation tree or use javascript to expand the About menu...

Of course, we can change the depth

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
echo $this->navigation()->menu()->setMaxDepth(1) ; 

// will generate this html code :
<ul class="navigation">
    <li>
        <a id="menu-idHome" href="/">Home</a>
    </li>
    <li>
        <span id="menu-idAbout">About</span>
        <ul>
            <li>
                <a id="menu-idContact" href="/inventaire/contact">Contact</a>
            </li>
        </ul>
    </li>
    <li>
        <a id="menu-idAsia" href="/inventaire/asia_controller/index_action">Asia</a>
        <ul>
            <li>
                <a id="menu-idChina" href="/inventaire/asia_controller/china_action">China</a>
            </li>
            <li>
                <a id="menu-idJapan" href="/inventaire/asia_controller/japan_action">Japan</a>
            </li>
        </ul>
    </li>
    <li class="active">
        <a id="menu-idEurope" href="/inventaire/europe_controller/index_action">Europe</a>
        <ul>
            <li class="active">
                <a id="menu-idFrance" href="/inventaire/europe_controller/france_action">France</a>
            </li>
            <li>
                <a id="menu-idGermany" href="/inventaire/europe_controller/germany_action">Germany</a>
            </li>
            <li>
                <a id="menu-idItaly" href="/inventaire/europe_controller/italy_action">Italy</a>
            </li>
        </ul>
    </li>
</ul></pre>

#### Expand menu entries when it's the active branch only
Zend View Navigation Menu Helper gives the possibility to access to the full menu but expand only the active branch. Keep pretending we're checking the "Paris" page.

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
echo $this->navigation()->menu() 
                        ->setExpandSiblingNodesOfActiveBranch(true) ; 

// will generate this html code :
<ul class="navigation">
    <li>
        <a id="menu-idHome" href="/">Home</a>
    </li>
    <li>
        <span id="menu-idAbout">About</span>
    </li>
    <li>
        <a id="menu-idAsia" href="/inventaire/asia_controller/index_action">Asia</a>
    </li>
    <li class="active">
        <a id="menu-idEurope" href="/inventaire/europe_controller/index_action">Europe</a>
        <ul>
            <li class="active">
                <a id="menu-idFrance" href="/inventaire/europe_controller/france_action">France</a>
                <ul>
                    <li class="active">
                        <a id="menu-idParis" href="/villes/fr/paris">Paris</a>
                    </li>
                    <li>
                        <a id="menu-idLyon" href="/villes/fr/lyon">Lyon</a>
                    </li>
                    <li>
                        <a id="menu-idMarseille" href="/villes/fr/marseille">Marseille</a>
                    </li>
                </ul>
            </li>
            <li>
                <a id="menu-idGermany" href="/inventaire/europe_controller/germany_action">Germany</a>
            </li>
            <li>
                <a id="menu-idItaly" href="/inventaire/europe_controller/italy_action">Italy</a>
            </li>
        </ul>
    </li>
</ul>
</pre>

Note that all submenus are closed except the Europe > France part.

**The setExpandSiblingNodesOfActiveBranch() method is only implemented starting from Zend Framework 1.12 version. This method does not exist on previous version of the framework.**

#### Showing active branch only
Zend View Navigation Helper allows the display of the active branch only.

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
echo $this->navigation()->menu() 
                        ->setOnlyActiveBranch(true) ; 

// will generate this html code :
<ul class="navigation">
    <li class="active">
        <a id="menu-idEurope" href="/inventaire/europe_controller/index_action">Europe</a>
        <ul>
            <li class="active">
                <a id="menu-idFrance" href="/inventaire/europe_controller/france_action">France</a>
                <ul>
                    <li class="active">
                        <a id="menu-idParis" href="/villes/fr/paris">Paris</a>
                    </li>
                    <li>
                        <a id="menu-idLyon" href="/villes/fr/lyon">Lyon</a>
                    </li>
                    <li>
                        <a id="menu-idMarseille" href="/villes/fr/marseille">Marseille</a>
                    </li>
                </ul>
            </li>
            <li>
                <a id="menu-idGermany" href="/inventaire/europe_controller/germany_action">Germany</a>
            </li>
            <li>
                <a id="menu-idItaly" href="/inventaire/europe_controller/italy_action">Italy</a>
            </li>
        </ul>
    </li>
</ul></pre>

There's no more top level menus available. Only remain the Europe menu branch.

Note the setOnlyActiveBranch() method from the Zend View Navigation Helper.

Since there's only one root menu on these conditions, we can discard this root element.

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
echo $this->navigation()->menu() 
                        ->setOnlyActiveBranch(true)
                        ->setRenderParents(false) ; 

// will generate this html code :
<ul class="navigation">
    <li class="active">
        <a id="menu-idFrance" href="/inventaire/europe_controller/france_action">France</a>
        <ul>
            <li class="active">
                <a id="menu-idParis" href="/villes/fr/paris">Paris</a>
            </li>
            <li>
                <a id="menu-idLyon" href="/villes/fr/lyon">Lyon</a>
            </li>
            <li>
                <a id="menu-idMarseille" href="/villes/fr/marseille">Marseille</a>
            </li>
        </ul>
    </li>
    <li>
        <a id="menu-idGermany" href="/inventaire/europe_controller/germany_action">Germany</a>
    </li>
    <li>
        <a id="menu-idItaly" href="/inventaire/europe_controller/italy_action">Italy</a>
    </li>
</ul></pre>

Note the setRenderParents() method from the Zend View Navigation Helper

**TIP !! You can access the instance of the Zend View Navigation Helper (menu) with this variable : $this->navigation()->menu(). From this variable, you can use all the properties and the methods defined in the Zend View Navigation Helper.**

#### Getting access to any subtree
To access to any subtree, we have to set the subtree first, then display it. Zend Navigation offers methods to select subtrees of the main navigation tree. Please see the <a href="http://framework.zend.com/manual/1.12/en/zend.navigation.containers.html#zend.navigation.containers.finding" target="_blank">Zend Navigation documentation</a> to get more detailed informations about the finding methods.

For my part, i'd rather use the magic method findOneById().

Now, let's pretend that we want to show all italian cities. In other words, we want to access the items under the Italy menu.

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
// first, set the subtree
$italianCitiesOnly = $this->navigation()->findOneById('idItaly') ;
// now show the menu but only for the subtree
echo $this->navigation()->menu()->renderMenu($italianCitiesOnly) ;

// will generate this html code :
<ul class="navigation">
    <li>
        <a id="menu-idRoma" href="/villes/it/roma">Roma</a>
    </li>
    <li>
        <a id="menu-idMilano" href="/villes/it/milano">Milano</a>
    </li>
    <li>
        <a id="menu-idFirenze" href="/villes/it/firenze">Firenze</a>
    </li>
</ul></pre>

Here we go...

Last but not least :

#### Generating hyperlink using the navigation tree
Now we can echo a menu, fully expanded or expanded on few levels only.

We can show active branch and display it only.

We can select and echo subtrees of the main tree only, no matter the active branch and/or the depth of the chosen item.

Now, we want to get only one link...

<pre class="brush: php; auto-links: true; collapse: false; first-line: 1; html-script: false; smart-tabs: true; tab-size: 4; toolbar: false; codetag">
$linkToJapanMenu = $this->navigation()->findOneById('idJapan') ;
echo $this->navigation()->menu()->htmlify($linkToJapanMenu) ;

// will generate this html code :
<a id="menu-idJapan" href="/inventaire/asia_controller/japan_action">Japan</a>
</pre>

**TIP !! To access the Zend Navigation instance : $this->navigation() ; From there, you will be able to use all the Zend Navigation methods for adding, removing and finding pages.**

### Getting more

Now we know how to declare a navigation tree with the association of Zend Config and Zend Navigation or the association of a php array and Zend Navigation.

We know how to instantiate Zend View Navigation Helpers.

And we know how to build and show menus and submenus.

There's a lot more to go.

Zend Navigation allows you to add pages to an existing navigation tree, remove pages and finding set of pages. Zend Navigation Pages can be of MVC or URI type but you can create your own type. Zend Navigation Pages also allows you to interact with ACL (security), assign a different route for menu entries, define previous and next pages for menu items so they can be linked as pages in a book.

Zend View Navigation Helper do have other helpers. Each of these helpers do have their own set of methods. Just go to the Zend Framework documentation and explore the possibilities of those components. The Breadcrumbs helpers will build your breadcrumbs while the Sitemap helper will create the sitemap with the correct XML scheme.

Beyond those Zend components, you can extend your code by including jquery solutions, css layout...

You can use Zend Translate to create an international menu.

As you can see, there's a lot more to know about Zend Navigation and building menus. So enjoy !
