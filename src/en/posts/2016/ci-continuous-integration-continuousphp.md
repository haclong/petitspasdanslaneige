---
title: "CI - Continuous Integration with ContinuousPHP"
permalink: "en/posts/ci-continuous-integration-continuousphp.html"
date: "2016-12-17T07:27"
slug: ci-continuous-integration-continuousphp
layout: post
drupal_uuid: 15628497-a127-4fc0-b696-23c8b8f4eff4
drupal_nid: 163
lang: en
author: haclong

media:
  path: /img/teaser/9363900-los-engranajes-de-los-viejos-billetes.jpg

tags:
  - "intégration continue"
  - "zend framework 3"
  - "TDD"
  - "phpunit"
  - "continuousPHP"
  - "bitbucket"

sites:
  - "Développement"

summary: "Following my rant about continuous integration, allow me to share my settings with ContinuousPHP."
---

For those who are interested, here are the settings i am using with <a href="https://continuousphp.com/" target="_blank">ContinuousPHP</a> for a Zend Framework 2+ project.

## Project features

- **Repository on Bitbucket**
- **Installation of Zend Framework MVC Skeleton v 3.0.2dev with Composer**

It is a minimal installation of the Zend Framework MVC Skeleton and i used <a href="https://getcomposer.org/" target="_blank">Composer</a> to add extra packages i needed. Additional packages are written in the **`composer.json`** file. Since we will do some testing, installation of <a href="https://docs.zendframework.com/zend-test/" target="_blank">zend-test</a> is mandatory.

```sh
composer require zendframework/zend-test
```

- **PHPUnit Tests suite**

We will be using <a href="https://phpunit.de/" target="_blank">PHPUnit</a> testing library to do our unit tests. If you ever add a new module for you application (as i did), the autoloading is managed by composer.

**NOTE** : With the old ZF2 process, we had to add that snippet in each of our Module class to manage the autoloading of our module.

```php
// module/MonModule/Module.php

Class Module {
  public function getAutoloaderConfig()
  {
    return array(
      'Zend\Loader\StandardAutoloader' => array(
        'namespaces' => array(
          __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
        ),
      ),
    ) ;
  }
}
```

This snippet made the link between the namespace and the right path to find the files.

Nowadays, we don't need that snippet anymore. Autoloading has to be declared in `**composer.json**` :

```php
// composer.json
"autoload": {
  "psr-4": {
    "Application\\": "module/Application/src/",
    "MonModule\\": "module/MonModule/src/"
  }
},

"autoload-dev": {
  "psr-4": {
    "ApplicationTest\\": "module/Application/test/",
    "MonModuleTest\\": "module/MonModule/test/"
  }
},
```

Of course, although it is not recommended, you can give any name you'd like for your new namespace. But obviously, it is much easier to give a namespace matching the name of your module... well... to each his own...

So to make it clear, this is where the application will find our classes :

```php
// composer.json
"autoload": {
  "psr-4": {
    ...,
    "MonModule\\": "module/MonModule/src/"
  }
},
```

and this is where the tests are stored :

```php
// composer.json
"autoload-dev": {
  "psr-4": {
    ...,
    "MonModuleTest\\": "module/MonModule/test/"
  }
},
```

We have to make sure to add our tests to PHPUnit configuration file. If you missed that info, PHPUnit has its own settings in `**phpunit.xml.dist**`. Not in `**composer.json**`.

```xml
// phpunit.xml.dist
<phpunit colors="true">
  <testsuites>
    <testsuite name="ZendSkeletonApplication Test Suite">
      <directory>./module/Application/test</directory>
    </testsuite>
    <testsuite name="MonModule Test Suite">
      <directory>./module/MonModule/test</directory>
    </testsuite>
  </testsuites>
</phpunit>
```

- **Use of a MySQL database**

Using a MySQL database is interesting because it means there is obviously a `**config/autoload/dbadapter.local.php**` file with all the connection string to the database (including credentials). This file has been ignored by git for obvious security reasons.

That `**config/autoload/dbadapter.local.php**` file sets the hostname, username, password to connect to the database.

git ignore all **`*.local.php`** file (security rules included in Zend Framework (you can edit the rule in the .gitignore file)) :

```php
// /config/autoload/.gitignore

local.php
*.local.php
```

