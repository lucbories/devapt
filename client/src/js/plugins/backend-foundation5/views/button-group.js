/**
 * @file        plugins/backend-foundation5/views/button-group.js
 * @desc        Foundation 5 button group class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-08-05
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'views/view', 'plugins/backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes, DevaptClass, DevaptView, undefined)
{
	/**
	 * @public
	 * @class				DevaptButtonGroup
	 * @desc				Button group view class
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptButtonGroup
	 * @desc				Render view
	 * @return {object}		deferred promise object
	 */
	var cb_render_content_self = function()
	{
		var self = this;self.trace=true
		var context = 'render_content_self()';
		self.enter(context, '');
		
		
		// GET NODES
		self.assert_not_null(context, 'content_jqo', self.content_jqo);
		self.ul_jqo = $('<ul>');
		self.content_jqo.append(self.ul_jqo);
		self.ul_jqo.addClass('button-group');
		
		// GET CURRENT BACKEND
		var backend = Devapt.get_current_backend();
		self.assert_not_null(context, 'backend', backend);
		
		// LOOP ON BUTTONS VIEWS
		self.assert_not_empty_array(context, 'self.buttons', self.buttons);
		var ordered_promises = [];
		for(var button_key in self.buttons)
		{
			var button_view = self.buttons[button_key];
			self.value(context, 'button_view', button_view);
			
			var node_jqo = $('<li>');
			self.ul_jqo.append(node_jqo);
			
			// RENDER CHILD VIEW
			ordered_promises.push( backend.render_view(node_jqo, button_view) );
		}
		
		
		self.leave(context, Devapt.msg_success_promise);
		return Devapt.promise_all(ordered_promises);
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-08-05',
			'updated':'2014-12-13',
			'description':'A button group view class.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptView;
	var DevaptButtonGroupClass = new DevaptClass('DevaptButtonGroup', parent_class, class_settings);
	
	// METHODS
	DevaptButtonGroupClass.add_public_method('render_content_self', {}, cb_render_content_self);
	
	// PROPERTIES
	DevaptButtonGroupClass.add_public_array_property('buttons',	'',		null, true, false, ['view_buttons'], 'string', ',');
	
	
	return DevaptButtonGroupClass;
} );