<?php
/**
 * @file        SqlBuilder.php
 * @brief       Static class to build SQL query
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
use Devapt\Models\Query;

// ZEND IMPORTS
use Zend\Db\Sql\Sql;


final class SqlBuilder
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
	 * @brief		Compile SQL select request
	 * @param[in]	arg_sql_engine		SQL engine (object)
	 * @param[in]	arg_query			query (object)
	 * @param[in]	arg_zf2_sql			ZF2 SQL (object)
	 * @return		Expression
	 */
	static public function compileSelect($arg_sql_engine, $arg_query, $arg_zf2_sql)
	{
		return SqlBuilderSelect::compileSelect($arg_sql_engine, $arg_query, $arg_zf2_sql);
	}
	
	
	
	/**
	 * @brief		Compile SQL insert request
	 * @param[in]	arg_sql_engine		SQL engine (object)
	 * @param[in]	arg_query			query (object)
	 * @param[in]	arg_zf2_sql			ZF2 SQL (object)
	 * @return		Expression
	 */
	static public function compileInsert($arg_sql_engine, $arg_query, $arg_zf2_sql)
	{
		return SqlBuilderInsert::compileInsert($arg_sql_engine, $arg_query, $arg_zf2_sql);
	}
	
	
	
	/**
	 * @brief		Compile SQL update request
	 * @param[in]	arg_sql_engine		SQL engine (object)
	 * @param[in]	arg_query			query (object)
	 * @param[in]	arg_zf2_sql			ZF2 SQL (object)
	 * @return		Expression
	 */
	static public function compileUpdate($arg_sql_engine, $arg_query, $arg_zf2_sql)
	{
		return SqlBuilderUpdate::compileUpdate($arg_sql_engine, $arg_query, $arg_zf2_sql);
	}
	
	
	
	/**
	 * @brief		Compile SQL delete request
	 * @param[in]	arg_sql_engine		SQL engine (object)
	 * @param[in]	arg_query			query (object)
	 * @param[in]	arg_zf2_sql			ZF2 SQL (object)
	 * @return		Expression
	 */
	static public function compileDelete($arg_sql_engine, $arg_query, $arg_zf2_sql)
	{
		return SqlBuilderDelete::compileDelete($arg_sql_engine, $arg_query, $arg_zf2_sql);
	}
}