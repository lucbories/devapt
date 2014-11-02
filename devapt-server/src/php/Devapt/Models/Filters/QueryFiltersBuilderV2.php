<?php
/**
 * @file        QueryFiltersBuilderV2.php
 * @brief       Static class to build SQL where parts of a query with filters
 * @details     ...
 * @see			...
 * @ingroup     MODELS
 * @date        2014-08-12
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		...
 */

namespace Devapt\Models\Filters;;

// ZEND IMPORTS
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Predicate\Expression;
use Zend\Db\Sql\Predicate\Operator;
use Zend\Db\Sql\Predicate\Like;
use Zend\Db\Sql\Predicate\Literal;
use Zend\Db\Sql\Predicate\NotLike;
use Zend\Db\Sql\Predicate\In;
use Zend\Db\Sql\Predicate\NotIn;
use Zend\Db\Sql\Predicate\Between;
use Zend\Db\Sql\Predicate\IsNull;
use Zend\Db\Sql\Predicate\IsNotNull;
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\ResultSet\ResultSet;

// DEVAPT IMPORTS
use Devapt\Core\Trace;
use Devapt\Models\Query;
// use Devapt\Models\Sql\FilterNode

final class QueryFiltersBuilderV2
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
		==>
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
		
		filters with query v2 format :
		[
			{
				combination: 'AND' (ignored)
				expression: {
					expr1
				}
			},
			{
				combination: 'AND'
				expression: {
					expr2
				}
			},
			{
				combination: 'OR'
				filters: [
					{
						combination: 'AND' (ignored)
						expression: {
							expr3
						}
					},
					{
						combination: 'AND'
						expression: {
							expr4
						}
					},
					{
						combination: 'AND'
						filters: [
							{
								combination: 'AND' (ignored)
								expression: {
									expr5
								}
							},
							{
								combination: 'OR'
								expression: {
									expr6
								}
							},
							{
								combination: 'OR'
								expression: {
									expr7
								}
							}
						]
					}
				]
			},
			
		]
		
		tree(	node1(null, expr1, [], 'no combination')
				node2(null, expr2, [], 'and')
				node3(null, null,
					[
						node31(node3, expr3, [], 'no combination'),
						node32(node3, expr4, [], 'and'),
						node33(node3, null, 
							[
								node331(node3, expr5, [], 'no combination'),
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
	
	
	/*
		QUERY VERSION 2 FILTER :
		
		filters = JSON array of filter object
		filter object = {
			combination: 'AND' / 'OR'
			expression: expression object or filters array
		}
		
		expression object:
			operator expression:
			{
				operator: an operator name
				operands: an array of expression
			}
		or
			value expression
			{
				value: expression value
				type: value type name
			}
		
		 * value types: "String", "Integer", "Float", "Date", "Time", "DateTime", "Boolean"
		 
		 * operators:
		  * ANY TYPE: "equals", "notequals", "isnull", "isnotnull",
		  * STRING: "bw", "begins_with", "begins with", "contains", "ew", "ends_with", "ends with", "min length", "max length", "length between", "in"
					"upper", "lower", "ltrim", "rtrim", "aes_encrypt", "aes_decrypt", "md5"
		  * NUMBER: "gt", "ge", "lt", "le", "between", "abs", "floor"
		  * DATE: "date", "day", "week", "month", "year", "day of week", "day of month", "day of year", "last day of month", "quarter",
		  * TIME:  "time", "hour", "minute", "second"
	
		
	*/
	
	/**
	 * @brief		Get filter combination
	 * @param[in]	arg_combination		filter combination (string)
	 * @return		string
	 */
	static public function getZF2Combination($arg_combination)
	{
		if ( strtolower($arg_combination) === Query::$FILTERS_JOIN_OR)
		{
			return PredicateSet::OP_OR;
		}
		
		return PredicateSet::OP_AND;
	}
	
	
	/**
	 * @brief		Build filter node
	 * @param[in]	arg_sql					ZF2 query SQL (object)
	 * @param[in]	arg_parent_node			filter parent node (object)
	 * @param[in]	arg_fields_array		fields list (array)
	 * @param[in]	arg_filter_record		filter record (array)
	 * @param[in]	arg_filter_combination	filter combination (string)
	 * @return		object					FilterNode instance ('predicate' => Predicate object, 'combination' => string, 'child_nodes' => array, 'parent_node' => array)
	 */
	static public function buildFilterNode($arg_sql, $arg_parent_node, array $arg_fields_array, array $arg_filter_record, $arg_filter_combination)
	{
		$context = 'QueryFiltersBuilderV2.buildFilterNode';
		Trace::enter($context, '', self::$TRACE_FILTERS_BUILDER);
		
		
		// CHECK ARGS
		if ( ! is_object($arg_sql) )
		{
			return Trace::leaveok($context, 'bad sql object', null, self::$TRACE_FILTERS_BUILDER);
		}
		if ( ! is_array($arg_fields_array) )
		{
			return Trace::leaveok($context, 'bad fields array', null, self::$TRACE_FILTERS_BUILDER);
		}
		if ( ! is_array($arg_filter_record) )
		{
			return Trace::leaveok($context, 'bad filter record', null, self::$TRACE_FILTERS_BUILDER);
		}
		Trace::value($context, 'fields', $arg_fields_array, self::$TRACE_FILTERS_BUILDER);
		Trace::value($context, 'filter record', $arg_filter_record, self::$TRACE_FILTERS_BUILDER);
		Trace::value($context, 'filter combination', $arg_filter_combination, self::$TRACE_FILTERS_BUILDER);
		
		// BUILD PREDICATE FORM FILTER RECORD
		$predicate = QueryFiltersBuilderV2::buildFilterRecordPredicate($arg_sql, $arg_fields_array, $arg_filter_record);
		$zf2_combination = QueryFiltersBuilderV2::getZF2Combination($arg_filter_combination);
		$result_node = new FilterNode($arg_parent_node, $zf2_combination, $predicate);
		
		// CHECK NODE
		if ( ! is_object($result_node) )
		{
			return Trace::leaveko($context, 'failure', null, self::$TRACE_FILTERS_BUILDER);
		}
		
		
		return Trace::leaveok($context, 'success', $result_node, self::$TRACE_FILTERS_BUILDER);
	}
	
	
	
	/**
	 * @brief		Build filter record predicate
	 * @param[in]	arg_sql				query SQL (object)
	 * @param[in]	arg_fields_array	fields list (array)
	 * @param[in]	arg_filter_record	filter record (array)
	 * @return		object				ZF2 predicate instance
	 */
	static public function buildFilterRecordPredicate($arg_sql, array $arg_fields_array, array $arg_filter_record)
	{
		$context = 'QueryFiltersBuilderV2.buildFilterRecordPredicate';
		Trace::enter($context, '', self::$TRACE_FILTERS_BUILDER);
		
		
		Trace::value($context, 'fields', $arg_fields_array, self::$TRACE_FILTERS_BUILDER);
		Trace::value($context, 'filter record', $arg_filter_record, self::$TRACE_FILTERS_BUILDER);
		
		// CREATE NODE BUILD FILTER NODE
		$filter_combination	= array_key_exists('combination', $arg_filter_record) ? $arg_filter_record['combination'] : null;
		$filter_expression	= array_key_exists('expression', $arg_filter_record) ? $arg_filter_record['expression'] : null;
		$filter_filters		= array_key_exists('filters', $arg_filter_record) ? $arg_filter_record['filters'] : null;
		$zf2_combination	= QueryFiltersBuilderV2::getZF2Combination($filter_combination);
		
		$predicate = QueryFiltersBuilderV2::buildFilterPredicate($arg_sql, $arg_fields_array, $zf2_combination, $filter_expression, $filter_filters);
		
		
		return Trace::leaveok($context, 'success', $predicate, self::$TRACE_FILTERS_BUILDER);
	}
	
	
	/**
	 * @brief		Build filter predicate
	 * @param[in]	arg_sql					query SQL (object)
	 * @param[in]	arg_fields_array		fields list (array)
	 * @param[in]	arg_zf2_combination		ZF2 combination (string)
	 * @param[in]	arg_filter_expression	filter expression (object)
	 * @param[in]	arg_filter_filters		filter filters (array)
	 * @return		object					ZF2 predicate instance
	 */
	static public function buildFilterPredicate($arg_sql, array $arg_fields_array, $arg_zf2_combination, $arg_filter_expression, $arg_filter_filters)
	{
		$context = 'QueryFiltersBuilderV2.buildFilterPredicate';
		Trace::enter($context, '', self::$TRACE_FILTERS_BUILDER);
		
		
		// TRACE
		Trace::value($context, 'fields', $arg_fields_array, self::$TRACE_FILTERS_BUILDER);
		Trace::value($context, 'arg_filter_expression', $arg_filter_expression, self::$TRACE_FILTERS_BUILDER);
		Trace::value($context, 'arg_filter_filters', $arg_filter_filters, self::$TRACE_FILTERS_BUILDER);
		
		// PROCESS EXPRESSION PREDICATE
		if ( is_array($arg_filter_expression) )
		{
			Trace::step($context, 'process expression predicate', self::$TRACE_FILTERS_BUILDER);
			
			$predicate = QueryFiltersBuilderV2::buildExpressionPredicate($arg_sql, $arg_fields_array, $arg_zf2_combination, $arg_filter_expression);
			return Trace::leaveok($context, 'success: expression predicate', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		// PROCESS FILTERS GROUP
		if ( is_array($arg_filter_filters) )
		{
			Trace::step($context, 'process filters group', self::$TRACE_FILTERS_BUILDER);
			
			$group_predicate = new PredicateSet(array(), $arg_zf2_combination);
			foreach($arg_filter_filters as $filter_record)
			{
				Trace::step($context, 'process filter record', self::$TRACE_FILTERS_BUILDER);
				
				$filter_combination = $filter_record['combination'];
				$zf2_combination	= QueryFiltersBuilderV2::getZF2Combination($filter_combination);
				$predicate = QueryFiltersBuilderV2::buildFilterRecordPredicate($arg_sql, $arg_fields_array, $filter_record);
				$group_predicate->addPredicate($predicate, $zf2_combination);
			}
			return Trace::leaveok($context, 'success: predicate set', $group_predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		
		return Trace::leaveko($context, 'failure', null, self::$TRACE_FILTERS_BUILDER);
	}
	
	
	/**
	 * @brief		Build expression predicate
	 * @param[in]	arg_sql					query SQL (object)
	 * @param[in]	arg_fields_array		fields list (array)
	 * @param[in]	arg_zf2_combination		ZF2 combination (string)
	 * @param[in]	arg_filter_expression	filter expression (object)
	 * @return		object					ZF2 predicate instance
	 */
	static public function buildExpressionPredicate($arg_sql, array $arg_fields_array, $arg_zf2_combination, array $arg_filter_expression)
	{
		$context = 'QueryFiltersBuilderV2.buildExpressionPredicate';
		Trace::enter($context, '', self::$TRACE_FILTERS_BUILDER);
		
		
		// GET TYPE OF FILTER
		$filter_is_operator	= ! array_key_exists('value', $arg_filter_expression) && ! array_key_exists('type', $arg_filter_expression) && array_key_exists('operator', $arg_filter_expression) && array_key_exists('operands', $arg_filter_expression);
		$filter_is_value	= ! array_key_exists('operator', $arg_filter_expression) && ! array_key_exists('operands', $arg_filter_expression) && array_key_exists('value', $arg_filter_expression) && array_key_exists('type', $arg_filter_expression);
		
		// INIT RESULT PREDICATE
		$predicate = null;
		
		// VALUE PREDICATE
		if ($filter_is_value)
		{
			Trace::step($context, 'filter expression is value', self::$TRACE_FILTERS_BUILDER);
			
			$filter_expression_value	= $arg_filter_expression['value'];
			$filter_expression_type		= $arg_filter_expression['type'];
			$predicate = QueryFiltersBuilderV2::buildValuePredicate($arg_sql, $arg_fields_array, $filter_expression_type, $filter_expression_value);
		}
		
		// OPERATOR PREDICATE
		if ($filter_is_operator)
		{
			Trace::step($context, 'filter expression is operator', self::$TRACE_FILTERS_BUILDER);
			
			$filter_operator	= $arg_filter_expression['operator'];
			$filter_operands	= $arg_filter_expression['operands'];
			$predicate = QueryFiltersBuilderV2::buildOperatorPredicate($arg_sql, $arg_fields_array, $filter_operator, $filter_operands);
		}
		
		// CHECK PREDICATE
		if ( ! is_object($predicate) )
		{
			return Trace::leaveko($context, 'failure', null, self::$TRACE_FILTERS_BUILDER);
		}
		
		
		return Trace::leaveok($context, 'success', $predicate, self::$TRACE_FILTERS_BUILDER);
	}
	
	
	/**
	 * @brief		Build value predicate
	 * @param[in]	arg_sql						query SQL (object)
	 * @param[in]	arg_fields_array			fields list (array)
	 * @param[in]	arg_expression_type			filter expression type (string)
	 * @param[in]	arg_expression_value		filter expression value (string)
	 * @return		object						ZF2 Predicate instance
	 */
	static public function buildValuePredicate($arg_sql, array $arg_fields_array, $arg_expression_type, $arg_expression_value)
	{
		$context = 'QueryFiltersBuilderV2.buildValuePredicate';
		Trace::enter($context, '', self::$TRACE_FILTERS_BUILDER);
		Trace::value($context, 'arg_expression_value', $arg_expression_value, self::$TRACE_FILTERS_BUILDER);
		
		
		// CHECK ARGS
		$arg_expression_type = strtolower($arg_expression_type);
		if ( ! in_array($arg_expression_type, Query::$FILTERS_TYPES) )
		{
			return Trace::leaveko($context, 'bad expression type', null, self::$TRACE_FILTERS_BUILDER);
		}
		// TODO unused arg_expression_type ???
		
		// SCALAR EXPRESSION VALUE
		Trace::step($context, 'test numeric expression', self::$TRACE_FILTERS_BUILDER);
		if ( is_numeric($arg_expression_value) )
		{
			$predicate = new Literal($arg_expression_value);
			return Trace::leaveok($context, 'success: numeric literal', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		// STRING EXPRESSION VALUE
		Trace::step($context, 'test string expression', self::$TRACE_FILTERS_BUILDER);
		if ( is_string($arg_expression_value) && $arg_expression_value !== '' )
		{
			// FIELD NAME EXPRESSION VALUE
			if ( array_key_exists($arg_expression_value, $arg_fields_array) )
			{
				$field_record	= $arg_fields_array[$arg_expression_value];
				$predicate		= QueryFiltersBuilderV2::buildFieldValuePredicate($arg_sql, $field_record);
				return Trace::leaveok($context, 'success: field alias with field name', $predicate, self::$TRACE_FILTERS_BUILDER);
			}
			
			// LOOP ON FIELD RECORDS
			foreach($arg_fields_array as $field_record)
			{
				Trace::step($context, 'Loop on field record', self::$TRACE_FILTERS_BUILDER);
				
				$field_name = $field_record['name'];
				Trace::value($context, 'field name', $field_name, self::$TRACE_FILTERS_BUILDER);
				if ($field_name === $arg_expression_value)
				{
					if ( $field_record['has_foreign_link'] )
					{
						$field_record_clone = array();
						
						$field_record_clone['name']					= $field_record['sql_foreign_column'];
						$field_record_clone['sql_db']				= $field_record['sql_db'];
						$field_record_clone['sql_table']			= $field_record['sql_table'];
						// $field_record_clone['sql_column']			= $field_record['sql_column'];
						$field_record_clone['sql_alias']			= $field_record['sql_foreign_column'];
						
						$field_record_clone['has_foreign_link']		= false;
						
						$field_record_clone['sql_is_expression']	= false;
						$field_record_clone['sql_is_primary_key']	= $field_record['sql_is_primary_key'];
						
						$predicate = QueryFiltersBuilderV2::buildFieldValuePredicate($arg_sql, $field_record_clone);
						return Trace::leaveok($context, 'success: field alias with sql alias', $predicate, self::$TRACE_FILTERS_BUILDER);
					}
					
					$predicate = QueryFiltersBuilderV2::buildFieldValuePredicate($arg_sql, $field_record);
					return Trace::leaveok($context, 'success: field alias with name', $predicate, self::$TRACE_FILTERS_BUILDER);
				}
				
				$field_sql_column = $field_record['sql_column'];
				Trace::value($context, 'field_sql_column', $field_sql_column, self::$TRACE_FILTERS_BUILDER);
				if ($field_sql_column === $arg_expression_value)
				{
					$predicate = QueryFiltersBuilderV2::buildFieldValuePredicate($arg_sql, $field_record);
					return Trace::leaveok($context, 'success: field alias with sql column', $predicate, self::$TRACE_FILTERS_BUILDER);
				}
				
				if (array_key_exists('sql_alias', $field_record) )
				{
					$field_sql_alias = $field_record['sql_alias'];
					Trace::value($context, 'field_sql_alias', $field_sql_alias, self::$TRACE_FILTERS_BUILDER);
					if ($field_sql_alias === $arg_expression_value)
					{
						$predicate = QueryFiltersBuilderV2::buildFieldValuePredicate($arg_sql, $field_record);
						return Trace::leaveok($context, 'success: field alias with sql alias', $predicate, self::$TRACE_FILTERS_BUILDER);
					}
				}
				
				if (array_key_exists('sql_foreign_column', $field_record) )
				{
					$sql_foreign_column = $field_record['sql_foreign_column'];
					Trace::value($context, 'sql_foreign_column', $sql_foreign_column, self::$TRACE_FILTERS_BUILDER);
					if ($sql_foreign_column === $arg_expression_value)
					{
						$field_record_clone = array();
						
						$field_record_clone['name']					= $field_record['sql_foreign_column'];
						$field_record_clone['sql_db']				= $field_record['sql_db'];
						$field_record_clone['sql_table']			= $field_record['sql_table'];
						// $field_record_clone['sql_column']			= $field_record['sql_column'];
						$field_record_clone['sql_alias']			= $field_record['sql_foreign_column'];
						
						$field_record_clone['has_foreign_link']		= false;
						
						$field_record_clone['sql_is_expression']	= false;
						$field_record_clone['sql_is_primary_key']	= $field_record['sql_is_primary_key'];
						
						$predicate = QueryFiltersBuilderV2::buildFieldValuePredicate($arg_sql, $field_record_clone);
						return Trace::leaveok($context, 'success: field alias with sql alias', $predicate, self::$TRACE_FILTERS_BUILDER);
					}
				}
			}
			
			// LITERAL EXPRESSION VALUE
			$predicate = new Literal($arg_expression_value);
			return Trace::leaveok($context, 'success: string literal', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		// OBJECT EXPRESSION VALUE
		if ( is_array($arg_expression_value) )
		{
			$predicate = QueryFiltersBuilderV2::buildFilterRecordPredicate($arg_sql, $arg_fields_array, $arg_expression_value);
			return Trace::leaveok($context, 'success: sub expression', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		
		return Trace::leaveko($context, 'failure: bad expression type', $predicate, self::$TRACE_FILTERS_BUILDER);
	}
	
	
	
	/**
	 * @brief		Build field value predicate
	 * @param[in]	arg_sql					query SQL (object)
	 * @param[in]	arg_field_record		field record (array)
	 * @return		object					ZF2 Predicate instance
	 */
	static public function buildFieldValuePredicate($arg_sql, array $arg_field_record)
	{
		$context = 'QueryFiltersBuilderV2.buildFieldValuePredicate';
		Trace::enter($context, '', self::$TRACE_FILTERS_BUILDER);
		
		
		// GET FILTER FIELD ATTRIBUTES
		$field_name				= $arg_field_record['name'];
		$field_has_foreign_link	= $arg_field_record['has_foreign_link'];
		$field_sql_db			= $arg_field_record['sql_db'];
		$field_sql_table		= $arg_field_record['sql_table'];
		$field_sql_column		= $arg_field_record['sql_column'];
		$field_sql_alias		= array_key_exists('sql_alias', $arg_field_record) ? $arg_field_record['sql_alias'] : $field_sql_column;
		// $field_sql_alias		= $field_name;
		$field_sql_is_expr		= $arg_field_record['sql_is_expression'];
		$field_sql_is_pk		= $arg_field_record['sql_is_primary_key'];
		
		// FIELD HAS FOREIGN LINK
		if ($field_has_foreign_link)
		{
			Trace::step($context, 'filter field has foreign link', self::$TRACE_FILTERS_BUILDER);
			
			$predicate = \Devapt\Models\Sql\SqlSubQuery::compileSubSelect($arg_sql, $arg_field_record);
			return Trace::leaveok($context, 'success: field with foreign link', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		// FIELD IS AN EXPRESSION
		if ($field_sql_is_expr)
		{
			Trace::step($context, 'filter field is an expression', self::$TRACE_FILTERS_BUILDER);
			
			$predicate = new Expr($field_sql_column);
			return Trace::leaveok($context, 'success: field with foreign link', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		// FIELD IS AN IDENTIFIER
		if ( is_string($field_sql_alias) && $field_sql_alias !== '')
		{
			// $predicate = new Literal($field_sql_alias);
			$predicate = new Literal($field_sql_table.'.'.$field_sql_column);
			return Trace::leaveok($context, 'success: field identifier for ['.$field_sql_alias.']', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		return Trace::leaveko($context, 'failure: bad field record', null, self::$TRACE_FILTERS_BUILDER);
	}
	
	
	
	/**
	 * @brief		Build operator predicate
	 * @param[in]	arg_sql					query SQL (object)
	 * @param[in]	arg_fields_array		fields list (array)
	 * @param[in]	arg_filter_operator		filter operator name (string)
	 * @param[in]	arg_filter_operands		filter operator operands (array)
	 * @return		object					ZF2 Predicate instance
	 */
	static public function buildOperatorPredicate($arg_sql, array $arg_fields_array, $arg_filter_operator, $arg_filter_operands)
	{
		$context = 'QueryFiltersBuilderV2.buildOperatorPredicate';
		Trace::enter($context, '', self::$TRACE_FILTERS_BUILDER);
		
		
		// CHECK OPERATOR
		if ( ! is_string($arg_filter_operator) || ! in_array($arg_filter_operator, Query::$FILTERS_ALL_OPERATORS) )
		{
			return Trace::leaveko($context, 'bad operator name', null, self::$TRACE_FILTERS_BUILDER);
		}
		
		// CHECK OPERANDS
		if ( ! is_array($arg_filter_operands) )
		{
			return Trace::leaveko($context, 'bad operator operands', null, self::$TRACE_FILTERS_BUILDER);
		}
		$combination = null;
		
		// UNARY OPERATOR
		if ( count($arg_filter_operands) === 1 )
		{
			$operand_1 = $arg_filter_operands[0];
			$expression_1 = QueryFiltersBuilderV2::buildExpressionPredicate($arg_sql, $arg_fields_array, $combination, $operand_1);
			$predicate = QueryFiltersBuilderV2::buildUnaryOperatorPredicate($arg_sql, $arg_filter_operator, $expression_1);
			return Trace::leaveok($context, 'success: unary op', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		// BINARY OPERATOR
		if ( count($arg_filter_operands) === 2 )
		{
			$operand_1 = $arg_filter_operands[0];
			$operand_2 = $arg_filter_operands[1];
			Trace::value($context, 'opd 1', $operand_1, self::$TRACE_FILTERS_BUILDER);
			Trace::value($context, 'opd 2', $operand_2, self::$TRACE_FILTERS_BUILDER);
			Trace::value($context, 'opd 1 is array', is_array($operand_1) ? 'true' : 'false', self::$TRACE_FILTERS_BUILDER);
			Trace::value($context, 'opd 2 is array', is_array($operand_2) ? 'true' : 'false', self::$TRACE_FILTERS_BUILDER);
			
			$expression_1 = QueryFiltersBuilderV2::buildExpressionPredicate($arg_sql, $arg_fields_array, $combination, $operand_1);
			$expression_2 = QueryFiltersBuilderV2::buildExpressionPredicate($arg_sql, $arg_fields_array, $combination, $operand_2);
			Trace::value($context, 'expr 1', $expression_1, self::$TRACE_FILTERS_BUILDER);
			Trace::value($context, 'expr 2', $expression_2, self::$TRACE_FILTERS_BUILDER);
			
			$predicate = QueryFiltersBuilderV2::buildBinaryOperatorPredicate($arg_sql, $arg_filter_operator, $expression_1, $expression_2);
			
			return Trace::leaveok($context, 'success: binary op', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		// XNARY OPERATOR
		if ( count($arg_filter_operands) > 2 )
		{
			$operand_1 = $arg_filter_operands[0];
			$expression_1 = QueryFiltersBuilderV2::buildExpressionPredicate($arg_sql, $arg_fields_array, $combination, $operand_1);
			
			$expression_array = array();
			for($index = 1 ; $index < count($arg_filter_operands) ; $index++)
			{
				$operand = $arg_filter_operands[$index];
				$expression = QueryFiltersBuilderV2::buildExpressionPredicate($arg_sql, $arg_fields_array, $combination, $operand);
				$expression_array[] = $expression;
			}
			
			$predicate = QueryFiltersBuilderV2::buildXnaryOperatorPredicate($arg_sql, $arg_filter_operator, $expression_1, $expression_array);
			return Trace::leaveok($context, 'success: xnary op', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		return Trace::leaveko($context, 'failure: bad operator', null, self::$TRACE_FILTERS_BUILDER);
	}
	
	
	static public function getPredicateString($arg_sql, $arg_predicate)
	{
		$constext = 'QueryFiltersBuilderV2.getPredicateString(predicate)';
		
		if ($arg_predicate instanceof Literal)
		{
			return $arg_predicate->getLiteral();
		}
		elseif ($arg_predicate instanceof Operator || $arg_predicate instanceof Expression)
		{
			$sql = new Sql( $arg_sql->getAdapter() );
			$select = $sql->select();
			$select->where($arg_predicate);
			$str = $select->getSqlString( $arg_sql->getAdapter()->getPlatform() );
			$str = str_replace('WHERE ', '', $str);
			return $str;
		}
		
		Trace::value($context, 'arg_predicate', $arg_predicate, self::$TRACE_FILTERS_BUILDER);
		return null;
	}
	
	
	/**
	 * @brief		Build unary operator predicate
	 * @param[in]	arg_sql					query SQL (object)
	 * @param[in]	arg_operator_name		operator name (string)
	 * @param[in]	arg_operand_1			operator operand 1 (ZF2 Predicate)
	 * @return		object					ZF2 Predicate instance
	 */
	static public function buildUnaryOperatorPredicate($arg_sql, $arg_operator_name, $arg_operand_1)
	{
		$context = 'QueryFiltersBuilderV2.buildUnaryOperatorPredicate('.$arg_operator_name.')';
		Trace::enter($context, '', self::$TRACE_FILTERS_BUILDER);
		
		
		// INIT
		$predicate = null;
		$arg_operator_name = strtolower($arg_operator_name);
		$UNARY_OPERATORS_MAP = array(
			// STRING OPERATORS
			'upper'=>'UPPER(?)',
			'lower'=>'LOWER(?)',
			'ltrim'=>'LTRIM(?)',
			'rtrim'=>'RTRIM(?)',
			'aes_encrypt'=>'AES_ENCRYPT(?)',
			'aes_decrypt'=>'AES_DECRYPT(?)',
			'md5'=>'MD5(?)',
			
			// NUMBER OPERATORS
			'abs'=>'ABS(?)',
			'floor'=>'FLOOR(?)',
			
			// DATE OPERATORS (ON DATE OR DATETIME)
			'date'=>'DATE(?)',
			'day'=>'DAY(?)',
			'week'=>'WEEK(?)',
			'month'=>'MONTH(?)',
			'year'=>'YEAR(?)',
			'dow'=>'DAYOFWEEK(?)',
			'day of week'=>'DAYOFWEEK(?)',
			'dom'=>'DAYOFMONTH(?)',
			'day of month'=>'DAYOFMONTH(?)',
			'doy'=>'DAYOFYEAR(?)',
			'day of year'=>'DAYOFYEAR(?)',
			'ldom'=>'LAST_DAY(?)',
			'last day of month'=>'LAST_DAY(?)',
			'quarter'=>'QUARTER(?)',
			
			// TIME OPERATORS (ON DATE OR DATETIME)
			'time'=>'TIME(?)',
			'hour'=>'HOUR(?)',
			'minute'=>'MINUTE(?)',
			'second'=>'SECOND(?)'
		);
		
		// UNARY FUNCTIONS
		if ( array_key_exists($arg_operator_name, $UNARY_OPERATORS_MAP) )
		{
			$expr_str = $UNARY_OPERATORS_MAP[$arg_operator_name];
			$predicate = new Expression($expr_str, array($arg_operand_1) );
			return Trace::leaveok($context, 'success', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		// PREDICATE UNARY OPERATOR
		switch($arg_operator_name)
		{
			case 'isnull':		$predicate = new IsNull($arg_operand_1); break;
			case 'isnotnull':	$predicate = new IsNotNull($arg_operand_1); break;
			case 'istrue':		$predicate = new Operator($arg_operand_1, Operator::OPERATOR_EQUAL_TO, true); break;
			case 'isfalse':		$predicate = new Operator($arg_operand_1, Operator::OPERATOR_EQUAL_TO, false); break;
		}
		if ( is_object($predicate) )
		{
			return Trace::leaveok($context, 'success', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		
		return Trace::leaveko($context, 'failure: bad operator', null, self::$TRACE_FILTERS_BUILDER);
	}
	
	
	
	/**
	 * @brief		Build binary operator predicate
	 * @param[in]	arg_sql					query SQL (object)
	 * @param[in]	arg_operator_name		operator name (string)
	 * @param[in]	arg_operand_1			operator operand 1 (ZF2 Predicate)
	 * @param[in]	arg_operand_2			operator operand 2 (ZF2 Predicate)
	 * @return		object					ZF2 Predicate instance
	 */
	static public function buildBinaryOperatorPredicate($arg_sql, $arg_operator_name, $arg_operand_1, $arg_operand_2)
	{
		$context = 'QueryFiltersBuilderV2.buildBinaryOperatorPredicate('.$arg_operator_name.')';
		Trace::enter($context, '', self::$TRACE_FILTERS_BUILDER);
		
		
		// INIT
		$predicate = null;
		$arg_operator_name = strtolower($arg_operator_name);
		$BINARY_OPERATORS_MAP = array(
			// ...
		);
		
		// BINARY FUNCTIONS
		if ( array_key_exists($arg_operator_name, $BINARY_OPERATORS_MAP) )
		{
			$expr_str = $BINARY_OPERATORS_MAP[$arg_operator_name];
			$predicate = new Expression($expr_str, array($arg_operand_1, $arg_operand_2) );
			return Trace::leaveok($context, 'success', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		// PREDICATE BINARY OPERATOR
		switch($arg_operator_name)
		{
			// case 'equals':		$predicate = new Operator($arg_operand_1, Operator::OPERATOR_EQUAL_TO, $arg_operand_2); break;
			case 'equals':		$predicate = new Expression('?'.Operator::OPERATOR_EQUAL_TO.'?', array($arg_operand_1, $arg_operand_2) ); break;
			case 'notequals':	$predicate = new Operator($arg_operand_1, Operator::OPERATOR_NOT_EQUAL_TO, $arg_operand_2); break;
			case 'like':		$predicate = new Like( QueryFiltersBuilderV2::getPredicateString($arg_sql, $arg_operand_1), QueryFiltersBuilderV2::getPredicateString($arg_sql, $arg_operand_2)); break;
			
			case 'bw':
			case 'begins_with':
			case 'begins with':	$predicate = new Like( QueryFiltersBuilderV2::getPredicateString($arg_sql, $arg_operand_1), QueryFiltersBuilderV2::getPredicateString($arg_sql, $arg_operand_2).'%'); break;
			
			case 'ew':
			case 'ends_with':
			case 'ends with':	$predicate = new Like( QueryFiltersBuilderV2::getPredicateString($arg_sql, $arg_operand_1), '%'.QueryFiltersBuilderV2::getPredicateString($arg_sql, $arg_operand_2) ); break;
			
			case 'contains':	$predicate = new Like( QueryFiltersBuilderV2::getPredicateString($arg_sql, $arg_operand_1), '%'.QueryFiltersBuilderV2::getPredicateString($arg_sql, $arg_operand_2).'%'); break;
			case 'notcontains':	$predicate = new NotLike( QueryFiltersBuilderV2::getPredicateString($arg_sql, $arg_operand_1), '%'.QueryFiltersBuilderV2::getPredicateString($arg_sql, $arg_operand_2).'%'); break;
			
			case 'gt':			$predicate = new Operator($arg_operand_1, Operator::OPERATOR_GREATER_THAN , $arg_operand_2); break;
			case 'ge':			$predicate = new Operator($arg_operand_1, Operator::OPERATOR_GREATER_THAN_OR_EQUAL_TO, $arg_operand_2); break;
			case 'lt':			$predicate = new Operator($arg_operand_1, Operator::OPERATOR_LESS_THAN, $arg_operand_2); break;
			case 'le':			$predicate = new Operator($arg_operand_1, Operator::OPERATOR_LESS_THAN_OR_EQUAL_TO, $arg_operand_2); break;
		}
		if ( is_object($predicate) )
		{
			return Trace::leaveok($context, 'success', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		
		return Trace::leaveko($context, 'failure: bad operator', null, self::$TRACE_FILTERS_BUILDER);
	}
	
	
	
	/**
	 * @brief		Build Xnary operator predicate
	 * @param[in]	arg_sql					query SQL (object)
	 * @param[in]	arg_operator_name		operator name (string)
	 * @param[in]	arg_operand_1			operator operand 1 (ZF2 Predicate)
	 * @param[in]	arg_operands_array		operator operands 2+ (array of ZF2 Predicate instances)
	 * @return		object					ZF2 Predicate instance
	 */
	static public function buildXnaryOperatorPredicate($arg_sql, $arg_operator_name, $arg_operand_1, $arg_operands_array)
	{
		$context = 'QueryFiltersBuilderV2.buildXnaryOperatorPredicate('.$arg_operator_name.')';
		Trace::enter($context, '', self::$TRACE_FILTERS_BUILDER);
		
		
		// INIT
		$predicate = null;
		$arg_operator_name = strtolower($arg_operator_name);
		
		// PREDICATE xNARY OPERATOR
		switch($arg_operator_name)
		{
			case 'in':
			{
				Trace::step($context, 'operator In', self::$TRACE_FILTERS_BUILDER);
				$predicate = new In( QueryFiltersBuilderV2::getPredicateString($arg_sql, $arg_operand_1), $arg_operands_array); break;
				break;
			}
			case 'notin':
			{
				Trace::step($context, 'operator Not In', self::$TRACE_FILTERS_BUILDER);
				$predicate = new NotIn( QueryFiltersBuilderV2::getPredicateString($arg_sql, $arg_operand_1), $arg_operands_array); break;
				break;
			}
			case 'between':
			{
				Trace::step($context, 'operator Between', self::$TRACE_FILTERS_BUILDER);
				if ( count($arg_operands_array) !== 2 )
				{
					return Trace::leaveko($context, 'failure: bad operands count for Between', null, self::$TRACE_FILTERS_BUILDER);
				}
				$predicate = new Between( QueryFiltersBuilderV2::getPredicateString($arg_sql, $arg_operand_1), $arg_operands_array[0]->getLiteral(), $arg_operands_array[1]->getLiteral()); break;
			}
		}
		if ( is_object($predicate) )
		{
			return Trace::leaveok($context, 'success', $predicate, self::$TRACE_FILTERS_BUILDER);
		}
		
		
		return Trace::leaveko($context, 'failure: bad operator', null, self::$TRACE_FILTERS_BUILDER);
	}
}