<?php
/**
 * @file        Query.php
 * @brief       Query resource class
 * @details     ...
 * @see			...
 * @ingroup     MODELS
 * @date        2014-02-22
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

// use Devapt\Resources;

/*
QUERY FORMAT :

*/
class Query extends AbstractQuery
{
	// STATIC ATTRIBUTES
	
	/// @brief		trace flag
	static public $TRACE_GENERIC_QUERY = true;
	
	/// @brief		Option : model name (string)
	// static public $OPTION_MODEL_NAME	= "query_name";
	
	/// @brief		Option : model action (string)
	static public $OPTION_ACTION		= "query_action";
	
	/// @brief		Option : one model field name (string)
	static public $OPTION_ONE_FIELD		= "query_one_field";
	
	/// @brief		Option : model fields (string)
	static public $OPTION_FIELDS		= "query_fields";
	
	/// @brief		Option : model filters (string)
	static public $OPTION_FILTERS		= "query_filters";
	
	/// @brief		Option : model orders (string)
	static public $OPTION_ORDERS		= "query_orders";
	
	/// @brief		Option : model groups (string)
	static public $OPTION_GROUPS		= "query_groups";
	
	/// @brief		Option : model slice offset (string)
	static public $OPTION_SLICE_OFFSET	= "query_slice_offset";
	
	/// @brief		Option : model slice length (string)
	static public $OPTION_SLICE_LENGTH	= "query_slice_length";

	
	/// @brief		query operation name (string)
	// protected $query_operation				= null;
	
	/// @brief		query fields names (array of strings)
	// protected $query_fields					= null;
	
	/// @brief		query special field name (array)
	// protected $query_special_field			= null;
	
	/// @brief		query filters (array of records)
	// protected $query_filters				= null;
	
	/// @brief		query orders by (array of records)
	// protected $query_orders_by				= null;
	
	/// @brief		query slice offset (integer)
	// protected $query_slice_offset			= null;
	
