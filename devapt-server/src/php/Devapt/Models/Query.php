<?php
/**
 * @file        Query.php
 * @brief       Get and map model Query content from a Request or an array
 * @details     A Query contains
 *					- query_type (string): kind of the query (select, select_one, select_distinct, insert...)
 *					- query_fields (array of string): fields names used by the query
 *					- query_field_one (string): field name for query using only one field
 *					- query_record_id (string): record id for query using only one record
 *					- query_values (assoc array of string=>string): fields values for insert, update or filtering on this values
 *					- query_orders (array of arrays): 'order by' clauses as ordered length 2 arrays as 0:field name 1:'ASC' or 'DESC'
 *					- query_groups (array of string): 'group by' clauses as ordered fields names
 *					- query_slice_offset (integer): offset clause
 *					- query_slice_length (integer): length clause
 *					- query_joins (array of assoc arrays): ordered arrayof join records (record format is depending on data engine)
 * @ingroup     MODELS
 * @date        2014-02-22
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

namespace Devapt\Models;

// ZEND IMPORTS
use Zend\Json\Json as JsonFormatter;

// DEVAPT IMPORTS
use Devapt\Core\Trace;

class Query extends AbstractQuery
{
	// STATIC ATTRIBUTES
	
	/// @brief		trace flag
	static public $TRACE_QUERY = true;
	
	static public $FILTERS_GROUP_OPERATORS	= array('', '(', ')');
	static public $FILTERS_GROUP_ENTER		= '(';
	static public $FILTERS_GROUP_LEAVE		= ')';
	
	static public $FILTERS_JOIN_OPERATORS	= array('', 'and', 'or');
	static public $FILTERS_JOIN_AND			= 'and';
	static public $FILTERS_JOIN_OR			= 'or';
	
	static public $FILTERS_TYPES = array("String", "Integer", "Float", "Date", "Time", "DateTime", "Boolean");
	
	static public $FILTERS_OPERATORS = array(
		// ALL TYPES OPERATORS
		"equals", "notequals", "isnull", "isnotnull",
		// STRING OPERATORS
		"bw", "begins_with", "begins with", "contains", "ew", "ends_with", "ends with", "min length", "max length", "length between", "in",
		// NUMBER OPERATORS
		"gt", "ge", "lt", "le", "between"
		);
	static public $FILTERS_MODIFIERS = array(
		"nothing",
		// STRING OPERATORS
		"upper", "lower", "ltrim", "rtrim", "aes_encrypt", "aes_decrypt", "md5",
		// NUMBER OPERATORS
		"abs", "floor",
		// DATE TIME
		"date", "day", "week", "month", "year", "day of week", "day of month", "day of year", "last day of month", "quarter",
		// DATE TIME
		"time", "hour", "minute", "second"
		);
	
	
	// INSTANCE ATTRIBUTES
	
	
	
	/**
	 * @brief		Constructor
	 * @param[in]	arg_action		action name: create/read/update/delete
	 * @return		nothing
	 */
	public function __construct($arg_action)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_action);
	}
	
	
	
	
	/**
	 * @brief		Get a request value (static)
	 * @param[in]	arg_request		request (object)
	 * @param[in]	arg_name		value name (string)
	 * @param[in]	arg_default		value default (anything)
	 * @return		anything
	 */
	static public function getRequestValue($arg_request, $arg_name, $arg_default)
	{
		$context = 'Query::getRequestValue(request,name,default)';
		
		
		// CHECK ARGS
		if ( ! is_string($arg_name) )
		{
			Trace::warning('Query.getRequestValue: bad value name');
			Trace::step($context, 'bad value name', self::$TRACE_QUERY);
			return $arg_default;
		}
		if ( ! is_object($arg_request) )
		{
			Trace::warning('Query.getRequestValue: bad request object');
			Trace::step($context, 'bad request object for ['.$arg_name.']', self::$TRACE_QUERY);
			return $arg_default;
		}
		
		// GET 'GET' VALUE
		$value = $arg_request->getQuery($arg_name, $arg_default);
		if ( ! is_null($value) )
		{
			Trace::step($context, 'get GET value for ['.$arg_name.']', self::$TRACE_QUERY);
			return $value;
		}
		
		// GET 'POST' VALUE
		$value = $arg_request->getPost($arg_name, $arg_default);
		if ( ! is_null($value) )
		{
			Trace::step($context, 'get POST value for ['.$arg_name.']', self::$TRACE_QUERY);
			return $value;
		}
		
		
		Trace::step($context, 'get default value for ['.$arg_name.']', self::$TRACE_QUERY);
		return $arg_default;
	}
	
	
	
	/**
	 * @brief		Get a request array value (static)
	 * @param[in]	arg_request		request (object)
	 * @param[in]	arg_name		value name (string)
	 * @param[in]	arg_array_sep	array separator (string)
	 * @param[in]	arg_default		value default (anything)
	 * @return		anything
	 */
	static public function getRequestArrayValue($arg_request, $arg_name, $arg_array_sep, $arg_default)
	{
		$context = 'Query::getRequestArrayValue(request,name,sep,default)';
		
		
		// GET STRING VALUE
		$values_str = self::getRequestValue($arg_request, $arg_name, $arg_default);
		
		// TEST IF IT IS DEFAULT VALUE
		if ($values_str === $arg_default)
		{
			Trace::step($context, 'get default value for ['.$arg_name.']', self::$TRACE_QUERY);
			return $arg_default;
		}
		
		// CHECK STRING VALUE
		if ( ! is_string($values_str) || $values_str === '' )
		{
			Trace::warning('Query.getRequestArrayValue: bad value string');
			Trace::step($context, 'bad value for ['.$arg_name.']', self::$TRACE_QUERY);
			return null;
		}
		
		// CREATE ARRAY FROM STRING
		$values = explode($arg_array_sep, $values_str);
		
		
		Trace::step($context, 'get value for ['.$arg_name.']', self::$TRACE_QUERY);
		return $values;
	}
	
	
	
	/**
	 * @brief		Get a request array value from a JSON string(static)
	 * @param[in]	arg_request		request (object)
	 * @param[in]	arg_name		value name (string)
	 * @param[in]	arg_default		value default (anything)
	 * @return		anything
	 */
	static public function getRequestJsonArrayValue($arg_request, $arg_name, $arg_default)
	{
		$context = 'Query::getRequestJsonArrayValue(request,name,sep,default)';
		Trace::enter($context, '', self::$TRACE_QUERY);
		
		
		// GET STRING VALUE
		$values_str = self::getRequestValue($arg_request, $arg_name, $arg_default);
		
		// TEST IF IT IS DEFAULT VALUE
		if ($values_str === $arg_default)
		{
			// PAYLOAD 'CONTENT' VALUE
			$values_str = $arg_request->getContent();
			Trace::value($context, 'request content value for ['.$arg_name.']', $values_str, self::$TRACE_QUERY);
			
			if ( ! is_string($values_str) || $values_str === '')
			{
				return Trace::leaveok($context, 'get default value for ['.$arg_name.']', $arg_default, self::$TRACE_QUERY);
			}
		}
		
		// CHECK STRING VALUE
		if ( ! is_string($values_str) || $values_str === '' )
		{
			Trace::warning('Query.getRequestArrayValue: bad value string');
			return Trace::leaveko($context, 'bad value for ['.$arg_name.']', null, self::$TRACE_QUERY);
		}
		
		// CREATE ARRAY FROM JSON STRING
		$values = JsonFormatter::decode($values_str, JsonFormatter::TYPE_ARRAY);
		Trace::value($context, 'values for ['.$arg_name.']', $values, self::$TRACE_QUERY);
		if ( ! is_array($values) )
		{
			return Trace::leaveko($context, 'JSON decode result is not an array', null, self::$TRACE_QUERY);
		}
		if ( array_key_exists($arg_name, $values) )
		{
			$values = $values[$arg_name];
		}
		
		
		return Trace::leaveok($context, 'get value for ['.$arg_name.']', $values, self::$TRACE_QUERY);
	}
	
	
	
	/**
	 * @brief		Build the query from a request (static)
	 * @param[in]	arg_action		action name: create/read/update/delete
	 * @param[in]	arg_model		model (object)
	 * @param[in]	arg_request		request (object)
	 * @param[in]	arg_id			record id (string|integer)
	 * @return		Query object or null
	 */
	static public function buildFromRequest($arg_action, $arg_model, $arg_request, $arg_id)
	{
		$context = 'Query::buildFromRequest(action,model,request,id)';
		Trace::enter($context, '', self::$TRACE_QUERY);
		
		
		// CHECK ARGS
		if ( ! is_object($arg_model) )
		{
			Trace::warning($context.': bad model object');
			return Trace::leaveko($context, 'bad model object', null, self::$TRACE_QUERY);
		}
		if ( ! is_object($arg_request) )
		{
			Trace::warning($context.': bad request object');
			return Trace::leaveko($context, 'bad request object', null, self::$TRACE_QUERY);
		}
		
		
		// GET QUERY API VERSION
		$api_version = self::getRequestValue($arg_request, self::$OPTION_API_VERSION, '1');
		
		
		// BUILD QUERY
		$query = null;
		switch ($api_version)
		{
			case '1':
			{
				Trace::step($context, 'build V1 query', self::$TRACE_QUERY);
				$query = QueryBuilderV1::buildFromRequest($arg_action, $arg_model, $arg_request, $arg_id);
				break;
			}
			case '2':
			{
				Trace::step($context, 'build V2 query', self::$TRACE_QUERY);
				$query = QueryBuilderV2::buildFromRequest($arg_action, $arg_model, $arg_request, $arg_id);
				break;
			}
		}
		
		
		// CHECK BUILD QUERY
		if ( is_null($query) )
		{
			return Trace::leaveko($context, 'build failed', null, self::$TRACE_QUERY);
		}
		
		
		return Trace::leaveok($context, 'build success', $query, self::$TRACE_QUERY);
	}
	
	
	
	/**
	 * @brief		Build the query from an array (static)
	 * @param[in]	arg_action		action name: create/read/update/delete
	 * @param[in]	arg_model		model (object)
	 * @param[in]	arg_array		settings (array)
	 * @param[in]	arg_id			record id (string|integer)
	 * @return		Query object or null
	 */
	static public function buildFromArray($arg_action, $arg_model, $arg_array, $arg_id)
	{
		$context = 'Query::buildFromArray(action,model,array,id)';
		Trace::enter($context, '', self::$TRACE_QUERY);
		
		// CHECK ARGS
		if ( ! is_object($arg_model) )
		{
			Trace::warning($context.': bad model object');
			return Trace::leaveko($context, 'bad model object', null, self::$TRACE_QUERY);
		}
		if ( ! is_object($arg_request) )
		{
			Trace::warning($context.': bad request object');
			return Trace::leaveko($context, 'bad request object', null, self::$TRACE_QUERY);
		}
		
		
		// GET QUERY API VERSION
		$api_version = array_key_exists(self::$OPTION_API_VERSION, $arg_array) ? $arg_array[self::$OPTION_API_VERSION] : '1';
		
		// BUILD QUERY
		$query = null;
		switch (api_version)
		{
			case '1':
			{
				Trace::step($context, 'build V1 query', self::$TRACE_QUERY);
				$query = QueryBuilderV1::buildFromArray($arg_action, $arg_model, $arg_array, $arg_id);
				break;
			}
			case '2':
			{
				Trace::step($context, 'build V2 query', self::$TRACE_QUERY);
				break;
			}
		}
		
		// CHECK BUILD QUERY
		if ( is_null($query) )
		{
			return Trace::leaveko($context, 'build failed', null, self::$TRACE_QUERY);
		}
		
		return Trace::leaveok($context, 'build success', $query, self::$TRACE_QUERY);
	}
}
