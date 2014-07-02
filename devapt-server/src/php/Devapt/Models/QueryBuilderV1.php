<?php
/**
 * @file        QueryBuilderV1.php
 * @brief       Build a Query from a Request or an array with the Query API v1
 * @details     
 * @ingroup     MODELS
 * @date        2014-05-30
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

namespace Devapt\Models;

// DEVAPT IMPORTS
use Devapt\Core\Trace;

final class QueryBuilderV1
{
	// STATIC ATTRIBUTES
	
	/// @brief		trace flag
	static public $TRACE_QUERY_BUILDER = true;
	
	
	/// @brief		Option : model action (string)
	static public $OPTION_ACTION		= "query_action";
	
	/// @brief OPTION NAME: QUERY CRUD DB
	static public $OPTION_CRUD_DB			= "crud_db";
	
	/// @brief OPTION NAME: QUERY CRUD TABLE
	static public $OPTION_CRUD_TABLE		= "crud_table";
	
	/// @brief		Option : one model field name (string)
	static public $OPTION_ONE_FIELD		= "query_one_field";
	
	/// @brief		Option : model fields (string)
	static public $OPTION_FIELDS		= "query_fields";
	
	/// @brief		Option : model values (string)
	static public $OPTION_VALUES		= "query_values";
	
	/// @brief		Option : model filters (string)
	static public $OPTION_FILTERS		= "query_filters";
	
	/// @brief		Option : model orders (string)
	static public $OPTION_ORDERS		= "query_orders";
	
	/// @brief		Option : model groups (string)
	static public $OPTION_GROUPS		= "query_groups";
	
	/// @brief		Option : model slice begin (integer)
	static public $OPTION_SLICE_BEGIN	= "query_slice_begin";
	
	/// @brief		Option : model slice end (integer)
	static public $OPTION_SLICE_END	= "query_slice_end";
	
	/// @brief		Option : model slice offset (integer)
	static public $OPTION_SLICE_OFFSET	= "query_slice_offset";
	
	/// @brief		Option : model slice length (integer)
	static public $OPTION_SLICE_LENGTH	= "query_slice_length";
	
	/// @brief		Option : model joins (string)
	static public $OPTION_JOINS		= "query_joins";
	
	
	
	/**
	 * @brief		Constructor
	 * @return		nothing
	 */
	private function __construct()
	{
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
		$context = 'QueryBuilderV1::buildFromRequest(action,model,request,id)';
		Trace::enter($context, '', self::$TRACE_QUERY_BUILDER);
		
		
		// CHECK ARGS
		if ( ! is_object($arg_model) )
		{
			return Trace::leaveko($context, 'bad model object', null, self::$TRACE_QUERY_BUILDER);
		}
		if ( ! is_object($arg_request) )
		{
			return Trace::leaveko($context, 'bad request object', null, self::$TRACE_QUERY_BUILDER);
		}
		
		
		// CREATE QUERY
		$query = new Query($arg_action);
		$query->setVersion('1');
		
		
		// GET TYPE
		$type = Query::getRequestValue($arg_request, self::$OPTION_ACTION, Query::$TYPE_SELECT);
		$query->setType($type);
		
		
		// GET FIELDS
		$fields = Query::getRequestArrayValue($arg_request, self::$OPTION_FIELDS, ',', null);
		if ( ! is_array($fields) )
		{
			Trace::step($context, 'set default fields: all model fields', self::$TRACE_QUERY_BUILDER);
			$fields = array_keys($arg_model->getModelFieldsRecords());
		}
		$query->setFields($fields);
		
		
		// GET ONE FIELD
		$query_one_field = Query::getRequestValue($arg_request, self::$OPTION_ONE_FIELD, null);
		if ( is_string($query_one_field) )
		{
			$query->setOneField($query_one_field);
		}
		
		
		// SET RECORD ID
		if ( ! is_null($arg_id) )
		{
			Trace::step($context, 'set record id', self::$TRACE_QUERY_BUILDER);
			$query->setRecordId($arg_id);
		}
		
		
		// GET VALUES
		$values = Query::getRequestArrayValue($arg_request, self::$OPTION_VALUES, ',', null);
		if ( is_array($values) )
		{
			Trace::step($context, 'set values', self::$TRACE_QUERY_BUILDER);
			$query->setOperandsValues($values);
		}
		
		
		// GET ORDERS
		$orders_by = Query::getRequestArrayValue($arg_request, self::$OPTION_ORDERS, ',', null);
		if ( is_array($orders_by) )
		{
			Trace::step($context, 'set orders', self::$TRACE_QUERY_BUILDER);
			
			$orders_records = array();
			foreach($orders_by as $order_str)
			{
				$order_record = explode('=', $order_str);
				if ( is_array($order_record) && count($order_record) === 2 )
				{
					$orders_records[] = $order_record;
				}
			}
			
			$query->setOrders($orders_records);
		}
		
		
		// GET GROUPS
		$groups = Query::getRequestArrayValue($arg_request, self::$OPTION_GROUPS, ',', null);
		if ( is_array($groups) )
		{
			Trace::step($context, 'set groups', self::$TRACE_QUERY_BUILDER);
			$query->setGroups($groups);
		}
		
		
		// GET FILTERS
		$filters = Query::getRequestArrayValue($arg_request, self::$OPTION_FILTERS, '|', null);
		if ( is_array($filters) )
		{
			Trace::step($context, 'set filters', self::$TRACE_QUERY_BUILDER);
			
			$filters_records = array();
			foreach($filters as $filter_str)
			{
				$filter_record = explode(',', $filter_str);
				if ( is_array($filter_record) && count($filter_record) === 2 )
				{
					$orders_records[] = $filter_record;
				}
			}
			
			$query->setFilters($filters_records);
		}
		
		
		// GET SLICE
		$slice_offset = Query::getRequestValue($arg_request, self::$OPTION_SLICE_OFFSET, null);
		$slice_limit = Query::getRequestValue($arg_request, self::$OPTION_SLICE_LENGTH, null);
		if ( is_numeric($slice_offset) && is_numeric($slice_limit) )
		{
			Trace::step($context, 'set slice', self::$TRACE_QUERY_BUILDER);
			$query->setSlice($slice_offset, $slice_limit);
		}
		
		
		// GET JOINS RECORDS
		$joins = Query::getRequestArrayValue($arg_request, self::$OPTION_JOINS, '|', null);
		if ( is_array($joins) )
		{
			Trace::step($context, 'set joins', self::$TRACE_QUERY_BUILDER);
			foreach($joins as $join_record)
			{
				if ( ! self::checkJoinRecord($join_record) )
				{
					Trace::leaveko($context, 'bad join record', null, self::$TRACE_QUERY_BUILDER);
				}
			}
			
			$query->setJoins($joins);
		}
		
		
		// GET CRUD DB
		$crud_db = Query::getRequestValue($arg_request, self::$OPTION_CRUD_DB, null);
		if ( is_string($crud_db) )
		{
			Trace::step($context, 'set crud db', self::$TRACE_QUERY_BUILDER);
			$this->setCustom('crud_db', $crud_db);
		}
		
		
		// GET CRUD TABLE
		$crud_table = Query::getRequestValue($arg_request, self::$OPTION_CRUD_TABLE, null);
		if ( is_string($crud_db) )
		{
			Trace::step($context, 'set crud table', self::$TRACE_QUERY_BUILDER);
			$this->setCustom('crud_table', $crud_table);
		}
		
		
		return Trace::leaveok($context, 'success', $query, self::$TRACE_QUERY_BUILDER);
	}
	
	
	
	/**
	 * @brief		Build the query from an array (static)
	 * @param[in]	arg_action		action name: create/read/update/delete
	 * @param[in]	arg_model		model (object)
	 * @param[in]	arg_settings	settings (array)
	 * @param[in]	arg_id			record id (string|integer)
	 * @return		Query object or null
	 */
	static public function buildFromArray($arg_action, $arg_model, $arg_settings, $arg_id)
	{
		$context = 'QueryBuilderV1::buildFromArray(action,model,settings,id)';
		Trace::enter($context, '', self::$TRACE_QUERY_BUILDER);
		
		
		// CHECK ARGS
		if ( ! is_object($arg_model) )
		{
			return Trace::leaveko($context, 'bad model object', null, self::$TRACE_QUERY_BUILDER);
		}
		if ( ! is_array($arg_settings) )
		{
			return Trace::leaveko($context, 'bad settings array', null, self::$TRACE_QUERY_BUILDER);
		}
		
		
		// CREATE QUERY
		$query = new Query($arg_action);
		
		
		// GET TYPE OF THE QUERY
		$type = array_key_exists(self::$OPTION_ACTION, $arg_settings) ? $arg_settings[self::$OPTION_ACTION] : null;
		if ( ! is_string($type) )
		{
			$type = Query::$TYPE_SELECT;
		}
		$this->setType($type);
		
		
		// GET INDEXED ARRAY OF FIELDS
		$fields = array_key_exists(self::$OPTION_FIELDS, $arg_settings) ? $arg_settings[self::$OPTION_FIELDS] : null;
		if ( is_string($fields) )
		{
			$fields = array($fields);
		}
		$this->setFields($fields);
		
		
		// GET INDEXED ARRAY OF VALUES
		$values = array_key_exists(self::$OPTION_VALUES, $arg_settings) ? $arg_settings[self::$OPTION_VALUES] : null;
		if ( is_array($values) )
		{
			$this->setValues($values);
		}
		
		
		// GET INDEXED ARRAY OF ORDERS
		$orders	= array_key_exists(self::$OPTION_ORDERS, $arg_settings) ? $arg_settings[self::$OPTION_ORDERS] : null;
		if ( is_array($orders) )
		{
			$this->setOrders($orders);
		}
		
		
		// GET INDEXED ARRAY OF GROUPS
		$groups	= array_key_exists(self::$OPTION_GROUPS, $arg_settings) ? $arg_settings[self::$OPTION_GROUPS] : null;
		if ( is_array($groups) )
		{
			$this->setGroups($groups);
		}
		
		
		// GET INDEXED ARRAY OF FILTERS
		$filters	= array_key_exists(self::$OPTION_FILTERS, $arg_settings) ? $arg_settings[self::$OPTION_FILTERS] : null;
		if ( is_array($filters) )
		{
			$this->setGroups($filters);
		}
		
		
		// SLICE WITH BEGIN AND END OR OFFSET AND LENGTH
		$offset	= array_key_exists(self::$OPTION_SLICE_OFFSET, $arg_settings) ? $arg_settings[self::$OPTION_SLICE_OFFSET] : null;
		$length	= array_key_exists(self::$OPTION_SLICE_LENGTH, $arg_settings) ? $arg_settings[self::$OPTION_SLICE_LENGTH] : null;
		$begin	= array_key_exists(self::$OPTION_SLICE_BEGIN, $arg_settings) ? $arg_settings[self::$OPTION_SLICE_BEGIN] : null;
		$end	= array_key_exists(self::$OPTION_SLICE_END, $arg_settings) ? $arg_settings[self::$OPTION_SLICE_END] : null;
		
		if ( ! ( is_numeric($offset) && is_numeric($length) ) && is_numeric($begin) && is_numeric($end) && $begin > 0 && $end > $begin )
		{
			$offset = $begin;
			$length = $end - $begin;
		}
		if ( is_numeric($offset) && is_numeric($length) )
		{
			$query->setSlice($offset, $length);
		}
		
		
		// GET JOINS RECORDS
		$joins	= array_key_exists(self::$OPTION_JOINS, $arg_settings) ? $arg_settings[self::$OPTION_JOINS] : null;
		if ( is_array($joins) )
		{
			foreach($joins as $join_record)
			{
				if ( ! self::checkJoinRecord($join_record) )
				{
					Trace::leaveko($context, 'bad join record', null, self::$TRACE_QUERY_BUILDER);
				}
			}
			
			$query->setJoins($joins);
		}
		
		
		// GET CRUD DB
		$crud_db = array_key_exists(self::$OPTION_CRUD_DB, $arg_settings) ? $arg_settings[self::$OPTION_CRUD_DB] : null;
		if ( is_string($crud_db) )
		{
			$this->setCustom('crud_db', $crud_db);
		}
		
		
		// GET CRUD TABLE
		$crud_table = array_key_exists(self::$OPTION_CRUD_TABLE, $arg_settings) ? $arg_settings[self::$OPTION_CRUD_TABLE] : null;
		if ( is_string($crud_table) )
		{
			$this->setCustom('crud_table', $crud_table);
		}
		
		
		return Trace::leaveok($context, 'success', $query, self::$TRACE_QUERY_BUILDER);
	}
	
	
	/**
	 * @brief		Check query join record
	 * @param[in]	arg_join_record		query join record (assoc array)
	 * @return		boolean
	 */
	static public function checkJoinRecord($arg_join_record)
	{
		$context = 'AbstractQuery.checkJoinRecord(record)';
		Trace::enter($context, '', self::$TRACE_ABSTRACT_QUERY);
		
		// CHECK JOIN RECORD
		if ( ! is_array($arg_join_record) || count($arg_join_record) < 6 || count($arg_join_record) > 7)
		{
			return Trace::leaveko($context, 'bad join record', false, self::$TRACE_ABSTRACT_QUERY);
		}
		
		// CHECK LEFT PART
		$join_db_left			= array_key_exists('db', $arg_join_record) ? true : true;
		$join_table_left		= array_key_exists('table', $arg_join_record) ? true : false;
		$join_column_left		= array_key_exists('column', $arg_join_record) ? true : false;
		
		$left_is_valid			= $join_db_left && $join_table_left && $join_column_left;
		$left_is_valid			= $left_is_valid && is_string($join_table_left) && strlen($join_table_left) > 0 && is_string($join_column_left) && strlen($join_column_left) > 0;
		
		if (! $left_is_valid)
		{
			return Trace::leaveko($context, 'bad join left part', false, self::$TRACE_ABSTRACT_QUERY);
		}
		
		// CHECK RIGHT PART
		$join_db_right			= array_key_exists('join_db', $arg_join_record) ? true : true;
		$join_table_right		= array_key_exists('join_table', $arg_join_record) ? true : false;
		$join_table_alias_right	= array_key_exists('join_table_alias', $arg_join_record) ? true : false;
		$join_column_right		= array_key_exists('join_column', $arg_join_record) ? true : false;
		
		$right_is_valid			= $join_db_right && $join_table_right && $join_table_alias_right && $join_column_right;
		$right_is_valid			= $right_is_valid && is_string($join_table_right) && strlen($join_table_right) > 0 && is_string($join_table_alias_right) && strlen($join_table_alias_right) > 0 && is_string($join_column_right) && strlen($join_column_right) > 0;
		
		if (! $right_is_valid)
		{
			return Trace::leaveko($context, 'bad join right part', false, self::$TRACE_ABSTRACT_QUERY);
		}
		
		// CHECK MODE
		$join_mode_is_valid		= array_key_exists('join_mode', $arg_join_record) ? in_array($arg_join_record['join_mode'], ['INNER', 'OUTER', 'LEFT', 'RIGHT']) : false;
		
		if (! $join_mode_is_valid)
		{
			return Trace::leaveko($context, 'bad join mode', false, self::$TRACE_ABSTRACT_QUERY);
		}
		
		return Trace::leaveok($context, 'record is ok', true, self::$TRACE_ABSTRACT_QUERY);
	}
}
