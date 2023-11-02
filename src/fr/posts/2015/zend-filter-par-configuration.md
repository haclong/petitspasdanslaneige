---
title: "Zend Filter par configuration"
permalink: "fr/posts/zend-filter-par-configuration.html"
date: "2015-02-03T14:15"
slug: zend-filter-par-configuration
layout: post
drupal_uuid: ca79c315-7292-42f7-8b84-a36c507eed26
drupal_nid: 128
lang: fr
author: haclong

media:
  path: /img/teaser/eau.jpg

tags:
  - "configuration"
  - "ZF2"
  - "zend framework 2"
  - "factory"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Après avoir vu comment on mettait en place un inputFilter (ensemble d'élément Input), on voit maintenant comment appliquer des filtres sur chaque élément Input de notre inputFilter.
"
---

Après avoir vu comment on mettait en place un `inputFilter` (ensemble d'élément Input), on voit maintenant comment appliquer des filtres sur chaque élément `Input` de notre `inputFilter`.

NOTE : un filtre est un transformateur : Ce qui arrive en entrée est retourné soit transformé, traduit, transcodé, crypté, compressé, tronqué...

C'est la présentation des filtres en mode tableau de configuration (à utiliser avec la `factory`)

```php
'filters' => array(
  array(
    'name' => 'alnum' // Zend\I18n\Filter\Alnum
    'options' => array(
      'locale' => string $locale // default null - par ex 'en_US'
      'allow_white_space' => bool / default false
    ),
  ),

  array(
    'name' => 'alpha' // Zend\I18n\Filter\Alpha
    'options' => array(
      'locale' => string $locale // default null - par ex 'en_US'
      'allow_white_space' => bool / default false
    ),
  ),

  array(
    'name' => 'basename' // Zend\Filter\BaseName
  ),

  array(
    'name' => 'boolean' // Zend\Filter\Boolean
    'options' => array(
      'translations' => array() //
      'casting' => bool // default true
      'type' => int $typeBooleen // default TYPE_PHP
    ),
  ),
  // liste des types disponibles
  Zend\Filter\Boolean::TYPE_BOOLEAN => 'boolean' = 1
  Zend\Filter\Boolean::TYPE_INTEGER => 'integer' = 2
  Zend\Filter\Boolean::TYPE_FLOAT => 'float' = 4
  Zend\Filter\Boolean::TYPE_STRING => 'string' = 8
  Zend\Filter\Boolean::TYPE_ZERO_STRING => 'zero' = 16
  Zend\Filter\Boolean::TYPE_EMPTY_ARRAY => 'array' = 32
  Zend\Filter\Boolean::TYPE_NULL => 'null' = 64
  Zend\Filter\Boolean::TYPE_PHP => 'php' = 127
  Zend\Filter\Boolean::TYPE_FALSE_STRING => 'false' = 128
  Zend\Filter\Boolean::TYPE_LOCALIZED => 'localized' = 256
  Zend\Filter\Boolean::TYPE_ALL => 'all' = 511

  array(
    'name' => 'callback' // Zend\Filter\Callback
    'options' => array(
      'callback' => string // default null
      'callback_params' => array() // paramètres du callback
    ),
  ),

  array(
    'name' => 'compress' // Zend\Filter\Compress
    'options' => array(
      'adapter' => string $adapter // default 'Gz'
      'options' => array() ; // options en fonction de l'adapter

      // $adapter == 'Bz2'
      'adapter' => 'Bz2' // 'Zend\Filter\Compress\Bz2',
      'options' => array(
        'blocksize' => int // default 4 - blocksize to use from 0 - 9
        'archive' => string // archive to use - default null
      ),

      // $adapter == 'Gz'
      'adapter' => 'Gz' // 'Zend\Filter\Compress\Gz',
      'options' => array(
        'level' => int // default 9 - Compression level 0-9
        'archive' => string // archive to use - default null
        'mode' => string // compression mode 'compress'|'deflate' - default 'compress'
      ),

      // $adapter == 'Lzf'
      'adapter' => 'Lzf' // 'Zend\Filter\Compress\Lzf', no options

      // $adapter == 'Rar'
      'adapter' => 'Rar' // 'Zend\Filter\Compress\Rar',
      'options' => array(
        'callback' => string // callback to use - default null
        'archive' => string // archive to use - default null
        'password' => string // password to use - default null
        'target' => string // default '.'
      ),

      // $adapter == 'Snappy'
      'adapter' => 'Snappy' // 'Zend\Filter\Compress\Snappy', no options

      // $adapter == 'Tar'
      'adapter' => 'Tar' // 'Zend\Filter\Compress\Tar',
      'options' => array(
        'archive' => string // archive to use - default null
        'mode' => string // compression mode 'Gz'|'Bz2' - default null
        'target' => string // default '.'
      ),

      // $adapter == 'Zip'
      'adapter' => 'Zip' // 'Zend\Filter\Compress\Zip',
      'options' => array(
        'archive' => string // archive to use - default null
        'target' => string // default null
      ),
    ),
  ),

  array(
    'name' => 'decompress' // 'Zend\Filter\Decompress',
    'options' => array(
      // voir filtre 'compress'
    ),
  ),

  array(
    'name' => 'datetimeformatter' // 'Zend\Filter\DateTimeFormatter',
    'options' => array(
      'format' => string // date format accepted by date()
    ),
  ),

  array(
    'name' => 'digits' // 'Zend\Filter\Digits',
  ),

  array(
    'name' => 'dir' // 'Zend\Filter\Dir',
  ),

  array(
    'name' => 'encrypt' // 'Zend\Filter\Encrypt',
    'options' => array(
      'adapter' => string $adapter // Encryption adapter

      // $adapter == 'BlockCipher'
      // http://php.net/manual/en/book.mcrypt.php
      // voir la doc de Zend\Crypt\BlockCipher pour détail http://framework.zend.com/manual/current/en/modules/zend.crypt.block-cipher.html
      'adapter' => 'BlockCipher' // Zend\Filter\Encrypt\BlockCipher
      'key' => string //
      'key_iteration' => int // default 5000
      'algorithm' => string // default 'aes'
      'hash' => string // default 'sha256'
      'vector' =>
      'compression' => // default null
      'mode' => string // default 'cbc'
      // http://php.net/manual/en/mcrypt.constants.php
      'mode_directory' => string // default : path to mcrypt mode extension

      // $adapter == 'Openssl'
      // http://fr2.php.net/manual/en/book.openssl.php
      'adapter' => 'Openssl' // Zend\Filter\Encrypt\Openssl
      'public' => array()
      'private' => array()
      'envelope' => array()
      'passphrase' => string
      'compression' => //
      'package' => //
    ),
  ),

  array(
    'name' => 'decrypt' // 'Zend\Filter\Decrypt',
    'options' => array(
      // voir filtre 'encrypt'
    ),
  ),

  array(
    'name' => 'htmlentities' // 'Zend\Filter\HtmlEntities',
    // voir la doc de http://fr2.php.net/manual/en/function.htmlentities.php
    'options' => array(
      'quotestyle' => // correspond à l'argument $flag de la fonction htmlentities()
      // valeurs acceptées ENT_COMPAT (default), ENT_QUOTES, ENT_NOQUOTES
      'charset' => // correspond à l'argument $encoding
      'doublequote' => // correspond à l'argument $double_encode
    ),
  ),

  array(
    'name' => 'inflector' // 'Zend\Filter\Inflector',
    // http://framework.zend.com/manual/current/en/modules/zend.filter.inflector.html
    'options' => array(
      'pluginManager' => instanceof \Zend\Filter\FilterPluginManager
      'target' => 
      'rules' => array()
      'throwTargetExceptionOn' => bool // default false
      'targetReplacementIdentifier' => string
    ),
  ),

  array(
    'name' => 'int' // 'Zend\Filter\Int',
  ),

  array(
    'name' => 'null' // 'Zend\Filter\Null',
    'options' => array(
      'type' => in $typeNull // default TYPE_ALL
    ),
  ),
  // liste des type disponible
  Zend\Filter\Null::TYPE_BOOLEAN => 'boolean' = 1
  Zend\Filter\Null::TYPE_INTEGER => 'integer' = 2
  Zend\Filter\Null::TYPE_EMPTY_ARRAY => 'array' = 4
  Zend\Filter\Null::TYPE_STRING => 'string' = 8
  Zend\Filter\Null::TYPE_ZERO_STRING => 'zero' = 16
  Zend\Filter\Null::TYPE_FLOAT => 'float' = 32
  Zend\Filter\Null::TYPE_ALL => 'all' = 63

  array(
    'name' => 'numberformat' // 'Zend\I18n\Filter\NumberFormat',
    'options' => array(
      'locale' => string // default null, string de type 'en_US'
      'style' => NumberFormatter::DEFAULT_STYLE //
      // http://php.net/manual/en/class.numberformatter.php#intl.numberformatter-constants.unumberformatstyle
      'type' => NumberFormatter::TYPE_DOUBLE //
      // http://www.php.net/manual/class.numberformatter.php#intl.numberformatter-constants.types
    ),
  ),

  array(
    'name' => 'numberparse' // 'Zend\I18n\Filter\NumberParse',
    'options' => array(
      'locale' => string // default null, string de type 'en_US'
      'style' => NumberFormatter::DEFAULT_STYLE //
      // http://php.net/manual/en/class.numberformatter.php#intl.numberformatter-constants.unumberformatstyle
      'type' => NumberFormatter::TYPE_DOUBLE //
      // http://www.php.net/manual/class.numberformatter.php#intl.numberformatter-constants.types
    ),
  ),

  array(
    'name' => 'pregreplace' // 'Zend\Filter\PregReplace',
    'options' => array(
      'pattern' => string // default null - regex
      'replacement' => string // default '' - regex
    ),
  ),

  array(
    'name' => 'realpath' // 'Zend\Filter\RealPath',
    'options' => array(
      'exists' => bool // default true - check if path exists
    ),
  ),

  array(
    'name' => 'stringtolower' // 'Zend\Filter\StringToLower',
    'options' => array(
      'encoding' => string // encoding string - default null
    ),
  ),

  array(
    'name' => 'stringtoupper' // 'Zend\Filter\StringToUpper',
    'options' => array(
      'encoding' => string // encoding string - default null
    ),
  ),

  array(
    'name' => 'stringtrim' // 'Zend\Filter\StringTrim',
    'options' => array(
      'charlist' => array() // encoding string - default null
    ),
  ),

  array(
    'name' => 'stripnewlines' // 'Zend\Filter\StripNewlines',
  ),

  array(
    'name' => 'striptags' // 'Zend\Filter\StripTags',
    'options' => array(
      'allowTags' => array() // list of allowed tags
      'allowAttribs' => array() // list of allowed attributes
      'allowComments' => bool // are comments allowed
    ),
  ),

  array(
    'name' => 'urinormalize' // 'Zend\Filter\UriNormalize',
    // http://framework.zend.com/manual/current/en/modules/zend.uri.html
    'options' => array(
      'defaultScheme' => string // scheme string
      'enforcedScheme' => string // scheme string
    ),
  ),
),
```

Les filtres spécifiquement sur les mots

```php
'filters' => array(
  array(
    'name' => 'wordcamelcasetodash' // 'Zend\Filter\Word\CamelCaseToDash',
  ),

  array(
    'name' => 'wordcamelcasetoseparator' // 'Zend\Filter\Word\CamelCaseToSeparator',
    'options' => array(
      'separator' => string // ''
    ),
  ),

  array(
    'name' => 'wordcamelcasetounderscore' // 'Zend\Filter\Word\CamelCaseToUnderscore',
  ),

  array(
    'name' => 'worddashtocamelcase' // 'Zend\Filter\Word\DashToCamelCase',
  ),

  array(
    'name' => 'worddashtoseparator' // 'Zend\Filter\Word\DashToSeparator',
    'options' => array(
      'separator' => string // ''
    ),
  ),

  array(
    'name' => 'worddashtounderscore' // 'Zend\Filter\Word\DashToUnderscore',
  ),

  array(
    'name' => 'wordseparatortocamelcase' // 'Zend\Filter\Word\SeparatorToCamelCase',
    'options' => array(
      'separator' => string // ''
    ),
  ),

  array(
    'name' => 'wordseparatortodash' // 'Zend\Filter\Word\SeparatorToDash',
    'options' => array(
      'separator' => string // ''
    ),
  ),

  array(
    'name' => 'wordseparatortoseparator' // 'Zend\Filter\Word\SeparatorToSeparator',
    'options' => array(
      'searchSeparator' => string // ''
      'replaceSeparator' => string // ''
    ),
  ),

  array(
    'name' => 'wordunderscoretocamelcase' // 'Zend\Filter\Word\UnderscoreToCamelCase',
  ),

  array(
    'name' => 'wordunderscoretodash' // 'Zend\Filter\Word\UnderscoreToDash',
  ),

  array(
    'name' => 'wordunderscoretoseparator' => 'Zend\Filter\Word\UnderscoreToSeparator',
    'options' => array(
      'separator' => string // ''
    ),
  ),
),
```

Filtre spécifiques sur les fichiers

```php
'filters' => array(
  array(
    'name' => 'fileencrypt' // 'Zend\Filter\File\Encrypt',
    'options' => array(
      'adapter' => string $adapter // Encryption adapter
      'filename' => string

      // $adapter == 'BlockCipher'
      // http://php.net/manual/en/book.mcrypt.php
      // voir la doc de Zend\Crypt\BlockCipher pour détail http://framework.zend.com/manual/current/en/modules/zend.crypt.block-cipher.html
      'adapter' => 'BlockCipher' // Zend\Filter\Encrypt\BlockCipher
      'key' => string //
      'key_iteration' => int // default 5000
      'algorithm' => string // default 'aes'
      'hash' => string // default 'sha256'
      'vector' =>
      'compression' => // default null
      'mode' => string // default 'cbc'
      // http://php.net/manual/en/mcrypt.constants.php
      'mode_directory' => string // default : path to mcrypt mode extension

      // $adapter == 'Openssl'
      // http://fr2.php.net/manual/en/book.openssl.php
      'adapter' => 'Openssl' // Zend\Filter\Encrypt\Openssl
      'public' => array()
      'private' => array()
      'envelope' => array()
      'passphrase' => string
      'compression' => //
      'package' => //
    ),
  ),

  array(
    'name' => 'filedecrypt' // 'Zend\Filter\File\Decrypt',
    'options' => array(
      // voir filtre 'fileencrypt'
    ),
  ),

  array(
    'name' => 'filelowercase' // 'Zend\Filter\File\LowerCase',
    'options' => array(
      'encoding' => string // encoding string - default null
    ),
  ),

  array(
    'name' => 'fileuppercase' // 'Zend\Filter\File\UpperCase',
    'options' => array(
      'encoding' => string // encoding string - default null
    ),
  ),

  array(
    'name' => 'filerename' // 'Zend\Filter\File\Rename',
    'options' => array(
      'target' => string // default "*"
      'source' => string // default "*"
      'overwrite' => bool // default false
      'randomize' => bool // default false
    ),
  ),

  array(
    'name' => 'filerenameupload' // 'Zend\Filter\File\RenameUpload',
    'options' => array(
      'target' => string // default "*"
      'overwrite' => bool // default false
      'randomize' => bool // default false
      'use_upload_name' => bool // default false
      'use_upload_extension' => bool // default false
    ),
  ),
),
```
