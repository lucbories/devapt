<?php
namespace Devapt\tests\units\Models;

//	------------------------------------ USE CASE -----------------------------------
//	cmd>d:
//	cmd>cd D:\DATAS\GitHub\DevApt\devapt-server\tests
//	cmd>php ..\dist\mageekguy.atoum.phar -f devapt\tests\units\Models\QueryBuilderV2.php
//	---------------------------------------------------------------------------------



// 	------------------------------------ DEPENDENCIES -------------------------------

// REQUIRE DEVAPT, ZF2 AND ATOUM
require_once(__DIR__ . '/../../../autoload.php');
require_once(__DIR__ . '/UsersModel.php');

// IMPORTS ATOUM
use \atoum;

// IMPORTS ZF2

// IMPORTS DEVAPT

//	---------------------------------------------------------------------------------



// 	------------------------------------ TEST ---------------------------------------
// TEST CLASS
class QueryBuilderV2 extends atoum
{
    /*
     * QueryBuilderV2::__construct()
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
     * QueryBuilderV2::buildFromRequest($arg_action, $arg_model, $arg_request, $arg_id)
     */
    public function testBuildFromRequest()
    {
		$users_model_test = new UsersModel();
		$result = $users_model_test->initApplication();
		$this->boolean($result)->isTrue();
		
		// TEST: MODEL IS NULL => QUERY IS NULL
		{
			$action = 'read';
			$request = $users_model_test->getRequestSelectAll('2');
			$query = \Devapt\Models\QueryBuilderV2::buildFromRequest($action, null, $request, null);
			$this->variable($query)->IsNull();
		}
		
		
		// TEST: REQUEST IS NULL => QUERY IS NULL
		$action = 'read';
		$query = $users_model_test->getQueryFromRequest(null, $action, null);
		$this->variable($query)->IsNull();
		
		$action = 'create';
		$query = $users_model_test->getQueryFromRequest(null, $action, null);
		$this->variable($query)->IsNull();
		
		$action = 'delete';
		$query = $users_model_test->getQueryFromRequest(null, $action, null);
		$this->variable($query)->IsNull();
		
		$action = 'update';
		$query = $users_model_test->getQueryFromRequest(null, $action, null);
		$this->variable($query)->IsNull();
		
		
		// TEST: SELECT ALL QUERY IS NOT NULL
		$query = $users_model_test->getQuerySelectAll('2');
		$this->variable($query)->IsNotNull();
		$sql_str = $users_model_test->getQuerySqlString($query, 'read');
		// echo 'sql_str:'.$sql_str;
		$target_sql = "SELECT `id_user` AS `id_user`, `login` AS `login`, `lastname` AS `lastname`, `firstname` AS `firstname`, `email` AS `email`, `password` AS `password` FROM `users` AS `users`";
		$this->string($sql_str)->isIdenticalTo($target_sql);
		
		
		// TEST: SELECT ALL LOGIN,LASTNAME QUERY IS NOT NULL
		$query = $users_model_test->getQuerySelectAllLoginLastname('2');
		$this->variable($query)->IsNotNull();
		$sql_str = $users_model_test->getQuerySqlString($query, 'read');
		// echo 'sql_str:'.$sql_str;
		$target_sql = "SELECT `login` AS `login`, `lastname` AS `lastname` FROM `users` AS `users` ORDER BY `lastname` DESC";
		$this->string($sql_str)->isIdenticalTo($target_sql);
		
		
		// TEST: SELECT ALL LOGIN,LASTNAME WITH ONE FILTER QUERY IS NOT NULL
		$query = $users_model_test->getQuerySelectAllLoginLastnameWithOneFilter('2');
		$this->variable($query)->IsNotNull();
		$sql_str = $users_model_test->getQuerySqlString($query, 'read');
		// echo 'sql_str:'.$sql_str;
		$target_sql = "SELECT `login` AS `login`, `lastname` AS `lastname` FROM `users` AS `users` WHERE (`UPPER`(`login`) LIKE 'A%') ORDER BY `lastname` DESC";
		$this->string($sql_str)->isIdenticalTo($target_sql);
		
		
		// TEST: SELECT ALL LOGIN,LASTNAME WITH MANY FILTERS QUERY IS NOT NULL
		$query = $users_model_test->getQuerySelectAllLoginLastnameWithManyFilters('2');
		$this->variable($query)->IsNotNull();
		$sql_str = $users_model_test->getQuerySqlString($query, 'read');
		// echo 'sql_str:'.$sql_str;
		$target_sql = "SELECT `login` AS `login`, `lastname` AS `lastname`, `firstname` AS `firstname` FROM `users` AS `users` WHERE (`UPPER`(`login`) LIKE 'A%' AND `firstname` LIKE '%th' AND `LOWER`(`firstname`) IN (smith, juth)) GROUP BY `lastname`, `firstname` ORDER BY `lastname` DESC, `firstname` ASC";
		$this->string($sql_str)->isIdenticalTo($target_sql);
		
		
		// TEST: SELECT ALL LOGIN,LASTNAME WITH JOIN
		// $query = $users_model_test->getQuerySelectAllLoginLastnameWithJoin('2');
		// $this->variable($query)->IsNotNull();
		// $sql_str = $users_model_test->getQuerySqlString($query, 'read');
		// echo 'sql_str:'.$sql_str;
		// $target_sql = "SELECT `login` AS `login`, `lastname` AS `lastname`, `firstname` AS `firstname` FROM `users` AS `users` WHERE (`UPPER`(`login`) LIKE 'A%' AND `firstname` LIKE '%th' AND `LOWER`(`firstname`) IN (smith, juth)) GROUP BY `lastname`, `firstname` ORDER BY `lastname` DESC, `firstname` ASC";
		// $this->string($sql_str)->isIdenticalTo($target_sql);
		
		// http://localhost/devapt-tutorial-1/public/rest/MODEL_AUTH_GROUPS_USERS/?query_api=2&callback=jQuery21109935965745244175_1413648188036&query_json%5Bfilters%5D%5B0%5D%5Boperator%5D=equals&query_json%5Bfilters%5D%5B0%5D%5Boperands%5D%5B%5D=login&query_json%5Bfilters%5D%5B0%5D%5Boperands%5D%5B%5D=demo&query_json%5Bfilters%5D%5B1%5D%5Boperator%5D=equals&query_json%5Bfilters%5D%5B1%5D%5Boperands%5D%5B%5D=id_user&query_json%5Bfilters%5D%5B1%5D%5Boperands%5D%5B%5D=4&_=1413648188038
		
		
		// TEST: INSERT NOTHING QUERY IS NULL
		$action = 'create';
		$query = $users_model_test->getQueryFromRequest(null, $action, null);
		$this->variable($query)->IsNull();
		
		
		// TEST: INSERT NOTHING QUERY IS NULL
		$query = $users_model_test->getQueryCreateRecords('2', null);
		$this->variable($query)->IsNull();
		
		
		// TEST: INSERT EMPTY RECORDS QUERY IS NULL
		$query = $users_model_test->getQueryCreateRecords('2', array());
		$this->variable($query)->IsNull();
		
		
		// TEST: INSERT ONE RECORD QUERY
		$records = array();
		$records[] = array( 'login'=>'test123', 'firstname'=>'John', 'lastname'=>'TEST123', 'password'=>'xxx', 'email'=>'test123@test.tst' );
		$query = $users_model_test->getQueryCreateRecords('2', $records);
		$this->variable($query)->IsNotNull();
		$sql_str = $users_model_test->getQuerySqlString($query, 'create');
		// echo 'sql_str:'.$sql_str;
		$target_sql = "INSERT INTO `users` (`login`, `lastname`, `firstname`, `email`, `password`) VALUES ('test123', 'TEST123', 'John', 'test123@test.tst', 'xxx')";
		$this->string($sql_str)->isIdenticalTo($target_sql);
		
		
		// TEST: INSERT TWO RECORDS QUERY
			// DEFINE QUERY
		$records = array();
		$records[] = array( 'login'=>'test123', 'firstname'=>'John', 'lastname'=>'TEST123', 'password'=>'xxx', 'email'=>'test123@test.tst' );
		$records[] = array( 'login'=>'test456', 'firstname'=>'Jim', 'lastname'=>'TEST456', 'password'=>'yyy', 'email'=>'test456@test.tst' );
		$query = $users_model_test->getQueryCreateRecords('2', $records);
		$this->variable($query)->IsNotNull();
			// LOOP ON RECORDS TO INSERT
		$values_count	= $query->getOperandsValuesCount();
		$target_sql		= array();
		$target_sql[]	= "INSERT INTO `users` (`login`, `lastname`, `firstname`, `email`, `password`) VALUES ('test123', 'TEST123', 'John', 'test123@test.tst', 'xxx')";
		$target_sql[]	= "INSERT INTO `users` (`login`, `lastname`, `firstname`, `email`, `password`) VALUES ('test456', 'TEST456', 'Jim', 'test456@test.tst', 'yyy')";
		while($query->getOperandsValuesCursor() < $values_count)
		{
			$sql_str = $users_model_test->getQuerySqlString($query, 'create');
			$this->string($sql_str)->isIdenticalTo($target_sql[$query->getOperandsValuesCursor()]);
			$query->getOperandsValuesCursorIncr();
		}
		
		
		// TEST: UPDATE NOTHING QUERY IS NULL
		$action = 'update';
		$query = $users_model_test->getQueryFromRequest(null, $action, null);
		$this->variable($query)->IsNull();
		
		
		// TEST: UPDATE NOTHING QUERY IS NULL
		$query = $users_model_test->getQueryUpdateRecords('2', null);
		$this->variable($query)->IsNull();
		
		
		// TEST: UPDATE EMPTY RECORDS QUERY IS NULL
		$query = $users_model_test->getQueryUpdateRecords('2', array());
		$this->variable($query)->IsNull();
		
		
		// TEST: UPDATE ONE RECORD QUERY
		$records = array();
		$records[] = array( 'login'=>'test123', 'firstname'=>'NewJohn' );
		$query = $users_model_test->getQueryUpdateRecords('2', $records, '123');
		$this->variable($query)->IsNotNull();
		$sql_str = $users_model_test->getQuerySqlString($query, 'update');
		// echo 'sql_str:'.$sql_str;
		$target_sql = "UPDATE `users` SET `login` = 'test123', `firstname` = 'NewJohn' WHERE `id_user` = '123'";
		$this->string($sql_str)->isIdenticalTo($target_sql);
		
		
		// TEST: UPDATE TWO RECORDS QUERY
			// DEFINE QUERY
		$records = array();
		$records[] = array( 'login'=>'test123', 'firstname'=>'NewJohn' );
		$records[] = array( 'firstname'=>'NewJim', 'email'=>'test456-new@test.tst' );
		$query = $users_model_test->getQueryUpdateRecords('2', $records, ['123', '456']);
		$this->variable($query)->IsNotNull();
			// LOOP ON RECORDS TO INSERT
		$values_count	= $query->getOperandsValuesCount();
		$target_sql		= array();
		$target_sql[]	= "UPDATE `users` SET `login` = 'test123', `firstname` = 'NewJohn' WHERE `id_user` = '123'";
		$target_sql[]	= "UPDATE `users` SET `firstname` = 'NewJim', `email` = 'test456-new@test.tst' WHERE `id_user` = '456'";
		while($query->getOperandsValuesCursor() < $values_count)
		{
			$sql_str = $users_model_test->getQuerySqlString($query, 'update');
			$this->string($sql_str)->isIdenticalTo($target_sql[$query->getOperandsValuesCursor()]);
			$query->getOperandsValuesCursorIncr();
		}
		
		
		// TEST: DELETE NOTHING QUERY IS NULL
		$action = 'delete';
		$query = $users_model_test->getQueryFromRequest(null, $action, null);
		$this->variable($query)->IsNull();
		
		
		// TEST: DELETE NOTHING QUERY IS NULL
		$query = $users_model_test->getQueryDeleteRecords('2', null);
		$this->variable($query)->IsNull();
		
		
		// TEST: DELETE EMPTY RECORDS QUERY IS NULL
		$query = $users_model_test->getQueryDeleteRecords('2', array());
		$this->variable($query)->IsNull();
		
		
		// TEST: DELETE ONE RECORD QUERY WITH LOGIN
		$records = array();
		$records[] = array( 'login'=>'test123' );
		$query = $users_model_test->getQueryDeleteRecords('2', $records, null);
		$this->variable($query)->IsNotNull();
		$sql_str = $users_model_test->getQuerySqlString($query, 'delete');
		// echo 'sql_str:'.$sql_str;
		$target_sql = "DELETE FROM `users` WHERE `login` = 'test123'";
		$this->string($sql_str)->isIdenticalTo($target_sql);
		
		
		// TEST: DELETE ONE RECORD QUERY WITH URL ID
		$records = array();
		$query = $users_model_test->getQueryDeleteRecords('2', $records, '123');
		$this->variable($query)->IsNotNull();
		$sql_str = $users_model_test->getQuerySqlString($query, 'delete');
		// echo 'sql_str:'.$sql_str;
		$target_sql = "DELETE FROM `users` WHERE `id_user` = '123'";
		$this->string($sql_str)->isIdenticalTo($target_sql);
		
		
		// TEST: DELETE ONE RECORD QUERY WITH QUERY ID
		$records = array();
		$records[] = array( 'id_user'=>'123' );
		$query = $users_model_test->getQueryDeleteRecords('2', $records, null);
		$this->variable($query)->IsNotNull();
		$sql_str = $users_model_test->getQuerySqlString($query, 'delete');
		// echo 'sql_str:'.$sql_str;
		$target_sql = "DELETE FROM `users` WHERE `id_user` = '123'";
		$this->string($sql_str)->isIdenticalTo($target_sql);
	}
}