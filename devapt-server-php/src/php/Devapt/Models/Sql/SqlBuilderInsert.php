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
	static public $TRACE_BUILDER = true;
	
	
	
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
		$db_adapter		= $arg_sql_engine->getDbAdapter();
		$model_fields	= $model->getModelFieldsRecords();
		
		// CHECK AND SET RECORD VALUES
		$query_values = $arg_query->getOperandsAssocValues();
		if ( ! is_array($query_values) )
		{
			return Trace::leaveko($context, 'bad query values for insert operation', false, self::$TRACE_BUILDER);
		}
		
		// ZF2 DO NOT SUPPORT MULTI ROWS INSERT
		$query_values_cursor_index = $arg_query->getOperandsValuesCursor();
		if ( ! is_numeric($query_values_cursor_index) || $query_values_cursor_index < 0 )
		{
			return Trace::leaveko($context, 'bad query values cursor', false, self::$TRACE_BUILDER);
		}
		$query_cursor_values = $query_values[$query_values_cursor_index];
		Trace::value($context, 'query_cursor_values', $query_cursor_values, self::$TRACE_BUILDER);
		
		
		// GET VALUES FIELDS NAMES
		$query_fields_names = array();
		$query_all_fields = $arg_query->getFieldsNames();
		Trace::value($context, 'query_all_fields', $query_all_fields, self::$TRACE_BUILDER);
		foreach($query_cursor_values as $loop_field_name=>$loop_field_value)
		{
			// TODO CHECK FIELD NAME
			
			// foreach($query_cursor_values as $loop_name)
			// {
			// if ( ! in_array($loop_field_name, $loop_name) )
			// {
				// return Trace::leaveko($context, 'bad field name ['.$loop_field_name.']', false, self::$TRACE_BUILDER);
			// }
			
			// $quoted_identifier = $db_adapter->getPlatform()->quoteIdentifier($loop_field_name);
			// $quoted_value = $db_adapter->getPlatform()->quoteValue($loop_field_value);
			// Trace::value($context, 'quoted_identifier', $quoted_identifier, self::$TRACE_BUILDER);
			// Trace::value($context, 'quoted_value', $quoted_value, self::$TRACE_BUILDER);
			
			
			// TRANSLATE FIELD NAMES => SLQ COLUMNS
			$field_column = $loop_field_name;
			if ( array_key_exists($loop_field_name, $model_fields) )
			{
				$field_record = $model_fields[$loop_field_name];
				if ( is_array($field_record) )
				{
					$field_column = $field_record['sql_column'];
				}
			}
			
			unset($query_cursor_values[$loop_field_name]); 
			$query_cursor_values[$field_column] = $loop_field_value;
			$query_fields_names[] = $field_column;
		}
		Trace::value($context, 'query_fields_names', $query_fields_names, self::$TRACE_BUILDER);
		
		
		// CREATE ZF2 SQL OBJECT
		$insert = $arg_zf2_sql->insert($default_table)->columns($query_fields_names);
		
		$insert->values($query_cursor_values);
		
		
		// TRACE SQL
		$sql = $insert->getSqlString( $db_adapter->getPlatform() );
		// Trace::value($context, 'sql', $sql, true);
		Trace::value($context, 'sql', $sql, self::$TRACE_BUILDER);
		
		
		return Trace::leaveok($context, 'success', $insert, self::$TRACE_BUILDER);
	}
}