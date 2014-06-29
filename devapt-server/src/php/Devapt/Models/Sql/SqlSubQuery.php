<?php
/**
 * @file        SqlSubQueryBuilder.php
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
use Zend\Db\Sql\Predicate\Operator as Oper;
use Zend\Db\Sql\Predicate\Like;
use Zend\Db\Sql\Predicate\In;
use Zend\Db\Sql\Predicate\Between;
use Zend\Db\Sql\Predicate\IsNull;
use Zend\Db\Sql\Predicate\IsNotNull;
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\ResultSet\ResultSet;

use \Devapt\Security\DbConnexions;

final class SqlSubQueryBuilder
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
		$context = 'SqlSubQueryBuilder.compileSubSelect';
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
		$field_has_foreign_link	= $arg_field_record['has_foreign_link'];
		// $field_sql_db			= $arg_field_record['sql_db'];
		$field_sql_table		= $arg_field_record['sql_table'];
		$field_sql_column		= $arg_field_record['sql_column'];
		// $field_sql_table_alias	= $field_sql_table.'_0';
		$field_sql_alias		= array_key_exists('sql_alias', $arg_field_record) ? $arg_field_record['sql_alias'] : $field_sql_column;
		$field_sql_is_expr		= $arg_field_record['sql_is_expression'];
		// $field_sql_is_pk		= $arg_field_record['sql_is_primary_key'];
		
		// FIELD HAS FOREIGN LINK
		if ($field_has_foreign_link)
		{
			Trace::step($context, 'field ['.$field_sql_alias.'] has foreign link', self::$TRACE_SUBQUERY_BUILDER);
			
			// BUILD SUB QUERY
			$field_sql_foreign_db			= $arg_field_record['sql_foreign_db'];
			$field_sql_foreign_table		= $arg_field_record['sql_foreign_table'];
			$field_sql_foreign_column		= $arg_field_record['sql_foreign_column'];
			$field_sql_foreign_key			= $arg_field_record['sql_foreign_key'];
			$field_sql_foreign_table_alias	= $arg_field_record['sql_foreign_table_alias'];
			
			$sub_select = $arg_sql->select();
			
			// FILL SELECT
			if ($field_sql_is_expr)
			{
				Trace::step($context, 'field is expression', self::$TRACE_SUBQUERY_BUILDER);
				$sub_select->columns( array($field_sql_alias => new Expr($field_sql_column) ) );
			}
			else
			{
				Trace::step($context, 'field is regular', self::$TRACE_SUBQUERY_BUILDER);
				$sub_select->columns( array($field_sql_alias => $field_sql_foreign_table_alias.'.'.$field_sql_foreign_column ) );
			}
			
			// FILL FROM WITH FOREIGN TABLE
			if ( ! array_key_exists($field_sql_foreign_table_alias, $froms) )
			{
				Trace::step($context, 'add from table', self::$TRACE_SUBQUERY_BUILDER);
				$sub_select->from( array($field_sql_foreign_table_alias => $field_sql_foreign_db.'.'.$field_sql_foreign_table) );
			}
			
			// FILL WHERE
			$sub_select->equalsTo($field_sql_table.'.'.$field_sql_column, $field_sql_foreign_table_alias.'.'.$field_sql_foreign_key);
			
			$expr = new Expr('?', array($sub_select) );
			
			return Trace::leaveok($context, '', $expr, self::$TRACE_SUBQUERY_BUILDER);
		}
		
		return Trace::leaveko($context, 'field has no foreign link', null, self::$TRACE_SUBQUERY_BUILDER);
	}
}