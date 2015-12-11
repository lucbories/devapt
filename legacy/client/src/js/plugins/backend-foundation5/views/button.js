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
['Devapt', 'core/types',
	'object/class', 'views/view', 'views/view/view-mixin-bind',
	'plugins/backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes,
	DevaptClass, DevaptView, DevaptMixinBind,
	undefined)
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
	 * @return {object}		deferred promise object
	 */
	var cb_render_content_self = function()
	{
		var self = this;self.trace=true
		var context = 'render_content_self()';
		self.enter(context, '');
		
		// ENABLE BINDINGS
		if ( ! self.mixin_bind_initialized )
		{
			self.enable_bindings();
		}
		
		// GET NODES
		self.assert_not_null(context, 'content_jqo', self.content_jqo);
		self.a_jqo = $('<a>');
		self.content_jqo.append(self.a_jqo);
		
		// GET VIEW LABEL
		self.assert_not_empty_value(context, 'self.label', self.label);
		self.a_jqo.html(self.label);
		self.a_jqo.addClass('button small');
		self.a_jqo.css('margin', '0em');
		
		// HANDLE CLICK
		self.a_jqo.click(
			function()
			{
				console.log(self.name, 'clicked');
				self.fire_event('devapt.button.clicked', []);
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return Devapt.promise_resolved();
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-08-05',
			'updated':'2014-12-13',
			'description':'Button view class to display a text.'
		},
		mixins:[DevaptMixinBind]
	};
	
	// CLASS CREATION
	var parent_class = DevaptView;
	var DevaptButtonClass = new DevaptClass('DevaptButton', parent_class, class_settings);
	
	// METHODS
	DevaptButtonClass.add_public_method('render_content_self', {}, cb_render_content_self);
	
	// PROPERTIES
	
	
	return DevaptButtonClass;
} );