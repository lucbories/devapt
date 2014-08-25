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
 *							items_model
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
['Devapt', 'views/view', 'core/types', 'core/options', 'core/classes'],
function(Devapt, DevaptView, DevaptTypes, DevaptOptions, DevaptClasses)
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
	function DevaptContainer(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_parent_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptContainer';
		self.is_view			= true;
		self.is_container		= true;
		self.items_objects		= [];
		self.has_divider		= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptContainer_contructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context = 'contructor(' + arg_name + ')';
			self.enter(context, '');
			
			
			// INIT OPTIONS
			var init_option_result = DevaptOptions.set_options_values(self, arg_options, false);
			if (! init_option_result)
			{
				self.error(context + ': init options failure');
			}
			
			// PREPARE OPTIONS
			if ( self.items_inline && self.items_options && self.items_options.length >= self.items_inline.length)
			{
				self.step(context, 'register items options');
				
				var index = 0;
				for(index = 0 ; index < self.items_options.length ; index++)
				{
					var item_options = self.items_options[index];
					
					if ( DevaptTypes.is_object(item_options) )
					{
						continue;
					}
					
					if ( DevaptTypes.is_string(item_options) )
					{
						// console.log(item_options, 'item_options str');
						var item_options_array = item_options.split('=');
						if ( item_options_array.length === 2 )
						{
							var item_options_obj = {};
							item_options_obj[ item_options_array[0] ] = item_options_array[1];
							self.items_options[index] = item_options_obj;
							continue;
						}
					}
					
					self.items_options[index] = { value: item_options };
				}
			}
			
			// CONSTRUCTOR END
			self.leave(context, self.msg_success);
		}
		
		
		// CONTRUCT INSTANCE
		self.DevaptContainer_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Begin the render of the container
		 * @return {nothing}
		 */
		self.render_begin = function()
		{
			var self = this;
			var context = 'render_begin()';
			self.enter(context, '');
			
			
			
			self.leave(context, DevaptObject.msg_default_empty_implementation);
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				End the render of the container
		 * @return {nothing}
		 */
		self.render_end = function()
		{
			var self = this;
			var context = 'render_end()';
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_default_empty_implementation);
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Get the item options at given index
		 * @param {integer} 	arg_item_index		item index
		 * @param {object} 		arg_item_defaults	item default options
		 * @return {object}		options map
		 */
		self.get_item_options = function(arg_item_index, arg_item_defaults)
		{
			var self = this;
			var context = 'get_item_options(index)';
			self.enter(context, '');
			
			
			// INIT DEFAULT OPTIONS RECORD
			var options = arg_item_defaults ? arg_item_defaults : {};
			
			// GET GIVEN OPTIONS RECORD
			if ( DevaptTypes.is_not_empty_array(self.items_options) && self.items_options[arg_item_index] )
			{
				var item_options = self.items_options[arg_item_index];
				
				if ( DevaptTypes.is_string(item_options) )
				{
					var options_parts = item_options.split('|');
					for(part_index in options_parts)
					{
						var record_part_str = options_parts[part_index];
						var record_part = record_part_str.split('=');
						if ( DevaptTypes.is_not_empty_array(record_part) && record_part.length === 2 )
						{
							var option_key = record_part[0];
							var option_value = record_part[1];
							options[option_key] = option_value;
						}
					}
				}
				else if ( DevaptTypes.is_object(item_options) )
				{
					for(option_key in item_options)
					{
						options[option_key] = item_options[option_key];
					}
				}
				else
				{
					console.log(item_options, 'container.item_options is unknow');
				}
			}
			
			// UPDATE OPTIONS RECORD WITH GIVEN LABELS
			if ( DevaptTypes.is_not_empty_array(self.items_labels) && self.items_labels.length > arg_item_index )
			{
				options.label = self.items_labels[arg_item_index];
			}
			
			
			self.leave(context, self.msq_success);
			return options;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Render an empty item node
		 * @param {integer} 	arg_item_index		item index
		 * @return {object}		jQuery object node
		 */
		self.render_item_node = function(arg_item_index)
		{
			var self = this;
			var context = 'render_item_node(index)';
			self.enter(context, '');
			
			// NOT IMPLEMENTED HERE
			
			self.leave(context, self.msg_default_empty_implementation);
			return $('<div>');
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Render an divider item content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		self.render_item_divider = function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_divider(deferred,jqo,content)';
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Render an item HTML content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		self.render_item_html = function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_html(deferred,jqo,content)';
			self.enter(context, '');
			
			arg_item_jqo.html(arg_item_content);
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Render an item TEXT content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		self.render_item_text = function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_text(deferred,jqo,content)';
			self.enter(context, '');
			
			var span_jqo = $('<span>');
			span_jqo.html(arg_item_content);
			arg_item_jqo.append(span_jqo);
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Render an item VIEW content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		self.render_item_view = function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_view(deferred,jqo,content)';
			self.enter(context, '');
			
			
			// GET CURRENT BACKEND
			var backend = Devapt.get_current_backend();
			self.assertNotNull(context, 'backend', backend);
			
			// RENDER VIEW
			arg_deferred.then( backend.render_view(arg_item_jqo, arg_item_content) );
			
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Render an item OBJECT content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		self.render_item_object = function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_object(deferred,jqo,content)';
			self.enter(context, '');
			
			// TODO render_item_object
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Render an item RECORD content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		self.render_item_record = function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_record(deferred,jqo,content)';
			self.enter(context, '');
			
			// TODO render_item_record
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Render an item CALLBACK content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		self.render_item_callback = function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_callback(deferred,jqo,content)';
			self.enter(context, '');
			
			// TODO render_item_object
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				End the render of the container
		 * @param {object}			arg_deferred		deferred object
		 * @param {string|object}	arg_item_content	item content
		 * @param {integer} 		arg_item_index		item index
		 * @param {string} 			arg_item_type		item type
		 * @return {boolean}
		 */
		self.render_item = function(arg_deferred, arg_item_content, arg_item_index, arg_item_type)
		{
			var self = this;
			var context = 'render_item(deferred,content,index,type)';
			self.enter(context, '');
			
			
			// CREATE EMPTY ITEMNODE
			var node_jqo = self.render_item_node(arg_item_index);
			
			// FILL ITEM NODE
			switch(arg_item_type)
			{
				case 'divider':
				{
					if ( ! self.has_divider )
					{
						self.leave(context, 'bad divider item');
						return false;
					}
					self.assertFunction(context, 'self.render_item_divider', self.render_item_divider);
					node_jqo = self.render_item_divider(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'html':
				{
					self.assertFunction(context, 'self.render_item_html', self.render_item_html);
					node_jqo = self.render_item_html(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'text':
				{
					self.assertFunction(context, 'self.render_item_text', self.render_item_text);
					node_jqo = self.render_item_text(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'view':
				{
					self.assertFunction(context, 'self.render_item_view', self.render_item_view);
					node_jqo = self.render_item_view(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'object':
				{
					self.assertFunction(context, 'self.render_item_object', self.render_item_object);
					node_jqo = self.render_item_object(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'record':
				{
					self.assertFunction(context, 'self.render_item_record', self.render_item_record);
					
					// ITEM RECORD
					var record = arg_item_content;
					if ( ! DevaptTypes.is_array(arg_item_content) )
					{
						if ( DevaptTypes.is_string(arg_item_content) )
						{
							record = arg_item_content.split('|', arg_item_content);
						}
					}
					
					node_jqo = self.render_item_record(arg_deferred, node_jqo, record);
					break;
				}
				case 'callback':
				{
					self.assertFunction(context, 'self.render_item_callback', self.render_item_callback);
					node_jqo = self.render_item_callback(arg_deferred, node_jqo, arg_item_content);
					break;
				}
			}
			
			// APPEND ITEM NODE
			var record = {
				index: arg_item_index,
				type: arg_item_type,
				position: false,
				is_active:false,
				width: false,
				heigth: false,
				node: node_jqo
			};
			self.append_item_node(node_jqo, record);
			self.items_objects.push(record);
			
			
			self.leave(context, self.msg_success);
			return true;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Append an item to the view
		 * @param {object}		arg_item_jqo		item jQuery object
		 * @param {object}		arg_item_record		item record
		 * @return {nothing}
		 */
		self.append_item_node = function(arg_item_jqo, arg_item_record)
		{
			var self = this;
			var context = 'append_item_node(item node, record)';
			self.enter(context, '');
			
			
			self.content_jqo.append(arg_item_jqo);
			
			
			self.leave(context, self.msg_success);
			return true;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Get items array
		 * @return {array}
		 */
		self.get_items_array = function()
		{
			var self = this;
			var context = 'get_items_array()';
			self.enter(context, '');
			
			
			var items = [];
			
			// GET ITEMS FROM SOURCE
			if ( self.items_source === 'inline' )
			{
				if ( self.items_source_format === 'json' )
				{
					var json_str = self.items_inline.join(',');
					var json_obj = $.parseJSON(json_str);
					console.log(json_obj);
					items = json_obj;
				}
				else
				{
					items = self.items_inline;
				}
			}
			
			// GET ITEM FROM MODEL
			if ( self.items_source === 'model' )
			{
			}
			
			
			self.leave(context, self.msg_success);
			return items;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Get items types array
		 * @return {array}
		 */
		self.get_items_types_array = function()
		{
			var self = this;
			var context = 'get_items_types_array()';
			self.enter(context, '');
			
			
			var types = [];
			
			// GET ITEMS TYPES FROM SOURCE
			if ( self.items_source === 'inline' )
			{
				if ( DevaptTypes.is_not_empty_array(self.items_types) )
				{
					types = self.items_types;
				}
			}
			
			
			self.leave(context, self.msg_success);
			return types;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Render view
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		self.render_self = function(arg_deferred)
		{
			var self = this;
			var context = 'render_self(deferred)';
			self.enter(context, '');
			
			
			// CHECK DEFEREED
			self.assertNotNull(context, 'arg_deferred', arg_deferred);
			
			// GET NODES
			self.assertNotNull(context, 'parent_jqo', self.parent_jqo);
			
			
			// SEND EVENT
			self.fire_event('devapt.container.render.begin');
			
			// RENDER BEGIN
			self.render_begin();
			
			
			
			// GET ITEMS FROM SOURCE
			var items = self.get_items_array();
			var items_count = items.length;
			
			// GET ITEMS TYPES
			var types = self.get_items_types_array();
			var types_count = types.length;
			var default_type = null;
			
			// LOOP ON ITEMS
			var item_index = 0;
			for( ; item_index < items_count ; ++item_index)
			{
				// GET CURRENT ITEM
				var item = items[item_index];
				
				// GET CURRENT TYPE
				var type = default_type;
				if ( DevaptTypes.is_array(types) && types_count > item_index )
				{
					type = self.items_types[item_index];
					default_type = type;
				}
				if (item === 'divider')
				{
					type = 'divider';
				}
				
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
			
			
			// RENDER END
			self.render_end();
			
			
			// RESOLVE AND GET PROMISE
			var promise = arg_deferred.promise();
			
			
			// SEND EVENT
			self.fire_event('');
			
			
			self.leave(context, self.msg_success_promise);
			return promise;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @method				to_string_self()
		 * @desc				Get a string dump of the object
		 * @return {string}		String dump
		 */
		self.to_string_self = function()
		{
			var self = this;
			return 'container view class';
		}
		
		
		/* --------------------------------------------------------------------------------------------- */
		// APPEND MIXIN METHODS
		// self.register_mixin(...);
		/* --------------------------------------------------------------------------------------------- */
	}


	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptContainer, ['DevaptView'], 'Luc BORIES', '2014-07-20', 'All views base class.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_str_option(DevaptContainer, 'items_source',			'inline', false, ['view_items_source']); // inline / model
	DevaptOptions.register_str_option(DevaptContainer, 'items_source_format',	'array', false, ['view_items_source_format']); // json / array
	
	DevaptOptions.register_str_option(DevaptContainer, 'items_model',			null, false, ['view_items_model']); // model name
	DevaptOptions.register_str_option(DevaptContainer, 'items_query_json',		null, false, ['view_items_model']); // model query JSON string
	DevaptOptions.register_str_option(DevaptContainer, 'items_query_filters',	null, false, ['view_items_model']); // model query
	DevaptOptions.register_str_option(DevaptContainer, 'items_query_slice',		null, false, ['view_items_model']); // model query
	
	DevaptOptions.register_option(DevaptContainer, {
			name: 'items_inline',
			type: 'array',
			aliases: [],
			default_value: [],
			array_separator: ',',
			array_type: 'String',
			format: '',
			is_required: false,
			childs: {}
		}
	);
	
	DevaptOptions.register_option(DevaptContainer, {
			name: 'items_options',
			type: 'array',
			aliases: [],
			default_value: [],
			array_separator: ',',
			array_type: 'String',
			format: '',
			is_required: false,
			childs: {}
		}
	);
	
	DevaptOptions.register_option(DevaptContainer, {
			name: 'items_labels',
			type: 'array',
			aliases: [],
			default_value: [],
			array_separator: ',',
			array_type: 'String',
			format: '',
			is_required: false,
			childs: {}
		}
	);
	
	DevaptOptions.register_option(DevaptContainer, {
			name: 'items_types',
			type: 'array',
			aliases: ['view_items_types'],
			default_value: ['view'],
			array_separator: ',',
			array_type: 'String',
			format: '',
			is_required: false,
			childs: {}
		}
	); // array of: view / html / callback / object (json) / record
	
	DevaptOptions.register_option(DevaptContainer, {
			name: 'items_records_fields_names',
			type: 'array',
			aliases: ['view_items_records_fields'],
			default_value: [],
			array_separator: ',',
			array_type: 'String',
			format: '',
			is_required: false,
			childs: {}
		}
	);
	
	DevaptOptions.register_option(DevaptContainer, {
			name: 'items_records_fields_types',
			type: 'array',
			aliases: ['view_items_records_types'],
			default_value: [],
			array_separator: ',',
			array_type: 'String',
			format: '',
			is_required: false,
			childs: {}
		}
	);
	
	
	return DevaptContainer;
});