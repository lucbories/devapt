/**
 * @file        datas/query.js
 * @desc        Devapt datas query class
 * 					QUERY version 2 FORMAT
 * 					{
 * 						action: '...',
 * 						crud_db: '...',
 * 						crud_table: '...',
 * 						fields: [],
 * 						one_field: '...',
 * 						values: {},
 * 						values_count: ...,
 * 						filters: [],
 * 						orders: [],
 * 						groups: [],
 * 						slice: { offset:'...', length:'...' },
 * 						joins: [],
 * 					}
 * 
 * @see			core/object.js
 * @ingroup     DEVAPT_DATAS
 * @date        2014-08-12
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/events', 'core/object'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptQuerys, DevaptObject)
{
	/**
	 * @class				DevaptQuery
	 * @desc				Query class constructor
	 * @method				DevaptQuery.constructor
	 * @param {string}		arg_name				object name
	 * @param {object|null}	arg_options				associative array of name/value options
	 * @return {nothing}
	 */
	function DevaptQuery(arg_name, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptObject;
		self.inheritFrom(arg_event_name, arg_options, false);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptQuery';
		
		
		/**
		 * @memberof			DevaptQuery
		 * @public
		 * @method				DevaptQuery.constructor
		 * @desc				Query class constructor
		 * @return {nothing}
		 */
		self.DevaptQuery_constructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context				= self.class_name + '(' + arg_name + ')';
			self.enter(context, 'constructor');
			
			
			// INIT OPTIONS
			var init_option_result = DevaptOptions.set_options_values(self, arg_options, false);
			if (! init_option_result)
			{
				self.error(context + ': init options failure');
			}
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		}
		
		
		// CALL CONSTRUCTOR
		self.DevaptQuery_constructor();
		
		
		
		/**
		 * @memberof			DevaptQuery
		 * @public
		 * @method				DevaptQuery.get_json()
		 * @desc				Get query version 2 JSON object
		 * @return {object}
		 */
		self.get_json = function()
		{
			var context = 'get_json()';
			self.enter(context, '');
			
			var json_obj = {
				query_json: {
					action: 'select_count',
					one_field: 'id_user',
					values: null,
					values_count: 0
/*	crud_db: '...',
	crud_table: '...',
	fields: [],
	one_field: '...',
	values: {},
	values_count: ...,
	filters: [],
	orders: [],
	groups: [],
	slice: { offset:'...', length:'...' },
	joins: [],*/
				}
			};
			
			self.leave(context, 'success');
			return json_obj;
		}
/*		// ONE FIELD
		this.set_one_field = function(arg_one_field)
		{
			// this.assert(arg_one_field instanceof LibaptField);
			this.one_field = arg_one_field;
			return true;
		}
		
		// ACTION METHOD - SET
		this.set_action = function(arg_action)
		{
			this.action = arg_action;
		}
		
		this.set_select = function()
		{
			this.action = 'select';
		}
		
		this.set_select_distinct = function()
		{
			this.action = 'select_distinct';
		}
		
		this.set_select_distinct_one = function()
		{
			this.action = 'select_distinct_one';
		}
		
		this.set_select_count = function()
		{
			this.action = 'select_count';
		}*/
		
		
		
		/* --------------------------------------------------------------------------------------------- */
		// APPEND MIXIN METHODS
		// self.register_mixin(DevaptMixinTrace);
		/* --------------------------------------------------------------------------------------------- */
	}
	
	
	// INTROSPECTION : REGISTER CLASS
	DevaptClasses.register_class(DevaptQuery, ['DevaptObject'], 'Luc BORIES', '2014-08-12', 'Datas query class.');
	
	
	// INTROSPECTION : REGISTER OPTIONS
	DevaptOptions.register_str_option(DevaptQuery, 'action',				null, true, []);
	DevaptOptions.register_str_option(DevaptQuery, 'crud_db',				null, false, []);
	DevaptOptions.register_str_option(DevaptQuery, 'crud_table',			null, false, []);
	DevaptOptions.register_str_option(DevaptQuery, 'one_field',				null, true, []);
	DevaptOptions.register_int_option(DevaptQuery, 'values_count',			null, true, []);
	
	DevaptOptions.register_array_option(DevaptQuery, 'fields', [], false, ',', 'String', []);
	DevaptOptions.register_array_option(DevaptQuery, 'values', [], false, ',', 'String', []);
	DevaptOptions.register_array_option(DevaptQuery, 'filters', [], false, '|', 'Object', []);
	DevaptOptions.register_array_option(DevaptQuery, 'orders', [], false, ',', 'Object', []);
	DevaptOptions.register_array_option(DevaptQuery, 'groups', [], false, ',', 'String', []);
	DevaptOptions.register_array_option(DevaptQuery, 'joins', [], false, ',', 'Object', []);
	
	DevaptOptions.register_obj_option(DevaptQuery, 'slice', null, false, []);
	
	
	return DevaptQuery;
} );
