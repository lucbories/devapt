<?php
/**
 * @file        SqlBuilderDelete.php
 * @brief       Static class to build SQL Delete query
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
// use Devapt\Security\DbConnexions;
use Devapt\Models\Query;
use Devapt\Models\Sql\FilterNode;
use Devapt\Resources\Model;

// ZEND IMPORTS
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Where;


final class SqlBuilderDelete
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
	 * @brief		Compile SQL delete
	 * @param[in]	arg_sql_engine		SQL engine (object)
	 * @param[in]	arg_query			query (object)
	 * @param[in]	arg_zf2_sql			ZF2 SQL (object)
	 * @return		ZF2 Delete object
	 */
	static public function compileDelete($arg_sql_engine, $arg_query, $arg_zf2_sql)
	{
		$context = 'SqlBuilderDelete.compileDelete(engine,query,sql)';
		Trace::enter($context, '', self::$TRACE_BUILDER);
		
		
		// CHECK QUERY TYPE
		$delete_types = array(Query::$TYPE_DELETE, Query::$TYPE_DELETE_ALL);
		$query_type = $arg_query->getType();
		if ( ! in_array($query_type, $delete_types) )
		{
			return Trace::leaveko($context, 'bad query type ['.$query_type.'] for delete operation', false, self::$TRACE_BUILDER);
		}
		
		
		// INIT SQL
		$model			= $arg_sql_engine->getModel();
		
		// $default_db		= DbConnexions::getConnexionDatabase($model->getModelConnexionName());
		$default_table	= $model->getModelCrudTableName();
		$fields_records = $model->getModelFieldsRecords();
		
		$where = new Where();
		
		
		// GET OPTIONAL VALUES
		$query_values = $arg_query->getOperandsAssocValues();
//		Trace::value($context, 'query_values', $query_values, self::$TRACE_BUILDER);
		
		$query_values = is_array($query_values) ? $query_values : array();
		Trace::value($context, 'query_values', $query_values, self::$TRACE_BUILDER);
		
		
		// ZF2 DO NOT SUPPORT MULTI ROWS DELETE
		$query_values_cursor = $arg_query->getOperandsValuesCursor();
		if ( ! is_numeric($query_values_cursor) || $query_values_cursor < 0 )
		{
			return Trace::leaveko($context, 'bad query values cursor', false, self::$TRACE_BUILDER);
		}
		Trace::value($context, 'records cursor', $query_values_cursor, self::$TRACE_BUILDER);
		$query_values_record = count($query_values) > $query_values_cursor ? $query_values[$query_values_cursor] : array();
		Trace::value($context, 'cursor record', $query_values_record, self::$TRACE_BUILDER);
		
		
		// GET PRIMARY KEY FIELD NAME
		$pk_name = $model->getModelPKFieldName();
		if ( ! is_string($pk_name) || $pk_name === '' )
		{
			return Trace::leaveko($context, 'bad pk field name', null, self::$TRACE_BUILDER);
		}
		Trace::value($context, 'pk_name', $pk_name, self::$TRACE_BUILDER);
		
		// GET OPTIONAL PRIMARY KEY FIELD VALUE
		$pk_value = array_key_exists($pk_name, $query_values_record) ? $query_values_record[$pk_name] : $arg_query->getRecordId();
		// if ( is_null($pk_value) )
		// {
			// return Trace::leaveko($context, 'bad pk field value', null, self::$TRACE_BUILDER);
		// }
		if ( is_array($pk_value) )
		{
			$pk_value = $pk_value[$query_values_cursor];
		}
		Trace::value($context, 'pk_value', $pk_value, self::$TRACE_BUILDER);
		
		
		// BUILD WHERE
		Trace::step($context, 'build where', self::$TRACE_BUILDER);
		$has_where = false;
		// SET WHERE PRIMARY KEY FIELD VALUE
		if ( ! $has_where && is_scalar($pk_value) )
		{
			Trace::step($context, 'has pk field value', self::$TRACE_BUILDER);
			$where->equalTo($pk_name, $pk_value);
			$has_where = true;
		}
		// SET WHERE RECORD VALUES
		if ( ! $has_where && count($query_values) > 0 && is_array($query_values_record) && count($query_values_record) > 0 )
		{
			Trace::step($context, 'has record values', self::$TRACE_BUILDER);
			foreach($query_values_record as $field_name => $field_value)
			{
				if ( is_scalar($field_name) && $field_name !== '' && is_scalar($field_value) && $field_value !== '' )
				{
					$where->equalTo($field_name, $field_value);
					$has_where = true;
				}
			}
		}
		// SET WHERE FILTERS
		if ( ! $has_where && $arg_query->hasFiltersTree() )
		{
			Trace::step($context, 'has filters tree', self::$TRACE_BUILDER);
			
			// GET FILTERS TREE
			$tree_root = $arg_query->getFiltersTree();
			
			// SET WHERE
			Trace::step($context, 'has filters tree root ?', self::$TRACE_BUILDER);
			if ( is_object($tree_root) && $tree_root instanceof FilterNode )
			{
				Trace::step($context, 'set where with filters tree root', self::$TRACE_BUILDER);
				$where->addPredicate($tree_root->getPredicate(), $tree_root->getCombination());
				$has_where = true;
			}
		}
		if ( ! $has_where )
		{
			return Trace::leaveko($context, 'delete without where !', null, self::$TRACE_BUILDER);
		}
		
		
		// CREATE ZF2 SQL OBJECT
		$delete = $arg_zf2_sql->delete(/*$default_db.'.'.*/$default_table);
		$delete->where($where);
		
		
		// REMOVE PK VALUE FROM RECORD
		unset($query_values[$pk_name]);
		
		
		return Trace::leaveok($context, 'success', $delete, self::$TRACE_BUILDER);
	}
}