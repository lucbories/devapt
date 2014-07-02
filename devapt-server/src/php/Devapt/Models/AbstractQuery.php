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
 */
namespace Devapt\Models;

// DEVAPT IMPORTS
use Devapt\Core\Trace;
use Devapt\Core\Types;
use Devapt\Resources\Model;

abstract class AbstractQuery
{
	// STATIC ATTRIBUTES
	
	/// @brief TRACE FLAG
	static public $TRACE_ABSTRACT_QUERY		= true;
	
	
	/// @brief		Option : api version (string)
	static public $OPTION_API_VERSION		= "query_api";
	
	/// @brief QUERY TYPE: INSERT
	static public $TYPE_INSERT				= "insert";
	
	/// @brief QUERY TYPE: INSERT IGNORE
	static public $TYPE_INSERT_IGNORE		= "insert_ignore";
	
	/// @brief QUERY TYPE: REPLACE
	static public $TYPE_REPLACE				= "replace";
	
	/// @brief QUERY TYPE: SELECT
	static public $TYPE_SELECT				= "select";
	
	/// @brief QUERY TYPE: SELECT DISTINC
	static public $TYPE_SELECT_DISTINCT		= "select_distinct";
	
	/// @brief QUERY TYPE: SELECT DISTINC ONE
	static public $TYPE_SELECT_DISTINCT_ONE	= "select_distinct_one";
	
	/// @brief QUERY TYPE: SELECT COUNT
	static public $TYPE_SELECT_COUNT		= "select_count";
	
	/// @brief QUERY TYPE: UPDATE
	static public $TYPE_UPDATE				= "update";
	
	/// @brief QUERY TYPE: DELETE
	static public $TYPE_DELETE				= "delete";
	
	/// @brief QUERY TYPE: DELETE ALL
	static public $TYPE_DELETE_ALL			= "delete_all";
	
	
	/// @brief QUERY TYPES NAMES ARRAY FOR CREATE ACTION
	static public $OPTION_CREATE_TYPES		= null;
	
	/// @brief QUERY TYPES NAMES ARRAY FOR READ ACTION
	static public $OPTION_READ_TYPES		= null;
	
	/// @brief QUERY TYPES NAMES ARRAY FOR UPDATE ACTION
	static public $OPTION_UPDATE_TYPES		= null;
	
	/// @brief QUERY TYPES NAMES ARRAY FOR DELETE ACTION
	static public $OPTION_DELETE_TYPES		= null;
	
	
	
	// CLASS ATTRIBUTES
	
	/// @brief QUERY API version
	protected $api_version			= null;
	
	/// @brief QUERY CRUD ACTION (create,read,update,delete)
	protected $query_crud_action	= null;
	
	/// @brief QUERY TYPE (insert, select...)
	protected $query_type			= null;
	
	/// @brief QUERY FIELDS RECORDS
	protected $query_fields			= null;
	
	/// @brief QUERY FIELD NAME FOR ONE FIELD OPERATION
	protected $query_one_field		= null;
	
	/// @brief QUERY ID VALUE FOR ONE RECORD OPERATION
	protected $query_record_id		= null;
	
	/// @brief QUERY FIELDS VALUES
	protected $query_values			= null;
	
	/// @brief QUERY ORDERS RECORDS
	protected $query_orders			= null;
	
	/// @brief QUERY GROUPS FIELDS NAMES
	protected $query_groups			= null;
	
	/// @brief QUERY SLICE OFFSET
	protected $query_slice_offset	= null;
	
	/// @brief QUERY SLICE LENGTH
	protected $query_slice_length	= null;
	
	/// @brief QUERY FILTERS RECORDS
	protected $query_filters		= null;
	
	/// @brief QUERY JOINS TABLES RECORDS
	protected $query_joins			= null;
	
	/// @brief QUERY CUSTOMS
	protected $query_customs		= null;
	
	
	
