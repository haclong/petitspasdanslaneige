---
title: "Solveur de Sudoku - Résoudre des grilles plus compliquées"
permalink: "fr/posts/solveur-de-sudoku-resoudre-des-grilles-plus-compliquees.html"
date: "2014-06-04T22:53"
slug: solveur-de-sudoku-resoudre-des-grilles-plus-compliquees
layout: post
drupal_uuid: 7d1faf4b-a8b4-474b-97b6-e025b4b3626a
drupal_nid: 66
lang: fr
author: haclong

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "POO"

sites:
  - "Développement"

summary: "Notre solveur de sudoku sait maintenant résoudre des grilles de sudoku très simples. Il sait placer des chiffres dans les cases en éliminant les chiffres possibles dans chacune des cases jusqu'au dernier chiffre possible. C'est le résultat du premier niveau de déduction. Voyons maintenant le second niveau."
---

Notre solveur de sudoku sait maintenant résoudre des grilles de sudoku très simples. Il sait placer des chiffres dans les cases en éliminant les chiffres possibles dans chacune des cases jusqu'au dernier chiffre possible. C'est le résultat du premier niveau de déduction. Voyons maintenant le second niveau.

Nous avons déterminé (arbitrairement) deux niveaux de déduction.

Le premier niveau dit : un chiffre placé dans une case élimine le même chiffre parmi les chiffres possibles dans les cases qui se situent sur la même ligne, la même colonne et la même région. D'élimination en élimination, un chiffre peut être validé si il est le dernier chiffre qui reste possible dans une case.

Le second niveau dit : dans un même ensemble de cases (une ligne, une colonne ou une région), si un chiffre est éliminé dans toutes les cases mais reste possible dans une dernière case, alors il est forcément validé dans cette dernière case.

Afin de réaliser ce raisonnement, on va travailler par ensemble de cases :

- il faut récupérer toutes les cases de l'ensemble
- dans chaque ensemble, il faut compter le nombre de cases dans lesquelles un chiffre est possible
- il restera à tester si le chiffre possible apparaît une fois ou plus d'une fois dans l'ensemble de case.

```php
// module/Application/src/Application/Model/Solveur.php

<?php
namespace Application\Model ;

class Solveur
{
  /**
   * Sélectionner le nombre de cases où le chiffre est possible
   *
   * @param int $col Numéro de la colonne
   * @param int $chiffre Chiffre à sélectionner
   *
   * @return array
   */
  protected function getOptionsDansColonne($col, $chiffre)
  {
    $cases = array() ;
    foreach($this->grille->selectionnerCasesDeColonne($col) as $case) {
      if($case->chiffre->getStatutDuNumero($chiffre) == 2) {
        $cases[] = $case ;
      }
    }
    return $cases ;
  }

  /**
   * Valider un numéro s'il est le dernier d'un groupe de cases
   *
   * @return void
   */
  public function validerChiffreDansColonne()
  {
    $tailleGrille = $this->grille->getTaille() ;
 

    for($col=1; $col<=$tailleGrille; $col++) {
      for($chiffre=1; $chiffre<=$tailleGrille; $chiffre++) {
        $array = $this->getOptionsDansColonne($col, $chiffre) ;
        if($this->estDerniereOptionDansGroupe($array)) {
          // n'oubliez pas, $array est un tableau d'objet CaseSudoku
          // s'il n'y a qu'une seule option qui reste dans les cases, alors il n'existe qu'une seule case dans $array
          // par conséquent, la case ne peut être que $array[0]
          $this->grille->validerChiffre($array[0]->getLigne(), $col, $chiffre) ;
        }
      }
    }
  }

  /**
   * Vérifier qu'il ne reste qu'une seule position pour un chiffre
   *
   * @param array $array tableau php des cases d'un même ensemble de cases
   *
   * @return bool
   */
  protected function estDerniereOptionDansGroupe($array)
  {
    if (count($array) == 1) {
      return true ;
    }
    return false ;
  }
}
```

Avec la méthode `validerChiffreDansColonne()`, on a parcouru les colonnes de la grille les unes après les autres. Pour chacune des colonnes, on a compté le nombre de fois qu'un chiffre était en statut *POSSIBLE*. Si pour une colonne et pour un chiffre, il ne reste qu'une seule option possible, alors on valide le chiffre dans cette case.

Il faut construire sur le même modèle la validation des chiffres sur les lignes et dans les régions.

Je pense qu'il y a d'autres moyens pour arriver au même résultat. Je pense notamment qu'il y a un moyen de compter et de valider le numéro en même temps. Ainsi, si un chiffre est en statut *POSSIBLE* dans au moins deux cases, on pourrait sortir de la boucle et on passerait au numéro suivant... Je vous laisse expérimenter et améliorer cette partie...

Une fois qu'on sait faire cette déduction, on peut aller modifier notre méthode `deduit()`. Pour rappel, notre méthode `deduit()` est exécutée à chaque boucle. Tant qu'il est possible de continuer dans les déductions, la méthode retourne *true*. S'il n'est plus possible de faire des déductions, alors la méthode retourne *false* et on sort de la boucle.

