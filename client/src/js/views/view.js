/**
 * @file        views/view.js
 * @desc        View base class
 * 		API
 * 			PUBLIC ATTRIBUTES
 * 				
 * 				
 * 			PUBLIC METHODS
 * 				
 * 				
 * 			
 * @ingroup     DEVAPT_VIEWS
 * @date        2014-05-10
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define([
	'Devapt', 'core/types', 'object/class', 'object/object', 'core/resources', 'core/application',
	'views/view/view-mixin-renderable', 'views/view/view-mixin-template', 'views/view/view-mixin-bind', 'views/view/view-mixin-options-css'
],
function(
	Devapt, DevaptTypes, DevaptClass, DevaptObject, DevaptResources, DevaptApplication,
	DevaptMixinRenderable, DevaptMixinTemplate, DevaptMixinBind, DevaptMixinOptionsCSS)
{
	/**
	 * @public
	 * @class				DevaptView
	 * @desc				View class
	 */
	
	var $ = window.$;
	
	
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
		
		
		// DEBUG
		if (self.trace)
		{
			console.log(arg_jquery_object, 'arg_jquery_object');
			// console.log(self.content_jqo, 'content_jqo');
			// console.log(self.parent_jqo, 'parent_jqo');
		}
		
		
		// INIT DEFAULT PARENT NODE IF NO PARENT IS GIVEN
		if ( ! DevaptTypes.is_object(arg_jquery_object) )
		{
			self.step(context, 'set default view container');
			arg_jquery_object = $('<div class="row" devapt-comment="set default parent">');
			$('body').append(arg_jquery_object);
		}
		
		
		// SET CONTAINER JQUERY OBJECT
		self.parent_jqo = arg_jquery_object;
		self.assert_not_null(context, 'self.parent_jqo null ?', self.parent_jqo);
		if ( DevaptTypes.is_object(self.content_jqo) )
		{
			self.step(context, 'detach content jqo');
			self.content_jqo.detach();
			
			self.step(context, 'attach content jqo');
			if (! self.prepend_content)
			{
				self.parent_jqo.append(self.content_jqo);
			}
			else
			{
				self.parent_jqo.prepend(self.content_jqo);
			}
		}
		// console.log(self.parent_jqo, 'parent_jqo');
		
		
		// SET PARENT ID
		if ( DevaptTypes.is_not_empty_str(self.parent_html_id) )
		{
			self.step(context, 'parent node node has an html id');
			self.parent_jqo.attr('id', self.parent_html_id);
		}
		
		
		// SEND EVENT
		self.fire_event('devapt.view.parent.changed');
		
		
		self.leave(context, Devapt.msg_success);
		// self.trace = false;
		return true;
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// DEBUG
		// self.trace=true;
		
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'View constructor');
		
		
		// SET OBJECT TYPE
		self.is_view = true;
		
		// INIT CONTENT NODE
		self.content_jqo = $('<div>');
		self.content_jqo.attr('id', self.get_view_id());
		
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
		
		
		self.leave(context, Devapt.msg_success);
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @desc				Get view id
	 * @return {string}		HTML tag id
	 */
	var cb_get_view_id = function()
	{
		var self = this;
		return DevaptTypes.is_not_empty_str(self.view_id) ? self.view_id : self.name + '_view_id';
	};
	
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @desc				Render view
	 * @return {object}		deferred promise object
	 */
