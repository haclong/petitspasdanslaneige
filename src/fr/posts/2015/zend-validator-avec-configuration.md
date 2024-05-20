---
title: "Zend Validator avec configuration"
permalink: "fr/posts/zend-validator-avec-configuration.html"
date: "2015-02-08T14:35"
slug: zend-validator-avec-configuration
layout: post
drupal_uuid: 1c49ace3-5b18-4f5c-b929-23f0165b3ff6
drupal_nid: 129
lang: fr
author: haclong

book:
  book: configuration-dans-zend-framework-2
  rank: 8,
  top: 
    url: /fr/books/configuration-dans-zend-framework-2.html
    title: Configuration dans Zend Framework 2
  previous:
    url: /fr/posts/zend-filter-par-configuration.html
    title: Zend Filter par configuration

media:
  path: /img/teaser/240_F_65801716_Yq2jOxAZPSuynsc1l541JgKzytKOuHZJ.jpg

tags:
  - "zend framework 2"
  - "ZF2"
  - "configuration"
  - "factory"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Après avoir vu comment on mettait en place un inputFilter (ensemble d'élément Input), on voit maintenant comment appliquer des validateurs sur chaque élément Input de notre inputFilter."
---

Après avoir vu comment on mettait en place un **inputFilter** (ensemble d'élément **Input**), on voit maintenant comment appliquer des *validateurs* sur chaque élément **Input** de notre **inputFilter**.

NOTE : Un *validateur* : il confronte les informations en entrée à des conditions (en fonction du *validateur* choisi) et retourne un booléen si les informations en entrée sont validées ou pas aux conditions du *validateur*.

C'est la présentation des *validateurs* en mode tableau de configuration (à utiliser avec la **factory**)

```php
'validators' => array(
  array(
    'name' => 'alnum' // 'Zend\I18n\Validator\Alnum',
    'options' => array(
      'allowWhiteSpace' => bool // default false
    ),
  ),

  array(
    'name' => 'alpha' // 'Zend\I18n\Validator\Alpha',
    'options' => array(
      'allowWhiteSpace' => bool // default false
    ),
  ),

  array(
    'name' => 'barcode' // 'Zend\Validator\Barcode',
    'options' => array(
      'adapter' => string // instance de Zend\Validator\Barcode\AbstractAdapter. Default Ean13
      'options' => array()
      'length' => // default null (override by adapter)
      'useChecksum' => // default null (override by adapter)
    ),
  ),
  // list of available barcode adapter
  'Zend\Validator\Barcode\Codabar' => 'Codeabar'
  'Zend\Validator\Barcode\Code128' => 'Code128'
  'Zend\Validator\Barcode\Code25interleaved' => 'Code25interleaved'
  'Zend\Validator\Barcode\Code25' => 'Code25'
  'Zend\Validator\Barcode\Code39ext' => 'Code39ext'
  'Zend\Validator\Barcode\Code39' => 'Code39'
  'Zend\Validator\Barcode\Code93ext' => 'Code93ext'
  'Zend\Validator\Barcode\Code93' => 'Code93'
  'Zend\Validator\Barcode\Ean12' => 'Ean12'
  'Zend\Validator\Barcode\Ean13' => 'Ean13'
  'Zend\Validator\Barcode\Ean14' => 'Ean14'
  'Zend\Validator\Barcode\Ean18' => 'Ean18'
  'Zend\Validator\Barcode\Ean2' => 'Ean2'
  'Zend\Validator\Barcode\Ean5' => 'Ean5'
  'Zend\Validator\Barcode\Ean8' => 'Ean8'
  'Zend\Validator\Barcode\Gtin12' => 'Gtin12'
  'Zend\Validator\Barcode\Gtin13' => 'Gtin13'
  'Zend\Validator\Barcode\Gtin14' => 'Gtin14'
  'Zend\Validator\Barcode\Identcode' => 'Identcode'
  'Zend\Validator\Barcode\Intelligentmail' => 'Intelligentmail'
  'Zend\Validator\Barcode\Issn' => 'Issn'
  'Zend\Validator\Barcode\Itf14' => 'Itf14'
  'Zend\Validator\Barcode\Leitcode' => 'Leitcode'
  'Zend\Validator\Barcode\Planet' => 'Planet'
  'Zend\Validator\Barcode\Postnet' => 'Postnet'
  'Zend\Validator\Barcode\Royalmail' => 'Royalmail'
  'Zend\Validator\Barcode\Sscc' => 'Sscc'
  'Zend\Validator\Barcode\Upca' => 'Upca'
  'Zend\Validator\Barcode\Upce' => 'Upce'

  array(
    'name' => 'between' // 'Zend\Validator\Between',
    'options' => array(
      'inclusive' => bool // default true
      'min' => int // default 0
      'max' => int // default PHP_INT_MAX
    ),
  ),

  array(
    'name' => 'bitwise' // 'Zend\Validator\Bitwise',
    // http://fr2.php.net/manual/en/language.operators.bitwise.php
    'options' => array(
      'control' => int
      'operator' => // 'xor' | 'and'
      'strict' => bool
    ),
  ),

  array(
    'name' => 'callback' // 'Zend\Validator\Callback',
    'options' => array(
      'callback' => string | array // default null
      'callbackOptions' => array() // options du callback
    ),
  ),

  array(
    'name' => 'creditcard' // 'Zend\Validator\CreditCard',
    'options' => array(
      'service' => // default null
      'type' => string // Type de la carte de crédit
    ),
  ),
  // list of available credit card type
  Zend\Validator\CreditCard::AMERICAN_EXPRESS = 'American_Express'
  Zend\Validator\CreditCard::DINERS_CLUB = 'Diners_Club'
  Zend\Validator\CreditCard::DINERS_CLUB_US = 'Diners_Club_US'
  Zend\Validator\CreditCard::DISCOVER = 'Discover'
  Zend\Validator\CreditCard::JCB = 'JCB'
  Zend\Validator\CreditCard::LASER = 'Laser'
  Zend\Validator\CreditCard::MAESTRO = 'Maestro'
  Zend\Validator\CreditCard::MASTERCARD = 'Mastercard'
  Zend\Validator\CreditCard::SOLO = 'Solo'
  Zend\Validator\CreditCard::UNIONPAY = 'Unionpay'
  Zend\Validator\CreditCard::VISA = 'Visa'

  array(
    'name' => 'csrf' // 'Zend\Validator\Csrf',
    // used with Zend\Form\Element\Csrf for validation
    // When adding the element to the form, possibility to set validator options there
    'options' => array(
      'name' =>
      'salt' =>
      'session' =>
      'timeout' =>
    ),
  ),

  array(
    'name' => 'date' // 'Zend\Validator\Date',
    'options' => array(
      'format' => // default 'Y-m-d'
      'locale' => string // locale string (en_EN)
    ),
  ),

  array(
    'name' => 'datestep' // 'Zend\Validator\DateStep',
    // used with Zend\Form\Element\Date for validation
    'options' => array(
      'baseValue' =>
      'step' => // DateInterval
      'format' =>
      'timezone' => // DateTimeZone
    ),
  ),

  array(
    'name' => 'datetime' // 'Zend\I18n\Validator\DateTime',
    // used with Zend\Form\Element\Date for validation
    // http://fr2.php.net/manual/en/book.intl.php
  ),

  array(
    'name' => 'dbnorecordexists' // 'Zend\Validator\Db\NoRecordExists',
    'options' => array(
      'adapter' => // database adapter
      'exclude'
      'field'
      'schema'
      'table'
    ),
  ),

  array(
    'name' => 'dbrecordexists' // 'Zend\Validator\Db\RecordExists',
    'options' => array(
      'adapter' => // database adapter
      'exclude'
      'field'
      'schema'
      'table'
    ),
  ),

  array(
    'name' => 'digits' // 'Zend\Validator\Digits',
  ),

  array(
    'name' => 'emailaddress' => 'Zend\Validator\EmailAddress',
    'options' => array(
      'useMxCheck' => bool // default false
      'useDeepMxCheck' => bool // default false
      'useDomainCheck' => bool // default true
      // http://framework.zend.com/manual/current/en/modules/zend.validator.hostname.html
      'allow' => // default Zend\Validator\Hostname::ALLOW_DNS
      'hostnameValidator' => // default null
    ),
  ),

  array(
    'name' => 'float' // 'Zend\I18n\Validator\Float',
    'options' => array(
      'locale' => string // locale string (en_EN)
    ),
  ),

  array(
    'name' => 'greaterthan' // 'Zend\Validator\GreaterThan',
    'options' => array(
      'min' => int
      'inclusive' => bool
    ),
  ),

  array(
    'name' => 'hex' // 'Zend\Validator\Hex',
  ),

  array(
    'name' => 'hostname' // 'Zend\Validator\Hostname',
    'options' => array(
      'allow' => int
      'useIdnCheck' => bool // default true
      'ipValidator' => // Zend\Validator\Ip
      'useTldCheck' => bool // default true
    ),
  ),
  // list of available hostname allow values
  Zend\Validator\Hostname::ALLOW_DNS = 1
  Zend\Validator\Hostname::ALLOW_IP = 2
  Zend\Validator\Hostname::ALLOW_LOCAL = 4
  Zend\Validator\Hostname::ALLOW_URI = 8
  Zend\Validator\Hostname::ALLOW_ALL = 15

  array(
    'name' => 'iban' // 'Zend\Validator\Iban',
    'options' => array(
      'country_code' => string // Country code by ISO 3166-1
      'allow_non_sepa' => bool // default true
    ),
  ),

  array(
    'name' => 'identical' // 'Zend\Validator\Identical',
    'options' => array(
      'strict' => bool // default true
      'token' =>
      'literal' => bool // default false
    ),
  ),

  array(
    'name' => 'inarray' // 'Zend\Validator\InArray',
    'options' => array(
      'recursive' => bool
      'strict' => int // default 0
      'haystack' => array()
    ),
  ),
  // comparative value $strict option
  Zend\Validator\InArray::COMPARE_NOT_STRICT = -1
  Zend\Validator\InArray::COMPARE_NOT_STRICT_AND_PREVENT_STR_TO_INT_VULNERABILITY = 0
  Zend\Validator\InArray::COMPARE_STRICT = 1

  array(
    'name' => 'int' // 'Zend\I18n\Validator\Int',
    'options' => array(
      'locale' => string // locale string (en_EN)
    ),
  ),

  array(
    'name' => 'ip' // 'Zend\Validator\Ip',
    'options' => array(
      'allowipv4' => bool // default true
      'allowipv6' => bool // default true
      'allowipvfuture' => bool // default false
      'allowliteral' => default true
    ),
  ),

  array(
    'name' => 'isbn' // 'Zend\Validator\Isbn',
    'options' => array(
      'type' => string
      'separator' => string // default ''
    ),
  ),
  // list of isbn types available $type option
  Zend\Validator\Isbn::AUTO = 'auto'
  Zend\Validator\Isbn::ISBN10 = '10'
  Zend\Validator\Isbn::ISBN13 = '13'
  Zend\Validator\Isbn::INVALID = 'isbnInvalid'
  Zend\Validator\Isbn::NO_ISBN = 'isbnNoIsbn'

  array(
    'name' => 'isinstanceof' // 'Zend\Validator\IsInstanceOf',
    'options' => array(
      'classname' => string
    ),
  ),

  array(
    'name' => 'lessthan' // 'Zend\Validator\LessThan',
    'options' => array(
      'max' => int
      'inclusive' => bool // default false
    ),
  ),

  array(
    'name' => 'notempty' // 'Zend\Validator\NotEmpty',
    'options' => array(
      'type' => // Zend\Validator\NotEmpty types
    ),
  ),
  // list of Zend\Validator\NotEmpty Types
  Zend\Validator\NotEmpty::BOOLEAN => 'boolean' = 0x001,
  Zend\Validator\NotEmpty::INTEGER => 'integer' = 0x002,
  Zend\Validator\NotEmpty::FLOAT => 'float' = 0x004,
  Zend\Validator\NotEmpty::STRING => 'string' = 0x008,
  Zend\Validator\NotEmpty::ZERO => 'zero' = 0x010,
  Zend\Validator\NotEmpty::EMPTY_ARRAY => 'array' = 0x020,
  Zend\Validator\NotEmpty::NULL => 'null' = 0x040,
  Zend\Validator\NotEmpty::PHP => 'php' = 0x07F,
  Zend\Validator\NotEmpty::SPACE => 'space' = 0x080,
  Zend\Validator\NotEmpty::OBJECT => 'object' = 0x100,
  Zend\Validator\NotEmpty::OBJECT_STRING => 'objectstring' = 0x200,
  Zend\Validator\NotEmpty::OBJECT_COUNT => 'objectcount' = 0x400,
  Zend\Validator\NotEmpty::ALL => 'all' = 0x7FF,

  array(
    'name' => 'phonenumber' // 'Zend\I18n\Validator\PhoneNumber',
    'options' => array(
      'country' => string // ISO 3611 Country code
      'allowed_types' => array // tableau des types possibles (chaine de caractère saisie libre)
      'allow_possible' => bool
    ),
  ),

  array(
    'name' => 'postcode' // 'Zend\I18n\Validator\PostCode',
    'options' => array(
      'locale' => string // locale string (en_EN)
      'format' => string // regex
      'service'
    ),
  ),

  array(
    'name' => 'regex' // 'Zend\Validator\Regex',
    'options' => array(
      'pattern' => string // regex
    ),
  ),

  // Sitemap validation http://www.sitemaps.org/protocol.html
  array(
    'name' => 'sitemapchangefreq' // 'Zend\Validator\Sitemap\Changefreq',
  ),
  array(
    'name' => 'sitemaplastmod' // 'Zend\Validator\Sitemap\Lastmod',
  ),
  array(
    'name' => 'sitemaploc' // 'Zend\Validator\Sitemap\Loc',
  ),
  array(
    'name' => 'sitemappriority' // 'Zend\Validator\Sitemap\Priority',
  ),

  array(
    'name' => 'step' // 'Zend\Validator\Step',
    'options' => array(
      'baseValue' => string
      'step' => string
    ),
  ),

  array(
    'name' => 'stringlength' // 'Zend\Validator\StringLength',
    'options' => array(
      'encoding' => string // charset encoding
      'min' => int
      'max' => int
    ),
  ),

  array(
    'name' => 'uri' // 'Zend\Validator\Uri',
    'options' => array(
      'uriHandler' => Zend\Uri\Uri
      'allowRelative' => bool
      'allowAbsolute' => bool
    ),
  ),
),
```

Validateurs pour fichiers

```php
'validators' => array(
  array(
    'name' => 'filecount' // 'Zend\Validator\File\Count',
    // compte le nb de fichiers
    'options' => array(
      'min' => int
      'max' => int
    ),
  ),
 
  array(
    'name' => 'fileexists' // 'Zend\Validator\File\Exists',
    'options' => array(
      'directory' => array // default null
    ),
  ),
 
  array(
    'name' => 'filenotexists' // 'Zend\Validator\File\NotExists',
    'options' => array(
      // voir 'fileexists'
    ),
  ),

  array(
    'name' => 'fileextension' // 'Zend\Validator\File\Extension',
    'options' => array(
      'case' => bool // default false
      'extension' => '' // list of extension
    ),
  ),
 
  array(
    'name' => 'fileexcludeextension' // 'Zend\Validator\File\ExcludeExtension',
    'options' => array(
      // voir 'fileextension'
    ),
  ),

  array(
    'name' => 'filehash' // 'Zend\Validator\File\Hash',
    // http://php.net/manual/en/book.hash.php
    'options' => array(
      'algorithm' => string // default 'crc32'
      'hash' => string // default null
    ),
  ),
 
  array(
    'name' => 'filecrc32' // 'Zend\Validator\File\Crc32',
    // http://php.net/manual/en/book.hash.php
    'options' => array(
      'hash' => string // default null
    ),
  ),
 
  array(
    'name' => 'filemd5' // 'Zend\Validator\File\Md5',
    // http://php.net/manual/en/book.hash.php
    'options' => array(
      'hash' => string // default null
    ),
  ),
 
  array(
    'name' => 'filesha1' // 'Zend\Validator\File\Sha1',
    // http://php.net/manual/en/book.hash.php
    'options' => array(
      'hash' => string // default null
    ),
  ),

  array(
    'name' => 'filesize' // 'Zend\Validator\File\Size',
    'options' => array(
      'min' => int // default null
      'max' => int // default null
      'useBiteString' => bool // default true
    ),
  ),
 
  array(
    'name' => 'filefilessize' // 'Zend\Validator\File\FilesSize',
    'options' => array(
      'min' => int // default null
      'max' => int // default null
      'useBiteString' => bool // default true
    ),
  ),

  array(
    'name' => 'fileimagesize' // 'Zend\Validator\File\ImageSize',
    'options' => array(
      'minWidth' => int // default null
      'maxWidth' => int // default null
      'minHeight' => int // default null
      'maxHeight' => int // default null
    ),
  ),

  array(
    'name' => 'filemimetype' // 'Zend\Validator\File\MimeType',
    'options' => array(
      'enableHeaderCheck' => bool // default false
      'disableMagicFile' => bool // default false
      'magicFile' => string
      'mimeType' => string | array
    ),
  ),
 
  array(
    'name' => 'fileexcludemimetype' // 'Zend\Validator\File\ExcludeMimeType',
    'options' => array(
      // voir 'fileextension'
    ),
  ),
 
  array(
    'name' => 'fileiscompressed' // 'Zend\Validator\File\IsCompressed',
  ),

  array(
    'name' => 'fileisimage' // 'Zend\Validator\File\IsImage',
  ),

  array(
    'name' => 'fileupload' // 'Zend\Validator\File\Upload',
    'options' => array(
      'files' => array
    ),
  ),
 
  array(
    'name' => 'fileuploadfile' // 'Zend\Validator\File\UploadFile',
    // used with Zend\Form\Element\File component + its inputFilter
  ),
 
  array(
    'name' => 'filewordcount' // 'Zend\Validator\File\WordCount',
    'options' => array(
      'min' => int
      'max' => int
    ),
  ),
)
```