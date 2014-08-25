<?php
/**
 * @file        SqlEngine.php
 * @brief       SqlEngine class
 * @details     SQL Engine
 * 					The list of officially supported drivers:
 * 						- Mysqli: The ext/mysqli driver
 * 						- Pgsql: The ext/pgsql driver
 * 						- Sqlsrv: The ext/sqlsrv driver (from Microsoft)
 * 						- Pdo_Mysql: MySQL through the PDO extension
 * 						- Pdo_Sqlite: SQLite though the PDO extension
 * 						- Pdo_Pgsql: PostgreSQL through the PDO extension
 * @see			...
 * @ingroup     MODELS
 * @date        2014-02-22
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		...
 */

namespace Devapt\Models\Sql;

// DEVAPT IMPORTS
use Devapt\Core\Trace;
use Devapt\Models\Query;
use Devapt\Models\Sql\FilterNode;
use Devapt\Resources\Model;

// ZEND IMPORTS
use Zend\Debug\Debug;
use Zend\Db\Adapter\Adapter as DbAdapter;
use Zend\Db\Sql\Sql;
use Zend\Db\ResultSet\ResultSet;

use \Devapt\Security\DbConnexions;

class SqlEngine
{
	// STATIC ATTRIBUTES
	
	/// @brief TRACE FLAG
	static public $TRACE_ENGINE	= true;
	
	
	
	// INSTANCE ATTRIBUTES
	
	/// @brief Model object (Devapt\Resources\Model)
	private $model			= null;
	
	/// @brief ZF2 DB adapter (Zend\Db\Adapter\Adapter)
	private $db_adapter		= null;
	
	
	
	/**
	 * @brief		Constructor
	 * @param[in]	arg_model			model (object)
	 * @param[in]	arg_fieds_array		query fields (array of strings)
	 * @param[in]	arg_type			query type (string)
	 * @return		nothing
	 */
	public function __construct($arg_model)
	{
		$this->model = $arg_model;
	}
	
	
	
	/**
	 * @brief		Init engine
	 * @return		boolean
	 */
	public function init()
	{
		$context = 'SqlEngine.init()';
		Trace::enter($context, '', self::$TRACE_ENGINE);
		
		
		// TEST IF ALREADY INIT
		if ( is_object($this->db_adapter) )
		{
			return Trace::leaveok($context, 'already init', true, self::$TRACE_ENGINE);
		}
		
		
		// CHECK MODEL
		if ( ! is_object($this->model) )
		{
			Trace::warning($context.' bad model object');
			return Trace::leaveko($context, 'bad model object', false, self::$TRACE_ENGINE);
		}
		
		// CHECK CONNEXION
		$connexion_name = $this->model->getModelConnexionName();
		if ( ! DbConnexions::hasConnexion($connexion_name) )
		{
			return Trace::leaveko($context, 'bad connexion name ['.$connexion_name.']', false, self::$TRACE_ENGINE);
		}
		
		// GET CONNEXION ATTRIBUTES
		$arg_options = array();
		$arg_options['driver']		= DbConnexions::getConnexionDriver($connexion_name);
		$arg_options['hostname']	= DbConnexions::getConnexionHostname($connexion_name);
		$arg_options['port']		= DbConnexions::getConnexionPort($connexion_name);
		$arg_options['database']	= DbConnexions::getConnexionDatabase($connexion_name);
		$arg_options['username']	= DbConnexions::getConnexionUser($connexion_name);
		$arg_options['password']	= DbConnexions::getConnexionPassword($connexion_name);
		$arg_options['charset']		= DbConnexions::getConnexionCharset($connexion_name, '');
		
		// INIT DB ADAPTER
		$this->db_adapter = new DbAdapter($arg_options);
		
		return Trace::leaveok($context, 'success', true, self::$TRACE_ENGINE);
	}
	
	
	
	/**
	 * @brief		Get the model
	 * @return		Object			Devapt\Resources\Model	
	 */
	public function getModel()
	{
		$context = 'SqlEngine.getDbAdapter()';
		Trace::enter($context, '', self::$TRACE_ENGINE);
		
		if ( ! is_object($this->model) )
		{
			return Trace::leaveko($context, 'bad model object', null, self::$TRACE_ENGINE);
		}
		
		return Trace::leaveok($context, '', $this->model, self::$TRACE_ENGINE);
	}
	
	
	
	/**
	 * @brief		Get the DB adapter
	 * @param[in]	arg_query			query (object)
	 * @return		object				Zend\Db\Adapter\Adapter
	 */
	public function getDbAdapter()
	{
		$context = 'SqlEngine.getDbAdapter()';
		Trace::enter($context, '', self::$TRACE_ENGINE);
		
		// CHECK INIT
		if ( ! $this->init() )
		{
			return Trace::leaveko($context, 'init failure', null, self::$TRACE_ENGINE);
		}
		
		return Trace::leaveok($context, '', $this->db_adapter, self::$TRACE_ENGINE);
	}
	
	
	
	/**
	 * @brief		Read datas
	 * @param[in]	arg_query			query (object)
	 * @return		array				array of records
	 */
	public function read($arg_query)
	{
		$context = 'SqlEngine.read(query)';
		Trace::enter($context, '', self::$TRACE_ENGINE);
		
		$results = $this->do_crud($arg_query, 'read');
		
		return Trace::leaveok($context, '', $results, self::$TRACE_ENGINE);
	}
	
	
	
	/**
	 * @brief		Create datas
	 * @param[in]	arg_query			query (object)
	 * @return		booean				array of records
	 */
	public function create($arg_query)
	{
		$context = 'SqlEngine.create(query)';
		Trace::enter($context, '', self::$TRACE_ENGINE);
		
		$results = $this->do_crud($arg_query, 'create');
		
		return Trace::leaveok($context, '', $results, self::$TRACE_ENGINE);
	}
	
	
	
