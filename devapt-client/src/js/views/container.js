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
['Devapt', 'views/view', 'core/types', 'core/options', 'core/classes', 'datas/mixin-get-model', 'core/template', 'datas/mixin-datasource', 'datas/mixin-query'],
function(Devapt, DevaptView, DevaptTypes, DevaptOptions, DevaptClasses, DevaptMixinGetModel, DevaptTemplate, DevaptMixinDatasource, DevaptMixinQuery)
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
	 * @param arg_name
	 * @param arg_parent_jqo
	 * @param arg_options
	 * @returns
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
		self.is_rendering		= false;
		self.renders_count		= 0;
		
		self.items_jquery_parent = null;
		self.items_jquery_filter = null;
		
		
		
		/* --------------------------------------------------------------------------------------------- */
		// APPEND MIXIN METHODS AND ATTRIBUTES
		self.register_mixin(DevaptMixinGetModel);
		self.register_mixin(DevaptMixinDatasource);
		self.register_mixin(DevaptMixinQuery);
		/* --------------------------------------------------------------------------------------------- */
		
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Get items model
		 * @return {promise}
		 */
		self.get_items_model = function()
		{
			return self.get_model('items_model_name', 'items_model');
		}
		
		
		
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
			
			// INIT DATAS SOURCE
			self.mixin_init_get_model();
			self.mixin_init_datasource();
			self.mixin_init_query();
			self.mixin_init_bind();
			
			
			// CONSTRUCTOR END
			self.leave(context, self.msg_success);
		};
		
		
		// CONTRUCT INSTANCE
		self.DevaptContainer_contructor();
			
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Process query event
		 * @param {array}		arg_event_operands		event operands array
		 * @return {nothing}
		 */
		self.on_query_event = function(arg_event_operands)
		{
			var self = this;
			var context = 'on_query_event(opds)';
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_default_empty_implementation);
		};
			
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Process query filters event
		 * @param {array}		arg_event_operands		event operands array
		 * @return {nothing}
		 */
		self.on_query_filters_event = function(arg_event_operands)
		{
			var self = this;
			var context = 'on_query_filters_event(opds)';
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_default_empty_implementation);
		};
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Get all container nodes
		 * @return {array}		array of node jQuery objects
		 */
		self.get_all_nodes = function()
		{
			var self = this;
			var context = 'get_all_nodes()';
			self.enter(context, '');
			
			
			var nodes_jqo = $(self.items_jquery_filter, self.items_jquery_parent);
			
			
			self.leave(context, self.msg_success);
			return nodes_jqo;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Get a container item node by the node item index
		 * @param {integer}		arg_node_item_index		node item index
		 * @return {object}		node jQuery object
		 */
		self.get_node_by_index = function(arg_node_item_index)
		{
			var self = this;
			var context = 'get_node_by_content(text)';
			self.enter(context, '');
			
			
			var node_jqo = $(self.items_jquery_filter, self.items_jquery_parent).eq(arg_node_item_index);
			
			
			self.leave(context, self.msg_success);
			return node_jqo;
		};
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Get a container item node by the node item text
		 * @param {string}		arg_node_item_text		node item text
		 * @return {object}		node jQuery object
		 */
		self.get_node_by_content = function(arg_node_item_text)
		{
			var self = this;
			var context = 'get_node_by_content(text)';
			self.enter(context, '');
			
			
			var node_jqo = null;
			
			
			self.leave(context, self.msg_default_empty_implementation);
			return node_jqo;
		}
			
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Get a container item node by the node item text
		 * @param {object}		arg_field_name				field name
		 * @param {object}		arg_field_value				field value
		 * @return {object}		node jQuery object
		 */
		self.get_node_by_field_value = function(arg_field_name, arg_field_value)
		{
			var self = this;
			var context = 'get_node_by_content(field name, field value)';
			self.enter(context, '');
			
			
			var node_jqo = null;
			var nodes_jqo = self.get_all_nodes();
			for(node_index in nodes_jqo)
			{
				var loop_node_jqo = $( nodes_jqo[node_index] );
				var loop_record = loop_node_jqo.data('record');
				if ( DevaptTypes.is_object(loop_record) )
				{
					var field_value = loop_record[arg_field_name];
					if (field_value === arg_field_value)
					{
						node_jqo = loop_node_jqo;
						break;
					}
				}
			}
			
			
			self.leave(context, self.msg_success);
			return node_jqo;
		};
			
			
		
		/**
		 * @public
		 * @memberof			DevaptList
		 * @desc				Process select record event
		 * @param {object}		arg_field_name				field name
		 * @param {object}		arg_field_value				field value
		 * @param {object}		arg_node_item_text			node item text
		 * @return {nothing}
		 */
		self.on_record_select = function(arg_field_name, arg_field_value, arg_node_item_text)
		{
			var self = this;
			var context = 'on_query_filters_event()';
			self.enter(context, '');
			
			
			// DEBUG
			// console.log(arg_field_value, 'on_record_select.' + arg_field_name);
			// console.log(arg_node_item_text, 'arg_node_item_text');
			
			
			// SELECT JQO NODE
			var node_jqo = null;
			if ( DevaptTypes.is_not_empty_str(arg_node_item_text) )
			{
				self.step(context, 'container item text is a valid string');
				
				node_jqo = self.get_node_by_content(arg_node_item_text);
			}
			else
			{
				self.step(context, 'container item text is not a valid string');
				
				node_jqo = self.get_node_by_field_value(arg_field_name, arg_field_value);
			}
			
			// CHECK NODE
			if ( ! node_jqo)
			{
				self.leave(context, self.msg_failure);
				return;
			}
			
			var node_index = parseInt( node_jqo.index() );
			var operands_map = {
				field_value:arg_field_value,
				field_name:arg_field_name
			};
			self.select_item_node(node_index, operands_map);
			
			
			self.leave(context, self.msg_success);
		}
		
		
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
			
			
			
			self.leave(context, self.msg_default_empty_implementation);
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
					console.log(self.name, 'refresh');
					
					if ( ! self.is_rendering )
					{
						var deferred = $.Deferred();
						
						if (self.items_refresh.mode !== 'append')
						{
							self.remove_items();
						}
						
						self.render_items(deferred);
						
						setTimeout(refresh_cb, self.items_refresh.frequency*1000);
					}
				};
				
				setTimeout(refresh_cb, self.items_refresh.frequency*1000);
			}
			
			// FIRE EVENT
			self.fire_event('devapt.container.render.end');
			
			
			self.leave(context, self.msg_success);
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
					var option_key = null;
					for(option_key in item_options)
					{
						options[option_key] = item_options[option_key];
					}
				}
				else
				{
					console.error(item_options, 'container.item_options is unknow');
				}
			}
			
			// UPDATE OPTIONS RECORD WITH GIVEN LABELS
			if ( DevaptTypes.is_not_empty_array(self.items_labels) && self.items_labels.length > arg_item_index )
			{
				options.label = self.items_labels[arg_item_index];
			}
			
			
			self.leave(context, self.msq_success);
			return options;
		};
		
		
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
		};
		
		
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
		};
		
		
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
		};
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Render an item TEXT content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		self.render_item_text = function(arg_deferred, arg_item_jqo, arg_item_content, arg_item_record)
		{
			var self = this;
			var context = 'render_item_text(deferred,jqo,content)';
			self.enter(context, '');
			
			
			var span_jqo = $('<span>');
			span_jqo.html(arg_item_content);
			arg_item_jqo.append(span_jqo);
			
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		};
		
		
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
		};
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Render an item OBJECT content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {object}		arg_item_object
		 * @return {object}		jQuery object node
		 */
		self.render_item_object = function(arg_deferred, arg_item_jqo, arg_item_object)
		{
			var self = this;
			var context = 'render_item_object(deferred,jqo,content)';
			self.enter(context, '');
			
			
			// BUILD NODE CONTENT
			var tags_object = {};
			if (self.items_iterator === 'records')
			{
				for(field_index in self.items_fields)
				{
					var field_name = self.items_fields[field_index];
					tags_object[field_name] = arg_item_object[field_name];
				}
			}
			else
			{
				tags_object = arg_item_object;
			}
			
			if ( DevaptTypes.is_not_empty_str(self.items_format) )
			{
				var content = DevaptTemplate.render(self.items_format, tags_object);
				self.render_item_text(arg_deferred, arg_item_jqo, content);
			}
			else
			{
				self.render_item_text(arg_deferred, arg_item_jqo, 'todo');
			}
			
			arg_item_jqo.data('record', arg_item_object);
			
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		};
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Render an item RECORD content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {array}		arg_item_array
		 * @return {object}		jQuery object node
		 */
		self.render_item_array = function(arg_deferred, arg_item_jqo, arg_item_array)
		{
			var self = this;
			var context = 'render_item_array(deferred,jqo,content)';
			self.enter(context, '');
			
			
			// BUILD NODE CONTENT
			var tags_object = {};
			for(field_index in self.items_fields)
			{
				var field_name = self.items_fields[field_index];
				tags_object[field_index] = arg_item_object[field_name];
			}
			
			var content = DevaptTemplate.render(self.items_format, tags_object);
			self.render_item_text(arg_deferred, arg_item_jqo, content);
			
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		};
		
		
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
		};
		
		
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
			self.value(context, 'arg_item_content', arg_item_content);
			
			
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
				case 'record':
				case 'object':
				{
					self.assertFunction(context, 'self.render_item_object', self.render_item_object);
					node_jqo = self.render_item_object(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'array':
				{
					self.assertFunction(context, 'self.render_item_array', self.render_item_array);
					
					// ITEM RECORD
					var values_array = arg_item_content;
					if ( DevaptTypes.is_string(arg_item_content) )
					{
						values_array = arg_item_content.split('|', arg_item_content);
					}
					
					if ( ! DevaptTypes.is_array(values_array) )
					{
						break;
					}
					
					node_jqo = self.render_item_array(arg_deferred, node_jqo, values_array);
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
			
			
			self.items_jquery_parent.append(arg_item_jqo);
			
			
			self.leave(context, self.msg_success);
			return true;
		}
			
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Remove all items
		 * @return {boolean}
		 */
		self.remove_items = function()
		{
			var self = this;
			var context = 'remove_items()';
			self.enter(context, '');
			
			
			$(self.items_jquery_filter, self.items_jquery_parent).remove();
			
			
			self.leave(context, self.msg_default_empty_implementation);
			return true;
		}
			
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Add a CSS class to all items
		 * @param {string}		arg_css_class		CSS class name
		 * @return {nothing}
		 */
		self.add_items_css_class = function(arg_css_class)
		{
			var self = this;
			var context = 'add_items_css_class(css class)';
			self.enter(context, '');
			
			
			$(self.items_jquery_filter, self.items_jquery_parent).addClass(arg_css_class);
			
			
			self.leave(context, self.msg_default_empty_implementation);
		}
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Remove a CSS class to all items
		 * @param {string}		arg_css_class		CSS class name
		 * @return {nothing}
		 */
		self.remove_items_css_class = function(arg_css_class)
		{
			var self = this;
			var context = 'remove_items_css_class(css class)';
			self.enter(context, '');
			
			
			$(self.items_jquery_filter, self.items_jquery_parent).removeClass(arg_css_class);
			
			
			self.leave(context, self.msg_default_empty_implementation);
		}
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Toggle a CSS class to all items
		 * @param {string}		arg_css_class		CSS class name
		 * @return {nothing}
		 */
		self.toggle_items_css_class = function(arg_css_class)
		{
			var self = this;
			var context = 'toggle_items_css_class(css class)';
			self.enter(context, '');
			
			
			$(self.items_jquery_filter, self.items_jquery_parent).toggle(arg_css_class);
			
			
			self.leave(context, self.msg_default_empty_implementation);
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptList
		 * @desc				Select item node at index
		 * @param {integer} 	arg_item_index		item index
		 * @param {object} 		arg_event_opds		optional event operands map
		 * @return {nothing}
		 */
		self.select_item_node = function(arg_item_index, arg_event_opds)
		{
			var self = this;
			var context = 'select_item_node(index)';
			self.enter(context, '');
			
			
			// REMOVE PREVIOUS SELECTED ITEM
			self.remove_items_css_class('selected');
			
			// SELECT ITEM NODE AT GIVEN INDEX
			var node_jqo = $(self.items_jquery_filter, self.items_jquery_parent).eq(arg_item_index);
			
			// CHECK ITEM NODE
			if ( ! node_jqo)
			{
				console.error('node not found', context);
				self.leave(context, self.msg_failure);
				return;
			}
			
			// ENABLE SELECTED NODE
			node_jqo.addClass('selected');
			
			// GET SELECTION ATTRIBUTES
			var node_index = parseInt( node_jqo.index() );
			var node_value = node_jqo.text();
			var record = node_jqo.data('record');
			
			// BUILD EVENT OPERANDS MAP
			var event_opds_map = {
				index:node_index,
				label:node_value,
				record:record
			}
			if ( DevaptTypes.is_object(arg_event_opds) )
			{
				for(opds_key in arg_event_opds)
				{
					event_opds_map[opds_key] = arg_event_opds[opds_key];
				}
			}
			
			// SEND EVENT
			self.fire_event('devapt.events.container.selected', [event_opds_map]);
			
			
			self.leave(context, self.msg_success);
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
			
			
			self.is_rendering = true;
			
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
			// console.log(self.renders_count, self.name + '.' + context + ':renders_count');
			// console.log(self.items_autoload, self.name + '.' + context + ':items_autoload');
			if (self.renders_count === 1 && ! self.items_autoload)
			{
				// console.log('without autoload', self.name + '.' + context);
				
				// RENDER END
				self.render_end();
				self.is_rendering = false;
				arg_deferred.resolve();
				
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
				}
			);
			
			
			self.leave(context, self.msg_success_promise);
			return items_promise;
		};
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				Render view items
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		self.render_items = function(arg_deferred)
		{
			var self = this;
			var context = 'render_items(deferred)';
			self.enter(context, '');
			
			
			// GET ITEMS FROM SOURCE
			var items_promise = self.get_items_array();
			// console.log(items_promise, 'items_promise');
			items_promise.then(
				function(items)
				{
					// self.trace = true;
					self.step(context, 'get items promise done');
					// console.log(items, self.name + '.' + context + ':container.items');
					
					var items_count = items.length;
					
					// GET ITEMS TYPES
					var types_promise = self.get_items_types_array();
					// console.log(types_promise, 'types_promise');
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
		};
		
		
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
		};
		
		
		/* --------------------------------------------------------------------------------------------- */
		// APPEND MIXIN METHODS
//		self.register_mixin(DevaptMixinGetModel);
		/* --------------------------------------------------------------------------------------------- */
			
		// ADD EVENTS LISTENER
		var has_unique_cb = true;
		self.add_event_callback('devapt.query.updated', [self, self.on_query_event], has_unique_cb);
		self.add_event_callback('devapt.query.filters.added', [self, self.on_query_filters_event], has_unique_cb);
	}


	// INTROSPECTION : REGISTER CLASS
	DevaptClasses.register_class(DevaptContainer, ['DevaptView'], 'Luc BORIES', '2014-07-20', 'All views base class.');
	
	
	
	// INTROSPECTION : REGISTER OPTIONS FOR MIXINS
	DevaptMixinGetModel.register_options(DevaptContainer);
	DevaptMixinDatasource.register_options(DevaptContainer);
	DevaptMixinQuery.register_options(DevaptContainer);
	
	
	// INTROSPETION : REGISTER OPTIONS
	// DevaptOptions.register_str_option(DevaptContainer, 'items_model_name',		null, false, []); // model name
	// DevaptOptions.register_obj_option(DevaptContainer, 'items_model',			null, false, []); // model object
	
	
	return DevaptContainer;
});