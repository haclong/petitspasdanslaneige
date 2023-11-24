---
title: "Continuous Integration - GoCD concepts"
permalink: "en/posts/continuous-integration-gocd-concepts.html"
date: "2017-01-17T18:37"
slug: continuous-integration-gocd-concepts
layout: post
drupal_uuid: a457074d-30f3-421e-a858-0e6d0c6b2a03
drupal_nid: 164
lang: en
author: haclong

book:
  book: continuous-integration-using-go-cd
  rank: 1,
  top: 
    url: /en/books/continuous-integration-using-go-cd.html
    title: Continuous Integration - Using Go CD
  next: 
    url: /en/posts/continuous-integration-installing-gocd.html
    title: Continuous Integration - Installing GoCD

media:
  path: /img/teaser/2048x1536-fit_illustration-laboratoire-antidopage.jpg

tags:
  - "gocd"
  - "intégration continue"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Remember, to have an efficient use of a continuous integration server, (moreover when we are using a fully configurable server), you need to tell the server what to do. And you can't tell GoCD what to do if you don't grab the general concepts of the application."
---

Remember, to have an efficient use of a continuous integration server, (moreover when we are using a fully configurable server), you need to tell the server what to do. And you can't tell **GoCD** what to do if you don't grab the general concepts of the application.

We have successfully installed (and run) **GoCD** (server and agent), we have a PHP project, we will now configure our continuous integration server.

We will give proper **instructions** to our continuous integration server (**GoCD**) so it will know what to do.

#### Task

Each instruction (like a command within a terminal) is a **task** for **GoCD**.

#### Job

**Tasks** are grouped in **jobs**. Each job is composed by an ordered **sequence of tasks** executed **in the order** we **defined**.

#### Stage

**Jobs** are grouped in **stages**. Within each stage, **jobs** are executed with **no order**, even **simultaneously**.

#### Pipeline

At last, **stages** are grouped in **pipelines**, stages are executed **in the chosen order**.

On the beginning, it is quite confusing and you can get mixed up with all the concepts so my advice is to use at first one pipeline with only one stage, with only one job and, you can't avoid to have to use multiple tasks... The more you get confident with GoCD, the more you will enhanced your pipeline, creating more than one job and more than one stage.

Please find the <a href="https://docs.go.cd/current/introduction/concepts_in_go.html" target="_blank">official documentation</a> on **GoCD** website.

Now that we have our short introduction to **GoCD** concepts, let's dig into the server.

## My first pipeline

Open your **GoCD** server (<a href="#">http://localhost:8153/go</a>), menu **Admin > Pipelines.**

You can group your pipelines in logical groups. This is a feature to help you get organized. It does not have any consequences for the continuous integration building job.

For me, i am using one pipeline group per project. But i am realizing that i don't have more than one pipeling per project for now. So I'm thinking that maybe it is more interesting to group my pipelines by functionality (or integration type) : one pipeline group for all pipelines using localhost code and sending the build to a shared git server and a second pipeline group for pushing master code to production environment. This sounds good but i am running out of projects for now so i haven't changed anything to my grouping.

Anyway. Click on `**[Add New Pipeline Group]**` to create a new pipeline group then on `**[Create a new pipeline within this group]**` to.. well, you know.

**ATTENTION** : there's something i feel slightly wrong with **GoCD**. You can't delete an existing pipeline. Actually, you can but GoCD advise you to refrain doing so. You can't delete an existing pipeline and create a new pipeline using the same name. **GoCD** actually does not delete all pipeline history. Therefore, a new pipeline will inherit all the history of the deleted pipeline. This is quite boring when you are trying to understand how it works and you are creating multiple pipelines for testing purposes -_-.

Anyway...

Now let's see how to create one pipeline.

#### Step 1 : Basic Settings

Give it a name (*Pipeline Name*) (make sure it is unique).
Make sure that the *Pipeline Group Name* is the right one but it should be.

#### Step 2 : Materials

"**Materials**" for **GoCD** are the starting point from where **Go** will start doing the *build*. BASICALLY, this is your code, your project. Now, there's also a possibility to add more *materials* i.e some local dependencies you can't install using **Composer** but mandatory for your project so **Go** need to know about them (and install them).

For now, all we are interested in are our project commited in our local **git** repository.

- *Material Type* = <span style="background-color:#ffff00;">Git</span>
- *URL* = path to the local git repository. Git can use filesystem path, so we can tell GoCD where are our sources (Ubuntu).

Let's say our project is in this directory :

```sh
/home/user/projets/monprojet/dev/src
```

git repository should be in this directory :

```sh
/home/user/projets/monprojet/dev/src/.git
```

Then **GoCD** is expecting this path for the URL data to your git repository :

```sh
/home/user/projets/monprojet/dev/src
```

You can use `**[Check Connection]**` to check **GoCD** will find the repository where you said it is.

As for access rights, the owner has execute access (x), write access (w) and read access (r) on the project files. For all others users, they can execute (x) and read (r) on directories and read access (r) on files. So far, **GoCD** is fine with those rules.

- *Branch*= choose the branch **GoCD** will check. As default, it is *master*. If you plan to create one branch per feature, you ought to know that for each branch added, you will need to create a different pipeline dedicated for that branch (here we are, pipeline grouping per projects :))
- *Poll for new changes* = check the box. Each time you will commit on the chosen branch, **GoCD** will run the *build* automatically. If you don't want **GoCD** to run automatically, you have to tell **GoCD** when to run the build. You have two more options :
- either *manually*: each time you need **GoCD** to run, you have to go on **GoCD** server (website) and **click on a button** to run the build.
- or *programmatically*: **GoCD** will run a build regularly as planned at fixed time, no matter what changed occured on your sources... <span style="color:#800080;">*heyyy... it just occured to me that it is an idea for a pipeline group dedicated to regular builds, per day or per week, just to make sure that nothing external (ie a dependency update) breaks your code... Then, you can control that old projects are still OK...*</span>

#### Step 3 : Stage / Job

- *Configuration Type* : <span style="background-color:#ffff00;">Define Stages</span>. I believe we will be able to use templates when we get more skilled with **GoCD**. As for now, i need to understand what's happening so i can't afford introducing one level of difficulties.
- Give a *Stage Name*
- *Trigger Type* : <span style="background-color:#ffff00;">On Success</span>. Unless you want to manage your pipelines / stages manually, you will always use "On Success".
- Choose a *Job Name*. By default, **GoCD** pipeline wizard will help you create only one stage and only one job by pipeline. But we will edit our pipeline later and add more stages and jobs as needed.
- *Task Type*: I use <span style="background-color:#ffff00;">"More..."</span> choice for now so i can tell **GoCD** which command to use, one after another.

Click on `**Finish**`. You've created your first pipeline !! <a href="https://en.wiktionary.org/wiki/%E3%81%8A%E3%82%81%E3%81%A7%E3%81%A8%E3%81%86" target="_blank">Omedeto</a> !!

In the next article, we will dig into our pipeline and fine tune it.