	/**
	 * @brief		Constructor
	 * @param[in]	arg_action		action name: create/read/update/delete
	 * @return		nothing
	 */
	public function __construct($arg_action)
	{
		// SET CRUD ACTION
		$this->query_crud_action = $arg_action;
		
		// INIT STATIC ARRAYS IF NEEDED
		if ( is_null(self::$OPTION_CREATE_TYPES) )
		{
			self::$OPTION_CREATE_TYPES	= array(AbstractQuery::$TYPE_INSERT, AbstractQuery::$TYPE_INSERT_IGNORE, AbstractQuery::$TYPE_REPLACE);
			self::$OPTION_READ_TYPES	= array(AbstractQuery::$TYPE_SELECT, AbstractQuery::$TYPE_SELECT_DISTINCT, AbstractQuery::$TYPE_SELECT_DISTINCT_ONE, AbstractQuery::$TYPE_SELECT_COUNT);
			self::$OPTION_UPDATE_TYPES	= array(AbstractQuery::$TYPE_UPDATE);
			self::$OPTION_DELETE_TYPES	= array(AbstractQuery::$TYPE_DELETE, AbstractQuery::$TYPE_DELETE_ALL);
		}
	}
	
	
	
	/**
	 * @brief		Get query format version
	 * @return		string		query format version
	 */
	public function getVersion()
	{
		return $this->api_version;
	}
	
	/**
	 * @brief		Set query format version
	 * @param[in]	arg_version		format version (string)
	 * @return		boolean
	 */
	public function setVersion($arg_version)
	{
		$this->api_version = $arg_version;
	}
	
	
	
	/**
	 * @brief		Get query type name
	 * @return		string		query type name
	 */
	public function getType()
	{
		return $this->query_type;
	}
	
	/**
	 * @brief		Set query type name
	 * @param[in]	arg_type_name		type name (string)
	 * @return		boolean
	 */
	public function setType($arg_type_name)
	{
		$context = 'AbstractQuery.setType(type name)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		if ( $this->checkType($this->query_crud_action, $arg_type_name) )
		{
			$this->query_type = $arg_type_name;
			return Trace::leaveok($context, '', true, self::$TRACE_ABSTRACT_QUERY);
		}
		
		return Trace::leaveko($context, 'bad type', false, self::$TRACE_ABSTRACT_QUERY);
	}
	
	
	
	/**
	 * @brief		Get query fields objects
	 * @return		array		array of fields records
	 */
	public function getFields()
	{
		return $this->query_fields;
	}
	
	/**
	 * @brief		Get query fields names
	 * @return		array		array of fields names
	 */
	public function getFieldsNames()
	{
		/*$fields_names = array();
		foreach($this->query_fields as $field_record)
		{
			$fields_names[] = $field_record['name'];
		}
		return $fields_names;
		*/
		return $this->query_fields;
	}
	
	/**
	 * @brief		Set query fields objects
	 * @param[in]	arg_fields_records		query fields (array of field records)
	 * @return		boolean
	 */
	public function setFields($arg_fields_records)
	{
		$context = 'AbstractQuery.setFields(fields records)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		if ( is_array($arg_fields_records) )
		{
			$this->query_fields = $arg_fields_records;
			return Trace::leaveok($context, '', true, self::$TRACE_ABSTRACT_QUERY);
		}
		
		return Trace::leaveko($context, 'fields argument is not an array', false, self::$TRACE_ABSTRACT_QUERY);
	}
	
	/**
	 * @brief		Set query fields objects
	 * @param[in]	arg_fields_names	query fields names (array of field records)
	 * @param[in]	arg_fields_records	query fields records
	 * @return		boolean
	 */
	public function setFieldsWithNames($arg_fields_names, $arg_fields_records)
	{
		$context = 'AbstractQuery.setFieldsWithNames(fields names)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		if ( is_array($arg_fields_names) && is_array($arg_fields_records) )
		{
			$this->query_fields = array();
			// $field_records = $this->model->getModelFieldsRecords();
			foreach($arg_fields_records as $field_name => $field_record)
			{
				if ( in_array($field_name, $arg_fields_names) )
				{
					$this->query_fields[$field_name] = $field_record;
				}
			}
			return Trace::leaveok($context, '', true, self::$TRACE_ABSTRACT_QUERY);
		}
		
		return Trace::leaveko($context, 'fields argument is not an array or model is null', false, self::$TRACE_ABSTRACT_QUERY);
	}
	
	
	
	/**
	 * @brief		Get query field for one field operation
	 * @return		array				field record
	 */
	public function getOneField()
	{
		return $this->query_one_field;
	}
	
