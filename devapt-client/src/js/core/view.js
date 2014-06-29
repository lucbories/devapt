/**
 * @file        core/view.js
 * @desc        View base class
 * @ingroup     DEVAPT_CORE
 * @date        2014-05-10
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/object', 'core/types', 'core/options', 'core/classes', 'core/resources', 'core/template'],
function(Devapt, DevaptObject, DevaptTypes, DevaptOptions, DevaptClasses, DevaptResources, DevaptTemplate)
{
	/**
	 * @public
	 * @class				DevaptView
	 * @desc				View class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_container_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptView(arg_name, arg_container_jqo, arg_options)
	{
		var self = this;
		self.trace				= false;
		
		// INHERIT
		self.inheritFrom = DevaptObject;
		self.inheritFrom(arg_name, arg_options, false);
		
		// INIT
		// self.trace				= false;
		self.class_name			= 'DevaptView';
		self.is_view			= true;
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
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
				if ( DevaptTypes.is_not_empty_str(self.html_id) )
				{
					self.container_jqo.attr('id', self.html_id);
				}
			}
			
			
			self.leave(context, 'success');
			return true;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptView_contructor = function()
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
			
			// VIEW ATTRIBUTES
			self.assert(context, 'set_container', self.set_container(arg_container_jqo) );
			
			
			// REGISTER THE VIEW TO THE REPOSITORY
			DevaptResources.add_resource_instance(self);
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		}
		
		
		// CONTRUCT INSTANCE
		self.DevaptView_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Get view id
		 * @return {string}		HTML tag id
		 */
		self.get_view_id = function()
		{
			return self.name + '_view_id';
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Render view
		 * @return {object}		deferred promise object
		 */
		self.render = function()
		{
			var self = this;
			var context = 'render()';
			self.enter(context, '');
			
			
			// CREATE REFERRED OBJECT
			var deferred = $.Deferred();
			
			// RENDER WITH TEMPLATE
			if ( self.template_enabled )
			{
				var promise = self.render_template(deferred);
				
				self.leave(context, 'render with template');
				return promise;
			}
			
			// RENDER WITHOUT TEMPLATE
			var promise = self.render_self(deferred);
			
			
			self.leave(context, 'render without template');
			return promise;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Render view content without template
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		self.render_self = function(arg_deferred)
		{
			var self = this;
			var context = 'render_self(deferred)';
			self.enter(context, '');
			
			
			// NOT YET IMPLEMENTED
			self.step(context, 'not implemented in this base class : implement in child classes');
			
			// RESOVE RENDER
			arg_deferred.resolve();
			
			
			self.leave(context, 'success (not implemented)');
			return arg_deferred.promise();
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Render template
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		self.render_template = function(arg_deferred)
		{
			var self = this;
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
				self.leave(context, 'template isn\'t enabled: render is resoved');
				arg_deferred.resolve();
				return arg_deferred.promise();
			}
			
			
			// GET TEMPLATE STRING
			if ( ! DevaptTypes.is_not_empty_str(self.template_string) )
			{
				self.leave(context, 'template string is empty: render is resoved');
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
			self.container_jqo.html(str);
			
			
			// RESOVE RENDER
			arg_deferred.resolve();
			
			
			self.leave(context, 'success: render is resolved');
			return arg_deferred.promise();
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Get view tags
		 * @return {object}		tags map
		 */
		self.get_view_tags = function()
		{
			var self = this;
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
			return view_tags_object;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Get view tags arrays
		 * @return {object}		tags arrays map
		 */
		self.get_view_tags_arrays = function()
		{
			var self = this;
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
			return view_tags_arrays_object;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Get view bindings
		 * @return {object}		bindings map
		 */
		self.get_view_bindings = function(arg_deferred)
		{
			var self = this;
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
			return view_bindings_object;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Get 'this' tag
		 * @return {object}		'this' tag
		 */
		self.get_this_tag = function(arg_deferred)
		{
			var self = this;
			var context = 'get_this_tag()';
			self.enter(context, '');
			
			
			var this_id = self.get_view_id();
			var this_tag_id = 'this_' + this_id;
			var this_tag = {
				'this': function()
					{
						// CREATE RENDER CALLBACK
						var closure_cb =
							(
								function(view,content_id)
								{
									return function()
									{
										// REMOVE EXISTING CONTAINER
										var container_jqo = $('#' + content_id);
										// if (container_jqo && self.class_name != 'DevaptRow')
										// {
											// container_jqo.attr('id', '');
										// }
										view.set_container( $('#' + content_id) );
										view.render_self(arg_deferred);
									}
								}
							) (self,this_tag_id);
										
							// REGISTER RENDER CALLBACK
							arg_deferred.then( function() { self.do_callback(closure_cb); } );
						
						// CREATE VIEW CONTENT TAG
						return '<div id="' + this_tag_id + '"></div>';
					}
				};
			
			
			self.leave(context, 'success');
			return this_tag;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Edit view settings
		 * @return {boolean}	true:success,false:failure
		 */
		self.edit_settings = function()
		{
			var self = this;
			var context = 'edit_settings()';
			self.enter(context, '');
			
			self.step(context, 'not implemented in this base class : implement in child classes');
			
			self.leave(context, 'success');
			return true;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Template feature : Compile template string with bindings and tags
		 * @param {string}		arg_template_str	Template string
		 * @param {object}		arg_tags			Tags associative array as string key/string value
		 * @param {object}		arg_bindings		Tags associative array as string key/view object value
		 * @return {string}		Compiled string
		 */
		// self.compile_template = function(arg_template_str, arg_tags, arg_bindings)
		// {
			// var self = this;
			// var context = 'compile_template(template,tags,bindings)';
			// self.enter(context, '');
			
			// self.step(context, 'not yet implemented');
			
			// self.leave(context, 'success');
			// return arg_template_str;
		// }
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Translation feature : Translate given string in active language
		 * @param {string}		arg_sentance_str		String to translate
		 * @param {string}		arg_translation_context	Tags associative array as string key/string value
		 * @return {string}		Translated string
		 */
		self.translate = function(arg_sentance_str, arg_translation_context)
		{
			var self = this;
			var context = 'translate(sentance,translation context)';
			self.enter(context, '');
			
			self.step(context, 'not yet implemented');
			
			self.leave(context, 'success');
			return arg_sentance_str;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				On change event
		 * @return {boolean}	true:success,false:failure
		 */
		self.on_change = function()
		{
			var self = this;
			var context = 'on_change()';
			self.enter(context, '');
			
			// ON CHANGE HANDLER
			if ( ! DevaptTypes.is_null(self.js_on_change) )
			{
				eval(self.js_on_change);
			}
			
			self.leave(context, 'success');
			return true;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				On refresh event
		 * @return {boolean}	true:success,false:failure
		 */
		self.on_refresh = function()
		{
			var self = this;
			var context = 'on_refresh()';
			self.enter(context, '');
			
			// ON CHANGE HANDLER
			if ( ! DevaptTypes.is_null(self.js_on_refresh) )
			{
				eval(self.js_on_refresh);
			}
			
			self.leave(context, 'success');
			return true;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				On filled event
		 * @return {boolean}	true:success,false:failure
		 */
		self.on_filled = function()
		{
			var self = this;
			var context = 'on_filled()';
			self.enter(context, '');
			
			// ON CHANGE HANDLER
			if ( ! DevaptTypes.is_null(self.js_on_filled) )
			{
				eval(self.js_on_filled);
			}
			
			self.leave(context, 'success');
			return true;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				On ready
		 * @return {boolean}	true:success,false:failure
		 */
		self.on_ready = function()
		{
			var self = this;
			var context = 'on_ready()';
			self.enter(context, '');
			
			// ON READY HANDLER
			if ( ! DevaptTypes.is_null(self.js_on_ready) )
			{
				eval(self.js_on_ready);
			}
			
			self.leave(context, 'success');
			return true;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @method				to_string_self()
		 * @desc				Get a string dump of the object
		 * @return {string}		String dump
		 */
		self.to_string_self = function()
		{
			var self = this;
			return 'base view class';
		}
		
		
		/* --------------------------------------------------------------------------------------------- */
		// APPEND MIXIN METHODS
		// self.register_mixin(...);
		/* --------------------------------------------------------------------------------------------- */
		
		
		// ON READY HANDLER
		if ( DevaptTypes.is_null(arg_options) || arg_options.class_name == 'DevaptView')
		{
			this.on_ready();
		}
	}


	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptView, ['DevaptObject'], 'Luc BORIES', '2013-08-21', 'All views base class.');


	// INTROSPETION : REGISTER OPTIONS
	// DevaptOptions.register_str_option(DevaptView, 'parent_view_name',		null, false, ['view_parent_view_name']);
	DevaptOptions.register_str_option(DevaptView, 'html_id',				null, false, ['view_html_id']);
	DevaptOptions.register_str_option(DevaptView, 'label',					null, false, ['view_label']);
	DevaptOptions.register_str_option(DevaptView, 'tooltip',				null, false, ['view_tooltip']);

	DevaptOptions.register_bool_option(DevaptView, 'template_enabled',		false, false, ['view_template_enabled']);
	DevaptOptions.register_str_option(DevaptView, 'template_string',		null, false, ['view_template_string']);
	DevaptOptions.register_str_option(DevaptView, 'template_file_name',		null, false, ['view_template_file_name']);
	DevaptOptions.register_str_option(DevaptView, 'template_tags',			null, false, ['view_template_tags']);
	DevaptOptions.register_str_option(DevaptView, 'template_bindings',		null, false, ['view_template_bindings']);

	/*
	CHILDS OPTIONS : BROKEN FEATURE
	DevaptOptions.register_obj_option(DevaptView, 'template_arrays',		null, false, ['view_template_arrays'],
		{
			array1: {
				name: 'array1',
				type: 'array',
				aliases: [],
				default_value: [],
				array_separator: ',',
				array_type: 'String',
				format: '',
				is_required: false,
				childs: {}
			},
			array2: {
				name: 'array2',
				type: 'array',
				aliases: [],
				default_value: [],
				array_separator: ',',
				array_type: 'String',
				format: '',
				is_required: false,
				childs: {}
			},
			array3: {
				name: 'array3',
				type: 'array',
				aliases: [],
				default_value: [],
				array_separator: ',',
				array_type: 'String',
				format: '',
				is_required: false,
				childs: {}
			}
		}
	);*/
	
	
	DevaptOptions.register_option(DevaptView, {
			name: 'template_arrays_1',
			type: 'array',
			aliases: [],
			default_value: [],
			array_separator: ',',
			array_type: 'String',
			format: '',
			is_required: false,
			childs: {}
		}
	);
	
	DevaptOptions.register_option(DevaptView, {
			name: 'links',
			type: 'array',
			aliases: ['view_links'],
			default_value: [],
			array_separator: ',',
			array_type: 'String',
			format: '',
			is_required: false,
			childs: {}
		}
	);

	DevaptOptions.register_bool_option(DevaptView, 'has_title_bar',		true, false, ['view_has_title_bar']);
	DevaptOptions.register_bool_option(DevaptView, 'has_edit_toolbar',	true, false, ['view_has_edit_toolbar']);
	DevaptOptions.register_bool_option(DevaptView, 'is_collapsable',	true, false, ['view_is_collapsable']);
	DevaptOptions.register_bool_option(DevaptView, 'is_resizable',		true, false, ['view_is_resizable']);
	DevaptOptions.register_bool_option(DevaptView, 'is_visible',		true, false, ['view_is_visible']);
	DevaptOptions.register_bool_option(DevaptView, 'is_editable',		true, false, ['view_is_editable']);
	DevaptOptions.register_bool_option(DevaptView, 'is_portlet',		false, false, ['view_is_portlet']);
	DevaptOptions.register_bool_option(DevaptView, 'has_hscrollbar',	false, false, ['view_has_hscrollbar']);
	DevaptOptions.register_bool_option(DevaptView, 'has_vscrollbar',	false, false, ['view_has_vscrollbar']);

	DevaptOptions.register_str_option(DevaptView, 'css_styles',			null, false, ['view_css_styles']);
	DevaptOptions.register_str_option(DevaptView, 'css_classes',		null, false, ['view_css_classes']);

	DevaptOptions.register_str_option(DevaptView, 'js_on_ready',		null, false, ['view_js_on_ready']);
	DevaptOptions.register_str_option(DevaptView, 'js_on_change',		null, false, ['view_js_on_change']);
	DevaptOptions.register_str_option(DevaptView, 'js_on_filled',		null, false, ['view_js_on_filled']);
	DevaptOptions.register_str_option(DevaptView, 'js_on_refresh',		null, false, ['view_js_on_refresh']);
	
	
	return DevaptView;
});