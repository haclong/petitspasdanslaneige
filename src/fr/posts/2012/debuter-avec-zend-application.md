---
title: "Débuter avec Zend Application"
permalink: "fr/posts/debuter-avec-zend-application.html"
date: "2012-06-09T07:10"
slug: debuter-avec-zend-application
layout: post
drupal_uuid: fc7b811f-cf3f-4511-a720-68470f4892aa
drupal_nid: 9
lang: fr
author: haclong

media:
  path: /img/teaser/e5278cccdd3b6a084bc93def29692b40.jpg
  credit: "Garth Britzman"

tags:
  - "Zend Framework"
  - "web application"

sites:
  - "Développement"

summary: "Ce tutoriel, parmi d'autres à venir, pourrait sembler similaire à d'autres tutoriaux sur Zend Application. Il y a sur la toile beaucoup de tutoriaux enseignant comment construire une application avec Zend Application en utilisant Zend Tool (les tutoriaux incluant les instructions en ligne de commande). Zend Tool a son utilité mais si vous souhaitez personnaliser vos répertoires, vous ne pourrez pas utiliser Zend Tool aussi facilement."
---

Ce tutoriel, parmi d'autres à venir, pourrait sembler similaire à d'autres tutoriaux sur **Zend Application**. Il y a sur la toile beaucoup de tutoriaux enseignant comment construire une application avec **Zend Application** en utilisant **Zend Tool** (les tutoriaux incluant les instructions en ligne de commande). **Zend Tool** a son utilité mais si vous souhaitez personnaliser vos répertoires, vous ne pourrez pas utiliser **Zend Tool** aussi facilement.

J'utilise Zend Framework 1.11.

**Zend_Application** va nous permettre de construire une application web basée sur le modèle MVC. Cela signifie notamment que nous aurons à manipuler des Modèles, des Controleurs et des Vues. Mais commençons par le commencement : Comment débuter ?

Pour construire une application avec **Zend Application**, nous aurons besoin d'au moins 6 fichiers.

### Le fichier index

Comme pour beaucoup de sites web, tous commencent avec le fichier `index.php`. Pour notre application, ce sera la même chose.

Notre fichier `index.php` aura toujours les mêmes instructions :

- Définir les constantes
- Configurer l'include path
- Lancer **Zend Application**

#### Définir les constantes

Pour les instructions concernant la **définition des constantes**, nous aurons à définir _AU MOINS_ deux constantes : une pour le répertoire "application" et l'autre pour le niveau d'environnement.

On peut donner les noms qui nous plaise pour ces deux constantes. Les recommandations sont, bien sûr, que ces noms doivent être clairs et compréhensibles. Par exemple, dans ce tutorial, je ne peux pas non plus choisir un nom de type LE_NOM_QUE_VOUS_AUREZ_CHOISI_POUR_VOTRE_REPERTOIRE_APPLICATION alors on va dire que la première constante va s'appeler `APPLICATION_PATH` et que l'autre s'appellera `APPLICATION_ENV`. Cela ne brille pas par leur originalité, certes, mais cela a le mérite d'être clair.

```php
// Définir le chemin pour le répertoire application
defined('APPLICATION_PATH') || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/application')) ;

// Définir le niveau d'environnement
defined('APPLICATION_ENV') || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'development')) ;
```

##### APPLICATION_PATH - ce qu'il faut savoir

L'instruction est claire si vous êtes familier avec le PHP : vérifier que la constante `APPLICATION_PATH` est définie. Si non, la définir. Merci de vous reporter à la documentation PHP pour les fonctions suivantes : `<a href="http://php.net/manual/fr/function.define.php" target="_blank">define()</a>, <a href="http://fr2.php.net/manual/fr/function.realpath.php" target="_blank">realpath()</a>` and `<a href="http://fr2.php.net/manual/fr/function.dirname.php" target="_blank">dirname()</a>`.

Vous l'aurez sûrement compris, tous vos fichiers concernant votre application seront classés dans le répertoire `application/`. Les fichiers autres que PHP qui seront utilisés par le code HTML seront classés dans d'autres répertoires de votre choix. Le répertoire `application/` peut porter le nom que vous jugerez le plus pertinent. Il suffit juste de vous assurer que ce qui est défini dans la constante `APPLICATION_PATH` est le nom correct. De même, le répertoire peut être situé où vous le souhaitez dans votre système de fichiers. Là encore, il faudra juste vous assurer que dans la définition de l'`APPLICATION_PATH`, le chemin est correct. Comme vous pouvez le constater, ZF est un framework très flexible.

