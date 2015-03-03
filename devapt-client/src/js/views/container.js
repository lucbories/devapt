/**
 * @file        views/container.js
 * @desc        Container base class
 *				API:
 *					INHERITS: View
 *					SETTINGS:
 *						SOURCE OF DATAS
 *							items_source: select the source of the datas ("inline", "model")
 *							items_source_format: select the format of the datas ("json", "array")
 *						INLINE DATA SOURCE SETTINGS:
 *							items_inline: set the items datas
 *						DATAS COMMON SETTINGS
 *							items_options: set the items options (item1_opt1=...|item1_opt2=...,item2_opt1=...|item2_opt2=...)
 *							items_labels: set the items labels as a string "item1_label,item2_label,item3_label)
 *							items_types: set the items types as a string "item1_type,item2_type,item3_type)
 *						RECORDS DATA SETTINGS
 *							items_records_fields_names:
 *							items_records_fields_types:
 *						MODEL DATA SOURCE SETTINGS:
 *							items_model_obj
 *							items_query_json
 *							items_query_filters
 *							items_query_slice
 *					EVENTS:
 *						    devapt.container.render.begin: emitted on container render processing start
 *						    devapt.container.render.item: emitted on item render processing
 *						    devapt.container.render.end: emitted on container render processing end
 * @ingroup     DEVAPT_VIEWS
 * @date        2014-05-10
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define( [
	'Devapt', 'core/types', 'object/class',
	'views/view',
	'datas/model/view_model',
	'views/container/container-mixin-selectable',
	'views/container/container-mixin-filtered', 'views/container/container-mixin-pagination',
	'views/container/container-mixin-render-item', /*'views/container/mixin-get-nodes',*/
	'views/container/container-mixin-utils',
	/*'views/container/mixin-form', */'views/container/container-mixin-model-crud'],