	/**
	 * @brief		Set query one field record by name
	 * @param[in]	arg_field_name	field name (string)
	 * @param[in]	arg_fields_records	query fields records
	 * @return		boolean
	 */
	public function setOneFieldName($arg_field_name, $arg_fields_records)
	{
		$context = 'AbstractQuery.setOneFieldName(field name)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		if ( is_string($arg_field_name) && strlen($arg_field_name) > 0 /*&& is_object($this->model)*/ )
		{
			$this->query_one_field = null;
			// $field_records = $this->model->getModelFieldsRecords();
			foreach($arg_fields_records as $field_name => $field_record)
			{
				if ($field_name === $arg_field_name)
				{
					$this->query_one_field	= $field_record;
					return Trace::leaveok($context, '', true, self::$TRACE_ABSTRACT_QUERY);
				}
			}
		}
		
		return Trace::leaveko($context, 'one field name argument is not an not empty string', false, self::$TRACE_ABSTRACT_QUERY);
	}
	
	/**
	 * @brief		Set query one field record
	 * @param[in]	arg_field_record	field record (array)
	 * @return		boolean
	 */
	public function setOneField($arg_field_record)
	{
		$context = 'AbstractQuery.setOneField(record)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		if ( is_array($arg_field_record) && count($arg_field_record) > 0 )
		{
			$this->query_one_field	= $arg_field_record;
			return Trace::leaveok($context, '', true, self::$TRACE_ABSTRACT_QUERY);
		}
		
		return Trace::leaveko($context, 'one field argument is not an array', false, self::$TRACE_ABSTRACT_QUERY);
	}
	
	
	
	/**
	 * @brief		Get query record id for one record operation
	 * @return		string
	 */
	public function getRecordId()
	{
		return $this->query_record_id;
	}
	
	/**
	 * @brief		Set query record id for one record operation
	 * @param[in]	arg_record_id		id (string)
	 * @return		boolean
	 */
	public function setRecordId($arg_record_id)
	{
		$context = 'AbstractQuery.setRecordId(id)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		if ( is_string($arg_record_id) && strlen($arg_record_id) > 0 )
		{
			$this->query_record_id = $arg_record_id;
			return Trace::leaveok($context, '', true, self::$TRACE_ABSTRACT_QUERY);
		}
		
		return Trace::leaveko($context, 'record id argument is not an not empty string', false, self::$TRACE_ABSTRACT_QUERY);
	}
	
	
	
	/**
	 * @brief		Get query operands values
	 * @return		array
	 */
	public function getOperandsValues()
	{
		return $this->query_values;
	}
	
	/**
	 * @brief		Get query operands values
	 * @return		array
	 */
	public function getOperandsAssocValues()
	{
		$context = 'AbstractQuery.getOperandsAssocValues()';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		if ( count($this->query_fields) !== count($this->query_values) )
		{
			Trace::value($context, 'query_fields', $this->query_fields, self::$TRACE_ABSTRACT_QUERY);
			Trace::value($context, 'query_values', $this->query_values, self::$TRACE_ABSTRACT_QUERY);
			return Trace::leaveko($context, 'bad values count', null, self::$TRACE_ABSTRACT_QUERY);
		}
		
		$assoc_values = array();
		$field_index = 0;
		foreach($this->query_fields as $field_name)
		{
			// $field_name = $field_record['name'];
			$assoc_values[$field_name] = $this->query_values[$field_index];
			++$field_index;
		}
		
		return Trace::leaveok($context, '', $assoc_values, self::$TRACE_ABSTRACT_QUERY);
	}
	
	/**
	 * @brief		Set query operands values
	 * @param[in]	arg_values		operands values (array of strings)
	 * @return		boolean
	 */
	public function setOperandsValues($arg_values)
	{
		$context = 'AbstractQuery.setOperandsValues(values)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		// REPLACE PREDEFINED VALUES
		if ( is_array($arg_values) )
		{
			$this->query_values = $arg_values;
			if ( ! $this->checkAssocValues() )
			{
				$this->query_values = null;
				
				return Trace::leaveko($context, 'check assoc values failed', false, self::$TRACE_ABSTRACT_QUERY);
			}
			
			return Trace::leaveok($context, '', true, self::$TRACE_ABSTRACT_QUERY);
		}
		
		return Trace::leaveko($context, 'values argument is not an array', false, self::$TRACE_ABSTRACT_QUERY);
	}
	
	
	
	/**
	 * @brief		Get query orders
	 * @return		boolean
	 */
	public function getOrders()
	{
		return $this->query_orders;
	}
	
