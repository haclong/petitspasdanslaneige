---
title: "Docbook, pas facile de publier"
permalink: "fr/posts/docbook-pas-facile-de-publier.html"
date: "2012-06-28T07:05"
slug: docbook-pas-facile-de-publier
layout: post
drupal_uuid: 6c4e7801-27e8-4a44-be53-736e4e84085f
drupal_nid: 15
lang: fr
author: haclong

media:
  path: /img/teaser/books.jpg

tags:
  - "docbook"
  - "xml"
  - "xslt"

sites:
  - "Développement"

summary: "Il y a quelques semaines, j'ai décidé de créer un manuel avec docbook. J'ai trouvé le manuel Docbook Definitive Guide et malgré le fait que je ne l'ai pas lu intégralement, j'ai pu me faire une assez bonne idée générale de ce qu'il en retournait. Puis, j'ai essayé de publier le manuel en utilisant le paquet Docbook-Xsl disponible sur la toile. Comme vous le savez sûrement, si vous avez lu mon post précédent à ce sujet, j'ai tenté une première méthode de publication \"quick & dirty\" de mon manuel et cela marche plutôt bien. Bien sûr, maintenant, il s'agit de passer aux choses sérieuses."

---

Il y a quelques semaines, j'ai décidé de créer un manuel avec docbook. J'ai trouvé le manuel <a href="http://www.docbook.org/tdg/en/html/docbook.html" target="_blank">Docbook Definitive Guide</a> et malgré le fait que je ne l'ai pas lu intégralement, j'ai pu me faire une assez bonne idée générale de ce qu'il en retournait. Puis, j'ai essayé de publier le manuel en utilisant le paquet **Docbook-Xsl** disponible sur la toile. Comme vous le savez sûrement, si vous avez lu mon <a href="/en/posts/nice-meet-you-mr-docbook.html">post précédent à ce sujet</a>, j'ai tenté une première méthode de publication "quick &amp; dirty" de mon manuel et cela marche plutôt bien. Bien sûr, maintenant, il s'agit de passer aux choses sérieuses.

**Version "Quick &amp; Dirty"**

Comme on l'a déjà dit, on peut transformer un fichier .xml en une jolie vue HTML à partir du moment qu'on ajoute une déclaration *xml-stylesheet* dans le fichier XML.

`<?xml-stylesheet type="text/xsl" href="chemin_du_repertoire_de_docbook_xsl/html/docbook.xsl"?>`

Après avoir ajouté cette déclaration, il suffit juste d'accéder au fichier XML (un simple glisser / déposer devrait faire l'affaire) par votre navigateur favori. Le contenu du fichier XML devrait maintenant s'afficher comme une page HTML.

Mais avec cette méthode, vous ne pouvez utiliser que la transformation `html/docbook.xsl`. Il n'est pas possible de voir ce que ça peut donner en utilisant la transformation `html/chunk.xsl` parce que cette feuille de style (`html/chunk.xsl`) va créer un ensemble de fichiers HTML. Le navigateur ne saura pas quel est la page HTML que vous souhaitez afficher. On va avoir besoin d'un processeur XSL (xslt processor).

**Introduction au processeur XSL**

Il y a plusieurs processeurs XSL sur le marché. Le <a href="http://www.sagehill.net/docbookxsl/index.html" target="_blank">Docbook XSL : The Complete Guide</a> liste les processeurs les plus connus : **Saxon**, **Xalan**, **xsltproc**, **MSXSL** etc... Pour ma part, la plupart d'entre eux me disent quelque chose mais je n'ai jamais eu l'occasion d'en installer un seul finalement.

J'ai un moment espéré que mon éditeur XML (Altova) inclus un processeur XSL mais tout ce qu'il peut faire s'apparente à la version "Quick &amp; Dirty" en plus joli... Ajoutez à cela, Altova est incapable de valider le code XML parce qu'il n'y a pas de DTD déclarée convenablement (mais d'après la documentation de Docbook 5, il n'y a plus besoin de déclarer une DTD parce que le schéma est de type RELAX-NG)...

Puis j'ai réalisé que j'avais un IDE plus puissant : Eclipse. Le seul hic : je ne sais pas utiliser Eclipse. Un ami me l'a installé parce qu'il avait besoin que je collabore sur un de ces projets en java. Il avait besoin que je commite quelques CSS et quelques feuilles de styles XSL. Ainsi, pour ce que je sais, la version d'Eclipse qui est installé sur mon poste est une version basée sur la version Ganymède incluant un ensemble de packages personnalisés. En d'autres termes : ne pas y toucher de trop près parce que, quoi que je fasse, ça va casser... En fait, je n'utilise plus Eclipse, le projet s'étant achevé il y a quelques mois déjà... J'ai juste gardé Eclipse, au cas où...

