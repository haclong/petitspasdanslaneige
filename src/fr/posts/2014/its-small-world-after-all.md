---
title: "It's a small world after all !!"
permalink: "fr/posts/its-small-world-after-all.html"
date: "2014-04-22T16:48"
slug: its-small-world-after-all
layout: post
drupal_uuid: d311bdd9-6c9e-48eb-aed4-ff49697cf1cf
drupal_nid: 72
lang: fr
author: haclong

media:
  path: /img/teaser/Banderas-ONU.jpg

tags:
  - "linguistique"
  - "multilingual"
  - "daily life"

sites:
  - "Haclong projects"
  - "Footprints in the snow"
  - "Linguistique"

summary: "En 1964, les frères Sherman ont écrit une chanson qui, une fois entendue, ne vous quitte plus durant les heures qui suivront… “car le monde est tout petit, devant le ciel on se dit, que nous sommes des fourmis, le monde est petit”... Paix et joie aux hommes de bonnes volontés… Le monde est tout petit, le monde est gentil, le monde est uni… uni… sauf en informatique…"
---

En 1964, les <a href="http://fr.wikipedia.org/wiki/Fr%C3%A8res_Sherman" target="_blank">frères Sherman</a> ont écrit une chanson qui, une fois entendue, ne vous quitte plus durant les heures qui suivront... “*car le monde est tout petit, devant le ciel on se dit, que nous sommes des fourmis, le monde est petit*”... Paix et joie aux hommes de bonnes volontés... Le monde est tout petit, le monde est gentil, le monde est uni... uni... sauf en informatique...

<cite>Si on définit la portée d’un sujet - dans tous les champs d’étude - par la distance qu’il couvre avant d’être méconnu/inconnu, alors on observe dans le courant du dernier siècle des sujets qui ont des portées de plus en plus grandes. En fait, certains sujets couvrent des surfaces si grandes que leurs portées sortent des frontières du pays qui les ont vu naître.</cite>

Avec l’avènement d’internet, les sujets atteignent en peu de temps une portée mondiale. Il n’est alors plus un endroit dans le monde qui n’ait entendu parler ou qui n’ait utilisé le sujet en question. Mais la portée internationale a un prix à payer.

- Le monde entier **ne parlant pas la même langue**, il faut permettre au monde entier de **comprendre le sujet**.
- Le monde entier **n’écrivant pas la même langue**, il faut permettre au monde entier de **s’exprimer** dans sa propre langue.

Ces deux contraintes couvrent notamment trois sujets en informatique :

- Input Method / méthode de saisie.
- i18n
- l10n

## Trois sujets qui tournent au casse tête en informatique.

### La méthode de saisie

Je vois - à mon niveau - quatre cas d’utilisation différentes pour les méthodes de saisie

#### Cas 1 : Saisie d’un système alphabétique latin avec graphes non accentués

L’alphabet, simplissime est sans accent… C'est typiquement l'alphabet anglais. C’est personnellement celui que je blâme parce que l’informatique est universellement anglo saxonne, les systèmes sont anglo saxon et une fois que ça marche avec des caractères - de base -, leur travail est fini et tout les autres cas sont reléguées au niveau de minorités invisibles...

#### Cas 2 : Saisie d’un système alphabétique latin étendu comprenant des graphes accentués

Les alphabets sont des alphabets anglais “étendus” avec quelques caractères en plus deci delà...

Historiquement et avec l’usage, ces langues ont appris à composer si leurs caractères accentués sont absents du clavier qu’ils utilisent : le français se tolère sans accent et l’allemand, le norvégien combinent des lettres pour remplacer leurs caractères accentués absents : par exemple, l’allemand et le norvégien combinent deux caractères non accentués pour représenter leurs caractères accentués originaux.

En allemand : ae = ä, ss = ß.

#### Cas 3 : Saisie d’un système alphabétique non latin

Au delà de l’alphabet latin qui compose ce texte par ex, il existe d’autres écritures qui composent leurs mots avec des caractères non latin : le russe et le grec par ex. Dans un raccourci aussi rapide qu’honteux, on peut réduire la complexité de la chose en admettant que le changement d’alphabet n’est qu’un problème de mapping de caractères...

#### Cas 4 : Saisie d’un système non alphabétique

Un système alphabétique est un système qui décompose chaque son d’une langue en caractères distincts. L’écriture de la langue est alors une composition linéaire de caractères alignés qui forment des mots - par conséquent, des sons. Or, il existe de part le monde d’autres langues qui ont adoptées une écriture non alphabétique : un graphe peut représenter un son, une syllable ou un ensemble de syllables. Nous avons forcément une pensée pour les langues asiatiques comme le japonais (kanji et syllabaires), le coréen et le chinois.

### Les contraintes du système

En informatique, la saisie - au clavier - de chacun des cas implique deux contraintes inévitables :

- il faut que l’ordinateur ait quelque part dans le système, **les tables de caractères** qui vont bien **pour afficher le caractère qu’on veut écrire**.
- il faut qu’un programme - de préférence dans le système - puisse **associer le code en provenance du clavier** (lorsque l’utilisateur appuie sur une (ou plusieurs) touches de son clavier) **avec un des caractères qui figure dans la table de caractère**.

**A partir de là, c’est la panique :**

#### Saisie d’un caractère non accentué

La saisie d’un caractère simple associe la frappe unique d’une touche du clavier avec un caractère de la table de caractère.

Typiquement, sur le clavier français, n’importe quelles lettres sans accents ni signes diacritiques (a, z, e, r, t, y)

