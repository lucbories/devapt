<?php
/**
 * @file        AbstratQuery.php
 * @brief       Query base class
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

abstract class AbstractQuery
{
	// ATTRIBUTES
	static public $TYPE_INSERT				= "insert";
	static public $TYPE_INSERT_IGNORE		= "insert_ignore";
	static public $TYPE_REPLACE				= "replace";
	static public $TYPE_SELECT				= "select";
	static public $TYPE_SELECT_DISTINCT		= "select_distinct";
	static public $TYPE_SELECT_DISTINCT_ONE	= "select_distinct_one";
	static public $TYPE_SELECT_COUNT		= "select_count";
	static public $TYPE_UPDATE				= "update";
	static public $TYPE_DELETE				= "delete";
	static public $TYPE_DELETE_ALL			= "delete_all";
	
	static public $OPTION_CREATE_TYPES		= null;
	static public $OPTION_READ_TYPES		= null;
	static public $OPTION_UPDATE_TYPES		= null;
	static public $OPTION_DELETE_TYPES		= null;
	
	static public $OPTION_TYPE				= "type";
	static public $OPTION_FIELDS			= "fields";
	static public $OPTION_CRUD_DB			= "crud_db";
	static public $OPTION_CRUD_TABLE		= "crud_table";
	static public $OPTION_FILTERS			= "filters";
	static public $OPTION_ORDERS			= "orders";
	static public $OPTION_GROUPS			= "groups";
	static public $OPTION_VALUES			= "values";
	
	static public $OPTION_SLICE_BEGIN		= "begin";
	static public $OPTION_SLICE_END			= "end";
	static public $OPTION_SLICE_OFFSET		= "offset";
	static public $OPTION_SLICE_LENGTH		= "length";
	
	
	protected $is_compiled		= false;
	protected $compiled_sql		= null;
	protected $error_msg		= null;
	
	protected $model			= null;
	
	// protected $fields_array		= null;
	protected $type				= null;
	
	protected $input_joins		= null;
	protected $input_crud_db	= null;
	protected $input_crud_table	= null;
	protected $input_one_field	= null;
	protected $input_fields		= null;
	protected $input_values		= null;
	protected $input_filters	= null;
	protected $input_groups		= null;
	protected $input_orders		= null;
	protected $input_slice		= null;
	
	protected $record_id		= null;
	
	
	
	/**
	 * @brief		Constructor
	 * @param[in]	arg_model			model (object)
	 * @param[in]	arg_fieds_array		query fields (array of strings)
	 * @param[in]	arg_type			query type (string)
	 * @return		nothing
	 */
	public function __construct($arg_model, $arg_fields_array, $arg_type)
	{
		$this->input_fields = $arg_fields_array;
		$this->type  = $arg_type;
		$this->model = $arg_model;
		
		if ( is_null(self::$OPTION_CREATE_TYPES) )
		{
			self::$OPTION_CREATE_TYPES	= array(AbstractQuery::$TYPE_INSERT, AbstractQuery::$TYPE_INSERT_IGNORE, AbstractQuery::$TYPE_REPLACE);
			self::$OPTION_READ_TYPES	= array(AbstractQuery::$TYPE_SELECT, AbstractQuery::$TYPE_SELECT_DISTINCT, AbstractQuery::$TYPE_SELECT_DISTINCT_ONE, AbstractQuery::$TYPE_SELECT_COUNT);
			self::$OPTION_UPDATE_TYPES	= array(AbstractQuery::$TYPE_UPDATE);
			self::$OPTION_DELETE_TYPES	= array(AbstractQuery::$TYPE_DELETE, AbstractQuery::$TYPE_DELETE_ALL);
		}
	}
	
	
	// ATTRIBUTES
	public function getFieldsSet()
	{
		return $this->input_fields;
	}
	
	public function getType()
	{
		return $this->type;
	}
	
	public function setRecordId($arg_id)
	{
		$this->is_compiled		= false;
		$this->record_id		= $arg_id;
	}
	
	public function setJoins($arg_joins)
	{
		$this->is_compiled		= false;
		$this->input_joins		= $arg_joins;
	}
	
	public function setCrudTable($arg_crud_db, $arg_crud_table)
	{
		$this->is_compiled		= false;
		$this->input_crud_db	= $arg_crud_db;
		$this->input_crud_table	= $arg_crud_table;
	}
	
	public function setOneField($arg_field)
	{
		$this->is_compiled  = false;
		$this->input_one_field = $arg_field;
	}
	
	public function setFields($arg_fields)
	{
		$this->is_compiled  = false;
		$this->input_fields = $arg_fields;
	}
	
	public function getFields()
	{
		return $this->input_fields;
	}
	
	public function setValues($arg_values)
	{
		$this->is_compiled  = false;
		$this->input_values = $arg_values;
		
		// REPLACE PREDEFINED VALUES
		if ( is_array($this->input_values) )
		{
			foreach($this->input_values as $key=>$value)
			{
				if ( is_string($value) )
				{
					$this->input_values[$key] = PredefinedInputs::getInput($value, $value);
				}
			}
		}
	}
	
	public function getValues()
	{
		return $this->input_values;
	}
	
	public function setFilters($arg_filters)
	{
		$this->is_compiled  = false;
		$this->input_filters = $arg_filters;
	}
	
	public function setOrders($arg_orders)
	{
		$this->is_compiled  = false;
		$this->input_orders = $arg_orders;
	}
	
	public function setGroups($arg_groups)
	{
		$this->is_compiled  = false;
		$this->input_groups = $arg_groups;
	}
	
	public function setSlice($arg_slice_offset, $arg_slice_length)
	{
		if ( is_null($arg_slice_offset) or is_null($arg_slice_length) )
		{
			return;
		}
		$this->is_compiled  = false;
		$this->input_slice = array("offset"=>$arg_slice_offset, "length"=>$arg_slice_length);
	}
	
	
	// COMPILER
	public function checkType($arg_action)
	{
		if ($arg_action == "create")
		{
			return in_array($this->type, self::$OPTION_CREATE_TYPES);
		}
		if ($arg_action == "read")
		{
			return in_array($this->type, self::$OPTION_READ_TYPES);
		}
		if ($arg_action == "update")
		{
			return in_array($this->type, self::$OPTION_UPDATE_TYPES);
		}
		if ($arg_action == "delete")
		{
			return in_array($this->type, self::$OPTION_DELETE_TYPES);
		}
		return false;
	}
	
	public function isValid()
	{
		if ( in_array($this->type, self::$OPTION_CREATE_TYPES) )
		{
			if ( is_null($this->input_fields) )
			{
				return Trace::leaveko("AbstractQuery.isValid", "CREATE action : no fields found", false);
			}
			if ( is_null($this->input_values) )
			{
				return Trace::leaveko("AbstractQuery.isValid", "CREATE action : no values found", false);
			}
		}
		if ( in_array($this->type, self::$OPTION_READ_TYPES) )
		{
			if ( is_null($this->input_fields) )
			{
				return Trace::leaveko("AbstractQuery.isValid", "READ action : no fields found", false);
			}
		}
		if ( in_array($this->type, self::$OPTION_UPDATE_TYPES) )
		{
			if ( is_null($this->input_fields) )
			{
				return Trace::leaveko("AbstractQuery.isValid", "UPDATE action : no fields found", false);
			}
			if ( is_null($this->input_values) )
			{
				return Trace::leaveko("AbstractQuery.isValid", "UPDATE action : no values found", false);
			}
		}
		if ( $this->type == AbstractQuery::$TYPE_DELETE )
		{
			if ( is_null($this->input_filters) )
			{
				return Trace::leaveko("AbstractQuery.isValid", "DELETE action : no filters found", false);
			}
		}
		
		if ( ! $this->is_compiled )
		{
			$this->compile();
		}
		
		return ! is_null($this->compiled_sql);
	}
	
	public function getError()
	{
		return is_null($this->error_msg) ? "Unknow error" : $this->error_msg;
	}
	
	// public function getSQL()
	// {
		// $context = "AbstractQuery.getSQL()";
		
		// if ( ! $this->is_compiled )
		// {
			// $this->compile();
		// }
		
		// Trace::value($context, "compiled_sql", $this->compiled_sql, true);
		// return $this->compiled_sql;
	// }
	
	
	public function setOptions($arg_options)
	{
		if ( is_null($arg_options) )
		{
			return;
		}
		
		// GET TYPE OF THE QUERY
		if ( array_key_exists(self::$OPTION_TYPE, $arg_options) )
		{
			$type = $arg_options[self::$OPTION_TYPE];
			if ( ! is_null($type) )
			{
				$this->type = $type;
			}
		}
		
		// GET CRUD DB AND TABLE
		$crud_db = null;
		$crud_table = null;
		if ( array_key_exists(self::$OPTION_CRUD_DB, $arg_options) )
		{
			$crud_db = $arg_options[self::$OPTION_CRUD_DB];
		}
		if ( array_key_exists(self::$OPTION_CRUD_TABLE, $arg_options) )
		{
			$crud_table = $arg_options[self::$OPTION_CRUD_TABLE];
		}
		if ( ! is_null($crud_db) and ! is_null($crud_table) )
		{
			$this->setCrudTable($crud_db, $crud_table);
		}
		
		// GET INDEXED ARRAY OF FIELDS
		if ( array_key_exists(self::$OPTION_FIELDS, $arg_options) )
		{
			$fields = $arg_options[self::$OPTION_FIELDS];
			if ( ! is_null($fields) )
			{
				if ( ! is_array($fields) )
				{
					$fields = array( $fields );
				}
				$this->setFields($fields);
			}
		}
		
		// GET INDEXED ARRAY OF VALUES
		if ( array_key_exists(self::$OPTION_VALUES, $arg_options) )
		{
			$values = $arg_values;
			if (! is_array($arg_values) )
			{
				$values = array($arg_values);
			}
			$this->setValues($values);
		}
		
		// SLICE WITH BEGIN AND END
		if ( array_key_exists(self::$OPTION_SLICE_BEGIN, $arg_options) and array_key_exists(self::$OPTION_SLICE_END, $arg_options) )
		{
			$begin = $arg_options[self::$OPTION_SLICE_BEGIN];
			$end   = $arg_options[self::$OPTION_SLICE_END];
			$offset= $arg_begin;
			$length= $arg_end - $arg_begin;
			if ( ! is_null($offset) and ! is_null($length) and $offset >= 0 and $length > 0)
			{
				$this->setSlice($offset, $length);
			}
		}
		
		// SLICE WITH OFFSET AND LENGTH
		if ( array_key_exists(self::$OPTION_SLICE_OFFSET, $arg_options) and array_key_exists(self::$OPTION_SLICE_LENGTH, $arg_options) )
		{
			$offset = $arg_options[self::$OPTION_SLICE_OFFSET];
			$length = $arg_options[self::$OPTION_SLICE_LENGTH];
			if ( ! is_null($offset) and ! is_null($length) and $offset >= 0 and $length > 0)
			{
				$this->setSlice($offset, $length);
			}
		}
		
		// GET INDEXED ARRAY OF ORDERS
		if ( array_key_exists(self::$OPTION_ORDERS, $arg_options) )
		{
			$orders = $arg_options[self::$OPTION_ORDERS];
			if ( ! is_null($orders) )
			{
				if ( ! is_array($orders) )
				{
					$orders = array( $orders );
				}
				$this->setOrders($orders);
			}
		}
		
		// GET INDEXED ARRAY OF GROUPS
		if ( array_key_exists(self::$OPTION_GROUPS, $arg_options) )
		{
			$groups = $arg_options[self::$OPTION_GROUPS];
			if ( ! is_null($groups) )
			{
				if ( ! is_array($groups) )
				{
					$groups = array( $groups );
				}
				$this->setGroups($groups);
			}
		}
		
		// GET INDEXED ARRAY OF FILTERS
		if ( array_key_exists(self::$OPTION_FILTERS, $arg_options) )
		{
			$filters = $arg_options[self::$OPTION_FILTERS];
			if ( ! is_null($filters) )
			{
				if ( ! is_array($filters) )
				{
					$filters = array( $filters );
				}
				$this->setFilters($filters);
			}
		}
	}
	
	public function addValuesFilter($arg_fields, $arg_values)
	{
		$context = "AbstractQuery.addValuesFilter";
		
		$fields = null;
		$values = null;
		
		// CHECK ARGS
		if ( is_null($this->input_fields) )
		{
			return leaveko($context, "fields query input is null", false);
		}
		if ( is_null($arg_fields) )
		{
			return leaveko($context, "fields arg is null", false);
		}
		if ( is_null($arg_values) )
		{
			return leaveko($context, "values arg is null", false);
		}
		
		if ( is_array($arg_fields) and ! is_array($arg_values) )
		{
			return leaveko($context, "fields is array but not values", false);
		}
		
		if ( ! is_array($arg_fields) and is_array($arg_values) )
		{
			return leaveko($context, "values is array but not fields", false);
		}
		
		
		if ( is_array($arg_fields) and is_array($arg_values) )
		{
			if ( count($arg_fields) != count($arg_values) )
			{
				return leaveko($context, "bad arrays items counts", false);
			}
			$fields = $arg_fields;
			$values = $arg_values;
			
//			Trace::value($context, "arg_fields and arg_values are arrays");
		}
		if ( ! is_array($arg_fields) and ! is_array($arg_values) )
		{
			$fields = array($arg_fields);
			$values = array($arg_values);
			
//			Trace::value($context, "arg_fields and arg_values are not arrays");
		}
		
//		Trace::value($context, "fields.count", count($fields));
//		Trace::value($context, "values.count", count($values));
//		Trace::value($context, "values", $values);
		
		
		// GET FIELDS NAMES
		$fields_names = array();
		foreach($fields as $field)
		{
			$field_name = null;
			if ($field instanceof AbsractField)
			{
				$field_name = $field->getName();
			}
			else
			{
				$field_name = strval($field);
			}
			
			$fields_names[] = $field_name;
		}
		
		// LOOP ON VALUES
		$index = 0;
		foreach($values as $value)
		{
			$field_name = $fields_names[$index];
			$bool_result = (boolean) $this->addValueFilter($field_name, $value);
			if ( ! $bool_result)
			{
				$str_value = strval($value);
				return leaveko($context, "add filter failed for [$field_name] [$str_val]", false);
			}
			
//			Trace::value($context, "filter added at $index = ($field_name, $value)");
			$index++;
		}
		
		return true;
	}
	
	public function addValueFilter($arg_field_name, $arg_field_value)
	{
		if ( is_null($this->input_filters) )
		{
			$this->input_filters = array();
		}
		$this->input_filters[] = new Filter("", "and", $arg_field_name, "String", null, "equals", $arg_field_value, null);
		return true;
	}
	
	// abstract protected function compile();
	
	
	public function dump()
	{
		$buffer_str = "QUERY[ <BR>\n";
		$buffer_str .= "(is_compiled=".$this->is_compiled.")<BR>\n";
		$buffer_str .= "(compiled_sql=".$this->compiled_sql.")<BR>\n";
		$buffer_str .= "(error_msg=".$this->error_msg.")<BR>\n";
		$buffer_str .= "(fields_array.fields_count=".count( $this->fields_array->getFields() ).")<BR>\n";
		$buffer_str .= "(type=".$this->type.")<BR>\n";
		$buffer_str .= "(input_joins.count=".count($this->input_joins).")<BR>\n";
		$buffer_str .= "(input_crud_db=".$this->input_crud_db.")<BR>\n";
		$buffer_str .= "(input_crud_table=".$this->input_crud_table.")<BR>\n";
		
		// DUMP FIELDS
		if ( is_null($this->input_fields) )
		{
			$buffer_str .= "(input_fields is null)<BR>\n";
		}
		else
		{
			$buffer_str .= "input_fields[ <BR>\n";
			foreach($this->input_fields as $key=>$value)
			{
				$str_value = $value;
				if ( $value instanceof AbstractField )
				{
					$str_value = $value->getName();
				}
				$buffer_str .= "(".$key."=".$str_value.")<BR>\n";
			}
			$buffer_str .= " ]<BR>\n";
		}
		
		// DUMP VALUES
		if ( is_null($this->input_values) )
		{
			$buffer_str .= "(input_values is null)<BR>\n";
		}
		else
		{
			$buffer_str .= "input_values[ <BR>\n";
			foreach($this->input_values as $key=>$value)
			{
				$buffer_str .= "(".$key."=".$value.")<BR>\n";
			}
			$buffer_str .= " ]<BR>\n";
		}
		
		// DUMP FILTERS
		if ( is_null($this->input_filters) )
		{
			$buffer_str .= "(input_filters is null)<BR>\n";
		}
		else
		{
			$buffer_str .= "input_filters[ <BR>\n";
			foreach($this->input_filters as $key=>$value)
			{
				$buffer_str .= "(".$key."=".$value->getURLAttributes().")<BR>\n";
			}
			$buffer_str .= " ]<BR>\n";
		}
		
		// DUMP ORDERS
		if ( is_null($this->input_orders) )
		{
			$buffer_str .= "(input_orders is null)<BR>\n";
		}
		else
		{
			$buffer_str .= "input_orders[ <BR>\n";
			foreach($this->input_orders as $key=>$value)
			{
				$buffer_str .= "(".$key."=".$value->getURLAttributes().")<BR>\n";
			}
			$buffer_str .= " ]<BR>\n";
		}
		
		// TODO : DUMP GROUPS
		
		// DUMP SLICE
		if ( is_null($this->input_slice) )
		{
			$buffer_str .= "(input_slice is null)<BR>\n";
		}
		else
		{
			$buffer_str .= "input_slice[ <BR>\n";
			$buffer_str .= http_build_query( $this->input_slice );
			$buffer_str .= " ]<BR>\n";
		}
		
		$buffer_str .= " ]<BR>\n";
		
		return $buffer_str;
	}
}
