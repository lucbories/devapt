<?php
namespace Devapt\tests\units;

//	------------------------------------ USE CASE -----------------------------------
//	cmd>d:
//	cmd>cd D:\DATAS\GitHub\DevApt\devapt-server\tests
//	cmd>php ..\dist\mageekguy.atoum.phar -f devapt\tests\units\Application.php
//	---------------------------------------------------------------------------------



// 	------------------------------------ DEPENDENCIES -------------------------------
// REQUIRE DEVAPT, ZF2 AND ATOUM
require_once(__DIR__ . '/../../autoload.php');

// IMPORTS ATOUM
use \atoum;

// IMPORTS DEVAPT

//	---------------------------------------------------------------------------------



// 	------------------------------------ TEST ---------------------------------------
// TEST CLASS
abstract class Application extends atoum
{
	// ATTRIBUTES
	protected $app = null;
	
	
	/*
     * CONSTRUCTOR
     */
	public function __construct()
    {
		parent::__construct();
		$this->initApplication();
	}
	
	
	/*
     * LOAD RESOURCES AND INIT APPLICATION FOR TESTS UNITS
     */
    public function initApplication()
    {
		// CHECK IF APPLICATION IS ALREADY INITIALIZED
		if ( is_object($this->app) )
		{
			return true;
		}
		
		// LOAD APPLICATION CONFIGURATION
		$cfg_file_path_name = __DIR__ .'/app_cfg.ini';
		$reader = new \Zend\Config\Reader\Ini();
		$reader->setNestSeparator('.');
		$records_array = $reader->fromFile($cfg_file_path_name);
		if ( ! is_array($records_array) )
		{
			return false;
		}
		$this->array($records_array)->size->isGreaterThan(0);
		
		// CREATE AND RUN APPLICATION
		$this->app = new \Devapt\Application\Application($records_array);
		$this->object($this->app)->isInstanceOf('\Devapt\Application\Application');
		$result = $this->app->run_tu(__DIR__ .'/');
		$this->boolean($result)->isTrue();
		
		return true;
	}
	
	
	/*
	 * GET APP OBJECT
	 */
	public function getApplication()
	{
		// TETS IF ALREADY INITIALIZED
		if ( is_object($this->app) )
		{
			return $this->app;
		}
		
		// INIT APP
		// $result = $this->initApplication();
		
		return $result ? $this->app : null;
	}
}