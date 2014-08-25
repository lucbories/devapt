<?php
/**
 * @file        SqlFiltersBuilderV1.php
 * @brief       Static class to build SQL where parts of a query with filters
 * @details     ...
 * @see			...
 * @ingroup     MODELS
 * @date        2014-08-16
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

// ZEND IMPORTS
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Predicate\Expression as Expr;
use Zend\Db\Sql\Predicate\Operator as Oper;
use Zend\Db\Sql\Predicate\Like;
use Zend\Db\Sql\Predicate\In;
use Zend\Db\Sql\Predicate\Between;
use Zend\Db\Sql\Predicate\IsNull;
use Zend\Db\Sql\Predicate\IsNotNull;
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\ResultSet\ResultSet;

final class SqlFiltersBuilderV1
{
	// STATIC ATTRIBUTES
	static public $TRACE_FILTERS_BUILDER = false;
	
	
	// ATTRIBUTES
	
	
	
	/**
	 * @brief		Constructor (private)
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/*
		EXAMPLE :
		
		where expr1 AND expr2 OR ( expr3 AND expr4 AND ( expr5 OR expr6 OR expr7 ) AND expr8 )
		
			expr1
		AND
			expr2
		OR (
				expr3
			AND
				expr4
			AND (
					expr5
				OR
					expr6
				OR
					expr7
				)
			AND
				expr8
			)
		
		tree(	node1(null, expr1, [], 'first')
				node2(null, expr2, [], 'and')
				node3(null, null,
					[
						node31(node3, expr3, [], 'first'),
						node32(node3, expr4, [], 'and'),
						node33(node3, null, 
							[
								node331(node3, expr5, [], 'first'),
								node332(node3, expr6, [], 'or'),
								node332(node3, expr7, [], 'or'),
							], 'or'),
						node34(node3, expr8, [], 'and'),
					], 'or')
				
		sql->where( new \Zend\Db\Sql\Predicate\PredicateSet(
			array(
				new \Zend\Db\Sql\Predicate\PredicateSet(
					array(expr1, expr2),
					AND
				),
				new \Zend\Db\Sql\Predicate\PredicateSet(
					array(
						expr3,
						expr4,
						new \Zend\Db\Sql\Predicate\PredicateSet(
							array(expr5, expr6, expr7),
							OR
						),
						expr8
					),
					AND
				)
			)
			OR
		)
	*/
	
	
	/**
	 * @brief		Build filter node
	 * @param[in]	arg_sql				query SQL (object)
	 * @param[in]	arg_parent_node		filter parent node (object)
	 * @param[in]	arg_fields_array	fields list (array)
	 * @param[in]	arg_filter_record	filter record (array)
	 * @return		array				('predicate' => Predicate object, 'combination' => string, 'child_nodes' => array, 'parent_node' => array)
	 */
	static public function buildFilterNode($arg_sql, &$arg_parent_node, array $arg_fields_array, array $arg_filter_record)
	{
		$context = 'SqlFiltersBuilderV1.buildFilterNode';
		Trace::enter($context, '', self::$TRACE_FILTERS_BUILDER);
		
		Trace::value($context, 'filter', $arg_filter_record, self::$TRACE_FILTERS_BUILDER);
		
		// CHECK ARGS
		if ( ! is_object($arg_sql) )
		{
			Trace::warning($context.': bad arg : sql object');
			return null;
		}
		if ( ! is_array($arg_filter_record) )
		{
			Trace::warning($context.': bad arg : filter record array');
			return null;
		}
		
		
		// BUILD FILTER ATTRIBUTES ARRAY
		$new_filter_record = array();
		foreach($arg_filter_record as $filter_record_key => $filter_record_value)
		{
			$attribute = null;
			if ( is_string($filter_record_value) )
			{
				$attribute = explode('=', $filter_record_value);
				if ( ! is_array($attribute) || count($attribute) !== 2 )
				{
					return Trace::leaveko($context, 'bad filter record attribute string ['.$filter_record_value.']', null, self::$TRACE_FILTERS_BUILDER);
				}
			}
			else
			{
				$attribute = $filter_record_value;
				if ( ! is_array($attribute) || count($attribute) !== 2 )
				{
					return Trace::leaveko($context, 'bad filter record attribute array', null, self::$TRACE_FILTERS_BUILDER);
				}
			}
			
			$attr_key		= $attribute[0];
			$attr_value		= $attribute[1];
			$new_filter_record[$attr_key] = $attr_value;
		}
		$filter_record = $new_filter_record;
		Trace::value($context, 'processed filter', $filter_record, self::$TRACE_FILTERS_BUILDER);
		
		
		// GET FILTER ATTRIBUTES
		$filter_group		= array_key_exists('group', $filter_record)		? $filter_record['group']		: null;
		$filter_join		= array_key_exists('join', $filter_record)		? $filter_record['join']		: null;
		$filter_field		= array_key_exists('field', $filter_record)		? $filter_record['field']		: null;
		$filter_type		= array_key_exists('type', $filter_record)		? $filter_record['type']		: null;
		$filter_op			= array_key_exists('op', $filter_record)		? $filter_record['op']			: null;
		$filter_modifier	= array_key_exists('modifier', $filter_record)	? $filter_record['modifier']	: null;
		$filter_var1		= array_key_exists('var1', $filter_record)		? $filter_record['var1']		: null;
		$filter_var2		= array_key_exists('var2', $filter_record)		? $filter_record['var2']		: null;
		$filter_var3		= array_key_exists('var3', $filter_record)		? $filter_record['var3']		: null;
		$filter_left_type	= 'identifier';
		$filter_right_type	= 'value';
		Trace::value($context, 'filter_field', $filter_field, self::$TRACE_FILTERS_BUILDER);
		
		
		// CHECK FILTER ATTRIBUTES
		if ( ! is_string($filter_field) || $filter_field === '' )
		{
			return Trace::leaveko($context, 'filter field name', null, self::$TRACE_FILTERS_BUILDER);
		}
		if ( ! is_string($filter_op) || $filter_op === '' )
		{
			return Trace::leaveko($context, 'filter operator name', null, self::$TRACE_FILTERS_BUILDER);
		}
		if ( is_string($filter_group) && ! in_array($filter_group, Query::$FILTERS_GROUP_OPERATORS) )
		{
			return Trace::leaveko($context, 'filter bad group mode ['.$filter_group.']', null, self::$TRACE_FILTERS_BUILDER);
		}
		if ( is_string($filter_join) && ! in_array($filter_join, Query::$FILTERS_JOIN_OPERATORS) )
		{
			return Trace::leaveko($context, 'filter bad join mode ['.$filter_join.']', null, self::$TRACE_FILTERS_BUILDER);
		}
		if ( is_string($filter_type) && $filter_modifier !== '' && ! in_array($filter_type, Query::$FILTERS_TYPES) )
		{
			return Trace::leaveko($context, 'filter bad type ['.$filter_type.']', null, self::$TRACE_FILTERS_BUILDER);
		}
		if ( is_string($filter_op) && ! in_array($filter_op, Query::$FILTERS_OPERATORS) )
		{
			return Trace::leaveko($context, 'filter bad operator ['.$filter_op.']', null, self::$TRACE_FILTERS_BUILDER);
		}
		if ( is_string($filter_modifier) && $filter_modifier !== '' && ! in_array($filter_modifier, Query::$FILTERS_MODIFIERS) )
		{
			return Trace::leaveko($context, 'filter bad modifier ['.$filter_modifier.']', null, self::$TRACE_FILTERS_BUILDER);
		}
		
		// GET FIELD RECORD
		if ( ! array_key_exists($filter_field, $arg_fields_array) )
		{
			return Trace::leaveko($context, 'field not found ['.$filter_field.']', null, self::$TRACE_FILTERS_BUILDER);
		}
		$field_record = $arg_fields_array[$filter_field];
		
		
		// GET FILTERFIELD ATTRIBUTES
		$field_has_foreign_link	= $field_record['has_foreign_link'];
		$field_sql_db			= $field_record['sql_db'];
		$field_sql_table		= $field_record['sql_table'];
		$field_sql_column		= $field_record['sql_column'];
		$field_sql_alias		= array_key_exists('sql_alias', $field_record) ? $field_record['sql_alias'] : $field_sql_column;
		$field_sql_is_expr		= $field_record['sql_is_expression'];
		$field_sql_is_pk		= $field_record['sql_is_primary_key'];
		
		
		
		// BUILD FILTER
		$left_str = $field_sql_alias;
		$right_str_array = array($filter_var1, $filter_var2, $filter_var3);
		
		// FIELD HAS FOREIGN LINK
		if ($field_has_foreign_link)
		{
			Trace::step($context, 'filter field has foreign link', self::$TRACE_FILTERS_BUILDER);
			
			// CREAT FOREIGN LINK SUB QUERY
			$sub_select_exp = SqlSubQueryBuilder::compileSubSelect($arg_sql, $field_record);
			if ( is_null($sub_select_exp) )
			{
				return Trace::leaveko($context, 'filter foreign field sub query creation failed', null, self::$TRACE_FILTERS_BUILDER);
			}
			
			$filter_left_type = 'expression';
			$left_str = $arg_sql->getSqlStringForSqlObject($sub_select_exp);
		}
		
		// FIELD IS AN EXPRESSION
		else
		{
			Trace::step($context, 'filter field has no foreign link', self::$TRACE_FILTERS_BUILDER);
			
			// FILL SELECT COLUMNS WITH AN EXPRESSION
			if ($field_sql_is_expr)
			{
				Trace::step($context, 'filter field is an expression', self::$TRACE_FILTERS_BUILDER);
				$sub_select_exp = new Expr($field_sql_column);
				
				$filter_left_type = 'expression';
				$left_str = $arg_sql->getSqlStringForSqlObject($sub_select_exp);
			}
		}
		
		// GET FILTER COMBINATION
		$filter_combination = PredicateSet::OP_AND;
		if ($filter_join === Query::$FILTERS_JOIN_OR)
		{
			$filter_combination = PredicateSet::OP_OR;
		}
		
		
		// BUILD FILTER OPERATOR
		$filter_predicate = null;
		if ( is_string($filter_modifier) && $filter_modifier !== '' )
		{
			Trace::step($context, 'filter operator with modifier', self::$TRACE_FILTERS_BUILDER);
			
			// GET FILTER MODIFIER
			$left_expr = QueryUnaryOperatorBuilder::buildOperatorExpression($filter_type, $filter_modifier, $left_str);
			$filter_predicate = QueryOperatorBuilder::buildOperatorExpression($filter_type, $filter_op, $left_expr, $right_str_array);
		}
		else if ($field_sql_is_expr)
		{
			Trace::step($context, 'filter operator with field expression', self::$TRACE_FILTERS_BUILDER);
			$filter_predicate = QueryOperatorBuilder::buildOperatorExpression($filter_type, $filter_op, $left_str, $right_str_array);
		}
		else
		{
			Trace::step($context, 'filter operator without modifier near expression', self::$TRACE_FILTERS_BUILDER);
			$filter_predicate = QueryOperatorBuilder::buildOperatorPredicate($filter_type, $filter_op, $left_str, $right_str_array, $filter_left_type, $filter_right_type);
		}
		if ( ! is_object($filter_predicate) )
		{
			return Trace::leaveko($context, 'bad filter predicate', null, self::$TRACE_FILTERS_BUILDER);
		}
		
		
		// BUILD FILTER NODE
		$enter_group	= ($filter_group === Query::$FILTERS_GROUP_ENTER);
		$leave_group	= ($filter_group === Query::$FILTERS_GROUP_LEAVE);
		$parent_node	= $arg_parent_node;
		if ( ! is_object($parent_node) )
		{
			return Trace::leaveko($context, 'given parent is null', null, self::$TRACE_FILTERS_BUILDER);
		}
		Trace::step($context, 'node has parent', self::$TRACE_FILTERS_BUILDER);
		
		// ENTER GROUP
		if ($enter_group)
		{
			Trace::step($context, 'enter group', self::$TRACE_FILTERS_BUILDER);
			$parent_node = new FilterNode($arg_parent_node, $filter_combination, new PredicateSet(array(), $filter_combination) );
			$arg_parent_node->addChild($parent_node);
		}
		
		// CREATE NODE
		$filter_node = new FilterNode($parent_node, $filter_combination, $filter_predicate);
		
		// UPDATE PARENT NODE
		$parent_node->addChild($filter_node);
		
		
		// LEAVE GROUP
		if ($leave_group)
		{
			Trace::step($context, 'leave group', self::$TRACE_FILTERS_BUILDER);
			if ( is_object( $parent_node->getParent() ) )
			{
				return Trace::leaveok($context, 'leave group and parent is not null', $parent_node->getParent(), self::$TRACE_FILTERS_BUILDER);
			}
			else
			{
				return Trace::leaveko($context, 'leave group and parent is null', null, self::$TRACE_FILTERS_BUILDER);
			}
		}
		
		// CHECK PARENT
		if ( ! is_object($parent_node) )
		{
			// Trace::value($context, 'filter_node', $filter_node, self::$TRACE_FILTERS_BUILDER);
			return Trace::leaveok($context, 'no parent node', $filter_node, self::$TRACE_FILTERS_BUILDER);
		}
		
		return Trace::leaveok($context, 'success', $parent_node, self::$TRACE_FILTERS_BUILDER);
	}
}