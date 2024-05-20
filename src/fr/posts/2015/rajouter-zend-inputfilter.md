---
title: "Rajouter Zend InputFilter"
permalink: "fr/posts/rajouter-zend-inputfilter.html"
date: "2015-01-30T14:14"
slug: rajouter-zend-inputfilter
layout: post
drupal_uuid: 6e8d9178-bfbe-4321-985b-aec272a70081
drupal_nid: 127
lang: fr
author: haclong

book:
  book: configuration-dans-zend-framework-2
  rank: 3,
  top: 
    url: /fr/books/configuration-dans-zend-framework-2.html
    title: Configuration dans Zend Framework 2
  next: 
    url: /fr/posts/zend-log-logger-avec-configuration.html
    title: Zend Log Logger avec configuration
  previous:
    url: /fr/posts/la-configuration-dans-zend-framework-2-2nde-partie.html
    title: La configuration dans Zend Framework 2 - 2nde partie

media:
  path: /img/teaser/__table_de_mixage_2.jpg

tags:
  - "configuration"
  - "zend framework 2"
  - "factory"
  - "ZF2"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Les fonctionnalités de formulaire de ZF2 permet de monter à la volée (ou programmatiquement) des éléments pour filtrer et valider vos éléments de formulaire. Pour un élément de formulaire (Zend\\Form\\Element), il y a un élément Input (Zend\\InputFilter\\Input), à l'élément global Zend\\Form\\Form, il y a la correspondance Zend\\InputFilter\\InputFilter."
---

Les fonctionnalités de formulaire de ZF2 permet de monter à la volée (ou programmatiquement) des éléments pour filtrer et valider vos éléments de formulaire. Pour un élément de formulaire (`Zend\Form\Element`), il y a un élément `Input` (`Zend\InputFilter\Input`), à l'élément global `Zend\Form\Form`, il y a la correspondance `Zend\InputFilter\InputFilter`.

## Comment paramétrer l'élément Zend\InputFilter\Input utile pour valider un élément de formulaire

Programmatiquement

```php
use Zend\Form\Element ;
use Zend\Form\Form ;
use Zend\InputFilter\Input ;
use Zend\InputFilter\InputFilter ;

$element = new Element('nomdefamille') ;
$element->setLabel('Votre nom de famille') ;
$element->setAttributes(array(
  'type' => 'text',
));
$form = new Form('fiche') ;
$form->add($element) ;

$input = new Input('nomdefamille') ;
// paramétrer l'élément Input ici
$input->setRequired(true) ;
$input->getFilterChain()->attachByName('stringtrim', array $options) ; // soit par le petit nom
$input->getValidatorChain()->attach(new Validator\StringLength(array('min' => 3, 'max' => 16))) ; // soit par le nom de la classe

$inputFilter = new InputFilter() ;
// rattacher l'élément Input à l'InputFilter
$inputFilter->add($inputNomdefamille) ;

// rattacher l'InputFilter au formulaire
$form->setInputFilter($inputFilter) ;
```

Vous pouvez tout aussi bien le faire avec un factory (du formulaire)

```php
use Zend\Form\Factory ;

$factory = new Factory() ;

$form = $factory->createForm(array(
  'elements' => array(
    array(
      'spec' => array(
        'name' => 'nomdefamille',
        'options' => array(
          'label' => 'Votre nom de famille',
        ),
        'type' => 'text',
      ),
    ),
  ),
  'input_filter' => array(
    array(
      'name' => 'nomdefamille',
      'required' => true,
      'filters' => array(
        array('name' => 'stringtrim'),
      ),
      'validators' => array(
        array(
          'name' => 'string_length',
          'options' => array(
            'min' => 3,
            'max' => 16
          ),
        ),
      ),
    ),
  )
);
```

Vous pouvez aussi faire un mix entre le factory et la version programmatique

```php
use Zend\Form\Form;
use Zend\InputFilter\Factory as InputFactory ;
use Zend\InputFilter\InputFilter ;

class MyForm extends Form
{
  public function __construct($name)
  {
    parent::__construct($name) ;

    $inputFilter = new InputFilter() ;
    $factory = new InputFactory() ;

    $this->add(array(
      'name' => 'nomdefamille',
      'options' => array(
        'label' => 'Votre nom de famille',
      ),
      'type' => 'Text',
    )) ;

    $inputFilter->add($factory->createInput(
      array(
        'name' => 'nomdefamille',
        'required' => true,
        'filters' => array(
          array('name' => 'stringtrim'),
        ),
        'validators' => array(
          array(
            'name' => 'string_length',
            'options' => array(
              'min' => 3,
              'max' => 16
            ),
          ),
        ),
      ),
    )) ;

    $this->setInputFilter($inputFilter) ;
  }
}
```

Et vous pouvez également mettre la validation directement dans un champ de formulaire personnalisé

```php
use Zend\Form\Element;
use Zend\InputFilter\InputProviderInterface;

class NomDeFamilleElement extends Element implements InputProviderInterface
{
  public function getInputSpecification()
  {
    return array(
      'name' => $this->getName(),
      'required' => true,
      'filters' => array(
        array('name' => 'stringtrim'),
      ),
      'validators' => array(
        array(
          'name' => 'string_length',
          'options' => array(
            'min' => 3,
            'max' => 16
          ),
        ),
      ),
    ) ;
  }
}
```

Ou bien intégrer la validation directement dans un fieldset (ou un formulaire)

```php
use Zend\Form\Form ;
use Zend\InputFilter\InputFilterProviderInterface ;

class MyForm extends Form implements InputFilterProviderInterface
{
  public function getInputFilterSpecification()
  {
    return array(
      'nomdefamille' => array(
        'required' => true,
        'filters' => array(
          array('name' => 'stringtrim'),
        ),
        'validators' => array(
          array(
            'name' => 'string_length',
            'options' => array(
              'min' => 3,
              'max' => 16
            ),
          ),
        ),
      ),
    ) ;
  }
}
```

La documentation de ZF2 parle également de "lazy-create in the `getInputFilter()` method"... je n'ai aucune idée du comment mais c'est encore une autre façon d'y arriver...

Voilà, nous avons vu différentes façons d'attacher un inputFilter sur un formulaire. Il y en a d'autres, indubitablement. Mais j'espère que vous avez saisi le principe.

Voici le tableau pour paramétrer un objet **Input**

```php
'input' => array(
  'name' => string $name, // nom de l'élément de formulaire à filtrer
  'require' => bool // default true
  'filters' => array() // la liste des filtres à appliquer
  'validators' => array() // la liste des validateurs à appliquer
);
```

Comme on peut le constater, on peut paramétrer les filtres et les validateurs à partir d'un tableau de configuration. La liste des options disponibles très prochainement.