	/**
	 * @brief		Update datas
	 * @param[in]	arg_query			query (object)
	 * @return		booean				array of records
	 */
	public function update($arg_query)
	{
		$context = 'SqlEngine.update(query)';
		Trace::enter($context, '', self::$TRACE_ENGINE);
		
		$results = $this->do_crud($arg_query, 'update');
		
		return Trace::leaveok($context, '', $results, self::$TRACE_ENGINE);
	}
	
	
	
	/**
	 * @brief		Delete datas
	 * @param[in]	arg_query			query (object)
	 * @return		booean				array of records
	 */
	public function delete($arg_query)
	{
		$context = 'SqlEngine.delete(query)';
		Trace::enter($context, '', self::$TRACE_ENGINE);
		
		$results = $this->do_crud($arg_query, 'delete');
		
		return Trace::leaveok($context, '', $results, self::$TRACE_ENGINE);
	}
	
	
	
	/**
	 * @brief		Insert datas
	 * @param[in]	arg_query			query (object)
	 * @return		booean				array of records
	 */
	public function do_crud($arg_query, $arg_action)
	{
		$context = 'SqlEngine.do_crud(query,action)';
		Trace::enter($context, '', self::$TRACE_ENGINE);
		
		
		// CHECK INIT
		if ( ! $this->init() )
		{
			return Trace::leaveko($context, 'init failure', null, self::$TRACE_ENGINE);
		}
		
		
		// CHECK QUERY
		if ( ! is_object($arg_query) )
		{
			return Trace::leaveko($context, 'bad query object', null, self::$TRACE_ENGINE);
		}
		
		
		// CREATE ZF2 SQL OBJECT
		$sql = new Sql( $this->getDbAdapter() );
		
		
		// BUILD SQL
		$sql_action = null;
		$query_version = $arg_query->getVersion();
		switch($arg_action.'-'.$query_version)
		{
			case 'read-1':
			{
				Trace::step($context, $arg_action.' for query version '.$query_version, self::$TRACE_ENGINE);
				$sql_action = SqlBuilder::compileSelect($this, $arg_query, $sql);
				break;
			}
			case 'create-1':
			{
				Trace::step($context, $arg_action.' for query version '.$query_version, self::$TRACE_ENGINE);
				$sql_action = SqlBuilder::compileInsert($this, $arg_query, $sql);
				break;
			}
			case 'update-1':
			{
				Trace::step($context, $arg_action.' for query version '.$query_version, self::$TRACE_ENGINE);
				$sql_action = SqlBuilder::compileUpdate($this, $arg_query, $sql);
				break;
			}
			case 'delete-1':
			{
				Trace::step($context, $arg_action.' for query version '.$query_version, self::$TRACE_ENGINE);
				$sql_action = SqlBuilder::compileDelete($this, $arg_query, $sql);
				break;
			}
			
			
			case 'read-2':
			{
				Trace::step($context, $arg_action.' for query version '.$query_version, self::$TRACE_ENGINE);
				$sql_action = SqlBuilder::compileSelect($this, $arg_query, $sql);
				break;
			}
			case 'create-2':
			{
				Trace::step($context, $arg_action.' for query version '.$query_version, self::$TRACE_ENGINE);
				$sql_action = SqlBuilder::compileInsert($this, $arg_query, $sql);
				break;
			}
			case 'update-2':
			{
				Trace::step($context, $arg_action.' for query version '.$query_version, self::$TRACE_ENGINE);
				$sql_action = SqlBuilder::compileUpdate($this, $arg_query, $sql);
				break;
			}
			case 'delete-2':
			{
				Trace::step($context, $arg_action.' for query version '.$query_version, self::$TRACE_ENGINE);
				$sql_action = SqlBuilder::compileDelete($this, $arg_query, $sql);
				break;
			}
			
			
			default:
			{
				Trace::step($context, 'action not found ['.$arg_action.'] for query version '.$query_version, self::$TRACE_ENGINE);
			}
		}
		if ( ! is_object($sql_action) )
		{
			return Trace::leaveko($context, 'sql compilation failed', null, self::$TRACE_ENGINE);
		}
		
		
		// TRACE SQL
		if (self::$TRACE_ENGINE)
		{
			Trace::value($context, 'sql', $sql_action->getSqlString( $this->getDbAdapter()->getPlatform() ), self::$TRACE_ENGINE);
		}
		
		
		// EXECUTE SQL
		$statement = $sql->prepareStatementForSqlObject($sql_action);
		$query_results = array();
		try
		{
			$query_results = $statement->execute();
		} catch(\Exception $e)
		{
			$class_name = get_class($e);
			Trace::value($context, 'exception.class', $class_name, self::$TRACE_ENGINE);
			Trace::value($context, 'exception.message', $e->getMessage(), self::$TRACE_ENGINE);
			Trace::value($context, 'exception.code', $e->getCode(), self::$TRACE_ENGINE);
			Trace::value($context, 'exception.file', $e->getFile(), self::$TRACE_ENGINE);
		}
		
		
		// GET RESULTS
		$result_set = new ResultSet();
		$result_set->initialize($query_results);
		
		$count = $result_set->count();
		Trace::value($context, 'count', $count, self::$TRACE_ENGINE);
		
		$results = array();
		if ($arg_action === 'read')
		{
			$results = $result_set->toArray();
			Trace::value($context, 'results', $results, self::$TRACE_ENGINE);
			return Trace::leaveok($context, '', $results, self::$TRACE_ENGINE);
		}
		
		return Trace::leaveok($context, '', $count, self::$TRACE_ENGINE);
	}
}