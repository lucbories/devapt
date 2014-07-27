/**
 * @file        views/view.js
 * @desc        View base class
 * @ingroup     DEVAPT_CORE
 * @date        2014-05-10
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/object', 'core/types', 'core/options', 'core/classes', 'core/resources', 'views/mixin-template', 'views/mixin-options-css'],
function(Devapt, DevaptObject, DevaptTypes, DevaptOptions, DevaptClasses, DevaptResources, DevaptMixinTemplate, DevaptMixinOptionsCSS)
{
	/**
	 * @public
	 * @class				DevaptView
	 * @desc				View class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptView(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptObject;
		self.inheritFrom(arg_name, arg_options, false);
		
		// INIT
		self.trace				= true;
		self.class_name			= 'DevaptView';
		self.is_view			= true;
		self.parent_jqo			= null;
		self.content_jqo		= null;
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Set view parent
		 * @param {object}		arg_jquery_object	JQuery object to attach the view to (object)
		 * @return {boolean}	true:success,false:failure
		 */
		self.set_parent = function(arg_jquery_object)
		{
			var self = this;
			var context = 'set_parent(jqo)';
			self.enter(context, '');
			
			
			// SET CONTAINER JQUERY OBJECT
			self.parent_jqo = DevaptTypes.is_null(arg_jquery_object) ? $('#' + self.name + '_view_id') : arg_jquery_object;
			if (self.trace)
			{
				console.log(arg_jquery_object, 'arg_jquery_object');
				console.log(self.parent_jqo, 'parent_jqo');
			}
			
			// CHECK CONTAINER JQO
			self.assertNotNull(context, 'self.parent_jqo', self.parent_jqo);
			
			// SET ID
			if ( DevaptTypes.is_object(self.parent_jqo) )
			{
				if ( DevaptTypes.is_not_empty_str(self.html_id) )
				{
					self.parent_jqo.attr('id', self.html_id);
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
			self.assert(context, 'set_parent', self.set_parent(arg_parent_jqo) );
			
			
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
			return self.view_id ? self.view_id : self.name + '_view_id';
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
			if ( self.template_enabled && DevaptTypes.is_function(self.render_template) )
			{
				var promise = self.render_template(deferred);
				
				// APPLY CSS OPTIONS
				if ( DevaptTypes.is_function(self.applyCssOptions) )
				{
					promise.done( function() { self.applyCssOptions(deferred) } );
				}
				
				self.leave(context, 'render with template');
				return promise;
			}
			
			// RENDER WITHOUT TEMPLATE
			var promise = self.render_self(deferred);
			
			// APPLY CSS OPTIONS
			if ( DevaptTypes.is_function(self.applyCssOptions) )
			{
				promise.done( function() { self.applyCssOptions(deferred) } );
			}
			
			
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
			self.step(context, 'resolve()');
			arg_deferred.resolve();
			
			
			self.leave(context, 'success (not implemented)');
			return arg_deferred.promise();
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
		 * @desc				Event handler : execute at the beginning of the render operations
		 * @param {object}		arg_deferred	deferred object
		 * @return {nothing}
		 */
		self.on_render_begin = function(arg_deferred)
		{
			var self = this;
			var context = 'on_render_begin(deferred)';
			self.enter(context, '');
			
			self.leave(context, '');
			return promise;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Event handler : execute at the end of the render operations
		 * @param {object}		arg_deferred	deferred object
		 * @return {nothing}
		 */
		self.on_render_end = function(arg_deferred)
		{
			var self = this;
			var context = 'on_render_end(deferred)';
			self.enter(context, '');
			
			self.leave(context, '');
			return promise;
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
		self.register_mixin(DevaptMixinTemplate);
		self.register_mixin(DevaptMixinOptionsCSS);
		delete self.register_options;
		/* --------------------------------------------------------------------------------------------- */
		
		
		// ON READY HANDLER
		if ( DevaptTypes.is_null(arg_options) || arg_options.class_name === 'DevaptView')
		{
			if ( DevaptTypes.is_function(self.on_ready) )
			{
				self.on_ready();
			}
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptView, ['DevaptObject'], 'Luc BORIES', '2013-08-21', 'All views base class.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_str_option(DevaptView, 'parent_html_id',			null, false, ['view_parent_html_id']);
	DevaptOptions.register_str_option(DevaptView, 'html_id',				null, false, ['view_html_id']);
	DevaptOptions.register_str_option(DevaptView, 'label',					null, false, ['view_label']);
	DevaptOptions.register_str_option(DevaptView, 'tooltip',				null, false, ['view_tooltip']);
	
	
	
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
	
	// FEATURES
	DevaptOptions.register_bool_option(DevaptView, 'has_title_bar',		true, false, ['view_has_title_bar']);	// TODO
	DevaptOptions.register_bool_option(DevaptView, 'has_edit_toolbar',	true, false, ['view_has_edit_toolbar']);	// TODO
	DevaptOptions.register_bool_option(DevaptView, 'is_collapsable',	true, false, ['view_is_collapsable']);	// TODO
	DevaptOptions.register_bool_option(DevaptView, 'is_editable',		true, false, ['view_is_editable']);	// TODO
	DevaptOptions.register_bool_option(DevaptView, 'is_portlet',		false, false, ['view_is_portlet']);	// TODO
	DevaptOptions.register_bool_option(DevaptView, 'has_hscrollbar',	false, false, ['view_has_hscrollbar']);	// TODO
	DevaptOptions.register_bool_option(DevaptView, 'has_vscrollbar',	false, false, ['view_has_vscrollbar']);	// TODO
	
	// LAYOUT
	DevaptOptions.register_str_option(DevaptView, 'position',				null, false, ['view_position']);	// TODO
	
	// TEMPLATE OPTIONS
	DevaptMixinTemplate.register_options(DevaptView);
	
	// CSS OPTIONS
	DevaptMixinOptionsCSS.register_options(DevaptView);
	
	// EVENTS
	DevaptOptions.register_str_option(DevaptView, 'js_on_ready',		null, false, ['view_js_on_ready']);	// TODO
	DevaptOptions.register_str_option(DevaptView, 'js_on_change',		null, false, ['view_js_on_change']);	// TODO
	DevaptOptions.register_str_option(DevaptView, 'js_on_filled',		null, false, ['view_js_on_filled']);	// TODO
	DevaptOptions.register_str_option(DevaptView, 'js_on_refresh',		null, false, ['view_js_on_refresh']);	// TODO
	
	
	return DevaptView;
});