	/// @brief		query slice limit (integer)
	// protected $query_slice_limit			= null;
		
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
	
	
	/**
	 * @brief		Constructor
	 * @param[in]	arg_model			model (object)
	 * @param[in]	arg_fieds_array		query fields (array of strings)
	 * @param[in]	arg_type			query type (string)
	 * @return		nothing
	 */
	public function __construct($arg_model, $arg_fieds_array, $arg_type)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_model, $arg_fieds_array, $arg_type);
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
		// CHECK ARGS
		if ( is_null($arg_request) )
		{
			Trace::warning('Query.getRequestValue: bad request object');
			return $arg_default;
		}
		
		// GET 'GET' VALUE
		$value = $arg_request->getQuery($arg_name);
		if ( ! is_null($value) )
		{
			return $value;
		}
		
		// GET 'POST' VALUE
		$value = $arg_request->getQuery($arg_name);
		if ( ! is_null($value) )
		{
			return $value;
		}
		
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
		$values_str = self::getRequestValue($arg_request, $arg_name, $arg_default);
		if ( $values_str === $arg_default )
		{
			return $arg_default;
		}
		
		if ( ! is_string($values_str) || $values_str === '' )
		{
			Trace::warning('Query.getRequestArrayValue: bad value string');
			return null;
		}
		
		$values = explode($arg_array_sep, $values_str);
		return $values;
	}
	
	
	/**
	 * @brief		Build the query from a request (static)
	 * @param[in]	arg_model		model (object)
	 * @param[in]	arg_request		request (object)
	 * @param[in]	arg_id			record id (string|integer)
	 * @return		Query object or null
	 */
	static public function buildFromRequest($arg_model, $arg_request, $arg_id)
	{
		// CHECK ARGS
		if ( is_null($arg_request) )
		{
			Trace::warning('Query.buildFromRequest: bad request object');
			return null;
		}
		
		// GET TYPE
		$type = self::getRequestValue($arg_request, self::$OPTION_ACTION, null);
		if ( is_null($type) )
		{
			// Trace::warning('Query.buildFromRequest: bad query type');
			// return null;
			$type = self::$TYPE_SELECT;
		}
		
		// GET FIELDS
		$fields = self::getRequestArrayValue($arg_request, self::$OPTION_FIELDS, ',', null);
		if ( ! is_array($fields) )
		{
			// Trace::warning('Query.buildFromRequest: bad query fields');
			// return null;
			$fields = array_keys($arg_model->getModelFieldsRecords());
		}
		
		// CREATE QUERY
		$query = new SqlQuery($arg_model, $fields, $type);
		
		// SET RECORD ID
		if ( ! is_null($arg_id) )
		{
			$query->setRecordId($arg_id);
		}
		
		// GET ONE FIELD
		$one_field = self::getRequestValue($arg_request, self::$OPTION_ONE_FIELD, null);
		if ( is_string($one_field) )
		{
			$query->setOneField($one_field);
		}
		
		// GET FILTERS
		$filters = self::getRequestArrayValue($arg_request, self::$OPTION_FILTERS, '|', null);
		if ( is_array($filters) )
		{
			$query->setFilters($filters);
		}
		
		// GET GROUPS
		$groups = self::getRequestArrayValue($arg_request, self::$OPTION_GROUPS, ',', null);
		if ( is_array($groups) )
		{
			$query->setGroups($groups);
		}
		
		// GET ORDERS BY
		$orders_by = self::getRequestArrayValue($arg_request, self::$OPTION_ORDERS, ',', null);
		if ( is_array($orders_by) )
		{
			$query->setOrders($orders_by);
		}
		
		// GET SLICE
		$slice_offset = self::getRequestValue($arg_request, self::$OPTION_SLICE_OFFSET, null);
		$slice_limit = self::getRequestValue($arg_request, self::$OPTION_SLICE_LENGTH, null);
		if ( is_numeric($slice_offset) && is_numeric($slice_limit) )
		{
			$query->setSlice($slice_offset, $slice_limit);
		}
		
		return $query;
	}
	
	
	
	protected function checkAssocValues()
	{
		$context = "GenericQuery.checkAssocValues";
		Trace::enter($context, "", self::$TRACE_GENERIC_QUERY);
		
		
		// CHECK NULL ARRAYS
		if ( is_null($this->input_values) and is_null($this->input_fields) )
		{
			return Trace::leaveok($context, "input_values and input_fields are null", true, self::$TRACE_GENERIC_QUERY);
		}
		if ( is_null($this->input_values) )
		{
			Trace::value($context, "input_fields.count", count($this->input_fields), self::$TRACE_GENERIC_QUERY);
			return Trace::leaveok($context, "input_values is null", true, self::$TRACE_GENERIC_QUERY);
		}
		if ( is_null($this->input_fields) )
		{
			Trace::value($context, "input_values", $this->input_values, self::$TRACE_GENERIC_QUERY);
			return Trace::leaveok($context, "input_fields is null", true, self::$TRACE_GENERIC_QUERY);
		}
		Trace::value($context, "input_values", $this->input_values, self::$TRACE_GENERIC_QUERY);
		
		// GET ARRAYS SIZE
		$input_values_count = count($this->input_values);
		$input_values_keys  = array_keys($this->input_values);
		$input_fields_count = count($this->input_fields);
		Trace::value($context, "input_values_keys", $input_values_keys, self::$TRACE_GENERIC_QUERY);
		Trace::value($context, "input_values_count", $input_values_count, self::$TRACE_GENERIC_QUERY);
		Trace::value($context, "input_fields_count", $input_fields_count, self::$TRACE_GENERIC_QUERY);
		
		// TEST IF THE ARRAY IS INDEXED BY INTEGERS
		$last_index			= $input_values_count - 1;
		$first_key			= $input_values_keys[0];
		$last_key			= $input_values_keys[$last_index];
		Trace::value($context, "last_index",					$last_index, self::$TRACE_GENERIC_QUERY);
		Trace::value($context, "first_key",						$first_key, self::$TRACE_GENERIC_QUERY);
		Trace::value($context, "last_key",						$last_key, self::$TRACE_GENERIC_QUERY);
		Trace::value($context, "first_key == 0",				($first_key == "0")?'OK':'KO', self::$TRACE_GENERIC_QUERY);
		Trace::value($context, "last_key == last_index", 		($last_key == "$last_index")?'OK':'KO', self::$TRACE_GENERIC_QUERY);
		
		$is_indexed_values_array = $first_key == "0" && $last_key == "$last_index";
		Trace::value($context, "is_indexed_values_array", $is_indexed_values_array, self::$TRACE_GENERIC_QUERY);
		
		
		// CHECK VALUES COUNT
		if ($input_values_count == 0 && $input_fields_count == 0)
		{
			return Trace::leaveok($context, "no values to check", true, self::$TRACE_GENERIC_QUERY);
		}
		if ($input_values_count == 0 && $input_fields_count != 0)
		{
			return Trace::leaveko($context, "bad values count ($input_values_count) for fields count ($input_fields_count)", false, self::$TRACE_GENERIC_QUERY);
		}
		
		
		// REMOVE UNUSED PASSWORD VALUES (OLDHASH, NEW, CONFIRM) AND LEAVE NEWHASH
		// INDEXED VALUES ARRAY
		if ($is_indexed_values_array)
		{
			Trace::step($context, "input_values is an indexed array", self::$TRACE_GENERIC_QUERY);
			
			Trace::value($context, "this->input_values before remove unused", $this->input_values, self::$TRACE_GENERIC_QUERY);
			
			$tmp_values = $this->input_values;
			$value_index = 0;
			$this->input_values = array();
			Trace::value($context, "this->input_values", $this->input_values, self::$TRACE_GENERIC_QUERY);
			Trace::value($context, "tmp_values", $tmp_values, self::$TRACE_GENERIC_QUERY);
			foreach($this->input_fields as $field)
			{
				Trace::value($context, "value_index", $value_index == 0 ? "0" : $value_index, self::$TRACE_GENERIC_QUERY);
				Trace::value($context, "field.name", $field->getName(), self::$TRACE_GENERIC_QUERY);
				
				if ($field->getType() == TYPE::$TYPE_PASSWORD)
				{
					// TODO : rework this part (to remove?)
					Trace::step($context, "field type is password", self::$TRACE_GENERIC_QUERY);
					++$value_index;
					++$value_index;
					++$value_index;
				}
				
				Trace::value($context, "field value", $tmp_values[$value_index], self::$TRACE_GENERIC_QUERY);
				$this->input_values[] = $tmp_values[$value_index];
				++$value_index;
			}
			
			Trace::value($context, "this->input_values after remove unused", $this->input_values, self::$TRACE_GENERIC_QUERY);
		}
		// ASSOCIATIVE VALUES ARRAY
		else
		{
			// TODO class_geenric_query checkAssocValues : REMOVE UNUSED PASSWORD VALUES for ASSOCIATIVE ARRAY
			Trace::value($context, "this->input_values remove unused", $this->input_values, self::$TRACE_GENERIC_QUERY);
			
			foreach($this->input_fields as $field)
			{
				if ($field->getType() == TYPE::$TYPE_PASSWORD)
				{
					$field_name = $field->getName();
					unset($this->input_values[$field_name."_oldhash"]);
					unset($this->input_values[$field_name."_new"]);
					unset($this->input_values[$field_name."_confirm"]);
				}
			}
			
			$input_values_count = count($this->input_values);
			$input_values_keys  = array_keys($this->input_values);
			Trace::value($context, "this->input_values remove unused", $this->input_values, self::$TRACE_GENERIC_QUERY);
		}
		
		
		// CHECK VALUES COUNT
		$have_same_count = ($input_values_count > 0 && $input_values_count == $input_fields_count);
		if ($have_same_count)
		{
			// MAKE AN ASSOCIATIVE ARRAY FROM AN INDEXED ARRAY
			if ( $is_indexed_values_array )
			{
				$tmp_values = $this->input_values;
				$tmp_index  = 0;
				$this->input_values = array();
				
				foreach($this->input_fields as $field)
				{
					$this->input_values[$field->getName()] = $tmp_values[$tmp_index];
					$tmp_index += 1;
				}
				
				Trace::value($context, "input_values assoc", $this->input_values, self::$TRACE_GENERIC_QUERY);
				
				return Trace::leaveok($context, "success", true, self::$TRACE_GENERIC_QUERY);
			}
			
			// ASSOCIATIVE VALUES ARRAY : NOTHING TO DO
			return Trace::leaveok($context, "nothing to do for an associative array", true, self::$TRACE_GENERIC_QUERY);
		}
		
		// RESET INPUT VALUES
		$this->input_values = null;
		
		// ALWAYS TRACE THE PROBLEM
		// Trace::addAlertMsg($context, "bad values count ($input_values_count) for fields count ($input_fields_count)", true);
		
		return Trace::leaveko($context, "bad values count ($input_values_count) for fields count ($input_fields_count)", false, self::$TRACE_GENERIC_QUERY);
	}
}
