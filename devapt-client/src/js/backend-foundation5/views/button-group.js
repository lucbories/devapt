/**
 * @file        backend-foundation5/views/button-group.js
 * @desc        Foundation 5 button group class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-08-05
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict'
define(
['Devapt', 'core/types', 'core/class', 'views/view', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes, DevaptClass, DevaptView, undefined)
{
	/**
	 * @public
	 * @class				DevaptButtonGroup
	 * @desc				Button group view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptButtonGroup
	 * @desc				Render view
	 * @param {object}		arg_deferred	deferred object
	 * @return {object}		deferred promise object
	 */
	var cb_render_self = function(arg_deferred)
	{
		var self = this;
		var context = 'render_self(deferred)';
		self.enter(context, '');
		
		
		// CHECK DEFEREED
		self.assertNotNull(context, 'arg_deferred', arg_deferred);
		
		// GET NODES
		self.assertNotNull(context, 'parent_jqo', self.parent_jqo);
		self.content_jqo = $('<ul>');
		self.parent_jqo.append(self.content_jqo);
		self.content_jqo.addClass('button-group');
		
		// GET CURRENT BACKEND
		var backend = Devapt.get_current_backend();
		self.assertNotNull(context, 'backend', backend);
		
		// LOOP ON BUTTONS VIEWS
		self.assertNotEmptyArray(context, 'self.buttons', self.buttons);
		for(var button_key in self.buttons)
		{
			var button_view = self.buttons[button_key];
			var node_jqo = $('<li>');
			self.content_jqo.append(node_jqo);
			
			// RENDER VIEW
			arg_deferred.then( backend.render_view(node_jqo, button_view) );
		}
		
		// RESOLVE AND GET PROMISE
		arg_deferred.resolve();
		var promise = arg_deferred.promise();
		
		
		self.leave(context, 'success: promise is resolved');
		return promise;
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
	DevaptButtonGroupClass.add_public_method('render_self', {}, cb_render_self);
	
	// PROPERTIES
	DevaptButtonGroupClass.add_public_array_property('buttons',	'',		null, true, false, ['view_buttons'], 'string', ',');
	
	
	return DevaptButtonGroupClass;
} );