---
title: "Continuous Integration - Testing the project 1/2"
permalink: "en/posts/continuous-integration-testing-project-12.html"
date: "2017-02-07T18:45"
slug: continuous-integration-testing-project-12
layout: post
drupal_uuid: b464e4ff-5341-4614-84ed-fa3c4d586295
drupal_nid: 171
lang: en
author: haclong

media:
  path: /img/teaser/capture_2.png
  credit: "Sebastian Mantel - Unsplash"

tags:
  - "intégration continue"
  - "gocd"
  - "git"
  - "phpunit"
  - "tutorial"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Let's summarize : we have installed our very first pipeline and within that pipeline, a first stage. As a first stage, most of the time, it will install the project : load and install libraries. Once the project is successfully installed, let's move to the next stage : tests."

---

Let's summarize : we have installed our very first pipeline and within that pipeline, a first stage. As a first stage, most of the time, it will install the project : load and install libraries. Once the project is successfully installed, let's move to the next stage : tests.

## The stage

Within our pipeline, we need to add a second stage. As for the previous stage, we won't use template (we could, of course, but since i'm on the learning curve, i prefer to set the stage manually).

- Configuration type : **Define Stages**

### ProjectTesting Stage

Let's see how we can set up the stage used for testing our project.

#### MonPremierBuild/ProjectTesting

**Stage Settings**

- Stage Name : **ProjectTesting**
- Stage Type : **On success** (stage starts automatically vs stage starts manually). If the previous stage is failing, then the current stage won't be run. If we are on the very first stage then that stage will run automatically each time **GoCD** run a *build*.
- Fetch Materials : **Y.** **GoCD** MUST go fetch ***materials*** to run the stage.
- Never Cleanup Artifacts : **N**. If the stage build an **artifact**, **GoCD** NEVER cleanup **artifacts** stored on **Go Server** if option is checked and ALWAYS cleanup **artifacts** if option is not checked.
- Clean Working Directory : **N**. If you clean the working directory, then your project freshly installed on the previous stage will be wipe out and you would not be able to run any tests. The trick is to leave the directory cleaning to the first stage.

**Environments variables**

None defined yet.

**Permissions**

- **Inherit from the pipeline group**.

Let's look at our jobs now

## The job

We will need two jobs for this stage :

- our first job will run unit tests with coverage checking only. Since this is quite time consuming, i have set a dedicated job for that purpose.
- our second job will run unit tests and will push the validated code to the remote repository if the tests are successful.

Please note that we could have manage a third stage for the deploy step (or anything we would like to do "after the testing stage"). Instead, we deploy in this stage. I will explore that in another pipeline.

### Job 1 CheckCoverage

#### MonPremierBuild/ProjectTesting/CheckCoverage

**Job Settings**

- Job Name : **CheckCoverage**
- Resources : **''**
- Job Timeout : **Use default (Never)**
- Run Type : **Run one instance**. *<span style="color:#800080;">I don't know yet how to use the instance feature</span>*.

**Artifacts**

Since we will expect some coverage report at the end of our job, it means we have at least one artifact.

- Source : **var/coverage** (`/var/lib/go-agent/pipelines/{pipelineName}/`)

- Destination : **report** (`/var/lib/go-server/artifact/pipelines/{pipelineName}/{compteur}/{stageName}/{compteur}/{jobName}`)

- Type : **Build Artifact**

**Environment variables**

None defined yet.

**Custom tab**

Since our coverage report are HTML files, we wish to see the result in a dedicated tab within Go Server (dashboard).

- Tab Name : **Coverage**. That is the name we choose for our customized tab. GoCD will create that tab once the job run.
- Path : **report/coverage/index.html**. This is the path to the first page (index.html) of our coverage report. As i have some difficulties finding the correct path, i have been looking for it in the filesystem : `/var/lib/go-server/artifact/pipelines/{pipelineName}/{compteur}/{stageName}/{compteur}/{jobName}`

The job settings are done. Let's take a look at tasks.

## The task

For the **CheckCoverage** job, we will use only one task.

### Task 1.1

The task will run unit testing and generate the coverage report.

Here's the right command line if we would have done it MANUALLY :

```sh
phpunit --coverage-html var/coverage
```

#### What's gonna happen :

- **GoCD** will be notified once the previous stage has been run successfully.
- **GoCD** will run the task we ask him to run

#### What needs to be done :

Edit the task in **GoCD**. It is a **"More..."** type task so we have to write all the rules.

- Command : **phpunit**
- Arguments : (careful, all the new lines are important)

```sh
--coverage-html
var/coverage
```

- Working Directory : **''**
- Run If Conditions : **Passed** (will run automatically if the previous job is successful)

<blockquote>Careful : the **phpunit** binaries HAVE TO BE in the PATH directory on **Ubuntu**.
Copy `phpunit` in `/usr/bin`
</blockquote>

<blockquote>`phpunit` permissions : `**root:root - 755**`</blockquote>

## About the CheckCoverage job

This job is interesting because it produces html files and make us use new elements : artifacts and custom tabs...

When we run our pipeline :

- **GoCD** cloned the project and we will find the project here : `/var/lib/go-agent/pipelines/{pipelineName}`
- The following command will generate HTML files about tests coverage

```sh
phpunit --coverage-html var/coverage
```

- **phpunit** will make the `var/coverage` directory inside our project files (here : `/var/lib/go-agent`)

The only problem is the **GoCD** dashboard (`http://localhost:8153/go`) can't access any files stored under `/var/lib/go-agent`. If you have files generated by jobs or tasks, you need to copy define those files as artifacts so **go-server** will be aware of their presence.

Therefore, here is how it is done : our artifact settings say that we wish to move any files inside `var/coverage` (`/var/lib/go-agent/pipelines/{pipelineName}/var/coverage`) to the destination directory `report` (`/var/lib/go-server/artifact/pipelines/{pipelineName}/{compteur}/{stageName}/{compteur}/{jobName}/report`) which will be created on **go-server** filesystem.

Actually, I wished to copy the content from `var/coverage` to `report` but it seems that **GoCD** copied the content from `var/` to `report/`.

Once we have defined our artifact, we can see it on the **GoCD** dashboard (`http://localhost:8153/go`) when we check our pipeline.

For the tests coverage report (generating HTML files) we can see the pages directly on the **GoCD** dashboard thanks to a *custom tab*.

If we need a new tab, we assign a name to that custom tab and we tell GoCD which file must be read first. The file HAS TO BE in : `/var/lib/go-server/artifact/pipelines/{pipelineName}/{compteur}/{stageName}/{compteur}/{jobName}`

Tadaaa.

Now, we need to run the tests again and generate the build (or anything we need once the tests are successful).
