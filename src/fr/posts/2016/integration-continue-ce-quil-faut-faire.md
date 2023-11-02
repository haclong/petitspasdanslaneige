---
title: "Intégration continue - Ce qu'il faut faire"
permalink: "fr/posts/integration-continue-ce-quil-faut-faire.html"
date: "2016-11-13T17:34"
slug: integration-continue-ce-quil-faut-faire
layout: post
drupal_uuid: f71b0e21-f354-49c8-a5b5-b32fa85344a9
drupal_nid: 152
lang: fr
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

summary: "Alors que l'intégration continue a le vent en poupe, il est surprenant de tomber sur aussi peu de tutoriels sur le net. Evidemment, c'est une problématique d'offres et de demandes mais si vous cherchez PHP+MYSQL sur Google, vous allez tomber sur des pages et des pages de résultats. Il n'en va pas de même pour l'intégration continue."
---

Alors que l'intégration continue a le vent en poupe, il est surprenant de tomber sur aussi peu de tutoriels sur le net. Evidemment, c'est une problématique d'offres et de demandes mais si vous cherchez PHP+MYSQL sur Google, vous allez tomber sur des pages et des pages de résultats. Il n'en va pas de même pour l'intégration continue.

Internet est rempli de *comment faire*. Si vous savez ce que vous voulez faire, Internet va vous expliquer comment le faire.

Par contre, il est très difficile de trouver les réponses à la question : quoi faire ?

C'est le cas notamment pour l'intégration continue.

Qu'à cela ne tienne, j'ai essayé.

## Jenkins

Le tout premier serveur d'intégration continue dont j'ai entendu parler, avant même le concept d'intégration continue, c'est **Jenkins**, un fork de **Hudson**. Ou le contraire, j'ai déjà oublié.

C'est **Jenkins** qui m'introduit à l'intégration continue (parce que ça aussi, si vous ne savez pas QUOI chercher sur Google, vous ne pouvez pas trouver). **Jenkins** étant en Java, je pense dans ma petite tête que ça va me poser un problème. Mais super Google est là et je trouve quelques tutoriels pour intégrer un projet PHP grâce à **Jenkins**. Hélas, si j'avais peut être le "comment", je n'ai pas le "quoi". La tentative est vouée à l'échec :

- Je ne sais pas (vraiment) ce que j'attends de **Jenkins**
- Je ne sais pas (vraiment) comment y arriver : les tutoriaux expliquent bien comment faire mais je ne suis même pas sûre que c'est ce que je veux faire
- Je ne suis pas convaincue que le mariage Java / PHP fonctionne bien et j'ai un gros soupçon sur la réussite de ma tentative à cause de cette incompatibilité de technologies.

Comme je pars perdante déjà, je finis par laisser le sujet de côté.

## Travis CI

Au moment où je me détourne de **Jenkins**, la toile parle de **Travis CI**, un serveur d'intégration continue qui marche avec PHP. Je lui trouve deux points qui me font l'écarter :

