/**
 * @file        backend-foundation5/views/image.js
 * @desc        Foundation 5 image class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/options', 'core/classes', 'core/resources', 'views/view', 'core/application', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptOptions, DevaptClasses, DevaptResources, DevaptView, DevaptApplication, undefined)
{
	/**
	 * @public
	 * @class				DevaptImage
	 * @desc				Image view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptImage(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_parent_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptImage';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptImage
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptImage_contructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context = self.class_name + '(' + arg_name + ')';
			self.enter(context, 'constructor');
			
			
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
		self.DevaptImage_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptImage
		 * @desc				Render view
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		self.render_self = function(arg_deferred)
		{
			var self = this;
			var context = 'render_self(deferred)';
			self.enter(context, '');
			
			
			// CHECK DEFEREED
			self.assertNotNull(context, 'arg_deferred', arg_deferred);
			
			// GET NODES
			self.assertNotNull(context, 'parent_jqo', self.parent_jqo);
			self.content_jqo = $('<img>');
			self.parent_jqo.append(self.content_jqo);
			
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
			self.assertNotEmptyValue(context, 'img url', url);
			self.content_jqo.attr('src', url);
			
			// RESOLVE AND GET PROMISE
			arg_deferred.resolve();
			var promise = arg_deferred.promise();
			
			
			self.leave(context, 'success: promise is resolved');
			return promise;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptImage, ['DevaptView'], 'Luc BORIES', '2013-08-21', 'Simple view class to display an image.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_str_option(DevaptImage, 'image_url',			null, false, []);
	DevaptOptions.register_str_option(DevaptImage, 'image_pathname',	null, false, []);
	
	
	return DevaptImage;
} );