	/**
	 * @brief		Set query record id for one record operation
	 * @param[in]	arg_record_id		id (string)
	 * @return		boolean
	 */
	public function setOrders($arg_orders)
	{
		$context = 'AbstractQuery.setOrders(orders)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		if ( is_array($arg_orders) )
		{
			$this->query_orders = $arg_orders;
			return Trace::leaveok($context, '', true, self::$TRACE_ABSTRACT_QUERY);
		}
		
		return Trace::leaveko($context, 'orders argument is not an array', false, self::$TRACE_ABSTRACT_QUERY);
	}
	
	
	
	/**
	 * @brief		Get query groups
	 * @return		boolean
	 */
	public function getGroups()
	{
		return $this->query_groups;
	}
	
	/**
	 * @brief		Set query record id for one record operation
	 * @param[in]	arg_record_id		id (string)
	 * @return		boolean
	 */
	public function setGroups($arg_groups)
	{
		$context = 'AbstractQuery.setGroups(groups)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		if ( is_array($arg_groups) )
		{
			$this->query_groups = $arg_groups;
			return Trace::leaveok($context, '', true, self::$TRACE_ABSTRACT_QUERY);
		}
		
		return Trace::leaveko($context, 'groups argument is not an array', false, self::$TRACE_ABSTRACT_QUERY);
	}
	
	
	
	/**
	 * @brief		Get query filters
	 * @return		array
	 */
	public function getFilters()
	{
		return $this->query_filters;
	}
	
	/**
	 * @brief		Set query filters
	 * @param[in]	arg_record_id		id (string)
	 * @return		boolean
	 */
	public function setFilters($arg_filters)
	{
		$context = 'AbstractQuery.setFilters(filters)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		if ( is_array($arg_filters) )
		{
			$this->query_filters = $arg_filters;
			return Trace::leaveok($context, 'filters count['.count($arg_filters).']', true, self::$TRACE_ABSTRACT_QUERY);
		}
		
		return Trace::leaveko($context, 'filters argument is not an array', false, self::$TRACE_ABSTRACT_QUERY);
	}
	
	
	
	/**
	 * @brief		Get query slice offset
	 * @return		integer
	 */
	public function getSliceOffset()
	{
		return $this->query_slice_offset;
	}
	
	/**
	 * @brief		Get query slice length
	 * @return		integer
	 */
	public function getSliceLength()
	{
		return $this->query_slice_length;
	}
	
	/**
	 * @brief		Set query slice
	 * @param[in]	arg_slice_offset		slice offset (integer)
	 * @param[in]	arg_slice_length		slice length (integer)
	 * @return		boolean
	 */
	public function setSlice($arg_slice_offset, $arg_slice_length)
	{
		$context = 'AbstractQuery.setSlice(offset,length)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		if ( is_null($arg_slice_offset) || is_null($arg_slice_length) )
		{
			return Trace::leaveko($context, 'bad slice', false, self::$TRACE_ABSTRACT_QUERY);
		}
		$this->query_slice = array("offset"=>$arg_slice_offset, "length"=>$arg_slice_length);
		
		return Trace::leaveok($context, '', true, self::$TRACE_ABSTRACT_QUERY);
	}
	
	
	
	/**
	 * @brief		Get query fields objects
	 * @return		array		array of fields records
	 */
	public function getJoins()
	{
		return $this->query_joins;
	}
	
	/**
	 * @brief		Set query joins records
	 * @param[in]	arg_joins_records		query joins (array of join records)
	 * @return		boolean
	 */
	public function setJoins($arg_joins_records)
	{
		$context = 'AbstractQuery.setJoins(records)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		if ( ! is_array($arg_joins_records) )
		{
			return Trace::leaveko($context, 'bad join records array', false, self::$TRACE_ABSTRACT_QUERY);
		}
		
		// SET JOINS RECORDS
		$this->query_joins = $arg_joins_records;
		
		return Trace::leaveok($context, 'success', true, self::$TRACE_ABSTRACT_QUERY);
	}
	
	
	
	/**
	 * @brief		Get query custom attribute
	 * @param[in]	arg_name	custom attribute name
	 * @return		string		custom attribute value
	 */
	public function getCustom($arg_name)
	{
		if ( is_string($arg_name) && array_key_exists($arg_name, $this->query_customs) )
		{
			return $this->query_customs[$arg_name];
		}
		
		return null;
	}
	
