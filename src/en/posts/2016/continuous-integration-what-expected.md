---
title: "Continuous Integration - What is expected"
permalink: "en/posts/continuous-integration-what-expected.html"
date: "2016-11-13T07:34"
slug: continuous-integration-what-expected
layout: post
drupal_uuid: f71b0e21-f354-49c8-a5b5-b32fa85344a9
drupal_nid: 152
lang: en
author: haclong

media:
  path: /img/teaser/engrenages.jpg

tags:
  - "intégration continue"
  - "gocd"
  - "PHP"
  - "phpunit"

sites:
  - "Développement"

summary: "While continuous integration is buzzing throughout internet, it is surprising how hard i had to dig and find any tutorials about that topic. Either it is a supply and demand issue, or it is a difficulty level issue... If you try to google for PHP+MYSQL, you'd find tons and tons of tutorials and pages about that topic. That's absolutely not the case for continuous integration."
---

While continuous integration is buzzing throughout internet, it is surprising how hard i had to dig and find any tutorials about that topic. Either it is a supply and demand issue, or it is a difficulty level issue... If you try to google for PHP+MYSQL, you'd find tons and tons of tutorials and pages about that topic. That's absolutely not the case for continuous integration.

Internet is full of *how to*. If you know what you want to do, Internet can show you how to do it.

On the other side, it's harder to find the answer to that question : WHAT TO DO ?

And it happens I was in that case about continuous integration.

Anyway, i tried.

## Jenkins

The very first continuous integration server i ever heard of, even before hearing about the concept of continous integration, is **Jenkins**, a fork of **Hudson**. Or is it the other way around, i forgot.

Thanks to Jenkins, i get introduced to continuous integration (yeah, by the way, if you don't know WHAT to search on Google, you can't find it). Jenkins is more Java world so in my little head, i associated that info with a probable issue. But almighty Google is here and i finally found few (very few) tutorials to use my PHP project with Jenkins. Alas ! I found the 'HOW', i didn't find the WHAT. My attempt was doomed even before i started it :

- I don't (really) know what I am expecting from Jenkins
- I don't (really) know how to achieve what i want to do : tutorials i found so far explain how to set Jenkins but i'm not even sure that it is what i want to do (and beside, my attempts to stick on those tutorials no matter what failed miserably and since i don't know what i want to do, i don't know how to fix it)
- I am not (really) convinced that the Java / PHP mix is working well and since i mistrust the compatibility between the Jenkins server and the PHP project, i can't resolve that part.

Well, since i was already convinced about my own failure, i finally had to put my weak attempt aside.

## Travis CI

Well, as i was turning away from Jenkins, the PHP World is buzzing with Travis CI, a PHP dedicated continuous integration server. But Travis CI is not what i was looking for :

- Travis CI is Cloud centered and i use to prefer work with local installation
- My repositories are hosted by Bitbucket. Travis CI is only github compatible.

So the quest is still on.

## Go CD

I finally heard about Go CD from ThoughtWorks.

Thanks to apt-get, installation of Go CD on Ubuntu is a breeze. The server is running all the time so i don't have to bother starting and stopping it regularly. Everything is handled perfectly in Ubuntu. I don't have to worry about the server... At least, nothing to worry about running the server.

But setting a pipeline up is another story. I have to test and try and make several attempts before finally getting a green light on one of my pipelines. And i am not even sure to have done it right...

Once again, i bang my head on the WHAT TO vs HOW TO

## There is some progress

