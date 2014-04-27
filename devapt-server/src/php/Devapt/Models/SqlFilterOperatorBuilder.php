<?php
/**
 * @file        SqlFilterOperatorBuilder.php
 * @brief       Static class to build SQL where parts of a query with filters
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

namespace Devapt\Models;

// DEBUG
use Devapt\Core\Trace;

// SQL
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Create;
use Zend\Db\Sql\Update;
use Zend\Db\Sql\Delete;
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

use \Devapt\Security\DbConnexions;

final class SqlFilterOperatorBuilder
{
	// STATIC ATTRIBUTES
	static public $TRACE_FILTEROP_BUILDER = false;
	
	
	// ATTRIBUTES
	
	
	
	/**
	 * @brief		Constructor (private)
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Compile filter modifier
	 * @param[in]	arg_filter_type_name	filter type name (string)
	 * @param[in]	arg_modifier_name		modifier name (string)
	 * @return		string
	 */
	static public function buildFilterModifier($arg_filter_type_name, $arg_modifier_name, $arg_expr_str)
	{
		$context = 'SqlFilterOperatorBuilder.buildFilterModifier';
		Trace::step($context, $arg_modifier_name, self::$TRACE_FILTEROP_BUILDER);
		
		/*
		static public $FILTERS_MODIFIERS = array(
			"nothing",
			// STRING OPERATORS
			"upper", "lower", "ltrim", "rtrim", "aes_encrypt", "aes_decrypt", "md5",
			// NUMBER OPERATORS
			"abs", "floor",
			// DATE TIME
			"date", "day", "week", "month", "year", "day of week", "day of month", "day of year", "last day of month", "quarter",
			// TIME
			"time", "hour", "minute", "second"
			);
		$FILTERS_TYPES = array("String", "Integer", "Float", "Date", "Time", "DateTime", "Boolean");
		*/
		
		switch( strtolower($arg_modifier_name) )
		{
			// STRING OPERATORS
			case 'upper':				return 'UPPER('.$arg_expr_str.')';
			case 'lower':				return 'LOWER('.$arg_expr_str.')';
			case 'ltrim':				return 'LTRIM('.$arg_expr_str.')';
			case 'rtrim':				return 'RTRIM('.$arg_expr_str.')';
			case 'aes_encrypt':			return 'AES_ENCRYPT('.$arg_expr_str.')';
			case 'aes_decrypt':			return 'AES_DECRYPT('.$arg_expr_str.')';
			case 'md5':					return 'MD5('.$arg_expr_str.')';
			
			// NUMBER OPERATORS
			case 'abs':					return 'ABS('.$arg_expr_str.')';
			case 'floor':				return 'FLOOR('.$arg_expr_str.')';
			
			// DATE OPERATORS (ON DATE OR DATETIME)
			case 'date':				return 'DATE('.$arg_expr_str.')';
			case 'day':					return 'DAY('.$arg_expr_str.')';
			case 'week':				return 'WEEK('.$arg_expr_str.')';
			case 'month':				return 'MONTH('.$arg_expr_str.')';
			case 'year':				return 'YEAR('.$arg_expr_str.')';
			case 'dow':
			case 'day of week':			return 'DAYOFWEEK('.$arg_expr_str.')';
			case 'dom':
			case 'day of month':		return 'DAYOFMONTH('.$arg_expr_str.')';
			case 'doy':
			case 'day of year':			return 'DAYOFYEAR('.$arg_expr_str.')';
			case 'ldom':
			case 'last day of month':	return 'LAST_DAY('.$arg_expr_str.')';
			case 'quarter':				return 'QUARTER('.$arg_expr_str.')';
			
			// TIME OPERATORS (ON DATE OR DATETIME)
			case 'time':				return 'TIME('.$arg_expr_str.')';
			case 'hour':				return 'HOUR('.$arg_expr_str.')';
			case 'minute':				return 'MINUTE('.$arg_expr_str.')';
			case 'second':				return 'SECOND('.$arg_expr_str.')';
		}
		
		return '('.$arg_expr_str.')';
	}
	
	
	
	/**
	 * @brief		Compile filter operator
	 * @param[in]	...				query SQL (object)
	 * @param[in]	...		field record (array)
	 * @return		Predicate
	 */
	static public function buildFilterExprOperator($arg_filter_type_name, $arg_op_name, $arg_left, $arg_right)
	{
		$context = 'SqlFilterOperatorBuilder.buildFilterExprOperator';
		Trace::enter($context, '', self::$TRACE_FILTEROP_BUILDER);
		
		
		$predicate = null;
		
		switch( strtolower($arg_filter_type_name) )
		{
			case 'string':
			{
				Trace::step($context, 'filter type is string', self::$TRACE_FILTEROP_BUILDER);
				$right_value = (is_array($arg_right) && count($arg_right) > 0) ? $arg_right[0] : null;
				if ( ! is_null($right_value) )
				{
					switch( strtolower($arg_op_name) )
					{
						case 'like':			$predicate = new Expr('? LIKE ?', $arg_left, $right_value); break;
						case 'bw':
						case 'begins_with':
						case 'begins with':		$predicate = new Expr('? LIKE ?', $arg_left, $right_value.'%'); break;
						case 'contains':		$predicate = new Expr('? LIKE ?', $arg_left, '%'.$right_value.'%'); break;
						case 'ew':
						case 'ends_with':
						case 'ends with':		$predicate = new Expr('? LIKE ?', $arg_left, '%'.$right_value); break;
						// case 'min length':		$predicate = new Like($arg_left, $right_value); break;		// TODO
						// case 'length between':	$predicate = new Like($arg_left, $right_value); break;		// TODO
					}
				}
				break;
			}
			
			case 'boolean':
			{
				Trace::step($context, 'filter type is boolean', self::$TRACE_FILTEROP_BUILDER);
				switch( strtolower($arg_op_name) )
				{
					case 'istrue':			$predicate = new Expr('? = ?', $arg_left, true); break;
					case 'isfalse':			$predicate = new Expr('? = ?', $arg_left, false); break;
				}
			}
			
			case 'integer':
			case 'float':
			case 'date':
			case 'time':
			case 'datetime':
			{
				Trace::step($context, 'filter type is number or date', self::$TRACE_FILTEROP_BUILDER);
				$right_value = (is_array($arg_right) && count($arg_right) > 0) ? $arg_right[0] : null;
				if ( ! is_null($right_value) )
				{
					switch( strtolower($arg_op_name) )
					{
						case 'gt':			$predicate = new Expr('? > ?', $arg_left, $right_value); break;
						case 'ge':			$predicate = new Expr('? >= ?', $arg_left, $right_value); break;
						case 'lt':			$predicate = new Expr('? < ?', $arg_left, $right_value); break;
						case 'le':			$predicate = new Expr('? <= ?', $arg_left, $right_value); break;
						case 'between':
						{
							Trace::step($context, 'filter between operator', self::$TRACE_FILTEROP_BUILDER);
							$right_value2 = (is_array($arg_right) && count($arg_right) > 1) ? $arg_right[2] : null;
							if ( is_scalar($right_value2) )
							{
								$predicate = new Expr('? BETWEEN ? AND ?', $arg_left, $right_value, $right_value2); break;
							}
						}
					}
				}
				break;
			}
			
			default:
				return Trace::leaveko($context, 'filter bad type ['.$filter_type.']', null, self::$TRACE_FILTEROP_BUILDER);
		}
		
		if ( is_null($predicate) )
		{
			Trace::step($context, 'filter typed operator not found, search no typed operators', self::$TRACE_FILTEROP_BUILDER);
			$right_value = (is_array($arg_right) && count($arg_right) > 0) ? $arg_right[0] : null;
			if ( ! is_null($right_value) )
			{
				Trace::step($context, 'filter has right value', self::$TRACE_FILTEROP_BUILDER);
				switch( strtolower($arg_op_name) )
				{
					case 'equals':		$predicate = new Expr('? = ?', $arg_left, $right_value); break;
					case 'notequals':	$predicate = new Expr('? != ?', $arg_left, $right_value); break;
					case 'like':		$predicate = new Expr('? LIKE ?', $arg_left, $right_value); break;
					case 'in':
					{
						Trace::step($context, 'filter in operator', self::$TRACE_FILTEROP_BUILDER);
						$right_values = array();
						$right_str = '';
						if ( count($arg_right) > 1 )
						{
							foreach($arg_right as $value)
							{
								if ( is_scalar($value) )
								{
									$right_values[] = $value;
									if ($right_str !== '')
									{
										$right_str .= ',';
									}
									$right_str .= '?';
								}
							}
						}
						else
						{
							if ( is_string($right_value) )
							{
								$right_values = explode(',', $right_values);
								$right_str = '?';
								for($i = 1 ; $i < count($right_values) ; $i++)
								{
									$right_str .= ',?';
								}
							}
						}
						$predicate = new Expr('? IN ('.$right_str.')', $arg_left, $right_values); break;
					}
				}
			}
			else
			{
				Trace::step($context, 'filter has no right value', self::$TRACE_FILTEROP_BUILDER);
				switch( strtolower($arg_op_name) )
				{
					case 'isnull':		$predicate = new Expr('ISNULL(?)',$arg_left); break;
					case 'isnotnull':	$predicate = new Expr('NOT ISNULL(?)',$arg_left); break;
				}
			}
		}
		
		if ( is_null($predicate) )
		{
			return Trace::leaveko($context, 'filter bad type ['.$arg_filter_type_name.'] and operator ['.$arg_op_name.']', null, self::$TRACE_FILTEROP_BUILDER);
		}
		
		return Trace::leaveok($context, 'success for type ['.$arg_filter_type_name.'] and operator ['.$arg_op_name.']', $predicate, self::$TRACE_FILTEROP_BUILDER);
	}
	
	
	
	/**
	 * @brief		Compile filter operator
	 * @param[in]	arg_sql				query SQL (object)
	 * @param[in]	arg_field_record	field record (array)
	 * @return		Predicate
	 */
	static public function buildFilterOperator($arg_filter_type_name, $arg_op_name, $arg_left, $arg_right, $arg_left_type, $arg_right_type)
	{
		$context = 'SqlFilterOperatorBuilder.buildFilterOperator';
		Trace::enter($context, '', self::$TRACE_FILTEROP_BUILDER);
		
		
		$predicate = null;
		$left_type = Oper::TYPE_IDENTIFIER;
		$right_type = Oper::TYPE_VALUE;
		if ($arg_left_type !== 'identifier')
		{
			$left_type = Oper::TYPE_VALUE;
		}
		
		
		switch( strtolower($arg_filter_type_name) )
		{
			case 'string':
			{
				Trace::step($context, 'filter type is string', self::$TRACE_FILTEROP_BUILDER);
				$right_value = (is_array($arg_right) && count($arg_right) > 0) ? $arg_right[0] : null;
				if ( ! is_null($right_value) )
				{
					switch( strtolower($arg_op_name) )
					{
						case 'like':			$predicate = new Like($arg_left, $right_value); break;
						case 'bw':
						case 'begins_with':
						case 'begins with':		$predicate = new Like($arg_left, $right_value.'%'); break;
						case 'contains':		$predicate = new Like($arg_left, '%'.$right_value.'%'); break;
						case 'ew':
						case 'ends_with':
						case 'ends with':		$predicate = new Like($arg_left, '%'.$right_value); break;
						// case 'min length':		$predicate = new Like($arg_left, $right_value); break;		// TODO
						// case 'length between':	$predicate = new Like($arg_left, $right_value); break;		// TODO
					}
				}
				break;
			}
			
			case 'boolean':
			{
				Trace::step($context, 'filter type is boolean', self::$TRACE_FILTEROP_BUILDER);
				switch( strtolower($arg_op_name) )
				{
					case 'istrue':			$predicate = new Oper($arg_left, Oper::OPERATOR_EQUAL_TO, true, $left_type, $right_type); break;
					case 'isfalse':			$predicate = new Oper($arg_left, Oper::OPERATOR_EQUAL_TO, false, $left_type, $right_type); break;
				}
			}
			
			case 'integer':
			case 'float':
			case 'date':
			case 'time':
			case 'datetime':
			{
				Trace::step($context, 'filter type is number or date', self::$TRACE_FILTEROP_BUILDER);
				$right_value = (is_array($arg_right) && count($arg_right) > 0) ? $arg_right[0] : null;
				if ( ! is_null($right_value) )
				{
					switch( strtolower($arg_op_name) )
					{
						case 'gt':			$predicate = new Oper($arg_left, Oper::OPERATOR_GREATER_THAN , $right_value, $left_type, $right_type); break;
						case 'ge':			$predicate = new Oper($arg_left, Oper::OPERATOR_GREATER_THAN_OR_EQUAL_TO, $right_value, $left_type, $right_type); break;
						case 'lt':			$predicate = new Oper($arg_left, Oper::OPERATOR_LESS_THAN, $right_value, $left_type, $right_type); break;
						case 'le':			$predicate = new Oper($arg_left, Oper::OPERATOR_LESS_THAN_OR_EQUAL_TO, $right_value, $left_type, $right_type); break;
						case 'between':
						{
							Trace::step($context, 'filter between operator', self::$TRACE_FILTEROP_BUILDER);
							$right_value2 = (is_array($arg_right) && count($arg_right) > 1) ? $arg_right[2] : null;
							if ( is_scalar($right_value2) )
							{
								$predicate = new Between($arg_left, $right_value, $right_value2); break;
							}
						}
					}
				}
				break;
			}
			
			default:
				return Trace::leaveko($context, 'filter bad type ['.$filter_type.']', null, self::$TRACE_FILTEROP_BUILDER);
		}
		
		if ( is_null($predicate) )
		{
			Trace::step($context, 'filter typed operator not found, search no typed operators', self::$TRACE_FILTEROP_BUILDER);
			$right_value = (is_array($arg_right) && count($arg_right) > 0) ? $arg_right[0] : null;
			if ( ! is_null($right_value) )
			{
				Trace::step($context, 'filter has right value', self::$TRACE_FILTEROP_BUILDER);
				switch( strtolower($arg_op_name) )
				{
					case 'equals':		$predicate = new Oper($arg_left, Oper::OPERATOR_EQUAL_TO, $right_value, $left_type, $right_type); break;
					case 'notequals':	$predicate = new Oper($arg_left, Oper::OPERATOR_NOT_EQUAL_TO, $right_value, $left_type, $right_type); break;
					case 'like':		$predicate = new Like($arg_left, $right_value); break;
					case 'in':
					{
						Trace::step($context, 'filter in operator', self::$TRACE_FILTEROP_BUILDER);
						$right_values = array();
						if ( count($arg_right) > 1 )
						{
							foreach($arg_right as $value)
							{
								if ( is_scalar($value) )
								{
									$right_values[] = $value;
								}
							}
						}
						else
						{
							if ( is_string($right_value) )
							{
								$right_values = explode(',', $right_values);
							}
						}
						$predicate = new In($arg_left, $right_values); break;
					}
				}
			}
			else
			{
				Trace::step($context, 'filter has no right value', self::$TRACE_FILTEROP_BUILDER);
				switch( strtolower($arg_op_name) )
				{
					case 'isnull':		$predicate = new IsNull($arg_left); break;
					case 'isnotnull':	$predicate = new IsNotNull($arg_left); break;
				}
			}
		}
		
		if ( is_null($predicate) )
		{
			return Trace::leaveko($context, 'filter bad type ['.$arg_filter_type_name.'] and operator ['.$arg_op_name.']', null, self::$TRACE_FILTEROP_BUILDER);
		}
		
		return Trace::leaveok($context, 'success for type ['.$arg_filter_type_name.'] and operator ['.$arg_op_name.']', $predicate, self::$TRACE_FILTEROP_BUILDER);
	}
}