	/**
	 * @brief		Set query custom attribute
	 * @param[in]	arg_name	custom attribute name
	 * @param[in]	arg_value	custom attribute value
	 * @return		boolean
	 */
	public function setCustom($arg_name, $arg_value)
	{
		$context = 'AbstractQuery.setCustom(name,value)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		if ( is_string($arg_name) )
		{
			return Trace::leaveok($context, 'bad attribute name', false, self::$TRACE_ABSTRACT_QUERY);
		}
		
		$this->query_customs[$arg_name] = $arg_value;
		
		return Trace::leaveok($context, 'success', true, self::$TRACE_ABSTRACT_QUERY);
	}
	
	
	
	/**
	 * @brief		Set query joins records
	 * @param[in]	arg_joins_records		query joins (array of join records)
	 * @return		boolean
	 */
	protected function checkAssocValues()
	{
		$context = 'AbstractQuery.checkAssocValues';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		
		// CHECK VALUES AND FIELDS ARRAYS
		if ( ! is_array($this->query_fields) )
		{
			return Trace::leaveok($context, 'query_fields is not an array', true, self::$TRACE_ABSTRACT_QUERY);
		}
		if ( ! is_array($this->query_values) )
		{
			return Trace::leaveok($context, 'query_values is not an array', true, self::$TRACE_ABSTRACT_QUERY);
		}
		
		Trace::value($context, "query_fields", $this->query_fields, self::$TRACE_ABSTRACT_QUERY);
		Trace::value($context, "query_values", $this->query_values, self::$TRACE_ABSTRACT_QUERY);
		
		
		// GET ARRAYS SIZE
		$query_values_count = count($this->query_values);
		// $query_values_keys  = array_keys($this->query_values);
		$query_fields_count = count($this->query_fields);
		// Trace::value($context, "query_values_keys", $query_values_keys, self::$TRACE_ABSTRACT_QUERY);
		Trace::value($context, "query_values_count", $query_values_count, self::$TRACE_ABSTRACT_QUERY);
		Trace::value($context, "query_fields_count", $query_fields_count, self::$TRACE_ABSTRACT_QUERY);
		
		
		// TEST IF THE ARRAY IS INDEXED BY INTEGERS
		// $last_index			= $query_values_count - 1;
		// $first_key			= $query_values_keys[0];
		// $last_key			= $query_values_keys[$last_index];
		// Trace::value($context, "last_index",					$last_index, self::$TRACE_ABSTRACT_QUERY);
		// Trace::value($context, "first_key",						$first_key, self::$TRACE_ABSTRACT_QUERY);
		// Trace::value($context, "last_key",						$last_key, self::$TRACE_ABSTRACT_QUERY);
		// Trace::value($context, "first_key == 0",				($first_key == "0")?'OK':'KO', self::$TRACE_ABSTRACT_QUERY);
		// Trace::value($context, "last_key == last_index", 		($last_key == "$last_index")?'OK':'KO', self::$TRACE_ABSTRACT_QUERY);
		
		// $is_indexed_values_array = $first_key == "0" && $last_key == "$last_index";
		$is_indexed_values_array = Types::isAssoc($this->query_values);
		Trace::value($context, "is_indexed_values_array", $is_indexed_values_array, self::$TRACE_ABSTRACT_QUERY);
		
		
		// CHECK VALUES COUNT
		if ($query_values_count == 0 && $query_fields_count == 0)
		{
			return Trace::leaveok($context, "no values to check", true, self::$TRACE_ABSTRACT_QUERY);
		}
		if ($query_values_count == 0 && $query_fields_count != 0)
		{
			return Trace::leaveko($context, "bad values count ($query_values_count) for fields count ($query_fields_count)", false, self::$TRACE_ABSTRACT_QUERY);
		}
		
		
		// REMOVE UNUSED PASSWORD VALUES (OLDHASH, NEW, CONFIRM) AND LEAVE NEWHASH
		// INDEXED VALUES ARRAY
		if ($is_indexed_values_array)
		{
			Trace::step($context, "query_values is an indexed array", self::$TRACE_ABSTRACT_QUERY);
			
			Trace::value($context, "this->query_values before remove unused", $this->query_values, self::$TRACE_ABSTRACT_QUERY);
			
			$tmp_values = $this->query_values;
			$value_index = 0;
			$this->query_values = array();
			// Trace::value($context, "this->query_values", $this->query_values, self::$TRACE_ABSTRACT_QUERY);
			// Trace::value($context, "tmp_values", $tmp_values, self::$TRACE_ABSTRACT_QUERY);
			
			foreach($this->query_fields as $field)
			{
				Trace::value($context, "value_index", $value_index == 0 ? "0" : $value_index, self::$TRACE_ABSTRACT_QUERY);
				Trace::value($context, "field.name", $field->getName(), self::$TRACE_ABSTRACT_QUERY);
				
				if ($field->getType() == TYPE::$TYPE_PASSWORD)
				{
					// TODO : rework this part (to remove?)
					Trace::step($context, "field type is password", self::$TRACE_ABSTRACT_QUERY);
					++$value_index;
					++$value_index;
					++$value_index;
				}
				
				Trace::value($context, "field value", $tmp_values[$value_index], self::$TRACE_ABSTRACT_QUERY);
				$this->query_values[] = $tmp_values[$value_index];
				++$value_index;
			}
			
			Trace::value($context, "this->query_values after remove unused", $this->query_values, self::$TRACE_ABSTRACT_QUERY);
		}
		// ASSOCIATIVE VALUES ARRAY
		else
		{
			// TODO class_geenric_query checkAssocValues : REMOVE UNUSED PASSWORD VALUES for ASSOCIATIVE ARRAY
			Trace::value($context, "this->query_values remove unused", $this->query_values, self::$TRACE_ABSTRACT_QUERY);
			
			// foreach($this->query_fields as $field)
			// {
				// if ($field['type'] == TYPE::$TYPE_PASSWORD)
				// {
					// $field_name = $field['name'];
					// unset($this->query_values[$field_name."_oldhash"]);
					// unset($this->query_values[$field_name."_new"]);
					// unset($this->query_values[$field_name."_confirm"]);
				// }
			// }
			
			$query_values_count = count($this->query_values);
			$query_values_keys  = array_keys($this->query_values);
			Trace::value($context, "this->query_values remove unused", $this->query_values, self::$TRACE_ABSTRACT_QUERY);
		}
		
		
		// CHECK VALUES COUNT
		$have_same_count = ($query_values_count > 0 && $query_values_count == $query_fields_count);
		if ($have_same_count)
		{
			// MAKE AN ASSOCIATIVE ARRAY FROM AN INDEXED ARRAY
			if ( $is_indexed_values_array )
			{
				$tmp_values = $this->query_values;
				$tmp_index  = 0;
				$this->query_values = array();
				
				foreach($this->query_fields as $field)
				{
					$this->query_values[$field->getName()] = $tmp_values[$tmp_index];
					$tmp_index += 1;
				}
				
				Trace::value($context, "query_values assoc", $this->query_values, self::$TRACE_ABSTRACT_QUERY);
				
				return Trace::leaveok($context, "success", true, self::$TRACE_ABSTRACT_QUERY);
			}
			
			// ASSOCIATIVE VALUES ARRAY : NOTHING TO DO
			return Trace::leaveok($context, "nothing to do for an associative array", true, self::$TRACE_ABSTRACT_QUERY);
		}
		
		// RESET INPUT VALUES
		$this->query_values = null;
		
		// ALWAYS TRACE THE PROBLEM
		// Trace::addAlertMsg($context, "bad values count ($query_values_count) for fields count ($query_fields_count)", true);
		
		return Trace::leaveko($context, "bad values count ($query_values_count) for fields count ($query_fields_count)", false, self::$TRACE_ABSTRACT_QUERY);
	}
	
	
	
	/**
	 * @brief		Check query type for an action
	 * @param[in]	arg_action			query action (string)
	 * @param[in]	arg_type			query type (string)
	 * @return		boolean
	 */
	public function checkType($arg_action, $arg_type)
	{
		if ($arg_action === "create")
		{
			return in_array($arg_type, self::$OPTION_CREATE_TYPES);
		}
		if ($arg_action === "read")
		{
			return in_array($arg_type, self::$OPTION_READ_TYPES);
		}
		if ($arg_action === "update")
		{
			return in_array($arg_type, self::$OPTION_UPDATE_TYPES);
		}
		if ($arg_action === "delete")
		{
			return in_array($arg_type, self::$OPTION_DELETE_TYPES);
		}
		return false;
	}
}