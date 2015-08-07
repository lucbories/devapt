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
			values: [{},{}...],
			values_count: ...,
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

// ZEND IMPORTS
use Zend\Db\Sql\Predicate\PredicateSet;

// DEVAPT IMPORTS
use Devapt\Core\Trace;
use Devapt\Model\Sql;
// use Devapt\Model\Filters;
use Devapt\Models\Filters\QueryFiltersBuilderV2;
use \Devapt\Security\DbConnexions;

final class QueryBuilderV2
{
	// STATIC ATTRIBUTES
	
	/// @brief		trace flag
	static public $TRACE_QUERY_BUILDER = false;
	
	
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
	 * @param[in]	arg_id			record id (string|integer|array)
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
		$query = QueryBuilderV2::buildFromArray($arg_action, $arg_model, $query_json_array, $arg_id);
		
		
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
		
		
		$query_json_array = $arg_settings;
		if ( ! is_array($query_json_array) && $arg_action === 'read')
		{
			$query_json_array = array('action'=>'select');
		}
		Trace::value($context, 'query_json_array', $query_json_array, self::$TRACE_QUERY_BUILDER);
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
				$default_sql_action = Query::$TYPE_INSERT;
				break;
			case 'update':
				$default_sql_action = Query::$TYPE_UPDATE;
				break;
			case 'delete':
				$default_sql_action = Query::$TYPE_DELETE;
				break;
		}
		
		
		// GET QUERY ACTION
		if ( array_key_exists('query_type', $query_json_array) )
		{
			$type = $query_json_array['query_type'];
		// $type = (is_string($type) && $type !== '') ? $type : $default_sql_action;
			if (is_string($type) && $type !== '')
			{
				$query->setType($type);
			}
		}
		
		
		
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
		$query->setFieldsNames($fields, $arg_model);
		
		
		// GET ONE FIELD
		$query_one_field = null;
		if ( array_key_exists('one_field', $query_json_array) )
		{
			$query_one_field = $query_json_array['one_field'];
		}
		if ( is_string($query_one_field) && $query_one_field !== '' )
		{
			$query->setOneFieldName($query_one_field, $arg_model->getModelFieldsRecords());
		}
		
		
		// SET RECORD ID
		if ( ! is_null($arg_id) )
		{
			Trace::step($context, 'set record id', self::$TRACE_QUERY_BUILDER);
			$query->setRecordId($arg_id);
		}
		
		
		// GET VALUES
		$values = null;
		$values_count = null;
		if ( array_key_exists('values', $query_json_array) )
		{
			$values = $query_json_array['values'];
		}
		if ( is_array($values) && count($values) > 0 )
		{
			if ( array_key_exists('values_count', $query_json_array) )
			{
				$values_count = $query_json_array['values_count'];
			}
			Trace::step($context, 'set values', self::$TRACE_QUERY_BUILDER);
			$query->setOperandsValues($values, $values_count);
		}
		
		
		// GET ORDERS
		$orders_by = null;
		if ( array_key_exists('orders', $query_json_array) )
		{
			$orders_by = $query_json_array['orders'];
		}
		if ( is_array($orders_by) && count($orders_by) > 0 )
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
		if ( is_array($groups) && count($groups) > 0 )
		{
			Trace::step($context, 'set groups', self::$TRACE_QUERY_BUILDER);
			$query->setGroups($groups);
		}
		
		
		// GET FILTERS
		if ( array_key_exists('filters', $query_json_array) )
		{
			Trace::step($context, 'set filters to build', self::$TRACE_QUERY_BUILDER);
			
			$filters_records = $query_json_array['filters'];
			
			if ( is_array($filters_records) && count($filters_records) > 0 )
			{
				$query->setFiltersToBuild($filters_records);
			}
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
		if ( is_array($joins) && count($joins) > 0 )
		{
			Trace::step($context, 'set joins', self::$TRACE_QUERY_BUILDER);
			
			$default_db		= DbConnexions::getConnexionDatabase($arg_model->getModelConnexionName());
			$default_table	= $arg_model->getModelCrudTableName();
			
			$query_joins_records = array();
			foreach($joins as $join_record)
			{
				// CHECK JOIN RECORD
				if ( ! self::checkJoinRecord($join_record) )
				{
					Trace::value($context, 'join_record', $join_record, self::$TRACE_QUERY_BUILDER);
					return Trace::leaveko($context, 'bad join record', null, self::$TRACE_QUERY_BUILDER);
				}
				if ( ! array_key_exists('source', $join_record) )
				{
					return Trace::leaveko($context, 'bad join record: no source', null, self::$TRACE_QUERY_BUILDER);
				}
				if ( ! array_key_exists('target', $join_record) )
				{
					return Trace::leaveko($context, 'bad join record: no target', null, self::$TRACE_QUERY_BUILDER);
				}
				
				// CREATE QUERY JOIN RECORD
				$query_join_record = array();
				$query_join_record['mode'] = array_key_exists('mode', $join_record) ? $join_record['mode'] : 'INNER';
				$query_join_record['mode'] = strtolower( $query_join_record['mode'] );
				if ( ! in_array($query_join_record['mode'], Query::$JOIN_MODES) )
				{
					$query_join_record['mode'] = 'inner';
				}
				
				$query_join_record['source'] = array();
				$query_join_record['source']['db'] = array_key_exists('db', $join_record['source']) ? $join_record['source']['db'] : $default_db;
				$query_join_record['source']['table'] = array_key_exists('table', $join_record['source']) ? $join_record['source']['table'] : $default_table;
				$query_join_record['source']['column'] = $join_record['source']['column'];
				
				$query_join_record['target'] = array();
				$query_join_record['target']['db'] = array_key_exists('join_db', $join_record['target']) ? $join_record['target']['db'] : $default_db;
				$query_join_record['target']['table'] = $join_record['target']['table'];
				$query_join_record['target']['table_alias'] = array_key_exists('table_alias', $join_record['target']) ? $join_record['target']['table_alias'] : $join_record['target']['table'];
				$query_join_record['target']['column'] = $join_record['target']['column'];
				
				// ADD QUERY JOIN RECORD
				$query_joins_records[] = $query_join_record;
			}
			
			$query->setJoins($query_joins_records);
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
			$query->setCustom('crud_db', $crud_db);
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
			$query->setCustom('crud_table', $crud_table);
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
		Trace::enter($context, '', self::$TRACE_QUERY_BUILDER);
		
		
		// CHECK JOIN MODE
		if ( ! array_key_exists('mode', $arg_join_record) )
		{
			return Trace::leaveko($context, 'bad join record: no mode', false, self::$TRACE_QUERY_BUILDER);
		}
		
		// CHECK JOIN SOURCE
		if ( ! array_key_exists('source', $arg_join_record) )
		{
			return Trace::leaveko($context, 'bad join record: no source', false, self::$TRACE_QUERY_BUILDER);
		}
		$source_record = $arg_join_record['source'];
		if ( ! array_key_exists('db', $source_record) )
		{
			Trace::step($context, 'set default source db', self::$TRACE_QUERY_BUILDER);
		}
		if ( ! array_key_exists('table', $source_record) )
		{
			Trace::step($context, 'set default source table', self::$TRACE_QUERY_BUILDER);
		}
		if ( ! array_key_exists('column', $source_record) )
		{
			return Trace::leaveko($context, 'bad join record: no source column', false, self::$TRACE_QUERY_BUILDER);
		}
		
		// CHECK JOIN TARGET
		if ( ! array_key_exists('target', $arg_join_record) )
		{
			return Trace::leaveko($context, 'bad join record: no target', false, self::$TRACE_QUERY_BUILDER);
		}
		$target_record = $arg_join_record['target'];
		if ( ! array_key_exists('db', $target_record) )
		{
			Trace::step($context, 'set default target db', self::$TRACE_QUERY_BUILDER);
		}
		if ( ! array_key_exists('table', $target_record) )
		{
			return Trace::leaveko($context, 'bad join record: no target table', false, self::$TRACE_QUERY_BUILDER);
		}
		if ( ! array_key_exists('table_alias', $target_record) )
		{
			Trace::step($context, 'set default target table alias', self::$TRACE_QUERY_BUILDER);
		}
		if ( ! array_key_exists('column', $target_record) )
		{
			return Trace::leaveko($context, 'bad join record: no target column', false, self::$TRACE_QUERY_BUILDER);
		}
		
		
		return Trace::leaveok($context, 'record is ok', true, self::$TRACE_QUERY_BUILDER);
	}
}
