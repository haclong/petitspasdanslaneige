---
title: "Faire sa comptabilité avec GnuCash"
permalink: "fr/posts/faire-sa-comptabilite-avec-gnucash.html"
date: "2013-10-21T17:26"
slug: faire-sa-comptabilite-avec-gnucash
layout: post
drupal_uuid: 5eeb5837-adae-46c6-8163-f7904ceb9abb
drupal_nid: 43
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

summary: "Que vous soyez un professionnel ou un particulier, vous devez faire vos comptes régulièrement. Une tenue de compte minimum si vous êtes un particulier, une tenue de compte plus élaborée si vous êtes un professionnel. Mais, dans tous les cas, une comptabilité. Comme pour la plupart des particuliers, j'ai commencé à faire mes comptes sur un fichier excel. C'est pratique. Ca somme tout seul. Il suffit d'aligner les débits et les crédits dans les bonnes colonnes. Et puis, comme pour certains d'entre nous, j'ai commencé, soit à trouver les limites d'Excel en tant qu'outil de comptabilité, soit à me lasser du format Excel... Qui pourrait vraiment le dire ?"
---

Que vous soyez un professionnel ou un particulier, vous devez faire vos comptes régulièrement. Une tenue de compte minimum si vous êtes un particulier, une tenue de compte plus élaborée si vous êtes un professionnel. Mais, dans tous les cas, une comptabilité. Comme pour la plupart des particuliers, j'ai commencé à faire mes comptes sur un fichier excel. C'est pratique. Ca somme tout seul. Il suffit d'aligner les débits et les crédits dans les bonnes colonnes. Et puis, comme pour certains d'entre nous, j'ai commencé, soit à trouver les limites d'Excel en tant qu'outil de comptabilité, soit à me lasser du format Excel... Qui pourrait vraiment le dire ?

### Les limites d'un tableur.

La dernière version de mon fichier Excel est assez élaborée.

En début d'année, j'établis un budget et le budget de chaque poste est répété sur chaque mois de l'année. Il y a des feuilles de synthèse qui me permet de voir en une année ce que j'ai dépensé pour chaque poste, si j'ai dépassé le budget annuel alloué, si j'ai réussi à tenir les objectifs.

Mais mon fichier Excel ne me fait voir que ce qu'il se passe sur le compte courant. Il ne figure pas de comptes d'épargne et encore moins de comptes à crédit ou les investissements effectués sous forme d'actions. Et si vous avez le malheur d'avoir plusieurs comptes et que vous commencez à faire des virements d'un compte à l'autre, vous vous retrouvez avec des dépenses qui n'en sont pas et des entrées d'argent qui ne vous ont pas enrichi pour autant.

J'ai eu du mal (mais ce n'est pas impossible) de gérer les cas suivants :

- Tracer les dépenses d'un poste alors que le poste est un sous ensemble d'un poste plus large : par ex, tracer les dépenses en plats cuisinés parmi les dépenses en alimentaire.
- Tracer les investissements immobiliers avec les caractéristiques suivantes :
  - Un bien immobilier est financé par un prêt.
  - Le remboursement du prêt se fait à partir de votre compte courant. Du coup, chaque échéance réduit votre dette auprès de l'organisme prêteur mais réduit également votre compte courant.
  - Vous avez donc un compte qui représente le prêt et vous vous évertuez à réduire ce compte (votre dette) à 0.00 et un compte qui représente vos sous et pour lequel vous vous évertuez à ne pas réduire de trop sous peine d'être en négatif auprès de votre banque habituelle.
  - Sur Excel, vous êtes obligé de créer une feuille par compte et un montant crédité sur la dette est forcément débité sur le compte courant. Vous êtes obligés de faire figurer le montant sur les deux feuilles. Double saisie... Pas vraiment efficace.

Si on doit résumer, l'outil doit pouvoir

- faire figurer tous les différents comptes que j'ai
- faire figurer les comptes d'actions (compte titres, PEA)
- faire figurer les "gros" investissements (immobilier, automobile)
- gérer les virements d'un compte à un autre
- permettre de tracer différents postes de dépenses avec une logique arborescente

### Les outils du marché

Je cherche un outil du marché gratuit. Dans la mesure où je ne suis qu'un particulier qui veut "s'amuser" avec un outil de comptabilité, je ne suis pas vraiment prête à payer un véritable outil de comptabilité dont je n'utiliserais peut être qu'une fraction des fonctionnalités.

Je cherche en même temps un outil assez complet. Dans la mesure où je veux progresser dans les notions comptables, un logiciel qui ne présenterait qu'une colonne débit et une colonne crédit se résumerait, à mes yeux, à un fichier Excel amélioré et je souhaite dépasser cet état.

Sur Ubuntu, je trouve plusieurs logiciels gratuits : **<a href="http://fr.wikipedia.org/wiki/Grisbi" target="_blank">Grisbi</a>**, **<a href="http://www.gnucash.org/" target="_blank">GnuCash</a>**, **<a href="http://kmymoney2.sourceforge.net/index-home.html" target="_blank">KMyMoney </a>**et **<a href="http://homebank.free.fr/" target="_blank">HomeBank</a>**. Je n'ai pas vraiment fait de comparatifs entre les différentes solutions. J'ai finalement fini par installer **Grisbi** et **GnuCash** mais **GnuCash** me paraissait plus complet et j'ai adopté celui là assez rapidement, avant même, je dois l'avouer, avoir trouvé des limites à **Grisbi**.

**GnuCash** présentait plusieurs avantages à mes yeux :

