/**
 * @file        views/mixin-template.js
 * @desc        Mixin of template methods for view rendering
 * @see			DevaptMixinTemplate
 * @ingroup     DEVAPT_CORE
 * @date        2014-07-14
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/class', 'core/resources', 'core/template'],
function(Devapt, DevaptTypes, DevaptClass, DevaptResources, DevaptTemplate)
{
	/**
	 * @mixin				DevaptMixinTemplate
	 * @public
	 * @desc				Mixin of template methods
	 */
	var DevaptMixinTemplate = 
	{
		/**
		 * @memberof			DevaptMixinTemplate
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_template_trace: false,
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinTemplate
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init: function()
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinTemplate.mixin_template_trace);
			var context = 'mixin_init()';
			self.enter(context, '');
			
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinTemplate
		 * @desc				Render template
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		render_template: function(arg_deferred)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinTemplate.mixin_template_trace);
			var context = 'render_template(deferred)';
			self.enter(context, '');
			
			
			// DEBUG FLAG
			// self.trace = true;
			
			
			// GET CURRENT BACKEND
			var backend = Devapt.get_current_backend();
			self.assertNotNull(context, 'backend', backend);
			
			
			// CHECK IF TEMPLATE IS ENABLED
			if ( ! self.template_enabled )
			{
				self.step(context, 'deferred.resolve(): template is disabled');
				self.leave(context, 'template isn\'t enabled: render is resoved');
				self.pop_trace();
				arg_deferred.resolve();
				return arg_deferred.promise();
			}
			
			
			// GET TEMPLATE STRING
			if ( ! DevaptTypes.is_not_empty_str(self.template_string) )
			{
				self.step(context, 'deferred.resolve(null)');
				self.leave(context, 'template string is empty: render is resoved');
				self.pop_trace();
				arg_deferred.resolve();
				return arg_deferred.promise();
			}
			// console.log(self.template_string);
			// console.log(self.template_bindings);
			
			// INIT AFTER RENDER CALLBACKS
			// var after_render_cb_array = [];
			
			
			// GET STANDARD TAGS
			var std_tags_object = backend.get_template_std_tags();
			
			
			// GET VIEW TAGS
			var view_tags_object = self.get_view_tags();
			
			
			// GET VIEW TAGS ARRAYS
			var view_tags_arrays_object = self.get_view_tags_arrays();
			
			
			// GET VIEW BINDINGS
			var view_bindings_object = self.get_view_bindings(arg_deferred);
			
			
			// THIS TAG
			var this_tag = self.get_this_tag(arg_deferred);
			
			
			// MERGE TAGS
			var $ = Devapt.jQuery();
			var tags_object = $.extend({}, this_tag, std_tags_object, view_tags_object, view_tags_arrays_object, view_bindings_object);
			// console.log(tags_object);
			
			
			// RENDER TEMPLATE
			var str = DevaptTemplate.render(self.template_string, tags_object);
			self.step(context, 'set content jqo html');
			self.template_jqo = $('<div>');
			self.template_jqo.html(str);
			// console.log(self.template_jqo, 'self.template_jqo');
			
			// NO THIS IN TEMPLATE
			var this_regexp = /.*[{]this[}].*/gm;
			if ( ! this_regexp.test(self.template_string) )
			{
				self.step(context, 'no {this} in template');
				
				var this_id = self.get_view_id();
				var this_tag_id = 'this_' + this_id;
				var this_tag_jqo = $('#' + this_tag_id);
				
				self.content_jqo.append(self.template_jqo);
				
				// console.log(self.parent_jqo, 'self.parent_jqo');
				// console.log(self.content_jqo, 'self.content_jqo');
				// console.log(self.template_jqo, 'self.template_jqo');
			}
			else
			{
				self.step(context, '{this} found in template');
			}
			
			// RESOVE RENDER
			self.step(context, 'deferred.resolve()');
			arg_deferred.resolve();
			
			
			self.leave(context, 'success: render is resolved');
			self.pop_trace();
			return arg_deferred.promise();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinTemplate
		 * @desc				Get view tags
		 * @return {object}		tags map
		 */
		get_view_tags: function()
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinTemplate.mixin_template_trace);
			var context = 'get_view_tags()';
			self.enter(context, '');
			
			
			var view_tags = self.template_tags;
			var view_tags_object = null;
			
			if ( DevaptTypes.is_object(view_tags) )
			{
				self.step(context, 'view_tags is object');
				view_tags_object = view_tags;
			}
			else if ( DevaptTypes.is_string(view_tags) )
			{
				self.step(context, 'view_tags is string');
				view_tags = view_tags.split(',');
				if ( DevaptTypes.is_array(view_tags) )
				{
					view_tags_object = {};
					for(view_tag_index in view_tags)
					{
						var view_tag_record = view_tags[view_tag_index].split('=');
						if ( DevaptTypes.is_array(view_tag_record) && view_tag_record.length === 2 )
						{
							var tag_name = view_tag_record[0];
							var tag_value = view_tag_record[1];
							view_tags_object[tag_name] = tag_value;
						}
					}
				}
			}
			else
			{
				self.step(context, 'view_tags is unknow');
			}
			
			
			self.leave(context, 'success');
			self.pop_trace();
			return view_tags_object;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinTemplate
		 * @desc				Get view tags arrays
		 * @return {object}		tags arrays map
		 */
		get_view_tags_arrays: function()
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinTemplate.mixin_template_trace);
			var context = 'get_view_tags_arrays()';
			self.enter(context, '');
			
			
			var view_tags_arrays_1 = self.template_arrays_1;
			var view_tags_arrays_object = null;
			
			if ( DevaptTypes.is_array(view_tags_arrays_1) )
			{
				self.step(context, 'loop on view_tags_arrays_1 is an array');
				view_tags_arrays_object = {};
				view_tags_arrays_object['array1'] = view_tags_arrays_1;
			}
			else
			{
				self.step(context, 'view_tags_arrays_1 is unknow');
			}
			
			
			self.leave(context, 'success');
			self.pop_trace();
			return view_tags_arrays_object;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinTemplate
		 * @desc				Get view bindings
		 * @return {object}		bindings map
		 */
		get_view_bindings: function(arg_deferred)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinTemplate.mixin_template_trace);
			var context = 'get_view_bindings()';
			self.enter(context, '');
			
			
			// GET CURRENT BACKEND
			var backend = Devapt.get_current_backend();
			self.assertNotNull(context, 'backend', backend);
			
			
			var view_bindings = self.template_bindings;
			var view_bindings_object = null;
			
			if ( DevaptTypes.is_object(view_bindings) )
			{
				self.step(context, 'view_bindings is object');
				view_bindings_object = view_bindings;
			}
			else if ( DevaptTypes.is_string(view_bindings) )
			{
				self.step(context, 'view_bindings is string');
				view_bindings = view_bindings.split(',');
				if ( DevaptTypes.is_array(view_bindings) )
				{
					self.step(context, 'view_bindings split is array');
					
					var view_bindings_object = {};
					for(view_binding_index in view_bindings)
					{
						self.step(context, 'view_binding at index [' + view_binding_index + ']');
						var view_tag_record = view_bindings[view_binding_index].split('=');
						if ( DevaptTypes.is_array(view_tag_record) && view_tag_record.length === 2 )
						{
							var tag_name = view_tag_record[0];
							var tag_value = view_tag_record[1];
							self.value(context, 'tag_name', tag_name);
							self.value(context, 'tag_value', tag_value);
							
							self.step(context, 'view_binding is a view name');
							view_bindings_object[tag_name] =
							(
								function(view_name,backend_object)
								{
									var view_tag_id = view_name + '_view_id';
									return function()
									{
										var closure_cb =
											(
												function(view_tag_id,view_name,backend_object)
												{
													return function()
													{
														var tag_jqo = $('#' + view_tag_id);
														var promise = backend_object.render_view(tag_jqo, view_name);
														
														// DEBUG
														// console.log(view_name, 'view_name');
														// console.log(view_tag_id, 'view_tag_id');
														// console.log(tag_jqo, 'view_tag_jqo');
													}
												}
											) (view_tag_id,view_name,backend_object);
										
										// REGISTER RENDER CALLBACK
										arg_deferred.then( function() { self.do_callback(closure_cb); } );
										
										// CREATE VIEW CONTENT TAG
										return '<div id="' + view_tag_id + '" devapt-type="container"></div>';
									}
								}
							) (tag_value,backend);
						}
					}
				}
			}
			else
			{
				self.step(context, 'view_bindings is unknow');
			}
			
			
			self.leave(context, 'success');
			self.pop_trace();
			return view_bindings_object;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinTemplate
		 * @desc				Get 'this' tag
		 * @return {object}		'this' tag
		 */
		get_this_tag: function(arg_deferred)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinTemplate.mixin_template_trace);
			var context = 'get_this_tag()';
			self.enter(context, '');
			
			
			// console.log(context, self.name);
			
			var this_id = self.get_view_id();
			var this_tag_id = 'this_' + this_id;
			var this_tag = {
				'this': function()
					{
						// console.log(context + ':this_tag');
						
						// CREATE RENDER CALLBACK
						var closure_cb =
							(
								function(view, content_id)
								{
									return function()
									{
										// console.log(context + ':this_tag:closure_cb');
										
										view.render_self( $.Deferred() ).then(
											function()
											{
												
												var content_children = view.content_jqo.children();
												content_children.detach();
												
												view.content_jqo.append(view.template_jqo);
												var this_tag_jqo = $('#' + content_id);
												
												this_tag_jqo.append(content_children);
												
												// console.log($(content_children[0]), 'content_children');
												// console.log(this_tag_jqo, 'this_tag_jqo');
												// console.log(view.template_jqo, 'view.template_jqo');
												// console.log(view.content_jqo, 'view.content_jqo');
												// console.log(view.parent_jqo, 'view.parent_jqo');
											}
										);
									}
								}
							) (self,this_tag_id);
								
						// REGISTER RENDER CALLBACK
						arg_deferred.then( function() { self.do_callback(closure_cb); } );
						
						// CREATE VIEW CONTENT TAG
						// console.log('returns this tag');
						return '<div id="' + this_tag_id + '"></div>';
					}
				};
			
			
			self.leave(context, 'success');
			self.pop_trace();
			return this_tag;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-14',
			'updated':'2014-12-06',
			'description':'Mixin methods for template rendering.'
		}
	};
	
	
	/**
	 * @mixin				DevaptMixinTemplateClass
	 * @public
	 * @desc				Mixin of methods for template rendering
	 */
	var DevaptMixinTemplateClass = new DevaptClass('DevaptMixinTemplate', null, class_settings);
	
	DevaptMixinTemplateClass.add_public_method('mixin_template_init', {}, DevaptMixinTemplate.mixin_init);
	DevaptMixinTemplateClass.add_public_method('render_template', {}, DevaptMixinTemplate.render_template);
	DevaptMixinTemplateClass.add_public_method('get_view_tags', {}, DevaptMixinTemplate.get_view_tags);
	DevaptMixinTemplateClass.add_public_method('get_view_tags_arrays', {}, DevaptMixinTemplate.get_view_tags_arrays);
	DevaptMixinTemplateClass.add_public_method('get_view_bindings', {}, DevaptMixinTemplate.get_view_bindings);
	DevaptMixinTemplateClass.add_public_method('get_this_tag', {}, DevaptMixinTemplate.get_this_tag);
	
	DevaptMixinTemplateClass.add_public_bool_property('template_enabled',		'', false, false, false, ['view_template_enabled']);
	DevaptMixinTemplateClass.add_public_str_property('template_string',			'', null, false, false, ['view_template_string']);
	DevaptMixinTemplateClass.add_public_str_property('template_file_name',		'', null, false, false, ['view_template_file_name']);
	DevaptMixinTemplateClass.add_public_str_property('template_tags',			'', null, false, false, ['view_template_tags']);
	DevaptMixinTemplateClass.add_public_str_property('template_bindings',		'', null, false, false, ['view_template_bindings']);
	DevaptMixinTemplateClass.add_public_array_property('template_arrays_1',		'', null, false, false, [], 'string', ',');
	DevaptMixinTemplateClass.add_public_array_property('template_arrays_2',		'', null, false, false, [], 'string', ',');
	DevaptMixinTemplateClass.add_public_array_property('template_arrays_3',		'', null, false, false, [], 'string', ',');
	
	DevaptMixinTemplateClass.build_class();
	
	
	return DevaptMixinTemplateClass;
}
);