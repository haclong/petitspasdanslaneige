---
title: "Upgrading The Bug Genie from 3.2.6 to 4.0.x"
permalink: "en/posts/upgrading-bug-genie-326-40x.html"
date: "2015-07-21T07:49"
slug: upgrading-bug-genie-326-40x
layout: post
drupal_uuid: be8a4012-287d-446e-960c-da7d18b3992c
drupal_nid: 143
lang: zxx
author: haclong

media:
  path: /img/teaser/engrenages.jpg

tags:
  - "the bug genie"
  - "upgrade"
  - "HOWTO"

sites:
  - "Développement"
  - "Haclong projects"

summary: "I try to use The Bug Genie as bug tracker. It's not really successful for the moment but well... I just noticed the package has a brand new version. So this is how to upgrade it."
---

I try to use The Bug Genie as bug tracker. It's not really successful for the moment but well... I just noticed the package has a brand new version. So this is how to upgrade it.

I installed <a href="http://www.thebuggenie.org/" target="_blank">The Bug Genie</a> few months... years (?) ago. The install was a 3.2.6 version.

Freshly released few weeks ago, there's a new 4.0.0 version. As you can notice, this is a major version upgrade. Indeed, there's a lot of changes on the package and how to install it.

I'd say that 3.2.x where old fashioned app with manual upgrade :

<blockquote>"Download the archive from the main download site.

Extract the files into your current installation, overwriting existing files where prompted.

When this is done, clear the contents of the B2DB cache folder "...
</blockquote>

The Bug Genie 4.0 is now on github, use Composer to download dependencies and PHPUnit for unit testing.

For what i see, the file structure has slightly changed too so the upgrade steps can't just be overwrite old files and we're done with it.

As for most of upgrade first thing first :

## Securing the old version

If the upgrade goes wrong, we don't want to loose everything, do we ?

- download your whole **The Bug Genie** old files
- dump the whole database

Keep all those in a safe place.

## Downloading the last 3.2.7 version

My previous attempts to upgrade having failed miserably, i decided that upgrading to a fresh new 4.0.x version from the last 3.2.x version might be better. Actually, it did not ease anything and i've found why my upgrade has failed after but i keep this step for those who wish it.

- Download the <a href="http://www.thebuggenie.org/download" target="_blank">last 3.2.7 version</a>
- Unzip the archive

Based on the install/upgrade instructions from The Bug Genie website :

- Copy the content of the archive to your The Bug Genie installation. Pay attention to the **`/thebuggenie`** folder for it is the webroot folder of the < 4.0 version. Maybe you'd have - like me - to change the name of the folder, dependint on your hosting provider.
- Delete all files in `**/core/cache/B2DB**` and `**/core/cache**` (leaving the `**/B2DB**` folder empty but still there)
- Create a file called `**/upgrade**` in the directory where `**/installed**` is located

## Now downloading the new version

- Go to <a href="http://github.com/thebuggenie/thebuggenie" target="_blank">https://github.com/thebuggenie/thebuggenie</a>
- Download the archive of the project
- Unzip the archive

## Copying the new version to the old

What you ought to know before copying

The old The Bug Genie installation 3.2.x uses the `**/thebuggenie**` folder as webroot.

The new The Bug Genie installation 4.0+ uses the `**/public**` folder as webroot.

Depending on your host, maybe you'd have to rename the `**/public**` folder before going further. Just make sure that the `**/public**` folder new name matches the directory you use as webroot in your old installation.

- Copy the new files to the old installation, overriding existing files.

## Preparing the upgrade

- Check the `**/installed**` file contains the 3.2 version number.
- Remove the whole `**/core/cache**` folders
- Add a `**/cache**` folder
- Copy the `**/core/config/b2db.sample.yml**` to `**/core/config/b2db.yml**`
- Edit the old `**/core/b2db_bootstrap.inc.php**`
- Edit the `**/core/config/b2db.yml**` and use the values of `**/core/b2db_bootstrap.inc.php**` to complete the `**/core/config/b2db.yml**` file.
- Create an empty `**/upgrade**` file (next to `**/installed**`)
- Delete the `**/{your_webroot}/css/oxygen**` file.
- Replace with a symbolic link

```sh
 ln -s ../../themes/oxygen/css oxygen
```

- Delete the `**/{your_webroot}/css/firehouse**` file.
- Replace with a symbolic link

```sh
 ln -s ../../themes/firehouse/css firehouse
```

## Getting Composer

If you don't already have a handy `** composer.phar**` anywhere, you can get yours at <a href="https://getcomposer.org/download/" target="_blank">**https://getcomposer.org/download/**</a>

- Put the `**composer.phar**` into your The Bug Genie installation (next to `**composer.json**`)

## Installing the dependencies

- Log into your server through an SSH access.

If you're using an old `**composer.phar**`, don't forget to update it first

```sh
 php composer.phar self-update
```

- Install the dependencies

```sh
 php composer.phar update --prefer-dist
```

or

```sh
 php composer.phar install
```

## Follow the upgrade script

Once the dependencies are installed successfully :

- Get a browser
- Open the `**http://your_the_bug_genie_installation/upgrade**` page
- Follow the steps

## Fixing the vendor/thebuggenie/b2db/src/Table.php

I've had an issue when the upgrade script were running. I had an error : **Variable $sql undefined**.

How to fix the `**vendor/thebuggenie/b2db/src/Table.php**` file

```php
protected function _getAlterColumnDefaultSQL($details)
{
  $sql = '';
  $default_definition = $this->_getColumnDefaultDefinitionSQL($details);

  if($default_definition) {
    switch (Core::getDBtype()) {
      case 'pgsql':
        $sql = 'ALTER TABLE ' . $this->_getTableNameSQL();
        $qc = $this->getQC();
        $sql .= " ALTER COLUMN $qc" . $this->_getRealColumnFieldName($details['name']) . "$qc SET";
        $sql .= $default_definition;
      break;
    }
  }

  return $sql;
}
```

If everything goes right, you should get an "**UPGRADE SUCCESSFULLY COMPLETED**" screen.

With your FTP Client, remove the `**/upgrade**` file BEFORE clicking the `**Finish**` button.

Installation is done.

## TROUBLESHOOTING

### Duplicate column 'closed'

If during the upgrade process, you keep getting an** Duplicate column 'closed'** error, it means you are trying to upgrade tables which were already upgraded. Just drop all the tables, import the old tables as they were (remember, you've saved them somewhere safe) and try the upgrade again.

### Yuk ! i can't believe how this 4.0 version is so ugly

If the screen look positively ugly and there's clearly no templating AT ALL, check this folder `**/public/css**` and check the symbolic links you should have done.

- The oxygen link should links to `**/themes/oxygen/css**`
- The firehouse link should links to `**/themes/firehouse/css**`
