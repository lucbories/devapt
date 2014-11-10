/**
 * @file        backend-foundation5/containers/list.js
 * @desc        Foundation 5 list class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-06-28
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/options', 'core/classes', 'views/container', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes, DevaptOptions, DevaptClasses, DevaptContainer, undefined)
{
	/**
	 * @public
	 * @class				DevaptList
	 * @desc				List view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptList(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptContainer;
		self.inheritFrom(arg_name, arg_parent_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptList';
		self.is_view			= true;
		
		self.items_jquery_parent = null;
		self.items_jquery_filter = 'li';
		
		
		/**
		 * @public
		 * @memberof			DevaptList
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptList_contructor = function()
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
			
			
			// CONSTRUCTOR END
			self.leave(context, self.msg_success);
		}
		
		
		// CONTRUCT INSTANCE
		self.DevaptList_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptList
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
			
			// SELECT ANCHOR BY CONTENT
			var a_jqo = $('li>a:contains("' + arg_node_item_text + '"):eq(0)', self.items_jquery_parent);
			if ( ! a_jqo)
			{
				self.leave(context, self.msg_failure);
				return null;
			}
			
			// GET ANCHOR PARENT
			node_jqo = a_jqo.parent();
			
			
			self.leave(context, self.msg_success);
			return node_jqo;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptList
		 * @desc				Begin the render of the container
		 * @return {nothing}
		 */
		self.render_begin = function()
		{
			var self = this;
			var context = 'render_begin()';
			self.enter(context, '');
			
			
			self.content_jqo = $('<ul>');
			self.content_jqo.addClass('side-nav');
			self.parent_jqo.append(self.content_jqo);
			
			self.items_jquery_parent = self.content_jqo;
			
			
			self.leave(context, 'success');
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptList
		 * @desc				Render an empty item node
		 * @param {integer} 	arg_item_index		item index
		 * @return {object}		jQuery object node
		 */
		self.render_item_node = function(arg_item_index)
		{
			var self = this;
			var context = 'render_item_node(index)';
			self.enter(context, '');
			
			
			var node_jqo = $('<li>');
			node_jqo.click(
				function()
				{
					var node_index = parseInt( node_jqo.index() );
					self.select_item_node(node_index);
				}
			);
			
			
			self.leave(context, 'success');
			return node_jqo;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptList
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
			
			arg_item_jqo.addClass('divider');
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptList
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
			self.value(context, 'arg_item_content', arg_item_content);
			
			var a_jqo = $('<a href="#">');
			a_jqo.html(arg_item_content);
			arg_item_jqo.append(a_jqo);
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		}
	}
	
	
	// INTROSPECTION : REGISTER CLASS
	DevaptClasses.register_class(DevaptList, ['DevaptContainer'], 'Luc BORIES', '2014-05-09', 'Simple view class to display a list of items.');
	
	
	// INTROSPECTION : REGISTER OPTIONS
	
	
	return DevaptList;
} );