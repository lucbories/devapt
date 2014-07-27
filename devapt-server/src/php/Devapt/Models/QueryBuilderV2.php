<?php
/**
 * @file        QueryBuilderV2.php
 * @brief       Build a Query from a Request or an array with the Query API v2
 * @details     
 
 * query_json
  * default value: ''
  * value type: string
  * values: one JSON object string
		JSON object string format:
		`{
			action: '...',
			crud_db: '...',
			crud_table: '...',
			fields: [],
			one_field: '...',
			values: {},
			filters: [],
			orders: [],
			groups: [],
			slice: { offset:'...', length:'...' },
			joins: [],
		}`

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

final class QueryBuilderV2
{
	// STATIC ATTRIBUTES
	
	/// @brief		trace flag
	static public $TRACE_QUERY_BUILDER = true;
	
	
	/// @brief		Option : model action (string)
	static public $OPTION_JSON		= "query_json";
	
	
	
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
		$context = 'QueryBuilderV2::buildFromRequest(action,model,request,id)';
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
		
		
		// GET QUERY ARG
		$query_json_array = Query::getRequestJsonArrayValue($arg_request, self::$OPTION_JSON, null);
		if ( ! is_array($query_json_array) && $arg_action === 'read')
		{
			$query_json_array = array('action'=>'select');
		}
		if ( ! is_array($query_json_array) )
		{
			Trace::value($context, 'query_json_array', $query_json_array, self::$TRACE_QUERY_BUILDER);
			return Trace::leaveko($context, 'bad query arg', null, self::$TRACE_QUERY_BUILDER);
		}
		
		
		// CREATE QUERY
		$query = new Query($arg_action);
		$query->setVersion('2');
		$default_sql_action = Query::$TYPE_SELECT;
		switch($arg_action)
		{
			case 'create':
				$default_sql_action = Query::$TYPE_CREATE;
				break;
			case 'update':
				$default_sql_action = Query::$TYPE_UPDATE;
				break;
			case 'delete':
				$default_sql_action = Query::$TYPE_DELETE;
				break;
		}
		
		
		// GET QUERY ACTION
		$type = null;
		if ( array_key_exists('action', $query_json_array) )
		{
			$type = $query_json_array['action'];
			// return Trace::leaveko($context, 'no "action" key in json query array', null, self::$TRACE_QUERY_BUILDER);
		}
		$type = (is_string($type) && $type !== '') ? $type : $default_sql_action;
		$query->setType($type);
		
		
		// GET FIELDS
		$fields = null;
		if ( array_key_exists('fields', $query_json_array) )
		{
			$fields = $query_json_array['fields'];
		}
		if ( ! is_array($fields) )
		{
			Trace::step($context, 'set default fields: all model fields', self::$TRACE_QUERY_BUILDER);
			$fields = array_keys($arg_model->getModelFieldsRecords());
		}
		$query->setFieldsNames($fields);
		
		
		// GET ONE FIELD
		$query_one_field = null;
		if ( array_key_exists('one_field', $query_json_array) )
		{
			$query_one_field = $query_json_array['one_field'];
		}
		if ( is_string($query_one_field) && $query_one_field !== '' )
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
		$values = null;
		if ( array_key_exists('values', $query_json_array) )
		{
			$values = $query_json_array['values'];
		}
		if ( is_array($values) )
		{
			Trace::step($context, 'set values', self::$TRACE_QUERY_BUILDER);
			$query->setOperandsValues($values);
		}
		
		
		// GET ORDERS
		$orders_by = null;
		if ( array_key_exists('orders', $query_json_array) )
		{
			$orders_by = $query_json_array['orders'];
		}
		if ( is_array($orders_by) )
		{
			Trace::step($context, 'set orders', self::$TRACE_QUERY_BUILDER);
			
			$orders_records = array();
			foreach($orders_by as $order_record)
			{
				if ( is_array($order_record) && count($order_record) === 2 )
				{
					$order_field = $order_record['field'];
					$order_mode = strtolower( $order_record['mode'] );
					if ( is_string($order_field) && $order_field !== '' && ($order_mode === 'asc' || $order_mode === 'desc' ) )
					{
						$orders_records[] = array($order_field, $order_mode);
						continue;
					}
					
					Trace::value($context, 'bad order by record', $order_record, self::$TRACE_QUERY_BUILDER);
					return Trace::leaveko($context, 'bad order by record', null, self::$TRACE_QUERY_BUILDER);
				}
			}
			
			$query->setOrders($orders_records);
		}
		
		
		// GET GROUPS
		$groups = null;
		if ( array_key_exists('groups', $query_json_array) )
		{
			$groups = $query_json_array['groups'];
		}
		if ( is_array($groups) )
		{
			Trace::step($context, 'set groups', self::$TRACE_QUERY_BUILDER);
			$query->setGroups($groups);
		}
		
		
		// GET FILTERS
		$filters = null;
		if ( array_key_exists('filters', $query_json_array) )
		{
			$filters = $query_json_array['filters'];
		}
		if ( is_array($filters) )
		{
			Trace::step($context, 'set filters', self::$TRACE_QUERY_BUILDER);
			
			// TODO PROCESS FILTERS
			// $filters_records = array();
			// foreach($filters as $filter_record)
			// {
				// if ( is_array($filter_record) && count($filter_record) === 2 )
				// {
					// $orders_records[] = $filter_record;
				// }
			// }
			
			$query->setFilters($filters_records);
		}
		
		
		// GET SLICE
		$slice = null;
		$slice_offset = null;
		$slice_limit = null;
		if ( array_key_exists('slice', $query_json_array) )
		{
			$slice = $query_json_array['slice'];
		}
		if ( is_array($slice) && count($slice) === 2 )
		{
			if ( array_key_exists('offset', $slice) && array_key_exists('length', $slice) )
			{
				$slice_offset = $slice['offset'];
				$slice_limit = $slice['length'];
			}
			if ( array_key_exists('start', $slice) && array_key_exists('limit', $slice) )
			{
				$slice_offset = $slice['start'];
				$slice_limit = $slice['limit'];
			}
		}
		if ( is_numeric($slice_offset) && is_numeric($slice_limit) )
		{
			Trace::step($context, 'set slice', self::$TRACE_QUERY_BUILDER);
			$query->setSlice($slice_offset, $slice_limit);
		}
		
		
		// GET JOINS RECORDS
		$joins = null;
		if ( array_key_exists('joins', $query_json_array) )
		{
			$joins = $query_json_array['joins'];
		}
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
		$crud_db = null;
		if ( array_key_exists('crud_db', $query_json_array) )
		{
			$crud_db = $query_json_array['crud_db'];
		}
		if ( is_string($crud_db) )
		{
			Trace::step($context, 'set crud db', self::$TRACE_QUERY_BUILDER);
			$this->setCustom('crud_db', $crud_db);
		}
		
		
		// GET CRUD TABLE
		$crud_table = null;
		if ( array_key_exists('crud_table', $query_json_array) )
		{
			$crud_table = $query_json_array['crud_table'];
		}
		if ( is_string($crud_table) )
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
		$context = 'QueryBuilderV2::buildFromArray(action,model,settings,id)';
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
		// TODO BUILD FROM ARRAY
		return Trace::leaveko($context, 'not yet implemented', null, self::$TRACE_QUERY_BUILDER);
		/*
		// CREATE QUERY
		$query = new Query($arg_action);
		
		
		// GET TYPE OF THE QUERY
		$type = array_key_exists(self::$OPTION_ACTION, $arg_settings) ? $arg_settings[self::$OPTION_ACTION] : $arg_action;
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
		$this->setFieldsNames($fields);
		
		
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
		
		
		return Trace::leaveok($context, 'success', $query, self::$TRACE_QUERY_BUILDER);*/
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
		
		// TODO CHECK JOIN RECORD
		return Trace::leaveko($context, 'not yet implemented', false, self::$TRACE_ABSTRACT_QUERY);
		/*
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
		
		return Trace::leaveok($context, 'record is ok', true, self::$TRACE_ABSTRACT_QUERY);*/
	}
}