Le répertoire `application/`, et sa constante, va être un point de référence pour les autres parties du site.

##### APPLICATION_ENV - ce qu'il faut savoir

Là encore, les instructions sont vraiment faciles. Vérifier que la constante `APPLICATION_ENV` est définie. Si non, vérifier si l'information existe dans les tableaux `$_ENV` ou `$_SERVER` de PHP, sinon, assigner une chaîne par défaut (dans le cas présent : "dévelopment").

Cette information, ce niveau d'environnement, va nous permettre de basculer facilement d'un paramétrage à un autre (par exemple, des paramétrages de développement à des paramétrages de production). Comme depuis le début, le niveau d'environnement peut être nommé comme vous le souhaitez.

Pour compléter cette partie, vous pouvez en plus de ces deux constantes, créer d'autres constantes si vous le souhaitez. Pour ma part, par exemple, je crée une constante `TODAY` qui est une version formatée de la date courante. Ainsi, je peux insérer facilement cette valeur dans des noms de fichiers tels que les fichiers de logs par exemple.

#### Configurer l'include path

Pour définir l'include path, il faut a minima déclarer le chemin pour la librairie de Zend Framework.

```php
// s'assurer que le répertoire parent de la librairie Zend Framework est dans l'include path
set_include_path(implode(PATH_SEPARATOR, array(
  get_include_path(), 
  realpath(APPLICATION_PATH . '/../../libraries')
)));
```

Comme on peut le constater, vous pouvez créer votre répertoire `libraries/` où vous voulez. Vous pouvez le nommer comme vous le souhaitez. Il suffit d'ajouter son chemin dans la valeur de l'include_path. Utiliser la constante `APPLICATION_PATH` définie plus tôt pour vous assurer que tous les chemins seront toujours relatifs au même point d'origine. Bien entendu, ne pas oublier d'utiliser la constante que vous avez déclaré et le chemin qui est le votre.

IMPORTANT : Ne pas inclure le répertoire `Zend/`. L'include path doit contenir le répertoire parent du répertoire `Zend/`.

#### Lancer Zend Application

Et nous y voila.

Pour lancer le composant **Zend_Application**, vous aurez besoin de :

- inclure le fichier `Zend/Application.php`
- instancier l'objet
- le lancer

```php
// inclure le fichier Zend/Application.php
require_once 'Zend/Application.php' ;

// instancier l'objet
$application = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH . '/path/to/application.ini');

// le lancer
$application->bootstrap()
            ->run() ;
```

##### Inclure le fichier Zend/Application.php

Si on a correctement insérer le répertoire parent de `Zend/` dans l'include path, l'instruction `require_once()` devrait fonctionner correctement.

##### Instancier l'objet

Nous allons instancier un objet **Zend_Application**. Le constructeur de **Zend_Application** a besoin en premier argument la valeur de niveau d'environnement et en second argument, le chemin pour le fichier de configuration de l'application.

Dans plusieurs tutoriaux sur lesquels je suis tombée, le fichier de configuration de l'application est un fichier en .ini. Il semblerait qu'il soit également possible d'utiliser d'autres formats tels qu'un fichier XML par exemple. Comme **Zend_Application** utilise un objet **Zend_Config** pour parcourir le fichier de configuration et charger tous les paramètres, tous les formats acceptés par **Zend_Config** devrait donc fonctionner. Ainsi, si le format .ini ne vous convient pas, il suffit d'utiliser un autre format, du moment que **Zend_Config** l'accepte.

Encore une fois, ZF est vraiment flexible. Vous pouvez mettre votre fichier de configuration là où vous le jugerez le plus pertinent. Lorsque vous instancierez l'objet **Zend_Application**, il faudra juste vous assurer que vous utiliserez le bon chemin. De même, vous pouvez nommer le fichier de configuration comme vous le souhaitez. Veillez seulement à utiliser le nom de fichier correct.

##### Le lancer

