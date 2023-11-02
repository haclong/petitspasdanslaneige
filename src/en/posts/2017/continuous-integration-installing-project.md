---
title: "Continuous Integration - Installing the project"
permalink: "en/posts/continuous-integration-installing-project.html"
date: "2017-01-27T18:43"
slug: continuous-integration-installing-project
layout: post
drupal_uuid: c24253bf-fc25-4f0c-9467-e25429e7cda2
drupal_nid: 169
lang: en
author: haclong

media:
  path: /img/teaser/capture_2.png
  credit: "Sebastian Mantel - Unsplash"

tags:
  - "intégration continue"
  - "gocd"
  - "ubuntu"
  - "tutorial"
  - "git"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Once the pipeline have been created in GoCD, let's see together how we can set our first build."
---

Once the pipeline have been created in **GoCD**, let's see together how we can set our first build.

In my <a href="/fr/content/int%C3%A9gration-continue-les-concepts-de-gocd.html">previous article</a>, we have explored how to create our very first pipeline... Not quite though. Nothing did happen once we created our pipeline. Moreover and in a very frustrating way, i didn't give away any useful settings so far...

I will fix that point right after we have checked on our project.

## Project features :

- <a href="https://symfony.com/doc/current/setup.html" target="_blank">Symfony 2</a> Framework
- No use of database *(if you wish to have an example of continuous integration using a connection to a database, please refer to <a href="/fr/content/ci-int%C3%A9gration-continue-avec-continuousphp.html">my other article about ContinuousPHP</a>)*
- Testing with <a href="https://phpunit.de/getting-started.html" target="_blank">PHPUnit</a>
- Remote repository using <a href="https://github.com/">github</a>

## Scenario :

Project code is local using feature branches.

Once the branch is completed, we merge that branch to *local master branch*.

The *local master branch* update / commit will trigger the right **GoCD** pipeline.

When the installation of the project on **Go Server** and the running of tests are successful, we will give direction to **GoCD** to push *local master branch* to *remote master branch*.

#### Let's see how to do it on GoCD.

On the first step, to **GoCD** to run a *build*, it is mandatory that **GoCD** is able to install the project. <span style="color:#800080;">*Remember, each time the continuous integration server must make a build, it has to run the steps all over from the beginning again : fetch the sources in the repository, install the project, install dependencies, run tests, validate tests and deploy depending on the direction we gave.*</span>

## The pipeline

After creating our first pipeline, let's edit it.

**Pipeline General Options**

- Pipeline Name : **MonPremierBuild**
- Label Template : **${COUNT}**
- Automatic Pipeline locking : **N**
- Automatic Pipeline scheduling : **Y**

**Pipeline Project Management**

- Tracking Tool : **None**
- Pipeline Materials : **only path to source**

**Environnement variables**

None defined yet. <span style="color:#800080;">*I need to search more about that point because it is no clear for me what use i can do with it*</span>

**Parameters**

None defined yet.

Let's dig into stages.

## The stage

Our stages are created manually and do not use templates.

- Configuration type : **Define Stages**

### **ProjectInstallation Stage**

I started with one **stage** including all was needed for one *build*. But tests was taking more and more time to run and sometimes, **GoCD** could run into timeout. I had to separate different *stages*of one *build*. **Stages** are ALWAYS run in the order we decided. So i set a first stage to install the project and then I set a second stage for the testing and deployement.

For now, lets check on our first stage : installing the project.

#### **MonPremierBuild/ProjectInstallation**

**Stage Settings**

- Stage Name : **ProjectInstallation**
- Stage Type : **On success** (stage starts automatically vs stage starts manually). If the previous stage is failing, then the stage won't be executed. If it is the very first stage (no stage before) then that stage will run automatically each time **GoCD** run a *build*.
- Fetch Materials : **Y.** **GoCD** MUST go fetch ***materials*** to run the stage.
- Never Cleanup Artifacts : **N**. If the stage build an **artifact**, this option tells **GoCD** NEVER cleanup **artifacts** stored on **Go Server** if option is checked and ALWAYS cleanup **artifacts** if option is not checked.
- Clean Working Directory : **Y**. **GoCD** MUST ALWAYS clean the working directory everytime it starts a new *build*when the option is checked and NEVER clean the working directory everytime it starts a new *build*when the option is not checked. Cleaning the working directory everytime will ensure us to start the *build*on a fresh install.

**Environnement variables**

None defined yet

**Permissions**

- **Inherit from the pipeline group**.

Let's look at our jobs now.

## The job

My **ProjectInstallation** stage does have one and only one job for now.

### InstallWithComposer Job

#### MonPremierBuild/ProjectInstallation/InstallWithComposer

**Job Settings**

- JobName : **InstallWithComposer**
- Resources : **''**
- Job Timeout : **Use default (Never)**
- Run Type : **Run one instance**. *<span style="color:#800080;">I don't know yet how to use the instance feature.</span>*

**Artifact**

None defined yet.

**Environment variables**

None defined yet.

**Custom tab**

None defined yet.

That's it. The whole job settings are done. Now, let's get a look at our job's tasks.

## The task

Actually, there's only one task for our **InstallWithComposer** job : the command to install our project dependencies using **Composer**.

What we are going to do know is to ask **GoCD** to do AUTOMATICALLY what we would have done MANUALLY with a terminal :

```sh
composer install
```

#### What's gonna happen :

NOTE : when we created the pipeline, whe had defined a first ***material*** which is actually our local **git** repository and we also set the ***branch*** **GoCD** needs to check.

- Once we will commit the right ***branch*** on the right **git** repository
- **GoCD** will knows something happened
- **GoCD** will clone the project from our local **git** repository to `**/var/lib/go-agent/pipelines**`
- **GoCD** will go to the project root
- **GoCD** will run the task we ask him to run (namely : `composer install`)

#### What needs to be done :

Edit the task in **GoCD**. It is a **"More..."** type task so we need to write all the rules down.

- Command : **composer**
- Arguments : **install**
- Working Directory : **''**
- Run If Conditions : **Passed** (will run automatically if the previous job is successful - if there's no previous job, so it will run automatically nonetheless)

Very important ! You must have installed the `composer` binary in a PATH directory on your **Ubuntu**.

**Copy `composer.phar` in `/usr/bin`**

```sh
cd /usr/bin
cp /path/to/composer.phar
```

**Make a symbolic link**

```sh
sudo ln -s composer.phar composer
```

Check `composer.phar` permissions :

- root:root - 755

This done, we have installed the project on **Go Server**.

Next post, we will see how to run tests. Of course, you must have tests to run them. On the other hand, as i said once, there's no senses to use a continuous integration server if you don't take the opportunity to consolidate your project with a few tests.
