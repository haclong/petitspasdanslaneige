---
title: "Implement a navigation within a ZF2 modular application"
permalink: "en/posts/implement-navigation-within-zf2-modular-application.html"
date: "2014-06-22T06:52"
slug: implement-navigation-within-zf2-modular-application
layout: post
drupal_uuid: 3e2a9256-f9f1-4692-9a8d-29395a62500a
drupal_nid: 75
lang: en
author: haclong

media:
  path: /img/teaser/ZendFramework.png
  credit: "zend framework"

tags:
  - "ZF2"
  - "Zend Framework"
  - "MVC"
  - "Zend Navigation"

sites:
  - "Développement"
  - "Haclong projects"
  - "Footprints in the snow"

summary: "Implement an application with modules has certain advantages : separation of concerns, light dependancies... we won't talk about this once again, but we can't deny that there IS cross modules items in a web site. The navigation is one of them. Each menu items belong necessarily to a different module. So, how to implement a navigation ?"
---

Implement an application with modules has certain advantages : separation of concerns, light dependancies... we won't talk about this once again, but we can't deny that there IS cross modules items in a web site. The navigation is one of them. Each menu items belong necessarily to a different module. So, how to implement a navigation ?

### Prerequisite

- Zend Skeletton Application installed
- You know - roughly - what is a route within an ZF2 application
- You are using the Getting Started famous Album module from the ZF2 official documentation.

After installing the ZF2 Application skeleton, you started to add more and more modules, one after another. In `module/Application/view/layout/layout.phtml`, for each new module, you have to edit the view file and add a new link within the menu.

But here we are, now you need to remove modules, maybe because they are not useful anymore or maybe because you have a regression and you are trying to sort it out by starting it all over again, who knows... If you remove modules, the renderer have to throw an Exception because the route you're using does not exist (since the module is deactivated). Therefore, you have to edit `layout.phtml` again and remove (or comment) menu items.

And when you'll find the fault, you have to edit the `layout.phtml` again and reactivate your menu items once you enable the module back. All of this is quite tedious, knowing that you also have to edit `config/application.config.php` to disable/enable new module.

Hopefully, the **Zend\Navigation** component is going to help us a lot.

### Zend\Navigation component

All the <a href="http://framework.zend.com/manual/2.3/en/modules/zend.navigation.intro.html" target="_blank">documentation</a> can be found on Zend Framework website. The principle is the same that in Zend Framework 1 : we define a container which contains either pages or containers which contains in turn either pages or containers and so on... The containers/pages hiearchy is going to represent your web hierarchy. As simple as that.

### About routes

In the <a href="http://framework.zend.com/manual/2.3/en/user-guide/overview.html" target="_blank">Getting Started</a> tutorial from ZF2 documentation, you know that it is necessary to define the routes of your module. It is by the way, important to notice that each module has its own routes. It is impossible, either by laziness or for any other reasons, to use the Application module to host all your routes there. Anyway, this won't help you since the controllers invoked through alias within the route might throw a not found exception as soon as their modules will be disabled.

### Creating your pages

The easiest way to use **Zend\Navigation** : all you need to do is to add a `navigation` key in your module configuration file.

```php
//module/Album/config/module.config.php
<?php

return array(
  // your controllers list
  'controllers' => array(
    'invokables' => array(
      'Album\Controller\Album' => 'Album\Controller\AlbumController',
    ),
  ),

  // your routes
  'router' => array(
    'routes' => array(
      // route name
      'album' => array(
        'type' => 'segment',
        'options' => array(
          'route' => '/album[/][:action][/:id]',
          'constraints' => array(
            'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
            'id' => '[0-9]+',
          ),
          'defaults' => array(
            'controller' => 'Album\Controller\Album',
            'action' => 'index',
          ),
        ),
      ),
    ),
  ),

  // view manager configuration
  'view_manager' => array(
    'template_path_stack' => array(
      'album' => __DIR__ . '/../view',
    ),
  ),

  // add the new key here
  'navigation' => array(
    // use 'default' by default... if you'd wish to use something else, consider extending the Zend\Navigation\Service\DefaultNavigationFactory service who's shipped in ZF2 library.
    'default' => array(
      // this array is one of your pages
      array(
        'label' => 'Mes Albums', // the link label - the text rendered
        'route' => 'album', // the name of your route (defined in the router key). Of course, if you'd wish to use a link outside your application, you won't use the 'route' key.
        'order' => 100, // set the weight of the menu items
      ),
    ),
  ),
);
```

