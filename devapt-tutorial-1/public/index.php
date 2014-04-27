<?php
/**
 * @defgroup    DEVAPT_DEMO		Devapt-demo : demo application
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

/**
 * @file        index.php
 * @brief       DEVAPT-DEMO main file
 * @details     Define and load all application resources
 * @ingroup		DEVAPT_DEMO
 * @date        2014-04-26
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

// DEBUG TRUE/FALSE
define('DEVAPT_DEBUG', 'FALSE');


// INIT PATHS
chdir(dirname(__DIR__));

define('DEVAPT_WWW_ROOT',				dirname(__FILE__).'/../../');
define('DEVAPT_APP_ROOT',				dirname(__FILE__).'/../');
define('DEVAPT_APP_PUBLIC_ROOT',		DEVAPT_APP_ROOT.'public/');
define('DEVAPT_APP_PRIVATE_ROOT',		DEVAPT_APP_ROOT.'private/');

define('DEVAPT_CLIENT_ROOT',			DEVAPT_APP_ROOT.'../devapt-client/');

define('DEVAPT_MODULES_ROOT',			DEVAPT_APP_ROOT.'../devapt-modules/');

define('DEVAPT_SERVER_ROOT',			DEVAPT_APP_ROOT.'../');
define('DEVAPT_SERVER_FRAMEWORK_ROOT',	DEVAPT_SERVER_ROOT.'devapt-server/');
define('DEVAPT_SERVER_EXTERNAL_ROOT',	DEVAPT_SERVER_FRAMEWORK_ROOT.'lib/');

// DEBUG
if (DEVAPT_DEBUG === 'TRUE')
{
	echo 'DEVAPT_APP_ROOT='.DEVAPT_APP_ROOT.'<br>';
	echo 'DEVAPT_APP_PUBLIC_ROOT='.DEVAPT_APP_PUBLIC_ROOT.'<br>';
	echo 'DEVAPT_APP_PRIVATE_ROOT='.DEVAPT_APP_PRIVATE_ROOT.'<br>';

	echo 'DEVAPT_CLIENT_ROOT='.DEVAPT_CLIENT_ROOT.'<br>';
	echo 'DEVAPT_SERVER_ROOT='.DEVAPT_SERVER_ROOT.'<br>';
	echo 'DEVAPT_SERVER_FRAMEWORK_ROOT='.DEVAPT_SERVER_FRAMEWORK_ROOT.'<br>';
	echo 'DEVAPT_SERVER_EXTERNAL_ROOT='.DEVAPT_SERVER_EXTERNAL_ROOT.'<br>';
}


// INIT CLASS AUTOLOADING
require(DEVAPT_SERVER_FRAMEWORK_ROOT."/src/php/init_autoloader.php");


// IMPORT CLASSES
use Zend\Config\Reader\Ini AS IniReader;
use Devapt\Application\Application as Application;


// LOAD APPLICATION CONFIGURATION
$cfg_file_path_name = DEVAPT_APP_PRIVATE_ROOT.'/app_cfg.ini';
$reader = new IniReader();
$reader->setNestSeparator('.');
$records_array = $reader->fromFile($cfg_file_path_name);


// CREATE AND RUN APPLICATION
new Application($records_array);
Application::getInstance()->run();
