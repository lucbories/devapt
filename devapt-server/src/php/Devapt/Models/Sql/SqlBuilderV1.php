<?php
/**
 * @file        SqlBuilderV1.php
 * @brief       Static class to build SQL sub-query
 * @details     ...
 * @see			...
 * @ingroup     MODELS
 * @date        2014-03-02
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
use Zend\Db\Sql\Select;
// use Zend\Db\Sql\Create;
// use Zend\Db\Sql\Update;
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


final class SqlBuilderV1
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
	 * @brief		Compile SQL select
	 * @param[in]	arg_sql_engine		SQL engine (object)
	 * @param[in]	arg_query			query (object)
	 * @param[in]	arg_zf2_sql			ZF2 SQL (object)
	 * @return		Expression
	 */
	static public function compileSelect($arg_sql_engine, $arg_query, $arg_zf2_sql)
	{
		$context = 'SqlBuilderV1.compileSelect(engine,query,sql)';
		Trace::enter($context, '', self::$TRACE_BUILDER);
		
		
		// CHECK QUERY TYPE
		$select_types = array(Query::$TYPE_SELECT, Query::$TYPE_SELECT_DISTINCT, Query::$TYPE_SELECT_DISTINCT_ONE, Query::$TYPE_SELECT_COUNT);
		$query_type = $arg_query->getType();
		if ( ! in_array($query_type, $select_types) )
		{
			return Trace::leaveko($context, 'bad query type ['.$query_type.'] for read operation', false, self::$TRACE_BUILDER);
		}
		
		
		// CREATE ZF2 SQL OBJECT
		$select = $arg_zf2_sql->select();
		
		
		// INIT SELECT
		$model			= $arg_sql_engine->getModel();
		$default_db		= DbConnexions::getConnexionDatabase($model->getModelConnexionName());
		$default_table	= $model->getModelCrudTableName();
		$fields_records = $model->getModelFieldsRecords();
		
		$columns = array();
		$froms = array($default_table => $default_table);
		$where = new Where();
		$groups = array();
		$orders = array();
		
		// $query_fields = $arg_query->getFields();
		$query_fields_names = $arg_query->getFieldsNames();
		
		
		// JOINS
		Trace::step($context, 'has join records ?', self::$TRACE_BUILDER);
		$query_joins = $arg_query->getJoins();
		if ( is_array($query_joins) )
		{
			Trace::step($context, 'process ['.count($query_joins).'] joins', self::$TRACE_BUILDER);
			
			foreach($query_joins as $join_record)
			{
				Trace::step($context, 'loop on join record', self::$TRACE_BUILDER);
				
				// CHECK JOIN RECORD
				if ( is_array($join_record) && count($join_record) >= 6 )
				{
					Trace::step($context, 'process current join record', self::$TRACE_BUILDER);
					
					// GET JOIN ATTRIBUTES
					$join_db_left			= array_key_exists('db', $join_record) ? $join_record['db'] : $default_db;
					$join_table_left		= array_key_exists('table', $join_record) ? $join_record['table'] : $default_table;
					$join_column_left		= $join_record['column'];
					
					$join_db_right			= array_key_exists('join_db', $join_record) ? $join_record['join_db'] : $default_db;
					$join_table_right		= $join_record['join_table'];
					$join_table_alias_right	= array_key_exists('join_table_alias', $join_record) ? $join_record['join_table_alias'] : $join_table_right;
					$join_column_right		= $join_record['join_column'];
					$join_mode_str			= array_key_exists('join_mode', $join_record) ? $join_record['join_mode'] : 'INNER';
					$join_mode				= Select::JOIN_INNER;
					switch( strtoupper($join_mode_str) )
					{
						case 'INNER':	$join_mode = Select::JOIN_INNER; break;
						case 'OUTER':	$join_mode = Select::JOIN_OUTER; break;
						case 'LEFT':	$join_mode = Select::JOIN_LEFT; break;
						case 'RIGHT':	$join_mode = Select::JOIN_RIGHT; break;
					}
					
					// FILL LEFT TABLE
					if ( ! array_key_exists($join_table_left, $froms) )
					{
						// $froms[$join_table_left] = $join_db_left.'.'.$join_table_left;
						return Trace::leaveko($context, 'join left table not found ['.$join_table_left.']', null, self::$TRACE_BUILDER);
					}
					
					// SET JOIN
					$select->join( array( $join_table_alias_right => $join_db_right.'.'.$join_table_right), $join_table_left.'.'.$join_column_left.'='.$join_table_alias_right.'.'.$join_column_right, $join_mode);
				}
				
				else
				{
					Trace::step($context, 'bad join record', self::$TRACE_BUILDER);
				}
			}
		}
		
		
		// SELECT DISTINCT - SELECT DISTINCT ... FROM ... WHERE ... GROUP BY ... ORDER BY ...
		Trace::step($context, 'is distinct ?', self::$TRACE_BUILDER);
		if ($query_type === Query::$TYPE_SELECT_DISTINCT || $query_type === Query::$TYPE_SELECT_DISTINCT_ONE)
		{
			Trace::step($context, 'set quantifier to distinct', self::$TRACE_BUILDER);
			$select->quantifier('DISTINCT');
		}
		
		
		// SELECT DISTINCT ONE - SELECT DISTINCT ... as ... FROM table as ... WHERE ... GROUP BY ... ORDER BY ...
		Trace::step($context, 'has distinct one field ?', self::$TRACE_BUILDER);
		$query_one_field = $arg_query->getOneField();
		// Trace::value($context, 'query one field', $input_one_field, self::$TRACE_BUILDER);
		$has_distinct_one_field = $query_type === Query::$TYPE_SELECT_DISTINCT_ONE && is_string($query_one_field);
		if ($has_distinct_one_field)
		{
			Trace::step($context, 'query has one field', self::$TRACE_BUILDER);
			
			// ONE FIELD - SELECT [DISTINCT] one_field as ... FROM table as ... WHERE ... GROUP BY ... ORDER BY ...
			$one_field_record		= $fields_records[$query_one_field];
			$field_has_foreign_link	= $one_field_record['has_foreign_link'];
			
			$one_field_sql_db			= $field_has_foreign_link ? $one_field_record['sql_foreign_db'] : $one_field_record['sql_db'];
			$one_field_sql_table		= $field_has_foreign_link ? $one_field_record['sql_foreign_table'] : $one_field_record['sql_table'];
			$one_field_sql_column		= $field_has_foreign_link ? $one_field_record['sql_foreign_column'] : $one_field_record['sql_column'];
			$one_field_sql_alias		= array_key_exists('sql_alias', $one_field_record) ? $one_field_record['sql_alias'] : $one_field_sql_column;
			
			$columns[$one_field_sql_alias] = $one_field_sql_column;
			
			// CHECK FIELD TABLE
			if ( ! array_key_exists($one_field_sql_table, $froms) )
			{
				return Trace::leaveko($context, 'field table ['.$one_field_sql_table.'] is not known from ['.(is_array($froms) ? implode(',', $froms) : 'null').']', null, self::$TRACE_BUILDER);
			}
		}
		
		// SELECT (NOT DISTINCT) - SELECT ... FROM ... WHERE ... GROUP BY ... ORDER BY ...
		else
		{
			Trace::step($context, 'query is not of type one field', self::$TRACE_BUILDER);
			
			// LOOP ON MODEL FIELDS
			foreach($query_fields_names as $field_name)
			{
				// GET FIELD RECORD
				if ( ! array_key_exists($field_name, $fields_records) )
				{
					return Trace::leaveko($context, 'field not found ['.$field_name.']', null, self::$TRACE_BUILDER);
				}
				$field_record = $fields_records[$field_name];
				
				// GET FIELD ATTRIBUTES
				$field_has_foreign_link	= $field_record['has_foreign_link'];
				$field_sql_db			= $field_record['sql_db'];
				$field_sql_table		= $field_record['sql_table'];
				$field_sql_column		= $field_record['sql_column'];
				$field_sql_alias		= array_key_exists('sql_alias', $field_record) ? $field_record['sql_alias'] : $field_sql_column;
				$field_sql_is_expr		= $field_record['sql_is_expression'];
				$field_sql_is_pk		= $field_record['sql_is_primary_key'];
				
				// FIELD HAS FOREIGN LINK
				if ($field_has_foreign_link)
				{
					Trace::step($context, 'field has foreign link', self::$TRACE_BUILDER);
					
					// CREAT FOREIGN LINK SUB QUERY
					$sub_select_exp = SqlSubQueryBuilder::compileSubSelect($arg_zf2_sql, $field_record);
					if ( is_null($sub_select_exp) )
					{
						return Trace::leaveko($context, 'foreign field sub query creation failed', null, self::$TRACE_BUILDER);
					}
					
					$columns[$field_sql_alias] = $sub_select_exp;
				}
				
				// FIELD HAS NO FOREIGN LINK
				else
				{
					Trace::step($context, 'field has no foreign link', self::$TRACE_BUILDER);
					
					// FILL SELECT COLUMNS WITH AN EXPRESSION
					if ($field_sql_is_expr)
					{
						Trace::step($context, 'field is an expression', self::$TRACE_BUILDER);
						$columns[$field_sql_alias] = new Expr($field_sql_column);
					}
					
					// FILL SELECT COLUMNS WITH A FIELD
					else
					{
						Trace::step($context, 'field is regular', self::$TRACE_BUILDER);
						
						$columns[$field_sql_alias] = $field_sql_column;
						
						// CHECK FIELD TABLE
						if ( ! array_key_exists($field_sql_table, $froms) )
						{
							return Trace::leaveko($context, 'field table ['.$field_sql_table.'] is not known from ['.(is_array($froms) ? implode(',', $froms) : 'null').']', null, self::$TRACE_BUILDER);
						}
					}
				}
			}
			
		}
		
		
		// TODO SELECT COUNT(*) FROM ... WHERE ... GROUP BY ... ORDER BY ...
		// if ($query_type == Query::$TYPE_SELECT_COUNT)
		// {
			// $columns = array($one_field_sql_alias => $one_field_sql_column);
			// $froms = array($one_field_sql_table_alias => $one_field_sql_table);
		// }
		
		
		// FILL COLUMNS
		if ( ! is_array($columns) || count($columns) < 1 )
		{
			return Trace::leaveko($context, 'columns is empty', null, self::$TRACE_BUILDER);
		}
		$select->columns($columns, false);
		
		
		// FILL FROM
		if ( ! is_array($froms) || count($froms) < 1 )
		{
			return Trace::leaveko($context, 'froms is empty', null, self::$TRACE_BUILDER);
		}
		$select->from($froms);
		
		
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
				
				// CHECK FILTER RECORD STRING
				if ( is_string($filter_record) )
				{
					Trace::step($context, 'explode filter', self::$TRACE_BUILDER);
					$filter_record = explode(',', $filter_record);
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
				$select->where($where);
			}
		}
		
		
		// GROUP BY
		Trace::step($context, 'has groups ?', self::$TRACE_BUILDER);
		$query_groups = $arg_query->getGroups();
		if ( is_array($query_groups) )
		{
			Trace::step($context, 'query has groups by', self::$TRACE_BUILDER);
			
			foreach($query_groups as $group_record)
			{
				if ( is_array($group_record) && count($group_record) === 1 )
				{
					$group_record = $group_record[0];
				}
				if ( is_string($group_record) )
				{
					$groups[] = $group_record;
				}
			}
			$select->group(groups);
		}
		
		
		// ORDER BY
		Trace::step($context, 'has orders ?', self::$TRACE_BUILDER);
		$query_orders = $arg_query->getOrders();
		if ( is_array($query_orders) )
		{
			Trace::step($context, 'query has orders by', self::$TRACE_BUILDER);
			
			foreach($query_orders as $group_record)
			{
				if ( is_array($group_record) && count($group_record) === 2 )
				{
					$orders[] = $group_record[0].' '.$group_record[1];
				}
			}
			$select->order(orders);
		}
		
		
		// SLICE
		Trace::step($context, 'has slice ?', self::$TRACE_BUILDER);
		$query_slice_offset = $arg_query->getSliceOffset();
		$query_slice_length = $arg_query->getSliceLength();
		if ( is_numeric($query_slice_offset) && is_numeric($query_slice_length) )
		{
			Trace::step($context, 'query has slice', self::$TRACE_BUILDER);
			
			$select->offset($query_slice_offset);
			$select->limit($query_slice_length);
		}
		
		
		return Trace::leaveok($context, 'success', $select, self::$TRACE_BUILDER);
	}
	
	
	
	/**
	 * @brief		Compile SQL insert
	 * @param[in]	arg_sql_engine		SQL engine (object)
	 * @param[in]	arg_query			query (object)
	 * @param[in]	arg_zf2_sql			ZF2 SQL (object)
	 * @return		Expression
	 */
	static public function compileInsert($arg_sql_engine, $arg_query, $arg_zf2_sql)
	{
		$context = 'SqlBuilderV1.compileInsert(engine,query,sql)';
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
		$default_db		= DbConnexions::getConnexionDatabase($model->getModelConnexionName());
		$default_table	= $model->getModelCrudTableName();
		$fields_records = $model->getModelFieldsRecords();
		
		$columns = array();
		$froms = array($default_table => $default_table);
		$where = new Where();
		$groups = array();
		$orders = array();
		
		$query_fields_names = $arg_query->getFieldsNames();
		$query_values = $arg_query->getOperandsAssocValues();
		
		
		// CREATE ZF2 SQL OBJECT
		$insert = $arg_zf2_sql->insert(/*$default_db.'.'.*/$default_table)->columns($query_fields_names);
		
		
		// CHECK AND SET RECORD VALUES
		if ( ! is_array($query_values) && ! Types::isAssoc($query_values) )
		{
			return Trace::leaveko($context, 'bad query values for insert operation', false, self::$TRACE_BUILDER);
		}
		$insert->values($query_values, $insert::VALUES_SET); // REPLACE EXISTING VALUES
		
		
		return Trace::leaveok($context, 'success', $insert, self::$TRACE_BUILDER);
	}
	
	
	
	
	
	/**
	 * @brief		Compile SQL update
	 * @param[in]	arg_sql_engine		SQL engine (object)
	 * @param[in]	arg_query			query (object)
	 * @param[in]	arg_zf2_sql			ZF2 SQL (object)
	 * @return		Expression
	 */
	static public function compileUpdate($arg_sql_engine, $arg_query, $arg_zf2_sql)
	{
		$context = 'SqlBuilderV1.compileUpdate(engine,query,sql)';
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
		$default_db		= DbConnexions::getConnexionDatabase($model->getModelConnexionName());
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
		
		// SET PRIMARY KEY FIELD FILTER
		$where->equalTo($pk_name, $pk_value);
		$update->where($where);
		
		
		// REMOVE PK VALUE FROM RECORD
		unset($query_values[$pk_name]);
		
		// SET RECORD VALUES
		$update->set($query_values, $update::VALUES_SET); // REPLACE EXISTING VALUES
		
		
		// TODO WHERE
/*		Trace::step($context, 'has filters ?', self::$TRACE_BUILDER);
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
				
				// CHECK FILTER RECORD STRING
				if ( is_string($filter_record) )
				{
					Trace::step($context, 'explode filter', self::$TRACE_BUILDER);
					$filter_record = explode(',', $filter_record);
				}
				
				// BUILD FILTER NODE
				$current_node = SqlFiltersBuilder::buildFilterNode($arg_zf2_sql, $current_node, $fields_records, $filter_record);
				if ( ! is_object($current_node) )
				{
					return Trace::leaveko($context, 'bad filter node', null, self::$TRACE_BUILDER);
				}
			}
			
			
			
			// SET WHERE
			Trace::step($context, 'has filters tree root ?', self::$TRACE_BUILDER);
			if ( is_object($tree_root) && $tree_root instanceof FilterNode )
			{
				Trace::step($context, 'update where with filters tree root', self::$TRACE_BUILDER);
				$where->addPredicate($tree_root->getPredicate(), $tree_root->getCombination());
				// Debug::dump($tree_root->getPredicate());
				$update->where($where);
			}
		}*/
		
		
		
		return Trace::leaveok($context, 'success', $update, self::$TRACE_BUILDER);
	}
}


		// TEST QUERY TYPE
