---
title: "Un solveur de Sudoku - Préparer la vue"
permalink: "fr/posts/un-solveur-de-sudoku-preparer-la-vue.html"
date: "2014-03-25T18:10"
slug: un-solveur-de-sudoku-preparer-la-vue
layout: post
drupal_uuid: 0fb6df8a-4112-45fd-9709-f645f695356a
drupal_nid: 56
lang: fr
author: haclong

book:
  book: aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku
  rank: 3,
  top: 
    url: /fr/books/aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku.html
    title: Aborder la programmation orientée objet par l'exemple. Concevoir un solveur de sudoku
  next: 
    url: /fr/posts/solveur-de-sudoku-route-et-controleur.html
    title: Solveur de Sudoku - Route et Contrôleur
  previous:
    url: /fr/posts/le-solveur-de-sudoku-concevoir-les-objets.html
    title: Le solveur de sudoku - Concevoir les objets

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "zend framework 2"

sites:
  - "Développement"

summary: "Comme je ne suis pas un génie en développement, je vais commencer par préparer ma vue. Deux avantages dans le cadre d'un développement empirique comme j'ai l'habitude de faire :
- on détermine d'ores et déjà la structure de la grille que le contrôleur va envoyer dans la vue.
- une fois que la vue est prête, on pourra vérifier \"de visu\" chaque étape du développement."

---

### Préparer la vue

Comme je ne suis pas un génie en développement, je vais commencer par préparer ma vue. Deux avantages dans le cadre d'un développement empirique comme j'ai l'habitude de faire :

- on détermine d'ores et déjà la structure de la grille que le contrôleur va envoyer dans la vue.
- une fois que la vue est prête, on pourra vérifier "de visu" chaque étape du développement.

### Les possibilités

La grille de sudoku peut être en dur, avec une succession de `<tr>` et de `<td>` écrits à la main dans la vue.

Le contrôleur peut passer le contenu de chacune des cases de la grille à la vue et l'affichage de chacune des valeurs peut se faire une à une dans la vue.

Ce serait effectivement possible, mais pas vraiment efficace, ni intelligent. On ne fait pas un programme pour tout écrire à la main. Surtout une succession de

```php
<tr>
  <td>
    <?php echo $this->valeur_de_ma_case_1 ?>
  </td>
</tr>...
```

L'option la plus logique est de créer la grille avec une boucle. Et pour créer une grille avec des boucles, il faut déterminer quand on doit revenir à la ligne.

Si on utilise une boucle `For`, il faut lui fournir une limite afin que la boucle sache quand finir. Une grille de sudoku contient 9 lignes, chaque ligne contient 9 colonnes. La limite est donc de 9 invariablement.

Invariablement ? Pourtant, il suffirait de pousser un peu pour rendre cette information variable. De plus, le modèle qu'on a esquissé jusqu'à présent ne semble pas avoir une limite au niveau de la taille des éléments. Il pourrait donc s'adapter assez facilement pour une grille de 9 cases de côté, de 16 cases, de 25 cases et même de 4 cases...

Dans le cas où la taille de la grille devient variable, il faut pouvoir fournir à la boucle `For` la limite dont la boucle a besoin pour s'arrêter.

```php
for($i = 0; $i < $limite_de_la_boucle ; $i++) { }
```

La limite de la boucle peut être envoyé à la vue par le contrôleur. Toutefois, cette information peut être facilement déduite des éléments (les cases de la grille) qui sont par ailleurs envoyés à la vue par le contrôleur. Par exemple, une boucle Foreach n'est limitée que par la taille du tableau sur lequel est exécuté la boucle. Ce qui devient l'option la plus intéressante dans notre situation puisque 1/ on n'a plus besoin de connaître la limite de la boucle et 2/ on sait d'ores et déjà que nos données devront être envoyées sous la forme d'un tableau. Et afin de créer une boucle dans une boucle, il faut que le tableau sur lequel on va exécuter la boucle soit un tableau à deux dimensions.

```php
foreach($tableau as $row_id => $ligne)
{
  foreach($ligne as $col_id => $colonne) { }
}
```

Le premier `Foreach` boucle sur les lignes et pour chaque ligne, une seconde boucle `Foreach` va boucler sur les colonnes.

Il ne reste plus qu'à insérer les balises HTML au bon endroit :

1. Vider toute la page index.phtml. On repart d'un fichier vierge.

```php
// module/Application/view/application/index/index.phtml

<?php
// le tableau $grille que le contrôleur va envoyer.
// sans contrôleur pour le moment, nous créons le tableau à la main

$grille[0][0] = '1 - 1' ;
$grille[0][1] = '1 - 2' ;
$grille[0][2] = '1 - 3' ;
$grille[0][3] = '1 - 4' ;
$grille[1][0] = '2 - 1' ;
$grille[1][1] = '2 - 2' ;
$grille[1][2] = '2 - 3' ;
$grille[1][3] = '2 - 4' ;
$grille[2][0] = '3 - 1' ;
$grille[2][1] = '3 - 2' ;
$grille[2][2] = '3 - 3' ;
$grille[2][3] = '3 - 4' ;
$grille[3][0] = '4 - 1' ;
$grille[3][1] = '4 - 2' ;
$grille[3][2] = '4 - 3' ;
$grille[3][3] = '4 - 4' ;
?>

<table border="1">

  <?php
    foreach($grille as $ligne)
    {
  ?>
  
  <tr>

  <?php
    foreach($ligne as $cellule)
    {
      print("<td>" . $cellule . "</td>") ;
    }
  ?>
  
  </tr>

  <?php
    }
  ?>

</table>
```

