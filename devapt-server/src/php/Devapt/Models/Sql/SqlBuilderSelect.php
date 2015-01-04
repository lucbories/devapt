<?php
/**
 * @file        SqlBuilderSelect.php
 * @brief       Static class to build select SQL query
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
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Where;
use Zend\Db\Sql\Predicate\Expression;
use Zend\Db\Sql\Predicate\Operator as Oper;
use Zend\Db\Sql\Predicate\Like;
use Zend\Db\Sql\Predicate\In;
use Zend\Db\Sql\Predicate\Between;
use Zend\Db\Sql\Predicate\IsNull;
use Zend\Db\Sql\Predicate\IsNotNull;
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\ResultSet\ResultSet;


final class SqlBuilderSelect
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
	 * @brief		Compile SQL select
	 * @param[in]	arg_sql_engine		SQL engine (object)
	 * @param[in]	arg_query			query (object)
	 * @param[in]	arg_zf2_sql			ZF2 SQL (object)
	 * @return		Expression
	 */
	static public function compileSelect($arg_sql_engine, $arg_query, $arg_zf2_sql)
	{
		$context = 'SqlBuilderSelect.compileSelect(engine,query,sql)';
		Trace::enter($context, '', self::$TRACE_BUILDER);
		
		
		// CHECK QUERY TYPE
		$select_types = array(Query::$TYPE_SELECT, Query::$TYPE_SELECT_DISTINCT, Query::$TYPE_SELECT_DISTINCT_ONE, Query::$TYPE_SELECT_COUNT);
		$query_type = $arg_query->getType();
		$query_crud_type = $arg_query->getCrudOperation();
		Trace::value($context, 'query_crud_type', $query_crud_type, self::$TRACE_BUILDER);
		Trace::value($context, 'query_type', $query_type, self::$TRACE_BUILDER);
		if ($query_crud_type !== 'read')
		{
			// Trace::value($context, 'arg_query', $arg_query, self::$TRACE_BUILDER);
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
		$joins_tables = array();
		$joins_columns = array();
		$joins = array();
		$joins_by_table = array();
		
		$query_fields_names = $arg_query->getFieldsNames();
		$query_joins = $model->getModelJoinsRecords();
		
		
		// FILL JOINS TABLES
		if ( is_array($query_joins) )
		{
			Trace::step($context, 'fill joins tables ', self::$TRACE_BUILDER);
			Trace::step($context, 'process ['.count($query_joins).'] joins', self::$TRACE_BUILDER);
			
			foreach($query_joins as $join_record)
			{
				Trace::step($context, 'loop on join record', self::$TRACE_BUILDER);
				Trace::value($context, 'join record', $join_record, self::$TRACE_BUILDER);
				
				// CHECK JOIN RECORD
				if ( is_array($join_record) && (count($join_record) === 3 || count($join_record) === 4) && array_key_exists('mode', $join_record)&& array_key_exists('source', $join_record) && array_key_exists('target', $join_record) )
				{
					Trace::step($context, 'process current join record', self::$TRACE_BUILDER);
					
					// GET JOIN ATTRIBUTES
					$join_mode_str			= $join_record['mode'];
					
					$has_source = is_array($join_record['source']) && count($join_record['source']) >= 1 && array_key_exists('column', $join_record['source']);
					if (! $has_source)
					{
						return Trace::leaveko($context, 'bad join source record', null, self::$TRACE_BUILDER);
					}
					$join_db_left			= array_key_exists('db', $join_record['source']) ? $join_record['source']['db'] : $default_db;
					$join_table_left		= array_key_exists('table', $join_record['source']) ? $join_record['source']['table'] : $default_table;
					$join_column_left		= $join_record['source']['column'];
					
					$has_target = is_array($join_record['target']) && count($join_record['target']) >= 2 && array_key_exists('table', $join_record['target']) && array_key_exists('column', $join_record['target']);
					if (! $has_target)
					{
						return Trace::leaveko($context, 'bad join target record', null, self::$TRACE_BUILDER);
					}
					$join_db_right			= array_key_exists('db', $join_record['target']) ? $join_record['target']['db'] : $default_db;
					$join_table_right		= $join_record['target']['table'];
					$join_table_alias_right	= array_key_exists('table_alias', $join_record['target']) ? $join_record['target']['table_alias'] : 'join_'.$join_table_right;
					$join_column_right		= $join_record['target']['column'];
					
					$joins_tables[$join_table_alias_right] = $join_table_alias_right;
					
					// FILL LEFT TABLE
					$table_exists = array_key_exists($join_table_left, $froms) || array_key_exists($join_table_left, $joins_tables);
					if ( ! $table_exists )
					{
						return Trace::leaveko($context, 'join left table not found ['.$join_table_left.']', null, self::$TRACE_BUILDER);
					}
					
					// SET JOIN RECORD
					$join_mode = $join_mode_str; // TODO CHECK JOIN MODE
					$join_record = array(
						'right_table' => $join_table_alias_right,
						'right' => array( $join_table_alias_right => $join_table_right),
						'on' => $join_table_left.'.'.$join_column_left.'='.$join_table_alias_right.'.'.$join_column_right,
						'mode' => $join_mode
						);
					$joins[] = $join_record;
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
		$query_one_field = $arg_query->getOneFieldName();
		Trace::value($context, 'query_one_field', $query_one_field, self::$TRACE_BUILDER);
		Trace::value($context, 'query_type', $query_type, self::$TRACE_BUILDER);
		$has_distinct_one_field = ($query_type === Query::$TYPE_SELECT_DISTINCT_ONE || $query_type === Query::$TYPE_SELECT_COUNT) && $arg_query->hasOneField();
		if ($has_distinct_one_field)
		{
			Trace::step($context, 'query has one field', self::$TRACE_BUILDER);
			
			// ONE FIELD - SELECT [DISTINCT] one_field as ... FROM table as ... WHERE ... GROUP BY ... ORDER BY ...
			$one_field_record		= $fields_records[$query_one_field];
			$field_has_foreign_link	= $one_field_record['has_foreign_link'];
			
			$one_field_sql_db			= $field_has_foreign_link ? $one_field_record['sql_foreign_db'] : $one_field_record['sql_db'];
			$one_field_sql_table		= $field_has_foreign_link ? $one_field_record['sql_foreign_table'] : $one_field_record['sql_table'];
			$one_field_sql_column		= $field_has_foreign_link ? $one_field_record['sql_foreign_column'] : $one_field_record['sql_column'];
			$one_field_sql_alias		= array_key_exists('sql_alias', $one_field_record) ? $one_field_record['sql_alias'] : $one_field_sql_table.'_'.$one_field_sql_column;
			
			// FILL SELECT COLUMNS WITH A JOIN
			if ( array_key_exists($one_field_sql_table, $joins_tables) )
			{
				if ( ! array_key_exists($one_field_sql_table, $joins_columns) || ! is_array($joins_columns[$one_field_sql_table]) )
				{
					$joins_columns[$one_field_sql_table] = array();
				}
				$joins_columns[$one_field_sql_table][$one_field_sql_alias] = $one_field_sql_column;
			}
			// FILL SELECT COLUMNS WITH A REGULAR COLUMN
			else
			{
				$columns[$one_field_sql_alias] =$one_field_sql_column; // ZF2 doesn't accept a table.column scheme
			}
			
			// CHECK FIELD TABLE
			if ( ! ( array_key_exists($one_field_sql_table, $froms) || array_key_exists($one_field_sql_table, $joins_tables) ) )
			{
				return Trace::leaveko($context, 'one field table ['.$one_field_sql_table.'] is not known from ['.(is_array($froms) ? implode(',', $froms) : 'null').'] and ['.(is_array($joins_tables) ? implode(',', $joins_tables) : 'null').']', null, self::$TRACE_BUILDER);
			}
		}
		
		// SELECT (NOT ONE FIELD) - SELECT ... FROM ... WHERE ... GROUP BY ... ORDER BY ...
		else
		{
			Trace::step($context, 'query is not of type one field', self::$TRACE_BUILDER);
			
			// LOOP ON MODEL FIELDS
			foreach($query_fields_names as $field_name)
			{
				Trace::step($context, 'loop on field query name [' . $field_name . ']', self::$TRACE_BUILDER);
				
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
				// $field_sql_alias		= array_key_exists('sql_alias', $field_record) ? $field_record['sql_alias'] : $field_sql_column;
				$field_sql_alias		= $field_name;
				$field_sql_is_expr		= $field_record['sql_is_expression'];
				$field_sql_is_pk		= $field_record['sql_is_primary_key'];
				
				
				// FIELD HAS FOREIGN LINK
				if ($field_has_foreign_link)
				{
					Trace::step($context, 'field has foreign link', self::$TRACE_BUILDER);
					
					// CREAT FOREIGN LINK SUB QUERY
					$sub_select_exp = SqlSubQuery::compileSubSelect($arg_zf2_sql, $field_record);
					if ( is_null($sub_select_exp) )
					{
						return Trace::leaveko($context, 'foreign field sub query creation failed', null, self::$TRACE_BUILDER);
					}
					
					// REGISTER COLUMN
					$columns[$field_sql_alias] = $sub_select_exp;
					continue;
				}
				
				
				// FIELD HAS NO FOREIGN LINK
				Trace::step($context, 'field has no foreign link', self::$TRACE_BUILDER);
				
				
				// FILL SELECT COLUMNS WITH AN EXPRESSION
				if ($field_sql_is_expr)
				{
					Trace::step($context, 'field is an expression', self::$TRACE_BUILDER);
					
					// REGISTER COLUMN
					$columns[$field_sql_alias] = new Expression($field_sql_column);
					continue;
				}
				
				
				// FILL SELECT COLUMNS WITH A FIELD
				Trace::step($context, 'field is regular', self::$TRACE_BUILDER);
				
				
				// FILL SELECT COLUMNS WITH A JOIN
				if ( array_key_exists($field_sql_table, $joins_tables) )
				{
					Trace::step($context, 'register join column for field name [' . $field_name . ']', self::$TRACE_BUILDER);
					
					if ( ! array_key_exists($field_sql_table, $joins_columns) || ! is_array($joins_columns[$field_sql_table]) )
					{
						$joins_columns[$field_sql_table] = array();
					}
					$joins_columns[$field_sql_table][$field_sql_alias] = $field_sql_column;
				}
				// FILL SELECT COLUMNS WITH A REGULAR COLUMN
				else
				{
					Trace::step($context, 'register no join column for field name [' . $field_name . ']', self::$TRACE_BUILDER);
					$columns[$field_sql_alias] = $field_sql_column; // ZF2 doesn't accept a table.column scheme
				}
				
				
				// CHECK FIELD TABLE
				Trace::value($context, 'field_sql_table', $field_sql_table, self::$TRACE_BUILDER);
				Trace::value($context, 'joins_tables', $joins_tables, self::$TRACE_BUILDER);
				
				if ( ! ( array_key_exists($field_sql_table, $froms) || array_key_exists($field_sql_table, $joins_tables) ) )
				{
					$tables_list_str = (is_array($froms) ? implode(',', $froms) : 'null').'] and ['.(is_array($joins_tables) ? implode(',', $joins_tables) : 'null');
					return Trace::leaveko($context, 'field table ['.$field_sql_table.'] is not known from ['.$tables_list_str.']', null, self::$TRACE_BUILDER);
				}
			}
		}
		
		
		// SELECT COUNT(*) FROM ... WHERE ... GROUP BY ... ORDER BY ...
		if ($query_type === Query::$TYPE_SELECT_COUNT)
		{
			$columns = array('count' => new Expression('count(' . $one_field_sql_column . ')') );
			$froms = array($one_field_sql_table=>$one_field_sql_table);
		}
		
		
		// JOINS
		Trace::step($context, 'has join records ?', self::$TRACE_BUILDER);
		if ( is_array($joins) && count($joins) > 0 )
		{
			Trace::step($context, 'process ['.count($joins).'] joins', self::$TRACE_BUILDER);
			
			foreach($joins as $join_record)
			{
				Trace::value($context, 'join record', $join_record, self::$TRACE_BUILDER);
				
				$join_table_right = $join_record['right_table'];
				$join_columns = array_key_exists($join_table_right, $joins_columns) ? $joins_columns[$join_table_right] : $select::SQL_STAR;
				// var_dump($join_columns);
				$select->join(
					$join_record['right'],
					$join_record['on'],
					$join_columns,
					$join_record['mode']
					);
			}
		}
		
		
		// FILL COLUMNS
		$has_columns = ( is_array($joins_columns) || is_array($columns) ) && ( count($columns) + count($joins_columns) ) >= 1;
		if ( ! $has_columns)
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
		if ( $arg_query->hasFiltersTree() )
		{
			// GET FILTERS TREE
			$tree_root = $arg_query->getFiltersTree();
			
			// SET WHERE
			Trace::step($context, 'has filters tree root ?', self::$TRACE_BUILDER);
			if ( is_object($tree_root) && $tree_root instanceof \Devapt\Models\Filters\FilterNode )
			{
				Trace::step($context, 'update where with filters tree root', self::$TRACE_BUILDER);
				$root_predicate = $tree_root->getPredicate();
				if ( ! ( is_object($root_predicate) && $root_predicate instanceof \Zend\Db\Sql\Predicate\PredicateInterface ) )
				{
					Trace::value($context, 'root_predicate', $root_predicate, self::$TRACE_BUILDER);
					return Trace::leaveko($context, 'bad tree root predicate', null, self::$TRACE_BUILDER);
				}
				
				$where->addPredicate($root_predicate, $tree_root->getCombination());
			}
		}
		
		// SET FILTERS
		$select->where($where);
		
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
			$select->group($groups);
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
			$select->order($orders);
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
		
		
		// TRACE SQL
		$sql = $select->getSqlString();
		// Trace::value($context, 'sql', $sql, true);
		Trace::value($context, 'sql', $sql, self::$TRACE_BUILDER);
		
		
		return Trace::leaveok($context, 'success', $select, self::$TRACE_BUILDER);
	}
}