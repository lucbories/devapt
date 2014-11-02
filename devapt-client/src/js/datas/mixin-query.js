/**
 * @file        datas/mixin-query.js
 * @desc        Mixin to get or update a query
 * @see			...
 * @ingroup     DEVAPT_CORE
 * @date        2014-10-12
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/options', 'datas/query'],
function(Devapt, DevaptTypes, DevaptOptions, DevaptQuery)
{
	/**
	 * @mixin				DevaptMixinQuery
	 * @public
	 * @desc				Mixin of template methods
	 */
	var DevaptMixinQuery = 
	{
		/**
		 * @memberof			DevaptMixinQuery
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_query: false,
		
		
		/**
		 * @memberof			DevaptMixinQuery
		 * @public
		 * @desc				Queries instance map
		 */
		mixin_queries_by_name: {},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinQuery
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_query: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_query);
			var context = 'mixin_init_query()';
			self.enter(context, '');
			
			// console.log(self.items_query, 'query init');
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinQuery
		 * @desc					Get a query by name (a DevaptQuery instance)
		 * @param {string}			arg_query_name		query name
		 * @return {object}
		 */
		get_query_by_name: function(arg_query_name)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_query);
			var context = 'get_query_by_name()';
			self.enter(context, '');
			
			
			// TEST NAME
			var query_name = DevaptTypes.is_not_empty_str(arg_query_name) ? arg_query_name : self.name + '_query';
			
			// QUERY DOESN T EXISTS
			if ( ! DevaptTypes.is_object( self.mixin_queries_by_name[query_name] ) )
			{
				self.step(context, 'build new Query');
				self.mixin_queries_by_name[query_name] = new DevaptQuery(query_name, {});
			}
			
			
			self.leave(context, '');
			self.pop_trace();
			return self.mixin_queries_by_name[query_name];
		},
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinQuery
		 * @desc					Get the default query (a DevaptQuery instance)
		 * @return {object}
		 */
		get_query: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_query);
			var context = 'get_query()';
			self.enter(context, '');
			
			
			var query = self.get_query_by_name(null);
			
			
			self.leave(context, '');
			self.pop_trace();
			return query;
		},
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinQuery
		 * @desc					Add a filter on a query with a field name/value pair.
		 * @param {string}			arg_query_name		query name
		 * @param {string|object}	arg_field_name		field name or field object
		 * @param {string|number}	arg_field_value		field value
		 * @param {boolean}			arg_is_unique		filter should be unique on this field
		 * @return {boolean}
		 */
		add_field_value_filter: function(arg_query_name, arg_field_name, arg_field_value, arg_is_unique)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_query);
			var context = 'add_field_value_filter()';
			self.enter(context, '');
			
			
			// DEBUG
			self.value(context, 'arg_query_name', arg_query_name);
			self.value(context, 'arg_field_name', arg_field_name);
			self.value(context, 'arg_field_value', arg_field_value);
			self.value(context, 'arg_is_unique', arg_is_unique);
			
			
			// CHECK ARGS
			var field_name = DevaptTypes.is_string(arg_field_name) ? arg_field_name : (DevaptTypes.is_object(arg_field_name) ? arg_field_name.name : null);
			self.assertNotEmptyString(context, 'field_name', field_name);
			var field_filter = { combination:'and', expression: {operator: 'equals', operands: [{ value:field_name, type:'string'}, { value:arg_field_value, type:'string'}]} };
			
			// GET QUERY
			var query = self.get_query_by_name(arg_query_name);
			// console.log(query.filters, query.name + '.' + context);
			
			// ADD FILTER
			query.add_filter(field_name, field_filter, arg_is_unique);
			// console.log(query.filters, query.name + '.' + context);
			
			// EMIT EVENTS
			self.fire_event('devapt.query.updated');
			self.fire_event('devapt.query.filters.added', [field_filter]);
			
			
			self.leave(context, '');
			self.pop_trace();
		}
		
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinQuery
	 * @desc				Register mixin options
	 * @return {nothing}
	 */
	DevaptMixinQuery.register_options = function(arg_prototype)
	{
		// DevaptOptions.register_str_option(arg_prototype, 'items_query_json',		null, false, []); // model query JSON string
		// DevaptOptions.register_obj_option(arg_prototype, 'items_query',				null, false, []); // model query object
		// DevaptOptions.register_obj_option(arg_prototype, 'items_queries',				null, false, []); // model query object
		// DevaptOptions.register_str_option(arg_prototype, 'items_query_filters',		null, false, []); // model query
		// DevaptOptions.register_str_option(arg_prototype, 'items_query_slice',		null, false, []); // model query
	};
	
	
	return DevaptMixinQuery;
}
);