- Il existe une version pour Windows. Cela peut être utile si je souhaite étendre l'utilisation de l'outil.
- Il fait de la **comptabilité en partie double**. Ce qui s'applique exactement au cas d'un investissement immobilier. C'est un moyen également d'en apprendre un peu plus sur le métier comptable sans trop d'effort. Et de toutes façons, en tentant de suivre mon investissement immobilier, j'avais fini par arriver à la conclusion qu'il me fallait bien deux comptes pour suivre : comptabilité en partie double.

La documentation de **GnuCash** se trouve principalement en deux parties : "<a href="http://www.gnucash.org/viewdoc.phtml?doc=help" target="_blank">The Help Manual</a>" et "<a href="http://www.gnucash.org/viewdoc.phtml?doc=guide" target="_blank">The Tutorials and Concepts Guide</a>". Ces deux manuels se trouvent soit sur le site de **GnuCash**, soit ils se trouvent également sur Google. Il est parfois utiles/pratiques d'aller les chercher sur Google parce que ces deux manuels existent en différentes versions et si vous êtes chanceux, il se pourrait qu'une version obsolète paraissent plus concrète que la version la plus récente - mais reformulée - du manuel.

"The Help Manual" présente les fonctionnalités de **GnuCash** et je ne crois pas l'avoir beaucoup exploré. En revanche, "The Tutorials and Concepts Guide" est une ressource que j'ai beaucoup plus étudié parce qu'il présente des cas assez concrets et on peut y puiser des similitudes au cas que vous souhaitez créer dans votre version de GnuCash.

La documentation de **GnuCash** présente le désavantage d'être en anglais uniquement, les versions traduites soit n'existant pas, soit ayant été retirées parce qu'elles n'ont pas été maintenues avec l'évolution de l'outil. Là où c'est sioux, c'est que le logiciel a été traduit. Du coup, il faut faire un peu correspondre les concepts entre le vocabulaire comptable anglais et le vocabulaire comptable français. Mais on s'en sort finalement et cet article peut également vous être utile.

**LEXIQUE** : un point à souligner et à comprendre pour comprendre **GnuCash** : Tout est **compte** dans **GnuCash**. Chaque poste de dépenses est un compte. Du coup, dès que vous voulez regroupez votre argent par ensemble, c'est considéré comme un compte. Toutes les dépenses liées à l'essence seront regroupées dans un compte "Essence".

Un mauvais point dans **GnuCash** à ce jour : les rapports. **GnuCash** permet de faire de nombreux rapports et il a même une option pour sauvegarder ses propres rapports. Mais la mise en colonne des rapports me semble incompréhensible. Je ne sais pas si c'est un colonnage normal ou si c'est une erreur grossière dans la feuille de style. Cet partie là est un point noir que je compte régler un de ces jours en me penchant sur la personnalisation des rapports.

De plus, pour des portefeuille de titre, je n'ai pas encore trouvé le moyen de mettre en évidence le montant qui a été investi vs le montant réel du compte actuel. Mais je considère que ce n'est qu'une question de mise en page. Les données existent, il devrait être possible de les extraire et d'en faire ce que je veux.

### La comptabilité en simplifié

La comptabilité est un mot qui fait peur. Mais finalement, c'est simple si on fait abstraction du mot "comptabilité". En fait, c'est basique : il y a

- ***ce que vous possédez, toutes vos richesses additionnées*** : les sous, soit à la banque, soit dans votre portefeuille, les biens immobiliers si vous en avez, vos actions, votre automobile, vos assurances vie etc... y compris les comptes bloqués, bien sûr : vous voudrez avoir la somme de tout ça pour pouvoir vous imaginez comme Picsou dans son coffre fort...
- ***ce que vous devez, parce que vous avez contracté des prêts ou bien parce que vous avez des facilités de paiement qui vous permettent de payer plus tard*** : tôt ou tard, ce sera de l'argent qu'il faudra rembourser et, normalement, il y aura toujours quelqu'un qui va se charger de vous rappeler ce qui vous reste à payer.
- ***où va votre argent*** : l'essence, l'automobile, les assurances, l'alimentaire, les loisirs...
- ***d'où vient votre argent,*** qui vous fait gagner de l'argent : vos salaires, les intérêts des comptes d'épargne, les primes, les loyers..

Vous avez donc les quatres types principaux d'une comptabilité normale.

Ces types ont des noms :

- L'**actif**, c'est ce que vous possédez. **Assets** en anglais.
- Le **passif**, c'est ce que vous devez. **Liability** en anglais.
- Les **dépenses**, c'est où va votre argent. **Expense** en anglais.
- Les **revenus**, c'est d'où vient votre argent. **Income** en anglais.

### La comptabilité en partie double pour les nuls

**GnuCash** est un logiciel de comptabilité en partie double.**Cela signifie que *ce qui est débité d'un compte crédite nécessairement un autre compte*. Dis comme ça, ça fait un peu peur mais quand y pense, c'est super logique et finalement, c'est super pratique quand on sait où regarder.

Vous achetez 30.00 EUR d'essence. Cela signifie que vous allez débiter votre compte courant de 30.00 EUR (il y a 30.00 EUR de moins sur votre compte courant) mais il y aura 30.00 EUR de plus en dépenses d'essence. Si vous consultez votre compte courant, vous verrez que vous avez dépensé 30.00 EUR en essence. Si vous consultez le compte de dépenses Essence, vous verrez que vous avez mis 30.00 EUR de plus sur le poste essence. Vous verrez également tout ce que vous dépensez pour le poste essence.

Si vous avez ces éléments en tête, créer des comptes sur **GnuCash** peut se faire assez rapidement. Nous verrons prochainement comment mettre ces concepts en pratique et créer notre premier fichier de comptes sur **GnuCash**.