- **Travis CI** est sur le cloud (j'ai une préférence pour les solutions installées)
- Mes repos sont sur **Bitbucket** et **Travis CI** ne s'interface pas avec **Bitbucket**.

Ma quête continue donc.

## Go CD

Je finis par trouver **Go CD** de *ThoughtWorks*.

L'installation sur Ubuntu se fait avec un `apt-get` simplissime, quoi rêver de mieux. Le serveur tourne en permanence. Les dernières versions de Ubuntu étant très *user friendly*, je n'ai rien à faire. Tout roule. Du moins pour lancer le serveur.

Après différents tests et tâtonnements, je finis enfin par avoir un voyant au vert sur un de mes pipelines... Je ne suis pas sûre d'avoir bien fait.

Encore une fois cependant, je me heurte au "quoi faire" vs "comment faire".

## Il y a du progrès

Voici ce que j'ai fini par comprendre et par faire. Finalement, aux termes d'atermoiement et de tests infructueux, j'ai fini par utiliser trois serveurs d'intégration continue :

- <a href="https://travis-ci.com/" target="_blank">**Travis CI**</a> (pour un projet stocké sur **Github**),
- **<a href="https://continuousphp.com" target="_blank">continuousPHP</a>** pour un projet sur **bitbucket** et
- <a href="https://www.go.cd/" target="_blank">**GoCD**</a> pour les tests en local.

L'intégration continue, c'est une grosse boîte dans laquelle on met son code tout neuf d'un côté et qui, de l'autre côté, va vous dire si, d'après les critères qualitatifs que vous avez défini, votre code est valide ou pas. Et merci le serveur, il fait ce boulot TOUT LES JOURS. En tout cas, autant de fois que nécessaire.

Maintenant, voyons les étapes :

#### il faut dire au serveur où est votre code.

Evidemment, s'il y a des problématiques d'accès au code (autorisation, accès réseau), il faut déclarer toutes ces informations au serveur.

Sur **GoCD**, le code est sur un repo du système de fichiers et on doit lui indiquer spécifiquement le chemin vers vos sources.

Sur **Travis CI**, l'identification sur **Travis CI** utilise le compte **Github** et, grâce à *OAuth*, l'utilisateur autorise **Travis CI** à accéder à la liste de ses dépôts disponibles sur **github**. Du coup, **Travis CI** SAIT où sont vos sources, vous lui dites au moment où vous vous inscrivez chez lui. Toutefois, dans vos sources, vous devez dire que vous allez utiliser **Travis CI**. Il y a donc un fichier obligatoire au format que **Travis** peut comprendre pour pouvoir travailler avec lui.

Sur **ContinuousPHP**, c'est plus simple. Vous vous identifiez cette fois avec votre compte **Bitbucket** (mais le compte **github** et/ou **gitlab** marche aussi). Même chose, vous autorisez **continuousPHP** à accéder à la liste de vos dépôts. Ca me plaît moins mais vous autorisez également **continuousPHP** d'écrire dans vos sources. Et une fois que vous avez donné votre autorisation, **continuousPHP** SAIT où se trouve votre code.

#### la question de la localisation du code étant réglée, il faut que le serveur installe l'application.

A moins que vous n'écriviez un bon vieux code en procédural, sans AUCUNE librairie externe, l'étape d'installation va être une étape obligatoire. Et oui, le serveur d'intégration ne PEUT PAS deviner ce qu'il doit faire de vos sources.

Et oui, le serveur d'intégration continue installe le projet A CHAQUE FOIS.

C'est normal et une fois que les idées sont bien en place, ça paraît évident. Au moins, on repart A CHAQUE FOIS d'une base propre et on vérifie que tout roule.

Pour un projet en PHP, l'outil qui va nous aider à installer les dépendances, c'est notre bon vieux <a href="https://getcomposer.org/" target="_blank">**Composer**</a>.

**Travis CI** détecte la présence du fichier `composer.json` dans les sources du projet. Si le fichier `composer.json` est présent, **Travis CI** va l'exécuter et installer les dépendances dont le projet a besoin.

**ContinuousPHP** a le même mécanisme. Présence du fichier `composer.json` : exécution de l'installation du projet et de ses dépendances grâce à **Composer**.

**GoCD** est un serveur où rien n'est automatisé. Il faut tout faire. Si on veut utiliser **Composer**, alors on dira à **GoCD** de lancer le script d'installation de **Composer** et puisqu'on est sûr d'avoir laissé le fichier `composer.json` dans nos sources, l'installation se passera, en principe, sans souci.

NOTEZ BIEN : pour **Travis CI** et **ContinuousPHP**, l'installation via **composer** est automatisée en fonction de la présence ou non du fichier `composer.json`. Concernant **GoCD**, globalement, il ne fait qu'automatiser ce que vous feriez à la main vous même.

#### il faut préparer de l'environnement de test grâce à des scripts

Le projet a également besoin de certaines configurations pour fonctionner : l'exemple le plus courant est la connexion à la base de données. Dans le fin fond de vos sources, vous avez un objet qui va se connecter à la base de données grâce aux infos *host* / *base* / *user* / *password* du serveur de base de données. Evidemment, lorsque le serveur d'intégration continue va essayer de lancer votre projet, votre projet va le renvoyer dans les cordes parce qu'il ne trouve pas les informations de base de données. Que vous ne voulez pas lui donner puisque, soit ce sont les informations de la base de données de dev, soit ce sont les informations de la base de données de prod.

L'idéal, ce serait de monter TRES RAPIDEMENT une petite base de données - prendre le moteur de base de données de votre projet - dédiée au serveur d'intégration continue.

**Travis CI** : je n'ai pas eu l'occasion de faire ce type de manipulation sur **Travis CI**

**GoCD** : mon projet n'a pas besoin de base de données pour le moment

**ContinuousPHP** : pile dans le vif du sujet. Très rapidement, il faut préparer dans les sources du projet également, les scripts pour monter la base de données.

#### et finalement valider le code grâce aux tests

Après vous être assuré que votre projet s'installait bien, il faut vérifier que votre projet "fonctionne" bien.

Il faut dire au serveur s'il y a des tests à faire passer et si oui, lesquels. Et là, on touche le nerf de la guerre. Aucun intérêt à monter un serveur d'intégration continue si vous ne prévoyez pas de monter une (voire plusieurs) suite(s) de tests.

Pour les tests, il peut y en avoir de plusieurs types :

- les tests unitaires, avec <a href="https://phpunit.de/" target="_blank">**PHPUnit**</a> ou <a href="http://codeception.com/" target="_blank">**Codeception**</a>
- les tests fonctionnels avec <a href="http://docs.behat.org/en/latest/" target="_blank">**Behat**</a>
- la structure de votre code selon des critères reconnus par la communauté avec <a href="https://github.com/squizlabs/PHP_CodeSniffer" target="_blank">**PHPCS**</a>
- les tests front office avec <a href="http://docs.seleniumhq.org/" target="_blank">**Selenium**</a>

(bon, j'ai balancé les librairies de tests un peu au pif. Pour le moment, je manipule **PHPUnit** seulement. Je laisse Google vous éclairer sur les autres)

Pour les principales librairies de tests, il y a systématiquement le fichier de *bootstrap* qui va bien.

**Travis CI** vérifie que les fichiers de *bootstrap* de chacune des librairies sont (ou pas) présents dans le projet. S'ils y sont, **Travis CI** sait, la plupart du temps, quoi faire avec. De notre côté, il faut dire à **Travis CI** sur quels versions de PHP on souhaite tester notre projet.

**ContinuousPHP** vérifie la présence de certains fichiers de *bootstrap*. Je trouve que **ContinuousPHP** n'est pas aussi abouti que **Travis CI**. Il manque pas mal d'interface vers d'autres outils mais si on reste dans des librairies "classiques", il ne devrait pas y avoir de problèmes. Comme pour **Travis CI**, **ContinuousPHP** sait quoi faire pour les tests et comme pour **Travis CI**, tout ce qu'on a a décidé, c'est de choisir la version de PHP sur laquelle on souhaite tester notre projet.

**GoCD** a besoin qu'on lui dise de lancer les tests. L'absence du fichier de *bootstrap* va lever une erreur et interrompre l'exécution des tests. Comme **GoCD** est installé sur votre machine locale, si vous souhaitez utiliser une librairie de tests, il faut s'assurer que la librairie est installée et que le serveur de **GoCD** a les droits d'exécuter le binaire. Inutile de préciser que **GoCD** n'a pas la science infuse et qu'il faudra lui dire exactement quelle est la commande qu'il doit lancer pour jouer les tests.

Au terme de cette étape, généralement, il y aura un choix à faire : faut il continuer si les tests échouent ? faut il revenir en arrière ?

#### Le code n'est pas validé, les tests ont échoués

Il faut dire au serveur ce qu'il doit faire après : interrompre le *build* ? revenir en arrière ? envoyer un mail pour prévenir le développeur que cela n'a pas fonctionné ?

**ContinuousPHP** étrangement fait systématiquement un *build*, que les tests soient réussis ou pas. En revanche, en cas d'échec des tests, je reçois un mail. Je n'ai pas compris si je pouvais lui dire d'interrompre le *build* en cas d'échec. De même, **continuousPHP** suppose qu'à la fin du *build*, il faut OBLIGATOIREMENT un livrable. Du coup, il génère toujours un livrable soit sous la forme d'un **zip**, soit pour le livrer sur une plateforme de prod comme **docker** ou **AWS**.

**Travis CI** dans mon cas d'utilisation se situe après un premier serveur d'intégration continue et reçoit systématiquement du code validé. Je n'ai jamais vu son comportement en cas d'échec.

**GoCD**, comme d'habitude, c'est du paramétrage. Il faut tout lui dire. Pour le moment, je ne fais rien si le *build* échoue, mais si le *build* réussit, je pousse vers *origin*.

#### A la fin

J'aurais du dire ça depuis le début, mais il faut bien entendu dire QUAND (à quelle fréquence / quelles conditions) le serveur doit lancer le build.

**Travis CI** scrute le dépôt de source que vous lui avez indiqué. Dès qu'il y a un mouvement sur le dépot, il se lance.

**ContinuousPHP** fait la même chose.

**GoCD** peut faire la même chose, mais il peut également tourner à heures fixes ou bien attendre qu'on lance chaque *build* manuellement.

**Travis CI** et **ContinuousPHP** font le boulot et finalement, c'est une bonne solution puisqu'on a vraiment pas à se soucier de comment ça marche.

**ContinuousPHP** me paraît moins robuste que **Travis CI**. Il est plus long à s'exécuter. Il propose systématiquement un rapport sur la couverture des tests mais on n'a pas le choix des armes : on ne peut pas ne pas en vouloir et on n'a pas le choix du format. Le livrable est un **xml** en format **Clover**. Je n'ai pas encore trouvé comment l'exploiter. Sur le papier, **ContinuousPHP** vend des interfaces avec pléthores de librairies et de plateformes. Dans la réalité, le service est encore jeune et il manque beaucoup de fonctionnalités. Mais il fait le boulot et pour une utilisation sans prétention, ça peut le faire.

**Travis CI** est le leader me semble-t-il. Il y a une grosse communauté qui l'utilise et il est une brique inévitable des plus grands projets open source en php de ces dernières années. Rien à redire. Et en plus, il a une interface agréable.

Avec **GoCD**, j'ai appris, les mains dans le cambouis, comme j'aime, le paramétrage d'un serveur d'intégration. Pas vraiment le serveur, mais un.. pipeline. Je vous en parlerais plus en détail dans un prochain article.

Je sais, finalement, j'ai fait comme partout sur Internet. J'ai donné des informations sans vraiment en donner... Mais gardez un oeil sur mes posts. Je prévois très prochainement un post dédié à mon paramétrage sur **ContinuousPHP** et un autre sur le paramétrage sur **GoCD**.
