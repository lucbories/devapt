<?php
namespace Devapt\tests\units\Models;

//	------------------------------------ USE CASE -----------------------------------
//	cmd>d:
//	cmd>cd D:\DATAS\GitHub\DevApt\devapt-server\tests
//	cmd>php ..\dist\mageekguy.atoum.phar -f devapt\tests\units\Models\AAAA.php
//	---------------------------------------------------------------------------------



// 	------------------------------------ DEPENDENCIES -------------------------------
// REQUIRE DEVAPT, ZF2 AND ATOUM
require_once(__DIR__ . '/../../../autoload.php');
require_once(__DIR__ . '/Model.php');

// IMPORTS ATOUM

// IMPORTS ZF2
use Zend\Json\Json as JsonFormatter;

// IMPORTS DEVAPT

//	---------------------------------------------------------------------------------



// 	------------------------------------ TEST ---------------------------------------
// TEST CLASS
class UsersModel extends Model
{
	// ATTRIBUTES
	
	
	
	/*
     * CONSTRUCTOR
     */
	public function __construct()
    {
		$this->model_name = 'MODEL_AUTH_USERS';
		parent::__construct();
	}
	
	
	
	/*
	 * GET A QUERY TO SELECT ALL RECORDS
	 */
	public function getQuerySelectAllLoginLastname($arg_query_version)
	{
		$action = 'read';
		$request = $this->getRequestSelectAllLoginLastname($arg_query_version);
		$id = null;
		$query = $this->getQueryFromRequest($request, $action, $id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		
		return $query;
	}
	
	/*
	 * GET SELECT REQUEST FOR ALL USERS WITH LOGIN AND LASTNAME ORDERED BY LASTNAME DESC AND SLICE (10-30)
	 */
	public function getRequestSelectAllLoginLastname($arg_query_version)
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
			}
			