2. Ouvrez votre navigateur favori.

`http://localhost/SudokuSolver`

Un tableau-plus-basique-que-ça-tu-meurs s'affiche. De 4x4 cases.

Mais bon, le tableau n'est pas joli joli... on va mettre une couche de vernis/css pour décorer tout ça et on enchaîne.

Apportons d'abord des modifications à notre vue. On profitera au passage pour rajouter des balises `<input>` puisqu'on devra pouvoir insérer les numéros dans la grille. La double boucle va légèrement changer pour pouvoir ajouter un nom à chacune des balises `<input>`.

```php
// module/Application/view/application/index/index.phtml
// supprimer l'attribut border et ajouter le style à la balise <table>
<table class="sudoku_grid">

  <?php
    // ajouter la clé à la boucle foreach
    foreach($grille as $num_ligne => $ligne)
    {
  ?>
  
  <tr>

    <?php
    
      // ajouter la clé à la boucle foreach
      foreach($ligne as $num_colonne => $cellule)
      {
        // ajouter la balise <input avec les clés>
        // ajouter le style à la balise <td>
        print("<td class=\"sudoku_case\">
          <input type=\"text\" size=\"1\" name=\"k[".$num_ligne."][".$num_colonne."]\" value=\"" . $cellule . "\"/>
          </td>") ;
      }
    
    ?>
  
  </tr>

  <?php
    }
  ?>
</table>
```

La feuille de style

```css
// public/css/sudoku.css
.sudoku_case {border : 1px solid #aaaaaa ; padding : 8px}
.sudoku_grid {border : 5px solid #cccccc ; margin-top : 30px}
.sudoku_case input {border : 0px ; font-size : 1.8em ; text-align : center}
```

Ne pas oublier d'ajouter notre feuille de style au layout de l'application

```php
// module/Application/view/layout/layout.phtml

<!-- Le styles -->
<?php 

echo $this->headLink(array('rel' => 'shortcut icon', 'type' => 'image/vnd.microsoft.icon', 'href' => $this->basePath() . '/img/favicon.ico'))
  ->prependStylesheet($this->basePath() . '/css/style.css')
  // ajouter la feuille de style
  ->prependStylesheet($this->basePath() . '/css/sudoku.css')
  ->prependStylesheet($this->basePath() . '/css/bootstrap-theme.min.css')
  ->prependStylesheet($this->basePath() . '/css/bootstrap.min.css') 

?>
```

Voyons ce que ça donne dans l'explorateur...

Bon, pas si mal... Mais on ne distingue pas les différentes régions les unes des autres...

Bon, pas le temps de me lancer dans une démonstration mathématique. Il est d'ailleurs plus rapide de le dire que de le démontrer. La largeur d'une région est égale à la racine carrée de la largeur de la grille. Il en va de même pour la hauteur de la région. Ajoutons donc les styles où ils vont bien.

```php
// module/Application/view/application/index/index.phtml

<table class="sudoku_grid">

  <?php
    foreach($grille as $num_ligne => $ligne)
    {
  ?>
  
  <tr>

    <?php
      
      foreach($ligne as $num_colonne => $cellule)
      {
        // calculer les styles pour les régions
        $bordure_bas = "" ;
        $bordure_droite = "" ;
        
        if($num_ligne % sqrt(count($grille)) == 0) {
          $bordure_bas = " region_border_bottom" ;
        }
 
        if($num_colonne % sqrt(count($ligne)) == 0) {
          $bordure_droite = " region_border_right" ;
        }

        // ajouter les styles dans la balise <td>
        print("<td class=\"sudoku_case". $bordure_droite.$bordure_bas."\">
            <input type=\"text\" size=\"1\" name=\"k[".$num_ligne."][".$num_colonne."]\" value=\"" . $cellule . "\"/>
            </td>") ;
      }
  
    ?>
    
  </tr>

  <?php
    }
  ?>
</table>

// public/css/sudoku.css
// ajouter deux nouveaux styles
.region_border_right {border-right : 2px solid #777777}
.region_border_bottom {border-bottom : 3px solid #777777}</pre>
```

Comme on utilise le module (%), il faut que la numérotation des colonnes (et des lignes) tombent juste. Il faut donc que l'index de la 1ere colonne soit un 1 et non pas un 0.

Le tableau $grille attendu doit donc ressembler au tableau suivant

```php
$grille[1][1] = '1 - 1' ;
$grille[1][2] = '1 - 2' ;
$grille[1][3] = '1 - 3' ;
$grille[1][4] = '1 - 4' ;
$grille[2][1] = '2 - 1' ;
$grille[2][2] = '2 - 2' ;
$grille[2][3] = '2 - 3' ;
$grille[2][4] = '2 - 4' ;
$grille[3][1] = '3 - 1' ;
$grille[3][2] = '3 - 2' ;
$grille[3][3] = '3 - 3' ;
$grille[3][4] = '3 - 4' ;
$grille[4][1] = '4 - 1' ;
$grille[4][2] = '4 - 2' ;
$grille[4][3] = '4 - 3' ;
$grille[4][4] = '4 - 4' ;
```

Vérifiez dans le navigateur. Le tableau s'affiche maintenant bien. La grille de sudoku est prête. Revenons maintenant à la navigation. Dans le prochain post, on va mettre en place la navigation, la route et le contrôleur qui va récupérer les paramètres de la route et qui va générer le tableau $grille (celui qu'on a monté en dur dans notre vue).
