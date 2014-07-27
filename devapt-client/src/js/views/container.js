/**
 * @file        views/container.js
 * @desc        View base class
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
		 * @desc				Render an empty item node
		 * @return {object}		jQuery object node
		 */
		self.render_item_node = function()
		{
			var self = this;
			var context = 'render_item_node()';
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
			var node_jqo = self.render_item_node();
			
			// FILL ITEM NODE
			switch(arg_item_type)
			{
				case 'divider':
				{
					self.assertFunction(context, 'self.render_item_divider', self.render_item_divider);
					node_jqo = self.render_item_divider(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'html':
				{
					self.assertFunction(context, 'self.render_item_html', self.render_item_divider);
					node_jqo = self.render_item_html(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'text':
				{
					self.assertFunction(context, 'self.render_item_text', self.render_item_divider);
					node_jqo = self.render_item_text(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'view':
				{
					self.assertFunction(context, 'self.render_item_view', self.render_item_divider);
					node_jqo = self.render_item_view(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'object':
				{
					self.assertFunction(context, 'self.render_item_object', self.render_item_divider);
					node_jqo = self.render_item_object(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'callback':
				{
					self.assertFunction(context, 'self.render_item_callback', self.render_item_divider);
					node_jqo = self.render_item_callback(arg_deferred, node_jqo, arg_item_content);
					break;
				}
			}
			
			// APPEND ITEM NODE
			self.content_jqo.append(node_jqo);
			var record = {
				index: arg_item_index,
				type: arg_item_type,
				position: false,
				width: false,
				heigth: false,
				node: node_jqo
			};
			self.items_objects.push(record);
			
			
			self.leave(context, 'success');
			return true;
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
			
			
			// RENDER BEGIN
			self.render_begin();
			
			
			// LOOP ON IETMS
			// console.log(self, 'container');
			var index = 0;
			var type = self.items_type.toLocaleLowerCase();
			for(content_key in self.items)
			{
				var item = self.items[content_key];
				if (item === 'divider')
				{
					type = 'divider';
				}
				if ( ! self.render_item(arg_deferred, item, index, type) )
				{
					self.step(context, 'deferred.reject()');
					arg_deferred.reject();
					break;
				}
				++index;
			}
			
			
			// LOOP COMPLETES
			if ( index === self.items.length )
			{
				self.step(context, 'deferred.resolve()');
				arg_deferred.resolve();
			}
			
			
			// RENDER END
			self.render_end();
			
			
			// RESOLVE AND GET PROMISE
			var promise = arg_deferred.promise();
			
			
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
	DevaptOptions.register_str_option(DevaptContainer, 'layout',		'none', false, ['view_layout']);
	DevaptOptions.register_str_option(DevaptContainer, 'items_type',	'view', false, ['view_items_type']); // view / html / callback / object
	
	DevaptOptions.register_option(DevaptContainer, {
			name: 'items',
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
	
	
	return DevaptContainer;
});