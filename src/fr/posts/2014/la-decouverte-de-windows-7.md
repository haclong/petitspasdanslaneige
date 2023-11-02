---
title: "A la découverte de Windows 7"
permalink: "fr/posts/la-decouverte-de-windows-7.html"
date: "2014-10-03T16:53"
slug: la-decouverte-de-windows-7
layout: post
drupal_uuid: a746c3f9-4274-4000-be2a-ceded0bcadd7
drupal_nid: 93
lang: fr
author: haclong

media:
  path: /img/teaser/windows7logo1.png
  credit: "Microsoft"

tags:
  - "microsoft windows"
  - "migration"

sites:
  - "Footprints in the snow"

summary: "Eh beh vala, c’est fait. Je viens de changer de tour (ordinateur) et celle ci tourne avec un Windows 7. (et oui, ceux qui suivent ont déjà entendu parler d’Ubuntu, mais ça, c’est mon autre machine)... Et la prise en main est RUDE…"
---

Eh beh vala, c’est fait. Je viens de changer de tour (ordinateur) et celle ci tourne avec un Windows 7. (et oui, ceux qui suivent ont déjà entendu parler d’Ubuntu, mais ça, c’est mon autre machine)... Et la prise en main est RUDE…

### La taille des icônes

Windows 7, c’est whoooa… c’est le design Aqua 15 ans après… C’est clair, aéré, aérien…

Tellement aéré en fait que j’en perds mon latin.

Les icones, de **_base_** sont énormes… Je sais que je suis myope, mais là, c’est me faire insulte. En même temps, je conçois qu’avec l’avènement des terminaux tactiles, il vaut mieux des grosses icônes sur lesquelles on puisse écraser son gros doigt… Je conçois et je respecte. Pour ma part, j’ai direct réduit tout ça a des dimensions plus “souris” pour mon usage quotidien.

- Dans *la barre des tâches en cliquant droit > Barre des tâches > Utiliser de petites icônes*
- Sur *le bureau en cliquant droit > Affichage > Petites icônes*

### La barre des tâches

La barre des tâches, vaste sujet. On a la possibilité d’épingler sur la barre des tâches les applications qu’on utilise le plus souvent. Mais j’ai du mal à m’habituer au comportement de ces boutons :

- Quand l’application n’a pas été lancée, cliquer dessus lance l’application.
- Quand l’application a été lancée, cliquer dessus remet l’instance lancée précédemment en premier plan.

Sachez qu’il faut cliquer au milieu pour lancer une seconde instance de l’application.

Sinon, il faut s’habituer à cliquer droit sur l’icône et ouvrir une nouvelle instance dans le menu contextuel qui s’ouvre.

### Regrouper les instances.

Windows 7 regroupe les instances d’une même application. Ainsi, même si vous avez trois navigateurs ouverts, il n’y a qu’une seule icône dans la barre des tâches. Très bon point quand on a un écran minuscule. Moins bon quand on a été habitué à avoir une icône par instance. Windows 7 permet de dégrouper les instances. Toutefois, même en les dégroupant, elles restent collées ensemble dans la même zone de la barre des tâches. Si vous avez besoin d’ouvrir plusieurs fenêtres différentes parce que vous devez aborder plusieurs sujets en même temps dans une même journée, les icônes des dernières instances ouvertes vont se ranger par application et non pas par ordre chronologique d’ouverture. Ce qui peut s’avérer être très déstabilisant : en fin de journée, vous lancez - encore une fois - un nouvel Explorateur Windows. Ce ne sera que votre cinquième ouvert dans la journée. Ca arrive, ne me demandez pas pourquoi. Après avoir changé une ou deux fois d’applications, vous voulez revenir vers cet explorateur. Le dernier. Celui que vous avez ouvert pile au répertoire qui vous intéresse. Et là, vous devenez fou parce que sur les 5 explorateurs ouverts, vous devrez cliquer 5 fois pour le retrouver. A chaque fois. Parce qu’à chaque fois, la barre des tâches va vous remélanger l’ordre des explorateurs ouverts et vous ne saurez déjà plus où vous en êtes. Si plusieurs navigateurs offrent des miniatures aisément identifiables (merci au design du site), on ne peut pas dire la même chose pour un explorateur Windows. Y’a rien qui ressemble à une liste de fichiers qu’une autre liste de fichiers. Et dans le cadre de structure de répertoire pour du développement, l’arborescence de chaque projet se ressemble. Du coup, entre deux explorateurs ouverts chacun sur un projet différent, on a vite fait de confondre de répertoires.

