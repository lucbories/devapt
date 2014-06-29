/**
 * @file        backend-foundation5/views/breadcrumbs.js
 * @desc        Foundation 5 breadcrumbs class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-06-28
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/options', 'core/classes', 'core/resources', 'core/view', 'core/application', 'core/nav-history', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptOptions, DevaptClasses, DevaptResources, DevaptView, DevaptApplication, DevaptNavHistory, undefined)
{
	/**
	 * @public
	 * @class				DevaptBreadcrumbs
	 * @desc				Breadcrumbs view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_container_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptBreadcrumbs(arg_name, arg_container_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_container_jqo, arg_options);
		
		// INIT
		self.trace				= true;
		self.class_name			= 'DevaptBreadcrumbs';
		self.is_view			= true;
		self.history_labels		={};
		
		
		/**
		 * @public
		 * @memberof			DevaptBreadcrumbs
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptBreadcrumbs_contructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context = 'contructor(' + arg_name + ')';
			self.enter(context, '');
			
			
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
		self.DevaptBreadcrumbs_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptBreadcrumbs
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
			self.assertNotNull(context, 'container_jqo', self.container_jqo);
			
			// RENDER
			self.content_jqo = $('<ul>');
			self.content_jqo.addClass('breadcrumbs');
			self.container_jqo.append(self.content_jqo);
			
			
			// LOOP ON NAV HISTORY
			var nav_stack = DevaptNavHistory.history_stack;
			self.value(context, 'breadcrumbs html content', nav_stack);
			for(content_key in self.nav_stack)
			{
				var state = self.nav_stack[content_key];
				self.assert(context, 'nav content at [' + content_key + ']', state);
				self.add_history_item(state);
			}
			
			
			// RESOVE RENDER
			arg_deferred.resolve(this);
			
			// GET PROMISE
			var promise = arg_deferred.promise();
			
			
			self.leave(context, 'success: promise is resolved');
			return promise;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptBreadcrumbs
		 * @desc				Add an history item
		* @param {object}		arg_operands_array		[target object, navigation history state object]
		 * @return {nothing}
		 */
		self.add_history_item = function(arg_operands_array)
		{
			var self = this;
			var context = 'add_history_item(state)';
			self.enter(context, '');
			
			
			var arg_state = arg_operands_array[1];
			
			if ( self.history_labels[arg_state.content_label] )
			{
				self.leave(context, 'success: already in history');
				return;
			}
			
			self.history_labels[arg_state.content_label] = arg_state;
			
			
			// self.value(context, '', arg_state);
			console.log(arg_state);
			
			var li_jqo = $('<li>');
			self.content_jqo.append(li_jqo);
			
			var a_jqo = $('<a>');
			li_jqo.append(a_jqo);
			
			a_jqo.attr('href', '#');
			a_jqo.text('text:' + arg_state.content_label);
			a_jqo.click(
				(
					function(state)
					{
						return function()
						{
							DevaptNavHistory.set_content(state, true);
						}
					}
				)(arg_state)
			);
			
			
			self.leave(context, 'success');
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptBreadcrumbs, ['DevaptView'], 'Luc BORIES', '2014-05-09', 'Simple view class to display a breadcrumbs of items.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_str_option(DevaptBreadcrumbs, 'list_content_type',		'text', true, []); // text, html
	DevaptOptions.register_option(DevaptBreadcrumbs, {
			name: 'list_contents',
			type: 'array',
			aliases: [],
			default_value: [],
			array_separator: ',',
			array_type: 'String',
			format: '',
			is_required: true,
			childs: {}
		}
	);
	
	
	return DevaptBreadcrumbs;
} );