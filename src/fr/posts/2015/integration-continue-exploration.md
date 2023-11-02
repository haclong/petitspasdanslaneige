---
title: "Intégration continue - exploration"
permalink: "fr/posts/integration-continue-exploration.html"
date: "2015-10-13T07:55"
slug: integration-continue-exploration
layout: post
drupal_uuid: cc90cb81-5d89-458f-860e-37cf7f689189
drupal_nid: 147
lang: fr
author: haclong

media:
  path: /img/teaser/engrenages.jpg

tags:
  - "intégration continue"
  - "code"
  - "programming"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Je tourne mon attention sur l'intégration continue... C'est pas la première fois que je fais ça et on va dire que je fais ça _encore_ une fois. Pour le moment, je ne suis pas très loin et je manque surtout de méthodologie."
---

Je tourne mon attention sur l'<a href="https://fr.wikipedia.org/wiki/Int%C3%A9gration_continue">intégration continue</a>... C'est pas la première fois que je fais ça et on va dire que je fais ça _encore_ une fois. Pour le moment, je ne suis pas très loin et je manque surtout de méthodologie.

J'ai fait un peu de recherche. Pêle mêle, pour faire de l'intégration continue, il faut

- un système de contrôle de version (<a href="https://git-scm.com/">git</a> pour moi, si vous avez bien suivi)
- une librairie de tests unitaires (<a href="https://phpunit.de/">phpUnit</a>, de base, mais il y a également <a href="http://codeception.com/">codeception</a>)
- un programme pour faire les build (là, c'est flou...)
- un serveur d'intégration continue (là, c'est flou...)

## Vertu de l'intégration continue

Tout le monde vous dira qu'en 2015, l'intégration continue, c'est super cool. C'est Agile. C'est fiable. Plus vous intégrer régulièrement, moins vous risquez de tomber sur les problèmes irrésolubles des sources qui sont tellement différents les uns des autres que ça devient un véritable casse-tête pour les réconcilier... Et puis, si vous avez un process d'intégration continue fiable, le truc travaille tout seul pour vous et *théoriquement* vous avez moins à faire une fois que vous avez fini de développer votre module / application. CQFD.

Je reste persuadée que l'intégration continue est un process à explorer et à maîtriser. La fiabilité, ça me plaît comme argument. Et si en prime, quelqu'un peut se charger de faire les vérifications à ma place, ça m'arrange. Du coup, je persévère et j'essaie de mettre la théorie en pratique.

Oui mais voilà. J'ai des interrogations. Des trucs pas clairs dans les coins.

## Zones à éclaircir

D'un côté, j'ai <a href="http://www.martinfowler.com/articles/continuousIntegration.html">Martin Fowler</a> qui explique que globalement, lorsque vous faites de l'intégration continue, vous devriez être capable de prendre votre dernier build, d'appuyer sur un bouton et hop, le truc se déploie tout seul, s'installe tout seul et vous êtes heureux, aucun problème à signaler.

De l'autre côté, j'ai des questions qui, pour le moment, ne trouvent pas réponses :

- Lorsqu'on installe le <a href="https://github.com/zendframework/ZendSkeletonApplication">Zend Framework Skeleton</a>, on nous recommande bien de ne pas inclure dans les fichiers commités les fichiers de paramétrages (les données de connexion à la base de données par ex, ça peut être utile)
- Si le projet s'installe tout seul avec le dernier build, et que si on admet que - comme le dit Martin Fowler dans son article - on doit pouvoir installer le projet sur une machine vierge, cela signifie qu'à son installation, le projet génère le script pour la base de données... mais alors, si on utilise le même build pour déployer en production, il serait malvenu que ce même script écrase la base de données en production...

Quelque part, je pense que mon raisonnement est totalement absurde. Comme pour certains sujets, je dois le prendre par le mauvais angle et je n'arrive pas à trouver l'angle juste par lequel tout s'éclairera. Toutefois, étalant ici mes doutes, je me dis en même temps que je ne vois pas très bien ce qu'est un **build**.

## Le build

Le build est issu d'un script d'automatisation. Dans ce script d'automatisation, on va pouvoir générer la documentation du projet, faire exécuter les tests unitaires, les tests d'intégration etc qu'en sais-je encore, vérifier le code etc... Mais ce que je n'ai pas encore très bien compris, c'est le lien qu'il y a entre le script d'automatisation et les éléments qui me posent problèmes comme les fichiers de configuration d'une part et le script de la base de données...

Si j'ai tout compris, le build va utiliser les sources qu'on veut déployer, lancer le script de build dessus pour vérifier que les sources tiennent le "choc" et si le build est valide, les sources sont validées. C'est à peu près cela que ça veut dire... Du coup, j'ai plusieurs options :

- avoir un build différent par étape d'intégration continue. Ainsi, le build à utiliser sur la machine de developpement (tel que décrit par Martin Fowler) et le build à utiliser pour mettre à jour un projet en production avec la dernière release ne serait pas le même. Le premier intègrerait les scripts de base de données alors que le second n'intègrerait que les mises à jour de la structure de la base de données...
- le build ne sert qu'à valider les sources mais ne sert pas à déployer... Cette option contredit le témoignage que j'ai lu sur un <a href="http://www.jamesshore.com/Agile-Book/ten_minute_build.html">article de James Shore</a> dans lequel il met en avant l'avantage de pouvoir déployer un projet grâce à une commande build. A moins que ce build là ne correspond pas à un build d'intégration continue (enfin, si, mais ça revient à ma première option, c'est pas tout à fait le même)

## La boîte à outils

Comme vous pouvez le constater, mon enquête n'est pas finie.

En terme d'outillage, j'ai trouvé <a href="http://www.go.cd/">Go CD</a> qui peut faire l'affaire pour le serveur d'intégration continue. Il y a bien <a href="https://travis-ci.org/">TravisCI</a> aussi, très apprécié sur le marché. Je réfléchis à l'utilisation d'une solution en ligne mais comme je tatônne, j'éprouve une pudeur à étaler mes échecs sur la toile... J'ai regardé du côté de <a href="http://jenkins-ci.org/">Jenkins</a> mais je n'ai malheureusement jamais réussi à le paramétrer et le faire fonctionner sur mon environnement de développement. Sur ce point, Go CD a donc l'avantage puisque lui au moins, il a fonctionné.

De mémoire, Go CD intègre le moteur de script... sinon, j'ai vu un peu ce que <a href="https://ant.apache.org/">Ant </a>pouvait offrir même si je n'ai pas tout compris de ce côté là. Je suppose qu'au pire, je peux écrire mes scripts en ligne de commande... même si ce ne doit pas être l'option la plus efficace.

## Demain

Evidemment, après l'intégration continue, le déploiement continu... mais là, c'est une autre histoire.