/*	var cb_render = function()
	{
		var self = this;
		// self.trace = true;
		var context = 'render()';
		self.enter(context, '');
		
		
		// CREATE REFERRED OBJECT
		var deferred = Devapt.defer();
		// deferred.view_name = self.name;
		// deferred.view_uid = self.uid;
		if (self.is_render_state_rendered())
		{
			self.step(context, 'is rendered');
			deferred.resolve();
			
			self.leave(context, 'render with template');
			return Devapt.promise(arg_deferred);
		}
		
		
		// SEND EVENT
		self.step(context, 'fire render begin');
		self.fire_event('devapt.view.render.begin');
		
		
		// RENDER END CALLBACK
		var render_end_cb = function() {
			// console.log('render_end_cb');
			self.step(context, 'render end cb');
			
			if ( DevaptTypes.is_function(self.applyCssOptions) )
			{
				self.step(context, 'apply CSS');
				self.applyCssOptions(deferred);
			}
			
			// SEND EVENT
			self.step(context, 'fire render end');
			self.fire_event('devapt.view.render.end');
			
			// self.is_rendered = true;
		};
		
		
		// RENDER WITH TEMPLATE
		if ( self.template_enabled && DevaptTypes.is_function(self.render_template) )
		{
			self.step(context, 'has template');
			// console.log('render with template');
			
			if ( ! DevaptTypes.is_object(self.content_jqo) )
			{
				self.step(context, 'has no content node');
				// console.info('set default content jqo');
				
				self.content_jqo = $('<div>');
				
				if ( DevaptTypes.is_object(self.parent_jqo) )
				{
					self.step(context, 'has parent node');
					// console.info('set parent for content jqo');
					self.parent_jqo.append(self.content_jqo);
				}
				
				self.content_jqo.attr('id', self.get_view_id());
			}
			
			self.step(context, 'render template');
			// console.log('call render_template(deferred)');
			var promise = self.render_template(deferred);
			
			// APPLY CSS OPTIONS AND FIRE END EVENT
			self.step(context, 'call render end cb');
			// console.log('call render_template(deferred) done');
			promise = promise.then(render_end_cb);
			
			self.leave(context, 'render with template');
			return promise;
		}
		
		// RENDER WITHOUT TEMPLATE
		self.step(context, 'render self');
		// console.log('render without template', context);
		var promise = self.render_self(deferred);
		if (! promise)
		{
			console.log(promise, 'promise');
			console.error(self, 'render_self promise is bad');
		}
		promise = promise.then(
			function()
			{
				self.step(context, 'render self done');
				// console.log('render_self done');
				
				if (self.content_jqo && self.content_jqo !== {})
				{
					self.step(context, 'has content');
					self.content_jqo.attr('id', self.get_view_id());
				}
			}
		);
		
		// APPLY CSS OPTIONS AND FIRE END EVENT
		self.step(context, 'call render end cb');
		promise.then(render_end_cb);
		
		
		self.leave(context, 'render without template');
		return promise;
	};*/
	
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @desc				Render view content without template
	 * @param {object}		arg_deferred	deferred object
	 * @return {object}		deferred promise object
	 */
