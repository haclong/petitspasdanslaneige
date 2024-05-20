---
title: "Retour vers le futur ? Jamais !"
permalink: "fr/posts/retour-vers-le-futur-jamais.html"
date: "2016-11-29T10:28"
slug: retour-vers-le-futur-jamais
layout: post
drupal_uuid: 5a78a948-010c-4484-a8a1-2dc85cc12b5a
drupal_nid: 161
lang: fr
author: haclong

media:
  path: /img/teaser/backfuture_mainbanner2.jpg

tags:
  - "OOP"
  - "Middleware"
  - "framework"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Après une discussion tout a fait cordiale avec un ami, v'la qu'il me dit qu'il ne comprends pas cet engouement pour le développement orienté objet et que finalement, il y a tout un historique avec la programmation procédurale, que ça a très bien fonctionné en son temps et que finalement, on peut tout aussi bien faire en procédural ce qu'on peut faire en objet."
---

Après une discussion tout a fait cordiale avec un ami, vla qu'il me dit qu'il ne comprends pas cet engouement pour le développement orienté objet et que finalement, il y a tout un historique avec la programmation procédurale, que ça a très bien fonctionné en son temps et que finalement, on peut tout aussi bien faire en procédural ce qu'on peut faire en objet.

J'ai été choquée. Le discours est tellement à contre courant des philosophies de programmation actuelles que j'ai trouvé cette opinion hérétique.

Et puis, comme d'habitude, je n'ai pas su quoi répondre sur le moment.

Pour vous resituer :

j'ai commencé avec de la programmation procédurale. J'ai appris les frameworks et la programmation orientée objet sur le tas et je crois que j'ai bien compris maintenant... Je crois. Pour mon ami, on a le même age, il a commencé à faire du procédural (comme moi) mais il a fini par arrêter le développement et il a changé d'orientation.

J'ai réfléchi à ce qu'il m'a dit. De nature passionnée, je me suis demandée si ma première réaction n'était pas liée à une façon un peu extrême d'aborder la question, un peu comme un dogme. Il a fallu faire la part entre l'objectif et le subjectif. Rationnellement, en effet, qu'est-ce qui m'empêcherait de revenir en arrière et de faire ce que je fais actuellement en procédural ? (je parle du but final, je ne parle pas de la façon d'y arriver)

Rien. Il a raison. On a su le faire. Il n'y a pas de raison qu'on ne sache pas le refaire.

Mais en soit, cela me répugne. Se mettre en haut de la page et tout enchaîner sans distinction jusqu'au bas de la page. J'ai imaginé garder les principes de l'objet (single responsability) mais en répartissant les fonctions dans des includes. Mais cela me semble désormais un tel fatras de code empilé, un amalgame bloubiboulgesque inextricable que je ne saurais même pas comment en sortir. Et puis finalement, les includes, ce serait un peu nos objets, mais en version procédural...

Alors oui, j'ai encore le sentiment qu'en procédural, je pourrais finir le code plus vite que ce que je fais en objet aujourd'hui. L'objet déborde de redite, de rabachage. Et que je crée l'interface. Et que je rajoute la fabrique pour la gestion de dépendance. Ce sont des redites, mais ce sont des redites UTILES. A force de se concentrer sur le single responsability, une méthode qui semble pouvoir être réutilisée à l'infini ne peut plus l'être. En tout cas, pas comme j'ai pu l'avoir fait à une époque.

Et puis, dans l'objet, j'aime beaucoup ce principe de single responsibility. Un objet = une fonction (pas une méthode, une fonction du genre fonctionnalité). Du coup, les méthodes liées à un objet RESTENT liées à l'objet. L'objet introduit le principe de scope qui permet de resituer les méthodes dans un contexte et non plus comme des outils éparpillés dans des fichiers includes. Le plus dur reste à savoir qui fait quoi mais c'est à la conception que cela se décide.

L'objet, cela aide également au concepteur de l'application et au développeur de garder la tête claire. Il faut absolument éviter autant que possible les liaisons croisées. Si on peut garder les choses de manière linéaire, c'est déjà bien.

Et puis, développer en objet permet également d'utiliser les frameworks du marché. Et là encore, je pense que je ne pourrais plus m'en passer. En effet, l'avantage des frameworks, c'est de vous embarquer des gestionnaires prêt à l'usage :

- le gestionnaire de services, afin de pouvoir gérer proprement les dépendances de vos objets. Hautement recommandé, la plupart du temps, il donne l'impression d'être contraignant mais finalement, il sait se révéler tellement plus pratique à l'usage. En fait, être obligé de gérer ses dépendances oblige le développeur / concepteur à ne pas concevoir des objets avec des liaisons croisées. Se forcer à garder des dépendances linéaires permet d'avoir une architecture de code plus facile à visualiser, à schématiser, à maintenir. Par contre, je trouve cela intéressant à la conception parce que la solution la plus facile (empiler les 30 dépendances dans le constructeur par paresse) n'est pas la plus intelligente. AUCUN objet ne peut avoir 30 dépendances... Sinon, il est clairement mal conçu (bon, je sais, vous saurez toujours me trouver le cas particulier mais dans le cas le plus général, pour la plus commune des applications, cela ne devrait pas arriver souvent).
- le middle ware (je suis pas sûre que ce soit le nom exact), soit le massif MVC, avec cumulés le gestionnaire de vues, le gestionnaire de route qui permet de traduire la requête en controleur / action, les gestionnaires de requêtes HTTP : requête et réponse, soit la version plus légère que j'ai lu rapidement, qui se passe de pas mal de blocs (par rapport à la version MVC) mais qui est tout à fait adapté pour des micro application, des sites web en une seule page, des API (voir PSR-7 si je ne me trompe pas)
- le gestionnaire d'événements, qui va vous permettre d'implémenter un pattern d'observateur : déclencher un événement, avoir des objets qui écoutent cet événement. La clé pour apporter encore plus de liberté et d'articulation à votre application.
- et finalement, même controversé, les frameworks offrent tous des modules pour gérer les formulaires : modéliser l'objet formulaire, gérer le rendu dans la vue, accéder à une librairie de filtres et de validateurs pour vérifier les données saisies par l'utilisateur. Il n'y qu'à se servir.

Non, définitivement, revenir en arrière. Tout refaire comme avant... je préfère regarder devant moi et embrasser les nouveaux concepts, découvrir de nouvelles architectures, de nouveaux patterns et expérimenter avec les nouveaux outils à disposition.

#### Un peu de lecture

(non exhaustif, c'est ce que j'ai trouvé de cool sur le moment :))

- <a href="http://www.brandonsavage.net/using-objects-doesnt-make-an-application-object-oriented/">Un petit reminder sur le fond de la programmation orientée objet</a>
- <a href="http://weierophinney.github.io/2015-10-20-PSR-7-and-Middleware/#/">Les slides de Matthew Weier O'Phinney sur la nécessité de PSR-7</a>
