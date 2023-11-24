---
title: "Solveur de Sudoku - Ajouter des hypothèses"
permalink: "fr/posts/solveur-de-sudoku-ajouter-des-hypotheses.html"
date: "2014-06-11T23:04"
slug: solveur-de-sudoku-ajouter-des-hypotheses
layout: post
drupal_uuid: d5166a8e-c63e-4868-a831-77a2052ee4ab
drupal_nid: 67
lang: fr
author: haclong

book:
  book: aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku
  rank: 10,
  top: 
    url: /fr/books/aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku.html
    title: Aborder la programmation orientée objet par l'exemple. Concevoir un solveur de sudoku
  next: 
    url: /fr/posts/solveur-de-sudoku-developper-le-solveur.html
    title: Solveur de Sudoku - Développer le solveur
  previous:
    url: /fr/posts/le-solveur-de-sudoku-mettre-en-place-la-grille.html
    title: Le solveur de Sudoku - Mettre en place la grille

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "POO"

sites:
  - "Développement"

summary: "Notre solveur peut maintenant résoudre des grilles de niveau facile et des grilles de niveau moyen. Notre algorithme écarte des chiffres possibles et déduit des chiffres dans deux cas : soit tous les numéros possibles ont été éliminés et le dernier numéro possible est alors validé dans la case, soit un numéro n'est possible que dans une seule case d'un groupe de cases (ligne, colonne ou région). Toutefois, ces deux méthodes ne suffisent pas toujours pour résoudre une grille de sudoku.
Nous allons mettre en place un mécanisme pour émettre des hypothèses dans notre solveur."
---

Notre solveur peut maintenant résoudre des grilles de niveau facile et des grilles de niveau moyen. Notre algorithme écarte des chiffres possibles et déduit des chiffres dans deux cas : soit tous les numéros possibles ont été éliminés et le dernier numéro possible est alors validé dans la case, soit un numéro n'est possible que dans une seule case d'un groupe de cases (ligne, colonne ou région). Toutefois, ces deux méthodes ne suffisent pas toujours pour résoudre une grille de sudoku.

Nous allons mettre en place un mécanisme pour émettre des hypothèses dans notre solveur.

Evidemment, il m'est impossible de reproduire ici les nombreuses hésitations et tergiversations que j'ai eu durant le développement de cette partie. Vous hériterez donc de la version finale et on pourrait alors croire que tout était planifié depuis le début...

Voici les principes de notre développement :

- faire une première hypothèse. L'hypothèse consiste à valider dans une case vide un des numéros qui n'a pas encore été éliminé par les déductions antérieures.
- une fois que l'hypothèse est faite, on applique sur la grille les mêmes déductions développées : éliminer des options dans la ligne, la colonne et la région et déduire des chiffres dans les colonnes, les lignes et les régions...
- si l'hypothèse mène à une boucle infinie, alors il est impossible de dire si l'hypothèse est bonne ou si elle est fausse. On va donc ignorer l'hypothèse émise, revenir à la grille telle qu'elle était avant l'hypothèse et on va émettre une autre hypothèse.
  - il faut pouvoir revenir à l'état de la grille avant hypothèse
  - par conséquent, il faut avoir sauvegarder la grille avant de faire l'hypothèse.
- si l'hypothèse mène à une incohérence (deux numéros sur la même ligne, sur la même colonne ou sur la même région), alors on va considérer que l'hypothèse est fausse, on va éliminer le chiffre en statut POSSIBLE dans la case de l'hypothèse, retourner à la grille telle qu'elle était avant l'hypothèse, et on va émettre une autre hypothèse.
  - il faut une méthode pour déterminer si une grille est incohérente ou pas
  - il faut stocker les informations de l'hypothèse faussée pour savoir dans quelle case de la grille on doit éliminer quel chiffre.
- si l'hypothèse mène à la résolution de la grille, on va pas se poser de questions... après tout, c'est le but de notre solveur non ?

Allez, voyons nos méthodes