/*		if ($query_type == self::$TYPE_REPLACE)
		{
			$this->compiled_sql = SQLBuilder::getInsertRow($this->input_fields, $this->input_values, $this->input_crud_db, $this->input_crud_table, false, true);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "REPLACE", true, self::$TRACE_ENGINE);
		}
		
		if ($query_type == Query::$TYPE_SELECT)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$this->compiled_sql = SQLBuilder::getSelectFields($this->input_fields, $query_filters, $this->input_orders, $query_groups, $slice_offset, $slice_length, $query_joins);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "SELECT", true, self::$TRACE_ENGINE);
		}
		
		if ($query_type == Query::$TYPE_SELECT_DISTINCT)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$has_foreign_keys = false;
			$this->compiled_sql = SQLBuilder::getSelectDistinctField($this->input_fields, $query_filters, $this->input_orders, $query_groups, $slice_offset, $slice_length, $has_foreign_keys, $query_joins);
			
			Trace::value($context, "TYPE_SELECT_DISTINCT - query->compiled_sql", $this->compiled_sql, self::$TRACE_ENGINE);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "SELECT DISTINCT", true, self::$TRACE_ENGINE);
		}
		
		if ($query_type == Query::$TYPE_SELECT_DISTINCT_ONE)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$has_foreign_keys	= false;
			$distinct_field		= $query_one_field;
			$this->compiled_sql	= SQLBuilder::getSelectDistinctOneField($distinct_field, $this->input_fields, $query_filters, $this->input_orders, $query_groups, $slice_offset, $slice_length, $has_foreign_keys, $query_joins);
			
			Trace::value($context, "TYPE_SELECT_DISTINCT_ONE - query->compiled_sql", $this->compiled_sql, self::$TRACE_ENGINE);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "SELECT DISTINCT ONE", true, self::$TRACE_ENGINE);
		}
		
		if ($query_type == Query::$TYPE_SELECT_COUNT)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$this->compiled_sql = SQLBuilder::getSelectCountField($this->input_fields, $query_filters, $slice_offset, $slice_length, $query_joins);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "SELECT COUNT", true, self::$TRACE_ENGINE);
		}
		
		if ($query_type == self::$TYPE_UPDATE)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$this->compiled_sql = SQLBuilder::getUpdateRows($this->input_fields, $query_filters, $this->input_values, $this->input_crud_db, $this->input_crud_table);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "UPDATE", true, self::$TRACE_ENGINE);
		}
		
		if ($query_type == self::$TYPE_DELETE)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$this->compiled_sql = SQLBuilder::getDeleteRows($this->input_fields, $query_filters, $this->input_crud_db, $this->input_crud_table);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "DELETE", true, self::$TRACE_ENGINE);
		}
		
		if ($query_type == self::$TYPE_DELETE_ALL)
		{
			$this->compiled_sql = SQLDeleteHelpers::getDeleteAllString($this->input_crud_db, $this->input_crud_table);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "DELETE ALL", true, self::$TRACE_ENGINE);
		}
		
		return Trace::leaveko($context, "failure: unknow type[".$query_type."]", false, self::$TRACE_ENGINE);
		*/
