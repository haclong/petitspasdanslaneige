---
title: "Tâtons du Symfony 3"
permalink: "fr/posts/tatons-du-symfony-3.html"
date: "2016-08-29T17:03"
slug: tatons-du-symfony-3
layout: post
drupal_uuid: a9eca619-0412-4741-9eef-dbd77a2b335f
drupal_nid: 150
lang: fr
author: haclong

media:
  path: /img/teaser/hi_tech.jpg

tags:
  - "symfony"
  - "Zend Framework"
  - "code"

sites:
  - "Développement"

summary: "Avec le lancement de Symfony 3, et dans ma démarche continue de m'améliorer, j'ai décidé de réaliser un nouveau projet. J'ai laissé Zend Framework de côté pour une fois, la communauté de celui ci étant en pleine ébullition avec le déploiement prochain de Zend Framework 3. Le nouveau projet sera, cette fois ci, développé avec le framework Symfony."
---

Avec le lancement de Symfony 3, et dans ma démarche continue de m'améliorer, j'ai décidé de réaliser un nouveau projet. J'ai laissé Zend Framework de côté pour une fois, la communauté de celui ci étant en pleine ébullition avec le déploiement prochain de Zend Framework 3. Le nouveau projet sera, cette fois ci, développé avec le framework Symfony*.

## Installation

L'installation de Symfony s'est passé sans encombre. Il faut se rendre directement sur la documentation de Symfony et lancer la <a href="http://symfony.com/doc/current/setup.html#creating-symfony-applications-with-composer">création du projet avec **composer**</a>. Les *bundles* et les *composants* qui vont bien s'installent tous sans problème.

## L'exécution

Il y a deux trois petites choses qui ne sont pas claires à ce niveau là avec Symfony :

- Symfony distingue un *front controller de prod* et un *front controller de dev*. Il y a quelque chose dans le code qui SAIT qu'on est en *dev*. Je n'ai pas encore trouvé à quel endroit/moment on pouvait changer ça. Il y a cependant une ligne de commande qui fait ça correctement lorsqu'on utilise la console. En tout cas, lorsque je lis la <a href="http://symfony.com/doc/current/deployment.html">documentation concernant la mise en prod d'une application Symfony</a>, cela me paraît bien compliqué !
- Symfony recommande de lancer le <a href="http://php.net/manual/fr/features.commandline.webserver.php">serveur PHP interne</a>. En suivant les <a href="http://symfony.com/doc/current/setup.html#running-the-symfony-application">instructions de Symfony à ce sujet</a>, l'application se lance sans problème. On trouve également une <a href="http://symfony.com/doc/current/setup/web_server_configuration.html">documentation pour configurer un véritable serveur web</a> (apache) mais si les instructions me semblent familières parce que mes autres projets y ressemblent, je n'ai jamais réussi à le faire avec un projet Symfony... Tout ce que j'y ai gagné à essayer, c'est de réinstaller Symfony parce qu'avec mes manipulations répétées, j'avais perdu les permissions initiales et même avec le serveur interne, l'application ne fonctionnait plus... Grosse déception de ce côté là. Je réessaierais plus tard. J'ai décidé que pour une fois, je n'allais pas m'arrêter pour ce problème qui, somme toute, n'est pas si important.

## Le projet

Il y a quelques temps déjà, j'ai développé un solveur de sudoku. Même si ce projet - à l'époque - m'a laissé assez satisfaite de moi-même, il restait des points irrésolus qui ont fini par m'empêcher de tourner en rond :p... j'exagère à peine.

