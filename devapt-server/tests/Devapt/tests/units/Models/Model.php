<?php
namespace Devapt\tests\units\Models;

//	------------------------------------ USE CASE -----------------------------------
//	cmd>d:
//	cmd>cd D:\DATAS\GitHub\DevApt\devapt-server\tests
//	cmd>php ..\dist\mageekguy.atoum.phar -f devapt\tests\units\Model.php
//	---------------------------------------------------------------------------------



// 	------------------------------------ DEPENDENCIES -------------------------------
// REQUIRE DEVAPT, ZF2 AND ATOUM
require_once(__DIR__ . '/../../../autoload.php');
require_once(__DIR__ . '/../Application.php');

// IMPORTS ATOUM

// IMPORTS ZF2
use Zend\Json\Json as JsonFormatter;

// IMPORTS DEVAPT

//	---------------------------------------------------------------------------------



// 	------------------------------------ TEST ---------------------------------------
// TEST CLASS
abstract class Model extends \Devapt\tests\units\Application
{
	// ATTRIBUTES
	protected $model = null;
	protected $model_name = null;
	protected $engine = null;
	
	
	/*
     * CONSTRUCTOR
     */
	public function __construct()
    {
		parent::__construct();
	}
	
	
	/*
	 * GET MODEL OBJECT FOR USERS
	 */
	public function getModel()
	{
		$this->string($this->model_name)->isNotEmpty();
		
		// TETS IF ALREADY INITIALIZED
		if ( is_object($this->model) )
		{
			return $this->model;
		}
		
		// CREATE MODE
		$this->model = \Devapt\Resources\Broker::getResourceObject($this->model_name);
		$this->object($this->model)->isInstanceOf('\Devapt\Resources\Model');
		
		return $this->model;
	}
	
	
	/*
	 * GET MODEL OBJECT FOR USERS
	 */
	public function getDataEngine()
	{
		// TETS IF ALREADY INITIALIZED
		if ( is_object($this->engine) )
		{
			return  $this->engine;
		}
		
		// GET ENGINE
		$this->engine = $this->getModel()->getDataEngine();
		$this->object($this->engine)->isInstanceOf('\Devapt\Models\Sql\SqlEngine');
		
		return $this->engine;
	}
	
	
	/*
	 * GET DATAS RECORDS WITH A QUERY
	 */
	public function runQuery($arg_query, $arg_action)
	{
		return $this->getDataEngine()->do_crud($arg_query, $arg_action);
	}
	
	
	/*
	 * GET DATAS RECORDS WITH A QUERY ARRAY
	 */
	public function getQueryFromArray($arg_query_version, $arg_array, $arg_action, $arg_id)
	{
		$model_name = $this->getModel()->getResourceName();
		switch($arg_query_version)
		{
			case '1':
				return null;
			case '2':
			{
				$jsonOptions = null;
				$query_json = JsonFormatter::encode($query_json_array, null, $jsonOptions);
				return $this->getQueryFromString($arg_query_version, $query_json, $arg_action, $arg_id);
			}
		}
		return null;
	}
	