function(
	Devapt, DevaptTypes, DevaptClass,
	DevaptView,
	DevaptViewModel,
	DevaptContainerMixinSelectable,
	DevaptMixinFiltered, DevaptMixinPagination,
	DevaptMixinRenderItem, /*DevaptMixinGetNodes,*/
	DevaptMixinContainerUtils,
	/*DevaptMixinForm, */DevaptMixinModelCrud)
{
	/**
	 * @public
	 * @class				DevaptContainer
	 * @desc				Container view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Get item node
	 * @param {integer}		arg_item_index	item index
	 * @return {object}		node jQuery object
	 */
	var cb_get_item_node = function(arg_item_index)
	{
		var self = this;
		
		
		var items_count = $(self.items_jquery_filter, self.items_jquery_parent).length;
		if (arg_item_index < 0 || arg_item_index >= items_count)
		{
			return null;
		}
		
		var node_jqo = $(self.items_jquery_filter, self.items_jquery_parent).eq(arg_item_index);
		// console.log(node_jqo, 'cb_get_item_node at [' + arg_item_index + ']');
		
		return node_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// DEBUG
		// console.log(self.parent_jqo, self.name + ':parent_jqo');
		// self.trace = true;
		
		// CONSTRUCTOR BEGIN
		var context = 'contructor(' + self.name + ')';
		// console.log(self, context);
		self.enter(context, '');
		
		
		
		// SET VIEW MODEL
		if ( ! DevaptTypes.is_object(self.view_model) || ! (Devapt.is_promise(self.view_model) || self.view_model.is_view_model) )
		{
			self.step(context, 'set view model');
			self.view_model = Devapt.create('ViewModel', {name:self.name + '_view_model', model_name:self.items_model_name, view:self, source:self.items_source, source_format:self.items_source_format});
		}
		
		
		// CALL SUPER CLASS CONSTRUCTOR
		// self._parent_class.infos.ctor(self);
		
		
		// SET ID
		if ( DevaptTypes.is_object(self.parent_jqo) )
		{
			self.step(context, 'has a parent node object');
			if ( DevaptTypes.is_not_empty_str(self.parent_html_id) )
			{
				self.step(context, 'has a parent node id');
				self.parent_jqo.attr('id', self.parent_html_id);
			}
		}
		
		
		// SEND EVENT
		self.fire_event('devapt.view.ready');
		
		
		// ON READY HANDLER
		if ( self.class_name === 'DevaptView')
		{
			self.step(context, 'self is a View base class');
			
			if ( DevaptTypes.is_function(self.on_ready) )
			{
				self.step(context, 'has on ready function');
				self.on_ready();
			}
		}
		
		
		
		self.is_container		= true;
		// self.status				= 'created';
		
		self.items_objects		= [];
		self.has_divider		= true;
		self.is_rendering		= false;
		self.renders_count		= 0;
		
		self.items_jquery_parent = null;
		self.items_jquery_filter = null;
		
		
		var has_unique_cb = true;
		// self.get_worker().then(
			// function(worker)
			// {
				// self.add_event_callback('devapt.query.updated', [self, self.on_query_event], has_unique_cb, null, null, worker);
				// self.add_event_callback('devapt.query.filters.added', [self, self.on_query_filters_event], has_unique_cb, null, null, worker);
			// }
		// );
		var worker = undefined;
		// self.add_event_callback('devapt.query.updated', [self, self.on_query_event], has_unique_cb, null, null, worker);
		// self.add_event_callback('devapt.query.filters.added', [self, self.on_query_filters_event], has_unique_cb, null, null, worker);
		
		
		// CONSTRUCTOR END
		self.leave(context, Devapt.msg_success);
	}
	
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Process query event
	 * @param {array}		arg_event_operands		event operands array
	 * @return {nothing}
	 */
	// var cb_on_query_event = function(arg_event_operands)
	// {
		// var self = this;
		// var context = 'on_query_event(opds)';
		// self.enter(context, '');
		
		
		
		// self.leave(context, Devapt.msg_default_empty_implementation);
	// }
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Process query filters event
	 * @param {array}		arg_event_operands		event operands array
	 * @return {nothing}
	 */
	// var cb_on_query_filters_event = function(arg_event_operands)
	// {
		// var self = this;
		// var context = 'on_query_filters_event(opds)';
		// self.enter(context, '');
		
		
		
		// self.leave(context, Devapt.msg_default_empty_implementation);
	// }
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Begin the render of the container
	 * @return {nothing}
	 */
	// var cb_render_begin = function()
	// {
		// var self = this;
		// var context = 'render_begin()';
		// self.enter(context, '');
		
		
		
		// self.leave(context, Devapt.msg_default_empty_implementation);
	// }
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Refresh of the container
	 * @param {object}		arg_deferred	deferred object
	 * @return {object}		rendering promise
	 */
	var cb_refresh = function(arg_deferred)
	{
		var self = this;
		var context = 'refresh()';
		self.enter(context, '');
		
		
		// CHECK DEFREERED
		if ( ! DevaptTypes.is_object(arg_deferred) )
		{
			arg_deferred = Devapt.defer();
		}
		
		// NOTHING TO DO : ALREADY IN RENDERING PROCESS
		if ( self.is_render_state_rendering() )
		{
			arg_deferred.resolve();
			
			self.leave(context, 'already in rendering mode');
			return Devapt.promise(arg_deferred);
		}
		
		
		// REFRESH
		// self.is_rendering = true;
		
		if (self.items_refresh.mode !== 'append')
		{
			self.remove_items();
		}
		
		// console.log('refresh', context);
		var items_count_before = $(self.items_jquery_filter, self.items_jquery_parent).length;
		var promise = self.render_items(arg_deferred);
		promise.then(
			function()
			{
				// self.is_rendering = false;
				
				if ( DevaptTypes.is_integer(self.items_refresh.frequency) )
				{
					var refresh_cb = function ()
					{
						var deferred = Devapt.defer();
						self.refresh(deferred);
					}
					
					setTimeout(refresh_cb, self.items_refresh.frequency*1000);
				}
				
				var items_count = $(self.items_jquery_filter, self.items_jquery_parent).filter('.devapt-container-visible').length;
				if (self.mixin_pagination_apply_count === 0 || items_count_before !== items_count)
				{
					self.fire_event('devapt.pagination.update_pagination', [0, items_count]);
				}
			}
		);
		
		
		self.leave(context, Devapt.msg_success);
		return promise
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				End the render of the container
	 * @return {nothing}
	 */
	var cb_render_end = function()
	{
		var self = this;
		var context = 'render_end()';
		self.enter(context, '');
		
		
		// CHILD CLASS RENEDRING
		if ( DevaptTypes.is_function(self.render_end_self) )
		{
			self.step(context, 'render_end_self');
			self.render_end_self();
		}
		
		// SELECT CURRENT RECORD
		if ( DevaptTypes.is_object(self.items_current_record) )
		{
			self.step(context, 'items_current_record is an object');
			
			// SELECT RECORD BY INDEX
			if ( DevaptTypes.is_integer(self.items_current_record.index) )
			{
				self.step(context, 'items_current_record.index is an integer');
				self.select(self.items_current_record.index);
			}
			else if ( DevaptTypes.is_string(self.items_current_record.index) )
			{
				self.step(context, 'items_current_record.index is a string');
				switch(self.items_current_record.index)
				{
					case 'first':
						self.step(context, 'select first item');
						// self.select_item_node(0);
						// console.log(self.view_model, 'select() self.view_model');
						// console.log(self.view_model.select, 'select() self.view_model.select');
						self.select(0);
						break;
					case 'last':
						self.step(context, 'select last item');
						var last_index = self.items_records_count > 0 ? self.items_records_count - 1 : 0;
						// self.select_item_node(last_index);
						self.select(last_index);
						break;
				}
			}
		}
		
		// AUTO REFRESH ITEMS
		if (self.items_refresh && self.items_refresh.mode && self.items_refresh.frequency && DevaptTypes.is_integer(self.items_refresh.frequency) )
		{
			self.step(context, 'auto refresh is enabled');
			
			var refresh_cb = function ()
			{
				var deferred = Devapt.defer();
				self.refresh(deferred);
			}
			
			setTimeout(refresh_cb, self.items_refresh.frequency*1000);
		}
		
		
		// UPDATE PAGINATION FOR THE FIRST RENDERING
		if (self.renders_count === 1)
		{
			self.step(context, 'update pagination');
			
			var update_pagination_cb = function()
			{
				var items_count = $(self.items_jquery_filter, self.items_jquery_parent).filter('.devapt-container-visible').length;
				self.fire_event('devapt.pagination.update_pagination', [0, items_count]);
			};
			// TODO WORKER
			// self.get_worker().then(
				// function(worker)
				// {
					// worker.add_task('update_pagination_cb', update_pagination_cb, { once:true });
				// }
			// );
			// setTimeout(update_pagination_cb, 200);
		}
		
		// FIRE EVENT
		self.fire_event('devapt.container.render.end');
		
		
		self.leave(context, Devapt.msg_success);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Render view
	 * @param {object}		arg_deferred	deferred object
	 * @return {object}		deferred promise object
	 */
	var cb_render_content_self = function()
	{
		var self = this;
		var context = 'render_content_self()';
		self.enter(context, '');
		
		
		// self.is_rendering = true;
		// console.log(self, 'render_self.self');
		
		// CHECK DEFEREED
		var arg_deferred = Devapt.defer();
		self.assert_not_null(context, 'arg_deferred', arg_deferred);
		
		// GET NODES
		self.assert_not_null(context, 'parent_jqo', self.parent_jqo);
		
		
		// SEND EVENT
		self.step(context, 'fire:devapt.container.render.begin');
		self.fire_event('devapt.container.render.begin');
		
		// RENDER BEGIN
		self.step(context, 'render begin');
		self.render_begin();
		
		// RENDER ITEMS AT FIRST TIME WITH AUTOLOAD FALSE
		self.renders_count++;
		self.value(context, 'renders_count', self.renders_count);
		self.value(context, 'items_autoload', self.items_autoload);
		if (self.renders_count === 1 && ! self.items_autoload)
		{
			self.step(context, 'renders_count=1 && autoload=false');
			
			// RENDER END
			self.render_end();
			arg_deferred.resolve();
			// self.is_rendering = false;
			// self.is_rendered = true;
			
			self.leave(context, Devapt.msg_success_promise);
			return Devapt.promise(arg_deferred);
		}
		
		self.step(context, 'not(renders_count=1 && autoload=false)');
		
		// RENDER ITEMS
		var items_promise = self.render_items(arg_deferred);
		items_promise.then(
			function()
			{
				self.step(context, 'render items promise');
				
				// RENDER END
				self.render_end();
				// self.is_rendering = false;
				// self.is_rendered = true;
				
				var items_count = $(self.items_jquery_filter, self.items_jquery_parent).filter('.devapt-container-visible').length;
				
				self.step(context, 'fire:devapt.pagination.update_pagination');
				self.fire_event('devapt.pagination.update_pagination', [0, items_count]);
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return items_promise;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Render view items
	 * @param {object}		arg_deferred	deferred object
	 * @return {object}		deferred promise object
	 */
	var cb_render_items = function(arg_deferred)
	{
		var self = this;
		var context = 'render_items(deferred)';
		self.enter(context, '');
		
		
		// GET ITEMS
		var items_promise = self.view_model.then(
			function(view_model)
			{
				self.step(context, 'view_model get items');
				
				return view_model.read();
			}
		);
		
		// GET ITEMS TYPES
		var types_promise = self.view_model.then(
			function(view_model)
			{
				self.step(context, 'view_model get types');
				
				return view_model.get_items_types_array();
			}
		);
		
		// WAITING FOR ITEMS AND TYPES
		var all_promise = Devapt.promise_all([items_promise, types_promise]);
		
		// PROCESS ITEMS
		var render_promise = all_promise.spread(
			function(recordset, types)
			{
				self.step(context, 'get items and types promise done');
				// console.log(recordset, self.name + '.' + context + '.recordset');
				
				var items = recordset.get_records();
				var items_count = items.length;
				self.items_records = items;
				self.items_records_count = items_count;
				
				var types_count = types.length;
				var default_type = null;
				self.value(context, 'types', types);
				
				// LOOP ON ITEMS
				self.step(context, 'loop on items');
				self.value(context, 'items_count', items_count);
				var item_index = 0;
				// var items_defers = []; // TODO USE ITEMS DEFERS ?
				for( ; item_index < items_count ; ++item_index)
				{
					self.step(context, 'loop on item at [' + item_index + ']');
					
					// GET CURRENT ITEM
					var item = items[item_index];
					self.value(context, 'item at [' + item_index + ']', item);
					// console.log(item, context + ':item');
					
					// GET CURRENT TYPE
					var type = default_type;
					if ( DevaptTypes.is_array(types) && types_count > item_index )
					{
						type = types[item_index];
						default_type = type;
					}
					if (item === 'divider')
					{
						type = 'divider';
					}
					if ( DevaptTypes.is_null(type) )
					{
						if ( DevaptTypes.is_array(item) )
						{
							type = 'record';
						}
						else if ( DevaptTypes.is_object(item) )
						{
							type = 'object';
						}
					}
					self.value(context, 'type at [' + item_index + ']', type);
					// console.log(type, context + ':type');
					
					if ( DevaptTypes.is_object(item) && type === 'view' && item.value )
					{
						item = item.value;
					}
					
					// RENDER CURRENT ITEM
					// var item_defer = Devapt.defer();
					// items_defers.push(item_defer); // TODO
					if ( ! self.render_item(arg_deferred, item, item_index, type) )
					{
						self.step(context, 'deferred.reject()');
						arg_deferred.reject();
						break;
					}
					
					// SEND EVENT
					self.step(context, 'fire event: devapt.container.render.item');
					self.fire_event('devapt.container.render.item', [item_index]);
				}
				
				
				// SEND EVENT
				// self.step(context, 'fire event: rendered.items');
				// self.fire_event('rendered.items');
				
				
				// RENDER IS RESOLVED
				if ( item_index === items_count )
				{
					self.step(context, 'get items and types promise done (END): render is resolved');
					return Devapt.promise_resolved();
				}
				
				
				// RENDER IS REJECTED: BAD ITEMS COUNT
				self.step(context, 'deferred.reject(): bad items count');
				self.step(context, 'get items and types promise done (END): render is rejected');
				return Devapt.promise_rejected();
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return render_promise;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	var cb_to_string_self = function()
	{
		var self = this;
		return 'container view class';
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-05-10',
			updated:'2014-12-06',
			description:' Container base class.'
		},
		properties:{
			
		},
		mixins:[DevaptContainerMixinSelectable]
	};
	var parent_class = DevaptView;
	var DevaptContainerClass = new DevaptClass('DevaptContainer', parent_class, class_settings);
	
	// METHODS
	DevaptContainerClass.infos.ctor = cb_constructor;
	// DevaptContainerClass.add_public_method('get_items_model', {}, cb_get_items_model);
	DevaptContainerClass.add_public_method('get_item_node', {}, cb_get_item_node);
	// DevaptContainerClass.add_public_method('on_query_event', {}, cb_on_query_event);
	// DevaptContainerClass.add_public_method('on_query_filters_event', {}, cb_on_query_filters_event);
	DevaptContainerClass.add_public_method('refresh', {}, cb_refresh);
	// DevaptContainerClass.add_public_method('render_begin', {}, cb_render_begin);
	DevaptContainerClass.add_public_method('render_end', {}, cb_render_end);
	DevaptContainerClass.add_public_method('render_content_self', {}, cb_render_content_self);
	DevaptContainerClass.add_public_method('render_items', {}, cb_render_items);
	DevaptContainerClass.add_public_method('to_string_self', {}, cb_to_string_self);
	
	// MIXINS
	DevaptContainerClass.add_public_mixin(DevaptMixinModelCrud);
	// DevaptContainerClass.add_public_mixin(DevaptMixinDatasource);
	// DevaptContainerClass.add_public_mixin(DevaptMixinForm);
	DevaptContainerClass.add_public_mixin(DevaptMixinFiltered);
	DevaptContainerClass.add_public_mixin(DevaptMixinPagination);
	DevaptContainerClass.add_public_mixin(DevaptMixinRenderItem);
	// DevaptContainerClass.add_public_mixin(DevaptMixinGetNodes);
	// DevaptContainerClass.add_public_mixin(DevaptMixinSelectItem);
	DevaptContainerClass.add_public_mixin(DevaptMixinContainerUtils);
	
	// PROPERTIES
	DevaptContainerClass.add_public_obj_property('view_model',	'view model', null, false, true, []);
	
	// DevaptContainerClass.add_public_obj_property('worker',	'tasks worker', null, false, true, []);
	
	DevaptContainerClass.add_public_bool_property('has_multiple_selection',	'', false, false, false, []);
	DevaptContainerClass.add_public_int_property('items_visible_count',	'', null, false, false, []);
	DevaptContainerClass.add_public_array_property('items_input_fields',	'', null, false, false, [], 'string', ',');
	DevaptContainerClass.add_public_object_property('filtered',	'', null, false, false, []);
	
	
	
	
	
	DevaptContainerClass.add_public_obj_property('items_model_obj',		'',	null, false, false, ['model']);
	DevaptContainerClass.add_public_str_property('items_model_name',		'', null, true, false, ['model_name']);
	
	DevaptContainerClass.add_public_bool_property('items_autoload',		'',	true, false, false, ['view_items_autoload']);
	DevaptContainerClass.add_public_str_property('items_source',			'', 'inline', false, false, ['view_items_source']); // inline / model / events / resources
	DevaptContainerClass.add_public_str_property('items_source_format',	'',	'array', false, false, ['view_items_source_format']); // json / array

	DevaptContainerClass.add_public_bool_property('items_distinct',		'',	false, false, false, []); // items are distinct ?
	DevaptContainerClass.add_public_str_property('items_distinct_field',	'',	null, false, false, []); // items are distinct with given field name
	DevaptContainerClass.add_public_str_property('items_iterator',			'', 'records', false, false, []); // items iterator : records / fields
	DevaptContainerClass.add_public_array_property('items_fields',			'', [], false, false, [], 'string', ','); // item fields
	
	DevaptContainerClass.add_public_str_property('items_format',			'', null, false, false, []); // item format
	DevaptContainerClass.add_public_array_property('items_formats',		'', null, false, false, [], 'string', ','); // item format
	
	DevaptContainerClass.add_public_obj_property('items_current_record',	'', null, false, false, []);
	DevaptContainerClass.add_public_obj_property('items_refresh',			'', null, false, false, []);
	
	DevaptContainerClass.add_public_array_property('items_records',		'',	[], false, false, [], 'object', ','); // items records
	DevaptContainerClass.add_public_int_property('items_records_count',	'',	0, false, false, []); // items records count
	
	DevaptContainerClass.add_public_array_property('items_inline',			'',	[], false, false, [], 'string', ',');
	DevaptContainerClass.add_public_array_property('items_options',		'',	[], false, false, [], 'string', ',');
	
	DevaptContainerClass.add_public_array_property('items_labels',			'',	[], false, false, [], 'string', ',');
	DevaptContainerClass.add_public_array_property('items_types',			'',	['view'], false, false, ['view_items_types'], 'string', ',');
	
	
	return DevaptContainerClass;
});