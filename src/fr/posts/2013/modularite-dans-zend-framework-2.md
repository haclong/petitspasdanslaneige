---
title: "Modularité dans Zend Framework 2"
permalink: "fr/posts/modularite-dans-zend-framework-2.html"
date: "2013-06-14T16:51"
slug: modularite-dans-zend-framework-2
layout: post
drupal_uuid: 75e0f55a-2020-445a-a7d4-86d062e7a8b6
drupal_nid: 39
lang: fr
author: haclong

media:
  path: /img/teaser/jeu_de_contruction.jpg

tags:
  - "zend framework 2"
  - "Modules"
  - "Service Manager"

sites:
  - "Développement"

summary: "Alors que j'étais en train de développer une application avec Zend Framework 1, j'ai fini par tout reprendre à zéro en changeant de framework. Je ne suis pas allée chercher ma nouvelle librairie très loin puisque mon choix s'est porté sur Zend Framework 2. J'étais toutefois assez anxieuse de cette modification parce que j'ai eu un peu de mal pendant la période d'apprentissage du premier Zend Framework. J'ai pensé que je n'avais peut être pas la patience de tout réapprendre... Et c'est à ce moment là que je découvre le module dans Zend Framework 2."
---

Alors que j'étais en train de développer une application avec Zend Framework 1, j'ai fini par tout reprendre à zéro en changeant de framework. Je ne suis pas allée chercher ma nouvelle librairie très loin puisque mon choix s'est porté sur Zend Framework 2. J'étais toutefois assez anxieuse de cette modification parce que j'ai eu un peu de mal pendant la période d'apprentissage du premier Zend Framework. J'ai pensé que je n'avais peut être pas la patience de tout réapprendre... Et c'est à ce moment là que je découvre le module dans Zend Framework 2.

Comme chacun sait désormais, le module dans Zend Framework 2 n'a absolument plus rien à voir avec le module de Zend Framework 1. En fait, il est si différent qu'après plusieurs jours de recherches, je n'avais toujours pas une idée claire sur la façon de gérer mes propres modules. J'avais surtout beaucoup de mal à faire coincider le système de module de Zend Framework 2 avec le modèle de données initial que j'avais adopté pour mon application. Et puis, parfois, la pratique reste quand même le meilleur moyen de saisir un concept. Du coup, je décide de me lancer finalement.

Au fur et à mesure qu'avancent mes développements, je comprends enfin ce que l'équipe de développement de Zend Framework 2 s'est fixé comme objectifs pour le système de module du framework. En me basant sur les principes qui caractérisent le développement par l'objet, voici les conclusions auxquelles j'arrive :

### Indépendance du module

Les modules doivent être (autant que possible) indépendant les uns des autres.

Cela signifie notamment

- qu'on peut facilement remplacer un module par un autre sans avoir à réécrire toute l'application.
- qu'on peut supprimer totalement un module sans interférence avec les autres modules.
- qu'on peut ajouter un module sans avoir à réécrire dans les autres modules.

Pour y arriver, notamment, j'ai découvert que moins on instanciait d'objets dans le code du modèle, mieux on se portait.

Toutes les déclarations `new Class()` doivent se faire dans la classe `Module`, au niveau du **Service Manager** et si nos classes ont besoin d'un objet ou d'un autre, il valait mieux l'injecter avec un `setLaClasseDontJaiBesoin($laClasseDontJaiBesoin)` plutôt qu'avec une instruction `new`. Je me réserve la possibilité de revenir sur cette conclusion mais pour le moment, ça fonctionne bien.

### Module monomaniaque

Les modules sont centrés sur un sujet. C'est par ailleurs mon principe favori parce qu'il est extrêmement utile pour découper mon application en modules.

Poussé à l'extrême, cela veut dire que chaque module n'est responsable que d'une seule tâche. Je sais ainsi que si un de mes modules doit faire deux choses en même temps, c'est qu'il faut que je crée un second module.

Dans la pratique, j'ai à ce jour :

- un module pour gérer les identifications des utilisateurs : il contient au moins un contrôleur, plusieurs vues, un formulaire de login, un formulaire de perte de mot de passe et le but, c'est de voir si l'utilisateur est connu ou pas dans la base de données.
- un module pour logger les messages : il ne contient ni contrôleur, ni vue, il se contente de paramétrer une instance de `Zend\Log\Log` avec les writers qui vont bien et quand il s'agit d'écrire quelquechose dans la (ou les) logs, il fait la distribution comme il faut.
- un module pour gérer les envois de mail : pas de contrôleur ni de vue pour celui ci non plus. Il se contente d'envoyer un mail et d'historiser l'envoi du mail dans la base de données.

A venir : mon prochain module va se charger de gérer les autorisations des utilisateurs. Parce que si mon module identifie les utilisateurs, il ne s'occupe pas de savoir si tel ou tel utilisateur est autorisé à accéder à telles ou telles ressources...

Cela génère beaucoup de modules mais en même temps, de mon point de vue, c'est rassurant parce que cela subdivise le projet en petits lots plus facile à gérer. En plus, on voit mieux l'avancée du projet parce qu'une fois que le développement d'un module est fini, on n'a pas à revenir dessus en principe et on peut passer à la suite.

