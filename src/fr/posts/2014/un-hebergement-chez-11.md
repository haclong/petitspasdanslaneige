---
title: "Un hébergement chez 1&1"
permalink: "fr/posts/un-hebergement-chez-11.html"
date: "2014-09-10T12:33"
slug: un-hebergement-chez-11
layout: post
drupal_uuid: 01f15dcb-b650-4447-8d0e-fa852be5775e
drupal_nid: 89
lang: fr
author: haclong

media:
  path: /img/teaser/Capture_serveur_rack.PNG

tags:
  - "1&1"
  - "hébergeur"
  - "migration"
  - "transfert"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Gérer des sites web, c’est, pour mon activité personnelle, les concevoir, les développer (ou les intégrer, selon la solution choisie) et les transbahuter d’un hébergeur à l’autre… Pour cette fois ci, voyons comment on migre un site vers 1&1."
---

Gérer des sites web, c’est, pour mon activité personnelle, les concevoir, les développer (ou les intégrer, selon la solution choisie) et les transbahuter d’un hébergeur à l’autre… Pour cette fois ci, voyons comment on migre un site vers 1&amp;1.

### Création du compte 1&amp;1

Rendez vous sur le site de <a href="http://www.1and1.fr/" target="_blank">1&amp;1</a> et choisissez la formule qui vous convient le mieux. Pour ma part, j’ai pris une solution d’**hébergement Linux**, la formule **Basic**. Dans cette formule, la location du nom de domaine est offert. Toutefois, je suis déjà en possession du nom de domaine. Du coup, je ne souhaite pas en prendre un second… Ah… ils proposent en petit dans un coin de choisir son nom de domaine plus tard…

**+1 pour 1&amp;1 : Possibilité d’avoir un espace d’hébergement sans nom de domaine associé.**

Durant le processus de souscription à l’hébergement, 1&amp;1 propose tout un tas d’options et de solutions à prendre en plus : plus de sécurité, meilleure présence sur le web, Norton antivirus… Je trouve ça assez polluant mais commercialement, ça marche peut être. Bon, je pense que je n’ai pas besoin de tout ça pour le moment et si je souhaite souscrire plus tard, je leur fais confiance pour me le reproposer en temps et en heure.

De plus, beaucoup de services proposés payants peuvent se trouver gratuitement sur le web (ou à tarifs différents). Ne vous précipitez pas, ne prenez que ce qui vous est nécessaire pour commencer (à savoir, votre espace d’hébergement et le DNS si nécessaire et il y a toujours moyen de faire votre référencement vous même, le détecteur de faille de sécurité est quasiment inutile si vous avez un site construit avec un CMS (qui a déjà son propre cycle de controle de la sécurité) etc…) Moi, ça m’énerve tout ça parce que le néophyte finit pas cliquer sur tous les boutons en pensant qu’il fait une affaire alors qu’en fait, il s’est un peu fait avoir…

A l’inscription, on va vous demander vos informations personnelles (normal, c’est administratif) et un mot de passe qu’il faudra veiller à faire le plus sécure possible.

