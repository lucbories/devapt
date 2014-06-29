/**
 * @file        backend-foundation5/views/block-grid.js
 * @desc        Foundation 5 block-grid class
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
	 * @class				DevaptBlockGrid
	 * @desc				BlockGrid view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_container_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptBlockGrid(arg_name, arg_container_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_container_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptBlockGrid';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptBlockGrid
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptBlockGrid_contructor = function()
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
		self.DevaptBlockGrid_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptBlockGrid
		 * @desc				Render view
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		self.render_self = function(arg_deferred)
		{
			var self = this;
			var context = 'render_self(deferred)';
			self.enter(context, '');
			
			
			// CHECK CONTAINER
			self.assertNotNull(context, 'container_jqo', self.container_jqo);
			// console.log(self.container_jqo);
			
			
			// GET BLOCKS COUNT
			var small_blocks = Math.max( Math.min(self.small_device_blocks, 12), 1);
			var medium_blocks = Math.max( Math.min(self.medium_device_blocks, 12), 1);
			var large_blocks = Math.max( Math.min(self.large_device_blocks, 12), 1);
			
			
			// CREATE MAIN NODE
			var ul_jqo = $('<ul>');
			ul_jqo.addClass('small-block-grid-' + small_blocks);
			ul_jqo.addClass('medium-block-grid-' + medium_blocks);
			ul_jqo.addClass('large-block-grid-' + large_blocks);
			self.container_jqo.append(ul_jqo);
			
			
			// LOOP ON GRID CONTENTS
			switch(self.grid_content_type.toLocaleLowerCase())
			{
				case 'html':
				{
					for(content_key in self.grid_contents)
					{
						var content = self.grid_contents[content_key];
						self.assert(context, 'html content at [' + content_key + ']', DevaptTypes.is_string(content));
						
						var li_jqo = $('<li>');
						ul_jqo.append(li_jqo);
						li_jqo.html(content);
					}
					
					// RESOVE RENDER
					arg_deferred.resolve();
					break;
				}
				
				case 'text':
				{
					for(content_key in self.grid_contents)
					{
						var content = self.grid_contents[content_key];
						self.assert(context, 'html content at [' + content_key + ']', DevaptTypes.is_string(content));
						
						var li_jqo = $('<li>');
						ul_jqo.append(li_jqo);
						var span_jqo = $('<span>');
						span_jqo.html(content);
						li_jqo.append(span_jqo);
					}
					
					// RESOVE RENDER
					arg_deferred.resolve();
					break;
				}
				
				case 'view':
				{
					for(content_key in self.grid_contents)
					{
						var content = self.grid_contents[content_key];
						self.assert(context, 'view content at [' + content_key + ']', DevaptTypes.is_string(content) );
						
						var li_jqo = $('<li>');
						ul_jqo.append(li_jqo);
						
						// TODO VIEW CONTENTS
						(
							function(view_name, container_jqo)
							{
								require(
									['core/resources'],
									function(DevaptResources)
									{
										var promise = DevaptResources.get_resource_instance(view_name);
										var render_cb =
											function(view_obj)
											{
												self.step(context, 'render callback');
												view_obj.set_container(container_jqo);
												view_obj.render();
											};
										promise.then(render_cb);
									}
								);
							}
						)(content, li_jqo);
					}
					break;
				}
				
				case 'callback':
				{
					for(content_key in self.grid_contents)
					{
						var content = self.grid_contents[content_key];
						self.assert(context, 'callback content at [' + content_key + ']', DevaptTypes.is_callback(content));
						
						var li_jqo = $('<li>');
						ul_jqo.append(li_jqo);
						content(li_jqo);
					}
					
					// RESOVE RENDER
					arg_deferred.resolve();
					break;
				}
			}
			
			
			self.leave(context, 'success');
			return arg_deferred.promise();
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptBlockGrid, ['DevaptView'], 'Luc BORIES', '2013-08-21', 'Split contents of a list within a grid.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_str_option(DevaptBlockGrid, 'grid_content_type', 'html', true, []); // view, html, text, callback
	DevaptOptions.register_int_option(DevaptBlockGrid, 'small_device_blocks', 2, false, []);
	DevaptOptions.register_int_option(DevaptBlockGrid, 'medium_device_blocks', 4, false, []);
	DevaptOptions.register_int_option(DevaptBlockGrid, 'large_device_blocks', 6, false, []);
	DevaptOptions.register_option(DevaptBlockGrid, {
			name: 'grid_contents',
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
	
	return DevaptBlockGrid;
} );