Here is what i finally get and what i am doing. I am currently using three CI servers. (you don't have to use all three of them. I have several projects and some can be use with one server when the other can be used with another one so it is an opportunity to confront multiple solutions.)

- **<a href="https://travis-ci.com/" target="_blank">Travis CI</a>** (for a github project),
- **<a href="https://continuousphp.com" target="_blank">continuousPHP</a>** (for a bitbucket project)
- **<a href="https://www.go.cd/" target="_blank">GoCD</a>** (for local project)

Continuous Integration is a big black box where you put your raw code on one end and the box will tell you on the other end, depending on the quality tests and criteria you have defined, if your code is validated... Or not. And, thanks to the server, he can do that ALL DAY LONG, EVERY DAY. Well, as many times as needed.

Now, here are the steps :

#### tell the server where the code is.

If you want the CI server to process and test your code, you need to tell him where is the code. Eventually, if there's any credentials involved, you also need to give all the information to the server.

And the server is definitely not interested on your code once deployed (the real files, the host etc). He needs the source of the project and most of the time on modern projects, we are talking about the repository where you keep your versionned code. Nowadays, it means mostly git but of course, there's other version control system out there. This is WHAT we are talking about.

On **GoCD**, since it is a local installation, we are talking about a local repository. Since you are using git, it can be your ongoing development directory. Just tell GoCD where is your working repository.

On **Travis CI**, you are using Github as a authentication and you are giving authorization to Travis CI to access your repositories on githbut. So Travis CI KNOWS where to find your sources. You gave the infos as soon as you are logging in. But you also need to add a Travis configuration file to your project so you can plug the project and Travis CI safely. You'll find the basic documentation about that file on Travis CI website.

On **ContinuousPHP**, this is even easier. You authenticate with your bitbucket account (you can authenticate with github or gitlab as well). Same story, you authorize ContinuousPHP to access your repositories. I'm not really thrilled about it because you also give authorization to ContinuousPHP to write into your sources... Just hope it won't be messing with the files. But once you gave access, ContinuousPHP KNOWS where to find find the sources.

#### now that we know WHERE the code is, let's install our project.

Since you are (hopefully) not coding with an old fashioned procedural project with NONE external packages, the installation step is definitely mandatory. Yes, the CI server needs to know WHAT to do with your sources.

And yes, the CI server will do the installation of your project EACH TIME.

That's what expected and though i couldn't believe it at first (don't ask why), now that i think about it, it sounds so logical that i can't explain what sounds so surprising at first. At least, we are starting a fresh install EACH TIME and we are checking that nothing has been broken since last time.

For your PHP project, we have the perfect tool to perform our project installation : of course, our old pal <a href="https://getcomposer.org/" target="_blank">Composer</a>.

As for **Travis CI**, he knows what to look for and once he finds a `composer.json` file within your sources, he will run Composer with that file. Of course, Composer will do what he is meant to do and install all the required dependencies.

**ContinuousPHP** will do the same and check for the presence of `composer.json`. Composer will run and install your project dependencies.

As for **GoCD**, it is a full configurable CI server. Nothing is automated. So you have to tell him to run Composer (make sure you have a global Composer install on your localhost). Here again, Composer will use the `composer.json` file you left on your project and the installation should be running just fine.

Please NOTE : As for Travis CI and ContinuousPHP, they are going to run Composer if they are able to find the composer.json file within your sources. As for GoCD, you will tell him to run Composer but you have to be sure that you have your composer.json file within your sources. Which should be the case for modern projects.

#### prepare your testing environment with scripts.

Your project will need some special configurations to run : for example, connecting to a database because somewhere in your code, you have a database adapter who needs to connect to a database. When your CI server will try to run your application, it will catch an exception because the database adapter object won't be able to find the right connection string to connect to the database. Connection string that you don't want to give because :

- it is unsafe to commit your project with credential to the database (so the database credentials won't be included in the sources you gave to the CI server)
- the database credentials are either the development database datas, or worse, the production database datas.

The perfect solution would be to use a CI server dedicated database to run your project.

**Travis CI** : i don't have the opportunity yet to use database connection with Travis CI

**GoCD** : my current local project does not use database for now

**ContinuousPHP** : right where we need to be. ContinuousPHP is using some database engines. ContinousPHP documentation will give you the credentials to connect to the database it will built specially for your project. You need to run some scripts to create a database config file dedicated to that temporary database and another script to build the tables as well.

#### finally validate the code with tests.

Once you make sure your project is successfully installed and running, you need to check if your project is validated.

You have to tell the CI server if there is any tests to run and, if there is, which ones. And this is the VERY PURPOSE of the CI Server. There is ABSOLUTELY NO NEED to build up a CI Server if you are not using any tests for your project.

As for tests, there is a full range of possibilities out there :

- unit testing with <a href="https://phpunit.de/" target="_blank">PHPUnit </a>or <a href="http://codeception.com/" target="_blank">Codeception</a>
- behavioral testing with <a href="http://docs.behat.org/en/latest/" target="_blank">Behat</a>
- code normalization validated by the PHP Community with <a href="https://github.com/squizlabs/PHP_CodeSniffer" target="_blank">PHPCS </a>
- frontend testing with <a href="http://docs.seleniumhq.org/" target="_blank">Selenium </a>

(well, i am using PHPUnit only as for now. So I just throw some testing library names i heard of. Please refer to Google for more informations about the others)

For each testing library, there will be one right bootstraping / configuration file for it.

**Travis CI** will check which bootstrap files are in your sources. For each file, Travis CI knows which tests it must run. All we need to do is to tell Travis CI if we need to run our tests on several versions of PHP.

**ContinuousPHP** will check for some bootstrap files as well. For my part, i think ContinousPHP is still behind Travis CI and it lacks some testing libraries but if you stick to "widely used" libraries, it shouldn't be any trouble. For each bootstrap files found, ContinuousPHP should know which tests engine to use. All you need to do is to choose the PHP versions you want to test your project with.

As for **GoCD**, as usual, you have to tell it to run the tests. As for the installation step, if the source lacks of the test bootstrap file, it will throws an exception. And since it is a local installation, you have to make sure that the test library you need for your project is installed on your machine and GoCD does have the permission to run the binary. Of course, you also have to tell GoCD which command line GoCD needs to run the tests.

After that step, you'd have to make a choice : what to do if tests are failing ?

#### the code is invalid, tests have failed.

If tests have failed, you need to tell the CI server what to do : stopping the build ? roll back ? sending a mail with a notification ?

As strange as it is, **ContinuousPHP** will do a build nonetheless, the tests having succeeded or failed. BUT i also get a test each time a build have failed. I haven't get it yet if i can tell ContinuousPHP to stop the build if the run is failing. In the other hand, ContinuousPHP will invariably expects to deliver a package (the build), either a .zip archive or a package ready to ship to docker or AWS. For example, in my case, it is not possible, if the build is succeeding, to ask ContinuousPHP to merge the tested code to the master branch of my project.

As for **Travis CI**, it is just a light testing standing after a first GoCD server. So basically, all the right decisions have been taken way before Travis CI and basically, the code Travis CI has already been tested and validated. So there's not much decision to make in Travis CI.

As for **GoCD**, as usual, you have to set all details up. For now, i am checking my server each time i am running a build, so if the build is failing, i see it in the dashboard. No mail being sent. In other hand, i don't think i have a mail server on my localhost so GoCD wouldn't be able to send me any mail... Have to try that out one day. In the other hand, when my build is succeeding, the script is pushing the code to `origin`.

#### in the end

I should have say that earlier, but of course, you have to tell your server WHEN (frequency / conditions) you want it to run your build.

**Travis CI** will check on your source repository and run a build each time there's a change in the repository.

**ContinuousPHP** have the same rule.

**GoCD** can do the same thing but it can ALSO run at a fixed time (like a cron) or wait to a use to run a build manually.

Travis CI and ContinuousPHP are doing a great job and you don't have to worry about how to have it done.

ContinuousPHP feels weaker than Travis CI, probably because it is less popular than Travis CI. ContinuousPHP feels slower than Travis CI. There's always a Clover XML coverage report. You can't say you don't want that report and you can't choose the format of the coverage report. ContinuousPHP says that you can use it with a lot of libraries, engines and other things but actually, ContinuousPHP feels still young and lot are still missing (again, in my point of view). And again, it does the job.

Travis CI is widely used by the open source community. There's nothing to say about it and the frontend is very nice looking.

I had to dig and try and experiment, just like i like it. I have found some nice settings for my current usage of GoCD so far. Just stay around, i plan to do a full post on my GoCD setup for what it worths.

I know i know, finally, i have done like many others before me. I gave some informations but there's nothing in the end. But i'll be back with more ... concrete informations for those who needs help.

PS :
What's inside a ContinuousPHP build ? I plan to do a full post on ContinuousPHP so i'll tell you then :) Stay tuned !
