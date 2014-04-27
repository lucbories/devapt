<?php
/**
 * @file        SqlQuery.php
 * @brief       SqlQuery class
 * @details     ...
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

namespace Devapt\Models;

// DEBUG
use Devapt\Core\Trace;

// SQL
use Zend\Debug\Debug;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Create;
use Zend\Db\Sql\Update;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Where;
use Zend\Db\Sql\Predicate\Expression as Expr;
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\ResultSet\ResultSet;

use \Devapt\Security\DbConnexions;

class SqlQuery extends Query
{
	// STATIC ATTRIBUTES
	static public $TRACE_SQL_QUERY	= false;
	
	
	// ATTRIBUTES
	
	
	
	/**
	 * @brief		Constructor
	 * @param[in]	arg_model			model (object)
	 * @param[in]	arg_fieds_array		query fields (array of strings)
	 * @param[in]	arg_type			query type (string)
	 * @return		nothing
	 */
	public function __construct($arg_model, $arg_fieds_array, $arg_type)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_model, $arg_fieds_array, $arg_type);
	}
	
	
	/*
		filters=name=firstname,op=equals,modifier=,var1=Joe,type=String|
	*/
	
	
	/**
	 * @brief		Compile select SQL
	 * @param[in]	arg_sql		query SQL (object)
	 * @return		object
	 */
	protected function compileSelect($arg_sql)
	{
		$context = 'SqlQuery.compileSelect';
		Trace::enter($context, '', self::$TRACE_SQL_QUERY);
		
		
		// CHECK INPUT VALUES
		$result = $this->checkAssocValues();
		if ( ! $result )
		{
			Trace::warning($context.': check input_values failed');
			return false;
		}
		
		// CHECK TYPE
		if ($this->type !== self::$TYPE_SELECT && $this->type !== self::$TYPE_SELECT_DISTINCT && $this->type !== self::$TYPE_SELECT_DISTINCT_ONE && $this->type !== self::$TYPE_SELECT_COUNT)
		{
			Trace::warning($context.': bad query type ['.$this->type.'] for read operation');
			return false;
		}
		
		// INIT SELECT
		$default_db		= DbConnexions::getConnexionDatabase($this->model->getModelConnexionName());
		$default_table	= $this->model->getModelCrudTableName();
		$select = $arg_sql->select();
		$fields_records = $this->model->getModelFieldsRecords();
		// $fields_tables = array();
		// $foreign_tables_aliases = array();
		
		$columns = array();
		$froms = array($default_table => $default_table);
		$where = new Where();
		$groups = array();
		$orders = array();
		
		// JOINS
		if ( is_array($this->input_joins) )
		{
			Trace::step($context, 'process joins', self::$TRACE_SQL_QUERY);
			
			foreach($this->input_joins as $join_record)
			{
				// CHECK JOIN RECORD
				if ( is_array($join_record) && count($join_record) >= 6 )
				{
					Trace::step($context, 'process current join record', self::$TRACE_SQL_QUERY);
					
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
					// $join_table_left_alias = $join_db_left.'_'.$join_table_left;
					if ( ! array_key_exists($join_table_left, $froms) )
					{
						// $froms[$join_table_left] = $join_db_left.'.'.$join_table_left;
						return Trace::leaveko($context, 'join left table not found ['.$join_table_left.']', null, self::$TRACE_SQL_QUERY);
					}
					
					// SET JOIN
					$select->join( array( $join_table_alias_right => $join_db_right.'.'.$join_table_right), $join_table_left.'.'.$join_column_left.'='.$join_table_alias_right.'.'.$join_column_right, $join_mode);
				}
				
				else
				{
					Trace::step($context, 'bad join record', self::$TRACE_SQL_QUERY);
				}
			}
		}
		
		// SELECT DISTINCT - SELECT DISTINCT ... FROM ... WHERE ... GROUP BY ... ORDER BY ...
		if ($this->type === self::$TYPE_SELECT_DISTINCT || $this->type === self::$TYPE_SELECT_DISTINCT_ONE)
		{
			Trace::step($context, 'set quantifier to distinct', self::$TRACE_SQL_QUERY);
			$select->quantifier('DISTINCT');
		}
		
		// SELECT DISTINCT ONE - SELECT DISTINCT ... as ... FROM table as ... WHERE ... GROUP BY ... ORDER BY ...
		// Trace::value($context, 'query one field', $this->input_one_field, self::$TRACE_SQL_QUERY);
		$has_distinct_one_field = $this->type === self::$TYPE_SELECT_DISTINCT_ONE && is_string($this->input_one_field);
		if ($has_distinct_one_field)
		{
			Trace::step($context, 'query has one field', self::$TRACE_SQL_QUERY);
			
			// ONE FIELD - SELECT [DISTINCT] one_field as ... FROM table as ... WHERE ... GROUP BY ... ORDER BY ...
			$one_field_record		= $fields_records[$this->input_one_field];
			$field_has_foreign_link	= $one_field_record['has_foreign_link'];
			
			$one_field_sql_db			= $field_has_foreign_link ? $one_field_record['sql_foreign_db'] : $one_field_record['sql_db'];
			$one_field_sql_table		= $field_has_foreign_link ? $one_field_record['sql_foreign_table'] : $one_field_record['sql_table'];
			$one_field_sql_column		= $field_has_foreign_link ? $one_field_record['sql_foreign_column'] : $one_field_record['sql_column'];
			$one_field_sql_alias		= array_key_exists('sql_alias', $one_field_record) ? $one_field_record['sql_alias'] : $one_field_sql_column;
			
			$columns[$one_field_sql_alias] = $one_field_sql_column;
			
			// CHECK FIELD TABLE
			if ( ! array_key_exists($one_field_sql_table, $froms) )
			{
				return Trace::leaveko($context, 'field table ['.$one_field_sql_table.'] is not known from ['.(is_array($froms) ? implode(',', $froms) : 'null').']', null, self::$TRACE_SQL_QUERY);
			}
		}
		
		// SELECT (NOT DISTINCT) - SELECT ... FROM ... WHERE ... GROUP BY ... ORDER BY ...
		else
		{
			Trace::step($context, 'query is not of type one field', self::$TRACE_SQL_QUERY);
			
			// LOOP ON MODEL FIELDS
			foreach($this->input_fields as $field_name)
			{
				// GET FIELD RECORD
				if ( ! array_key_exists($field_name, $fields_records) )
				{
					return Trace::leaveko($context, 'field not found ['.$field_name.']', null, self::$TRACE_SQL_QUERY);
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
					Trace::step($context, 'field has foreign link', self::$TRACE_SQL_QUERY);
					
					// CREAT FOREIGN LINK SUB QUERY
					$sub_select_exp = SqlSubQueryBuilder::compileSubSelect($arg_sql, $field_record);
					if ( is_null($sub_select_exp) )
					{
						return Trace::leaveko($context, 'foreign field sub query creation failed', null, self::$TRACE_SQL_QUERY);
					}
					
					$columns[$field_sql_alias] = $sub_select_exp;
				}
				
				// FIELD HAS NO FOREIGN LINK
				else
				{
					Trace::step($context, 'field has no foreign link', self::$TRACE_SQL_QUERY);
					
					// FILL SELECT COLUMNS WITH AN EXPRESSION
					if ($field_sql_is_expr)
					{
						Trace::step($context, 'field is an expression', self::$TRACE_SQL_QUERY);
						$columns[$field_sql_alias] = new Expr($field_sql_column);
					}
					
					// FILL SELECT COLUMNS WITH A FIELD
					else
					{
						Trace::step($context, 'field is regular', self::$TRACE_SQL_QUERY);
						
						$columns[$field_sql_alias] = $field_sql_column;
						
						// CHECK FIELD TABLE
						if ( ! array_key_exists($field_sql_table, $froms) )
						{
							return Trace::leaveko($context, 'field table ['.$field_sql_table.'] is not known from ['.(is_array($froms) ? implode(',', $froms) : 'null').']', null, self::$TRACE_SQL_QUERY);
						}
					}
				}
			}
			
		}
		
		// TODO SELECT COUNT(*) FROM ... WHERE ... GROUP BY ... ORDER BY ...
		// if ($this->type == self::$TYPE_SELECT_COUNT)
		// {
			// $columns = array($one_field_sql_alias => $one_field_sql_column);
			// $froms = array($one_field_sql_table_alias => $one_field_sql_table);
		// }
		
		// FILL COLUMNS
		if ( ! is_array($columns) || count($columns) < 1 )
		{
			return Trace::leaveko($context, 'columns is empty', null, self::$TRACE_SQL_QUERY);
		}
		$select->columns($columns, false);
		
		// FILL FROM
		if ( ! is_array($froms) || count($froms) < 1 )
		{
			return Trace::leaveko($context, 'froms is empty', null, self::$TRACE_SQL_QUERY);
		}
		$select->from($froms);
		
		// WHERE
		//	 filter option example:
		//		model_filters= "field=brand_name,type=String,modifier=upper,op=equals,var1=\"ADJ\""
		if ( is_array($this->input_filters) )
		{
			Trace::step($context, 'query has filters', self::$TRACE_SQL_QUERY);
			
			$build_filters_records = array();
			$tree_root = new FilterNode(null, null, new PredicateSet( array() ) );
			$current_node = &$tree_root;
			foreach($this->input_filters AS $key => $filter_record)
			{
				// CHECK FILTER RECORD STRING
				if ( is_string($filter_record) )
				{
					$filter_record = explode(',', $filter_record);
				}
				
				// BUILD FILTER NODE
				$current_node = SqlFiltersBuilder::buildFilterNode($arg_sql, $current_node, $fields_records, $filter_record);
				if ( ! is_object($current_node) )
				{
					return Trace::leaveko($context, 'bad filter node', null, self::$TRACE_SQL_QUERY);
				}
			}
			// Trace::value($context, 'tree_root', $tree_root, true/*self::$TRACE_SQL_QUERY*/);
			
			// SET WHERE
			if ( is_object($tree_root) && $tree_root instanceof FilterNode )
			{
				$where->addPredicate($tree_root->getPredicate(), $tree_root->getCombination());
				// Debug::dump($tree_root->getPredicate());
				$select->where($where);
			}
		}
		
		// GROUP BY
		if ( is_array($this->input_groups) )
		{
			Trace::step($context, 'query has groups by', self::$TRACE_SQL_QUERY);
			
			foreach($this->input_groups as $group_record)
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
		if ( is_array($this->input_groups) )
		{
			Trace::step($context, 'query has orders by', self::$TRACE_SQL_QUERY);
			
			foreach($this->input_groups as $group_record)
			{
				if ( is_array($group_record) && count($group_record) === 2 )
				{
					$orders[] = $group_record[0].' '.$group_record[1];
				}
			}
			$select->order(orders);
		}
		
		// SLICE
		if ( is_array($this->input_slice) && count($this->input_slice) === 2 )
		{
			Trace::step($context, 'query has slice', self::$TRACE_SQL_QUERY);
			
			$select->offset( $this->input_slice[0] );
			$select->limit( $this->input_slice[1] );
		}
		
		return Trace::leaveok($context, '', $select, self::$TRACE_SQL_QUERY);
		
		// TEST QUERY TYPE
/*		if ($this->type == self::$TYPE_INSERT)
		{
			$this->compiled_sql = SQLBuilder::getInsertRow($this->input_fields, $this->input_values, $this->input_crud_db, $this->input_crud_table, false, false);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "INSERT", true, self::$TRACE_SQL_QUERY);
		}
		
		if ($this->type == self::$TYPE_INSERT_IGNORE)
		{
			$this->compiled_sql = SQLBuilder::getInsertRow($this->input_fields, $this->input_values, $this->input_crud_db, $this->input_crud_table, true, false);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "INSERT IGNORE", true, self::$TRACE_SQL_QUERY);
		}
		
		if ($this->type == self::$TYPE_REPLACE)
		{
			$this->compiled_sql = SQLBuilder::getInsertRow($this->input_fields, $this->input_values, $this->input_crud_db, $this->input_crud_table, false, true);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "REPLACE", true, self::$TRACE_SQL_QUERY);
		}
		
		if ($this->type == self::$TYPE_SELECT)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$this->compiled_sql = SQLBuilder::getSelectFields($this->input_fields, $this->input_filters, $this->input_orders, $this->input_groups, $slice_offset, $slice_length, $this->input_joins);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "SELECT", true, self::$TRACE_SQL_QUERY);
		}
		
		if ($this->type == self::$TYPE_SELECT_DISTINCT)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$has_foreign_keys = false;
			$this->compiled_sql = SQLBuilder::getSelectDistinctField($this->input_fields, $this->input_filters, $this->input_orders, $this->input_groups, $slice_offset, $slice_length, $has_foreign_keys, $this->input_joins);
			
			Trace::value($context, "TYPE_SELECT_DISTINCT - query->compiled_sql", $this->compiled_sql, self::$TRACE_SQL_QUERY);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "SELECT DISTINCT", true, self::$TRACE_SQL_QUERY);
		}
		
		if ($this->type == self::$TYPE_SELECT_DISTINCT_ONE)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$has_foreign_keys	= false;
			$distinct_field		= $this->input_one_field;
			$this->compiled_sql	= SQLBuilder::getSelectDistinctOneField($distinct_field, $this->input_fields, $this->input_filters, $this->input_orders, $this->input_groups, $slice_offset, $slice_length, $has_foreign_keys, $this->input_joins);
			
			Trace::value($context, "TYPE_SELECT_DISTINCT_ONE - query->compiled_sql", $this->compiled_sql, self::$TRACE_SQL_QUERY);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "SELECT DISTINCT ONE", true, self::$TRACE_SQL_QUERY);
		}
		
		if ($this->type == self::$TYPE_SELECT_COUNT)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$this->compiled_sql = SQLBuilder::getSelectCountField($this->input_fields, $this->input_filters, $slice_offset, $slice_length, $this->input_joins);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "SELECT COUNT", true, self::$TRACE_SQL_QUERY);
		}
		
		if ($this->type == self::$TYPE_UPDATE)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$this->compiled_sql = SQLBuilder::getUpdateRows($this->input_fields, $this->input_filters, $this->input_values, $this->input_crud_db, $this->input_crud_table);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "UPDATE", true, self::$TRACE_SQL_QUERY);
		}
		
		if ($this->type == self::$TYPE_DELETE)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$this->compiled_sql = SQLBuilder::getDeleteRows($this->input_fields, $this->input_filters, $this->input_crud_db, $this->input_crud_table);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "DELETE", true, self::$TRACE_SQL_QUERY);
		}
		
		if ($this->type == self::$TYPE_DELETE_ALL)
		{
			$this->compiled_sql = SQLDeleteHelpers::getDeleteAllString($this->input_crud_db, $this->input_crud_table);
			
			$result = ! is_null($this->compiled_sql);
			return Trace::leave($context, $result, "DELETE ALL", true, self::$TRACE_SQL_QUERY);
		}
		
		return Trace::leaveko($context, "failure: unknow type[".$this->type."]", false, self::$TRACE_SQL_QUERY);
		*/
	}
	
	
	/**
	 * @brief		Read datas
	 * @param[in]	arg_db_adapter			db adapter (object)
	 * @return		array
	 */
	public function read($arg_db_adapter)
	{
		// CHECK ARGS
		if ( ! is_object($arg_db_adapter) )
		{
			Trace::warning('SqlQuery.read: bad db adapter');
			return null;
		}
		
		// COMPILE SQL
		$sql = new Sql($arg_db_adapter);
		$select = $this->compileSelect($sql);
		if ( ! is_object($select) )
		{
			Trace::warning('SqlQuery.read: sql compilation failed');
			return null;
		}
		
		// EXECUTE SQL
		if (self::$TRACE_SQL_QUERY)
		{
			Trace::value('SqlQuery.read', 'sql', $select->getSqlString(), self::$TRACE_SQL_QUERY);
		}
		$statement = $sql->prepareStatementForSqlObject($select);
		$query_results = $statement->execute();
		
		// GET RESULTS
		$result_set = new ResultSet;
		$result_set->initialize($query_results);
		$results = $result_set->toArray();
		Trace::value('SqlQuery.read', 'results', $results, self::$TRACE_SQL_QUERY);
		
		return $results;
	}
}
