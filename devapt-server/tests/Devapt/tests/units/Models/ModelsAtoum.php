<?php
namespace Devapt\tests\units\Models;

// IMPORTS ATOUM
use \atoum;

// IMPORTS ZF2
use Zend\Config\Reader\Ini AS IniReader;

// IMPORTS DEVAPT
use Devapt\Application\Application as Application;

// TEST CLASS
class ModelsAtoum extends atoum
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
	 * GET SELECT V1 QUERY
	 */
	protected function getQueryV1Select($arg_model, $arg_request, $arg_id = null)
	{
		$action = 'read';
		$query = \Devapt\Models\QueryBuilderV1::buildFromRequest($action, $arg_model, $arg_request, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		
		return $query;
	}
	
	
	/*
	 * GET CREATE V1 QUERY
	 */
	protected function getQueryV1Create($arg_model, $arg_request, $arg_id = null)
	{
		$action = 'create';
		$query = \Devapt\Models\QueryBuilderV1::buildFromRequest($action, $arg_model, $arg_request, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		return $query;
	}
	
	
	/*
	 * GET DELETE V1 QUERY
	 */
	protected function getQueryV1Delete($arg_model, $arg_request, $arg_id = null)
	{
		$action = 'delete';
		$query = \Devapt\Models\QueryBuilderV1::buildFromRequest($action, $arg_model, $arg_request, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		return $query;
	}
	
	
	/*
	 * GET UPDATE V1 QUERY
	 */
	protected function getQueryV1Update($arg_model, $arg_request, $arg_id = null)
	{
		$action = 'update';
		$query = \Devapt\Models\QueryBuilderV1::buildFromRequest($action, $arg_model, $arg_request, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		return $query;
	}
	
	
	/*
	 * GET SELECT V1 REQUEST FOR USERS - 1
	 */
	protected function getRequestV1UsersSelect_1()
	{
		// CREATE ZF2 REQUEST
		$request = new \Zend\Http\Request();
		$this->object($request)->isInstanceOf('\Zend\Http\Request');
		
		// FILL TEST REQUEST
		$request->setMethod(\Zend\Http\Request::METHOD_GET);
		$request->setUri('/models/MODEL_AUTH_USERS/read');
		// $request->getPost()->set('foo', 'bar');
		$request->getQuery()->set('query_action', 'select');
		// $request->getQuery()->set('crud_db', '');
		// $request->getQuery()->set('crud_table', '');
		$request->getQuery()->set('query_one_field', '');
		$request->getQuery()->set('query_fields', 'login,lastname');
		// $request->getQuery()->set('query_values', '');
		// $request->getQuery()->set('query_filters', '');
		$request->getQuery()->set('query_orders', 'lastname=desc');
		// $request->getQuery()->set('query_groups', '');
		$request->getQuery()->set('query_slice_begin', '10');
		$request->getQuery()->set('query_slice_end', '20');
		// $request->getQuery()->set('query_slice_offset', '');
		// $request->getQuery()->set('query_slice_length', '');
		// $request->getQuery()->set('query_joins', '');
		
		return $request;
	}
	
	
	/*
	 * GET SELECT V1 REQUEST FOR USERS - 2
	 */
	protected function getRequestV1UsersSelect_2()
	{
		// CREATE ZF2 REQUEST
		$request = new \Zend\Http\Request();
		$this->object($request)->isInstanceOf('\Zend\Http\Request');
		
		// FILL TEST REQUEST
		$request->setMethod(\Zend\Http\Request::METHOD_GET);
		$request->setUri('/models/MODEL_AUTH_USERS/read');
		// $request->getPost()->set('foo', 'bar');
		$request->getQuery()->set('query_action', 'select');
		// $request->getQuery()->set('crud_db', '');
		// $request->getQuery()->set('crud_table', '');
		$request->getQuery()->set('query_one_field', '');
		$request->getQuery()->set('query_fields', 'login,lastname');
		// $request->getQuery()->set('query_values', '');
		// $request->getQuery()->set('query_filters', '');
		$request->getQuery()->set('query_orders', 'login=desc');
		$request->getQuery()->set('query_groups', 'lastname');
		$request->getQuery()->set('query_slice_begin', '10');
		$request->getQuery()->set('query_slice_end', '20');
		// $request->getQuery()->set('query_slice_offset', '');
		// $request->getQuery()->set('query_slice_length', '');
		// $request->getQuery()->set('query_joins', '');
		
		return $request;
	}
	
	
	/*
	 * GET SELECT V1 REQUEST FOR USERS - 3
	 */
	protected function getRequestV1UsersSelect_3()
	{
		// CREATE ZF2 REQUEST
		$request = new \Zend\Http\Request();
		$this->object($request)->isInstanceOf('\Zend\Http\Request');
		
		// FILL TEST REQUEST
		$request->setMethod(\Zend\Http\Request::METHOD_GET);
		$request->setUri('/models/MODEL_AUTH_USERS/read');
		$request->getQuery()->set('query_action', 'select_distinct');
		$request->getQuery()->set('crud_db', '');
		$request->getQuery()->set('crud_table', 'users');
		$request->getQuery()->set('query_one_field', 'login');
		// $request->getQuery()->set('query_fields', 'login,lastname');
		$request->getQuery()->set('query_values', 'firstname=john');
		$request->getQuery()->set('query_filters', 'field=login,type=String,modifier=upper,op=begins_with,var1=A');
		$request->getQuery()->set('query_orders', 'login=desc');
		$request->getQuery()->set('query_groups', 'lastname');
		// $request->getQuery()->set('query_slice_begin', '10');
		// $request->getQuery()->set('query_slice_end', '20');
		$request->getQuery()->set('query_slice_offset', '5');
		$request->getQuery()->set('query_slice_length', '150');
		$request->getQuery()->set('query_joins', 'db=,table=users,column=id_user,join_db=,join_table=groups_users,join_table_alias=gu,join_column=id_user,join_mode=INNER');
		
		return $request;
	}
	
	
	/*
	 * GET INSERT V1 REQUEST FOR USERS - 1
	 */
	protected function getRequestV1UsersInsert_1()
	{
		// CREATE ZF2 REQUEST
		$request = new \Zend\Http\Request();
		$this->object($request)->isInstanceOf('\Zend\Http\Request');
		
		// FILL TEST REQUEST
		$request->setMethod(\Zend\Http\Request::METHOD_GET);
		$request->setUri('/models/MODEL_AUTH_USERS/create');
		// $request->getPost()->set('foo', 'bar');
		$request->getQuery()->set('query_action', 'insert');
		// $request->getQuery()->set('crud_db', '');
		// $request->getQuery()->set('crud_table', '');
		$request->getQuery()->set('query_one_field', '');
		// $request->getQuery()->set('query_fields', 'login,lastname');
		$request->getQuery()->set('query_values', 'lastname=SMITH,firstname=John,login=jsmith,email=j.s@help.org,password=abcd');
		// $request->getQuery()->set('query_filters', '');
		// $request->getQuery()->set('query_orders', 'lastname=desc');
		// $request->getQuery()->set('query_groups', '');
		// $request->getQuery()->set('query_slice_begin', '10');
		// $request->getQuery()->set('query_slice_end', '20');
		// $request->getQuery()->set('query_slice_offset', '');
		// $request->getQuery()->set('query_slice_length', '');
		// $request->getQuery()->set('query_joins', '');
		
		return $request;
	}
}