/*	var cb_render_self = function(arg_deferred)
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
		return Devapt.promise(arg_deferred);
	};*/
	
	
	
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
		
		
		self.leave(context, Devapt.msg_success);
		return true;
	};
	
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @desc				Edit view settings
	 * @return {boolean}	true:success,false:failure
	 */
	var cb_show = function()
	{
		var self = this;
		var context = 'show()';
		self.enter(context, '');
		
		if ( ! self.content_jqo || self.content_jqo === {})
		{
			self.leave(context, Devapt.msg_failure);
			return false;
		}
		
		self.content_jqo.show();
		
		self.leave(context, Devapt.msg_success);
		return true;
	};
	
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @desc				Edit view settings
	 * @return {boolean}	true:success,false:failure
	 */
	var cb_hide = function()
	{
		var self = this;
		var context = 'hide()';
		self.enter(context, '');
		
		if ( ! self.content_jqo || self.content_jqo === {})
		{
			self.leave(context, Devapt.msg_failure);
			return false;
		}
		
		self.content_jqo.hide();
		
		self.leave(context, Devapt.msg_success);
		return true;
	};
	
	
	
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
		
		self.leave(context, Devapt.msg_success);
		return arg_sentance_str;
	};
	
	
	
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
		
		self.leave(context, Devapt.msg_success);
		return true;
	};
	
	
	
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
		
		
		self.leave(context, Devapt.msg_success);
		return true;
	};
	
	
	
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
		
		self.leave(context, Devapt.msg_success);
		return true;
	};
	
	
	
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
		
		self.leave(context, Devapt.msg_success);
		return true;
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptView
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	var cb_to_string_self = function()
	{
		// var self = this;
		return 'base view class';
	};
	
	
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
	};
	
	
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
	};
	
	
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
	};
	
	
	
	/**
	 * @memberof			DevaptModel
	 * @public
	 * @method				DevaptModel.get_server_api()
	 * @desc				Get servetr API records
	 * @return {object}		promise
	 */
	var cb_get_server_api = function()
	{
		var self = this;
		var context = 'get_server_api()';
		self.enter(context, '');
		
		
		// TEST IF ALREADY CREATED
		if (self.server_ap)
		{
			self.leave(context, Devapt.msg_success);
			return self.server_api;
		}
		
		// CREATE API RECORD
		var url_base = DevaptApplication.get_url_base();
		self.server_api = {
			view_name: self.name,
			
			 action_view: {
				 method:'GET',
				 url:url_base + 'views/' + self.name + '/html_view',
				 format:'devapt_view_api_2'
			 },
			action_page: {
				method:'GET',
				url:url_base + 'views/' + self.name + '/html_page',
				format:'devapt_view_api_2'
			}
		};
		
		
		self.leave(context, Devapt.msg_success);
		return self.server_api;
	};
	
	
	
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
	DevaptViewClass.add_public_method('edit_settings', {}, cb_edit_settings);
	
	DevaptViewClass.add_public_method('show', {}, cb_show);
	DevaptViewClass.add_public_method('hide', {}, cb_hide);
	
	DevaptViewClass.add_public_method('translate', {}, cb_translate);
	DevaptViewClass.add_public_method('on_change', {}, cb_on_change);
	DevaptViewClass.add_public_method('on_refresh', {}, cb_on_refresh);
	DevaptViewClass.add_public_method('on_filled', {}, cb_on_filled);
	DevaptViewClass.add_public_method('on_ready', {}, cb_on_ready);
	DevaptViewClass.add_public_method('to_string_self', {}, cb_to_string_self);
	DevaptViewClass.add_public_method('notify_error', {}, cb_notify_error);
	DevaptViewClass.add_public_method('notify_alert', {}, cb_notify_alert);
	DevaptViewClass.add_public_method('notify_info', {}, cb_notify_info);
	DevaptViewClass.add_public_method('get_server_api', {}, cb_get_server_api);
	
	
	// PROPERTIES
	DevaptViewClass.add_public_bool_property('is_view',			'is a view flag', true, false, false, []);
	DevaptViewClass.add_public_str_property('access_role',		'required role to display the view', null, true, false, ['role_display']);
	
	DevaptViewClass.add_public_str_property('parent_html_id',	'content jQuery parent ndoe id (html attribute) ', null, false, false, ['view_parent_html_id']);
	DevaptViewClass.add_public_str_property('html_id',			'content jQuery node id (html attribute)', null, false, false, ['view_html_id']);
	DevaptViewClass.add_public_str_property('label',			'view label for window title or menu', null, false, false, ['view_label']);
	DevaptViewClass.add_public_str_property('tooltip',			'view tooltip for menu item', null, false, false, ['view_tooltip']);
	
	DevaptViewClass.add_public_bool_property('prepend_content',	'should prepend content jqo on the parent jqo?', false, false, false, []);
	DevaptViewClass.add_public_object_property('parent_jqo',	'content parent jQuery node',		null, false, false, []);
	DevaptViewClass.add_public_object_property('content_jqo',	'content jQuery node',				null, false, false, []);
	
	/*
	 * application.views.ViewVVV.on_event: on event actions
	 * 		.EventEEE.log: trace a message
	 * 		.EventEEE.runjs: run a JavaScript expression
	 * 		.EventEEE.do_crud: run a CRUD method on a model resource object
	 * 		.EventEEE.do_method: run a resource object method
	 * 		.EventEEE.emit: emit an other event
	**/
	DevaptViewClass.add_public_object_property('on_event',	'Event reactors',	null, false, false, []);
	
	
	// MIXINS
	DevaptViewClass.add_public_mixin(DevaptMixinTemplate);
	DevaptViewClass.add_public_mixin(DevaptMixinRenderable);
	DevaptViewClass.add_public_mixin(DevaptMixinBind);
	DevaptViewClass.add_public_mixin(DevaptMixinOptionsCSS);
	
	
	return DevaptViewClass;
});