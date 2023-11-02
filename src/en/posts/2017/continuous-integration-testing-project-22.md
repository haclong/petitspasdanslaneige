---
title: "Continuous Integration - Testing the project 2/2"
permalink: "en/posts/continuous-integration-testing-project-22.html"
date: "2017-02-17T18:56"
slug: continuous-integration-testing-project-22
layout: post
drupal_uuid: b7e2b508-58d0-4bc6-8fb8-8c00bd13c887
drupal_nid: 172
lang: en
author: haclong

media:
  path: /img/teaser/capture_2.png
  credit: "Sebastian Mantel - Unsplash"

tags:
  - "intégration continue"
  - "git"
  - "phpunit"
  - "gocd"
  - "tutorial"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Within the same stage, we have scheduled two jobs : one job for the coverage tests and the other job for the unit tests and the build. On the previous post, we have seen how to set the coverage tests job. In today's post, we will see how to set the other job, the one with the testing and the copying and the pushing..."
---

Within the same stage, we have scheduled two jobs : one job for the coverage tests and the other job for the unit tests and the build. On the previous post, we have seen how to set the coverage tests job. In today's post, we will see how to set the other job, the one with the testing and the copying and the pushing...

### Job 2 TestAndBuild

#### MonPremierBuild/ProjectTesting/TestAndBuild

**Job Settings**

- Job Name : **TestAndBuild**
- Resources : **''**
- Job Timeout : **Use default (Never)**
- Run Type : **Run one instance**.

**Artifact**

In our **TestAndBuild** job, we will generate an artifact

- Source : **monprojet.*.zip**

- Destination : **''**

- Type : **Build Artifact**

If you want to know, you will find all your artifacts here :

```sh
/var/lib/go-server/artifact/pipeline/{pipelineName}/{compteur}/{stageName}/{compteur}/{jobName}
```

**Environment variables**

None defined yet.

**Custom tab**

None defined yet.

The job settings are done now. Let's take a look at job's tasks.

## Tasks

For our **TestAndBuild** job, we will use more than one task.

### Task 2.1

First task will run unit tests.

If we had to run that task manually, we would have done this in a terminal :

```sh
phpunit
```

#### What's gonna happen :

- **GoCD** gets the notification the previous stage is successful.
- **GoCD** will run the current task

#### What needs to be done :

For that purpose, we will add a new task in **GoCD**. It will be a **"More..."** type task so we need to write the rules down.

- Command : **phpunit**
- Arguments : **''** (none)
- Working Directory : **''**
- Run If Conditions : **Passed** (will run automatically if the previous job is successful)

<blockquote>Careful, you need to install the **phpunit** binaries in your PATH directory on **Ubuntu**.
Copy `phpunit` in `/usr/bin`
</blockquote>

<blockquote>`phpunit` permissions : `**root:root - 755**`</blockquote>

### Task 2.2

Second task will create a zip with our sources if the tests are successful.

Manually, we will use that command line :

```sh
git archive --format=zip -v --output=sudokusolver.zip master
```

#### What's gonna happen :

- **GoCD** has run the previous task successfully
- **GoCD** will run the next task

#### What needs to be done :

- Command : **sh** (i know, but it is how it works)
- Arguments : (careful, the new lines are mandatory)

```sh
-c
git archive --format=zip -v --output.MyBuild.$GO_PIPELINE_COUNTER.zip master
```

- Working Directory : **''**
- Run If Conditions : **Passed** (will run automatically if the previous job is successful)

<blockquote>Please note the usage of the **$GO_PIPELINE_COUNTER** variable exposed by **GoCD**. This is the incremented number **GoCD** uses to count each time a pipeline is run. So you can run the same pipeline several times a day and have different zip for each run.

Here is the list of **GoCD** variables.
</blockquote>

### Task 2.3

Our third task will add a remote repository to our local git repository.

We now all know the command line we need to tell **GoCD** to run

```sh
git remote add github git@github.com:user/remote.git
```

#### What's gonna happen :

