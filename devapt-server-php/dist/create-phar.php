<?php
// CREATE PHP ARCHIVE WITH: php create-phar.php
// Allowing package creation: vi php.ini and set phar.readonly = 0
// Loading one file: require_once "phar://myapp.phar/common.php";

$project_root=__DIR__;
$project_version='1.0.0';
$project_name='devapt-server';

$phar_public_name=$project_name.'-'.$project_version.'.phar';
$phar_internal_name=$project_name.'.phar';

$src_root = "$project_root/$project_name/src";
$build_root = "$project_root/$project_name/dist";

$phar = new Phar($build_root.'/'.$phar_public_name,
	FilesystemIterator::CURRENT_AS_FILEINFO | FilesystemIterator::KEY_AS_FILENAME,
	$phar_internal_name);

// FILL PHAR WITH FILES
$phar["index.php"] = file_get_contents($src_root . "/index.php");
$phar["common.php"] = file_get_contents($src_root . "/common.php");

// FILL PHAR WITH ALL DIRECTORY
$phar->buildFromDirectory($src_root,'/.php$/');

// SET THE CODE TO EXECUTE AFTER THE PHAR IS LOADED
$phar->setStub( $phar->createDefaultStub("index.php") );
 
// copy($src_root . "/config.ini", $build_root . "/config.ini");


/*

RUNNING APPLICATION
htdocs:
	myapp.phar
	[config.ini]
	run.php


run.php:
<?php
require "myapp.phar";

*/


/*
https://getcomposer.org/doc/01-basic-usage.md
https://packagist.org

// DOWNLOAD COMPOSER
php -r "readfile('https://getcomposer.org/installer');" | php
ou
php -r "readfile('https://getcomposer.org/installer');" | php -- --install-dir=bin

// CHECK IF COMPOSER IS WORKING
php composer.phar


https://packagist.org/packages/zendframework/zendframework

// COMPOSER CONFIG FILE: composer.json
{
	"name": "your-vendor-name/package-name",
    "description": "A short description of what your package does",
    "require": {
        "php": ">=5.3.0",
        "monolog/monolog": "1.0.*"
    }
}

// INSTALL DEPENDENCIES
php composer.phar install
-> add a lock file in the project: composer.lock

// UPDATE DEPENDENCIES
php composer.phar update

// COMPOSER GENERATE AN AUTOLOADING FILE
require 'vendor/autoload.php';
ou
$loader = require 'vendor/autoload.php';
$loader->add('Acme\\Test\\', __DIR__);
*/