J’ai trouvé un petit soft pour hacker le fonctionnement normal de la barre des tâches de Windows 7 : <a href="http://rammichael.com/7-taskbar-tweaker" target="_blank">7+ Taskbar Tweaker</a>. Le fonctionnement est plutôt conforme à ce que j’attends de cette barre.

Toutefois, pour être honnête, Ubuntu a le même comportement que la barre des tâches originale de Windows 7. Du coup, je me dis que je devrais tenter le comportement de la barre des tâches tels que conçu par les équipes de Windows 7… Ca a sûrement un sens et je vais bien finir par m'y habituer...

### Nom de fichiers trop long

Un petit bug que je ne m’explique pas avec Windows 7. Ma tour précédente était en Windows XP. Comme toute bonne migration, j’ai copié les fichiers de mon ancien disque dur vers mon nouveau disque dur. Durant la copie, l’Explorateur Windows m’a signalé que le nom du fichier était trop long. Par nom de fichier, il faut également entendre le chemin pour accéder à ce fichier.

Alors que ces fichiers (chemin compris) vivotaient très bien sur un Windows XP, maintenant, sur un Windows 7, ils posent problèmes. Windows me recommande de renommer ces fichiers ou de les déplacer. Sauf que, souvenons nous, mon poste sert pour du développement. Et que pour certains projets, ces fichiers sont des fichiers dans des librairies de librairies de librairies… Oui, je pourrais m’en prendre au projet initial qui a une structure de fichiers bien pourrie… mais c’est trop tard. En attendant, il est impossible de déplacer ces fichiers sans casser le fonctionnement du projet…. Et ça, je ne m’explique pas qu’avec Windows 7, cela pose problème alors qu’avec Windows XP, cela se passait sans souci…

En recherchant sur les forums, certains ont résolu leur problème… en déplaçant les fichiers ! Perspective impossible pour moi… Si quelqu’un a une autre solution, je suis intéressée.

### L’explorateur de fichiers

Par défaut depuis Windows 7, lorsqu’on lance un explorateur de fichiers, on se retrouve sur sa Bibliothèque. Il faut le savoir. Il faut suivre le mouvement et ne pas essayer d’aller à son encontre… ce qui me pose un pb puisque j’ai créé des répertoires hors de la bibliothèque.

La solution :

- soit rajouter les nouveaux répertoires dans la bibliothèque,
- soit déplacer ces nouveaux répertoires vers la bibliothèque,
- soit ajouter son répertoire Utilisateur dans les favoris de l’explorateur.

C’est un choix.

### Conclusion

Windows 7 est plus rapide que Windows XP concernant les copies / transfert de fichiers. En revanche, la mise en veille met plus de temps à s’enclencher, peut être à cause des multiples applications qui fonctionnent sur mon poste.

Windows 7 est un coup de main à prendre. Je trouve que le gap entre un Windows XP et un Windows 7 n’est pas monstrueux mais tout de même perturbant. Il faut retrouver ses marques, revoir ses méthodes de travail et pour certains usages avancés, réadapter son organisation sur sa machine. Je pense honnêtement que vous allez rencontrer le même gap entre un Windows et un Ubuntu de nos jours. J’ai trouvé que ce changement d’OS vers un Windows 7 m’a fait causé autant de réflexions que lorsque j’ai adopté Ubuntu il y a 5 ans.