To summarize, if you wish to run your application / website WITHOUT that `**dbadapter.local.php**` file, you WILL get an exception.

You want to use some continuous integration process. So you WILL intall your application repeatedly and run that application EACH TIME.

Let's see how.

## Log in Continuous PHP

You need to log in **ContinuousPHP** using a **github** / **bitbucket** / **gitlab** account. Obviously, you will need the account where are the sources of your project.

Once you logged in for your first time, **ContinuousPHP** will ask for your authorization so it will be allowed to do a lot of (quite frightening) things on your VCS account. There's only two possible choices : either you take the red pill and you allow **ContinuousPHP** to do whatever it needs to do to you account and you move on, or you take the blue pill and you're out.

Once you agreed, **ContinuousPHP** will get all the repositories you've got on your **github** / **bitbucket** / **gitlab** account. Click on `[Setup]` (on your project line) to set your project. Once it's done, **ContinuousPHP** will know WHERE are your sources (remember, you need to tell the continuous integration server WHERE are stored the sources so it will know where to start).

Just to make things clear, **ContinuousPHP** is not meant to edit your project, to change anything in it. All it will do is changing your **Bitbucket** account (adding some keys etc) so ContinuousPHP can access your account.

## Build Settings

Now that **ContinuousPHP** knows WHERE are your sources, we will ask him to install the project. We have to tell **ContinuousPHP** which branch the server needs to check.

**ContinuousPHP** (like other CI servers too) can install the project on different instances of PHP. We can install and run our project on different versions of PHP.

If our project is a web project, **ContinuousPHP** expects to have the path to the index file (the one starting the web application). With a Zend Framework MVC Skeleton, the Document Root is `**/htdocs/index.php**`

As for now, i haven't set anything for those blocks : **Environment Variables**, **Phing**,** Shell Scripts**, **Credentials**, **SSH Keys** et **HTTP Basic Authentication**.

As the project is built on a framework, there will be dependencies missing in your sources but the project will need those dependencies to run (such as Zend Framework packages needed to run the MVC base). We will rely on **Composer** to install our dependencies. **ContinuousPHP** will look for the composer.json file. If there's one composer.json file, ContinuousPHP will fill in the field. For your information, "*Enable caching of Composer packages*" and "*Run Composer Hooks*" are checked.

## Test Settings

Now that **ContinuousPHP** knows HOW to install the project, we can tell him to run our tests.

If `**phpunit.xml.dist**` and `**phpcs.xml**` files are detected, **ContinuousPHP** will know there's unit tests and coding standards checks for our project. Therefore, PHPUnit tests are set automatically, as well as Code Sniffer tests. As i haven't worked on the coding standard, I have removed that part from ContinuousPHP settings. But you can keep the Code Sniffer checks if you wish to.

As for PHPUnit settings, check the 'blocking' checkbox and confirm that PHPUnit settings file is indeed `**phpunit.xml.dist**`.

All settings are done but you won't be able to run your project. On run, you will catch that exception concerning the missing credentials for the database. To fix this, we will need to add some files to our project.

## Add credentials to the database.

First of all, we need the configuration file with the credential to the database (our missing `**config/autoload/dbadapter.local.php**` file).

As for me, i choose to use a shell script. I have stored all my scripts in a `**scripts/**` folder. Remember that folder will be commited with `git`. So be careful what you put in it. On our continuous integration server, we will use a temporary database, built and installed only to run the tests and flushed afterward. Once the build will be done, nothing will remain from that database. The credentials for that temporary MySQL database, provided by ContinuousPHP, can be found in their <a href="http://continuousphp.com/documentation/databases/mysql/" target="_blank">documentation</a>.

```sh
// scripts/continuousphp_dbadapter.config.sh

#!/bin/bash

cat > ../config/autoload/dbadapter.local.php << EOF
<?php

return [
  'db' => [
    'adapters' => [
      'MyDbAdapter' => [
        'driver' => 'Pdo_Mysql',
        'database' => 'mydatabase',
        'dsn' => 'mysql:dbname=mydatabase;host=localhost',
        'username' => 'root',
        'password' => '',
        'driver_options' => [
          PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''
        ],
      ],
    ],
  ],
];
EOF
```

Just make sure that script is commited and sent to **ContinuousPHP** (meaning = it HAS to be in the git repository).