Lorsque GoCD a installé votre projet, il a fait un clone de votre projet. Il y a donc un nouveau serveur git tout neuf pour votre projet installé par GoCD. Qui dit serveur git tout neuf dit AUCUN dépôt distant, or *origin* qui pointe sur le répertoire de développement de votre projet (là où GoCD a cloné votre projet)

Il va donc falloir ajouter à ce serveur git tout neuf votre VRAI répertoire distant.

#### What needs to be done :

- Command : **sh** 
- Arguments : (careful, the new lines are mandatory)

```sh
-c
git remote add github git@github.com:user/remote.git
```

- Working Directory : **''**
- Run If Conditions : **Passed** (will run automatically if the previous job is successful)

### Task 2.4

Vous vous doutez bien, la quatrième tâche va consister à pousser notre projet vers le dépôt distant si les tests ont été passés avec succès.

A la main, dans un terminal, voici la commande qu'on connait bien :

```sh
git push github master
```

#### What needs to be done :

- Command : **sh** 
- Arguments : (careful, the new lines are mandatory)

```sh
-c
git push github master
```

- Working Directory : **''**
- Run If Conditions : **Passed** (will run automatically if the previous job is successful)

### Task 2.5

Finally, because i wanted to explore some more, the firth task will copy the .zip package GoCD made earlier and move it to a chosen repository (on localhost).

#### What needs to be done :

- Command : **sh** 
- Arguments : (careful, the new lines are mandatory)

```sh
-c
cp MyBuild.$GO_PIPELINE_COUNTER.zip /home/user/repository/monprojet/builds/.
```

- Working Directory : **''**
- Run If Conditions : **Passed** (will run automatically if the previous job is successful)

## Note : GoCD syntax for tasks

Depending on the **GoCD** documentation, when it comes to set our tasks, we either need the real command and set one argument per line in the **Arguments** textarea or in the other hand, **GoCD** think the command we are using is from this kind :

```sh
sh -c "git push github master"
```

You can find further explanation on <a href="https://docs.gocd.io/current/faq/environment_variables.html" target="_blank">GoCD documentation.</a>

## Note : push to remote git repository

If you are following this tutorial, you will get a security issue concerning the **github** access authorization. Currently, **github** won't allow anybody (in your case, a `go:go` user) to push files on YOUR repository. You need to tell **github** that user `go` is allowed to push informations.

- Open a terminal
- Log in as `go` user

```sh
sudo su go
```

- Generate the SSH key for your go user for **github** usage

```sh
ssh-keygen -t rsa -b 4096 -C "{adresse email}"
```

When a SSH key is generated, you will be prompted to save the key here:

```sh
/var/go/.ssh/id_rsa
```

- Copy and paste the content of `/var/go/.ssh/id_rsa.pub` and add that SSH key to your **github** repository (your project).
- Once the key is added to **github**, return to your terminal. Make sure you are still logged in as `go` user
- Type this :

```sh
ssh -vT git@github.com
```

*<span style="color:#800080;">i don't really know what it is doing but it is working</span>*

- Say **Yes** when prompted
- Log out :

```sh
exit
```

You may need to define a dedicated port for the HTTPS GoCD server

- Go to **Admin > Server configuration** and define the right URL and the dedicated port for HTTPS. *<span style="color:#800080;">I can't say more... I am out of my comfort zone here :p</span>*

Et voilà !!

## **Conclusion**

So we have seen all the tasks set for our **MonPremierBuild/ProjectTesting/TestAndBuild** job.

- the job run all the unit tests (phpunit)
- if tests are successful, the job packages a zip of our project (without libraries) and copy that zip to a local repository.
- if tests are successful, the job add a remote repository to the current git repository (the one of GoCD) and push the code to the remote.

<blockquote>*<span style="color:#800080;">This is not fully satisfactory though :</span>*

*<span style="color:#800080;">Our remote repository is sync with the GoCD git repository but our localhost git repository (the one from our development project) is not synchronized.</span>*
</blockquote>

Pfffew... it was a bit too long but hopefully, everything is here. I hope you find this useful. Please come back for more posts !
