---
title: "Continuous Integration - Installing GoCD"
permalink: "en/posts/continuous-integration-installing-gocd.html"
date: "2016-12-27T18:40"
slug: continuous-integration-installing-gocd
layout: post
drupal_uuid: e8733f5b-4285-45e2-8065-b0320a12623b
drupal_nid: 166
lang: en
author: haclong

media:
  path: /img/teaser/capture_2.png
  credit: "Sebastian Mantel - Unsplash"

tags:
  - "intégration continue"
  - "gocd"

sites:
  - "Développement"
  - "Haclong projects"

summary: "GoCD is a continuous integration/deployment server produced by Thoughtworks. You can install it on your localhost and it works with PHP projects. My own GoCD installation is a little bit too old... Actually a lot older and though i have taken some notes then, I honestly don't know if they are still reliable. I do hope though they will be helpful nonetheless. I don't remember any particular difficulties when i done the installation."

---

<a href="https://www.go.cd/" target="_blank">GoCD</a> is a continuous integration/deployment server produced by <a href="https://www.thoughtworks.com/" target="_blank">Thoughtworks</a>. You can install it on your localhost and it works with PHP projects.

My own GoCD installation is a little bit too old... Actually a lot older and though i have taken some notes then, I honestly don't know if they are still reliable. I do hope though they will be helpful nonetheless.

I don't remember any particular difficulties when i've done the installation.

## GoCD Installation

GoCD requires installing the **server** AND the **agent**.

Both are easy to install using **APT** on **Ubuntu**.

*But you need first to install the authorization key first as said in the official <a href="https://docs.go.cd/current/installation/install/server/linux.html#debian-based-distributions-ie-ubuntu" target="_blank">documentation</a>*

```sh
 curl https://download.go.cd/GOCD-GPG-KEY.asc | sudo apt-key add -
```

Add the repository now.

*I prefer to do it in that order : install the key first with CURL so when you'd add the repository, Synaptic will be able to validate the access to the repository. On the other way around, you may be stuck in an infinite loop : installing the repository first using Synaptic but when you'll try to close the window (and validate the added repository) Synaptic won't be able to access the repository since it does not have the right key but you can't add the key using Synaptic...*

Anyway, once you're done, you need to add the repository :

```sh
 deb https://download.go.cd /
```

Once this is done right, just use a good old `**apt-get**` et hop, showtime !

```sh
 sudo apt-get install go-server
```

You'll find **Go Server** files in the following paths :

- /var/lib/go-server #contains the binaries and database
- /etc/go #contains the pipeline configuration files
- /var/log/go-server #contains the server logs
- /usr/share/go-server #contains the start script
- /etc/default/go-server #contains all the environment variables with default values. These variable values can be changed as per requirement.

But don't worry, i'll tell you where to look.

Now install the agent. Same player, shoot again !

```sh
 sudo apt-get install go-agent
```

**Go Agent** files can be find here :

- /var/lib/go-agent #contains the binaries
- /usr/share/go-agent #contains the start script
- /var/log/go-agent #contains the agent logs
- /etc/default/go-agent #contains all the environment variables with default values. These variable values can be changed as per requirement

## Starting the server

Just do

```sh
 sudo /etc/init.d/go-server start
```

when the service is not running.

This service will start a server you can access thanks to you favorite browser : <a href="#">http://localhost:8153/go</a>

**Attention :** It is possible that **Go Server** does not work very well using **localhost**. You may need to set a valid hostname to your localhost and use the hostname to access **Go Server** : <a href="#">http://{your_hostname}:8153/go</a>

How to add a hostname on **Ubuntu** : edit `**/etc/hosts**` and add the following line *({your_hostname} being a valid hostname, any name will do, as you like it to be)*

```sh
// /etc/hosts
127.0.0.1 {your_hostname}
```

## Starting the agent

```sh
 sudo /etc/init.d/go-agent start
```

If necessary, you can edit the** Go Agent** configuration file : `**/etc/default/go-agent**`

For your information, here is the content of my **Go Agent** file :

```sh
// /etc/default/go-agent
GO_SERVER=127.0.0.1
export GO_SERVER
GO_SERVER_PORT=8153
export GO_SERVER_PORT
AGENT_WORK_DIR=/var/lib/${SERVICE_NAME:-go-agent}
export AGENT_WORK_DIR
DAEMON=Y
VNC=N
export JAVA_HOME="/usr/lib/jvm/java-7-openjdk-amd64/jre" # SET_BY_GO_INSTALLER__DONT_REMOVE</pre>
```

## Registering the agent with the server

Both agent and server are running, you need to register the agent with the server before works are assigned to them.

On your browser, go to <a href="#">http://localhost:8153/go/agents</a>. If it is your very first installation, you should see one and only one agent listed on the page. Check the box on the agent line and click on [Enable] button. The agent name (should be the same of your hostname) turns blue and with your mouse hovering above, you can see it turns into an HTML link.

I need to tell you that i haven't much experienced with the agent features. Therefore, we will work with only one agent for now, the one we installed on our localhost.

## The other installations

At this point, you should have a running GoCD server (<a href="#">http://localhost:8153/go</a>).

But you will need to add <a href="https://git-scm.com/downloads" target="_blank">Git</a> installation, <a href="https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx" target="_blank">Composer</a> installation and <a href="https://phpunit.de/getting-started.html" target="_blank">PHPUnit</a> too within your <a href="https://en.wikipedia.org/wiki/PATH_(variable)" target="_blank">PATH</a>. On my **Ubuntu**, all binaries are in `**/usr/bin**`.

**Access rights**

Please make sure that all users can run the binaries. Check the rights :

```sh
-rwxr-xr-x 1 root root 1706501 sept. 5 00:54 composer.phar*
-rwxr-xr-x 1 root root 3087044 juil. 15 00:22 phpunit*
-rwxr-xr-x 1 root root 1577288 mars 21 2016 git*
```

Now, all you need to do is to install your PHP project using of course Composer, Git and some tests using PHPUnit. In the meantime, before talking about the main topic, i'll talk a little bit about GoCD and its concepts.

GoCD installation documentation can be found <a href="https://docs.go.cd/current/installation/installing_go_server.html" target="_blank">here for Go Server </a>and <a href="https://docs.go.cd/current/installation/installing_go_agent.html">here for Go Agent</a>.
