/**
 * @file        plugins/backend-foundation5/views/image.js
 * @desc        Foundation 5 image class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'views/view', 'core/application', 'plugins/backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes, DevaptClass, DevaptView, DevaptApplication, undefined)
{
	/**
	 * @public
	 * @class				DevaptImage
	 * @desc				Image view class
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptImage
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
		self.img_jqo = $('<img>');
		self.content_jqo.append(self.img_jqo);
		
		// GET VIEW URL
		var url = null;
		if ( DevaptTypes.is_not_empty_str(self.image_url) )
		{
			url = DevaptTypes.to_string(self.image_url);
		}
		else if ( DevaptTypes.is_not_empty_str(self.image_pathname) )
		{
			url = DevaptApplication.get_url_base() + '../modules/' + DevaptTypes.to_string(self.image_pathname);
		}
		self.assert_not_empty_value(context, 'img url', url);
		self.img_jqo.attr('src', url);
		
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
			'description':'Simple view class to display an image.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptView;
	var DevaptImageClass = new DevaptClass('DevaptImage', parent_class, class_settings);
	
	// METHODS
	DevaptImageClass.add_public_method('render_self', {}, cb_render_self);
	
	// PROPERTIES
	DevaptImageClass.add_public_str_property('image_url',		'',		null, false, false, []);
	DevaptImageClass.add_public_str_property('image_pathname',	'',		null, false, false, []);
	
	
	return DevaptImageClass;
} );