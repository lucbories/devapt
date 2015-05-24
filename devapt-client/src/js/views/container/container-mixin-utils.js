/**
 * @file        views/container/container-mixin-utils.js
 * @desc        Mixin for container utils features
 * @see			DevaptMixinContainerUtils
 * @ingroup     DEVAPT_VIEWS
 * @date        2014-11-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class'],
function(Devapt, DevaptTypes, DevaptClass)
{
	/**
	 * @mixin				DevaptMixinContainerUtils
	 * @public
	 * @desc				Mixin of methods for container utils features
	 */
	var DevaptMixinContainerUtils = 
	{
		/**
		 * @memberof			DevaptMixinContainerUtils
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_container_utils: false,
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Init mixin
		 * @return {nothing}
		 */
	/*	mixin_init_container_utils: function(self)
		{
			self.push_trace(self.trace, self.mixin_trace_container_utils);
			var context = 'mixin_init_container_utils()';
			self.enter(context, '');
			
			
			
			
			self.leave(context, '');
			self.pop_trace();
		},*/
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Get the item options at given index
		 * @param {integer} 	arg_item_index		item index
		 * @param {object} 		arg_item_defaults	item default options
		 * @return {object}		options map
		 */
		get_item_options: function(arg_item_index, arg_item_defaults)
		{
			var self = this;
			var context = 'get_item_options(index)';
			// self.push_trace(self.trace, DevaptMixinContainerUtils.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			// INIT DEFAULT OPTIONS RECORD
			self.step(context, 'INIT DEFAULT OPTIONS RECORD');
			var options = arg_item_defaults ? arg_item_defaults : {};
			// self.items_options = self.get_property('items_options');
			// console.log(options, context + '.options');
			// console.log(self.items_options, context + '.self.items_options [' + self.name + ']');
			// console.log(arg_item_index, context + '.arg_item_index');
			
			// GET GIVEN OPTIONS RECORD
			if ( DevaptTypes.is_not_empty_array(self.items_options) && self.items_options[arg_item_index] )
			{
				self.step(context, 'GET GIVEN OPTIONS RECORD');
				var item_options = self.items_options[arg_item_index];
				// console.log(item_options, context + '.item_options [' + self.name + ']');
				
				if ( DevaptTypes.is_string(item_options) )
				{
					self.step(context, 'ITEM OPTIONS IS A STRING');
					// console.log(item_options, context + '.item_options is string');
					var options_parts = item_options.split('|');
					for(var part_index in options_parts)
					{
						var record_part_str = options_parts[part_index];
						// console.log(record_part_str, 'at ' + part_index + ' for ' + arg_item_index);
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
					self.step(context, 'ITEM OPTIONS IS AN OBJECT');
					// console.log(item_options, context + '.item_options is object');
					
					var option_key = null;
					for(option_key in item_options)
					{
						var loop_option = item_options[option_key];
						// console.log(loop_option, context + '.loop_option');
						
						if ( DevaptTypes.is_string(loop_option) )
						{
							// console.log(loop_option, context + '.loop_option is string');
							
							var loop_childs = loop_option.split('|');
							if ( loop_childs.length > 1 )
							{
								for(var child_key in loop_childs)
								{
									var loop_child = loop_childs[child_key].split('=');
									var loop_child_key = loop_child[0];
									var loop_child_value = loop_child[1];
									// console.log(loop_child, context + '.loop_child');
									// console.log(loop_child_key, context + '.loop_child_key');
									// console.log(loop_child_value, context + '.loop_child_value');
									
									options[loop_child_key] = loop_child_value;
								}
							}
							else
							{
								options[option_key] = loop_option;
							}
						}
					}
				}
				else
				{
					self.error(item_options, 'container.item_options is unknow');
				}
			}
			
			// UPDATE OPTIONS RECORD WITH GIVEN LABELS
			if ( DevaptTypes.is_not_empty_array(self.items_labels) && self.items_labels.length > arg_item_index )
			{
				options.label = self.items_labels[arg_item_index];
			}
			
			// console.log(options, context + '.options [' + self.name + ']');
			
			
			self.leave(context, self.msq_success);
			// self.pop_trace();
			return options;
		},
		
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Add a CSS class to all items
		 * @param {string}		arg_css_class		CSS class name
		 * @return {nothing}
		 */
		add_items_css_class: function(arg_css_class)
		{
			var self = this;
			var context = 'add_items_css_class(css class)';
			self.push_trace(self.trace, DevaptMixinContainerUtils.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			$(self.items_jquery_filter, self.items_jquery_parent).addClass(arg_css_class);
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Remove a CSS class to all items
		 * @param {string}		arg_css_class		CSS class name
		 * @return {nothing}
		 */
		remove_items_css_class: function(arg_css_class)
		{
			var self = this;
			var context = 'remove_items_css_class(css class)';
			self.push_trace(self.trace, DevaptMixinContainerUtils.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			$(self.items_jquery_filter, self.items_jquery_parent).removeClass(arg_css_class);
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Toggle a CSS class to all items
		 * @param {string}		arg_css_class		CSS class name
		 * @return {nothing}
		 */
		toggle_items_css_class: function(arg_css_class)
		{
			var self = this;
			var context = 'toggle_items_css_class(css class)';
			self.push_trace(self.trace, DevaptMixinContainerUtils.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			$(self.items_jquery_filter, self.items_jquery_parent).toggle(arg_css_class);
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Get item node CSS value
		 * @param {object}		arg_node_jqo	item node jQuery object
		 * @param {string}		arg_css_key		item node CSS key
		 * @return {nothing}
		 */
		get_item_node_css_value: function(arg_node_jqo, arg_css_key)
		{
			var self = this;
			var context = 'get_item_node_css_value(node,css)';
			self.push_trace(self.trace, DevaptMixinContainerUtils.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			var text = arg_node_jqo.css(arg_css_key);
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
			return text;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Set item node CSS value
		 * @param {object}		arg_node_jqo	item node jQuery object
		 * @param {string}		arg_css_key		item node CSS key
		 * @param {string}		arg_css_value	item node CSS value
		 * @return {nothing}
		 */
		set_item_node_css_value: function(arg_node_jqo, arg_css_key, arg_css_value)
		{
			var self = this;
			var context = 'set_item_node_css_value(node,css,value)';
			self.push_trace(self.trace, DevaptMixinContainerUtils.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			arg_node_jqo.css(arg_css_key, arg_css_value);
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Has CSS class to the given item node
		 * @param {object}		arg_node_jqo	item node jQuery object
		 * @param {string}		arg_css_class	item node CSS class
		 * @return {nothing}
		 */
		has_item_node_css_class: function(arg_node_jqo, arg_css_class)
		{
			var self = this;
			var context = 'has_item_node_css_class(node,class)';
			self.push_trace(self.trace, DevaptMixinContainerUtils.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			var result = arg_node_jqo.hasClass(arg_css_class);
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
			return result;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Add CSS class to the given item node
		 * @param {object}		arg_node_jqo	item node jQuery object
		 * @param {string}		arg_css_class	item node CSS class
		 * @return {nothing}
		 */
		add_item_node_css_class: function(arg_node_jqo, arg_css_class)
		{
			var self = this;
			var context = 'add_item_node_css_class(node,class)';
			self.push_trace(self.trace, DevaptMixinContainerUtils.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			arg_node_jqo.addClass(arg_css_class);
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Remove CSS class to the given item node
		 * @param {object}		arg_node_jqo	item node jQuery object
		 * @param {string}		arg_css_class	item node CSS class
		 * @return {nothing}
		 */
		remove_item_node_css_class: function(arg_node_jqo, arg_css_class)
		{
			var self = this;
			var context = 'remove_item_node_css_class(node,class)';
			self.push_trace(self.trace, DevaptMixinContainerUtils.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			arg_node_jqo.removeClass(arg_css_class);
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Toggle CSS class to the given item node
		 * @param {object}		arg_node_jqo	item node jQuery object
		 * @param {string}		arg_css_class	item node CSS class
		 * @return {nothing}
		 */
		toggle_item_node_css_class: function(arg_node_jqo, arg_css_class)
		{
			var self = this;
			var context = 'toggle_item_node_css_class(node,class)';
			self.push_trace(self.trace, DevaptMixinContainerUtils.mixin_trace_container_utils);
			self.enter(context, '');
			
			
//			console.debug(arg_node_jqo, context + ':arg_node_jqo');
//			console.debug(arg_css_class, context + ':arg_css_class');
			
			arg_node_jqo.toggleClass(arg_css_class);
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Get item node text
		 * @param {object}		arg_node_jqo	item node jQuery object
		 * @return {string}
		 */
		get_item_node_text: function(arg_node_jqo)
		{
			var self = this;
			var context = 'get_item_node_text(node)';
			self.push_trace(self.trace, self.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			var text = arg_node_jqo.text();
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
			return text;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Set item node text
		 * @param {object}		arg_node_jqo	item node jQuery object
		 * @param {string}		arg_node_text	item node text
		 * @return {boolean}
		 */
		set_item_node_text: function(arg_node_jqo, arg_node_text)
		{
			var self = this;
			var context = 'set_item_node_text(node,text)';
			self.push_trace(self.trace, self.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			arg_node_jqo.text(arg_node_text);
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
			return true;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Remove all items
		 * @return {boolean}
		 */
		remove_items: function()
		{
			var self = this;
			var context = 'remove_items()';
			self.push_trace(self.trace, self.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			$(self.items_jquery_filter, self.items_jquery_parent).remove();
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
			return true;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinContainerUtils
		 * @desc				Reset all items
		 * @return {boolean}
		 */
		reset_items: function()
		{
			var self = this;
			var context = 'reset_items()';
			self.push_trace(self.trace, self.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			var all_jqo = $(self.items_jquery_filter, self.items_jquery_parent);
			$('a', all_jqo).val('');
			$('input', all_jqo).val('');
			$('span', all_jqo).val('');
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
			return true;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-11-15',
			'updated':'2015-05-16',
			'description':'Mixin methods for container utils features.'
		}
	};
	var DevaptMixinContainerUtilsClass = new DevaptClass('DevaptMixinContainerUtils', null, class_settings);
	
	DevaptMixinContainerUtilsClass.add_public_method('get_item_options', {}, DevaptMixinContainerUtils.get_item_options);
	
	DevaptMixinContainerUtilsClass.add_public_method('add_items_css_class', {}, DevaptMixinContainerUtils.add_items_css_class);
	DevaptMixinContainerUtilsClass.add_public_method('remove_items_css_class', {}, DevaptMixinContainerUtils.remove_items_css_class);
	DevaptMixinContainerUtilsClass.add_public_method('toggle_items_css_class', {}, DevaptMixinContainerUtils.toggle_items_css_class);
	DevaptMixinContainerUtilsClass.add_public_method('get_item_node_css_value', {}, DevaptMixinContainerUtils.get_item_node_css_value);
	DevaptMixinContainerUtilsClass.add_public_method('set_item_node_css_value', {}, DevaptMixinContainerUtils.set_item_node_css_value);
	
	DevaptMixinContainerUtilsClass.add_public_method('has_item_node_css_class', {}, DevaptMixinContainerUtils.has_item_node_css_class);
	DevaptMixinContainerUtilsClass.add_public_method('add_item_node_css_class', {}, DevaptMixinContainerUtils.add_item_node_css_class);
	DevaptMixinContainerUtilsClass.add_public_method('remove_item_node_css_class', {}, DevaptMixinContainerUtils.remove_item_node_css_class);
	DevaptMixinContainerUtilsClass.add_public_method('toggle_item_node_css_class', {}, DevaptMixinContainerUtils.toggle_item_node_css_class);
	
	DevaptMixinContainerUtilsClass.add_public_method('get_item_node_text', {}, DevaptMixinContainerUtils.get_item_node_text);
	DevaptMixinContainerUtilsClass.add_public_method('set_item_node_text', {}, DevaptMixinContainerUtils.set_item_node_text);
	DevaptMixinContainerUtilsClass.add_public_method('remove_items', {}, DevaptMixinContainerUtils.remove_items);
	DevaptMixinContainerUtilsClass.add_public_method('reset_items', {}, DevaptMixinContainerUtils.reset_items);
	
	DevaptMixinContainerUtilsClass.build_class();
	
	
	return DevaptMixinContainerUtilsClass;
}
);