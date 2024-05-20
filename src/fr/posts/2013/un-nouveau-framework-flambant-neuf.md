---
title: "Un nouveau framework flambant neuf"
permalink: "fr/posts/un-nouveau-framework-flambant-neuf.html"
date: "2013-04-19T16:51"
slug: un-nouveau-framework-flambant-neuf
layout: post
drupal_uuid: 3898480f-8078-4106-ae4d-d5f85fec7bbe
drupal_nid: 34
lang: fr
author: haclong

media:
  path: /img/teaser/_9zwt.jpeg

tags:
  - "Zend Framework"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Voici un mois à peu près que je suis passée à Zend Framework 2. Merci aux longs mois qui ont précédés et qui m'ont mis le pied à l'étrier concernant l'apprentissage d'un framework MVC, de la conception d'un modèle (toujours pas testé en live) et des différentes notions liées à l'objet. Voici qu'avec l'arrivée de Zend Framework 2, je me prends de nouveau une belle pelletée de concepts dont j'ignorais jusqu'à l'existence. Et le pire, c'est qu'en creusant la question, certains ont plus de 10 ans !!"
---

Voici un mois à peu près que je suis passée à Zend Framework 2. Merci aux longs mois qui ont précédés et qui m'ont mis le pied à l'étrier concernant l'apprentissage d'un framework MVC, de la conception d'un modèle (toujours pas testé en live) et des différentes notions liées à l'objet. Voici qu'avec l'arrivée de Zend Framework 2, je me prends de nouveau une belle pelletée de concepts dont j'ignorais jusqu'à l'existence. Et le pire, c'est qu'en creusant la question, certains ont plus de 10 ans !!

Je n'y connais pas beaucoup en framework mais vu la différence qu'il y a entre Zend Framework 1 et le 2, j'ai le sentiment que la version 2 est un framework plus abouti et plus riche.

### Les modules

Tout d'abord, il a intégralement reconsidéré sa façon d'aborder les modules. Cela m'a beaucoup perturbée dans les projections que je faisais de mon application à venir.

Dans Zend Framework 1, les modèles étaient stockés ensemble. Il n'était pas impératif ni proposé de créer des modèles par module. Du coup, j'avais écarté cette possibilité. Le module pour moi était donc un moyen pour classifier la couche présentation de mon application. Souvenez vous, une URL avec Zend Framework 1 avait cette forme : `domaine.com/controller/action/parametres_supplementaires`. Cela pouvait poser des problèmes si on manquait d'imagination pour la création de ses controllers. Lorsqu'on utilisait les modules avec Zend Framework 1, l'avantage que je voyais à mon niveau, c'est que je pouvais récupérer un niveau dans l'url : `domaine.com/module/controller/action/parametres_supplementaires`. Ce n'est sûrement pas _TOUT_ l'avantage qu'offraient les modules dans Zend Framework 1, mais bon, quand on découvre, on découvre... Dans ma vision de l'application, le module se résumait donc à des sections entières d'une application mais dans le sens : un forum, un blog, une interface d'admin...

Arrive Zend Framework 2. La structure même du **Skeleton Application** fait bien comprendre que chaque module accède à ses propres modèles et qu'en définitive, les modèles ne sont pas partagés entre tous les modules d'une application. Je n'écarte pas la possibilité que l'option est faisable. Mais c'est clairement déconseillé. Cela semble même une erreur de conception. Le module se "branche" et se "débranche" de l'application comme un rien et devrait _EN PRINCIPE_ fonctionner tout seul...

Réaliser cela remet tout mon modèle en question. Que faire dans le cadre d'une application qui a des pages sécurisées par des droits d'accès utilisateurs ? Et comment fonctionne la connexion à la base de données ? Et l'éventuelle librairie faite maison que je comptais utiliser ? Dans quel module devrais-je la mettre ?

En fait, comme beaucoup de concepts dans le développement, il est crucial d'adopter le bon angle de vue. Une fois qu'on l'a trouvé, tout semble se simplifier tout seul.

Par exemple, les coordonnées de connexion à la base de données sont définies au niveau de l'application. Cela ne change rien finalement avec l'ancien fichier `application.ini`. Il faut en revanche, dans chacun des fichiers `Module.php` de son module, redéclarer que ce module se connecte à la base de données. Mine de rien, cela peut être pratique si votre module se connecte sur une _AUTRE_ base de données...

