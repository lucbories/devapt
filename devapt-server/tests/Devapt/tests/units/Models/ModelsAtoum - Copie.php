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
    /*
     * Load resources and init application for tests units
     */
    public function initApplication()
    {
		// -------- INIT APPLICATION RESOURCE -------
		
		// LOAD APPLICATION CONFIGURATION
		$cfg_file_path_name = __DIR__ .'/app_cfg.ini';
		$reader = new IniReader();
		$reader->setNestSeparator('.');
		$records_array = $reader->fromFile($cfg_file_path_name);
		$this->array($records_array)->size->isGreaterThan(0);
		
		// CREATE AND RUN APPLICATION
		$app = new Application($records_array);
		$this->object($app)->isInstanceOf('\Devapt\Application\Application');
		$result = Application::getInstance()->run_tu(__DIR__ .'/');
		$this->boolean($result)->isTrue();
		
		
		// -------- INIT MODEL USERS -------
		
		// GET VIEW RESOURCE OBJECT
		$resource_name = 'MODEL_AUTH_USERS';
		$model = \Devapt\Resources\Broker::getResourceObject($resource_name);
		// $this->object($model_resource)->size->isGreaterThan(0);
		
		// BUILD MODEL
		// $model = new \Devapt\Models\Model($model_resource);
		$this->object($model)->isInstanceOf('\Devapt\Resources\Model');
		
		
		// ------- INIT REQUEST SELECT -------
		$request = new \Zend\Http\Request();
		$this->object($request)->isInstanceOf('\Zend\Http\Request');
		
		$request->setMethod(\Zend\Http\Request::METHOD_GET);
		$request->setUri('/models/MODEL_AUTH_USERS/read');
		// $request->getHeaders()->addHeaders(array(
			// 'HeaderField1' => 'header-field-value1',
			// 'HeaderField2' => 'header-field-value2',
		// ));
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
		
		$action = 'read';
		$id = null;
		$query = \Devapt\Models\QueryBuilderV1::buildFromRequest($action, $model, $request, $id);
		$this->object($query)->isInstanceOf('\Devapt\Models\Query');
		// $this->boolean($result)->isTrue();
	}
}