```php
// module/Application/src/Application/Model/Solveur.php

<?php
namespace Application\Model ;

class Solveur
{
  /**
   * Identifier une case vide, arbitrairement, la première.
   *
   * @return $case | bool
   */
  protected function identifierCaseVide()
  {
    // on parcourt toutes les cases de la grille
    foreach($this->grille->getCases() as $case) {
      // on retourne la première case vide trouvée
      if($case->chiffre->estInconnu()) {
        return $case ;
      }
    }
    return false ;
  }

  /**
   * Identifier le premier chiffre possible dans la case.
   *
   * @param $case CaseSudoku
   *
   * @return int $chiffre
   */
  protected function identifierChiffrePossible($case)
  {
    for($chiffre = 1; $chiffre <= $this->grille->getTaille(); $chiffre++) {
      if($case->chiffre->getStatutDuNumero($chiffre) == 2) {
        return $chiffre ;
      }
    }
    return false ;
  }
 
  /**
   * Sauvegarder la grille - copier la grille dans une version sauvegardée
   *
   * @return void
   */
  public function sauverGrille()
  {
    foreach($this->grille->getCases() as $case) {
      $case->sauvegarderChiffre() ;
    }
  }

  /**
   * Restaurer la grille - récupérer la version sauvegarder
   *
   * @return array CaseSudoku
   */
  public function restaurerGrille()
  {
    foreach($this->grille->getCases() as $case) {
      $case->restaurerChiffre() ;
    }
  }

  // Rajouter la propriété au début du fichier
  /**
   * La propriété va sauvegarder les informations de l'hypothèse
   *
   * @var array
   */
  private $hypothese = array() ;

  /**
   * Faire une hypothèse
   *
   * @return void
   */
  protected function emettreHypothese()
  {
    // tester si la propriété $hypothese est remplie ou pas
    if(count($this->hypothese) == 0) {
      // si l'hypothèse est vide, sauvegarder la grille avant de faire une hypothèse.
      $this->sauverGrille() ;
    } else {
      // si l'hypothèse a déjà été faite cela signifie que l'hypothèse précédente produit une boucle infinie. Il faut annuler l'hypothèse, revenir à la grille sauvegardée et émettre une autre hypothèse.
      $this->restaurerGrille() ;
      $this->sauverGrille() ;
    }

    // identifier la case sur laquelle on va faire notre hypothèse.
    // pour que notre code soit correct, on devrait tester que la méthode identifierCaseVide() retourne bien un objet CaseSudoku et non pas un booléen
    $caseHypothese = $this->identifierCaseVide() ;
    // identifier le chiffre qui va servir pour l'hypothèse.
    $chiffreHypothese = $this->identifierChiffrePossible($caseHypothese) ;
    // stocker les informations de la case et du chiffre utilisé pour l'hypothèse.
    $this->hypothese = array('ligne' => $caseHypothese->getLigne(), 'colonne' => $caseHypothese->getColonne(), 'chiffre' => $chiffreHypothese) ;

    // une fois que la case est identifiée et que le chiffre aussi, on fait l'hypothèse en validant le chiffre dans la case.
    $this->grille->validerChiffre($caseHypothese->getLigne(), $caseHypothese->getColonne(), $chiffreHypothese) ;
  }

  /**
   * Revenir en arrière et annuler les effets de l'hypothèse
   *
   * @return void
   */
  protected function annulerHypothese()
  {
    // récupérer la grille sauvegardée
    $this->restaurerGrille() ;

    // utiliser les informations de l'hypothèse, stockées dans la propriété $hypothèse pour éliminer une possibilité dans une case de la grille. 
    $this->grille->eliminerChiffre($this->hypothese['ligne'], $this->hypothese['colonne'], $this->hypothese['chiffre']) ;
    // réinitialiser la propriété $hypothese
    $this->hypothese = array() ;
  }
}
```

Toutes nos méthodes sont définies. Pour la validation de la grille (et vérifier que les règles de sudoku sont bien respectées), souvenons nous que nous avons une méthode `estValide()` dans notre objet **Grille**.

Complétons notre méthode `deduit()` en lui intégrant les hypothèses : faire une hypothèse, si la grille n'est pas valide, restaurer la grille.

```php
protected function deduit($iteration)
{
  // si, après avoir éliminé toutes les options disponibles, on rencontre une boucle infinie, on essaie de déterminer les chiffres dans les colonnes.
  if($this->boucleInfinie($iteration)) {
    $this->validerChiffreDansColonne() ;
    $this->tentatives[$iteration] = array() ;
    $this->tentatives[$iteration] = $this->photo($this->grille) ;

    // si, après avoir éliminé toutes les options, validé les chiffres dans les colonnes, re-éliminé toutes les options, on rencontre une boucle infinie, on essaie de déterminer les chiffres dans les lignes.
    if($this->boucleInfinie($iteration)) {
      $this->validerChiffreDansLigne() ;
      $this->tentatives[$iteration] = array() ;
      $this->tentatives[$iteration] = $this->photo($this->grille) ;

      // si, après avoir éliminé toutes les options, validé les chiffres dans les colonnes, relancer l'élimination des options, validé les chiffres dans les lignes, relance l'élimination des options, on est finalement bloqué par une boucle infinie, on essaie de déterminer les chiffres dans les régions
      if($this->boucleInfinie($iteration)) {
        $this->validerChiffreDansRegion() ;
        $this->tentatives[$iteration] = array() ;
        $this->tentatives[$iteration] = $this->photo($this->grille) ;

        // si, après avoir éliminé toutes les options, validé les chiffres dans les colonnes, dans les lignes et dans les régions, on est toujours dans une boule infinie, on émet une hypothèse.
        if($this->boucleInfinie($iteration)) {
          $this->emettreHypothese() ;
          $this->tentatives[$iteration] = array() ;
          $this->tentatives[$iteration] = $this->photo($this->grille) ;
 
          // si, malgré tout, on est toujours dans une boucle infinie, alors on quitte le solveur.
          if($this->boucleInfinie($iteration)) {
            return false ;
          }
        }
      }
    }
  }

  // on élimine systématiquement les possibilités chaque fois qu'on valide des numéros.
  $this->eliminerOptions() ;
  // on annule l'hypothèse si la grille n'est pas valide
  if(!$this->grille->estValide()) {
    $this->annulerHypothese() ;
  }

  // retourner true va nous permettre de continuer de boucler
  return true ;
}
```

