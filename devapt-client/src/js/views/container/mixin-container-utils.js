/**
 * @file        views/mixin-container-utils.js
 * @desc        Mixin for container utils features
 * @see			DevaptMixinContainerUtils
 * @ingroup     DEVAPT_CORE
 * @date        2014-11-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/class'],
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
			self.push_trace(self.trace, self.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			// INIT DEFAULT OPTIONS RECORD
			var options = arg_item_defaults ? arg_item_defaults : {};
			// self.items_options = self.get_property('items_options');
			// console.log(options, context + '.options');
			// console.log(self.items_options, context + '.self.items_options');
			// console.log(arg_item_index, context + '.arg_item_index');
			
			// GET GIVEN OPTIONS RECORD
			if ( DevaptTypes.is_not_empty_array(self.items_options) && self.items_options[arg_item_index] )
			{
				var item_options = self.items_options[arg_item_index];
				// console.log(item_options, context + '.item_options');
				
				if ( DevaptTypes.is_string(item_options) )
				{
					// console.log(item_options, context + '.item_options is string');
					var options_parts = item_options.split('|');
					for(part_index in options_parts)
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
								for(child_key in loop_childs)
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
			
			// console.log(options, context + '.options');
			
			
			self.leave(context, self.msq_success);
			self.pop_trace();
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
			self.push_trace(self.trace, self.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			$(self.items_jquery_filter, self.items_jquery_parent).addClass(arg_css_class);
			
			
			self.leave(context, self.msg_default_empty_implementation);
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
			self.push_trace(self.trace, self.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			$(self.items_jquery_filter, self.items_jquery_parent).removeClass(arg_css_class);
			
			
			self.leave(context, self.msg_default_empty_implementation);
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
			self.push_trace(self.trace, self.mixin_trace_container_utils);
			self.enter(context, '');
			
			
			$(self.items_jquery_filter, self.items_jquery_parent).toggle(arg_css_class);
			
			
			self.leave(context, self.msg_default_empty_implementation);
			self.pop_trace();
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
			
			
			self.leave(context, self.msg_default_empty_implementation);
			self.pop_trace();
			return true;
		}
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinContainerUtils
	 * @desc				Register mixin options
	 * @return {nothing}
	 */
	// DevaptMixinContainerUtils.register_options = function(arg_prototype)
	// {
	// };
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-11-15',
			'updated':'2014-12-06',
			'description':'Mixin methods for container utils features.'
		}
	};
	
	
	/**
	 * @mixin				DevaptMixinContainerUtilsClass
	 * @public
	 * @desc				Mixin of methods for  CSS rendering options
	 */
	var DevaptMixinContainerUtilsClass = new DevaptClass('DevaptMixinContainerUtils', null, class_settings);
	
	DevaptMixinContainerUtilsClass.add_public_method('get_item_options', {}, DevaptMixinContainerUtils.get_item_options);
	DevaptMixinContainerUtilsClass.add_public_method('add_items_css_class', {}, DevaptMixinContainerUtils.add_items_css_class);
	DevaptMixinContainerUtilsClass.add_public_method('remove_items_css_class', {}, DevaptMixinContainerUtils.remove_items_css_class);
	DevaptMixinContainerUtilsClass.add_public_method('toggle_items_css_class', {}, DevaptMixinContainerUtils.toggle_items_css_class);
	DevaptMixinContainerUtilsClass.add_public_method('remove_items', {}, DevaptMixinContainerUtils.remove_items);
	
	DevaptMixinContainerUtilsClass.build_class();
	
	
	return DevaptMixinContainerUtilsClass;
}
);