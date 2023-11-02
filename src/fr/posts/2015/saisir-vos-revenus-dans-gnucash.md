---
title: "Saisir vos revenus dans GnuCash"
permalink: "fr/posts/saisir-vos-revenus-dans-gnucash.html"
date: "2015-01-06T22:25"
slug: saisir-vos-revenus-dans-gnucash
layout: post
drupal_uuid: 5c5969e3-5ee3-4c65-9dfc-22384bfdd218
drupal_nid: 115
lang: fr
author: haclong

media:
  path: /img/teaser/stockvault-coins120947.jpg

tags:
  - "GnuCash"
  - "comptabilité"

sites:
  - "Haclong projects"
  - "Footprints in the snow"

summary: "Voyons comment saisir les revenus dans GnuCash, outil de comptabilité gratuit."
---

Voyons comment saisir les revenus dans GnuCash, outil de comptabilité gratuit.

## Saisir ses revenus (salaires)

Tous les mois, vous recevez, soit sous forme de virement, soit avec un chèque, le salaire mensuel de la part de votre employeur. L'argent vient du compte de votre employeur et vient remplir votre compte en banque.

Nous allons donc créer :

<u>**Votre compte bancaire**</u> : dans **Actif > Clic droit Nouveau compte...**

- **Nom du compte** : 'mon compte bancaire', 'mon compte courant' etc...
- **Code du compte** : le numéro de compte... perso, je ne le mets pas
- **Description** : ce que vous voulez
- **Titre/devise** : la devise de votre compte... pour l'Europe, c'est EUR (Euro) bien sûr
- **Plus petite fraction** : ne rien mettre
- **Couleur du compte** : ce que vous voulez, j'ai laissé par défaut
- **Notes** : je n'ai rien mis
- **Imposable** : n'est pas disponible
- **Caché** : laisser non coché
- **Virtuel** : laisser non coché
- **Type de compte** : **Actif (avoirs)**
- **Compte parent** : N'importe quel compte du moment que c'est sous** Actif**
- **Solde initial** : le solde qu'il y a dans le compte au moment où vous le créez. C'est une valeur que vous pouvez changer par la suite.

<u>**Le compte de l'employeur**</u> : dans **Revenus > Clic droit Nouveau compte...**

- **Nom du compte** : le nom de votre employeur
- **Code du compte** : je ne mets rien là
- **Description** : ce que vous voulez, je ne mets rien là
- **Titre/devise** : la devise de votre employeur... Si vous êtes payés avec une autre devise, il faut mettre l'autre devise.
- **Plus petite fraction** : ne rien mettre
- **Couleur du compte** : ce que vous voulez, j'ai laissé par défaut
- **Notes** : je n'ai rien mis
- **Imposable** : n'est pas disponible
- **Caché** : laisser non coché
- **Virtuel** : laisser non coché
- **Type de compte** : **Revenus**
- **Compte parent** : N'importe quel compte du moment que c'est sous **Revenus**
- **Solde initial** : ne rien mettre.

Lorsque vous recevez votre salaire, allez dans **Actif > Double cliquez sur votre compte bancaire.**

Dans la dernière ligne disponible en bas :

- **Date** : saisissez la date où l'argent arrive dans le compte
- **Num** : le numéro du chèque, ou la référence bancaire
- **Description** : une description sommaire mais claire. Evitez 'paiement' mais préférez 'salaire'
- **Virement** : une transaction comptable est toujours un flux d'argent d'un compte à un autre. Lorsque vous saisissez votre salaire, c'est une transaction entre le compte de votre employeur (type Revenus) et votre compte bancaire (type Actif). Dans virement, choisissez le compte de votre employeur.
- **R** : ne pas toucher cette valeur pour le moment.
- **Augmenter** : Saisissez le montant de votre salaire dans la colonne
- **Réduire** : Ne rien saisir dans la colonne (une transaction est toujours dans un seul sens, les deux colonnes ne peuvent pas être remplies pour une seule transaction)
- **Solde** : Normalement, le montant a augmenté par rapport au solde de la transaction précédente.

## Changer d'employeur

Si vous changez d'employeur, vous pouvez créer un nouveau compte de type **Revenus** pour représenter votre nouvel employeur.

## Profession libérale

Si vous exercez une profession libérale, il est évident que vous n'allez pas créer un compte de type **Revenus** par client (sauf si vous en avez peu et que vous souhaitez faire le suivi de chacun de vos clients).

Si vous avez plusieurs clients différents, je pense qu'il vaut mieux créer un compte relatif à l'activité plutôt qu'un compte relatif aux clients.

## Autres revenus

Si vous avez des revenus qui ne sont pas des salaires (qui ne proviennent donc pas d'un employeur), la logique reste la même, il suffit de créer d'autres comptes de type Revenus.

Les autres revenus possibles :

- les intérêts des comptes d'épargnes
- les rentes

- les cagnottes des cartes de fidélité
- les allocations diverses (chômage etc...)
- les loyers
- le loto

Pour être complètement correct, vous devez faire la distinction entre des revenus et des remboursements. Les revenus sont des sous que vous avez gagné... en plus. Les remboursements sont des sous que vous avez dépensés et finalement, les sous vous ont été rendus.

Les revenus sont des comptes de type Revenus.

Les remboursements sont des comptes de type Dépenses.

## Reporting et contrôle

Si vous avez plusieurs comptes employeurs et que vous consultez chacun de leurs comptes, vous saurez combien chacun vous aura payé ! :p

Si vous ouvrez le compte de votre employeur, vous pourrez voir en un coup d'oeil si tous les salaires ont été saisis dans GnuCash (et si vous n'en avez pas oublié)