Une fois que nous avons l'instance de l'objet **Zend_Application**, nous pouvons "bootstraper" l'instance (il suffit de faire `bootstrap`) et de le lancer (faire `run`). Chaque fois que je dis "bootstrap", je traduis par "initialiser"... Je ne sais pas si c'est exactement ce que fais un bootstrap mais comme ça, j'ai moins l'impression de parler schtroumpf.

Maintenant que nous avons fini avec le fichier `index.php`, nous allons nous occuper de nos autres fichiers.

### Le fichier .htaccess

Il faut définir quelques règles de réécriture (rewriting rules).

```php
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} -s [OR]
RewriteCond %{REQUEST_FILENAME} -l [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^.*$ - [NC,L]
RewriteRule ^.*$ index.php [NC,L]
```

C'est tout. Ne vous posez pas de question. Ca marche.

Qu'est ce que ça fait : comme pour tous les autres sites web, vous avez votre URL pour accéder à vos pages. Avec ces règles de réécriture, vous vous assurez que tous les liens de votre site passeront par le fichier `index.php` que nous venons tout juste de créer.

Que se passe-t-il alors ? La requête HTTP (le lien) va entrer dans le fichier `index.php`. Dans `index.php`, rappelez vous, nous avons instancié, bootstrappé et lancé **Zend Application**. **Zend Application** va donc parser la requête HTTP qui arrive et rerouter vers la page de l'application correspondante. Dit différemment : vous voici avec un lien sur une page, disons : <a href="http://mondomaine.com/blog/user/create">http://mondomaine.com/blog/user/create</a>. Bien entendu, il n'y a pas de fichiers à `~www/blog/user/create`. En fait, quand vous essayez d'accéder à cette page, vous passez par la page `index.php` de l'application. L'application est alors instanciée, bootstrappée, lancée, elle va parser la requête HTTP et va retourner une page qui est située dans un **module** *blog*, un **controller** *user* and une **action** *create* (c'est une route standard pour une application Zend). Nous verrons ces détails plus tard. Il faut juste se rappeler que nous avons besoin de ces règles de réécriture parce que toutes les requêtes DOIVENT passer par `index.php`.

### Le fichier bootstrap.php

Comme nous l'avons vu précédemment, l'application est instanciée et bootstrappée avant d'être lancée. Pour assurer son bootstrap(page), nous avons besoin d'un fichier `bootstrap.php`. Ce fichier `bootstrap.php` est dans le répertoire `application/` impérativement. Pour le coup, ici, nous ne pouvons prendre de liberté. Voici le contenu du fichier `bootstrap.php`.

```php
<?php
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
}
```

Encore une fois, fastoche.

En fait, dans plusieurs tutoriaux concernant ZF 1.8, le fichier `bootstrap` contient un grand volume d'instructions pour initialiser (bootstrap) plusieurs ressources nécessaire pour une application web. Dans la version ZF 1.11, la plupart de ces instructions ne sont plus nécessaires. En fonction du paramétrage dans le fichier de configuration, les ressources sont initialisées en arrière plan. Plus besoin de tout réécrire dans le fichier `bootstrap`.

Le seul problème que j'ai rencontré (suite à un manque d'expérience), c'est de savoir ce qui est - et ce qui n'est pas - bootstrappé. Puisque tout se fait en arrière plan, comment savoir si c'est fait ? Mais pas d'inquiétudes, les ressources principales fonctionnent donc c'est plus que bien pour un début.

Puisque le fichier `bootstrap.php` est vide, peut-on s'en passer ? Bien sûr que non. Tout d'abord, **Zend_Application** va avoir besoin de la présence de ce fichier. Même vide. Je parie que toutes les instructions d'initialisation faites en arrière plan sont dans l'objet **Zend_Application_Bootstrap_Bootstrap** en fait. Donc, finalement, le fichier qui paraît vide n'est peut-être pas si vide finalement. Dans un second temps, si vous avez besoin de personnaliser votre séquence de bootstrap et d'ajouter plus de ressources, vous aurez de toutes façons besoin de ce fichier.

### Le fichier de configuration

Je vais passer rapidement sur le format attendu par **Zend_Config** dans le fichier de configuration .ini.

