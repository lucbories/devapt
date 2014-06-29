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
		 * @desc				Set view container
		 * @param {object}		arg_jquery_object	JQuery object to attach the view to (object)
		 * @return {boolean}	true:success,false:failure
		 */
		self.set_container = function(arg_jquery_object)
		{
			var self = this;
			var context = 'set_container(jqo)';
			self.enter(context, '');
			
			
			// SET CONTAINER JQUERY OBJECT
			self.container_jqo = DevaptTypes.is_null(arg_jquery_object) ? $('#' + self.name + '_view_id') : arg_jquery_object;
			if (self.trace)
			{
				console.log(arg_jquery_object, 'arg_jquery_object');
				console.log(self.container_jqo, 'container_jqo');
			}
			
			// CHECK CONTAINER JQO
			self.assertNotNull(context, 'self.container_jqo', self.container_jqo);
			
			// SET ID
			if ( DevaptTypes.is_object(self.container_jqo) )
			{
				if ( self.container_jqo.attr('id') === 'page_content_id' )
				{
					var jqo =$('<div>');
					self.container_jqo.append(jqo);
					self.container_jqo = jqo;
				}
				
				if ( DevaptTypes.is_not_empty_str(self.html_id) )
				{
					self.container_jqo.attr('id', self.html_id);
				}
			}
			
			
			self.container_jqo.addClass('row');
			
			
			self.leave(context, 'success');
			return true;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptRow
		 * @desc				Render view
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		self.render_self = function(arg_deferred)
		{
			var self = this;
			var context = 'render_self(deferred)';
			self.enter(context, '');
			
			
			// GET NODES
			self.assertNotNull(context, 'container_jqo', self.container_jqo);
			// console.log(self.container_jqo);
			
			// CHECK CONTAINER TAG
			if ( self.container_jqo.tagName !== 'DIV' )
			{
				var old_jqo = self.container_jqo;
				// var parent_jqo = old_jqo.parent();
				self.container_jqo = $('<div>');
				self.container_jqo.attr('id', self.get_view_id() );
				old_jqo.replaceWith(self.container_jqo);
			}
			
			self.container_jqo.addClass('row');
			
			// RESOLVE AND GET PROMISE
			arg_deferred.resolve();
			var promise = arg_deferred.promise();
			
			
			self.leave(context, 'success: promise is resolved');
			return promise;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptRow, ['DevaptView'], 'Luc BORIES', '2013-08-21', 'Simple view class to display a text.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	// DevaptOptions.register_str_option(DevaptRow, 'panel_text',			null, true, []);
	
	
	return DevaptRow;
} );