J'ai trouvé un tutorial pas à pas pour publier un manuel docbook en utilisant le processeur **Xalan** avec Eclipse. Mais le tutorial s'applique à la version Europa d'Eclipse.... J'ai néanmoins tenté de suivre le tutorial. J'ai créé mon projet, ajouté mes fichiers XML, mes fichiers XSL et le .jar de **Xalan**. J'ai écrit le fichier `build.xml` de **Ant** exactement comme le tutorial m'a dit de faire. Ca n'a jamais fonctionné. J'ai récupéré une erreur et il manquait un paquet... Bon... Comme de toutes façons, mon objectif est seulement de publier mon manuel et pas du tout d'apprendre à paramétrer **Ant**, je n'ai pas voulu me plonger dans de la documentation superflue qui ne me concernait que de loin.

J'ai retenté avec le .jar de **Saxon**. J'ai changé vaguement le `build.xml` de la manière la plus cohérente. Cette fois-ci, le processeur semblait être plus coopératif mais maintenant, le processeur prétend que les entités utilisées dans mon fichier XML n'existent pas. Comme cela ne marche toujours pas mais qu'en même temps, il me reste des pistes à explorer, j'ai juste effacer mon projet dans Eclipse.

Comme le projet qui traîne sur mon Eclipse publiait des fichiers XML avec des fichiers XSL, je me suis dit qu'il était peut être possible de truquer un peu le projet existant en ajoutant de nouveaux fichiers XSL et de nouveaux fichiers XML aux nombreuses librairies java du projet. J'ai copié tous les fichiers de mon manuel dans le projet de mon ami. J'ai mis à jour ses fichiers de configuration pour que cela corresponde aux noms de mes fichiers. J'ai lancé la transformation... Echec. L'application de mon ami me retourne qu'il ne sait pas trouver ma transformation... Que j'ai fini par renommer pour que cela corresponde à la nomenclature du projet existant... Bon, de toutes façons, cette verrue ne me plaît pas non plus... Je ne vais pas insister...

La piste Eclipse finissant en impasse pour le moment, je me tourne vers d'autres solutions. Microsoft par exemple, possède son propre processeur xsl. C'est peut être la meilleure solution finalement. J'ai installé le fichier `msxsl.exe` dans le répertoire `C:/Windows/System32`. Je l'ai lancé en ligne de commande. J'ai obtenu une erreur qui semble se situer dans le package d'origine des feuilles de styles Docbook XSL... Quelque chose au sujet d'une variable ou de paramètres qui n'est pas du type attendu... Pas question d'aller modifier le paquet Docbook XSL.

Nouvelle tentative : J'ai essayé d'installer le processeur **xsltproc**. La plupart des pages sur la toile font références au <a href="http://www.zlatkovic.com/libxml.en.html" target="_blank">site de Igor Zlatkovic</a>, où je pourrais trouver les fichiers binaires pour exécuter `xsltproc`. D'après la documentation, il semblerait qu'il faille dézipper tous les fichiers .zip (au moins 4) et aller copier / coller tous les fichiers binaires dans le répertoire `C:\Windows\System32`. Ce qui ne me plaît pas beaucoup dans la mesure où il s'agit de mélanger des fichiers binaires tiers avec les fichiers systèmes de Windows.

Découragée, j'ai décidé d'installer le même processeur **xsltproc** sur ma machine linux. Après un simple `apt get` fastoche, j'ai réussi à publier mon manuel sans aucun problème (sauf quelques balises docbook qui ne semblent pas être prise en charge par les feuilles de styles XSL). Je verrais ça plus tard. Je tente la publication en utilisant `html/chunk.xsl` et là aussi, succès.

Retour donc à mon poste Windows où j'ai installé les binaires de Igor Zlatkovic avec succès

- Sur le site de Igor Zlatkovic, il faut télécharger les paquets suivantes : `iconv`, `libxml2`, `libxslt`, `zlib`. L'exécutable `xsltproc` se trouve dans le zip `libxslt`. Il fallait le savoir !
- Dézipper toutes les archives
- Si, comme moi, vous ne souhaitez pas mélanger les torchons et les serviettes, il faut créer un répertoire (par ex : `C:\Program Files\xsltproc`)
- Dans chacune des archives (dézippées), il faut copier tous les fichiers `bin/*.dll` et `bin/*.exe` dans le répertoire `C:\Program Files\xsltproc`.

