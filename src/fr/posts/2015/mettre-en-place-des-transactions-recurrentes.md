---
title: "Mettre en place des transactions récurrentes"
permalink: "fr/posts/mettre-en-place-des-transactions-recurrentes.html"
date: "2015-02-18T00:18"
slug: mettre-en-place-des-transactions-recurrentes
layout: post
drupal_uuid: afccfc8f-0ee5-4552-aece-42feb08ee107
drupal_nid: 116
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

summary: "GnuCash permet de planifier des transactions récurrentes : des prélèvements mensuels, des virements réguliers, des abonnements."
---

GnuCash permet de planifier des transactions récurrentes : des prélèvements mensuels, des virements réguliers, des abonnements.

Vous avez des transactions régulières et récurrentes ? GnuCash permet d'automatiser les transactions.

## A partir d'un de vos comptes

Saisissez la première date dans votre compte. N'oubliez pas de choisir le second compte dans la colonne **Virement**. Sur la transaction saisie, faire un **clic droit > Récurrence...**

- **Nom** : le nom de la transaction, ce sera le même nom qui sera répété, évitez de le dater
- **Fréquence** : la fréquence des transactions
- **Date de début** : date de la 1ere transaction (probablement après celle que vous venez de saisir, à vérifier)
- **Fin** : **Perpétuel** s'il n'y a pas de fin prévue aux occurences, **Date de fin** si une fin est prévue et **Nombre d'instances** si le nombre d'occurences est fixe.

Cliquer sur le bouton **Avancé...** si vous voulez accéder à plus d'options.

Vous pourrez ensuite, dans l'**éditeur de transaction récurrente**, aller éditer votre transaction récurrente nouvellement créée et affiner les options.

## En utilisant l'éditeur de transactions récurrentes

1. Dans **Actions > Transactions récurrentes > Editeur de transaction récurrente...**
2. Dans l'**éditeur de transaction récurrente** (ou l'onglet 'Transactions récurrentes'), cliquer dans le menu **Récurrente > Nouveau**
3. Donnez un nom à votre transaction récurrente

Dans l'**onglet Vue d'ensemble** :

- **Activé** : cocher la case
- **Créer automatiquement** : cocher la case
- **M'avertir lorsque créé** : cocher si vous voulez
- **Créer à l'avance** : cocher la case et choisir combien de jours en avance vous souhaitez que la transaction soit créée
- **Prévenir d'avance** : cocher si vous voulez et choisir le nombre de jours
- **Occurences** : choisir jusqu'à quand vous voulez avoir votre transaction automatique. **Indéfiniment** si vous ne voulez pas l'arrêter, **Jusqu'à une date** particulière qui sera la date de la dernière transaction automatisée ou pour un **certain nombre d'occurences fixe**.

Dans l'**onglet Fréquence**

- **Fréquence** : choisir la fréquence des transactions
- **Date de début** : la date de la 1ere transaction
- **Chaque {1} mois** = chaque mois
- **Le {quantième} du mois**, exception faite pour les fins de semaine : choisir quelle est la règle à appliquer si le jour de la transaction est en week end

Dans l'**onglet Modèle de transaction**

Créer dans cet onglet la transaction qui doit être automatisée.

- **Description** : Le nom de la transaction
- **Le compte d'entrée de fonds** : le compte où l'argent arrive
- **Le compte de sortie de fonds** : le compte où l'argent est retiré

Si c'est un salaire récurrent, le compte d'entrée de fonds est le compte de type **Actif** et le compte de sortie de fonds est le compte de type **Revenus**

Si c'est un impôt mensualisé, le compte d'entrée de fonds est le compte de type **Dépenses** et le compte de sortie de fonds est le compte de type **Actif**