Pour le développement d'une librairie faite maison, il faut seulement faire un module qui n'aura jamais de couche présentation. On branche le module à l'application et les modules qui dépendront de cette librairie pourront l'utiliser sans problème. Tout simplement. Par défaut, Zend Framework récupère les modules soit dans le répertoire `modules/`, soit dans le répertoire `vendors/`... Dans la mesure où le module qui contient la librairie ne comporte pas de couche présentation, on peut tout aussi bien le mettre dans le répertoire `vendors/`. Pour le branchement, il n'y aura aucune différence notable.

Pour la page de login, c'est un point que je dois explorer mais finalement, le module **Authentification** va avoir les fonctions suivantes : présenter le formulaire de login, identifier l'utilisateur, lui attribuer un rôle et le rediriger vers une page "d'entrée" dans le site. Une fois "entré" dans le site, ce que l'utilisateur pourra voir ou ne pourra pas voir/faire sera déterminé par l'ACL. Je suppose que l'ACL va être géré à la main puisqu'il faudra lui rajouter des ressources au fur et à mesure que je rajouterais des modules à l'application. Cela ne me semble donc pas insurmontable.

Il reste encore la question de l'interface d'administration qui pourrait être cross-modules... Je n'ai pas encore exploré la question mais une de mes applications a la caractéristique d'avoir un backoffice d'un côté avec des fonctionnalités CRUD sur la base de données et en frontoffice, il n'y a qu'un accès en lecture. Du coup, je vois un module principal qui a les fonctionnalités CRUD et qui exposerait des services pour accéder aux données en lecture par ex. Le front office ne serait finalement qu'un client du module principal. Cela reste encore confus mais j'entrevois des options qui me donnent envie de continuer et de voir si ma façon d'aborder le sujet convient ou pas. C'est très motivant.

Il y a beaucoup d'articles écrits sur le nouveau système de modules de Zend Framework 2. Je ne compte pas m'attarder sur ce point aujourd'hui. J'y reviendrais plus tard si nécessaire.

### La gestion des services

Zend Framework 2 intègre désormais une brique **ServiceManager** qui permet de gérer les entités les unes par rapport aux autres en utilisant le **Service Locator pattern**. En gros, dans le fichier `Module.php` de chacun des modules, on nomme et on liste les entités dont on aura besoin et que d'autres entités clientes seront amenées à utiliser. Ainsi, on différencie bien le nom que les clients seront amenés à utiliser pour accéder au service et le service en lui même, son chemin éventuellement et son instanciation.

Là encore, c'est encore confus et j'utilise aveuglément le modèle que le <a href="http://framework.zend.com/manual/2.1/en/user-guide/skeleton-application.html" target="_blank">tutoriel de Rob Allen</a> met à notre disposition. En revanche, une de mes applications va manipuler une trentaine de tables... Je ne me vois pas du tout faire le même montage que celui de Rob Allen avec son module **Album**... Il faudra très certainement que je cherche dans une autre direction. La gestion des services ne me semble pas de prime abord trop difficile à mettre en oeuvre. En quelques sortes et tel que je le vois, c'est variabiliser les entités à un niveau supérieur. On les crée dans un fichier facilement accessible, toutes aux même endroit et après, y'a plus qu'à appeler chacun des services quand on en a besoin.

Dans mes essais, il est bon de rappeler que chaque module défini ses propres Services (oui, c'est bête de dire ça comme ça, mais moi, comme un des modules était un fork d'un module existant, j'ai fait un copier coller du fichier `Module.php` et j'ai tout laissé tel quel... Ca n'a pas posé de problème de fonctionnement mais c'est redondant). De même, il est bon de noter que chaque service doit donc bien être nommé afin de ne pas être confondu avec un autre service qui viendrait d'un autre module.

Chaque module définit ses propres services. Le truc qui fait de votre code une application va retrouver tous les bouts de codes qui définissent les services et rassemblent tous les services au même endroit. Ainsi, si on fait `$serviceManager->get('mon_service_de_nimporte_ou_dans_mon_app');` le service correspondant sera identifié et ramené pour utilisation. Ce qui a de bien, c'est que pour un peu de discipline (déclarer le service au bon endroit dans votre module), vous n'avez plus à vous soucier du chemin qui mène à votre service si vous voulez l'utiliser.

### La gestion des événements

Grande nouveauté également : le développement avec une gestion par événements. Zend Framework 1 n'en faisait pas vraiment mention. Il y avait bien, dans les controleurs, des fonctions avec des noms prédéfinis (`preDispatch()`, `postDispatch()`, `routeShutdown()`, etc...). Mais c'était plutôt présentés comme des hooks et on ne parlait pas vraiment de gestion par événements. De plus, il fallait impérativement lancer/appeler le contrôleur pour pouvoir exécuter ce qu'il y a dans la fonction "hook". Bon, ça se faisait bien à partir de la classe `Bootstrap` qui était appelée au lancement de l'application. Au moins un inconvénient : il n'y avait qu'un seul fichier `Bootstrap.php` à l'application. Si on voulait que des choses se produisent systématiquement à un événement donné, il fallait le définir dans le fichier bootstrap de l'application. Du coup, pour la modularité, c'était mort. Il y avait bien des fichiers bootstrap pour les modules du temps de Zend Framework 1, mais je n'ai jamais réussi à en tirer quelquechose...

