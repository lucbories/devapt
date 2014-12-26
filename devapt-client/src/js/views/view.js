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
['Devapt', 'core/types', 'core/class', 'core/object', 'core/resources', 'views/mixin-template', 'views/mixin-bind', 'views/mixin-options-css'],
function(Devapt, DevaptTypes, DevaptClass, DevaptObject, DevaptResources, DevaptMixinTemplate, DevaptMixinBind, DevaptMixinOptionsCSS)
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
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @desc				Set view parent
	 * @param {object}		arg_jquery_object	JQuery object to attach the view to (object)
	 * @return {boolean}	true:success,false:failure
	 */
	var cb_set_parent = function(arg_jquery_object)
	{
		var self = this;
		// self.trace = true;
		
		var context = 'set_parent(jqo)';
		self.enter(context, '');
		
		// console.log(arg_jquery_object, 'arg_jquery_object cb_set_parent');
		if ( ! DevaptTypes.is_object(arg_jquery_object) )
		{
			self.step(context, 'set default view container');
			arg_jquery_object = $('<div class="row">');
			$('body').append(arg_jquery_object);
		}
		
		// SET CONTAINER JQUERY OBJECT
		self.parent_jqo = arg_jquery_object;
		if ( DevaptTypes.is_null(arg_jquery_object) )
		{
			var tag_jqo = $('#' + self.name + '_view_id');
			if (tag_jqo.length > 0)
			{
				self.parent_jqo = tag_jqo;
			}
		}
		
		if (self.trace)
		{
			console.log(arg_jquery_object, 'arg_jquery_object');
			console.log(self.parent_jqo, 'parent_jqo');
		}
		
		// CHECK CONTAINER JQO
		self.assertNotNull(context, 'self.parent_jqo null ?', self.parent_jqo);
		self.assertTrue(context, 'self.parent_jqo empty ?', self.parent_jqo.length > 0);
		
		// SET ID
		// if ( ! DevaptTypes.is_object(self.parent_jqo) ||   )
		// {
			// if ( DevaptTypes.is_not_empty_str(self.parent_html_id) )
			// {
				// self.parent_jqo.attr('id', self.parent_html_id);
			// }
		// }
		
		// SEND EVENT
		self.fire_event('devapt.view.parent.changed');
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		var self = self ? self : this;
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// self.trace=true;
		
		
		
		// SET ID
		if ( DevaptTypes.is_object(self.parent_jqo) )
		{
			if ( DevaptTypes.is_not_empty_str(self.parent_html_id) )
			{
				self.parent_jqo.attr('id', self.parent_html_id);
			}
		}
		
		// SEND EVENT
		self.fire_event('devapt.view.ready');
		
		// ON READY HANDLER
		if ( self.class_name === 'DevaptView')
		{
			if ( DevaptTypes.is_function(self.on_ready) )
			{
				self.on_ready();
			}
		}
		
		
		self.leave(context, 'success');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @desc				Get view id
	 * @return {string}		HTML tag id
	 */
	var cb_get_view_id = function()
	{
		return self.view_id ? self.view_id : self.name + '_view_id';
	}
	
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @desc				Render view
	 * @return {object}		deferred promise object
	 */
	var cb_render = function()
	{
		var self = this;
		// self.trace = true;
		var context = 'render()';
		self.enter(context, '');
		
		
		// SEND EVENT
		self.fire_event('devapt.view.render.begin');
		
		
		// CREATE REFERRED OBJECT
		var deferred = $.Deferred();
		deferred.view_name = self.name;
		deferred.view_uid = self.uid;
		
		// RENDER END CALLBACK
		var render_end_cb = function() {
			if ( DevaptTypes.is_function(self.applyCssOptions) )
			{
				self.applyCssOptions(deferred);
			}
			
			// SEND EVENT
			self.fire_event('devapt.view.render.end');
		};
		
		
		// RENDER WITH TEMPLATE
		if ( self.template_enabled && DevaptTypes.is_function(self.render_template) )
		{
			// console.log('render with template', context);
			var promise = self.render_template(deferred);
			
			// APPLY CSS OPTIONS AND FIRE END EVENT
			promise.done(render_end_cb);
			
			self.leave(context, 'render with template');
			return promise;
		}
		
		// RENDER WITHOUT TEMPLATE
		// console.log('render without template', context);
		var promise = self.render_self(deferred);
		if (! promise)
		{
			console.log(promise, 'promise');
			console.error(self, 'render_self promise is bad');
		}
		promise.done(
			function()
			{
				if (self.content_jqo && self.content_jqo !== {})
				{
					self.content_jqo.attr('id', self.get_view_id());
				}
			}
		);
		
		// APPLY CSS OPTIONS AND FIRE END EVENT
		promise.done(render_end_cb);
		
		
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
	var cb_render_self = function(arg_deferred)
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
	var cb_edit_settings = function()
	{
		var self = this;
		var context = 'edit_settings()';
		self.enter(context, '');
		
		
		self.step(context, 'not implemented in this base class : implement in child classes');
		
		
		// SEND EVENT
		self.fire_event('devapt.view.settings.changed');
		
		
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
	var cb_translate = function(arg_sentance_str, arg_translation_context)
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
	var cb_on_change = function()
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
	var cb_on_refresh = function()
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
	var cb_on_filled = function()
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
	var cb_on_ready = function()
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
	var cb_to_string_self = function()
	{
		var self = this;
		return 'base view class';
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @method				notify_error(arg_message)
	 * @desc				Notify user with an error message
	 * @param {string}		arg_message			notification message
	 * @return {nothing}
	 */
	var cb_notify_error = function(arg_message)
	{
		if ( Devapt.has_current_backend() )
		{
			var backend = Devapt.get_current_backend();
			if (backend.notify_error)
			{
				backend.notify_error(arg_message);
				return;
			}
		}
		
		alert('error:' + arg_message);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @method				notify_alert(arg_message)
	 * @desc				Notify user with an alert message
	 * @param {string}		arg_message			notification message
	 * @return {nothing}
	 */
	var cb_notify_alert = function(arg_message)
	{
		if ( Devapt.has_current_backend() )
		{
			var backend = Devapt.get_current_backend();
			if (backend.notify_alert)
			{
				backend.notify_alert(arg_message);
				return;
			}
		}
		
		alert('alert:' + arg_message);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @method				notify_info(arg_message)
	 * @desc				Notify user with an information message
	 * @param {string}		arg_message			notification message
	 * @return {nothing}
	 */
	var cb_notify_info = function(arg_message)
	{
		if ( Devapt.has_current_backend() )
		{
			var backend = Devapt.get_current_backend();
			if (backend.notify_info)
			{
				backend.notify_info(arg_message);
				return;
			}
		}
		
		alert('info:' + arg_message);
	}
	
	
	
	/*
	
	
	// FEATURES
	DevaptOptions.register_bool_option(DevaptView, 'has_title_bar',		true, false, ['view_has_title_bar']);	// TODO
	DevaptOptions.register_bool_option(DevaptView, 'has_edit_toolbar',	true, false, ['view_has_edit_toolbar']);	// TODO
	DevaptOptions.register_bool_option(DevaptView, 'is_collapsable',	true, false, ['view_is_collapsable']);	// TODO
	DevaptOptions.register_bool_option(DevaptView, 'is_editable',		true, false, ['view_is_editable']);	// TODO
	DevaptOptions.register_bool_option(DevaptView, 'is_portlet',		false, false, ['view_is_portlet']);	// TODO
	
	// LAYOUT
	DevaptOptions.register_str_option(DevaptView, 'position',			null, false, ['view_position']);	// TODO
	
	// EVENTS
	DevaptOptions.register_str_option(DevaptView, 'js_on_ready',		null, false, ['view_js_on_ready']);	// TODO
	DevaptOptions.register_str_option(DevaptView, 'js_on_change',		null, false, ['view_js_on_change']);	// TODO
	DevaptOptions.register_str_option(DevaptView, 'js_on_filled',		null, false, ['view_js_on_filled']);	// TODO
	DevaptOptions.register_str_option(DevaptView, 'js_on_refresh',		null, false, ['view_js_on_refresh']);	// TODO
	*/
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-05-10',
			updated:'2014-12-06',
			description:'View base class.'
		},
		properties:{
			
		}
	};
	var parent_class = DevaptObject;
	var DevaptViewClass = new DevaptClass('DevaptView', parent_class, class_settings);
	
	
	// METHODS
	DevaptViewClass.infos.ctor = cb_constructor;
	DevaptViewClass.add_public_method('set_parent', {}, cb_set_parent);
	DevaptViewClass.add_public_method('get_view_id', {}, cb_get_view_id);
	DevaptViewClass.add_public_method('render', {}, cb_render);
	DevaptViewClass.add_public_method('render_self', {}, cb_render_self);
	DevaptViewClass.add_public_method('edit_settings', {}, cb_edit_settings);
	DevaptViewClass.add_public_method('translate', {}, cb_translate);
	DevaptViewClass.add_public_method('on_change', {}, cb_on_change);
	DevaptViewClass.add_public_method('on_refresh', {}, cb_on_refresh);
	DevaptViewClass.add_public_method('on_filled', {}, cb_on_filled);
	DevaptViewClass.add_public_method('on_ready', {}, cb_on_ready);
	DevaptViewClass.add_public_method('to_string_self', {}, cb_to_string_self);
	DevaptViewClass.add_public_method('notify_error', {}, cb_notify_error);
	DevaptViewClass.add_public_method('notify_alert', {}, cb_notify_alert);
	DevaptViewClass.add_public_method('notify_info', {}, cb_notify_info);
	
	
	// PROPERTIES
	DevaptViewClass.add_public_bool_property('is_view',			'is a view flag', true, false, false, []);
	DevaptViewClass.add_public_str_property('status',			'view current state', 'ready', false, false, []);
	DevaptViewClass.add_public_str_property('access_role',		'required role to display the view', null, true, false, ['role_display']);
	
	DevaptViewClass.add_public_str_property('parent_html_id',	'',		null, false, false, ['view_parent_html_id']);
	DevaptViewClass.add_public_str_property('html_id',			'',		null, false, false, ['view_html_id']);
	DevaptViewClass.add_public_str_property('label',			'',		null, false, false, ['view_label']);
	DevaptViewClass.add_public_str_property('tooltip',			'',		null, false, false, ['view_tooltip']);
	
	var div_jqo = jQuery('<div>');
	DevaptViewClass.add_public_object_property('parent_jqo',	'',		null, false, false, []);
	DevaptViewClass.add_public_object_property('content_jqo',	'',		div_jqo, false, false, []);
	
	
	// MIXINS
	DevaptViewClass.add_public_mixin(DevaptMixinTemplate);
	DevaptViewClass.add_public_mixin(DevaptMixinBind);
	DevaptViewClass.add_public_mixin(DevaptMixinOptionsCSS);
	
	
	return DevaptViewClass;
});