Le fichier de configuration va être partitionné par séquence ou bloc. Chaque séquence est introduite par un nom qui s'affiche entre crochets. Une séquence va hériter des paramétrages d'une autre séquence en utilisant les deux points (:). Concernant le nom des séquences, encore une fois, c'est à votre libre arbitre.

```sh
[bootstrap]
; les paramétrages vont ici

[production : bootstrap]
; la séquence "production" hérite de la séquence "bootstrap"
; les paramétrages qui ne figurent pas dans la séquence "bootstrap" s'insèrent ici
; les paramétrages qui figurent dans la séquence "bootstrap" mais qui doivent être adaptés pour un environnement de production doivent aller ici. Ils surchargeront les paramétrages de la séquence "bootstrap".
; les paramétrages identiques à la séquence "bootstrap" n'ont pas à être réécrits ici.

[development : production]
; la séquence "development" hérite de la séquence "production" (qui elle même, hérite de la séquence "bootstrap")
```

Dans le cas présent, on a créé trois niveaux d'environnement (*development*, *production*, *bootstrap*).

Vous vous rappelez très certainement de la constante `APPLICATION_ENV` que nous avons défini plus tôt (dans le fichier `index.php`) ?. La valeur attendue pour `APPLICATION_ENV` est un des niveaux d'environnement défini dans le fichier de configuration.

Vous vous rappelez comment nous avons instancié un objet **Zend_Application** ? Nous avons passé la valeur du niveau d'environnement en premier argument et le chemin du fichier de configuration en second argument. Ainsi, **Zend Application** va ouvrir le fichier de configuration, il va le parser et charger les paramétrages attendus pour la séquence déclarée.

##### Initialiser la ressource FrontController

Maintenant que notre application accède à son fichier de configuration et sait ce quelle doit lire, nous devons initialiser le **FrontController**. Dans notre application, nous aurons accès à plusieurs controllers mais il n'y aura toujours qu'un seul **FrontController** qui fera tout le boulot. Bon, c'est un affreux raccourci mais l'essentiel est là.

```sh
resources.frontController.controllerDirectory = APPLICATION_PATH "/controllers"
```

Pour initialiser le **FrontController**, tout ce qu'il y a à faire est de dire à l'application où vont se trouver les fichiers controllers. La plupart du temps, on les mettra dans le fichier `controllers/`.

### Le fichier Controller

Maintenant que nous avons en place le **FrontController**, il faut pouvoir le tester. Nous allons donc créer notre premier controleur. Il existe deux noms réservés pour les controleurs : *"Index"* et *"Error"*. Au delà de ceux là, il est possible de donner le nom que l'on veut à ses propres controleurs. ATTENTION : *Index* et *Error* sont des noms réservés mais ils n'existent pas au lancement de l'application. Il est impératif de les créer.

Rappelons nous des règles de réécriture et de cette histoire de requête HTTP. La requête HTTP utilisée pour l'exemple comportait le nom d'un module, le nom d'un controller et le nom d'une action. Mais comment faire pour une requête HTTP qui ne comprend aucun de ces éléments ? Il faut savoir qu'alors, le **FrontController** va utiliser des noms par défaut : le nom par défaut du module est "*default*", le nom par défaut du controleur est "*index*" et le nom par défaut de l'action est "*index*" également.

Concernant le controleur **Error**, celui ci est réservé pour gérer les erreurs mais nous verrons cela plus tard.

Nous allons pour le moment créer le controleur **Index**. Une fois qu'on a choisi le nom de notre controleur, le nom de fichier sera (et cela est obligatoire) le nom du controleur (première lettre en majuscule) juste accolé au mot clé Controller (première lettre majuscule également). Ainsi, le nom de fichier du controleur **index** sera `IndexController.php`.

```php
<?php
class IndexController extends Zend_Controller_Action
{
  public function indexAction()
  {
    $this->view->title = "Hello World" ;
  }
}
```

Je ne vais pas expliquer comment ça marche ici parce que le présent post est déjà long. Je ferais cela dans un prochain billet. Restez dans le coin :p

Tout ce qu'il faut savoir pour le moment :

Les objets **Controller** (controleur) héritent de **Zend_Controller_Action**

Les objets **Controller** (controleur) ont une ou plusieurs méthodes `quelquechoseAction()`

