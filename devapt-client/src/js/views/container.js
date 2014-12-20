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
 * @ingroup     DEVAPT_CORE
 * @date        2014-05-10
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/class', 'core/template',
	'datas/mixin-datasource', 'datas/mixin-get-model', 'datas/mixin-query',
	'views/view',
	'views/container/mixin-filtered', 'views/container/mixin-pagination',
	'views/container/mixin-render-items', 'views/container/mixin-get-nodes',
	'views/container/mixin-select-item', 'views/container/mixin-container-utils',
	'views/container/mixin-form'],
function(Devapt, DevaptTypes, DevaptClass, DevaptTemplate,
	DevaptMixinDatasource, DevaptMixinGetModel, DevaptMixinQuery,
	DevaptView,
	DevaptMixinFiltered, DevaptMixinPagination,
	DevaptMixinRenderItems, DevaptMixinGetNodes,
	DevaptMixinSelectItem, DevaptMixinContainerUtils,
	DevaptMixinForm)
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
	 * @desc				Get items model
	 * @return {promise}
	 */
	var cb_get_items_model = function()
	{
		var self = this;
		var promise = self.get_model('items_model_name', 'items_model');
		promise.done(
			function(model)
			{
				self.items_model_obj = model;
			}
		);
		
		return promise;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// CONSTRUCTOR BEGIN
		var context = 'contructor(' + self.name + ')';
		// console.log(self, context);
		self.enter(context, '');
		
		
		// self.trace = true;
		
		
		// CALL SUPER CLASS CONSTRUCTOR
		// self._parent_class.infos.ctor(self);
		
		// REGISTER THE VIEW TO THE REPOSITORY
		// DevaptResources.add_resource_instance(self);
		
		// SET ID
		if ( DevaptTypes.is_object(self.parent_jqo) )
		{
			if ( DevaptTypes.is_not_empty_str(self.parent_html_id) )
			{
				self.parent_jqo.attr('id', self.parent_html_id);
			}
		}
		
		// SEND EVENT
		self.fire_event('devapt.view.ready');
		
		// ON READY HANDLER
		if ( self.class_name === 'DevaptView')
		{
			if ( DevaptTypes.is_function(self.on_ready) )
			{
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
		self.add_event_callback('devapt.query.updated', [self, self.on_query_event], has_unique_cb);
		self.add_event_callback('devapt.query.filters.added', [self, self.on_query_filters_event], has_unique_cb);
		
		
		// CONSTRUCTOR END
		self.leave(context, self.msg_success);
	}
	
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Process query event
	 * @param {array}		arg_event_operands		event operands array
	 * @return {nothing}
	 */
	var cb_on_query_event = function(arg_event_operands)
	{
		var self = this;
		var context = 'on_query_event(opds)';
		self.enter(context, '');
		
		
		
		self.leave(context, self.msg_default_empty_implementation);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Process query filters event
	 * @param {array}		arg_event_operands		event operands array
	 * @return {nothing}
	 */
	var cb_on_query_filters_event = function(arg_event_operands)
	{
		var self = this;
		var context = 'on_query_filters_event(opds)';
		self.enter(context, '');
		
		
		
		self.leave(context, self.msg_default_empty_implementation);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Begin the render of the container
	 * @return {nothing}
	 */
	var cb_render_begin = function()
	{
		var self = this;
		var context = 'render_begin()';
		self.enter(context, '');
		
		
		
		self.leave(context, self.msg_default_empty_implementation);
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
			self.render_end_self();
		}
		
		// SELECT CURRENT RECORD
		if ( DevaptTypes.is_object(self.items_current_record) )
		{
			// SELECT RECORD BY INDEX
			if ( DevaptTypes.is_integer(self.items_current_record.index) )
			{
				self.select_item_node(self.items_current_record.index);
			}
			else if ( DevaptTypes.is_string(self.items_current_record.index) )
			{
				switch(self.items_current_record.index)
				{
					case 'first':
						self.select_item_node(0);
						break;
					case 'last':
						self.select_item_node(self.items_records_count > 0 ? self.items_records_count - 1 : 0);
						break;
				}
			}
		}
		
		// AUTO REFRESH ITEMS
		if (self.items_refresh && self.items_refresh.mode && self.items_refresh.frequency && DevaptTypes.is_integer(self.items_refresh.frequency) )
		{
			var refresh_cb = function ()
			{
				// console.log(self.name, 'refresh');
				
				if ( ! self.is_rendering )
				{
					var deferred = $.Deferred();
					
					self.is_rendering = true;
					
					if (self.items_refresh.mode !== 'append')
					{
						self.remove_items();
					}
					
					// console.log('render_items call', context);
					var items_count_before = $(self.items_jquery_filter, self.items_jquery_parent).length;
					var promise = self.render_items(deferred);
					promise.done(
						function()
						{
							self.is_rendering = false;
							
							setTimeout(refresh_cb, self.items_refresh.frequency*1000);
							
							var items_count = $(self.items_jquery_filter, self.items_jquery_parent).filter('.devapt-container-visible').length;
							if (self.mixin_pagination_apply_count === 0 || items_count_before !== items_count)
							{
								self.fire_event('devapt.pagination.update_pagination', [0, items_count]);
							}
						}
					);
				}
			};
			
			setTimeout(refresh_cb, self.items_refresh.frequency*1000);
		}
		
		// UPDATE PAGINATION FOR THE FIRST RENDERING
		if (self.renders_count === 1)
		{
			var update_pagination_cb = function()
			{
				var items_count = $(self.items_jquery_filter, self.items_jquery_parent).filter('.devapt-container-visible').length;
				self.fire_event('devapt.pagination.update_pagination', [0, items_count]);
			};
			setTimeout(update_pagination_cb, 200);
		}
		
		// FIRE EVENT
		self.fire_event('devapt.container.render.end');
		
		
		self.leave(context, self.msg_success);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Render view
	 * @param {object}		arg_deferred	deferred object
	 * @return {object}		deferred promise object
	 */
	var cb_render_self = function(arg_deferred)
	{
		var self = this;
		var context = 'render_self(deferred)';
		self.enter(context, '');
		
		
		self.is_rendering = true;
		// console.log(self, 'container.' + context);
		
		// CHECK DEFEREED
		self.assertNotNull(context, 'arg_deferred', arg_deferred);
		
		// GET NODES
		self.assertNotNull(context, 'parent_jqo', self.parent_jqo);
		
		
		// SEND EVENT
		self.fire_event('devapt.container.render.begin');
		
		// RENDER BEGIN
		self.render_begin();
		
		// RENDER ITEMS AT FIRST TIME WITH AUTOLOAD FALSE
		self.renders_count++;
		if (self.renders_count === 1 && ! self.items_autoload)
		{
			// RENDER END
			self.render_end();
			arg_deferred.resolve();
			self.is_rendering = false;
			
			self.leave(context, self.msg_success_promise);
			return arg_deferred.promise();
		}
		
		// RENDER ITEMS
		var items_promise = self.render_items(arg_deferred);
		items_promise.done(
			function()
			{
				// RENDER END
				self.render_end();
				self.is_rendering = false;
				
				var items_count = $(self.items_jquery_filter, self.items_jquery_parent).filter('.devapt-container-visible').length;
				self.fire_event('devapt.pagination.update_pagination', [0, items_count]);
			}
		);
		
		
		self.leave(context, self.msg_success_promise);
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
		
		
		// GET ITEMS FROM SOURCE
		var items_promise = self.get_items_array();
		// console.log(items_promise, context + '[' + self.name + ']:items_promise');
		items_promise.then(
			function(items)
			{
				self.step(context, 'get items promise done');
				// console.log(items, self.name + '.' + context + ':container.items');
				
				var items_count = items.length;
				
				
				// GET ITEMS TYPES
				var types_promise = self.get_items_types_array();
				// console.log(types_promise, self.name + '.' + context + 'types_promise');
				
				types_promise.done(
					function(types)
					{
						// self.trace = true;
						self.step(context, 'get items types promise done');
						var types_count = types.length;
						var default_type = null;
						self.value(context, 'types', types);
						
						// LOOP ON ITEMS
						var item_index = 0;
						for( ; item_index < items_count ; ++item_index)
						{
							self.step(context, 'loop on item at [' + item_index + ']');
							
							// GET CURRENT ITEM
							var item = items[item_index];
							self.value(context, 'item at [' + item_index + ']', item);
							
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
							
							// RENDER CURRENT ITEM
							if ( ! self.render_item(arg_deferred, item, item_index, type) )
							{
								self.step(context, 'deferred.reject()');
								arg_deferred.reject();
								break;
							}
							
							// SEND EVENT
							self.fire_event('devapt.container.render.item', [item_index]);
						}
					
					
						// LOOP COMPLETES
						if ( item_index === items_count )
						{
							self.step(context, 'deferred.resolve()');
							arg_deferred.resolve();
						}
						
						
						// RESOLVE AND GET PROMISE
						var promise = arg_deferred.promise();
						
						
						// SEND EVENT
						self.fire_event('rendered.items');
						
						return promise;
					}
				);
			}
		);
		
		
		self.leave(context, self.msg_success_promise);
		return items_promise;
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
			
		}
	};
	var parent_class = DevaptView;
	var DevaptContainerClass = new DevaptClass('DevaptContainer', parent_class, class_settings);
	
	// METHODS
	DevaptContainerClass.infos.ctor = cb_constructor;
	DevaptContainerClass.add_public_method('get_items_model', {}, cb_get_items_model);
	DevaptContainerClass.add_public_method('on_query_event', {}, cb_on_query_event);
	DevaptContainerClass.add_public_method('on_query_filters_event', {}, cb_on_query_filters_event);
	DevaptContainerClass.add_public_method('render_begin', {}, cb_render_begin);
	DevaptContainerClass.add_public_method('render_end', {}, cb_render_end);
	DevaptContainerClass.add_public_method('render_self', {}, cb_render_self);
	DevaptContainerClass.add_public_method('render_items', {}, cb_render_items);
	DevaptContainerClass.add_public_method('to_string_self', {}, cb_to_string_self);
	
	// MIXINS
	DevaptContainerClass.add_public_mixin(DevaptMixinQuery);
	DevaptContainerClass.add_public_mixin(DevaptMixinGetModel);
	DevaptContainerClass.add_public_mixin(DevaptMixinDatasource);
	DevaptContainerClass.add_public_mixin(DevaptMixinForm);
	DevaptContainerClass.add_public_mixin(DevaptMixinFiltered);
	DevaptContainerClass.add_public_mixin(DevaptMixinPagination);
	DevaptContainerClass.add_public_mixin(DevaptMixinRenderItems);
	DevaptContainerClass.add_public_mixin(DevaptMixinGetNodes);
	DevaptContainerClass.add_public_mixin(DevaptMixinSelectItem);
	DevaptContainerClass.add_public_mixin(DevaptMixinContainerUtils);
	
	// PROPERTIES
	DevaptContainerClass.add_public_array_property('items_input_fields',	'', null, false, false, [], 'string', ',');
	DevaptContainerClass.add_property_record(
		{
			name: 'filtered',
			type: 'object',
			visibility:'pulic',
			is_public:true,
			default_value: null,
			array_separator: '',
			array_type: '',
			format: '',
			is_required: false,
			children: {
				
			},
			aliases: []
		}
	);
	
	
	return DevaptContainerClass;
});