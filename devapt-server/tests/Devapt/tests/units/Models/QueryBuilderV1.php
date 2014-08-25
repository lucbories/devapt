<?php
namespace Devapt\tests\units\Models;

// REQUIRE DEVAPT, ZF2 AND ATOUM
require(__DIR__ . '/../../../autoload.php');
require(__DIR__ . '/ModelsAtoum.php');
// require(__DIR__ . '/init_request_select.php');

// IMPORTS ATOUM
use \atoum;

// IMPORTS ZF2
use Zend\Config\Reader\Ini AS IniReader;

// IMPORTS DEVAPT
use Devapt\Application\Application as Application;

// TEST CLASS
class QueryBuilderV1 extends ModelsAtoum
{
    /*
     * QueryBuilderV1::__construct()
     */
    public function test__construct()
    {
		$this
			// SCALAR
			->boolean( false )
                ->isFalse()
		;
	}
	
	
    /*
     * QueryBuilderV1::buildFromRequest($arg_action, $arg_model, $arg_request, $arg_id)
     */
    public function testBuildFromRequest()
    {
		$this->initApplication();
		$model = $this->getModelUsers();
		
		{
			$action = 'read';
			$request = $this->getRequestV1UsersSelect_1();
			$query = \Devapt\Models\QueryBuilderV1::buildFromRequest($action, null, $request, null);
			$this->variable($query)->IsNull();
		}
		{
			$action = 'read';
			$query = \Devapt\Models\QueryBuilderV1::buildFromRequest($action, $model, null, null);
			$this->variable($query)->IsNull();
		}
		{
			$request = $this->getRequestV1UsersSelect_1();
			$query = $this->getQueryV1Select($model, $request, null);
		}
		{
			$request = $this->getRequestV1UsersSelect_2();
			$query = $this->getQueryV1Select($model, $request, null);
		}
		{
			$request = $this->getRequestV1UsersSelect_3();
			$query = $this->getQueryV1Select($model, $request, 123);
		}
		{
			$request = $this->getRequestV1UsersInsert_1();
			$query = $this->getQueryV1Create($model, $request, null);
		}
	}
	
	
    /*
     * QueryBuilderV1::buildFromArray($arg_action, $arg_model, $arg_array, $arg_id)
     */
    public function testBuildFromArray()
    {
		$this->initApplication();
		$model = $this->getModelUsers();
		
		{
			$action = 'read';
			$request = $this->getRequestV1UsersSelect_1();
			$records = $request->getQuery()->toArray();
			$query = \Devapt\Models\QueryBuilderV1::buildFromArray($action, null, $records, null);
			$this->variable($query)->IsNull();
		}
		{
			$action = 'read';
			$query = \Devapt\Models\QueryBuilderV1::buildFromArray($action, $model, null, null);
			$this->variable($query)->IsNull();
		}
		{
			$action = 'read';
			$request = $this->getRequestV1UsersSelect_1();
			$records = $request->getQuery()->toArray();
			$query = \Devapt\Models\QueryBuilderV1::buildFromArray($action, $model, $records, null);
			$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		}
		{
			$action = 'read';
			$request = $this->getRequestV1UsersSelect_2();
			$records = $request->getQuery()->toArray();
			$query = \Devapt\Models\QueryBuilderV1::buildFromArray($action, $model, $records, null);
			$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		}
		{
			$action = 'read';
			$request = $this->getRequestV1UsersSelect_3();
			$records = $request->getQuery()->toArray();
			$query = \Devapt\Models\QueryBuilderV1::buildFromArray($action, $model, $records, null);
			$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		}
		{
			$action = 'read';
			$request = $this->getRequestV1UsersInsert_1();
			$records = $request->getQuery()->toArray();
			$query = \Devapt\Models\QueryBuilderV1::buildFromArray($action, $model, $records, null);
			$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		}
	}
}