**1ere contrôle : est-ce que xsltproc s'exécute correctement ?**

- Ouvrir une fenêtre MS-Dos (Command Prompt)
- Parcourir les répertoires jusqu'au répertoire correct : dans notre cas : `C:\Program Files\xsltproc`.
- Taper `xsltproc` dans la fenêtre MS-Dos. La page d'aide de **xsltproc** devrait s'afficher dans la fenêtre. Cela signifie que **xsltproc** fonctionne correctement.

Le test est positif. On peut essayer de publier notre premier manuel en tapant (dans la fenêtre de MS-Dos)

```sh
 xsltproc chemin_absolu_vers_le_répertoire_de_docbook_xsl/html/docbook.xsl chemin_absolu_vers_votre_docbook/docbook.xml
```

Pour le moment, on obtiendra juste le contenu du fichier HTML qui va s'afficher dans la fenêtre de commande. Excepté le fait que le HTML s'affiche à l'intérieur de la fenêtre et non pas dans un fichier, on peut déjà voir qu'il y a deux problèmes ici :

1. quand on souhaite publier notre manuel, il faut qu'on se parcourt les répertoires jusqu'à notre répertoire `xsltproc/` d'abord.
2. puis, on doit taper les longs chemins jusqu'à nos fichiers XSL et XML

Ceci est assez pénible. Voila ce qu'on voudrait dans le meilleur des mondes : être capable de naviguer jusqu'au répertoire où se situe notre manuel (en espérant que nos fichiers XSL et XML se situent au même endroit) et lancer `xsltproc` de là. Cela nous permettrait de raccourcir les chemins à taper dans la ligne de commande.

Cela signifie qu'il doit être possible d'exécuter `xsltproc` de n'importe où. Pour cela, il faut ajouter son répertoire à la variable d'environnement `PATH`. Sur Internet, il est assez facile de trouver un tutorial pour mettre à jour la variable `PATH` adapté à votre version de Windows.

Pour Windows XL en tout cas, on trouvera la variable `PATH` ici : "Poste de travail > Propriétés > Avancé > Variables d'environnement". Là, on peut éditer la variable système "Path". A la fin de la ligne "Valeur de la variable", il faut ajouter le chemin du répertoire contenant les fichiers binaires de **xsltproc** (dans notre cas, `C:\Program Files\xsltproc`). Il ne faut pas ajouter le dernier slash. Et il semblerait qu'il faille redémarrer Windows. En tout cas, c'est ce que j'ai fini par faire.

**2d contrôle : est-ce que xsltproc s'exécute correctement de n'importe où ?**

- Pour contrôler ce point, il faut ouvrir une fenêtre MS-Dos.
- Vérifier que vous n'êtes pas dans le répertoire de **xsltproc**.
- Taper `xsltproc` de là. La page d'aide de **xsltproc** devrait s'afficher dans la fenêtre. Cela signifie que **xsltproc** fonctionne correctement.

Le test est positif. De nouveau, on peut essayer de publier notre manuel.

```sh
xsltproc -o index.html chemin_relatif_vers_le_répertoire_docbook_xsl/html/docbook.xsl chemin_relatif_vers_votre_docbook/docbook.xml
```

Notez qu'on a ajouté `-o index.html`. Cela indique le nom du fichier dans lequel on veut mettre ce qui est retourné par le processeur. Désormais, le contenu HTML qui s'affichait dans la fenêtre MS-Dos est dans le fichier `index.html`.

Glisser-déposer le fichier `index.html` dans votre navigateur préféré. Voici votre manuel. Pas aussi joli que vous l'auriez voulu et pas aussi parfait que vous l'auriez souhaité mais bon, il est là après tout.

Pour ma part, les feuilles de styles Docbook XSL facilitent grandement le boulot et publient facilement un premier brouillon de mon manuel. Mais je vois encore des problèmes :

1. Le layout est plutôt brut... Je n'en suis pas très fan.
2. Le sommaire (TOC) semble parfois être mal placé (à mon opinion)
3. Certaines balises Docbook 5 ne sont pas prises en charge. Je suppose qu'il va falloir que je le fasse moi même.

CONCLUSION : Je vais devoir :

1. Créer une feuille de styles CSS correcte pour améliorer le layout du book
2. Paramétrer un peu le rendu des feuilles de styles Docbook XSL
3. Personnaliser le rendu de fond en développant mes propres feuilles XSL.
