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
use Devapt\Security\DbConnexions;
use Devapt\Models\Query;
use Devapt\Models\Sql\FilterNode;
use Devapt\Resources\Model;

// ZEND IMPORTS
use Zend\Db\Sql\Sql;
// use Zend\Db\Sql\Select;
// use Zend\Db\Sql\Create;
use Zend\Db\Sql\Update;
// use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Where;
use Zend\Db\Sql\Predicate\Expression as Expr;
use Zend\Db\Sql\Predicate\Operator as Oper;
use Zend\Db\Sql\Predicate\Like;
use Zend\Db\Sql\Predicate\In;
use Zend\Db\Sql\Predicate\Between;
use Zend\Db\Sql\Predicate\IsNull;
use Zend\Db\Sql\Predicate\IsNotNull;
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\ResultSet\ResultSet;


final class SqlBuilderUpdate
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
		
		$columns = array();
		$froms = array($default_table => $default_table);
		$where = new Where();
		$groups = array();
		$orders = array();
		
		// $query_fields = $arg_query->getFields();
		$query_fields_names = $arg_query->getFieldsNames();
		$query_values = $arg_query->getOperandsValues();
		Trace::value($context, 'query_values', $query_values, self::$TRACE_BUILDER);
		if ( ! is_array($query_values) )
		{
			return Trace::leaveko($context, 'bad query_values', null, self::$TRACE_BUILDER);
		}
		
		
		// CREATE ZF2 SQL OBJECT
		$update = $arg_zf2_sql->update(/*$default_db.'.'.*/$default_table);
		
		
		// GET PRIMARY KEY FIELD NAME
		$pk_name = $model->getModelPKFieldName();
		if ( ! is_string($pk_name) || $pk_name === '' )
		{
			return Trace::leaveko($context, 'bad pk field name', null, self::$TRACE_BUILDER);
		}
		
		// GET PRIMARY KEY FIELD VALUE
		$pk_value = array_key_exists($pk_name, $query_values) ? $query_values[$pk_name] : null;
		if ( is_null($pk_value) )
		{
			return Trace::leaveko($context, 'bad pk field value', null, self::$TRACE_BUILDER);
		}
		
		
		// WHERE
		Trace::step($context, 'has filters ?', self::$TRACE_BUILDER);
		$query_filters = $arg_query->getFilters();
		//	 filter option example:
		//		model_filters= "field=brand_name,type=String,modifier=upper,op=equals,var1=\"ADJ\""
		if ( is_array($query_filters) )
		{
			Trace::step($context, 'query has ['.count($query_filters).'] filters', self::$TRACE_BUILDER);
			
			$build_filters_records = array();
			$tree_root = new FilterNode(null, null, new PredicateSet( array() ) );
			$current_node = &$tree_root;
			foreach($query_filters AS $key => $filter_record)
			{
				Trace::step($context, 'loop on filter ?', self::$TRACE_BUILDER);
				
				// CHECK FILTER RECORD
				if ( ! is_array($filter_record) )
				{
					return Trace::leaveko($context, 'filter record isn t an array', null, self::$TRACE_BUILDER);
				}
				
				// BUILD FILTER NODE
				$current_node = SqlFiltersBuilder::buildFilterNode($arg_zf2_sql, $current_node, $fields_records, $filter_record);
				if ( ! is_object($current_node) )
				{
					return Trace::leaveko($context, 'bad filter node', null, self::$TRACE_BUILDER);
				}
			}
			// Trace::value($context, 'tree_root', $tree_root, true/*self::$TRACE_BUILDER*/);
			
			// SET WHERE
			Trace::step($context, 'has filters tree root ?', self::$TRACE_BUILDER);
			if ( is_object($tree_root) && $tree_root instanceof FilterNode )
			{
				Trace::step($context, 'update where with filters tree root', self::$TRACE_BUILDER);
				$where->addPredicate($tree_root->getPredicate(), $tree_root->getCombination());
				// Debug::dump($tree_root->getPredicate());
			}
		}
		
		
		// SET PRIMARY KEY FIELD FILTER
		$where->equalTo($pk_name, $pk_value);
		$update->where($where);
		
		
		// REMOVE PK VALUE FROM RECORD
		unset($query_values[$pk_name]);
		
		// SET RECORD VALUES
		$update->set($query_values, $update::VALUES_SET); // REPLACE EXISTING VALUES
		
		
		
		return Trace::leaveok($context, 'success', $delete, self::$TRACE_BUILDER);
	}
}