- la résolution de la grille est très longue et on ne peut pas voir sa progression pendant que le solveur la résoud. Le nouvel objectif est que la grille se remplisse au fur et à mesure que les cases se remplissent.
- impossible de rajouter de nouvelles grilles dans la librairie des grilles disponibles.
- impossible à un humain de jouer à la grille... je m'étais arrêté à la fonctionnalité "résouds-moi".
- le moteur de résolution était tout sauf efficace. Rendez vous compte : on lisait toute la grille une première fois et en fonction des chiffres qui étaient placés, on mettait à jour les chiffres possibles des autres cases. Puis on relisait toute la grille une seconde fois et on remettait à jour les chiffres possibles dans les autres cases puisqu'il y avait fatalement des chiffres qui ont été placés à la 1ere lecture. Ainsi de suite. C'était une résolution en itératif qui parcourait l'intégralité de la grille à chaque fois. C'était forcément long puisque toutes les cases étaient examinées à chaque fois. Le nouvel objectif est de concevoir un moteur plus rapide, pas linéaire.

Le nouveau projet comprend donc :

- le solveur de sudoku (reprendre l'ancien en l'améliorant, parce que de ce côté aussi, lorsque je regarde la tête de mes objets, au secours :p)
- un peu de front (pour rafraichir la grille au fur et à mesure qu'elle se remplit)
- de la gestion d'événement (pour un solveur moins linéaire mais réactif aux actions qui se produisent sur la grille)

## Le framework

Comme j'ai pas mal travaillé avec Zend Framework maintenant, je remarque mieux les différences avec Symfony.

Par rapport à Zend Framework qui est un framework très verbeux, développer avec Symfony est plus rapide. Par ex, même s'il est possible de définir ses routes dans un fichier de configuration, comme pour ZF, Symfony permet également de définir ses routes directement à l'aide d'annotations dans les controllers.

De même, lorsque la route admet des paramètres, pour Zend Framework, on définit les paramètres dans les routes (en config) alors que Symfony fait apparaître les paramètres comme des arguments de la méthode *Action(). Personnellement, à la lecture, c'est plus clair.

Philosophiquement, Symfony encourage à développer <a href="https://symfony.com/doc/current/best_practices/creating-the-project.html#application-bundles">toute son application dans un seul *bundle*</a>, en expliquant que la finalité du *Bundle*, c'est d'être une brique réutilisable et que cela n'a pas de sens de scinder une application en plusieurs *bundle* puisqu'aucun de vos *bundles* applicatifs ne peut fonctionner sans les autres que vous aurez développés tous ensemble dans l'objectif de créer votre application. Chez Zend Framework (la dernière fois que j'ai regardé), un *module* est une entité fonctionnelle distincte et une application est forcément constituée de plusieurs *modules*.

Après, le choix final revient à celui qui est au commande. Subdiviser son application en plusieurs composants ou ne conserver qu'un seul composant n'est qu'une question de préférence. Personnellement, j'opte pour la subdivision. Après, l'enjeu est de maintenir une cohérence dans la division. Par ex, si on doit migrer notre application, il faudrait pouvoir le faire par module distinct. Si on se retrouve à migrer 5 modules en une fois, on peut se dire qu'on a échoué lorsqu'on a mis en place nos modules.

Concernant le *gestionnaire de service*, que Symfony appelle *container*, ici aussi, les deux framework diffèrent dans leur manière d'aborder le sujet. Zend Framework explique que pour mieux gérer les problématiques d'injection de dépendance, tous les objets peuvent être déclarés dans le gestionnaire de service alors que pour Symfony, on distingue les entités des services et que si <a href="https://symfony.com/doc/current/service_container.html">les services doivent être déclarés dans le *container*, les entités n'ont pas forcément à y être</a>.

Là encore, ce qui est bien avec les framework, le choix final revient encore au développeur.

Concernant le *design pattern Observer* enfin, implémenté en *Event Manager* chez Zend Framework et en *Event Dispatcher* chez Symfony, Symfony distingue les *listeners* et les *subscribers* alors que Zend Framework - si je me souviens bien - n'implémente que le modèle *Subscriber*. Mais je m'aventure dans une zone très pointue et je sens que je dis des bêtises :)

Pour le *dispatcher* de Symfony, c'est forcément un objet *Event* qui doit être déclenché. Il me semble que pour Zend Framework, soit il y a un objet, soit le framework construit un objet par défaut.

Enfin, à propos des différents composants proposés par les deux frameworks :

