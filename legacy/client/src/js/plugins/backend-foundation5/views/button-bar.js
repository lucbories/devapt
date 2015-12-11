/**
 * @file        plugins/backend-foundation5/views/button-bar.js
 * @desc        Foundation 5 button bar class
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
	 * @class				DevaptButtonBar
	 * @desc				Button bar view class
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptButtonBar
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
		self.content_jqo.addClass('button-bar');
		
		// GET CURRENT BACKEND
		var backend = Devapt.get_current_backend();
		self.assert_not_null(context, 'backend', backend);
		
		// LOOP ON BUTTON GROUPS VIEWS
		self.assert_not_empty_array(context, 'self.buttons', self.button_groups);
		var ordered_promises = [];
		var current_jqo = null;
		for(var group_key in self.button_groups)
		{
			var group_view = self.button_groups[group_key];
			self.value(context, 'group_view', group_view);
			
			current_jqo = $('<div>');
			self.content_jqo.append(current_jqo);
			
			// RENDER CHILD VIEW
			ordered_promises.push( backend.render_view(current_jqo, group_view) );
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
			'description':'A button bar view class.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptView;
	var DevaptButtonBarClass = new DevaptClass('DevaptButtonBar', parent_class, class_settings);
	
	// METHODS
	DevaptButtonBarClass.add_public_method('render_content_self', {}, cb_render_content_self);
	
	// PROPERTIES
	DevaptButtonBarClass.add_public_array_property('button_groups',	'',		null, true, false, ['view_buttons_groups'], 'string', ',');
	
	
	return DevaptButtonBarClass;
} );