---
title: "Zend Log Logger avec configuration"
permalink: "fr/posts/zend-log-logger-avec-configuration.html"
date: "2013-06-17T17:52"
slug: zend-log-logger-avec-configuration
layout: post
drupal_uuid: c4b0c26d-bc12-4749-bed3-6daa8c8c808c
drupal_nid: 40
lang: fr
author: haclong

media:
  path: /img/teaser/__table_de_mixage_2.jpg

tags:
  - "zend framework 2"
  - "configuration"
  - "Zend Log"

sites:
  - "Développement"

summary: "Comment configurer les writers d'un objet Zend\Log\Logger en utilisant la configuration seulement. "
---

Comment configurer les writers d'un objet `Zend\Log\Logger` en utilisant la configuration seulement.

J'espère que cette liste va vous aider à utiliser `Zend\Log\Logger`

### Les writers

Les writers indiquent à `Zend\Log\Logger` sur quel support on souhaite enregistrer nos logs.

Voici la liste des writers de `Zend\Log`

```php
 'chromephp' => 'Zend\Log\Writer\ChromePhp',
 'db' => 'Zend\Log\Writer\Db',
 'fingerscrossed' => 'Zend\Log\Writer\FingersCrossed',
 'firephp' => 'Zend\Log\Writer\FirePhp',
 'mail' => 'Zend\Log\Writer\Mail',
 'mock' => 'Zend\Log\Writer\Mock',
 'null' => 'Zend\Log\Writer\Null',
 'stream' => 'Zend\Log\Writer\Stream',
 'syslog' => 'Zend\Log\Writer\Syslog',
 'zendmonitor' => 'Zend\Log\Writer\ZendMonitor',
```

### Les filtres

Les filtres indiquent à `Zend\Log\Logger` quels informations ne devraient pas être loggées.

Voici la liste des filtres de `Zend\Log`

```php
 'mock' => 'Zend\Log\Filter\Mock',
 'priority' => 'Zend\Log\Filter\Priority',
 'regex' => 'Zend\Log\Filter\Regex',
 'suppress' => 'Zend\Log\Filter\SuppressFilter',
 'suppressfilter' => 'Zend\Log\Filter\SuppressFilter',
 'validator' => 'Zend\Log\Filter\Validator',
```

### Les formatteurs

Les formatteurs indiquent à `Zend\Log\Logger` en quels formats les informations doivent être loggées. Généralement, le format est fortement liés au writer.

Voici la liste des formatteurs de `Zend\Log`

```php
 'base' => 'Zend\Log\Formatter\Base',
 'simple' => 'Zend\Log\Formatter\Simple',
 'xml' => 'Zend\Log\Formatter\Xml',
 'db' => 'Zend\Log\Formatter\Db',
 'errorhandler' => 'Zend\Log\Formatter\ErrorHandler',
 'exceptionhandler' => 'Zend\Log\Formatter\ExceptionHandler',
```

Voici l'ensemble entier :

```php
<?php
'writers' => array( // array
  array(
    // \Zend\Log\Logger->addWriter($name, $priority, $options)
    'name' => string $name, // mandatory -> voir la liste des writers
    'priority' => int $priority, // default null (1)
    'options' => array( // default null
      'exceptionhandler' => bool // default false // registerExceptionHandler
      'errorhandler' => bool // default false // registerErrorHandler

      // si $name = 'chromephp' - default formatter ChromePhpFormatter()
      'instance' => Zend\Log\Writer\ChromePhp\ChromePhpInterface $instance // mandatory

      // si $name = 'db' - default formatter DbFormatter
      'separator' => string $separator // default '_'
      'column' => array $columnMap // default null
      'table' => string $tableName // mandatory default null
      'db' => Zend\Db\Adapter\Adapter $db // default null

      // si $name = 'fingerscrossed'
      'priority' => $priority // default Logger::WARN
      'bufferSize' => int $bufferSize
      'writer' => string $writer
      'writer' => array(
        'name' => $name
        'options' => $options
      ),

      // si $name = 'firephp' - default formatter FirePhpFormatter
      'instance' => FirePhp\FirePhpInterface $instance // mandatory

      // si $name = 'mail' - default SimpleFormatter
      'subject_prepend_text' => string $subject_prepend_text
      'transport' => Transport\Sendmail $transport // default null
      'mail' => Zend\Mail\Message $mail // default null

      // si $name = 'mock' - writer pour faire des tests

      // si $name = 'MongoDb'
      'save_options' => $save_options // default null - mongo save options
      'collection' => $collection // mandatory
      'database' => $database // mandatory
      'mongo' => MongoClient | Mongo $mongo // default null

      // si $name = 'null'

      // si $name = 'stream'
      'mode' => $mode // default 'a'
      'log_separator' => $log_separator // default PHP_EOL
      'stream' => $stream // default null

      // si $name = 'syslog' - default formatter = SimpleFormatter('%message%')
      'application' => $application // default Zend\Log
      'facility' => $facility // default LOG_USER

      // si $name = 'zendmonitor'

      // ajouter des filtres
      'filters' => string 'filter1' // $this->addFilter('filter1')
      'filters' => array('filter1', 'filter2') // this->addFilter('filter1'), $this->addFilter('filter2'),
      'filters' => array( // $this->addFilter($name, $options)
        array(
          'name' => $name // mandatory -> voir la liste des filtres
          'options' => array( // default null

            // si $name = 'mock' - pour les tests

            // si $name = 'priority'
            'operator' => string $operator // default '<='
            'priority' => int $priority // default null

            // si $name = 'regex'
            'regex' => $regex // default null

            // si $name = 'suppress' | 'suppressfilter'
            'suppress' => bool // default false

            // si $name = 'validator'
            'validator' => Zend\Validator\ValidatorInterface $validator // default null
          ),
        ),
      ),
    ),

    // ajouter des formatteurs
    'formatter' => string 'formatter1' // $this->setFormatter('formatter1')
    'formatter' => array( // $this->setFormatter($name, $options)
      'name' => $name // mandatory -> voir la liste des formatteurs
      'options' => array( // default null

        // si $name = 'base'
        'dateTimeFormat' => string $date_function_format // default 'c'

        // si $name = 'db'
        'dateTimeFormat' => string $date_function_format // default 'c'

        // si $name = 'errorhandler'
        'dateTimeFormat' => string $date_function_format // default 'c'
        'format' => string $format // default '%timestamp% %priorityName% (%priority%) %message% (errno %extra[errno]%) in %extra[file]% on line %extra[line]%'

        // si $name = 'exceptionhandler'

        // si $name = 'simple'
        'dateTimeFormat' => string $date_function_format // default 'c'
        'format' => string $format // default '%timestamp% %priorityName% (%priority%): %message% %extra%'

        // si $name = 'xml'
        'elementMap' => array $elementMap
        'encoding' => string $encoding // default 'UTF-8'
        'dateTimeFormat' => string $date_function_format // default 'c'
        'rootElement' => string $rootElement // default 'logEntry'
      ),
    ),
  ),
),
```
