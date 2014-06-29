<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

/**
 * This autoloading setup is really more complicated than it needs to be for most
 * applications. The added complexity is simply to reduce the time it takes for
 * new developers to be productive with a fresh skeleton. It allows autoloading
 * to be correctly configured, regardless of the installation method and keeps
 * the use of composer completely optional. This setup should work fine for
 * most users, however, feel free to configure autoloading however you'd like.
 */

<<<<<<< HEAD
$DEVAPT_ZF2_ROOT = DEVAPT_SERVER_EXTERNAL_ROOT.'php/ZendFramework-2.2.5/library';
$DEVAPT_VENDOR_ROOT = DEVAPT_SERVER_EXTERNAL_ROOT;
=======
// $DEVAPT_ZF2_ROOT = DEVAPT_SERVER_EXTERNAL_ROOT.'php/ZendFramework-2.2.5/library';
$DEVAPT_ZF2_ROOT = DEVAPT_SERVER_EXTERNAL_ROOT;
>>>>>>> 003915988556101b7eb945709ab685be9ddf8729
$DEVAPT_SERVER_ROOT = DEVAPT_SERVER_FRAMEWORK_ROOT.'/src/php';



// DEBUG
if (DEVAPT_DEBUG === 'TRUE')
{
	// DEVAPT_ZF2_ROOT EXISTS ?
	if ( file_exists($DEVAPT_ZF2_ROOT) )
	{
		echo "exists: $DEVAPT_ZF2_ROOT<br>";
	}
	else
	{
		echo "not exists: $DEVAPT_ZF2_ROOT<br>";
	}
	
	// DEVAPT_VENDOR_ROOT EXISTS ?
	if ( file_exists($DEVAPT_VENDOR_ROOT) )
	{
		echo "exists: $DEVAPT_VENDOR_ROOT<br>";
	}
	else
	{
		echo "not exists: $DEVAPT_VENDOR_ROOT<br>";
	}
	
	// DEVAPT_SERVER_ROOT EXISTS ?
	if ( file_exists($DEVAPT_SERVER_ROOT) )
	{
		echo "exists: $DEVAPT_SERVER_ROOT<br>";
	}
	else
	{
		echo "not exists: $DEVAPT_SERVER_ROOT<br>";
	}
}

<<<<<<< HEAD


// COMPOSER AUTOLOADING
if ( file_exists($DEVAPT_VENDOR_ROOT.'vendor/autoload.php') )
{
    $loader = include $DEVAPT_VENDOR_ROOT.'vendor/autoload.php';
=======
// Composer autoloading
if ( file_exists(DEVAPT_SERVER_EXTERNAL_ROOT.'vendor/autoload.php') )
{
    $loader = include $DEVAPT_ZF2_ROOT.'vendor/autoload.php';
}
else
{
	echo 'File not found : '.$DEVAPT_ZF2_ROOT.'vendor/autoload.php<br>';
>>>>>>> 003915988556101b7eb945709ab685be9ddf8729
}



// INIT ZF2 PATH

$zf2Path = false;
if ( is_dir('vendor/ZF2/library') )
{
    $zf2Path = 'vendor/ZF2/library';
}
elseif ( is_dir('vendor/ZF2/library') )
{
    $zf2Path = 'vendor/ZF2/library';
}
elseif ( getenv('ZF2_PATH') )
{	// Support for ZF2_PATH environment variable or git submodule
	$zf2Path = getenv('ZF2_PATH');
}
elseif ( get_cfg_var('zf2_path') )
{	// Support for zf2_path directive value
	$zf2Path = get_cfg_var('zf2_path');
}
elseif ( is_dir($DEVAPT_ZF2_ROOT) )
{
	$zf2Path = $DEVAPT_ZF2_ROOT;
}



if ( isset($loader) )
{
	// DEFINE ZEND FRAMEWORK LOADER
	if ($zf2Path)
	{
		$loader->add('Zend', $zf2Path);
	}
	
	// DEFINE DEVAPT LOADER
	$loader->add('Devapt', $DEVAPT_SERVER_ROOT);
}
else
{
	// DEFINE ZEND LOADER
	if ($zf2Path)
	{
		include $zf2Path . '/Zend/Loader/AutoloaderFactory.php';
		Zend\Loader\AutoloaderFactory::factory(
			array(
				'Zend\Loader\StandardAutoloader' => array(
					'autoregister_zf' => true,
					'namespaces' => array(
						'Devapt' => $DEVAPT_SERVER_ROOT.'/Devapt'
					)
				)
			)
		);
	}
	$loader = Zend\Loader\AutoloaderFactory::getRegisteredAutoloader('Zend\Loader\StandardAutoloader');
	
	// DEFINE DEVAPT LOADER
	$loader->add('Devapt', $DEVAPT_SERVER_ROOT);
}

if ( ! class_exists('Zend\Loader\AutoloaderFactory') )
{
    throw new RuntimeException('Unable to load ZF2. Run `php composer.phar install` or define a ZF2_PATH environment variable.');
}
