<?php

// D:\DATAS\GitHub\DevApt\devapt-server\tests>php ..\dist\mageekguy.atoum.phar -f Devapt\tests\units\Core\Types.php


// DEBUG TRUE/FALSE
define('DEVAPT_DEBUG', 'FALSE');

// INIT PATHS
define('DEVAPT_SERVER_FRAMEWORK_ROOT',	__DIR__ .'/../../../devapt-server/');
define('DEVAPT_SERVER_EXTERNAL_ROOT',	DEVAPT_SERVER_FRAMEWORK_ROOT.'lib/');

// INIT CLASS AUTOLOADING
require(DEVAPT_SERVER_FRAMEWORK_ROOT."/src/php/init_autoloader.php");
