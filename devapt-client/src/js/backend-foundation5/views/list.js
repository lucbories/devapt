/**
 * @file        backend-foundation5/views/list.js
 * @desc        Foundation 5 list class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-06-28
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
	 * @class				DevaptList
	 * @desc				List view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_container_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptList(arg_name, arg_container_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_container_jqo, arg_options);
		
		// INIT
		self.trace				= true;
		self.class_name			= 'DevaptList';
		self.is_view			= true;
		// self.step_content_jqo	= false;
		// self.step_container_jqo	= false;
		
		
		/**
		 * @public
		 * @memberof			DevaptList
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptList_contructor = function()
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
		self.DevaptList_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptList
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
			self.content_jqo.addClass('side-nav');
			self.container_jqo.append(self.content_jqo);
			
			
			// LOOP ON GRID CONTENTS
			switch(self.list_content_type.toLocaleLowerCase())
			{
				case 'html':
				{
					self.step(context, 'list type is html');
					self.value(context, 'list html content', self.list_contents);
					for(content_key in self.list_contents)
					{
						var content = self.list_contents[content_key];
						self.assert(context, 'html content at [' + content_key + ']', DevaptTypes.is_string(content));
						
						var li_jqo = $('<li>');
						self.content_jqo.append(li_jqo);
						li_jqo.html(content);
					}
					
					// RESOVE RENDER
					arg_deferred.resolve();
					break;
				}
				
				case 'text':
				{
					self.step(context, 'list type is text');
					self.value(context, 'list text content', self.list_contents);
					for(content_key in self.list_contents)
					{
						var content = self.list_contents[content_key];
						self.assert(context, 'text content at [' + content_key + ']', DevaptTypes.is_string(content));
						
						var li_jqo = $('<li>');
						self.content_jqo.append(li_jqo);
						
						if (content === 'divider')
						{
							li_jqo.addClass('divider');
							continue;
						}
						
						var a_jqo = $('<a href="#">');
						a_jqo.html(content);
						li_jqo.append(a_jqo);
					}
					
					// RESOVE RENDER
					arg_deferred.resolve();
					break;
				}
				
				default:
				{
					self.value(context, 'bad list type', self.list_content_type.toLocaleLowerCase() );
				}
			}
			
			// RESOLVE AND GET PROMISE
			// arg_deferred.resolve();
			var promise = arg_deferred.promise();
			
			
			self.leave(context, 'success: promise is resolved');
			return promise;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptList, ['DevaptView'], 'Luc BORIES', '2014-05-09', 'Simple view class to display a list of items.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_str_option(DevaptList, 'list_content_type',		'text', true, []); // text, html
	DevaptOptions.register_option(DevaptList, {
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
	
	
	return DevaptList;
} );