Les résultats des méthodes `quelquechoseAction()`, ce qu'elles retournent etc, toutes ces informations qui doivent être affichées à l'écran vont être envoyée à un élément **View**. Pour cela, le controleur a une propriété `$view` qui est lui même un objet avec une liste non exhaustive de propriétés. Ainsi, vous pouvez ajoutez autant de propriétés que vous souhaitez à l'objet `$view` tel que `$variable1`, `$variable2`, `$tableau[]` etc... Dans votre controleur, tous ce que vous aurez à faire, c'est d'assigner les valeurs à ces nouvelles propriétés :

```php
$this->view->variable1 = "la première variable que je vais envoyer à l'élément view" ;
$this->view->variable2 = "la seconde variable que je vais envoyer à l'élément view" ;
$this->view->tableau[] = "premier élément de tableau que je vais envoyer à l'élément view" ;
$this->view->tableau[] = "second élément de tableau que je vais envoyer à l'élément view" ;
```

### Le fichier View

Finalement, créons notre fichier vue. Je vais le faire vite et succint et nous nous repencherons sur les principes Controleurs / Vues plus tard.

Par défaut, chaque `quelquechoseAction()` va avoir besoin d'un fichier vue `quelquechose.phtml`.

Voici comment ça fonctionne :

Toutes les vues vont être dans un répertoire `views/scripts/`. Voici une autre des rares contraintes de ZF :

- le répertoire `views/` **doit être** au même niveau que le répertoire `controllers/`. Je pense qu'il est possible de modifier cette contrainte en modifiant les initialisations au moment du bootstrap mais est-ce qu'on souhaite _VRAIMENT_ faire ça ?
- le sous-répertoire `scripts/` sous `views/` est **obligatoire**
- dans le répertoire `views/scripts/`, il faut créer autant de répertoires que vous avez de controleurs. `controllers/IndexController` pointera sur un chemin de type `views/scripts/index` alors que `controllers/ErrorController` pointera sur `views/scripts/error`.
- dans chacun des répertoires `views/scripts/{nom_de_controleur}`, il faut créer autant de fichier .phtml que vous avez d'actions. `IndexController->indexAction` pointera sur ce fichier : `views/scripts/index/index.phtml` quand une action de type `IndexController->loginAction` pointera sur le fichier `views/scripts/index/login.phtml`.

Contentez vous de créer vos controleurs d'un côté, avec les actions et vos fichiers phtml de l'autre côté. **Zend_Application** fera le reste du boulot du moment que votre système de fichier est convenablement monté.

Dans votre fichier controleur, vous avez créé stockés différentes informations dans les propriétés de `$view` : `$this->view->{propriétés}`.

Vous pouvez maintenant récupérer toutes ces informations dans le fichier .phtml. Ainsi, `$this->view->{propriété}` devient `$this->{propriété}` dans votre fichier .phtml.

```php
// echo la propriété variable1
echo $this->variable1 ;

//résultats à l'écran : la première variable que je vais envoyer à l'élément view

// echo la propriété variable2
echo $this->variable2 ;

//résultats à l'écran : la seconde variable que je vais envoyer à l'élément view

// echo la propriété tableau
foreach($this->tableau as $rows)
{
  echo $rows . '<br>' ;
}

//résultats à l'écran : 
//premier élément de tableau que je vais envoyer à l'élément view
//second élément de tableau que je vais envoyer à l'élément view
```

C'est tout.

### Le système de fichiers

Finalement, voici l'arborescence du système de fichier comme il a été exposé dans ce tutoriel. J'espère que ça va vous aider.

```
libraries/
  Zend/
    Application.php
www/
  index.php
  .htaccess
  application/
    bootstrap.php
    conf/
      application.ini
      controllers/
        IndexController.php
      views/
        scripts/
          index/
            index.phtml
```

J'ai fait de mon mieux pour vous expliquer les choses telles que je les comprends. Toutefois, je suis également en apprentissage sur l'outil, alors excusez moi si ce que je dis n'est pas bon et je vous en prie, merci de m'éclairer avec vos explications. Je souhaite en apprendre plus sur ce framework. Surtout, évitez d'être TROP technique. Je ne parle, hélas, que l'humain.

Restez branché pour d'autres tutoriaux. Celui ci ne fait qu'introduire les choses et je sais bien qu'on n'ira pas bien loin qu'avec ces infos.
