/**
 * @file        backend-foundation5/views/label.js
 * @desc        Foundation 5 label class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/options', 'core/classes', 'core/resources', 'core/view', 'core/application', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptOptions, DevaptClasses, DevaptResources, DevaptView, DevaptApplication, undefined)
{
	/**
	 * @public
	 * @class				DevaptLabel
	 * @desc				Label view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_container_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptLabel(arg_name, arg_container_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_container_jqo, arg_options);
		
		// INIT
		self.trace				= true;
		self.class_name			= 'DevaptLabel';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptLabel
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptLabel_contructor = function()
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
		self.DevaptLabel_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptLabel
		 * @desc				Render view
		 * @return {boolean}	true:success,false:failure
		 */
		self.render_self = function()
		{
			var self = this;
			var context = 'render_self()';
			self.enter(context, '');
			
			
			// GET NODES
			self.assertNotNull(context, 'container_jqo', self.container_jqo);
			var content_jqo = $('<span>');
			self.container_jqo.append(content_jqo);
			
			// GET VIEW LABEL TEXT
			self.assertNotEmptyValue(context, 'self.label_text', self.label_text);
			content_jqo.text(self.label_text);
			// self.container_jqo.addClass('row');
			
			
			self.leave(context, 'success');
			return true;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptLabel, ['DevaptView'], 'Luc BORIES', '2013-08-21', 'Simple view class to display a text.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_str_option(DevaptLabel, 'label_text',			null, true, []);
	
	
	return DevaptLabel;
} );