<?php
/**
 * @file        QueryOperatorBuilder.php
 * @brief       Static class to build SQL expression for operators
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


final class QueryOperatorBuilder
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
	 * @brief		Build a SQL expression for an operator when operands types are unknown
	 * @param[in]	arg_op_type_name		operator type name (string)
	 * @param[in]	arg_op_name				operator name (string)
	 * @param[in]	arg_left				left operand (string|Predicate|Expression)
	 * @param[in]	arg_right				right operand (string|Predicate|Expression)
	 * @return		Expression
	 */
	static public function buildOperatorExpression($arg_op_type_name, $arg_op_name, $arg_left, $arg_right)
	{
		$context = 'QueryOperatorBuilder.buildOperatorSqlExpression';
		Trace::enter($context, '', self::$TRACE_BUILDER);
		
		
		$predicate = null;
		
		switch( strtolower($arg_op_type_name) )
		{
			case 'string':
			{
				Trace::step($context, 'filter type is string', self::$TRACE_BUILDER);
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
				Trace::step($context, 'filter type is boolean', self::$TRACE_BUILDER);
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
				Trace::step($context, 'filter type is number or date', self::$TRACE_BUILDER);
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
							Trace::step($context, 'filter between operator', self::$TRACE_BUILDER);
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
				return Trace::leaveko($context, 'filter bad type ['.$filter_type.']', null, self::$TRACE_BUILDER);
		}
		
		if ( is_null($predicate) )
		{
			Trace::step($context, 'filter typed operator not found, search no typed operators', self::$TRACE_BUILDER);
			$right_value = (is_array($arg_right) && count($arg_right) > 0) ? $arg_right[0] : null;
			if ( ! is_null($right_value) )
			{
				Trace::step($context, 'filter has right value', self::$TRACE_BUILDER);
				switch( strtolower($arg_op_name) )
				{
					case 'equals':		$predicate = new Expr('? = ?', $arg_left, $right_value); break;
					case 'notequals':	$predicate = new Expr('? != ?', $arg_left, $right_value); break;
					case 'like':		$predicate = new Expr('? LIKE ?', $arg_left, $right_value); break;
					case 'in':
					{
						Trace::step($context, 'filter in operator', self::$TRACE_BUILDER);
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
						
						$expr_template = '? IN ('.$right_str.')';
						$expr_args = array_merge(array($arg_left), $right_values);
						Trace::value($context, 'expr_template', $expr_template, self::$TRACE_BUILDER);
						Trace::value($context, 'expr_args', $expr_args, self::$TRACE_BUILDER);
						
						$predicate = new Expr($expr_template, $expr_args); break;
					}
				}
			}
			else
			{
				Trace::step($context, 'filter has no right value', self::$TRACE_BUILDER);
				switch( strtolower($arg_op_name) )
				{
					case 'isnull':		$predicate = new Expr('ISNULL(?)', $arg_left); break;
					case 'isnotnull':	$predicate = new Expr('NOT ISNULL(?)', $arg_left); break;
				}
			}
		}
		
		if ( is_null($predicate) )
		{
			return Trace::leaveko($context, 'filter bad type ['.$arg_op_type_name.'] and operator ['.$arg_op_name.']', null, self::$TRACE_BUILDER);
		}
		
		return Trace::leaveok($context, 'success for type ['.$arg_op_type_name.'] and operator ['.$arg_op_name.']', $predicate, self::$TRACE_BUILDER);
	}
	
	
	
	/**
	 * @brief		Build a SQL predicate for an operator when operands types are given
	 * @param[in]	arg_op_type_name		operator type name (string)
	 * @param[in]	arg_op_name				operator name (string)
	 * @param[in]	arg_left				left operand (string|Predicate|Expression)
	 * @param[in]	arg_right				right operand (string|Predicate|Expression)
	 * @return		Predicate
	 */
	static public function buildOperatorPredicate($arg_op_type_name, $arg_op_name, $arg_left, $arg_right, $arg_left_type, $arg_right_type)
	{
		$context = 'QueryOperatorBuilder.buildOperatorPredicate';
		Trace::enter($context, '', self::$TRACE_BUILDER);
		
		
		// INIT
		$predicate = null;
		$left_type = Oper::TYPE_IDENTIFIER;
		$right_type = Oper::TYPE_VALUE;
		if ($arg_left_type !== 'identifier')
		{
			$left_type = Oper::TYPE_VALUE;
		}
		$right_value = (is_array($arg_right) && count($arg_right) === 1) ? $arg_right[0] : null;
		$right_values = (is_array($arg_right) && count($arg_right) > 0) ? $arg_right : null;
		
		
		// UNTYPED UNARY OPERATORS
		if ( is_null($right_value) && is_null($right_values) )
		{
			Trace::step($context, 'untyped unary operator', self::$TRACE_BUILDER);
			switch( strtolower($arg_op_name) )
			{
				case 'isnull':		$predicate = new IsNull($arg_left); break;
				case 'isnotnull':	$predicate = new IsNotNull($arg_left); break;
			}
			
			// UNARY UNTYPED OPERATOR FOUND
			if ( ! is_null($predicate) )
			{
				return Trace::leaveok($context, 'untyped unary operator found for type ['.$arg_op_type_name.'] and operator ['.$arg_op_name.']', $predicate, self::$TRACE_BUILDER);
			}
		}
		
		
		// UNTYPED BINARY OPERATORS
		if ( ! is_null($right_value) )
		{
			Trace::step($context, 'untyped binary operator', self::$TRACE_BUILDER);
			switch( strtolower($arg_op_name) )
			{
				case 'equals':		$predicate = new Oper($arg_left, Oper::OPERATOR_EQUAL_TO, $right_value, $left_type, $right_type); break;
				case 'notequals':	$predicate = new Oper($arg_left, Oper::OPERATOR_NOT_EQUAL_TO, $right_value, $left_type, $right_type); break;
				case 'like':		$predicate = new Like($arg_left, $right_value); break;
			}
			
			// BINARY UNTYPED OPERATOR FOUND
			if ( ! is_null($predicate) )
			{
				return Trace::leaveok($context, 'untyped binary operator found for type ['.$arg_op_type_name.'] and operator ['.$arg_op_name.']', $predicate, self::$TRACE_BUILDER);
			}
		}
		
		
		// UNTYPED OPERATORS WITH MORE THAN TWO OPERANDS
		if ( is_array($right_values) || is_string($right_value) )
		{
			Trace::step($context, 'untyped operator with more than two operands', self::$TRACE_BUILDER);
			
			// BUILD RIGHT OPERANDS ARRAY FROM A STRING
			if ( is_string($right_value) )
			{
				$right_values = explode(',', $right_values);
			}
			
			// CHECK OPERANDS VALUES
			$tmp_array = $right_values;
			$right_values = array();
			foreach($tmp_array as $value)
			{
				if ( is_scalar($value) )
				{
					$right_values[] = $value;
				}
			}
			
			// TEST OPERATOR TYPE NAME
			switch( strtolower($arg_op_name) )
			{
				case 'in':
				{
					Trace::step($context, 'operator IN', self::$TRACE_BUILDER);
					$predicate = new In($arg_left, $right_values); break;
				}
			}
			
			// UNTYPED OPERATOR WITH MORE THAN TWO OPERANDS FOUND
			if ( ! is_null($predicate) )
			{
				return Trace::leaveok($context, 'untyped operator with more than two operands found for type ['.$arg_op_type_name.'] and operator ['.$arg_op_name.']', $predicate, self::$TRACE_BUILDER);
			}
		}
		
		
		// TYPED OPERATORS
		switch( strtolower($arg_op_type_name) )
		{
			case 'string':
			{
				Trace::step($context, 'operator type is string', self::$TRACE_BUILDER);
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
				Trace::step($context, 'operator type is boolean', self::$TRACE_BUILDER);
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
				Trace::step($context, 'operator type is number or date', self::$TRACE_BUILDER);
				
				if ( ! is_null($right_value) )
				{
					switch( strtolower($arg_op_name) )
					{
						case 'gt':			$predicate = new Oper($arg_left, Oper::OPERATOR_GREATER_THAN , $right_value, $left_type, $right_type); break;
						case 'ge':			$predicate = new Oper($arg_left, Oper::OPERATOR_GREATER_THAN_OR_EQUAL_TO, $right_value, $left_type, $right_type); break;
						case 'lt':			$predicate = new Oper($arg_left, Oper::OPERATOR_LESS_THAN, $right_value, $left_type, $right_type); break;
						case 'le':			$predicate = new Oper($arg_left, Oper::OPERATOR_LESS_THAN_OR_EQUAL_TO, $right_value, $left_type, $right_type); break;
					}
				}
				
				if ( is_null($predicate) && is_array($right_values) )
				{
					switch( strtolower($arg_op_name) )
					{
						case 'between':
						{
							Trace::step($context, 'operator BETWEEN', self::$TRACE_BUILDER);
							$operand_1_value = $arg_left;
							$operand_2_value = $right_values[0];
							$operand_3_value = $right_values[1];
							if ( is_scalar($operand_3_value) )
							{
								$predicate = new Between($operand_1_value, $operand_2_value, $operand_3_value); break;
							}
						}
					}
				}
				break;
			}
			
			default:
				return Trace::leaveko($context, 'operator bad type ['.$filter_type.']', null, self::$TRACE_BUILDER);
		}
		
		
		if ( is_null($predicate) )
		{
			return Trace::leaveko($context, 'operator bad type ['.$arg_op_type_name.'] and operator ['.$arg_op_name.']', null, self::$TRACE_BUILDER);
		}
		
		return Trace::leaveok($context, 'success for type ['.$arg_op_type_name.'] and operator ['.$arg_op_name.']', $predicate, self::$TRACE_BUILDER);
	}
}