On l'avait déjà noté, Zend Framework et Symfony proposent tous les deux un composant de cache. Or, lorsqu'on se penche sur le sujet, les deux solutions ne parlent pas du même cache. Chez Symfony, son composant **Http Cache** concerne seulement le <a href="https://fr.wikipedia.org/wiki/Cache_web">cache web</a> alors que chez Zend Framework, on parle plutôt d'<a href="https://fr.wikipedia.org/wiki/M%C3%A9moire_cache#Gestion_d.27un_cache_au_niveau_logiciel">une mémoire cache</a>. Chez Symfony, il faut utiliser le composant `Doctrine\Common\Cache\ApcCache` de **Doctrine** pour accéder à des fonctionnalités de mémoire cache.

Du côté des *vues*, Symfony implémente <a href="http://symfony.com/doc/current/templating.html">**Twig**</a> et Zend Framework implémente <a href="https://framework.zend.com/manual/2.4/en/modules/zend.view.renderer.php-renderer.html">**PHPRenderer**</a>.

Si Zend Framework gère ses fichiers vues dans un répertoire du module, pour Symfony par défaut, les fichiers sont dans un emplacement hors des *Bundles* (/app). Je suis sûre qu'on peut le faire autrement mais ce répertoire où j'ai trouvé les vues par défaut est intrigant. En revanche, Symphony gère ce qu'il appelle les "assets" grâce à la console. Les *assets* (les fichiers .js, .css et les images) sont déposés dans un chemin particulier de votre bundle. Avec une petite commande dans la console, un lien symbolique est créé dans le répertoire web et permet d'accéder facilement aux fichiers. Zend Framework (la dernière fois que j'ai regardé), n'offrait pas ce type de facilités et les fichiers étaient dans le répertoire web.

Ainsi, ironiquement, si on doit déplacer son bundle/son module, avec Zend Framework, il faut penser à déplacer les fichiers (js, images, css) alors qu'avec Symfony, il faut penser à déplacer les vues.

Je suis sûre que pour résoudre ce dernier point, il ne faut pas grand chose. Mais je trouvais fun de le signaler :p.

### Last but not least

Gros plus pour Symfony pour le coup : grâce à des commandes en console, on peut trouver facilement tous les services qui sont enregistrés dans le container, de la même façon qu'on peut retrouver également tous les événements pour lesquels il y a au moins un listener. Mine de rien, ça aide, surtout quand on voit la liste des services qui sont chargés dans le container.

Voilà. Pour un projet très concis, c'est tout ce que j'ai noté entre Symfony et Zend Framework.

### Les plus de Symfony

- J'ai l'impression que je code plus vite, moins de fichiers de configuration à préparer. En revanche, je compare une appli très complexe que je fais en ZF alors que le solveur ne demande pas autant de complexité dans les routes
- Liste des services accessible facilement pour peu que je retrouve la commande qui va bien
- Les *assets* qui sont regroupés dans le *bundle* et qui peuvent donc être déplacé en même temps que le *bundle* qui les utilise
- Symfony embarque plein d'autres modules dont **PHPUnit** préconfiguré comme il faut pour fonctionner avec le bundle **AppBundle** qui s'installe par défaut.

### Les moins de Symfony

- Impossible de développer avec Apache. Le serveur interne est un passage obligé dont je me passerais bien.
- Symfony embarque plein d'autres modules dont **Monolog** et **Doctrine** dont on n'a pas toujours besoin. Comme ce sont des composants de fournisseur tiers, pourquoi ne pas laisser le développeur faire son choix ?
- Il y a toujours des relents de magie avec des décisions qui sont prises par l'application à mon insu. Je suis hantée par ce choix du `app_dev.php` plutôt que du `app.php` et aucune manipulation, lien symbolique ou renommage n'y change rien à part dégrader l'application.

Je reviendrais vous parler plus en détail de cette nouvelle version de solveur, développé grâce aux composants de Symfony cette fois ci.

* *faut se remettre dans le contexte au moment où j'ai pris ma décision... depuis, ZF3 est sorti et j'ai trop hâte :)*
