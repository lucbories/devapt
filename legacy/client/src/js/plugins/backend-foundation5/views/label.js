/**
 * @file        plugins/backend-foundation5/views/label.js
 * @desc        Foundation 5 label class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
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
	 * @class				DevaptLabel
	 * @desc				Label view class
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptLabel
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
		self.span_jqo = $('<span>');
		self.content_jqo.append(self.span_jqo);
		
		// GET VIEW LABEL TEXT
		self.assert_not_empty_value(context, 'self.label', self.label);
		self.span_jqo.text(self.label);
		
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
			'created':'2014-08-21',
			'updated':'2014-12-13',
			'description':'Simple view class to display an text.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptView;
	var DevaptLabelClass = new DevaptClass('DevaptLabel', parent_class, class_settings);
	
	// METHODS
	DevaptLabelClass.add_public_method('render_self', {}, cb_render_self);
	
	// PROPERTIES
	// DevaptLabelClass.add_public_str_property('image_url',		'',		null, false, false, []);
	
	
	return DevaptLabelClass;
} );