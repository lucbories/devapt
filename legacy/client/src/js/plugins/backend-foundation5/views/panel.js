/**
 * @file        plugins/backend-foundation5/views/panel.js
 * @desc        Foundation 5 panel class
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
	 * @class				DevaptPanel
	 * @desc				Panel view class
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptPanel
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
		self.content_jqo.addClass('panel');
		
		// RESOLVE AND GET PROMISE
		self.step(context, 'deferred.resolve()');
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
			'description':'Simple view class to display a panel.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptView;
	var DevaptPanelClass = new DevaptClass('DevaptPanel', parent_class, class_settings);
	
	// METHODS
	DevaptPanelClass.add_public_method('render_self', {}, cb_render_self);
	
	// PROPERTIES
	
	
	
	return DevaptPanelClass;
} );