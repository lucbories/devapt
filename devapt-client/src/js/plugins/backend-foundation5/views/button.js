/**
 * @file        plugins/backend-foundation5/views/button.js
 * @desc        Foundation 5 button class
 *				API:
 *					EVENTS:
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
	 * @class				DevaptButton
	 * @desc				Button view class
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptButton
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
		self.assert_not_null(context, 'arg_deferred', arg_deferred);
		
		// GET NODES
		self.assert_not_null(context, 'content_jqo', self.content_jqo);
		self.a_jqo = $('<a>');
		self.content_jqo.append(self.a_jqo);
		// self.a_jqo.attr('href', '#');
		
		// GET VIEW LABEL
		self.assert_not_empty_value(context, 'self.label', self.label);
		self.a_jqo.html(self.label);
		self.a_jqo.addClass('button');
		
		// HANDLE CLICK
		self.a_jqo.click(
			function()
			{
				self.fire_event('devapt.button.clicked', []);
			}
		);
		
		// RESOLVE AND GET PROMISE
		arg_deferred.resolve();
		var promise = arg_deferred.promise;
		
		
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
			'description':'Button view class to display a text.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptView;
	var DevaptButtonClass = new DevaptClass('DevaptButton', parent_class, class_settings);
	
	// METHODS
	DevaptButtonClass.add_public_method('render_self', {}, cb_render_self);
	
	// PROPERTIES
	
	
	return DevaptButtonClass;
} );