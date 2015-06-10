/**
 * @file        views/url_api_detail.js
 * @desc        URL API detail view class
 * @ingroup     DEVAPT_VIEWS
 * @date        2014-06-05
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'bind', 'core/types', 'object/class', 'views/view', 'plugins/backend-jquery-ui/views/jsontree'],
function(Devapt, Bind, DevaptTypes, DevaptClass, DevaptView, DevaptJsonTree)
{
	/**
	 * @public
	 * @class				DevaptUrlApiDetail
	 * @desc				URL API detail view class
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptUrlApiDetail
	 * @desc				Render a composite view to display API details
	 * 		VIEW
	 * 			URL
	 * 				FULL URL
	 * 				BASE URL
	 * 				CONTROLLER
	 * 				TARGET
	 * 				ACTION
	 * 			REQUEST
	 * 				METHOD
	 * 				API FORMAT
	 * 				URL ARGS
	 * 				CONTENT
	 * 				SEND BUTTON
	 *			RESPONSE
	 * 				CONTENT
	 * @return {object}		deferred promise object
	 */
	var cb_render_content_self = function()
	{
		var self = this;
		// self.trace=true;
		var context = 'render_content_self()';
		self.enter(context, '');
		
		
		// CHECK CONTENT NODE
		self.assert_not_null(context, 'content_jqo', self.content_jqo);
		
		// INIT
		var label_jqo = null;
		var tag_id = null;
		var tag_label = null;
		var tag_placeholder = null;
		
		// URL GROUP
		var url_group_label = 'URL';
		self.url_group_jqo = $('<fieldset>');
		self.url_group_jqo.append( $('<legend>').css('background', 'none').css('font-weight', 'normal').text(url_group_label) );
		self.content_jqo.append(self.url_group_jqo);
		
		// URL FULL
		tag_id = self.get_view_id() + '_url_full_input';
		tag_label = 'FULL URL';
		tag_placeholder = '/mypath/myapp/views/view1/html_page';
		self.url_full_jqo = $('<input type="text" readonly>');
		self.url_full_jqo.attr('id', tag_id);
		self.url_full_jqo.attr('placeholder', tag_placeholder);
		label_jqo = $('<label>');
		label_jqo.text(tag_label);
		label_jqo.attr('for', tag_id);
		self.url_group_jqo.append(label_jqo);
		self.url_group_jqo.append(self.url_full_jqo);
		
		// URL BASE
		tag_id = self.get_view_id() + '_url_base_input';
		tag_label = 'BASE URL';
		tag_placeholder = '/mypath/myapp/';
		self.url_base_jqo = $('<input type="text">');
		self.url_base_jqo.attr('id', tag_id);
		self.url_base_jqo.attr('placeholder', tag_placeholder);
		label_jqo = $('<label>');
		label_jqo.text(tag_label);
		label_jqo.attr('for', tag_id);
		self.url_group_jqo.append(label_jqo);
		self.url_group_jqo.append(self.url_base_jqo);
		
		// URL CONTROLLER
		tag_id = self.get_view_id() + '_url_controller_input';
		tag_label = 'ACTION CONTROLLER';
		tag_placeholder = 'views|resources|rest';
		self.url_controller_jqo = $('<select>');
		self.url_controller_jqo.attr('id', tag_id);
		self.url_controller_jqo.append($('<option>').val('views').text('views').attr('selected', 'selected'));
		self.url_controller_jqo.append($('<option>').val('rest').text('rest'));
		self.url_controller_jqo.append($('<option>').val('resources').text('resources'));
		label_jqo = $('<label>');
		label_jqo.text(tag_label);
		label_jqo.attr('for', tag_id);
		self.url_group_jqo.append(label_jqo);
		self.url_group_jqo.append(self.url_controller_jqo);
		
		// URL TARGET
		tag_id = self.get_view_id() + '_url_target_input';
		tag_label = 'TARGET RESOURCE';
		tag_placeholder = 'myview|mymodel|myotherresource';
		self.url_target_jqo = $('<input type="text">');
		self.url_target_jqo.attr('id', tag_id);
		self.url_target_jqo.attr('placeholder', tag_placeholder);
		label_jqo = $('<label>');
		label_jqo.text(tag_label);
		label_jqo.attr('for', tag_id);
		self.url_group_jqo.append(label_jqo);
		self.url_group_jqo.append(self.url_target_jqo);
		
		// URL ACTION
		tag_id = self.get_view_id() + '_url_action_input';
		tag_label = 'URL ACTION';
		tag_placeholder = 'html_page|html_view|...';
		self.url_action_jqo = $('<input type="text">');
		self.url_action_jqo.attr('id', tag_id);
		self.url_action_jqo.attr('placeholder', tag_placeholder);
		label_jqo = $('<label>');
		label_jqo.text(tag_label);
		label_jqo.attr('for', tag_id);
		self.url_group_jqo.append(label_jqo);
		self.url_group_jqo.append(self.url_action_jqo);
		
		
		// REQUEST GROUP
		var request_group_label = 'Request';
		self.request_group_jqo = $('<fieldset>');
		self.request_group_jqo.append( $('<legend>').css('background', 'none').css('font-weight', 'normal').text(request_group_label) );
		self.content_jqo.append(self.request_group_jqo);
		
		// URL METHOD
		tag_id = self.get_view_id() + '_url_method_input';
		tag_label = 'GET|POST|PUT|DELETE';
		tag_placeholder = 'URL METHOD';
		self.request_method_jqo = $('<select>');
		self.request_method_jqo.attr('id', tag_id);
		self.request_method_jqo.append($('<option>').val('GET').text('GET').attr('selected', 'selected'));
		self.request_method_jqo.append($('<option>').val('POST').text('POST'));
		self.request_method_jqo.append($('<option>').val('PUT').text('PUT'));
		self.request_method_jqo.append($('<option>').val('DELETE').text('DELETE'));
		label_jqo = $('<label>');
		label_jqo.text(tag_label);
		label_jqo.attr('for', tag_id);
		self.request_group_jqo.append(label_jqo);
		self.request_group_jqo.append(self.request_method_jqo);
		
		// API FORMAT
		tag_id = self.get_view_id() + '_api_format_input';
		tag_label = 'API FORMAT';
		tag_placeholder = '';
		self.request_format_jqo = $('<select>');
		self.request_format_jqo.attr('id', tag_id);
		self.request_format_jqo.append($('<option>').val('devapt_view_api_2').text('devapt_view_api_2').attr('selected', 'selected'));
		self.request_format_jqo.append($('<option>').val('devapt_query_api_2').text('devapt_query_api_2'));
		label_jqo = $('<label>');
		label_jqo.text(tag_label);
		label_jqo.attr('for', tag_id);
		self.request_group_jqo.append(label_jqo);
		self.request_group_jqo.append(self.request_format_jqo);
		
		// URL ARGS
		tag_id = self.get_view_id() + '_url_args_input';
		tag_label = 'URL ARGS';
		tag_placeholder = '?key1=value1&key2=value2';
		self.request_args_jqo = $('<input type="text">');
		self.request_args_jqo.attr('id', tag_id);
		self.request_args_jqo.attr('placeholder', tag_placeholder);
		label_jqo = $('<label>');
		label_jqo.text(tag_label);
		label_jqo.attr('for', tag_id);
		self.request_group_jqo.append(label_jqo);
		self.request_group_jqo.append(self.request_args_jqo);
		
		// BODY CONTENT
		tag_id = self.get_view_id() + '_body_content_input';
		tag_label = 'BODY CONTENT';
		tag_placeholder = '{ key1:"value1"}';
		self.request_content_jqo = $('<textarea>');
		self.request_content_jqo.attr('id', tag_id);
		self.request_content_jqo.attr('placeholder', tag_placeholder);
		label_jqo = $('<label>');
		label_jqo.text(tag_label);
		label_jqo.attr('for', tag_id);
		self.request_group_jqo.append(label_jqo);
		self.request_group_jqo.append(self.request_content_jqo);
		
		// URL ARGS
		tag_id = self.get_view_id() + '_request_button';
		tag_label = 'TEST REQUEST';
		self.request_button_jqo = $('<button>');
		self.request_button_jqo.attr('id', tag_id);
		self.request_button_jqo.text(tag_label);
		self.request_group_jqo.append(self.request_button_jqo);
		self.request_button_jqo.click(
			function()
			{
				var token = Devapt.app.get_security_token();
				
				// GET REQUEST ATTRIBUTES
				var url_full = self.url_full_jqo.val();
				var url_method = self.request_method_jqo.val();
				
				var url_body_content = self.request_content_jqo.val();
				
				var promise = Devapt.ajax(url_method, url_full, url_body_content ? url_body_content : null, null, token);
				var success_cb = function(results_object)
				{
					console.log(arguments, context + ':ajax promise success');
					self.response_content_tree_object.set_tree_datas(results_object);
				}
				var failure_cb = function()
				{
					console.log(arguments, context + ':ajax promise failure');
				}
				promise.then(success_cb, failure_cb);
			}
		);
		
		
		// RESPONSE GROUP
		var response_group_label = 'Response';
		self.response_group_jqo = $('<fieldset>');
		self.response_group_jqo.append( $('<legend>').css('background', 'none').css('font-weight', 'normal').text(response_group_label) );
		self.content_jqo.append(self.response_group_jqo);
		
		// RESPONSE CONTENT
		tag_id = self.get_view_id() + '_response_content_input';
		tag_label = 'RESPONSE CONTENT';
		tag_placeholder = '{}';
		self.response_content_jqo = $('<div>');
		self.response_content_jqo.attr('id', tag_id);
		self.response_content_tree_object = DevaptJsonTree.create(self.name + 'response_tree', { root_name:'response result'} );
		self.response_content_tree_object.set_parent(self.response_content_jqo);
		self.response_content_tree_object.render();
		// label_jqo = $('<label>');
		// label_jqo.text(tag_label);
		// label_jqo.attr('for', tag_id);
		// self.response_group_jqo.append(label_jqo);
		self.response_group_jqo.append(self.response_content_jqo);
		
		
		// BINDING
		var update_full_url = function()
		{
			var url_base = self.url_base_jqo.val();
			var url_controller = self.url_controller_jqo.val();
			var url_resource = self.url_target_jqo.val();
			var url_action = self.url_action_jqo.val();
			var url_args = self.request_args_jqo.val();
			
			var full_url = url_base + url_controller + '/' + url_resource + '/' + (url_action.length > 0 ? url_action + '/' : '') + url_args;
			
			self.url_full_jqo.val(full_url);
		};
		
		var update_input = function(tag_jqo)
		{
			return function(new_value, old_value)
			{
				// console.log(tag_jqo, 'tag_jqo');
				tag_jqo.val(new_value);
				update_full_url();
			}
		};
		
		var update_request_body_content = function(new_value, old_value)
		{
			self.request_content_jqo.text(new_value);
		};
		
		var update_request_format = function(new_value, old_value)
		{
			self.request_format_jqo.val(new_value);
			
			var request_body = '';
			if(new_value === 'devapt_query_api_2')
			{
				request_body = 'query_json:{\
	"action":"read",\n\
	"query_type":"select",\n\
	"fields":["users_id","users_login","users_email"],\n\
	"one_field":null,\n\
	"values":[],\n\
	"values_count":0,\n\
	"filters":[],\n\
	"orders":[],\n\
	"groups":[],\n\
	"slice":null,\n\
	"joins":[]\n\
}\n';
			}
			update_request_body_content(request_body, null);
		};
		
		var bind_values = {
			base_url:Devapt.app.get_url_base(),
			controller:'rest',
			target:'view_crud_api_view_model_model',
			action:'',
			method:'GET',
			format:'devapt_query_api_2',
			args:'',
			content:''
		};
		
		var bind_mapping = {
			base_url:{
				dom:'#' + self.get_view_id() + '_url_base_input',
				callback:update_input(self.url_base_jqo)
			},
			controller:{
				dom:'#' + self.get_view_id() + '_url_controller_input',
				callback:update_input(self.url_controller_jqo)
			},
			target:{
				dom:'#' + self.get_view_id() + '_url_target_input',
				callback:update_input(self.url_target_jqo)
			},
			action:{
				dom:'#' + self.get_view_id() + '_url_action_input',
				callback:update_input(self.url_action_jqo)
			},
			method:{
				dom:'#' + self.get_view_id() + '_url_method_input',
				callback:update_input(self.request_method_jqo)
			},
			format:{
				dom:'#' + self.get_view_id() + '_api_format_input',
				callback:update_request_format
			},
			args:{
				dom:'#' + self.get_view_id() + '_url_args_input',
				callback:update_input(self.request_args_jqo)
			},
			content:{
				dom:'#' + self.get_view_id() + '_body_content_input',
				callback:update_request_body_content
			}
		};
		
		self.binding_data = Bind(bind_values, bind_mapping);
		
		
		self.leave(context, 'success: promise is resolved');
		return Devapt.promise_resolved();
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptUrlApiDetail
	 * @desc				Render a composite view to display API details
	 * @param {object}	arg_value	value to set
	 * @return {object}		promise object
	 */
	var cb_set_value = function(arg_value)
	{
		var self = this;
		var context = 'set_value(value)';
		self.enter(context, '');
		
		
		// DEBUG
		// console.log(arg_value, context + ':arg_value');
		
		// CHECK ARGS
		self.assert_object(context, 'arg_value', arg_value);
		arg_value = arg_value.datas;
		
		
		// GET URL PARTS
		var url = DevaptTypes.to_string(arg_value.url, '');
		var resource = DevaptTypes.to_string(arg_value.resource_name, '');
		var controller = DevaptTypes.to_string(arg_value.controller, '');
		var action = controller === 'rest' ? '' : DevaptTypes.to_string(arg_value.action, '');
		var method = DevaptTypes.to_string(arg_value.method, '');
		var format = DevaptTypes.to_string(arg_value.format, '');
		
		var url_parts = url.split('/');
		var url_parts_count = url_parts.length;
		self.assert_true(context, 'url_parts_count', url_parts_count > 3);
		
		// var urls_args = url_parts[url_parts_count - 1];
		// var urls_args
		// var urls_action = url_parts[url_parts_count - 2] === resource ? : ;
		
		self.binding_data.target = resource;
		self.binding_data.controller = controller;
		self.binding_data.action = action;
		self.binding_data.format = format;
		self.binding_data.method = method;
		
		
		self.leave(context, 'success: promise is resolved');
		return Devapt.promise_resolved();
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-06-09',
			updated:'2015-06-09',
			description:'URL API details view class.'
		},
		properties:{
		}
	};
	var parent_class = DevaptView;
	var DevaptUrlApiDetailClass = new DevaptClass('DevaptUrlApiDetail', parent_class, class_settings);
	
	// METHODS
	DevaptUrlApiDetailClass.add_public_method('render_content_self', {}, cb_render_content_self);
	DevaptUrlApiDetailClass.add_public_method('set_value', {}, cb_set_value);
	
	// PROPERTIES
		// PLACEHOLDER
	// DevaptUrlApiDetailClass.add_public_str_property('placeholder',					'input placeholder string', null, false, false, []);
		// URL
	// DevaptUrlApiDetailClass.add_public_str_property('placeholder',					'input placeholder string', null, false, false, []);
	
		// MOUSE EVENTS
	// DevaptUrlApiDetailClass.add_public_bool_property('events_click_enabled',		'', false, false, false, []);
	
		// KEY EVENTS
	// DevaptUrlApiDetailClass.add_public_bool_property('events_keydown_enabled',		'', false, false, false, []);
	// DevaptUrlApiDetailClass.add_public_bool_property('events_keyup_enabled',		'', false, false, false, []);
	// DevaptUrlApiDetailClass.add_public_bool_property('events_keypress_enabled',	'', false, false, false, []);
	
		// CLIPBOARD EVENTS
	// DevaptUrlApiDetailClass.add_public_bool_property('events_cut_enabled',			'', false, false, false, []);
	// DevaptUrlApiDetailClass.add_public_bool_property('events_copy_enabled',		'', false, false, false, []);
	// DevaptUrlApiDetailClass.add_public_bool_property('events_paste_enabled',		'', false, false, false, []);
	
	
	return DevaptUrlApiDetailClass;
} );