	/*
	 * GET DATAS RECORDS WITH A QUERY STRING
	 */
	public function getQueryFromString($arg_query_version, $arg_string, $arg_action, $arg_id)
	{
		$model_name = $this->getModel()->getResourceName();
		
		// CREATE ZF2 REQUEST
		$request = new \Zend\Http\Request();
		$this->object($request)->isInstanceOf('\Zend\Http\Request');
		
		// FILL REQUEST
		switch($arg_query_version)
		{
			case '1':
				return null;
			case '2':
			{
				$request->setMethod(\Zend\Http\Request::METHOD_GET);
				$request->setUri('/models/'.$model_name.'/read');
				$request->getQuery()->set('query_api', '2');
				$request->getQuery()->set('query_json', $arg_string);
				break;
			}
		}
		return $this->getQueryFromRequest($request, $arg_action, $arg_id);
	}
	
	
	/*
	 * GET A QUERY FROM A REQUEST
	 */
	public function getQueryFromRequest($arg_request, $arg_action, $arg_id)
	{
		return \Devapt\Models\Query::buildFromRequest($arg_action, $this->getModel(), $arg_request, $arg_id);
	}
	
	
	/*
	 * GET SELECT QUERY
	 */
	public function getQuerySelect($arg_request, $arg_id = null)
	{
		$action = 'read';
		$query = $this->getQueryFromRequest($arg_request, $action, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		
		return $query;
	}
	
	
	/*
	 * GET CREATE QUERY
	 */
	public function getQueryCreate($arg_request, $arg_id = null)
	{
		$action = 'create';
		$query = $this->getQueryFromRequest($arg_request, $action, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		return $query;
	}
	
	
	/*
	 * GET DELETE QUERY
	 */
	public function getQueryDelete($arg_request, $arg_id = null)
	{
		$action = 'delete';
		$query = $this->getQueryFromRequest($arg_request, $action, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		return $query;
	}
	
	
	/*
	 * GET UPDATE QUERY
	 */
	public function getQueryUpdate($arg_model, $arg_request, $arg_id = null)
	{
		$action = 'update';
		$query = $this->getQueryFromRequest($arg_request, $action, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		return $query;
	}
	
	
	/*
	 * GET QUERY SQL STRING
	 */
	public function getQuerySqlString($arg_query, $arg_action)
	{
		$this->variable($arg_query)->IsNotNull();
		$sql = $this->getDataEngine()->getSqlAction($arg_query, $arg_action);
		$this->object($sql)->isNotNull();
		$sql_str = $sql->getSqlString( $this->getDataEngine()->getDbAdapter()->getPlatform() );
		
		$sql_str = str_replace('`(`', '(', $sql_str);
		$sql_str = str_replace('`)`', ')', $sql_str);
		
		return $sql_str;
	}
	
	
	
	/*
	 * GET DATAS RECORDS WITH A QUERY
	 */
	public function getRecords($arg_query, $arg_action)
	{
		$records = $this->getDataEngine()->do_crud($arg_query, $arg_action);
		$this->object($records)->isArray();
		return $records;
	}
	
	
	/*
	 * GET DATAS RECORDS WITH A QUERY
	 */
	public function getRecordsAllFromQuery($arg_query)
	{
		return $this->getRecords($arg_query, 'read');
	}
	
	
	
	/*
	 * GET A QUERY TO SELECT ALL RECORDS
	 */
	public function getQuerySelectAll($arg_query_version)
	{
		$action = 'read';
		$request = $this->getRequestSelectAll($arg_query_version);
		$id = null;
		$query = $this->getQueryFromRequest($request, $action, $id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		
		return $query;
	}
	
	/*
	 * GET REQUEST SELECT ALL
	 */
	public function getRequestSelectAll($arg_query_version)
	{
		$model_name = $this->getModel()->getResourceName();
		$action = 'read';
		$request = null;
		switch($arg_query_version)
		{
			case '1':
			{
				// CREATE ZF2 REQUEST
				$request = new \Zend\Http\Request();
				$this->object($request)->isInstanceOf('\Zend\Http\Request');
				
				// FILL TEST REQUEST
				$request->setMethod(\Zend\Http\Request::METHOD_GET);
				$request->setUri('/models/'.$model_name.'/read');
				$request->getQuery()->set('query_api', '1');
				$request->getQuery()->set('query_action', 'select');
				// $request->getQuery()->set('crud_db', '');
				// $request->getQuery()->set('crud_table', '');
				// $request->getQuery()->set('query_one_field', '');
				// $request->getQuery()->set('query_fields', 'login,lastname');
				// $request->getQuery()->set('query_values', '');
				// $request->getQuery()->set('query_filters', '');
				// $request->getQuery()->set('query_orders', 'lastname=desc');
				// $request->getQuery()->set('query_groups', '');
				// $request->getQuery()->set('query_slice_begin', '10');
				// $request->getQuery()->set('query_slice_end', '20');
				// $request->getQuery()->set('query_slice_offset', '');
				// $request->getQuery()->set('query_slice_length', '');
				// $request->getQuery()->set('query_joins', '');
			}
			
			case '2':
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
				$request->setUri('/models/'.$model_name.'/read');
				$request->getQuery()->set('query_api', '2');
				$request->getQuery()->set('query_json', $query_json);
			}
		}
		
		return $request;
	}
	
	
	
	/*
	 * GET A QUERY TO INSERT RECORDS
	 */
	public function getQueryCreateRecords($arg_query_version, $arg_records, $arg_id = null)
	{
		if ( is_null($arg_records) || ! is_array($arg_records) || count($arg_records) === 0 )
		{
			return null;
		}
		
		$action = 'create';
		$request = $this->getRequestCreateRecords($arg_query_version, $arg_records);

		$query = $this->getQueryFromRequest($request, $action, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		
		return $query;
	}
	
	/*
	 * GET CREATE RECORDS REQUEST
	 */
	public function getRequestCreateRecords($arg_query_version, $arg_records)
	{
		if ( is_null($arg_records) || ! is_array($arg_records) || count($arg_records) === 0 )
		{
			return null;
		}
		
		$model_name = $this->getModel()->getResourceName();
		$request = null;
		switch($arg_query_version)
		{
			case '1':
			{
				// CREATE ZF2 REQUEST
				$request = new \Zend\Http\Request();
				$this->object($request)->isInstanceOf('\Zend\Http\Request');
				
				// SET RECORDS STRING
				$records_str = '';
				foreach($arg_records as $record)
				{
					if ($records_str !== '')
					{
						$records_str .= ',';
					}
					
					foreach($record as $field_name => $field_value)
					{
						$records_str .= $field_name.'='.$field_value;
					}
				}
				
				// FILL TEST REQUEST
				$request->setMethod(\Zend\Http\Request::METHOD_GET);
				$request->setUri('/models/'.$model_name.'/create');
				$request->getQuery()->set('query_api', '1');
				$request->getQuery()->set('query_action', 'insert');
				$request->getQuery()->set('query_values', $records_str);
			}
			
			case '2':
			{
				// CREATE ZF2 REQUEST
				$request = new \Zend\Http\Request();
				$this->object($request)->isInstanceOf('\Zend\Http\Request');
				
				// BUILD JSON QUERY
				$query_json_array = array();
				$query_json_array['action']	= 'insert';
				$query_json_array['values']	= $arg_records;
				$query_json_array['values_count']	= count($arg_records);
				$jsonOptions = null;
				$query_json = JsonFormatter::encode($query_json_array, null, $jsonOptions);
				// echo 'query_json='.$query_json;
				
				// FILL TEST REQUEST
				$request->setMethod(\Zend\Http\Request::METHOD_GET);
				$request->setUri('/models/'.$model_name.'/create');
				$request->getQuery()->set('query_api', '2');
				$request->getQuery()->set('query_json', $query_json);
			}
		}
		
		return $request;
	}
	
	
	
	/*
	 * GET A QUERY TO UPDATE RECORDS
	 */
	public function getQueryUpdateRecords($arg_query_version, $arg_records, $arg_id = null)
	{
		if ( is_null($arg_records) || ! is_array($arg_records) || count($arg_records) === 0 )
		{
			return null;
		}
		
		$action = 'update';
		$request = $this->getRequestUpdateRecords($arg_query_version, $arg_records);
		$query = $this->getQueryFromRequest($request, $action, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		
		return $query;
	}
	
	/*
	 * GET UPDATE RECORDS REQUEST
	 */
	public function getRequestUpdateRecords($arg_query_version, $arg_records)
	{
		if ( is_null($arg_records) || ! is_array($arg_records) || count($arg_records) === 0 )
		{
			return null;
		}
		
		$model_name = $this->getModel()->getResourceName();
		$request = null;
		switch($arg_query_version)
		{
			case '1':
			{
				// CREATE ZF2 REQUEST
				$request = new \Zend\Http\Request();
				$this->object($request)->isInstanceOf('\Zend\Http\Request');
				
				// SET RECORDS STRING
				$records_str = '';
				foreach($arg_records as $record)
				{
					if ($records_str !== '')
					{
						$records_str .= ',';
					}
					
					foreach($record as $field_name => $field_value)
					{
						$records_str .= $field_name.'='.$field_value;
					}
				}
				
				// FILL TEST REQUEST
				$request->setMethod(\Zend\Http\Request::METHOD_GET);
				$request->setUri('/models/'.$model_name.'/update');
				$request->getQuery()->set('query_api', '1');
				$request->getQuery()->set('query_action', 'update');
				$request->getQuery()->set('query_values', $records_str);
			}
			
			case '2':
			{
				// CREATE ZF2 REQUEST
				$request = new \Zend\Http\Request();
				$this->object($request)->isInstanceOf('\Zend\Http\Request');
				
				// BUILD JSON QUERY
				$query_json_array = array();
				$query_json_array['action']	= 'update';
				$query_json_array['values']	= $arg_records;
				$query_json_array['values_count']	= count($arg_records);
				$jsonOptions = null;
				$query_json = JsonFormatter::encode($query_json_array, null, $jsonOptions);
				// echo 'query_json='.$query_json;
				
				// FILL TEST REQUEST
				$request->setMethod(\Zend\Http\Request::METHOD_GET);
				$request->setUri('/models/'.$model_name.'/update');
				$request->getQuery()->set('query_api', '2');
				$request->getQuery()->set('query_json', $query_json);
			}
		}
		
		return $request;
	}
	
	
	
	/*
	 * GET A QUERY TO DELETE RECORDS
	 */
	public function getQueryDeleteRecords($arg_query_version, $arg_records, $arg_id = null)
	{
		if ( is_null($arg_records) || ! is_array($arg_records) || ( count($arg_records) === 0 && ! is_scalar($arg_id) ) )
		{
			return null;
		}
		
		$action = 'delete';
		$request = $this->getRequestDeleteRecords($arg_query_version, $arg_records);
		$query = $this->getQueryFromRequest($request, $action, $arg_id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		
		return $query;
	}
	
	/*
	 * GET DELETE RECORDS REQUEST
	 */
	public function getRequestDeleteRecords($arg_query_version, $arg_records)
	{
		if ( is_null($arg_records) || ! is_array($arg_records) )
		{
			return null;
		}
		
		$model_name = $this->getModel()->getResourceName();
		$request = null;
		switch($arg_query_version)
		{
			case '1':
			{
				// CREATE ZF2 REQUEST
				$request = new \Zend\Http\Request();
				$this->object($request)->isInstanceOf('\Zend\Http\Request');
				
				// SET RECORDS STRING
				$records_str = '';
				foreach($arg_records as $record)
				{
					if ($records_str !== '')
					{
						$records_str .= ',';
					}
					
					foreach($record as $field_name => $field_value)
					{
						$records_str .= $field_name.'='.$field_value;
					}
				}
				
				// FILL TEST REQUEST
				$request->setMethod(\Zend\Http\Request::METHOD_GET);
				$request->setUri('/models/'.$model_name.'/delete');
				$request->getQuery()->set('query_api', '1');
				$request->getQuery()->set('query_action', 'delete');
				$request->getQuery()->set('query_values', $records_str);
			}
			
			case '2':
			{
				// CREATE ZF2 REQUEST
				$request = new \Zend\Http\Request();
				$this->object($request)->isInstanceOf('\Zend\Http\Request');
				
				// BUILD JSON QUERY
				$query_json_array = array();
				$query_json_array['action']	= 'delete';
				$query_json_array['values']	= $arg_records;
				$query_json_array['values_count']	= count($arg_records);
				$jsonOptions = null;
				$query_json = JsonFormatter::encode($query_json_array, null, $jsonOptions);
				// echo 'query_json='.$query_json;
				
				// FILL TEST REQUEST
				$request->setMethod(\Zend\Http\Request::METHOD_GET);
				$request->setUri('/models/'.$model_name.'/delete');
				$request->getQuery()->set('query_api', '2');
				$request->getQuery()->set('query_json', $query_json);
			}
		}
		
		return $request;
	}
}