Zend Framework 2 présente désormais une brique de gestion par événement en plus de sa gestion par service. Comme je n'ai jamais envisagé le développement sous cet angle, j'ai encore du mal à saisir le concept mais pour ce que j'en ai vu : on peut créer des événements (qui sont donc indexés très certainement dans un event manager). Il existe, dans le cadre d'une application MVC des événements prédéfinis. Mais on peut en mettre autant qu'on veut. Et on crée des listeners qui vont s'activer dès que l'événement est lancé...

Ca doit être le type de fonctionnement à mettre rapidement en place pour logger des messages (notamment du debug) ou dans les exemples que j'ai vu, pour cacher les informations. L'évenement pourrait être '*a-ce-moment-précis-là-maintenant-je-veux-que-tu-logges-des-infos-de-debug*'. Le listener (qui serait le logger pour le coup) n'aura plus qu'à s'exécuter. En fait, ce qui semble bien, c'est que l'événement peut être mis partout dans le code. Le listener n'est défini qu'une fois et ramasse tous les bip qui passeraient... bon, c'est encore confus mais ça doit mener quelque part, non ?

Il faudra qu'on rediscute de ce point quand j'en saurais plus. En attendant, n'hésitez pas à chercher le web à ce sujet.

### L'implémentation des injections de dépendances.

Zend Framework 2 met également en place un système d'injections de dépendance géré par un conteneur... Pire que les concepts précédents, je ne vais pas oser m'engager sur ce domaine. Quand on voit les explications du concept, c'est intéressant et très constructif... mais en parler maintenant, c'est trop tôt pour moi :)

En tout cas, ça existe et Zend Framework 2 doit faire ça bien... j'ai vu un article de blog faire un compliment à ce sujet... Je vous en parlerais quand j'en saurais plus.

### Le framework Zend Framework 2

En utilisant Zend Framework 1, j'ai commencé à comprendre ce qu'était un framework : <a href="http://fr.wikipedia.org/wiki/Framework" target="_blank">*un ensemble d'outils et de composants logiciels organisés conformément à un plan d'architecture et des patterns.*</a> Il y avait un squelette d'application qu'on pouvait adapter un minimum quand même et des règles de codage, notamment pour nommer les controleurs et les actions. Il y avait la classe bootstrap qui initialisait l'application et instanciait les composants nécessaires. Il y avait dans Zend Application des composants tout prêt... Il suffisait de les configurer pour qu'ils soient chargés. Ca me paraissait déjà très bien. Et très riche. Et souple également, ce qui est un des critères que je cherche dans mes outils.

Mais Zend Framework 2 me fait réaliser que la version précédente était encore loin de ce qu'on peut appeler un framework. La structure même d'une application montée avec Zend Framework 2 permet d'utiliser

- les événements : les définir, les déclencher et leur attacher des listeners qui vont s'exécuter dès que l'événement est déclenché,
- les services : définir des services qui pourront être accessible par différents clients (interne)
- les injections de dépendance : dans les exemples que j'ai vu, des classes s'imbriqueraient les unes aux autres grâce à un conteneur qui gèrerait le parc de classes d'une part et qui saurait identifier quelles classes dépendent desquelles autres...
- les modules puisque désormais, Zend Framework met à disposition un repository de modules qui pourront se brancher facilement à l'application et qui apporteront des fonctionnalités toutes prêtes à l'emploi.
- je passe les autres concepts que je n'ai pas encore découverts.

Quand j'ai commencé à découvrir Zend Framework, la version 2 était annoncée mais je n'étais pas disposée à changer de version. J'avais déjà tellement galéré sur la première version. Il semblait y avoir un tel gap entre la version 1.8 et la 1.10 que je m'effrayais d'imaginer le gap qu'il aurait pu y avoir entre la 1.x et la 2.x... Le gap y est, mais finalement, c'est tellement mieux. On dirait une voiture flambant neuve avec plein de gadgets dans les coins. Il faut ouvrir la boite à gants pour découvrir les futures fonctionnalités.

Autodidacte, Zend Framework m'a appris comment développer une application MVC. Zend Framework 2 va me faire découvrir d'autres concepts et j'ai du mal à retenir mon impatience...
