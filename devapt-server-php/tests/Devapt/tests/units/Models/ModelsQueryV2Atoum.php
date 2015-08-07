<?php
namespace Devapt\tests\units\Models;

// IMPORTS ATOUM
use \atoum;

// IMPORTS ZF2
use Zend\Config\Reader\Ini AS IniReader;
use Zend\Json\Json as JsonFormatter;

// IMPORTS DEVAPT
use Devapt\Application\Application as Application;

// TEST CLASS
class ModelsQueryV2Atoum extends atoum
{
	protected $app = null;
	
	
	/*
     * Load resources and init application for tests units
     */
    protected function initApplication()
    {
		if ( is_object($this->app) )
		{
			return;
		}
		
		// -------- INIT APPLICATION RESOURCE -------
		
		// LOAD APPLICATION CONFIGURATION
		$cfg_file_path_name = __DIR__ .'/app_cfg.ini';
		$reader = new IniReader();
		$reader->setNestSeparator('.');
		$records_array = $reader->fromFile($cfg_file_path_name);
		$this->array($records_array)->size->isGreaterThan(0);
		
		// CREATE AND RUN APPLICATION
		$this->app = new Application($records_array);
		$this->object($this->app)->isInstanceOf('\Devapt\Application\Application');
		$result = Application::getInstance()->run_tu(__DIR__ .'/');
		$this->boolean($result)->isTrue();
	}
	
	
	/*
	 * GET MODEL OBJECT FOR USERS
	 */
	protected function getModelUsers()
	{
		$resource_name = 'MODEL_AUTH_USERS';
		$model = \Devapt\Resources\Broker::getResourceObject($resource_name);
		$this->object($model)->isInstanceOf('\Devapt\Resources\Model');
		
		return $model;
	}
	
	
	/*
	 * GET SELECT V2 QUERY
	 */
	protected function getQueryV2Select($arg_model, $arg_request, $arg_id = null)
	{
		$action = 'read';
		$query = \Devapt\Models\QueryBuilderV2::buildFromRequest($action, $arg_model, $arg_request, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		
		return $query;
	}
	
	
	/*
	 * GET CREATE V2 QUERY
	 */
	protected function getQueryV2Create($arg_model, $arg_request, $arg_id = null)
	{
		$action = 'create';
		$query = \Devapt\Models\QueryBuilderV2::buildFromRequest($action, $arg_model, $arg_request, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		return $query;
	}
	
	
	/*
	 * GET DELETE V2 QUERY
	 */
	protected function getQueryV2Delete($arg_model, $arg_request, $arg_id = null)
	{
		$action = 'delete';
		$query = \Devapt\Models\QueryBuilderV2::buildFromRequest($action, $arg_model, $arg_request, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		return $query;
	}
	
	
	/*
	 * GET UPDATE V2 QUERY
	 */
	protected function getQueryV2Update($arg_model, $arg_request, $arg_id = null)
	{
		$action = 'update';
		$query = \Devapt\Models\QueryBuilderV2::buildFromRequest($action, $arg_model, $arg_request, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		return $query;
	}
	
	
	/*
	 * GET SELECT V2 REQUEST FOR USERS - 1
	 */
	protected function getRequestV2UsersSelect_1()
	{
		// CREATE ZF2 REQUEST
		$request = new \Zend\Http\Request();
		$this->object($request)->isInstanceOf('\Zend\Http\Request');
		
		// BUILD JSON QUERY
		$query_json_array = array();
		$query_json_array['action']	= 'select';
		$jsonOptions = null;
		$query_json = JsonFormatter::encode($query_json_array, null, $jsonOptions);
		
		// FILL TEST REQUEST
		$request->setMethod(\Zend\Http\Request::METHOD_GET);
		$request->setUri('/models/MODEL_AUTH_USERS/read');
		$request->getQuery()->set('query_api', '2');
		$request->getQuery()->set('query_json', $query_json);
		
		return $request;
	}
	
	
	/*
	 * GET SELECT V2 REQUEST FOR USERS - 2
	 */
	protected function getRequestV2UsersSelect_2()
	{
		// CREATE ZF2 REQUEST
		$request = new \Zend\Http\Request();
		$this->object($request)->isInstanceOf('\Zend\Http\Request');
		
		// BUILD JSON QUERY
		$query_json_array = array();
		$query_json_array['action']	= 'select';
		$query_json_array['action']	= 'select';
		$query_json_array['action']	= 'select';
		$query_json_array['action']	= 'select';
		$query_json_array['action']	= 'select';
		$jsonOptions = null;
		$query_json = JsonFormatter::encode($query_json_array, null, $jsonOptions);
		
		// FILL TEST REQUEST
		$request->setMethod(\Zend\Http\Request::METHOD_GET);
		$request->setUri('/models/MODEL_AUTH_USERS/read');
		$request->getQuery()->set('query_api', '2');
		$request->getQuery()->set('query_json', $query_json);
		
		return $request;
	}
}