Ce mode de saisie concerne nos cas 1, 2 et 3, pour le cas 3, il suffit d’associer le code de la touche à un caractère non latin.

#### Saisie d’un caractère accentué

La saisie de caractères accentués associe selon les claviers :

- la frappe de deux touches successives avec un seul caractère de la table de caractère, (^ + o = ô sur le clavier français par ex)
- ou la frappe d’une touche unique du clavier avec un seul caractère de la table de caractère (é, ç sur le clavier français)

On retrouve les caractères accentués dans les cas 1, 2, 3 et également 4

#### Saisie de graphes complexes

La saisie de graphes complexes associe la frappe de plusieurs touches du clavier avec un seul caractère de la table de caractère et la complexité de la langue chinoise fait que, pour la même combinaison de touches, plusieurs graphes peuvent être disponibles...

Ce mode de saisie est ciblé par le cas 4 mais concerne également dans une moindre mesure les alphabets latins étendus comme le viêtnamien (ne me demandez pas pourquoi en revanche)...

Non contents d’avoir un système suffisamment compliqué pour écrire avec un clavier, il existe des conventions différentes qui se sont développées et qui, une fois adoptées par le grand public, deviennent plus compliquées à changer. En viêtnamien, un même caractère complexe peut être écrit avec plusieurs combinaisons de touches différentes selon le type de saisie qu’on préfère / qui existe.

pour écrire <span style="font-size:16px;">Ặ</span>

- `**A** + **W** + **J**` en telex
- `**Shift 1** + **9**` en TCVN 6064
- `**A** + **8** + **5**` en VNI
- `**A** + **(** + **.**` en VIQR

Ecrire le vietnamien associe donc un mode de saisie de graphes complexes (comme pour le chinois) mais une table de caractères de base latin étendu (enfin, plusieurs tables pour être exact mais on ne va pas s’étendre dessus).

Voila... nous voilà bien contents... **Mais c’est pas fini !**

On a installé nos tables de caractères (probablement disponibles dans les packs langues qu’on télécharge à l’installation de notre système, que ce soit Linux, Mac ou Windows)

On a installé notre système de saisie (ibus pour Linux/Ubuntu, natif après installation chez Windows)

Mais nous sommes des heureux utilisateurs d’un clavier **AZERTY**… Et oui, vous ne le croirez que si vous le vivez :

**Windows** intègre un système de saisie en vietnamien mais le clavier qui est embarqué est un clavier QWERTY… Même si vous avez un clavier AZERTY branché à votre machine, si vous souhaitez écrire un A, il faudra appuyer sur la touche [Q] de votre clavier...

**Windows Phone 8** embarque un clavier QWERTY mais bon, sur un téléphone, généralement, j’ai les yeux collés au clavier pour écrire...

**Mac** est épargné, je ne sais pas ce qu’il fait.

**Google Mail** opte pour un mix de tous les claviers : les lettres semblent suivre le mapping du clavier AZERTY mais la 1ere rangée de touches + les touches de ponctuations sous la main droite suivent le clavier QWERTY.

**Linux/Ubuntu** intègre un système de saisie en vietnamien (**ibus**) qui embarque, selon la version de Ubuntu, un clavier soit QWERTY, soit AZERTY… Par exemple, sur Ubuntu 13.04, j’appuyais sur la touche A pour écrire un A. Depuis Ubuntu 13.10, je dois appuyer sur Q pour obtenir le A... Tout ça parce qu’au développement de la 13.10, quelqu’un a pensé qu’il était inutile d’intégrer le clavier AZERTY dans les claviers possibles de **ibus**... merci pour la charmante attention messieurs... Il faut savoir que la criticité de ce problème est qualifiée de “low”... AZERTY users : on est ravi !

### Sur les épaules de l'application

Et une fois qu’on a franchi tous ces problèmes, il faut encore que l’application qu’on utilise accepte les saisies multilingues et stocke les informations correctements dans les bases applicatives. Par exemple, il y a quelques années, une application cliente que j’ai utilisé propose des fonctionnalités multilingues (qui sont là pour faire jolie mais qui ne fonctionnent pas) et les caractères accentués ne sont pas correctement encodés dans la base de données… L’outil étant assez massif, il n’a pas été question de le faire évoluer. Par la force des choses, il a fallu faire un bon de 30 ans en arrière et tout saisir sans accents...

### Last but not least

Reste un dernier détail qui tient également du casse tête... Tout le monde connaît les raccourcis universels : `Ctrl + S`, `Ctrl + C`, `Ctrl + V`, `Ctrl + X`...

Encore faut il que votre machine les comprennent... Les heureux utilisateurs d’alphabets non latin par ex rencontrent parfois des difficultés à faire un copier coller parce que le système ne comprend pas ce que signifie `Ctrl + ψ` et `Ctrl + ω` !!

Toujours sympa comme bug / regression... Evidemment, la solution que j’ai trouvé - remapper tous les raccourcis - n’est définitivement pas une solution valide à mes yeux...

Le problème dans l’internationalisation / les saisies complexes / les interactions avec les fonctionnalités systèmes est véritablement un problème mineur dans un système complexe. Il est maîtrisé par une minorité des développeurs mais il est utilisé par la majorité des utilisateurs.

Le monde devient de plus en plus petit, un système qui décide de passer délibéremment à côté de telles fonctionnalités loupe complètement son entrée sur la scène internationale. A l’échelle des sites et applications web, la plupart des frameworks et CMS offrent - cahin-caha - des fonctionnalités multilingues. Il ne faut pas hésiter à les explorer et à les utiliser si besoin, si votre future cible se veut plus large que le cercle de vos amis...
