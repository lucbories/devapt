<?php
/**
 * @file        QueryUnaryOperatorBuilder.php
 * @brief       Static class to build SQL string for unary operator
 * @details     ...
 * @see			...
 * @ingroup     MODELS
 * @date        2014-08-15
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

// ZEND IMPORTS


final class QueryUnaryOperatorBuilder
{
	// STATIC ATTRIBUTES
	static public $TRACE_BUILDER = false;
	
	
	
	/**
	 * @brief		Constructor (private)
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Compile unary operator SQL expression
	 * @param[in]	arg_op_type_name		operator type name (string)
	 * @param[in]	arg_op_name				unary operator name (string)
	 * @param[in]	arg_expr_str			operand (string)
	 * @return		Expression
	 */
	static public function buildOperatorExpression($arg_op_type_name, $arg_op_name, $arg_expr_str)
	{
		$context = 'QueryOperatorBuilder.buildOperatorExpression';
		Trace::enter($context, $arg_op_name, self::$TRACE_BUILDER);
		
		
		// GET OPERATOR STRING
		$op_str = self::buildOperatorString($arg_op_type_name, $arg_op_name, $arg_expr_str);
		
		// BUILD SQL EXPRESSION
		$op_expr = new Expr($op_str);
		
		
		return Trace::leaveok($context, 'success for type ['.$arg_op_type_name.'] and operator ['.$arg_op_name.']', $op_expr, self::$TRACE_BUILDER);
	}
	
	
	
	/**
	 * @brief		Compile unary operator SQL string
	 * @param[in]	arg_op_type_name		operator type name (string)
	 * @param[in]	arg_op_name				unary operator name (string)
	 * @param[in]	arg_expr_str			operand (string)
	 * @return		string
	 */
	static public function buildOperatorString($arg_op_type_name, $arg_op_name, $arg_expr_str)
	{
		$context = 'QueryOperatorBuilder.buildFilterModifier';
		Trace::step($context, $arg_op_name, self::$TRACE_BUILDER);
		
		/*
		Query::$FILTERS_MODIFIERS = array(
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
		Query::$FILTERS_TYPES = array("String", "Integer", "Float", "Date", "Time", "DateTime", "Boolean");
		*/
		
		switch( strtolower($arg_op_name) )
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
}