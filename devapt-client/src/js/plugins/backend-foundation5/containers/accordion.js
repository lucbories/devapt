/**
 * @file        plugins/backend-foundation5/containers/accordion.js
 * @desc        Foundation 5 list class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-07-27
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'views/container', 'plugins/backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes, DevaptClass, DevaptContainer, undefined)
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
	
	
	/**
	 * @public
	 * @memberof			DevaptAccordion
	 * @desc				Begin the render of the container
	 * @return {nothing}
	 */
	var cb_render_begin = function()
	{
		var self = this;
		var context = 'render_begin()';
		self.enter(context, '');
		
		
		self.content_jqo = $('<ul>');
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
	var cb_render_end_self = function()
	{
		var self = this;
		var context = 'render_end_self()';
		self.enter(context, '');
		
		
		// INIT FOUNDATION
		self.content_jqo.parent().foundation();
		
		// HANulE EVENT
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
		
		
		self.leave(context, Devapt.msg_success);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptAccordion
	 * @desc				Render an empty item node
	 * @param {integer} 	arg_item_index		item index
	 * @return {object}		jQuery object node
	 */
	var cb_render_item_node = function(arg_item_index)
	{
		var self = this;
		var context = 'render_item_node(index)';
		self.enter(context, '');
		
		
		var id = self.name + '_content_' + arg_item_index + '_id';
		var node_jqo = $('<div>');
		node_jqo.addClass('content');
		node_jqo.attr('id', id);
		// console.log(node_jqo, context + ':node_jqo:' + self.name);
		
		
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
	var cb_render_item_text = function(arg_deferred, arg_item_jqo, arg_item_content)
	{
		var self = this;
		var context = 'render_item_text(deferred,jqo,content)';
		self.enter(context, '');
		
		var p_jqo = $('<p>');
		p_jqo.html(arg_item_content);
		arg_item_jqo.append(p_jqo);
		
		self.leave(context, Devapt.msg_success);
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
	var cb_append_item_node = function(arg_item_jqo, arg_item_record)
	{
		var self = this;
		var context = 'append_item_node(jqo,record)';
		self.enter(context, '');
		self.assert_object(context, 'node', arg_item_jqo);
		self.assert_object(context, 'record', arg_item_record);
		
		
		// GET ITEM OPTIONS
		self.step(context, 'get item options');
		var item_options = self.get_item_options(arg_item_record.index, { label:'accordion ' + arg_item_record.index, active:false });
		
		// ACCORDION CONTENT
		self.step(context, 'get id and label');
		var id = self.name + '_content_' + arg_item_record.index + '_id';
		var item_label = item_options.label;
		
		self.step(context, 'init node');
		var node_jqo = $('<li>');
		node_jqo.addClass('accordion-navigation');
		if (item_options.active)
		{
			arg_item_jqo.addClass('active');
		}
		
		var a_jqo = $('<a>');
		a_jqo.attr('href', '#' + id);
		a_jqo.html(item_label);
		node_jqo.append(a_jqo);
		
		var div_jqo = $('<div>');
		div_jqo.addClass('content');
		div_jqo.append(arg_item_jqo);
		
		node_jqo.append(div_jqo);
		self.content_jqo.append(node_jqo);
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-27',
			'updated':'2015-03-28',
			'description':'Accordion view class.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptContainer;
	var DevaptAccordionClass = new DevaptClass('DevaptAccordion', parent_class, class_settings);
	
	// METHODS
	DevaptAccordionClass.add_public_method('render_begin', {}, cb_render_begin);
	DevaptAccordionClass.add_public_method('render_end_self', {}, cb_render_end_self);
	DevaptAccordionClass.add_public_method('render_item_node', {}, cb_render_item_node);
	DevaptAccordionClass.add_public_method('render_item_text', {}, cb_render_item_text);
	DevaptAccordionClass.add_public_method('append_item_node', {}, cb_append_item_node);
	
	// PROPERTIES
	
	
	return DevaptAccordionClass;
} );