			case '2':
			{
				// CREATE ZF2 REQUEST
				$request = new \Zend\Http\Request();
				$this->object($request)->isInstanceOf('\Zend\Http\Request');
				
				// BUILD JSON QUERY
				$query_json_array = array();
				$query_json_array['action']				= 'select';
				$query_json_array['crud_table']			= 'users';
				$query_json_array['fields']				= array('login', 'lastname');
				$query_json_array['orders']				= array( array('field'=>'lastname', 'mode'=>'desc') );
				$query_json_array['slice']				= array();
				$query_json_array['slice']['offset']	= '10';
				$query_json_array['slice']['length']	= '10';
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
	 * GET A QUERY TO SELECT ALL RECORDS WITH LOGIN AND LASTNAME ORDERED BY LASTNAME DESC AND SLICE (10-30) WITH ONE FILTER
	 */
	public function getQuerySelectAllLoginLastnameWithOneFilter($arg_query_version)
	{
		$action = 'read';
		$request = $this->getRequestSelectAllLoginLastnameWithOneFilter($arg_query_version);
		$id = null;
		$query = $this->getQueryFromRequest($request, $action, $id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		
		return $query;
	}
	
	/*
	 * GET SELECT REQUEST FOR ALL USERS WITH LOGIN AND LASTNAME ORDERED BY LASTNAME DESC AND SLICE (10-30) WITH ONE FILTER
	 */
	public function getRequestSelectAllLoginLastnameWithOneFilter($arg_query_version)
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
				$request->getQuery()->set('query_fields', 'login,lastname');
				// $request->getQuery()->set('query_values', '');
				$request->getQuery()->set('query_filters', 'field=login,type=String,modifier=upper,op=begins_with,var1=A');
				$request->getQuery()->set('query_orders', 'lastname=desc');
				// $request->getQuery()->set('query_groups', '');
				$request->getQuery()->set('query_slice_begin', '10');
				$request->getQuery()->set('query_slice_end', '20');
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
				$query_json_array['action']				= 'select';
				$query_json_array['crud_table']			= 'users';
				$query_json_array['fields']				= array('login', 'lastname');
				$query_json_array['orders']				= array( array('field'=>'lastname', 'mode'=>'desc') );
				$query_json_array['filters']			= array();
				$query_json_array['filters'][]			= array(
					'combination'=>'and',
					'expression'=>array(
						'operator'=>'begins with',
						'operands'=>array(
							array(
								'operator'=>'upper',
								'operands'=>array(
									array('value'=>'login', 'type'=>'String')
								)
							),
							array('value'=>'A', 'type'=>'String')
						)
					)
				);
				$query_json_array['slice']				= array();
				$query_json_array['slice']['offset']	= '10';
				$query_json_array['slice']['length']	= '10';
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
	 * GET A QUERY TO SELECT ALL RECORDS WITH LOGIN AND LASTNAME ORDERED BY LASTNAME DESC AND SLICE (10-30) WITH MANY FILTERS
	 */
	public function getQuerySelectAllLoginLastnameWithManyFilters($arg_query_version)
	{
		$action = 'read';
		$request = $this->getRequestSelectAllLoginLastnameWithManyFilters($arg_query_version);
		$id = null;
		$query = $this->getQueryFromRequest($request, $action, $id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		
		return $query;
	}
	
	/*
	 * GET SELECT REQUEST FOR ALL USERS WITH LOGIN AND LASTNAME ORDERED BY LASTNAME DESC AND SLICE (10-30) WITH MANY FILTERS
	 */
	public function getRequestSelectAllLoginLastnameWithManyFilters($arg_query_version)
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
				$request->getQuery()->set('query_fields', 'login,lastname, firstname');
				// $request->getQuery()->set('query_values', '');
				$request->getQuery()->set('query_filters', 'field=login,type=String,modifier=upper,op=begins_with,var1=A|field=firstname,type=String,modifier=,op=ends_with,var1=th|field=firstname,type=String,modifier=lower,op=in,var1=smith,var2=juth');
				$request->getQuery()->set('query_orders', 'lastname=desc|firstname=ASC');
				$request->getQuery()->set('query_groups', 'lastname,firstname');
				// $request->getQuery()->set('query_slice_begin', '10');
				// $request->getQuery()->set('query_slice_end', '20');
				$request->getQuery()->set('query_slice_offset', '3');
				$request->getQuery()->set('query_slice_length', '20');
				// $request->getQuery()->set('query_joins', '');
			}
			
			case '2':
			{
				// CREATE ZF2 REQUEST
				$request = new \Zend\Http\Request();
				$this->object($request)->isInstanceOf('\Zend\Http\Request');
				
				// BUILD JSON QUERY
				$query_json_array = array();
				$query_json_array['action']				= 'select';
				$query_json_array['crud_table']			= 'users';
				$query_json_array['fields']				= array('login', 'lastname', 'firstname');
				$query_json_array['orders']				= array( array('field'=>'lastname', 'mode'=>'desc'), array('field'=>'firstname', 'mode'=>'ASC') );
				$query_json_array['groups']				= array('lastname', 'firstname');
				$query_json_array['filters']			= array();
				$query_json_array['filters'][]			= array(
					'combination'=>'and',
					'expression'=>array(
						'operator'=>'begins with',
						'operands'=>array(
							array(
								'operator'=>'upper',
								'operands'=>array(
									array('value'=>'login', 'type'=>'String')
								)
							),
							array('value'=>'A', 'type'=>'String')
						)
					)
				);
				$query_json_array['filters'][]			= array(
					'combination'=>'and',
					'expression'=>array(
						'operator'=>'ends with',
						'operands'=>array(
							array('value'=>'firstname', 'type'=>'String'),
							array('value'=>'th', 'type'=>'String')
						)
					)
				);
				$query_json_array['filters'][]			= array(
					'combination'=>'and',
					'expression'=>array(
						'operator'=>'in',
						'operands'=>array(
							array(
								'operator'=>'lower',
								'operands'=>array(
									array('value'=>'firstname', 'type'=>'String')
								)
							),
							array('value'=>'smith', 'type'=>'String'),
							array('value'=>'juth', 'type'=>'String')
						)
					)
				);
				$query_json_array['slice']				= array();
				$query_json_array['slice']['offset']	= '3';
				$query_json_array['slice']['length']	= '20';
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
	 * GET A QUERY TO SELECT ALL RECORDS
	 */
	public function getQuerySelectAllLoginLastnameWithJoin($arg_query_version)
	{
		$action = 'read';
		$request = $this->getRequestSelectAllLoginLastnameWithJoin($arg_query_version);
		$id = null;
		$query = $this->getQueryFromRequest($request, $action, $id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		
		return $query;
	}
	
	/*
	 * GET SELECT REQUEST FOR ALL USERS WITH LOGIN AND LASTNAME ORDERED BY LASTNAME DESC AND SLICE (10-30)
	 */
	public function getRequestSelectAllLoginLastnameWithJoin($arg_query_version)
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
				$request->getQuery()->set('query_fields', 'login,lastname');
				// $request->getQuery()->set('query_values', '');
				// $request->getQuery()->set('query_filters', '');
				$request->getQuery()->set('query_orders', 'lastname=desc');
				// $request->getQuery()->set('query_groups', '');
				$request->getQuery()->set('query_slice_begin', '10');
				$request->getQuery()->set('query_slice_end', '20');
				// $request->getQuery()->set('query_slice_offset', '');
				// $request->getQuery()->set('query_slice_length', '');
				$request->getQuery()->set('query_joins', 'db=,table=users,column=id_user,join_db=,join_table=groups_users,join_table_alias=gu,join_column=id_user,join_mode=INNER');
			}
			
			case '2':
			{
				// CREATE ZF2 REQUEST
				$request = new \Zend\Http\Request();
				$this->object($request)->isInstanceOf('\Zend\Http\Request');
				
				// BUILD JSON QUERY
				$query_json_array = array();
				$query_json_array['action']				= 'select';
				$query_json_array['crud_table']			= 'users';
				$query_json_array['fields']				= array('login', 'lastname');
				$query_json_array['orders']				= array( array('field'=>'lastname', 'mode'=>'desc') );
				
				$query_json_array['slice']				= array();
				$query_json_array['slice']['offset']	= '10';
				$query_json_array['slice']['length']	= '10';
				
				$query_json_array['joins']				= array();
				
				$join_record = array();
				$join_record['mode']				= 'INNER';
				$join_record['source']				= array();
				$join_record['source']['column']	= 'id_user';
				$join_record['target']				= array();
				$join_record['target']['table']		= 'groups_users';
				$join_record['target']['column']	= 'label';
				
				$query_json_array['joins'][]		= $join_record;
				
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
	 * GET SELECT V1 REQUEST FOR USERS - 3
	 */
/*	public function getRequestV1UsersSelect_3()
	{
		// CREATE ZF2 REQUEST
		$request = new \Zend\Http\Request();
		$this->object($request)->isInstanceOf('\Zend\Http\Request');
		
		// FILL TEST REQUEST
		$request->setMethod(\Zend\Http\Request::METHOD_GET);
		$request->setUri('/models/'.$model_name.'/read');
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
		
		return $request;
	}
	*/
	
	/*
	 * GET INSERT V1 REQUEST FOR USERS - 1
	 */
/*	public function getRequestV1UsersInsert_1()
	{
		// CREATE ZF2 REQUEST
		$request = new \Zend\Http\Request();
		$this->object($request)->isInstanceOf('\Zend\Http\Request');
		
		// FILL TEST REQUEST
		$request->setMethod(\Zend\Http\Request::METHOD_GET);
		$request->setUri('/models/'.$model_name.'/create');
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
	}*/
}