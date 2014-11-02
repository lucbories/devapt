<?php
/**
 * @file        SqlBuilderUpdate.php
 * @brief       Static class to build SQL Update query
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
use Zend\Db\Sql\Update;
use Zend\Db\Sql\Where;


final class SqlBuilderUpdate
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
	 * @brief		Compile SQL update
	 * @param[in]	arg_sql_engine		SQL engine (object)
	 * @param[in]	arg_query			query (object)
	 * @param[in]	arg_zf2_sql			ZF2 SQL (object)
	 * @return		ZF2 Update object
	 */
	static public function compileUpdate($arg_sql_engine, $arg_query, $arg_zf2_sql)
	{
		$context = 'SqlBuilderUpdate.compileUpdate(engine,query,sql)';
		Trace::enter($context, '', self::$TRACE_BUILDER);
		
		
		// CHECK QUERY TYPE
		$update_types = array(Query::$TYPE_REPLACE, Query::$TYPE_UPDATE);
		$query_type = $arg_query->getType();
		if ( ! in_array($query_type, $update_types) )
		{
			return Trace::leaveko($context, 'bad query type ['.$query_type.'] for update operation', false, self::$TRACE_BUILDER);
		}
		
		
		// INIT SQL
		$model			= $arg_sql_engine->getModel();
		
		// $default_db		= DbConnexions::getConnexionDatabase($model->getModelConnexionName());
		$default_table	= $model->getModelCrudTableName();
		$fields_records = $model->getModelFieldsRecords();
		
		$froms = array($default_table => $default_table);
		$where = new Where();
		
		
		// GET FIELDS NAMES AND VALUES
		$query_fields_names = $arg_query->getFieldsNames();
		$query_values = $arg_query->getOperandsAssocValues();
		Trace::value($context, 'query_fields_names', $query_fields_names, self::$TRACE_BUILDER);
		Trace::value($context, 'query_values', $query_values, self::$TRACE_BUILDER);
		if ( ! is_array($query_values) )
		{
			return Trace::leaveko($context, 'bad query_values', null, self::$TRACE_BUILDER);
		}
		
		
		// ZF2 DO NOT SUPPORT MULTI ROWS UPDATE
		$query_values_cursor = $arg_query->getOperandsValuesCursor();
		if ( ! is_numeric($query_values_cursor) || $query_values_cursor < 0 )
		{
			return Trace::leaveko($context, 'bad query values cursor', false, self::$TRACE_BUILDER);
		}
		Trace::value($context, 'records cursor', $query_values_cursor, self::$TRACE_BUILDER);
		$query_values_record = $query_values[$query_values_cursor];
		Trace::value($context, 'cursor record', $query_values_record, self::$TRACE_BUILDER);
		
		
		// GET PRIMARY KEY FIELD NAME
		$pk_name = $model->getModelPKFieldName();
		if ( ! is_string($pk_name) || $pk_name === '' )
		{
			return Trace::leaveko($context, 'bad pk field name', null, self::$TRACE_BUILDER);
		}
		Trace::value($context, 'pk_name', $pk_name, self::$TRACE_BUILDER);
		
		// GET PRIMARY KEY FIELD VALUE
		$pk_value = array_key_exists($pk_name, $query_values_record) ? $query_values_record[$pk_name] : $arg_query->getRecordId();
		if ( is_null($pk_value) )
		{
			return Trace::leaveko($context, 'bad pk field value', null, self::$TRACE_BUILDER);
		}
		if ( is_array($pk_value) )
		{
			$pk_value = $pk_value[$query_values_cursor];
		}
		Trace::value($context, 'pk_value', $pk_value, self::$TRACE_BUILDER);
		
		
		// WHERE
		Trace::step($context, 'has filters ?', self::$TRACE_BUILDER);
		if ( $arg_query->hasFiltersTree() )
		{
			// GET FILTERS TREE
			$tree_root = $arg_query->getFiltersTree();
			
			// SET WHERE
			Trace::step($context, 'has filters tree root ?', self::$TRACE_BUILDER);
			if ( is_object($tree_root) && $tree_root instanceof FilterNode )
			{
				Trace::step($context, 'update where with filters tree root', self::$TRACE_BUILDER);
				$where->addPredicate($tree_root->getPredicate(), $tree_root->getCombination());
			}
		}
		
		
		// CREATE ZF2 SQL OBJECT
		$update = $arg_zf2_sql->update(/*$default_db.'.'.*/$default_table);
		
		
		// SET PRIMARY KEY FIELD FILTER
		$where->equalTo($pk_name, $pk_value);
		$update->where($where);
		
		
		// REMOVE PK VALUE FROM RECORD
		unset($query_values_record[$pk_name]);
		
		// SET RECORD VALUES
		$update->set($query_values_record, $update::VALUES_SET); // REPLACE EXISTING VALUES
		
		
		
		return Trace::leaveok($context, 'success', $update, self::$TRACE_BUILDER);
	}
}