/**
 * @file        backend-foundation5/views/row.js
 * @desc        Foundation 5 row class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/options', 'core/classes', 'core/view', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptOptions, DevaptClasses, DevaptView, undefined)
{
	/**
	 * @public
	 * @class				DevaptRow
	 * @desc				Row view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_container_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptRow(arg_name, arg_container_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_container_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptRow';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptRow
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptRow_contructor = function()
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
		self.DevaptRow_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptRow
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
			// console.log(self.container_jqo);
			
			// TOD CHECK CONTAINER TAG
			/*if ( self.container_jqo.tag_name !== 'div' )
			{
				var old_jqo = self.container_jqo;
				// var parent_jqo = old_jqo.parent();
				self.container_jqo = $('<div>');
				self.container_jqo.attr('id', self.get_view_id() );
				old_jqo.replaceWith(self.container_jqo);
			}*/
			
			self.container_jqo.addClass('row');
			
			
			self.leave(context, 'success');
			return true;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptRow, ['DevaptView'], 'Luc BORIES', '2013-08-21', 'Simple view class to display a text.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	// DevaptOptions.register_str_option(DevaptRow, 'panel_text',			null, true, []);
	
	
	return DevaptRow;
} );