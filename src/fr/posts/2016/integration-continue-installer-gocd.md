---
title: "Intégration Continue - Installer GoCD"
permalink: "fr/posts/integration-continue-installer-gocd.html"
date: "2016-12-27T08:53"
slug: integration-continue-installer-gocd
layout: post
drupal_uuid: e8733f5b-4285-45e2-8065-b0320a12623b
drupal_nid: 166
lang: fr
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

summary: "Go CD est un serveur d'intégration / déploiement continu développé par Thoughtworks. Il a l'avantage d'être un package installable en local et a la réputation de fonctionner avec des projets en PHP. Mon installation de GoCD date un peu... Beaucoup en fait et même si j'ai pris des notes rapides à l'époque, je ne sais pas si toutes les instructions sont toujours correctes. De toutes façons, je vous les propose comme ça, en espérant que ça fonctionne bien pour vous aussi. Quand j'ai installé le serveur, j'ai suivi les instructions du serveur et il ne me souviens pas d'avoir eu des difficultés à le faire fonctionner.
"
---

<a href="https://www.go.cd/" target="_blank">**GoCD**</a> est un serveur d'intégration / déploiement continu développé par <a href="https://www.thoughtworks.com/" target="_blank">**Thoughtworks**</a>. Il a l'avantage d'être un package installable en local et a la réputation de fonctionner avec des projets en PHP.

Mon installation de **GoCD** date un peu... Beaucoup en fait et même si j'ai pris des notes rapides à l'époque, je ne sais pas si toutes les instructions sont toujours correctes.

De toutes façons, je vous les propose comme ça, en espérant que ça fonctionne bien pour vous aussi.

Quand j'ai installé le serveur, j'ai suivi les instructions du serveur et il ne me souviens pas d'avoir eu des difficultés à le faire fonctionner.

## Installer GoCD

Pour utiliser **GoCD**, vous aurez besoin du **serveur** d'une part, et de l'**agent** d'autre part.

Les deux s'installent aussi facilement l'un que l'autre, sur **Ubuntu**, grâce à l'utilitaire **APT**. *N'oubliez pas de rajouter la clé d'authentification comme indiqué dans la <a href="https://docs.go.cd/current/installation/install/server/linux.html#debian-based-distributions-ie-ubuntu" target="_blank">documentation</a>*

```sh
 curl https://download.go.cd/GOCD-GPG-KEY.asc | sudo apt-key add -
```

Maintenant, rajouter le dépôt.

*Je le fais dans ce sens : installer la clé d'abord avec CURL afin de pouvoir valider l'accès au dépôt lorsqu'on va ajouter le dépôt via Synaptic parce que lorsque je le fais dans l'autre sens, je me retrouve dans une boucle infinie : si j'installe le dépôt d'abord (via Synaptic), lorsque je valide l'ajout du dépôt, Synaptic va essayer de se connecter au dépôt. Or, sans la clé d'authentification, Synaptic va refuser de valider le nouveau dépôt. Et il n'est pas possible sur mon Synaptic d'ajouter une clé d'authentification en utilisant CURL.*

Dans tous les cas, vous aurez besoin du dépôt :

```sh
 deb https://download.go.cd /
```

Ensuite l'installation se fait avec un bon vieux `apt-get` et hop, roulez jeunesse !

```sh
 sudo apt-get install go-server
```

Vous trouverez les fichiers du server dans les répertoires suivants :

- `/var/lib/go-server/` #contains the binaries and database
- `/etc/go/` #contains the pipeline configuration files
- `/var/log/go-server/` #contains the server logs
- `/usr/share/go-server/` #contains the start script
- `/etc/default/go-server/` #contains all the environment variables with default values. These variable values can be changed as per requirement.

Mais je vous dirais où regarder pour trouver ce qu'il nous intéresse.

Pour l'installation de l'agent, même punition !

```sh
 sudo apt-get install go-agent
```

Vous trouverez les fichiers de l'agent dans les répertoires suivants :

- `/var/lib/go-agent/` #contains the binaries
- `/usr/share/go-agent/` #contains the start script
- `/var/log/go-agent/` #contains the agent logs
- `/etc/default/go-agent/` #contains all the environment variables with default values. These variable values can be changed as per requirement

## Démarrer le serveur

Faire un petit

```sh
 sudo /etc/init.d/go-server start
```

si le service n'est pas déjà en cours d'exécution.

Ce service lancera un serveur où vous pourrez accéder grâce à votre navigateur favori à cette adresse : <a href="#">http://localhost:8153/go</a>

**Attention :** Il est possible que **Go Server** ne fonctionne pas très bien avec **localhost**. Il faut alors donner un *hostname* à votre poste et se connecter à **Go Server** à cette adresse : <a href="#">http://{your_hostname}:8153/go</a>

Sur **Ubuntu**, pour donner un hostname à votre machine, éditer le fichier `/etc/hosts` et ajouter la ligne suivante :

```sh
// /etc/hosts
127.0.0.1 {your_hostname}
```

## Démarrer l'agent

```sh
 sudo /etc/init.d/go-agent start
```

Si nécessaire, vous pouvez éditer le fichier de configuration de **Go Agent** : `/etc/default/go-agent`

A titre indicatif, voici le contenu de mon fichier de configuration :

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
export JAVA_HOME="/usr/lib/jvm/java-7-openjdk-amd64/jre" # SET_BY_GO_INSTALLER__DONT_REMOVE
```

## Déclarer l'agent au serveur

Maintenant que l'agent et le serveur sont tous deux démarrés, il faut dire au serveur qu'il y a un agent qui va bosser pour lui.

Sur votre navigateur, aller à l'adresse <a href="#">http://localhost:8153/go/agents</a>. Si c'est votre première installation, il ne devrait y avoir qu'un seul agent affiché sur la page. Cocher la case au bout de la ligne et cliquer sur `[Enable]`. Le nom de l'agent (qui correspond au *hostname* de votre poste) devient bleu et devient un lien HTML.

Je dois avouer que je n'ai pas beaucoup exploré les fonctionnalités des agents. On se contentera donc, pour le moment, d'en utiliser qu'un seul, celui du poste local.

## Les autres installations

En principe, arrivé là, vous devriez avoir un serveur **GoCD** qui fonctionne (<a href="#">http://localhost:8153/go</a>).

Vous aurez besoin d'installer <a href="https://git-scm.com/downloads" target="_blank">**Git**</a>, <a href="https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx" target="_blank">**Composer**</a> et <a href="https://phpunit.de/getting-started.html" target="_blank">**PHPUnit**</a> dans votre <a href="https://en.wikipedia.org/wiki/PATH_(variable)" target="_blank">`PATH`</a>. Dans mon installation Ubuntu, les binaires sont dans `/usr/bin`.

**Les droits d'accès**

Il faut également s'assurer que tous les utilisateurs aient le droit d'exécuter les binaires. Globalement, cela signifie que vous devez avoir les droits suivants sur les programmes :

```sh
-rwxr-xr-x 1 root root 1706501 sept. 5 00:54 composer.phar*
-rwxr-xr-x 1 root root 3087044 juil. 15 00:22 phpunit*
-rwxr-xr-x 1 root root 1577288 mars 21 2016 git*
```

Je vous laisse installer votre projet PHP. En attendant, avant d'entrer dans le vif du sujet, je vous présenterais **GoCD** et ses différents concepts.
