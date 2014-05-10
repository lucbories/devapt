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

define(['Devapt', 'core/traces', 'core/types', 'core/resources', 'backend-foundation5/foundation-init'], function(Devapt, DevaptTrace, DevaptTypes, DevaptResources, undefined)
{
	/**
	 * @public
	 * @class				DevaptView
	 * @desc				View class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_container_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 // * @mixes				DevaptMixinViewLink
	 // * @mixes				DevaptMixinViewSize
	 // * @mixes				DevaptMixinViewSelect
	 // * @mixes				DevaptMixinToolbars
	 // * @mixes				DevaptMixinViewVisible
	 // * @mixes				DevaptMixinViewTitlebar
	 */
	function DevaptView(arg_name, arg_container_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptObject;
		self.inheritFrom(arg_name, false, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptView';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.contructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context				= self.class_name + '(' + arg_name + ')';
			self.enter(context, 'constructor');
			
			
			// VIEW ATTRIBUTES
			self.container_jqo		= get_arg_not_null(arg_container_jqo, $('<div>') );
			self.content_jqo		= null;
			
			// INIT OPTIONS
			var init_option_result = Devapt.set_options_values(self, arg_options, false);
			
			// PARENT VIEW ATTRIBUTES
			if ( ! ( Devapt.is_object(self.parent_view) && self.parent_view.is_view ) )
			{
				self.parent_view	= null;
				if ( Devapt.is_not_empty_str(self.parent_view_name) )
				{
					self.parent_view	= DevaptViews.get(self.parent_view_name);
				}
			}
			self.content_childs_jqo		= [];
			
			
			
			/* --------------------------------------------------------------------------------------------- */
			// APPEND MIXIN METHODS
			
			// LINKS MIXIN
			// self.register_mixin(DevaptMixinViewLink);
			// self.links = get_arg_not_null(self.links, []);

			// self.register_mixin(DevaptMixinViewSize);
			// self.register_mixin(DevaptMixinViewSelect);
			// self.register_mixin(DevaptMixinToolbars);
			
			// VISIBLE MIXN
			// self.register_mixin(DevaptMixinViewVisible);
			// self.set_visible( Devapt.to_boolean(self.is_visible, true) );
			
			// TITLEBAR MIXIN
			// self.register_mixin(DevaptMixinViewTitlebar);
			// self.mixin_view_titlebar_enabled = Devapt.to_boolean(self.has_title_bar, true);
			// self.init_title_bar( { label:self.label } );
			
			/* --------------------------------------------------------------------------------------------- */
			
			
			// INIT VIEW
			if ( ! Devapt.is_null(self.container_jqo) )
			{
				// ATTACH THIS VIEW TO THE JQUERY OBJECT
				self.container_jqo.data('devapt_view', self);
				
				if ( Devapt.is_not_empty_str(self.html_id) )
				{
					self.container_jqo.attr('id', self.html_id);
				}
			}
			
			
			// REGISTER THE VIEW TO THE REPOSITORY
			DevaptResources.add_resource_instance(self);
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		}
		
		
		// CONTRUCT INSTANCE
		self.contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Draw view
		 * @param {object}		arg_jquery_object	JQuery object to attach the view to (object)
		 * @return {boolean}	true:success,false:failure
		 */
		self.set_container = function(arg_jquery_object)
		{
			var self = this;
			var context = 'set_container()';
			self.enter(context, '');
			
			
			// CHECK NEW CONTAINER
			self.assertNotNull(context, 'arg_jquery_object', arg_jquery_object);
			
			// DETACH FROM EXISTING CONTAINER
			if (self.container_jqo)
			{
				self.container_jqo.removeData('devapt_view');
			}
			
			// ATTACH TO NEW CONTAINER
			self.container_jqo = arg_jquery_object;
			self.container_jqo.data('devapt_view', self);
			if ( Devapt.is_not_empty_str(self.html_id) )
			{
				self.container_jqo.attr('id', self.html_id);
			}
			
			
			self.leave(context, 'success');
			return true;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptView
		 * @desc				Render view
		 * @return {boolean}	true:success,false:failure
		 */
		self.render = function()
		{
			var self = this;
			var context = 'draw()';
			self.enter(context, '');
			
			self.step(context, 'not implemented in this base class : implement in child classes');
			// self.draw_title_bar();
			
			self.leave(context, 'success');
			return true;
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
		self.compile_template = function(arg_template_str, arg_tags, arg_bindings)
		{
			var self = this;
			var context = 'compile_template(template,tags,bindings)';
			self.enter(context, '');
			
			self.step(context, 'not yet implemented');
			
			self.leave(context, 'success');
			return arg_template_str;
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
		 * @desc				On change event
		 * @return {boolean}	true:success,false:failure
		 */
		self.on_change = function()
		{
			var self = this;
			var context = 'on_change()';
			self.enter(context, '');
			
			// ON CHANGE HANDLER
			if ( ! Devapt.is_null(self.js_on_change) )
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
			if ( ! Devapt.is_null(self.js_on_refresh) )
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
			if ( ! Devapt.is_null(self.js_on_filled) )
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
			if ( ! Devapt.is_null(self.js_on_ready) )
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
			return '';
			// return self.to_string_value('model.name', self.model.name);
		}
		
		
		// REGISTER WROWSER EVENTS
		$(window).resize( function() { self.adjust_sizes(); } );
		
		
		// ON READY HANDLER
		if ( Devapt.is_null(arg_options) || arg_options.class_name == 'DevaptView')
		{
			this.on_ready();
		}
	}


	// INTROSPETION : REGISTER CLASS
	Devapt.register_class(DevaptView, ['DevaptObject'], 'Luc BORIES', '2013-08-21', 'All views base class.');


	// INTROSPETION : REGISTER OPTIONS
	// Devapt.register_str_option(DevaptView, 'parent_view_name',		null, false, ['view_parent_view_name']);
	Devapt.register_str_option(DevaptView, 'html_id',				null, false, ['view_html_id']);
	Devapt.register_str_option(DevaptView, 'label',					null, false, ['view_label']);
	Devapt.register_str_option(DevaptView, 'tooltip',				null, false, ['view_tooltip']);

	Devapt.register_bool_option(DevaptView, 'template_enabled',		true, false, ['view_template_enabled']);
	Devapt.register_str_option(DevaptView, 'template_string',		null, false, ['view_template_string']);
	Devapt.register_str_option(DevaptView, 'template_file_name',	null, false, ['view_template_file_name']);
	Devapt.register_str_option(DevaptView, 'template_tags',			null, false, ['view_template_tags']);
	Devapt.register_str_option(DevaptView, 'template_bindings',		null, false, ['view_template_bindings']);

	Devapt.register_option(DevaptView, {
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

	Devapt.register_bool_option(DevaptView, 'has_title_bar',	true, false, ['view_has_title_bar']);
	Devapt.register_bool_option(DevaptView, 'has_edit_toolbar',	true, false, ['view_has_edit_toolbar']);
	Devapt.register_bool_option(DevaptView, 'is_collapsable',	true, false, ['view_is_collapsable']);
	Devapt.register_bool_option(DevaptView, 'is_resizable',		true, false, ['view_is_resizable']);
	Devapt.register_bool_option(DevaptView, 'is_visible',		true, false, ['view_is_visible']);
	Devapt.register_bool_option(DevaptView, 'is_editable',		true, false, ['view_is_editable']);
	Devapt.register_bool_option(DevaptView, 'is_portlet',		false, false, ['view_is_portlet']);
	Devapt.register_bool_option(DevaptView, 'has_hscrollbar',	false, false, ['view_has_hscrollbar']);
	Devapt.register_bool_option(DevaptView, 'has_vscrollbar',	false, false, ['view_has_vscrollbar']);

	Devapt.register_str_option(DevaptView, 'css_styles',		null, false, ['view_css_styles']);
	Devapt.register_str_option(DevaptView, 'css_classes',		null, false, ['view_css_classes']);

	Devapt.register_str_option(DevaptView, 'js_on_ready',		null, false, ['view_js_on_ready']);
	Devapt.register_str_option(DevaptView, 'js_on_change',		null, false, ['view_js_on_change']);
	Devapt.register_str_option(DevaptView, 'js_on_filled',		null, false, ['view_js_on_filled']);
	Devapt.register_str_option(DevaptView, 'js_on_refresh',		null, false, ['view_js_on_refresh']);
	
	
	return DevaptView;
});