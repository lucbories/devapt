<?php
/**
 * @file        SqlBuilderInsert.php
 * @brief       Static class to build SQL Insert query
 * @details     ...
 * @see			...
 * @ingroup     MODELS
 * @date        2014-08-14
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
use Devapt\Core\Types;
use Devapt\Models\Query;
use Devapt\Resources\Model;

// ZEND IMPORTS
use Zend\Db\Sql\Sql;


final class SqlBuilderInsert
{
	// STATIC ATTRIBUTES
	
	/// @brief TRACE FLAG
	static public $TRACE_BUILDER = false;
	
	
	
	/**
	 * @brief		Constructor (private)
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Compile SQL insert
	 * @param[in]	arg_sql_engine		SQL engine (object)
	 * @param[in]	arg_query			query (object)
	 * @param[in]	arg_zf2_sql			ZF2 SQL (object)
	 * @return		ZF2 Insert object
	 */
	static public function compileInsert($arg_sql_engine, $arg_query, $arg_zf2_sql)
	{
		$context = 'SqlBuilderInsert.compileInsert(engine,query,sql)';
		Trace::enter($context, '', self::$TRACE_BUILDER);
		
		
		// CHECK QUERY TYPE
		$insert_types = array(Query::$TYPE_INSERT, Query::$TYPE_INSERT_IGNORE);
		$query_type = $arg_query->getType();
		if ( ! in_array($query_type, $insert_types) )
		{
			return Trace::leaveko($context, 'bad query type ['.$query_type.'] for insert operation', false, self::$TRACE_BUILDER);
		}
		
		
		// INIT INSERT
		$model			= $arg_sql_engine->getModel();
		$default_table	= $model->getModelCrudTableName();
		
		$query_fields_names = $arg_query->getFieldsNames();
		$query_values = $arg_query->getOperandsAssocValues();
		
		
		// CHECK AND SET RECORD VALUES
		if ( ! is_array($query_values) )
		{
			return Trace::leaveko($context, 'bad query values for insert operation', false, self::$TRACE_BUILDER);
		}
		
		
		// CREATE ZF2 SQL OBJECT
		$insert = $arg_zf2_sql->insert($default_table)->columns($query_fields_names);
		
		
		// ZF2 DO NOT SUPPORT MULTI ROWS INSERT
		$query_values_cursor = $arg_query->getOperandsValuesCursor();
		if ( ! is_numeric($query_values_cursor) || $query_values_cursor < 0 )
		{
			return Trace::leaveko($context, 'bad query values cursor', false, self::$TRACE_BUILDER);
		}
		$insert->values($query_values[$query_values_cursor]);
		
		
		return Trace::leaveok($context, 'success', $insert, self::$TRACE_BUILDER);
	}
}