Après le règlement en bonne et due forme (à savoir, 1&amp;1 a toujours une offre avantageuse, imbattable mais cela entend que vous vous engagiez sur une période de 12 mois fermes…), vous allez recevoir deux mails de confirmation (oui, deux, je ne sais pas, et en plus, ils ont réussi à m’envoyer dans l’un des mails la mauvaise civilité et en nom prénom, c’était l’adresse postale… Ca donnait donc quelque chose comme : Bonjour Madame Escalier 7 Boite 75.. Franchement, ça fait pas très sérieux mais passons…

Les mails comportent tous les deux les formulaires pour votre droit de rétractation mais par ex, je n’ai pas pris de noms de domaine mais j’ai quand même eu le droit au formulaire de rétractation… qui en plus, en terme très légaux et donc très compliqué, me dit que je n’ai pas le droit de faire usage de ce droit puisque je n’ai pas pris de nom de domaine… Bien compliqué tout ça…

L’un des mails va vous promettre que votre commande est en cours de traitement et que sous peu, vous allez recevoir un mail avec toutes vos informations. J’ai attendu 36 heures… A part la facture, pas de mails d’information.

Toutefois, le 1er mail “Nous avons reçu votre commande” comporte

- le numéro de client
- et plus bas, un lien vers l’espace client (le lien existe aussi sur leur site)

La facture comporte l’URL par défaut en **s123456789.onlinehome.fr** (dans le cas où vous n’auriez pas choisi un DNS pour le moment). C’est l’url de votre site web (encore une fois, tant que vous n’aurez pas de DNS).

Je décide d’y aller faire un tour.

Pour vos connecter à votre espace client :

- le login est votre numéro de client (que vous aurez un mal fou à retenir)
- et le mot de passe est celui que vous avez vous même défini à la souscription (celui ci, normalement, vous devriez le retenir plus facilement).

**-1 pour 1&amp;1 : c’est la première fois que j’arrive à mieux retenir le mot de passe que le login pour m’identifier**

### Créer la base de données

Comme je migre un site existant, il faut que je déplace la base de données existante.

Chez 1&amp;1, la base de donnée (même la 1ere) n’existe pas. Vous devez la créer. Dans l’espace client, aller dans **Gérer l’Espace Web > Base de données MySQL**

Créer votre base de données : vous devrez fournir une description de votre base, et un mot de passe. Là encore, c’est 1&amp;1 qui va fournir le nom de la base, le nom de l’utilisateur et le host de la base de données. Toutes ces informations apparaîtront à la création de la base. Tous les noms sont aléatoires et n’ont aucun sens. Mais une fois que vous aurez complété les informations de connexion du site, vous n’aurez, en principe, plus besoin d’y revenir. Et à part le mot de passe que vous être tenu de retenir puisque, après tout, c’est vous qui l’avez défini, toutes les informations de la base de données figurent sur votre espace client.

**+1 pour 1&amp;1 : contrairement à d’autres hébergeurs, la formule Basic vous donne accès jusqu’à 10 bases de données distinctes. Pour chaque base de données, vous aurez un user différent (pas de problème de sécurité et de débordement du coup).** 

**+1 pour 1&amp;1 : la gestion des bases de données MySQL donne accès en un coup d’oeil à vos bases et à l’espace de stockage utilisé et restant pour chaque base.** 

### Paramétrer PHP

Pour chacun de vos domaines (et sous domaine) vous pouvez (et vous devez) choisir une version de PHP à utiliser. Allez dans l’espace client à **Gérer l’Espace Web > Réglages PHP**, cliquez sur le bouton [**Déterminer la version PHP**] et choisissez la version de PHP la plus adaptée à vos besoins. Pour le moment, 4 versions différentes sont présentées.. J’ai donc l’embarras du choix.

**+1 pour 1&amp;1 : personnalisation de la version de PHP par domaine facilement, et d’après ce que j’ai vu dans les pages d’aide, possibilité de personnaliser également son php.ini…**

### Accès FTP

Dans l'administration, il y a un outil qui s'appelle **1&amp;1 WebTransfert**. Ca ressemble à un client FTP en ligne. Ca peut marcher… pourquoi pas. Personnellement, je suis tellement habitué à **FileZilla** que je préfère me tourner vers mon fidèle client FTP pour faire mes manipulations sur mon hébergement. Sinon, vous avez aussi accès en SSH à votre espace.

Là encore, aucun utilisateur n’a été créé initialement. A vous de le faire. Allez dans l’espace client à **Gérer l’Espace Web > Accès FTP** et cliquez sur le bouton [**Nouvel utilisateur**].

Le nom du 1er utilisateur FTP est un nom assigné par défaut (différent du compte client et de l'utilisateur de la base de données). Choisissez son mot de passe.

Le serveur FTP est le nom de votre serveur (votre DNS ou votre domaine par défaut (*s123456789.onlinehome.fr*) assigné par 1&amp;1 si vous n’avez pas pris de DNS pour le moment).

Lorsque vous vous connectez en FTP à la racine de votre espace, vous êtes dans le root de votre virtual host (le répertoire `htdocs/` ou `public/` ou `web/` selon les serveurs usuels). Pour des frameworks comme Zend Framework où les fichiers doivent se situer au dessus du répertoire public, on ne peut visiblement pas les mettre en place par FTP ni en SSH par ailleurs.

**+1 pour 1&amp;1 : un premier utilisateur FTP qui accède à la racine de l’espace et les utilisateurs suivants peuvent accéder à des sous répertoire de l’espace, ce qui permet de cloisonner facilement les autorisations des uns et des autres.**

**+1 pour 1&amp;1 : possibilité d’accéder en SSH également. Les informations host / user / pass sont les mêmes que pour l'accès FTP.**

**-1 pour 1&amp;1 : pour les frameworks complexes, comment mettre les fichiers de l’application hors du répertoire public ?**

### Où mettre vos fichiers.

La question est plus intéressante qu’elle n’y parait. Au prime abord, un upload vers la racine de votre espace serait la réponse la plus évidente. Toutefois, contrairement aux autres hébergeurs, la création d’un sous domaine ne crée pas automatiquement un nouveau répertoire dans votre espace d’hébergement. Ainsi, un sous domaine peut pointer directement sur l’espace principal (ce serait alors un alias) et un sous domaine peut pointer sur un répertoire du domaine principal (par ex : `www.mondomaine.tld/forum` pourrait être accédé par `forum.mondomaine.tld`).

Cela signifie également que si on souhaite avoir des répertoires distincts par sous domaine (en considérant que le domaine est un sous domaine comme un autre), il faut que à la racine de votre espace, vous organisiez vous même les répertoires dédiés à chaque sous domaine.

Avec votre client FTP, à la racine de votre espace, créez vous même un répertoire par domaine / sous domaine. N’oubliez pas de créer un répertoire pour le domaine / sous domaine `www/` également.

Allez dans **Espace Client > Gestion des domaines**. Sélectionnez un de vos domaines (sauf le domaine par défaut assigné par 1&amp;1). Vous pouvez lui ajouter autant de sous domaines que vous le souhaitez (dans la limite de votre contrat). Pour chaque sous domaine créé, il faut définir sa destination (le répertoire où se trouveront les fichiers de votre sous domaine). Editez le sous domaine et assignez lui le répertoire dans le champs Destination. N’oubliez pas de faire la même chose pour le domaine principal et pour le sous domaine par défaut de 1&amp;1)

Il faut attendre environ 3h pour qu’un sous domaine ou un repointage de votre domaine principal soit opérationnel. Donc pas de panique.

**+1 pour 1&amp;1 : Le sous domaine et l’arborescence de l’espace sont distincts.** 

Du coup, on peut avoir des domaines qui sont des alias à des sous répertoires d’un domaine existant et d’autres domaines qui sont distincts les uns des autres. Si on décide de renommer un sous domaine, on peut créer un nouveau sous domaine, le faire pointer sur les fichiers de l'ancien sous domaine et effacer seulement le nom de l'ancien sous domaine.

Le schéma que j'ai le plus fréquemment rencontré, c'est le sous domaine étroitement lié au système de fichier. Renommer un sous domaine revient à créer un nouveau sous domaine, déplacer tous les fichiers d'un répertoire à un autre et effacer l'ancien sous domaine avec l'ancien répertoire.

**NOTE :** 1&amp;1 considère qu’un sous domaine est en fait un domaine. `www.mondomaine.fr` et `forum.mondomaine.fr` sont techniquements traités de la même façon.

### Repointer vos DNS

Votre domaine est enregistré auprès de votre ancien registrar avec lequel, sommes toutes, vous n’avez pas de problème. Toutefois, votre site étant chez 1&amp;1 maintenant, ce serait sympa que votre nom de domaine chez Pierre puisse afficher votre site qui est chez Paul…

Chez 1&amp;1, faites comme si vous vouliez ajouter un domaine.

Dans l’**Espace Client > Domaines > Ajouter un domaine** : dans le champs de formulaire de la page, saisissez votre nom de domaine (celui que vous avez déjà. ne pas oublier de choisir la bonne extension).

Cliquer sur [**Vérifier la disponibilité**]

Evidemment, votre nom de domaine sera déjà enregistré. 1&amp;1 vous propose alors deux options possibles :

- soit demander à 1&amp;1 de devenir le registrar de votre nom de domaine,
- soit utiliser les serveurs DNS de 1&amp;1 et conserver votre registrar actuel.

La première option est un transfert de DNS. Si vous n’êtes pas familier avec les transferts de DNS, ne vous inquiétez pas. C’est pas parce qu’on choisit de demander à 1&amp;1 de devenir le registrar de votre nom de domaine qu’on peut récupérer tous les noms de domaines qu’on veut… il va falloir montrer patte blanche, bien entendu.

La seconde option est un repointage des DNS. En gros, on laisse le DNS chez son registrar actuel, mais on lui dit vers quelles machines il doit pointer pour afficher le site qui va avec. En même temps, il faut dire aux propriétaires desdites machines (l’hébergeur), qu’un DNS externe va pointer sur ses machines.

Si on choisit la seconde option, il faut gérer deux aspects du pointage DNS : où se situent vos mails et où se situe votre site. 1&amp;1 va vous demander quoi faire de vos mails : conserver les machines de l’hébergeur d’origine ou utiliser les machines de 1&amp;1.

Concernant le site, 1&amp;1 va nous dire vers quelles machines il faut faire pointer notre DNS. Ensuite, il faudra aller chez notre registrar actuel (ou, dans la plupart des cas, chez notre hébergeur actuel parce que l’hébergeur est également notre registrar) et modifier le paramétrage du DNS. Au lieu de le faire pointer sur les machines de l’hébergeur actuel, il faut faire pointer le DNS sur les machines de 1&amp;1.

Chez Online,

- vous identifier sur la **console de Online > Domaine > Choisir un domaine**
- cliquer sur **Configurer > Gestion des serveurs DNS**
- remplir les 4 champs disponibles avec les noms des 4 machines fournies par 1&amp;1
- cliquer sur **Modifier les serveurs DNS**… On va vous demander si vous êtes sûr… vous allez avoir un noeud dans l’estomac. Vérifier bien que vous avez bien copié les noms des machines de 1&amp;1 et cliquer sur **oui**. Il faut quelques heures pour que cela fonctionne. 1&amp;1 va vous envoyer un mail pour vous confirmer que vous avez bien fait le pointage et un autre mail pour vous dire que ça marche.

Chez Gandi,

- vous identifier sur votre compte,
- aller dans **Domaines > Choisir un domaine**
- l’éditer
- cliquer sur **Modifier les serveurs DNS**.

### Pointage DNS vers serveur mails de 1&amp;1

Si dans un premier temps, vous avez gardé le pointage DNS sur les serveurs mails de votre ancien hébergeur, mais que vous désirez changer maintenant :

- aller dans l’**Espace Client de 1&amp;1 > Gestion des domaines > Choisissez le domaine > Paramètres DNS**.
- cliquer sur **Modifier.** 
- dans la partie (en bas) : **Enregistrements MX (MX-record)**, choisir l’option **Serveur email 1&amp;1**

Et voilaaaa…

N’oubliez d’aller créer tous vos comptes emails dans l’Espace Client de 1&amp;1 et voilaaaa.

### Transférer le nom de domaine

Votre domaine est enregistré auprès de votre ancien registrar. Vous souhaitez transférer votre domaine vers le registrar de 1&amp;1.

Il est impossible de transférer votre domaine

- si le domaine expire dans 45 jours
- si vous venez de renouveler le domaine depuis moins de 30 jours.

Après la période de carence, vous pourrez transférer le DNS...
