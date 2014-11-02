<?php
/**
 * @file        SqlSubQuery.php
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
use Zend\Db\Sql\Predicate\Operator;
use Zend\Db\Sql\Predicate\Like;
use Zend\Db\Sql\Predicate\In;
use Zend\Db\Sql\Predicate\Between;
use Zend\Db\Sql\Predicate\IsNull;
use Zend\Db\Sql\Predicate\IsNotNull;
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\ResultSet\ResultSet;

use \Devapt\Security\DbConnexions;

final class SqlSubQuery
{
	// STATIC ATTRIBUTES
	static public $TRACE_SUBQUERY_BUILDER = false;
	
	
	// ATTRIBUTES
	
	
	
	/**
	 * @brief		Constructor (private)
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Compile sub SQL select from field
	 * @param[in]	arg_sql				query SQL (object)
	 * @param[in]	arg_field_record	field record (array)
	 * @return		Expression
	 */
	static public function compileSubSelect($arg_sql, $arg_field_record)
	{
		$context = 'SqlSubQuery.compileSubSelect';
		Trace::enter($context, '', self::$TRACE_SUBQUERY_BUILDER);
		
		// CHECK ARGS
		if ( ! is_object($arg_sql) )
		{
			Trace::warning($context.': bad arg : sql object');
			return null;
		}
		if ( ! is_array($arg_field_record) )
		{
			Trace::warning($context.': bad arg : field record array');
			return null;
		}
		
		// GET FIELD ATTRIBUTES
		$field_name				= $arg_field_record['name'];
		
		$field_has_foreign_link	= $arg_field_record['has_foreign_link'];
		
		// $field_sql_db			= $arg_field_record['sql_db'];
		$field_sql_table		= $arg_field_record['sql_table'];
		$field_sql_column		= $arg_field_record['sql_column'];
		// $field_sql_table_alias	= $field_sql_table.'_0';
		$field_sql_alias		= array_key_exists('sql_alias', $arg_field_record) ? $arg_field_record['sql_alias'] : $field_sql_column;
		
		$field_sql_is_expr		= $arg_field_record['sql_is_expression'];
		// $field_sql_is_pk		= $arg_field_record['sql_is_primary_key'];
		
		
		// CHECK EXPRESSION
		if ($field_sql_is_expr)
		{
			Trace::warning($context.': bad field : field is expr');
			return null;
		}
		
		
		// CHECK FOREIGN LINK
		if ( ! $field_has_foreign_link)
		{
			Trace::warning($context.': bad field : field is not a foreign link');
			return Trace::leaveko($context, 'field has no foreign link', null, self::$TRACE_SUBQUERY_BUILDER);
		}
		
		
		// BUID SQL
		Trace::step($context, 'field ['.$field_name.'] has foreign link', self::$TRACE_SUBQUERY_BUILDER);
		
		
		// GET ZF2 SELECT OBJECT
		$sub_select = $arg_sql->select();
		
		
		// GET FIELD FOREIGN ATTRIBUTES
		$field_sql_foreign_db			= $arg_field_record['sql_foreign_db'];
		$field_sql_foreign_table		= $arg_field_record['sql_foreign_table'];
		$field_sql_foreign_column		= $arg_field_record['sql_foreign_column'];
		$field_sql_foreign_key			= $arg_field_record['sql_foreign_key'];
		$field_sql_foreign_table_alias	= $arg_field_record['sql_foreign_table_alias'];
		Trace::value($context, 'field_sql_foreign_db', $field_sql_foreign_db, self::$TRACE_SUBQUERY_BUILDER);
		Trace::value($context, 'field_sql_foreign_table', $field_sql_foreign_table, self::$TRACE_SUBQUERY_BUILDER);
		Trace::value($context, 'field_sql_foreign_column', $field_sql_foreign_column, self::$TRACE_SUBQUERY_BUILDER);
		Trace::value($context, 'field_sql_foreign_key', $field_sql_foreign_key, self::$TRACE_SUBQUERY_BUILDER);
		Trace::value($context, 'field_sql_foreign_table_alias', $field_sql_foreign_table_alias, self::$TRACE_SUBQUERY_BUILDER);
		
		
		/* SQL: (
			SELECT field.foreign_column
			FROM field.foreign_table AS field.foreign_table_alias
			WHERE field.column = field.foreign_table_alias . field.foreign_key
			) AS field.alias
		*/
		
		// BUILD PREDICATE
		$sub_select->columns( array($field_sql_foreign_column => $field_sql_foreign_column ) );
		$sub_select->from( array($field_sql_foreign_table_alias => $field_sql_foreign_table) );
		$arg_operand_1 = $field_sql_table.'.'.$field_sql_column;
		$arg_operand_2 = $field_sql_foreign_table_alias.'.'.$field_sql_foreign_key;
		$type1 = Operator::TYPE_IDENTIFIER;
		$type2 = Operator::TYPE_IDENTIFIER;
		$predicate = new Operator($arg_operand_1, Operator::OPERATOR_EQUAL_TO, $arg_operand_2, $type1, $type2);
		
		
		// BUILD EXPRESSION
		$sub_select->where($predicate);
		$expr = new Expr('?', array($sub_select) );
		
		
		// TRACE
		// $sql = $sub_select->getSqlString(  );
		// Trace::value($context, 'sql', $sql, self::$TRACE_SUBQUERY_BUILDER);
		
		
		return Trace::leaveok($context, '', $expr, self::$TRACE_SUBQUERY_BUILDER);
	}
}