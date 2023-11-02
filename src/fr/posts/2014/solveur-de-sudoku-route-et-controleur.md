---
title: "Solveur de Sudoku - Route et Contrôleur"
permalink: "fr/posts/solveur-de-sudoku-route-et-controleur.html"
date: "2014-04-05T18:05"
slug: solveur-de-sudoku-route-et-controleur
layout: post
drupal_uuid: c9441e6f-bbad-46ba-a64f-ae4e53fddf57
drupal_nid: 57
lang: fr
author: haclong

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "zend framework 2"

sites:
  - "Développement"

summary: "On a eu la brillante idée de rendre la taille de la grille de sudoku variable. Il va donc falloir prévoir un moyen pour sélectionner la taille de la grille.

Le mécanisme est le suivant :
- dans la vue, on crée une interface qui va permettre à l'utilisateur de choisir la taille de sa grille (soit une liste déroulante, soit des liens)
- en fonction du choix opéré sur l'interface, le paramètre va être envoyé dans le contrôleur.
- le contrôleur récupère le paramètre pour l'exploiter (typiquement, pour envoyer cette information au modèle)"
---

On a eu la brillante idée de rendre la taille de la grille de sudoku variable. Il va donc falloir prévoir un moyen pour sélectionner la taille de la grille.

Le mécanisme est le suivant :

- dans la vue, on crée une interface qui va permettre à l'utilisateur de choisir la taille de sa grille (soit une liste déroulante, soit des liens)
- en fonction du choix opéré sur l'interface, le paramètre va être envoyé dans le contrôleur.
- le contrôleur récupère le paramètre pour l'exploiter (typiquement, pour envoyer cette information au modèle)

### Une gestion par lien

On va opter pour la gestion par des liens.

**La vue :**

Il faudra donc créer un lien pour chaque taille de grille. Chaque lien appellera toujours le même contrôleur (inutile de créer des contrôleurs différents en fonction de la taille de la grille de sudoku) et chaque lien comportera, sans nul doute, un paramètre qui indiquera la taille de la grille.

**La route :**

Dans le cadre d'un application montée avec Zend Framework, si on introduit un paramètre dans une URL, il faut que ce paramètre soit "pris en charge" par la route. Il faudra donc aller modifier la route pour qu'elle sache qu'on peut - optionnellement - lui envoyer un paramètre.

**Le contrôleur :**

Une fois que la route sait prendre un charge un paramètre, le contrôleur saura comment récupérer ce paramètre.

Passons aux choses sérieuses

Si vous avez gardé le **ZendApplicationSkeleton** en l'état, on va modifier le layout et utiliser à profit le bandeau de navigation pour positionner les liens qui correspondent aux tailles de la grille.

```php
// module/Application/view/layout/layout.phtml
...
<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      
      <div class="navbar-brand"><?php echo $this->translate('Sudoku Solver') ?></div>
    </div>
 
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        // ajouter les tailles des grilles à chaque lien
        <li class="active"><a href="<?php echo $this->url('home') ?>4"><?php echo $this->translate('4x4') ?></a></li>
        <li class="active"><a href="<?php echo $this->url('home') ?>9"><?php echo $this->translate('9x9') ?></a></li>
        <li class="active"><a href="<?php echo $this->url('home') ?>16"><?php echo $this->translate('16x16') ?></a></li>
        <li class="active"><a href="<?php echo $this->url('home') ?>25"><?php echo $this->translate('25x25') ?></a></li>
      </ul>
    </div><!--/.nav-collapse -->
  </div>
</nav>
```

`$this->translate()` est par défaut dans le **ZendApplicationSkeleton**. Toutefois, nous n'avons pas véritablement besoin de sa fonction. On pourrait tout aussi bien s'en passer.

`<?php echo $this->url('home') ?>` construit le lien vers la route nommée comme la "home" de l'application. `<a href="<?php echo $this->url('home') ?>9">` induit que la route nommée "*home*" admet des paramètres dans l'url. C'est comme si on écrivait `<a href="ma_home.php?taille=9">` en plus joli.

### Modifions maintenant la route

```php
// module/Application/config/module.config.php

return array(
  'router' => array(
    'routes' => array(
      'home' => array(
        'type' => 'segment', // on précise au gestionnaire de route que la route attend des paramètres optionnels
        'options' => array(
          'route' => '/[:size]', //on rajoute le paramètre dans la route. Et c'est tout.
          'defaults' => array(
            'controller' => 'Application\Controller\Index', // le nom "invokable" défini dans le même fichier module.config.php
            'action' => 'index',
          ),
        ),
      ),
    ),
  ),
);
```

Le paramétrage est simplissime et se greffe facilement sur la route initiale. Au passage, on en profite pour nommer le paramètre (size), pour qu'on puisse le retrouver dans le controleur.

**TODO :** il faudrait, pour être correct, filtrer le paramètre (`size`) avec une liste finie de valeur possible. En effet, on ne voudrait pas que l'utilisateur s'amuse à générer une grille de sudoku de 8 cases de côté par exemple en saisissant manuellement `<a href="http://localhost/SudokuSolver/8">http://localhost/SudokuSolver/8</a>` dans sa barre d'adresse, n'est ce pas ?

### Passons maintenant au contrôleur

```php
// module/Application/src/Application/Controller/IndexController.php

<?php
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class IndexController extends AbstractActionController
{
  public function indexAction()
  {
    // pour retrouver le paramètre dans l'url
    // dans la route, on a nommé le paramètre 'size'
    // si aucune paramètre n'est passé, mettre 9 par défaut
    $size = (int) $this->params()->fromRoute('size', 9) ;

    // on se souvient que le tableau $grille doit comporter des clés numérotées à partir de 1 pour que le calcul des limites de région tombe juste.
    for($i = 1; $i<=$size; $i++)
    {
      for($j = 1; $j <= $size; $j++)
      {
        $array[$i][$j] = $i . ' - ' . $j ;
      }
    }
 
    $view = array(
      'grille' => $array,
    ) ;
    return $view ;
  }
}
```

Maintenant que notre contrôleur génère lui même le tableau `$grille`, on peut aller supprimer le tableau `$grille` créé à la main dans notre vue `index.phtml`.

```php
// module/Application/view/application/index/index.phtml

<table class="sudoku_grid">
  <?php
    // $grille est maintenant envoyé par le contrôleur.
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
```

Ouvrez votre navigateur favori : `http://localhost/SudokuSolver`

Un tableau-plus-basique-que-ça-tu-meurs s'affiche. De 9x9 cases. Testez les liens et vous pourrez constatez que votre tableau change de taille.
