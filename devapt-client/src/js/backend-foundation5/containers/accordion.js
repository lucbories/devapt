/**
 * @file        backend-foundation5/containers/accordion.js
 * @desc        Foundation 5 list class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-07-27
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
	 * @class				DevaptAccordion
	 * @desc				Accordion panel view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptAccordion(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptContainer;
		self.inheritFrom(arg_name, arg_parent_jqo, arg_options);
		
		// INIT
		self.trace				= true;
		self.class_name			= 'DevaptAccordion';
		self.is_view			= true;
		
		self.tabs_jqo			= null;
		self.tabs_content_jqo	= null;
		
		
		/**
		 * @public
		 * @memberof			DevaptAccordion
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptAccordion_contructor = function()
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
			self.leave(context, 'success');
		}
		
		
		// CONTRUCT INSTANCE
		self.DevaptAccordion_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptAccordion
		 * @desc				Begin the render of the container
		 * @return {nothing}
		 */
		self.render_begin = function()
		{
			var self = this;
			var context = 'render_begin()';
			self.enter(context, '');
			
			
			self.content_jqo = $('<dl>');
			self.parent_jqo.append(self.content_jqo);
			self.content_jqo.addClass('accordion');
			self.content_jqo.attr('data-accordion', '');
			
			
			self.leave(context, 'success');
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
			
			
			// INIT FOUNDATION
			self.content_jqo.parent().foundation();
			
			// HANDLE EVENT
			if ( DevaptTypes.is_function(self.on_accordion_changed) )
			{
				// self.content_jqo.on('toggled', [self, self.on_accordion_changed] );
				self.content_jqo.on('toggled',
					function(event, accordion)
					{
						// SEND EVENT
						self.fire_event('devapt.accordion.changed', [event, accordion]);
					}
				);
			}
			
			// ENABLE ACTIVE CONTENT
			if ( ! $('.content.active', self.content_jqo) && $('.content', self.content_jqo) )
			{
				$('.content', self.content_jqo)[0].addClass('active');
			}
			
			
			self.leave(context, self.msg_success);
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptAccordion
		 * @desc				Render an empty item node
		 * @param {integer} 	arg_item_index		item index
		 * @return {object}		jQuery object node
		 */
		self.render_item_node = function(arg_item_index)
		{
			var self = this;
			var context = 'render_item_node(index)';
			self.enter(context, '');
			
			
			var id = self.name + '_content_' + arg_item_index + '_id';
			var node_jqo = $('<div>');
			node_jqo.addClass('content');
			node_jqo.attr('id', id);
			
			
			self.leave(context, 'success');
			return node_jqo;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptAccordion
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
			
			var p_jqo = $('<p>');
			p_jqo.html(arg_item_content);
			arg_item_jqo.append(p_jqo);
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
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
			var context = 'render_self(deferred)';
			self.enter(context, '');
			
			
			// GET ITEM OPTIONS
			var item_options = self.get_item_options(arg_item_record.index, { label:'accordion ' + arg_item_record.index, active:false });
			
			// ACCORDION CONTENT
			var id = self.name + '_content_' + arg_item_record.index + '_id';
			var item_label = item_options.label;
			
			var node_jqo = $('<dd>');
			node_jqo.addClass('accordion-navigation');
			if (item_options.active)
			{
				arg_item_jqo.addClass('active');
			}
			
			var a_jqo = $('<a>');
			a_jqo.attr('href', '#' + id);
			a_jqo.html(item_label);
			node_jqo.append(a_jqo);
			
			node_jqo.append(arg_item_jqo);
			self.content_jqo.append(node_jqo);
			
			
			self.leave(context, 'success');
			return true;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptAccordion, ['DevaptContainer'], 'Luc BORIES', '2014-07-27', 'Tabs panel view class, horizontally (default), vertically (is_vertical:true).');
	
	
	// INTROSPETION : REGISTER OPTIONS
	
	
	return DevaptAccordion;
} );