En plus, si on garde à l'esprit le principe d'indépendance des modules, certains des modules qui ont déjà été développés peuvent être réutilisés dans d'autres applications futures : la gestion du cache, la gestion des logs, le mailer par exemple sont des modules qui peuvent facilement être réutilisés d'une application à l'autre.

### Interaction des modules

Les modules ne doivent pas être (et ne peuvent pas) être isolés les uns des autres. Pour cela, il existe plusieurs moyens de faire communiquer des modules ensemble :

### Grâce au Service Manager

Le principe est que chaque module met à disposition de l'application un certain nombre de services. Les modules sont indépendants les uns des autres mais c'est comme aller poster son courrier. Le module "La Poste" met à votre disposition deux services : le "guichet" et "la boite jaune". Si vous désirez poster un courrier, vous pouvez utiliser un de ces deux services. Du moment que vous utilisez le service "guichet" avec une adresse destinataire et une lettre, le module "La Poste" se charge d'acheminer votre courrier à votre destinataire.

Vous pouvez coder un module "La Poste" qui se chargera d'acheminer un message vers un destinataire. A l'intérieur de votre module "La Poste", vous n'aurez qu'à gérer le formattage et les protocoles par exemple.

Et vous pourrez coder un autre module "Utilisateur" qui sera amené à écrire des messages et qui souhaitera les envoyer à un destinataire. Du coup, votre module "Utilisateur" se chargera d'écrire le message, d'identifier à qui il doit envoyer le message et il fera appel à votre module "La Poste" pour que votre module "La Poste" se charge d'envoyer le message qu'il a préparé.

Voyons ce que ça peut donner :

#### Le module Mailer

Un module **Mailer** met à disposition de l'application deux services : **MailFormatter** et **MailSender**. Le service **MailFormatter** s'appliquera à mettre un message au bon format en composant avec l'adresse du destinataire (`addTo()`) et un corps de mail (`setBody()`). Le service **MailSender** prendra le message pour l'envoyer.

```php
//Module.php

class Module
{
  public function getServiceConfig()
  {
    return array(
      'factories' => array(
        'MailFormatter' => function($sm) {
          $mail = new Zend\Mail\Message() ;
          $mail->setEncoding('UTF-8') ;
          $mail->setFrom('adresse@dusite.com', 'Mon site') ; // coordonnées et nom du sender
          
          return $mail ;
        },

        'MailSender' => function($sm) {
          $sender = new Zend\Mail\Transport\Sendmail() ;
 
          return $sender ;
        }
      ),
    );
  }
}
```

#### Le module Contact

Un module **Contact** peut être composé d'un contrôleur et d'une vue avec un formulaire de contact. Le module **Contact** va se charger de valider le formulaire, notamment la gestion du captcha et le format des adresses mails. Une fois que le formulaire est valide, le module **Contact** va faire appel aux deux services du module **Mailer** pour envoyer le message.

```php
// src/Contact/Controller/IndexController.php

class IndexController extends AbstractActionController
{
  public function sendAction()
  {
    // le formulaire est posté, validé
    // on va récupérer, grâce au service manager, le service MailFormatter que le module Mailer a mis à notre disposition. 
    // il n'est nul besoin de dire que c'est le module Mailer. 
    // Normalement, votre application ne doit avoir qu'un et un seul service MailFormatter 
    // au milieu de tous les services mis à disposition par tous les modules.
    $mailer = $this->getServiceLocator()->get('MailFormatter') ; 
    $mailer->addTo('destinataire@mail.com') ;
    $mailer->setSubject('Sujet du mail') ;
    $mailer->setBody('voici mon message') ;
    // maintenant, on va récupérer le service MailSender que le module Mailer a mis à notre disposition.
    $transport = $this->getServiceLocator()->get('MailSender') ;
    $transport->send($mailer) ;
  }
}
```

Et voila comment, grâce au **Service Manager**, un module peut utiliser les services mis à dispositions par un autre module.

En plus du **Service Manager**, il est également possible d'utiliser d'autres composants pour que deux modules interagissent ensemble.

- Il y a le composant **DI** (qui permet de gérer les injections de dépendances.) Je ne sais pas l'utiliser pour le moment, je ne saurais vous le présenter.
- Il y a le **gestionnaire d'événements** qui se base sur des listeners qui exécutent une tâche dès qu'un événement survient. Je reparlerais de ce point plus tard.
- Il y a peut être d'autres composants mais je ne les connais pas encore.

Gardez à l'esprit que

- les modules doivent être indépendants
- les modules ne s'occupent que d'une seule tâche

Dans certains cas, il restera à vous demander quelle est la manière la plus judicieuse pour les faire interagir les uns avec les autres. Et les outils que le framework met à notre disposition me semblent pour le moment assez riches et intéressants pour nous permettre de réaliser nos défis de développeur.

Je rencontre quelques questions sur StackOverflow sur la meilleure façon de gérer les modules. J'espère que ma façon de voir ça pourra vous aider à réaliser vos projets.