Here we are, you have now your first menu item (but don't expect yet to see the menu on your site, not yet).

New, don't forget to declare the** Navigation service** within our **Service Manager** so we can use our pages.

**Using the Service Manager**

First of all, we have to declare in the Service Manager that we are working with an instance of **Zend\Navigation**. We shouldn't need to do something unexpected.

Because the Application module is the one loading the `layout.phtml` template, i decide to add the **Zend\Navigation** there.

```php
//module/Application/config/module.config.php

return array(
  // add a 'service_manager' key if it is absent (but it should be here)
  'service_manager' => array(
    // add a 'factories' key if it is absent (but it should be here)
    'factories' => array(
      // factories...
      // add the 'navigation' service
      'navigation' => 'Zend\Navigation\Service\DefaultNavigationFactory',
    ),
  ),
);
```

Now, the rendering.

Based on the **Getting started** tutorial, you should have this code within the `layout.phtml` template :

```php
//module/Application/view/layout/layout.phtml

<div class="nav-collapse collapse">
  <ul class="nav">
    <li><a href="<?php echo $this->url('home') ?>"><?php echo $this->translate('Home') ?></a></li>
    <li><a href="<?php echo $this->url('album') ?>"><?php echo $this->translate('Album') ?></a></li>
  </ul>
</div><!--/.nav-collapse -->
```

Now replace it with this code :

```php
//module/Application/view/layout/layout.phtml

<div class="collapse nav-collapse">
  <?php echo $this->navigation('navigation')->menu()->setUlClass('nav navbar-nav')->setMaxDepth(0) ;?>
</div><!--/.nav-collapse -->
```

Now Tadaaaa...

Not yet... We are now missing the **Home** menu item. And why do we miss the **Home** menu item ? Because, silly, we haven't add any **Home** page within our pages hierarchy. Now, let's add a Home page on the Application module.

```php
//module/Application/config/module.config.php

<?php
return array(
  // add the 'navigation' key in the array
  'navigation' => array(
    'default' => array(
      array(
        'label' => 'Home',
        'route' => 'home',
      ),
    ),
  ),
);
```

Please note that we are using the same 'navigation' and 'default' keys in our **Application module** and in our **Album module**.

Now let's see the rendering. Tadaaaa. Now we have the "Home" menu item and then an "Album" menu item next to it. If you edit your `config/application.config.php` file and disable the Album module, then the Album menu item will be disabled nicely on your website without you needing to edit any other file.

<cite>SCOOP !! while i write this post, i notice that the menu generated by Zend\Navigation is totally multilingual (you have to prepare your translation files of course). I don't know yet how it is working but at least, it is working.</cite>

**Edit** : Well, according to <a href="http://framework.zend.com/manual/2.3/en/modules/zend.navigation.view.helpers.html" target="_blank">this</a>, the **View Helpers** have integrations with** ACL** and **Translation**. Refer to `getTranslator()`, `setTranslator()`, `getUseTranslator()` and `setUseTranslator()` methods... The ZF2 application skeleton does have a **translator** service in its **Service Manager**.

```php
//module/Application/config/module.config.php

  'service_manager' => array(
    'factories' => array(
      'translator' => 'Zend\I18n\Translator\TranslatorServiceFactory',
    ),
  ),
  'translator' => array(
    'locale' => 'fr_FR',
    'translation_file_patterns' => array(
      array(
        'type' => 'gettext',
        'base_dir' => __DIR__ . '/../language',
        'pattern' => '%s.mo',
      ),
    ),
  ),
```

### Navigation with Zend Framework library

Most of the time, new developpers often confuse the component **Zend\Navigation** and the rendering of a menu they wish to have. ZF2 (as ZF1) separate the datas (the model) and the rendering (the views) :

1. **Zend\Navigation** build the model (which is only a hierarchy of pages)
2. Then, ZF2 has several View Helpers available to allow us to use the Navigation model and render the pages as we wish to see it :
  - breadcrumbs
  - menus
  - sitemaps

### The Navigation model

<a href="http://framework.zend.com/manual/2.3/en/modules/zend.navigation.pages.html" target="_blank">The documentation</a> is quite clear on that subject and i didn't have to look for too long to get it work.

**Zend\Navigation** uses two types of page.

- Pages within the application, featured by those properties : action / controller or route with or without extra parameters. Those are **MVC** type pages.
- Pages outside the application, featured by one property only : its address. Those are **URI** type pages.

In a basic use, you'll need those option keys :

- **label** : A page label, such as ‘Home’ or ‘Blog’.
- **active** : You'll need this option if you want to put a mark on the page you're on (or the active hierarcy branch)
- **privilege** : You'll need this option if you want to interact with ACL
- **visible** : This option is useful if you want to hide a menu item. Most of the time it would be a container. For example, your navigation model can have three top level containers which are the 'main menu', the 'sidebar menu' and the 'footer menu'. Of course, you don't want to have those items (main menu, sidebar menu and footer menu) to be rendered on your website. So you'll use the 'visible' option to hide those administrative items.
- **order** : You'll use this option if you want to organise / order your menu items
- **pages** : Child pages of the pages. This is an array of array, just like the 'default' array.

For **MVC** pages, you will use those option keys too :

- **route** : the name of the route
- **controller** : the name of the controller... Since ZF2 and the aliases within the **Service Manager**, i don't know yet how we can invoke the controller within the **Zend\Navigation** model.
- **action** : the name of the action - just strip out the 'Action' part of the action method.
- **params** : extra parameters.

For **URI** pages, add this option key :

- **uri** : the URI of the page

**Zend\Navigation** also uses containers but all you need to know for a start is the pages part. Otherwise, you can get more information in the <a href="http://framework.zend.com/manual/2.3/en/modules/zend.navigation.containers.html" target="_blank">official documentation</a>.

Beyond those two page types, you can, of course, customize your own page types and extends the original **Zend\Navigation** page types. For my part, i can't imagine why i would need such implementation but... who knows ?

### The rendering

The <a href="http://framework.zend.com/manual/2.3/en/modules/zend.navigation.view.helpers.html" target="_blank">documentation is here</a>. It is quite clear and filled with very useful samples. I don't think i need to add anything more. I think you could easily get the result you wished for.

If on the other hand you wish to have more interactive menus, i guess you should use the classes available with Twitter Bootstrap (included within the ZF2 Skeletton Application), or use another Javascript framework.