On **ContinuousPHP**, let's go to **Tests Settings** tab and add our first **Shell** script :

Giving execution rights to the `**scripts/continuousphp_dbadapter.config.sh**` script.

```sh
// write the whole line as a string in a ContinuousPHP shell input text
 cd scripts &amp;&amp; chmod 764 continuousphp_dbadapter.config.sh
```

Now run the `**scripts/continuousphp_dbadapter.config.sh**` script so it can generate the `**config/autoload/dbadapter.local.php**` file.

```sh
// write the whole line
cd scripts &amp;&amp; ./continuousphp_dbadapter.config.sh
```

Please note that we have to do `**cd scripts**` once again because each time we write a new shell script, we are starting from the root of our project in ContinuousPHP.

If you haven't done any mistake, the `**dbadapter.local.php**` file is now generated in the `**config/autoload/**` folder.

#### Now install the database.

To install the database, we will need a second shell script :

```sh
// scripts/continuous_db_create.sh
#!/bin/bash

mysqladmin -u root create mydatabase

mysql --user=root mydatabase < mydatabase.sql
```

Make sure that `**mydatabase.sql**` script is sent to **ContinuousPHP** too. (= present in the git repository) As for me, my `**mydatabase.sql**` is located in the `**scripts/**` folder so far. All i had to do is to export my database from phpMyAdmin. As i don't need (yet) to test datas stored in my database (but only create the adapter to the database to prevent the exception to be thrown), all i need in the `**mydatabase.sql**` is the database structure.

Let's add more scripts in **ContinuousPHP**, tests settings.

```php
cd scripts &amp;&amp; chmod 764 continuous_db_create.sh
```

and

```php
cd scripts &amp;&amp; ./continuousphp_db_create.sh
```

## Package Settings

Our tests are finally ready. ContinuousPHP need us to choose our package format.

For my part, i haven't found anything interesting so i choose Generic Tarball and i left all the default values. I then moved to the Deploy Settings.

## Deployment Settings

Though i have tried to set some process (such as pushing my project to a master branch if the build is successful, I finally remove all my settings so there's nothing in particuliar in this tab for my project. Just for you to know, **ContinuousPHP** can't push the resulting package to another repository or merge the package to a master branch.

## What happens

When you `remote push` your code to your **Bitbucket** repository, **ContinuousPHP** will be notified.

- It will clone your sources to as many instances dedicated to your build (depending on how many PHP version you want to run your project on)
- It will execute `php -d memory_limit=-1 composer install -o --no-interaction --ansi --no-progress` to install all dependencies
- It will redirect your web server to the Document Root of your project
- It will run all shell scripts you have added on each of your instances

```sh
cd scripts &amp;&amp; chmod 764 continuousphp_dbadapter.config.sh
cd scripts &amp;&amp; chmod 764 continuous_db_create.sh
cd scripts &amp;&amp; ./continuousphp_db_create.sh
cd scripts &amp;&amp; ./continuousphp_dbadapter.config.sh
```

- It will run `PHPUnit`

Once every tests have been run, ContinuousPHP will delete all temporary files, the database(s), the whole project. All it will be left will be downloadable packages :

- The *deploy package*including

- all your sources (including the `**scripts/**` folder),
- no `**config/autoload/dbadapter.local.php**` file,
- all dependencies files installed by **Composer** (meaning all modules from Zend Framework and some others depending on your project...)

some new extra files too :

- `**continuousphp.package**`
- `**phing.phar**`

- The *test package*. Though i have compared both packages (the deploy one and the test one), i haven't seen any differences between them. But i can guess there may be cases where there will be differences between the final deploy package and the temporary test package.
- Coverage reports on each PHP version (only if you wish **PHPUnit** to generate the coverage report)
- Tests report for each PHP version.

## How to add coverage report.

If you need **PHPUnit** to calculate the coverage report, you need to add a filter to the **PHPUnit** setting file.

```xml
// phpunit.xml.dist
<filter>
  <whitelist processUncoveredFilesFromWhitelist="true">
    <directory suffix=".php">module/Application/src</directory>
    <directory suffix=".php">module/MonModule/src</directory>
  </whitelist>
</filter>
```

Et voila !!

This post might be a little bit too long but i hope it will help those in need.

My next post on Continuous Integration will talk about the settings of my GoCD server.
