/**
 * @file        views/container.js
 * @desc        Container view base class (rendering, selection, view model, pagination, filtering, crud, input)
 *				API:
 *					INHERITS: View
 * 
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
 * 
 *					EVENTS:
 *						    devapt.container.refresh.begin: emitted on container refresh processing start
 *						    devapt.container.refresh.items_removed: emitted on items removed on container refresh
 *						    devapt.container.refresh.items_rendered: emitted on items rendered on container refresh
 *						    devapt.container.refresh.end: emitted on container render processing end
 * 
 *						    devapt.container.render.begin: emitted on container render processing start items_rendered
 *						    devapt.container.render.item: emitted on item render processing
 *						    devapt.container.render.end: emitted on container render processing end
 * 
 * 					METHODS:
 * 						->get_item_node(index): Look up a container item node by its index (jQuery node or null if not found)
 * 						->constructor(self): Build the class instance attributes (nothing)
 * 						->refresh(): Update container items (promise)
 * 						->render_end(): End the render of the container (nothing)
 * 						->render_content_self(): Render view self content (promise)
 * 						->render_items(): Render view items (promise)
 * 						->fill_items(): Fill view items for fields iterator (promise)
 * 						->to_string_self(): Dump the object to a string (string)
 * 
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
	'views/view', 'views/view/view-mixin-bind',
	'datas/model/view_model',
	'views/container/container-mixin-selectable',
	'views/container/container-mixin-filtered', 'views/container/container-mixin-pagination',
	'views/container/container-mixin-render-item', 'views/container/container-mixin-get-nodes',
	'views/container/container-mixin-utils',
	'views/container/container-mixin-input', 'views/container/container-mixin-model-crud'],
function(
	Devapt, DevaptTypes, DevaptClass,
	DevaptView, DevaptMixinBind,
	DevaptViewModel,
	DevaptContainerMixinSelectable,
	DevaptMixinFiltered, DevaptMixinPagination,
	DevaptMixinRenderItem, DevaptMixinGetNodes,
	DevaptMixinContainerUtils,
	DevaptMixinInput, DevaptMixinModelCrud)
{
	/**
	 * @public
	 * @class				DevaptContainer
	 * @desc				Container view base class (rendering, selection, view model, pagination, filtering, crud, input)
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Look up a container item node by its index and returns a jQuery node or null if not found
	 * @param {integer}		arg_item_index		item index
	 * @return {object}		jQuery node object
	 */
	var cb_get_item_node = function(arg_item_index)
	{
		var self = this;
		var context = 'get_item_node(' + arg_item_index + ')';
		self.enter(context, '');
		
		
		var items_count = $(self.items_jquery_filter, self.items_jquery_parent).length;
		if (arg_item_index < 0 || arg_item_index >= items_count)
		{
			self.leave(context, Devapt.msg_failure);
			return null;
		}
		
		var node_jqo = $(self.items_jquery_filter, self.items_jquery_parent).eq(arg_item_index);
		// console.log(node_jqo, 'cb_get_item_node at [' + arg_item_index + ']');
		
		self.leave(context, Devapt.msg_success);
		return node_jqo;
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// DEBUG
		self.trace = true;
		
		// CONSTRUCTOR BEGIN
		var context = 'DevaptContainer.contructor(' + self.name + ')';
		self.enter(context, '');
		
		
		// INIT CONTAINER ATTRIBUTES
		self.is_container			= true;
		self.items_objects			= [];
		self.has_divider			= true;
		self.is_rendering			= false;
		self.renders_count			= 0;
		self.items_jquery_parent	= null;
		self.items_jquery_filter	= null;
		
		
		// SET VIEW MODEL
		if ( ! DevaptTypes.is_object(self.view_model_promise) || ! (Devapt.is_promise(self.view_model_promise) || self.view_model_promise.is_view_model) )
		{
			self.step(context, 'set view model');
			var view_model_settings = {
				name:self.name + '_view_model',
				model_name:self.items_model_name,
				view:self,
				source:self.items_source,
				source_format:self.items_source_format};
			self.view_model_promise = Devapt.create('ViewModel', view_model_settings);
			self.view_model_promise.get('ready_promise').spread(
				function(arg_model, arg_view)
				{
					self.items_model_obj = arg_model;
				}
			)
		}
		
		
		// CONSTRUCTOR END
		self.leave(context, Devapt.msg_success);
	};
	
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Refresh of the container
	 * @return {object}		rendering promise
	 */
	var cb_refresh = function()
	{
		var self = this;
		var context = 'refresh()';
		self.enter(context, '');
		
		
		// NOTHING TO DO : ALREADY IN RENDERING PROCESS
		if ( self.is_render_state_rendering() )
		{
			self.leave(context, 'already in rendering mode');
			return Devapt.promise_resolved();
		}
		
		
		// BEGIN REFRESH PROCESS
		self.fire_event('devapt.container.refresh.begin');
		
		
		// TEST IF WE NEED TO REMOVE EXISTING ITEMS
		if (self.items_refresh.mode !== 'append')
		{
			self.remove_items();
			self.fire_event('devapt.container.refresh.items_removed');
		}
		
		
		// GET CURRENT ITEMS COUNT
		var items_count_before = $(self.items_jquery_filter, self.items_jquery_parent).length;
		
		
		// UPDATE QUERY SLICE TO QUERY NEW ITEMS TO APPEND
		var slice_promise = Devapt.promise_resolved();
		if (self.items_refresh.mode === 'append')
		{
			slice_promise = self.view_model_promise.then(
				function(view_model)
				{
					self.step(context, 'view_model is found');
					
					return view_model.ready_promise.then(
						function()
						{
							view_model.recordset.query.slice = {};
							view_model.recordset.query.slice.offset = items_count_before + 1;
							view_model.recordset.query.slice.length = 999999999;
							
//							console.log(view_model.recordset.query, self.name + '.' + context + '.view_model update slice');
							
							return view_model;
						}
					);
				}
			);
		}
		
		
		// READ AND RENDER ITEMS
		var promise = slice_promise.then(
			function()
			{
				return self.render_items(arg_deferred);
			}
		);
		promise.then(
			function()
			{
				self.fire_event('devapt.container.refresh.items_rendered');
				
				if ( DevaptTypes.is_integer(self.items_refresh.frequency) )
				{
					var refresh_cb = function ()
					{
						return self.refresh();
					}
					
					setTimeout(refresh_cb, self.items_refresh.frequency*1000);
				}
				
				var items_count = $(self.items_jquery_filter, self.items_jquery_parent).filter('.devapt-container-visible').length;
				if (self.mixin_pagination_apply_count === 0 || items_count_before !== items_count)
				{
					self.fire_event('devapt.pagination.update_pagination', [ {'begin':0, 'end':items_count} ]);
				}
			}
		);
		
		
		// END REFRESH PROCESS
		self.fire_event('devapt.container.refresh.end');
		
		
		self.leave(context, Devapt.msg_success);
		return promise
	};
	
	
	
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
						// console.log(self.view_model_promise, 'select() self.view_model_promise');
						// console.log(self.view_model_promise.select, 'select() self.view_model_promise.select');
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
				return self.refresh();
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
				self.fire_event('devapt.pagination.update_pagination', [ { 'begin':0, 'end':items_count} ]);
			};
			update_pagination_cb();
		}
		
		
		// FIRE EVENT
		self.fire_event('devapt.container.render.end');
		
		
		self.leave(context, Devapt.msg_success);
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Render view self content
	 * @return {object}		deferred promise object
	 */
	var cb_render_content_self = function()
	{
		var self = this;
		var context = 'render_content_self()';
		self.enter(context, '');
		
		
		// CHECK DEFEREED
		var arg_deferred = Devapt.defer();
		self.assert_not_null(context, 'arg_deferred', arg_deferred);
		
		// CHECK PARENT NODE
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
				
				// INIT CONTAINER BINDINGS
				var init_bind_promise = self.enable_bindings();
				init_bind_promise.then(
					function()
					{
						// RENDER END
						self.render_end();
						
						// UPDATE PAGINATION
						self.step(context, 'fire:devapt.pagination.update_pagination');
						
						var items_count = $(self.items_jquery_filter, self.items_jquery_parent).filter('.devapt-container-visible').length;
						
						self.fire_event('devapt.render.content', [items_count]);
						self.fire_event('devapt.pagination.update_pagination', [ {'begin':0, 'end':items_count} ]);
					}
				);
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return items_promise;
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Render view items
	 * @return {object}		deferred promise object
	 */
	var cb_render_items = function()
	{
		var self = this;
		var context = 'render_items()';
		self.enter(context, '');
		
		
		// GET ITEMS
		var items_promise = self.view_model_promise.then(
			function(view_model)
			{
				self.step(context, 'view_model get items');
//				console.log(view_model, self.name + '.' + context + '.view_model');
				
				return view_model.ready_promise.then(
					function()
					{
						self.step(context, 'view_model is ready');
						
						return view_model.reload().then(
							function(recordset)
							{
//								console.log(recordset, context + ':recordset');
								
								var items = view_model.get_values();
								
//								console.log(items, context + ':items');
								
								return items;
							}
						);
					}
				);
			}
		);
		
		// GET ITEMS TYPES
		var types_promise = self.view_model_promise.then(
			function(view_model)
			{
				self.step(context, 'view_model get types');
				
				return view_model.ready_promise.then(
					function()
					{
						self.step(context, 'view_model get types array');
						
						return view_model.get_items_types();
					}
				);
			}
		);
		
		// WAITING FOR ITEMS AND TYPES
		var all_promise = Devapt.promise_all([items_promise, types_promise]);
		
		// PROCESS ITEMS
		var render_promise = all_promise.spread(
			function(items, types)
			{
				self.step(context, 'get items and types promise done');
//				console.log(recordset, self.name + '.' + context + '.recordset');
//				console.log(items, self.name + '.' + context + '.items');
//				console.log(types, self.name + '.' + context + '.types');
				
				try
				{
					var items_count = items.length;
					self.items_records = items;
					self.items_records_count = items_count;
//					self.value(context, 'items', items);
					self.value(context, 'items_count', items_count);
					
					var types_count = types.length;
					var default_type = null;
					self.value(context, 'types', types);
					
					// LOOP ON ITEMS
					self.step(context, 'loop on items');
					var item_index = 0;
					// var items_defers = []; // TODO USE ITEMS DEFERS ?
					for( ; item_index < items_count ; ++item_index)
					{
						self.step(context, 'loop on item at [' + item_index + ']');
						
						// GET CURRENT ITEM
						var item = items[item_index];
						item = item.is_record ? item.get_datas() : item;
						// self.value(context, 'item at [' + item_index + ']', item);
//						console.debug(item, context + ':item');
						
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
						// TODO REMOVE DEFERRED
						var arg_deferred = Devapt.defer();
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
					self.step(context, 'fire event: rendered.items');
					self.fire_event('rendered.items');
					
					
					// RENDER IS RESOLVED
					if ( item_index === items_count )
					{
						self.step(context, 'get items and types promise done (END): render is resolved');
						return Devapt.promise_resolved();
					}
				}
				catch(e)
				{
					console.error(e, context + ':PROCESS ITEMS');
				}
				
				
				// RENDER IS REJECTED: BAD ITEMS COUNT
				self.step(context, 'deferred.reject(): bad items count');
				self.step(context, 'get items and types promise done (END): render is rejected');
				return Devapt.promise_rejected();
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return render_promise;
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Fill view items for fields iterator
	 * @return {object}		deferred promise object
	 */
	var cb_fill_items = function()
	{
		var self = this;
		var context = 'fill_items()';
		self.enter(context, '');
		
		
		self.assert_true(context, 'item_iterator is fields', self.items_iterator === 'fields');
		
		var items_promise = self.view_model_promise.then(
			function(view_model)
			{
				self.step(context, 'view_model is found');
				
				return view_model.ready_promise.then(
					function()
					{
						self.step(context, 'view_model is ready');
						
						self.assert_not_empty_array(context, 'selection', view_model.selection);
						
						// TODO FILL ITEMS
					}
				);
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return items_promise;
	};
	
	
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
	};
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-05-10',
			updated:'2015-05-24',
			description:' Container view base class (rendering, selection, view model, pagination, filtering, crud, input).'
		},
		properties:{
		},
		mixins:[DevaptContainerMixinSelectable, DevaptMixinModelCrud, DevaptMixinFiltered, DevaptMixinPagination,
			DevaptMixinRenderItem, DevaptMixinGetNodes, DevaptMixinContainerUtils, DevaptMixinInput]
	};
	var parent_class = DevaptView;
	var DevaptContainerClass = new DevaptClass('DevaptContainer', parent_class, class_settings);
	
	
	// METHODS
	DevaptContainerClass.infos.ctor = cb_constructor;
	
	DevaptContainerClass.add_public_method('get_item_node', {
		description:'Look up a container item node by its index and returns a jQuery node or null if not found',
		operands:[{type:'integer',default:null,mutable:false}],
		result:{type:'jQuery object',default_value:null,failure_value:null}
	}, cb_get_item_node);
	
	DevaptContainerClass.add_public_method('refresh', {
		description:'Update container items',
		operands:[],
		result:{type:'promise object',default_value:'rejected promise',failure_value:'rejected promise'}
	}, cb_refresh);
	
	DevaptContainerClass.add_public_method('render_end', {
		description:'End the render of the container',
		operands:[],
		result:{type:'nothing',default_value:'nothing',failure_value:'nothing'}
	}, cb_render_end);
	
	DevaptContainerClass.add_public_method('render_content_self', {}, cb_render_content_self);
	DevaptContainerClass.add_public_method('render_items', {}, cb_render_items);
	
	DevaptContainerClass.add_public_method('fill_items', {}, cb_fill_items);
	
	DevaptContainerClass.add_public_method('to_string_self', {}, cb_to_string_self);
	
	
	// PROPERTIES
	DevaptContainerClass.add_public_obj_property('view_model_promise',	'view model', null, false, true, []);
	
	DevaptContainerClass.add_public_bool_property('selection_enabled',	'', false, false, false, []);
	DevaptContainerClass.add_public_bool_property('has_multiple_selection',	'', false, false, false, []);
	DevaptContainerClass.add_public_int_property('items_visible_count',	'', null, false, false, []);
	DevaptContainerClass.add_public_array_property('items_input_fields',	'', null, false, false, [], 'string', ',');
	DevaptContainerClass.add_public_object_property('filtered',	'', null, false, false, []);
	
	
	DevaptContainerClass.add_public_obj_property('items_model_obj',			'',	null, false, false, ['model']);
	DevaptContainerClass.add_public_str_property('items_model_name',		'', null, true, false, ['model_name']);
	
	DevaptContainerClass.add_public_bool_property('items_autoload',			'',	true, false, false, ['view_items_autoload']);
	DevaptContainerClass.add_public_str_property('items_source',			'', 'inline', false, false, ['view_items_source']); // inline / model / events / resources
	DevaptContainerClass.add_public_str_property('items_source_format',		'',	'array', false, false, ['view_items_source_format']); // json / array

	DevaptContainerClass.add_public_bool_property('items_distinct',			'',	false, false, false, []); // items are distinct ?
	DevaptContainerClass.add_public_str_property('items_distinct_field',	'',	null, false, false, []); // items are distinct with given field name
	DevaptContainerClass.add_public_str_property('items_iterator',			'', 'records', false, false, []); // items iterator : records / fields
	DevaptContainerClass.add_public_array_property('items_fields',			'', [], false, false, [], 'string', ','); // item fields
	
	DevaptContainerClass.add_public_str_property('items_format',			'', null, false, false, []); // item format
	DevaptContainerClass.add_public_array_property('items_formats',			'', null, false, false, [], 'string', ','); // item format
	
	DevaptContainerClass.add_public_obj_property('items_current_record',	'Current record index as { index:12 } or { index:"first|last" }', null, false, false, []);
	DevaptContainerClass.add_public_obj_property('items_refresh',			'', null, false, false, []);
	
	DevaptContainerClass.add_public_array_property('items_records',			'',	[], false, false, [], 'object', ','); // items records
	DevaptContainerClass.add_public_int_property('items_records_count',		'',	0, false, false, []); // items records count
	
	DevaptContainerClass.add_public_array_property('items_inline',			'',	[], false, false, [], 'string', ',');
	DevaptContainerClass.add_public_array_property('items_options',			'',	[], false, false, [], 'string', ',');
	
	DevaptContainerClass.add_public_array_property('items_labels',			'',	[], false, false, [], 'string', ',');
	DevaptContainerClass.add_public_array_property('items_types',			'',	['view'], false, false, ['view_items_types'], 'string', ',');
	
	
	return DevaptContainerClass;
});