Pour le moment, la méthode `deduit()` ne fait qu'éliminer les numéros possibles dans la ligne, la colonne et la région, lorsqu'un numéro est validé dans une case. A éliminer les possibilités les unes après les autres, d'autres chiffres seront validés, pour lesquels on va relancer le processus d'élimination des numéros possibles. Ainsi de suite...

Notre méthode `deduit()` a toutefois un test qui vérifie si des déductions ont été réalisées au terme de l'itération, puisqu'on compare l'état de remplissage de la grille de sudoku avant l'itération et l'état de la grille après l'itération.

On considérera que si le processus d'élimination des numéros possibles ne suffit pas pour résoudre la grille, on finira par tomber sur une itération où la grille sortante est identique à la grille entrante. On sera alors en situation de boucle infinie. Il faut alors dire à notre méthode `deduit()` de changer de stratégie et d'observer les colonnes les unes après les autres en essayant de valider les dernières options de chaque colonne. Une fois qu'on aura validé des numéros dans les colonnes, on rebouclera sur l'élimination des numéros possibles jusqu'à ce qu'on retombe - de nouveau - sur une boucle infinie. Si l'observation des colonnes n'apporte aucun résultat, alors - on est toujours en boucle infinie - on va reporter notre attention sur l'observation des lignes. Si des chiffres ont été validés suite à cette étape, on va reboucler sur l'élimination des numéros possibles, puis on réobservera les colonnes, puis les lignes et enfin les régions.

```php
// module/Application/src/Application/Model/Solveur.php

<?php
namespace Application\Model ;

class Solveur
{
  /**
   * Algorythme de déduction
   *
   * @param array $iteration
   *
   * @return bool / false si on est dans l'incapacité de continuer
   */
  protected function deduit($iteration)
  {
    // si on est dans une boucle infinie, cela signifie qu'on ne peut plus continuer de déduire.
    if($this->boucleInfinie($iteration)) {
      // il faut tenter de déduire un chiffre dans les colonnes.
      $this->validerChiffreDansColonne() ;
      // on réinitialise l'entrée de tableau $tentatives[$iteration]
      $this->tentatives[$iteration] = array() ;
      // on assigne le dernier état de la grille dans l'entrée de tableau $tentatives[$iteration]
      $this->tentatives[$iteration] = $this->photo($this->grille) ;
      // si on a validé des chiffres dans une ou dans plusieurs colonnes, nous ne sommes pas dans le cas d'une boucle infinie. Du coup, on continue à éliminer les options unes à unes avec la méthode eliminerOptions() ;
      // en revanche, si aucun chiffre n'a été validé, on est dans une boucle infinie et on sort de la boucle.
      if($this->boucleInfinie($iteration)) {
        return false ;
      }
    }

    // on élimine les chiffres possibles dans la ligne, colonne et région d'un chiffre qui a été validé.
    $this->eliminerOptions() ;

    // retourner true va nous permettre de continuer de boucler
    return true ;
  }
}
```

Tester ce code avec une grille un peu plus complexe.

Le code complété de la méthode `deduit()`.

```php
protected function deduit($iteration)
{
  // si, après avoir éliminé toutes les options disponibles, on rencontre une boucle infinie, on essaie de déterminer les chiffres dans  les colonnes.
  if($this->boucleInfinie($iteration)) {
    $this->validerChiffreDansColonne() ;
    $this->tentatives[$iteration] = array() ;
    $this->tentatives[$iteration] = $this->photo($this->grille) ;
    
    // si, après avoir éliminé toutes les options, validé les chiffres dans les colonnes, re-éliminé toutes les options, on rencontre une boucle infinie, on essaie de déterminer les chiffres dans les lignes.
    if($this->boucleInfinie($iteration)) {
      $this->validerChiffreDansLigne() ;
      $this->tentatives[$iteration] = array() ;
      $this->tentatives[$iteration] = $this->photo($this->grille) ;
 
      // si, après avoir éliminé toutes les options, valider les chiffres dans les colonnes, relancer l'élimination des options, valider les chiffres dans les lignes, relance l'élimination des options, on est finalement bloqué par une boucle infinie, on lancer la recherche derniers numéros en utilisant la méthode validerChiffreDansRegion()
      if($this->boucleInfinie($iteration)) {
        $this->validerChiffreDansRegion() ;
        $this->tentatives[$iteration] = array() ;
        $this->tentatives[$iteration] = $this->photo($this->grille) ;
 
        if($this->boucleInfinie($iteration)) {
          return false ;
        }
      }
    }
  }

  $this->eliminerOptions() ;

  // retourner true va nous permettre de continuer de boucler
  return true ;
}
```

Si on lance notre solveur maintenant, il devrait résoudre des grilles de difficulté intermédiaire... sous réserve des fluctuations des qualifications des grilles...

Toutefois, il arrive toujours un moment où, malgré les deux raisonnements précédents sur chacune des lignes, chacune des colonnes et chacune des régions, on ne parvienne pas à résoudre une grille. Tous les joueurs de Sudoku le savent déjà, arrivé à ce moment là, il faut commencer à travailler avec des hypothèses.

Nous verrons ensemble la solution que j'ai choisi d'appliquer pour mettre en place mes hypothèses.