Et voila... notre solveur est terminé.

Les tests unitaires à faire sont relativement simple : on crée une grille de sudoku, on fait une première assertion pour démontrer que la grille n'est pas résolue. On instancie alors un objet **Solveur** qu'on exécute et on fait une deuxième assertion qui confirme que la grille est résolue.

```php
// module/Application/test/ApplicationTest/Model/SolveurTest.php
<?php
namespace ApplicationTest\Model ;

use Application\Model\Solveur ;
use Application\Model\Grille ;
use PHPUnit_Framework_TestCase ;

class SolveurTest extends PHPUnit_Framework_TestCase
{
  public function testResolution()
  {
    $g = new Grille(9) ;
    $g->validerChiffre(1, 5, 4) ;
    $g->validerChiffre(1, 9, 5) ;
    $g->validerChiffre(2, 3, 1) ;
    $g->validerChiffre(2, 5, 7) ;
    $g->validerChiffre(2, 7, 9) ;
    $g->validerChiffre(2, 9, 2) ;
    $g->validerChiffre(3, 4, 3) ;
    $g->validerChiffre(3, 8, 7) ;
    $g->validerChiffre(3, 9, 8) ;
    $g->validerChiffre(4, 1, 1) ;
    $g->validerChiffre(4, 2, 8) ;
    $g->validerChiffre(4, 4, 2) ;
    $g->validerChiffre(4, 5, 3) ;
    $g->validerChiffre(4, 6, 4) ;
    $g->validerChiffre(4, 8, 5) ;
    $g->validerChiffre(5, 3, 2) ;
    $g->validerChiffre(5, 4, 9) ;
    $g->validerChiffre(5, 8, 8) ;
    $g->validerChiffre(6, 1, 4) ;
    $g->validerChiffre(6, 2, 5) ;
    $g->validerChiffre(6, 4, 8) ;
    $g->validerChiffre(6, 5, 6) ;
    $g->validerChiffre(6, 6, 7) ;
    $g->validerChiffre(6, 7, 2) ;
    $g->validerChiffre(6, 8, 1) ;
    $g->validerChiffre(7, 2, 1) ;
    $g->validerChiffre(7, 3, 5) ;
    $g->validerChiffre(7, 5, 9) ;
    $g->validerChiffre(7, 7, 8) ;
    $g->validerChiffre(7, 8, 2) ;
    $g->validerChiffre(8, 2, 3) ;
    $g->validerChiffre(8, 4, 7) ;
    $g->validerChiffre(8, 7, 5) ;
    $g->validerChiffre(8, 9, 1) ;
    $g->validerChiffre(9, 2, 2) ;

    $this->assertFalse($g->estResolue()) ;
    $s = new Solveur($g) ;
    $s->execute() ;
    $this->assertTrue($g->estResolue()) ;
  }
}
```

Tadaaa. 4 objets, quelques méthodes plus tard et hop ! Nous avons un solveur de sudoku raisonnablement correct. On peut déplorer que la méthode execute() ne s'arrête qu'au moment où elle a fini d'exécuter l'intégralité de l'algorithme.

L'application est perfectible :

- Trouver un nouvel algorithme avec éventuellement moins de boucles.
- Envoyer les chiffres trouvés les uns après les autres vers la vue... d'abord, on verrait notre solveur fonctionner devant nos yeux et ensuite, on ferait des boucles "plus courtes"... potentiellement on supprimerait les risques de time out.

Potentiellement, je pense que c'est l'objet **Solveur** seul qu'il faut faire évoluer.

### Comment étendre notre application

- Ajouter des fonctionnalités Ajax pour transformer notre solveur en véritable application de sudoku jouable
- Ajouter des fonctionnalités pour pouvoir charger une grille préenregistrée
- Créer des objets Exception dédiée à la grille de Sudoku plutôt que d'utiliser des objets Exception de base.
- Valider que tous les chiffres qui figurent dans la grille de Sudoku sont des chiffres possibles dans la grille

Je vous laisse vous amuser avec tout ça.
