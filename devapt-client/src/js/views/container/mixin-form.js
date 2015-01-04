/**
 * @file        views/mixin-filtered.js
 * @desc        Mixin for datas form feature for containers
 * @see			DevaptContainer
 * @ingroup     DEVAPT_CORE
 * @date        2014-08-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict'
define(
['Devapt', 'core/types', 'core/class'],
function(Devapt, DevaptTypes, DevaptClass)
{
	/**
	 * @mixin				DevaptMixinForm
	 * @public
	 * @desc				Mixin of methods for datas form features
	 */
	var DevaptMixinForm = 
	{
		/**
		 * @memberof			DevaptMixinForm
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_form: false,
		
		
		/**
		 * @memberof			DevaptMixinForm
		 * @public
		 * @desc				Enable/disable mixin operations
		 */
		mixin_form_enabled: false, // ignored value (see instance value)
		
		
		/**
		 * @memberof			DevaptMixinForm
		 * @public
		 * @desc				Map of HTML input tags
		 */
		mixin_form_inputs_map: {}, // ignored value (see instance value)
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinForm
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_form: function(self)
		{
			self.push_trace(self.trace, DevaptMixinForm.mixin_trace_form);
			var context = 'mixin_init_form()';
			self.enter(context, '');
			
			
			var inputs = self.get_property('items_input_fields');
			// console.log(inputs, 'inputs');
			
			self.mixin_form_enabled = inputs ? inputs.length > 0 : false;
			// console.log(self.mixin_form_enabled, 'self.mixin_form_enabled');
			if (self.mixin_form_enabled)
			{
				if (inputs.length === 1 && inputs[0] === 'all' && self.items_fields && self.items_fields.length > 0)
				{
					self.items_input_fields = self.items_fields;
				}
			}
			// console.log(self.items_input_fields, 'self.items_input_fields');
			// self.mixin_form_inputs_map = {};
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinForm
		 * @desc				Test if the view has input fields
		 * @return {nothing}
		 */
		has_input: function()
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinForm.mixin_trace_form);
			var context = 'has_input()';
			self.enter(context, '');
			
			self.value(context, 'enabled', self.mixin_form_enabled);
			
			self.leave(context, '');
			self.pop_trace();
			return self.mixin_form_enabled;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinForm
		 * @desc				On input value changed
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {string}		arg_previous_value		previous field value
		 * @param {string}		arg_new_value			new field value
		 * @return {nothing}
		 */
		on_input_changed: function(arg_field_obj, arg_previous_value, arg_new_value)
		{
			var self = this;
			var context = 'on_input_changed(field, prev value, new value)';
			self.push_trace(self.trace, DevaptMixinForm.mixin_trace_form);
			self.enter(context, '');
			
			
			self.items_current_record[arg_field_obj.name] = arg_new_value;
			console.log(self.items_current_record, context + ':current record for [' + self.name + ']');
			
			self.get_items_model().done(
				function(model)
				{
					model.get_engine().done(
						function(engine)
						{
							engine.update_records([self.items_current_record]).done(
								function()
								{
									// console.log('fire event', context);
									// console.log(arg_previous_value, context + ':arg_previous_value');
									// console.log(arg_new_value, context + ':arg_new_value');
									self.fire_event('devapt.container.updated', [model, self.items_current_record, arg_field_obj, arg_previous_value, arg_new_value]);
								}
							);
						}
					);
				}
			);
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinForm
		 * @desc				Get an input tag for the given field
		 * @param {object}		arg_deferred			deferred object
		 * @param {object}		arg_field_orig			field definition attributes
		 * @param {object}		arg_field_custom		custom field attributes
		 * @param {string}		arg_value				field value
		 * @param {boolean}		arg_render_label		should render an input label?
		 * @param {object}		arg_access				access object: {create:bool,read:bool,update:bool,delete:bool}
		 * @return {object}		jQuery node object
		 */
		get_input: function(arg_deferred, arg_field_orig, arg_field_custom, arg_value, arg_render_label, arg_access)
		{
			var self = this;
			var context = 'get_input(field, value)';
			self.push_trace(self.trace, DevaptMixinForm.mixin_trace_form);
			self.enter(context, '');
			
			
			// INIT HAS LABEL
			arg_render_label = !! (arg_render_label ? arg_render_label : false);
			
			// TEST ENABLED
			if ( ! self.mixin_form_enabled )
			{
				self.leave(context, self.msg_success);
				self.pop_trace();
				return null;
			}
			
			
			// INIT INPUT VALUE
			var value_str = DevaptTypes.to_string(arg_value, '');
			
			
			// GET FIELD ATTRIBUTES OBJECT
			self.assertObject(context, 'field definition', arg_field_orig);
			var field_obj = arg_field_orig;
			if ( DevaptTypes.is_object(arg_field_custom) )
			{
				field_obj = $.extend(true, self.clone_object(arg_field_orig), arg_field_custom);
			}
			
			
			// GET BACKEND INPUT
			var backend_input_jqo = Devapt.has_current_backend() ? Devapt.get_current_backend().get_input(self, field_obj, value_str) : null;
			if (backend_input_jqo)
			{
				self.step(context, 'input is found in current backend');
				
				self.leave(context, self.msg_success);
				self.pop_trace();
				return backend_input_jqo;
			}
			
			
			// GET JOINED INPUT
			if ( field_obj.has_foreign() || field_obj.has_join() )
			{
				self.step(context, 'input field has foreign or join link');
				
				var node_jqo = self.get_join_input(arg_deferred, field_obj, value_str, arg_access);
				
				self.leave(context, self.msg_success);
				self.pop_trace();
				return node_jqo; 
			}
			// else
			// {
				// console.log(field_obj, 'no join');
			// }
			
			
			// GET STANDARD INPUT
			var type_str = DevaptTypes.to_string(field_obj.field_value.type, 'string').toLocaleLowerCase();
			var node_jqo = null;
			switch(type_str)
			{
				case 'password':
					self.step(context, 'switch password field case');
					node_jqo = self.get_password_input(field_obj, value_str);
					break;
				default:
					self.step(context, 'switch default field case');
					self.step(context, 'input field has foreign or join link');
					node_jqo = self.get_simple_input(field_obj, value_str);
					break;
			}
			
			
			// SET LABEL
			if ( arg_render_label && node_jqo && DevaptTypes.is_not_empty_str(field_obj.label) )
			{
				self.step(context, 'field has label');
				
				var div_jqo = $('<div>');
				if ( ! DevaptTypes.is_not_empty_str( node_jqo.attr('id') ) )
				{
					self.step(context, 'set node id');
					node_jqo.attr('id', field_obj.name + '_input_' + self.get_view_id());
				}
				
				var label_jqo = $('<label for="' + node_jqo.attr('id') + '">');
				label_jqo.text(field_obj.label);
				div_jqo.append(label_jqo);
				div_jqo.append(node_jqo);
				
				self.leave(context, self.msg_success);
				self.pop_trace();
				return div_jqo;
			}
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return node_jqo;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinForm
		 * @desc				Get an input tag for the given joined field
		 * @param {object}		arg_deferred			deferred object
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {string}		arg_value				field value
		 * @param {object}		arg_access				access object: {create:bool,read:bool,update:bool,delete:bool}
		 * @return {object}		jQuery node object
		 */
		get_join_input: function(arg_deferred, arg_field_obj, arg_value, arg_access)
		{
			var self = this;
			// DevaptMixinForm.mixin_trace_form = true;
			var context = 'get_join_input(field,value,access)';
			self.push_trace(self.trace, DevaptMixinForm.mixin_trace_form);
			self.enter(context, '');
			
			
			// STANDARD INPUT EVENT CALLBACK
			var change_cb = function(event) {
				var event_node_jqo = $(event.target);
				var value_filled = event_node_jqo.data('value_filled');
				var value = event_node_jqo.val();
				
				// ON VALUE CHANGE
				if (value !== value_filled)
				{
					event_node_jqo.data('value_filled', value);
					// console.log(value, 'input changed');
					
					// VALIDATE VALUE
					var validate_status = self.validate_input(arg_field_obj, value);
					if (! validate_status.is_valid)
					{
						event_node_jqo.parent().addClass('devapt_validate_error');
						
						if ( Devapt.has_current_backend() )
						{
							Devapt.get_current_backend().notify_error(validate_status.error_label);
						}
					}
					else
					{
						event_node_jqo.parent().removeClass('devapt_validate_error');
						
						// EMIT CHANGE EVENTS
						self.fire_event('devapt.input.changed', [arg_field_obj, value_filled, value]);
						
						// TODO ON JOIN CHANGE
						// self.on_input_changed(arg_field_obj, value_filled, value);
					}
				}
			};
			
			
			// CREATE MAIN INPUT DIV
			var uid = self.name + '_' + arg_field_obj.name + '_' + Devapt.uid();
			var node_jqo = $('<div id="' + uid + '" style="display:block;float:none;">');
			// console.info(node_jqo, 'get_join_input.node with uid[' + uid + ']');
			
			
			var icon_css = 'width:20px;height:20px;text-align:center;padding:0px';
			
			// var main_div_jqo = $('<div class="row collapse">');
			// var main_div_jqo = $('<div>');
			// node_jqo.append(main_div_jqo);
			// var input_div_icons_jqo = $('<div class="small-3 large-2 columns">');
			
			var table_jqo = $('<table style="margin:0px;padding:0px;">');
			node_jqo.append(table_jqo);
			var tr_jqo = $('<tr style="margin:0px;padding:0px;">');
			table_jqo.append(tr_jqo);
			
			var input_div_icons_jqo = $('<div>');
			var td1_jqo = $('<td style="margin:0px;padding:0px;">');
			tr_jqo.append(td1_jqo);
			td1_jqo.append(input_div_icons_jqo);
			
			var input_jqo = $('<div style="margin:0px;padding:0px;">');
			var td2_jqo = $('<td style="margin:0px;padding:0px;">');
			tr_jqo.append(td2_jqo);
			td2_jqo.append(input_jqo);
			
			// CREATE
			if (arg_access.create)
			{
				var div_jqo = $('<div>');
				var create_jqo = $('<a href="#" class="devapt_icon_small" style="' + icon_css + '">&times;</a>');
				div_jqo.append(create_jqo);
				input_div_icons_jqo.append(div_jqo);
			}
			
			// DELETE
			if (arg_access['delete'])
			{
				var div_jqo = $('<div>');
				var delete_jqo = $('<a href="#" class="devapt_icon_small" style="' + icon_css + '">&plus;</a>');
				div_jqo.append(delete_jqo);
				input_div_icons_jqo.append(div_jqo);
			}
			
			// UPDATE
			if (arg_access.update)
			{
				// GET VALUES PROMISE
				var values_promise = arg_field_obj.get_available_values();
				values_promise.then(
					function(result)
					{
						// console.info(result, 'get_join_input.promise.result');
						
						// CHECK RESPONSE STATUS
						if (result.status !== 'ok')
						{
							input_jqo.text('Error during fetching');
							return;
						}
						
						// CREATE SELECT
						var select_jqo = $('<select style="margin:0px;padding:0px;">');
						input_jqo.append(select_jqo);
						
						// SET EVENTS HANDLES
						input_jqo.on('change', change_cb);
						select_jqo.data('value_filled', arg_value);
						
						// FILL ITEMS
						for(var record_index = 0 ; record_index < result.count ; record_index++)
						{
							var record = result.records[record_index];
							var label = record[arg_field_obj.name];
							var option = $('<option>');
							
							select_jqo.append(option);
							
							option.text(label);
							if (label === arg_value)
							{
								option.attr('selected', '');
							}
						}
					}
				);
			}
			else
			{
				// RENDER ITEM
				if ( DevaptTypes.is_not_empty_str(self.items_format) )
				{
					self.step(context, 'items_format is a valid string');
					
					var content = DevaptTemplate.render(self.items_format, tags_object);
					self.render_item_text(arg_deferred, input_jqo, content);
				}
				else
				{
					self.step(context, 'items_format is a not valid string');
					
					var field_value = tags_object[field_name] ? tags_object[field_name] : field_def_obj.field_value.defaults;
					self.render_item_text(arg_deferred, input_jqo, field_value);
				}
			}
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return node_jqo;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinForm
		 * @desc				Get a simple input tag for the given field
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {string}		arg_value				field value
		 * @return {object}		jQuery node object
		 */
		get_simple_input: function(arg_field_obj, arg_value)
		{
			var self = this;
			var context = 'get_simple_input(field, value)';
			self.push_trace(self.trace, DevaptMixinForm.mixin_trace_form);
			self.enter(context, '');
			
			
			// GET FIELD ATTRIBUTES
			var value_str = arg_value;
			var field_obj = arg_field_obj;
			var type_str = DevaptTypes.to_string(field_obj.field_value.type, 'string').toLocaleLowerCase();
			var name_str = DevaptTypes.to_string(field_obj.name, null);
			var label_str = DevaptTypes.to_string(field_obj.label, null);
			self.value(context, 'type_str', type_str);
			self.value(context, 'name_str', name_str);
			self.value(context, 'label_str', label_str);
			
			
			// GET RESULT INPUT NODE
			var node_jqo = null;
			switch(type_str)
			{
				case 'string':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_string').val(value_str); break;
				case 'integer':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_integer').val(value_str); break;
				case 'float':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_float').val(value_str); break;
				case 'boolean':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_boolean').val(value_str); break;
				case 'email':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_email').val(value_str); break;
				case 'date':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_date').val(value_str); break;
				case 'time':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_time').val(value_str); break;
				case 'datetime':	node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_datetime').val(value_str); break;
			}
			
			
			// CHECK RESULT INPUT NODE
			if (! node_jqo)
			{
				self.leave(context, self.msg_failure);
				self.pop_trace();
				return null;
			}
			
			
			// SAVE FILLED VALUE
			node_jqo.data('value_filled', value_str);
			// node_jqo.data('value_changed', null);
			
			
			// SET PLACEHOLDER
			if (field_obj.placeholder)
			{
				node_jqo.attr('placeholder', field_obj.placeholder);
			}
			
			
			// STANDARD INPUT EVENT CALLBACK
			var change_cb = function(event) {
				var event_node_jqo = $(event.target);
				var value_filled = event_node_jqo.data('value_filled');
				var value = event_node_jqo.val();
				
				// ON VALUE CHANGE
				if (value !== value_filled)
				{
					event_node_jqo.data('value_filled', value);
					// console.log(value, 'input changed');
					
					// VALIDATE VALUE
					var validate_status = self.validate_input(field_obj, value);
					if (! validate_status.is_valid)
					{
						event_node_jqo.parent().addClass('devapt_validate_error');
						
						if ( Devapt.has_current_backend() )
						{
							Devapt.get_current_backend().notify_error(validate_status.error_label);
						}
					}
					else
					{
						event_node_jqo.parent().removeClass('devapt_validate_error');
						
						// EMIT CHANGE EVENTS
						self.fire_event('devapt.input.changed', [field_obj, value_filled, value]);
						self.on_input_changed(field_obj, value_filled, value);
					}
				}
			};
			
			
			// SET EVENTS HANDLES
			node_jqo.on('change', change_cb);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return node_jqo;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinForm
		 * @desc				Get a password input tag for the given field
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {string}		arg_value				field value
		 * @return {object}		jQuery node object
		 */
		get_password_input: function(arg_field_obj, arg_value)
		{
			var self = this;
			var context = 'get_password_input(field, value)';
			self.push_trace(self.trace, DevaptMixinForm.mixin_trace_form);
			self.enter(context, '');
			
			
			// GET FIELD ATTRIBUTES
			var field_obj = arg_field_obj;
			var value_str = arg_value;
			var name_str = DevaptTypes.to_string(field_obj.name, null);
			var label_str = DevaptTypes.to_string(field_obj.label, null);
			self.value(context, 'name_str', name_str);
			self.value(context, 'label_str', label_str);
			self.value(context, 'value_str', value_str);
			
			
			// GET RESULT INPUT NODE
			var node_jqo = $('<div>').attr('name', name_str).addClass('devapt_input_password');
			var pass0_jqo = $('<input type="hidden">').attr('name', name_str + '_pass0').val(value_str);
			var pass1_jqo = $('<input type="password">').attr('name', name_str + '_pass1');
			var pass2_jqo = $('<input type="password">').attr('name', name_str + '_pass2');
			node_jqo.append(pass0_jqo).append(pass1_jqo).append(pass2_jqo);
			
			
			// CHECK RESULT INPUT NODE
			if (! node_jqo)
			{
				self.leave(context, self.msg_failure);
				self.pop_trace();
				return null;
			}
			
			
			
			// SAVE FILLED VALUE
			node_jqo.data('value_filled', value_str);
			// node_jqo.data('value_changed', null);
			
			
			// SET PLACEHOLDER
			if (field_obj.placeholder)
			{
				pass1_jqo.attr('placeholder', field_obj.placeholder);
				pass2_jqo.attr('placeholder', field_obj.placeholder);
			}
			
			
			// PASSWORD INPUT EVENT CALLBACK
			var change_pass_cb = function(event) {
				var node_jqo = $(event.target);
				var value_filled = node_jqo.data('value_filled');
				var value = null;
				
				var input0_jqo = $('input:eq(0)', node_jqo.parent());
				var input1_jqo = $('input:eq(1)', node_jqo.parent());
				var input2_jqo = node_jqo;
				
				// CHECK PASSWORD CONFORMATION
				var value1 = input1_jqo.val();
				var value2 = input2_jqo.val();
				if (value1 !== value2)
				{
					self.notify_alert('password confirmation is different');
					return true;
				}
				
				// HASH PASSWORD IF NEEDED
				value = value1;
				if (field_obj.hash === 'md5')
				{
					value = 'md5(' + value + ')';
				}
				
				// TEST IF PASSWORD HAS CHANGED
				if (value !== value_filled)
				{
					input0_jqo.val(value);
					node_jqo.data('value_filled', value);
					// console.log(value, 'pass input changed');
					self.fire_event('devapt.input.changed', [field_obj, value_filled, value]);
					self.on_input_changed(field_obj, value_filled, value);
				}
			};
			
			
			// SET EVENTS HANDLES
			pass2_jqo.on('change', change_pass_cb);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return node_jqo;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinForm
		 * @desc				Get a password input tag for the given field
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {string}		arg_value				field value
		 * @return {object}		jQuery node object
		 */
		get_list_input: function(arg_field_obj, arg_value)
		{
			var self = this;
			var context = 'get_password_input(field, value)';
			self.push_trace(self.trace, DevaptMixinForm.mixin_trace_form);
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return node_jqo;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinForm
		 * @desc				Get a password input tag for the given field
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {string}		arg_value				field value
		 * @return {object}		validate status
		 */
		validate_input: function(arg_field_obj, arg_value)
		{
			var self = this;
			var context = 'validate_input(field, value)';
			self.push_trace(self.trace, DevaptMixinForm.mixin_trace_form);
			self.enter(context, '');
			
			
			// SET DEFAULT STATUS
			var validate_status = {
				valid_label:arg_field_obj.field_value.validate_valid_label ? arg_field_obj.field_value.validate_valid_label : 'good value',
				error_label:arg_field_obj.field_value.validate_error_label ? arg_field_obj.field_value.validate_error_label : 'bad value',
				is_valid:true
			};
			
			
			// VALIDATE REGEXP EXISTS
			if ( DevaptTypes.is_object(arg_field_obj.field_value.validate_regexp) )
			{
				self.step(context, 'validation regexp exists');
				
				validate_status.is_valid = arg_field_obj.field_value.validate_regexp.test(arg_value);
				
				self.leave(context, self.msg_success);
				self.pop_trace();
				return validate_status;
			}
			
			
			// TEST VALIDATE
			var validate_pattern = null;
			if ( DevaptTypes.is_not_empty_str(arg_field_obj.field_value.validate) )
			{
				self.step(context, 'validation pattern exists');
				
				switch(arg_field_obj.field_value.validate)
				{
					case 'url': validate_pattern = /^(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/; break;
					case 'dns': validate_pattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/; break;
					
					case 'alpha': validate_pattern = /^[a-z]+$/; break;
					case 'Alpha': validate_pattern = /^[A-Z][a-z]+$/; break;
					case 'alphaALPHA': validate_pattern = /^[a-zA-Z]+$/; break;
					case 'ALPHA': validate_pattern = /^[A-Z]+$/; break;
					
					case 'alpha-': validate_pattern = /^[a-z-]+$/; break;
					case 'Alpha-': validate_pattern = /^[A-Z][a-z-]+$/; break;
					case 'alphaALPHA-': validate_pattern = /^[a-zA-Z-]+$/; break;
					case 'ALPHA-': validate_pattern = /^[A-Z-]+$/; break;
					
					case 'alpha_': validate_pattern = /^[a-z_]+$/; break;
					case 'Alpha_': validate_pattern = /^[A-Z][a-z_]+$/; break;
					case 'alphaALPHA_': validate_pattern = /^[a-zA-Z_]+$/; break;
					case 'ALPHA_': validate_pattern = /^[A-Z_]+$/; break;
					
					case 'alpha_-': validate_pattern = /^[a-z_-]+$/; break;
					case 'Alpha_-': validate_pattern = /^[A-Z][a-z_-]+$/; break;
					case 'alphaALPHA_-': validate_pattern = /^[a-zA-Z_-]+$/; break;
					case 'ALPHA_-': validate_pattern = /^[A-Z_-]+$/; break;
					
					case 'alpha_-space': validate_pattern = /^[a-z_- ]+$/; break;
					case 'Alpha_-space': validate_pattern = /^[A-Z][a-z_- ]+$/; break;
					case 'alphaALPHA_-space': validate_pattern = /^[a-zA-Z_- ]+$/; break;
					case 'ALPHA_-space': validate_pattern = /^[A-Z_- ]+$/; break;
					
					case 'alphanum': validate_pattern = /^[a-z0-9]+$/; break;
					case 'Alphanum': validate_pattern = /^[A-Z][a-z0-9]+$/; break;
					case 'alphaALPHAnum': validate_pattern = /^[a-zA-Z0-9]+$/; break;
					case 'ALPHAnum': validate_pattern = /^[A-Z0-9]+$/; break;
					
					case 'alphanum-': validate_pattern = /^[a-z0-9-]+$/; break;
					case 'Alphanum-': validate_pattern = /^[A-Z][a-z0-9-]+$/; break;
					case 'alphaALPHAnum-': validate_pattern = /^[a-zA-Z0-9-]+$/; break;
					case 'ALPHAnum-': validate_pattern = /^[A-Z0-9-]+$/; break;
					
					case 'alphanum_': validate_pattern = /^[a-z0-9_]+$/; break;
					case 'Alphanum_': validate_pattern = /^[A-Z][a-z0-9_]+$/; break;
					case 'alphaALPHAnum_': validate_pattern = /^[a-zA-Z0-9_]+$/; break;
					case 'ALPHAnum_': validate_pattern = /^[A-Z0-9_]+$/; break;
					
					case 'alphanum_-': validate_pattern = /^[a-z0-9_-]+$/; break;
					case 'Alphanum_-': validate_pattern = /^[A-Z][a-z0-9_-]+$/; break;
					case 'alphaALPHAnum_-': validate_pattern = /^[a-zA-Z0-9_-]+$/; break;
					case 'ALPHAnum_-': validate_pattern = /^[A-Z0-9_-]+$/; break;
					
					case 'alphanum_-space': validate_pattern = /^[a-zA-Z][a-z0-9_ -]*$/; break;
					case 'Alphanum_-space': validate_pattern = /^[a-zA-Z][A-Z][a-z0-9_ -]*$/; break;
					case 'alphaALPHAnum_-space': validate_pattern = /^[a-zA-Z][a-zA-Z0-9_ -]*$/; break;
					case 'ALPHAnum_-space': validate_pattern = /^[a-zA-Z][A-Z0-9_ -]*$/; break;
					
					case 'DDMMYYYY': validate_pattern = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{4}$/; break;
					case 'DD-MM-YYYY': validate_pattern = /^(0[1-9]|[12][0-9]|3[01])[-](0[1-9]|1[012])[-]\d{4}$/; break;
					case 'DD/MM/YYYY': validate_pattern = /^(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[012])[\/]\d{4}$/; break;
					case 'DD MM YYYY': validate_pattern = /^(0[1-9]|[12][0-9]|3[01])[ ](0[1-9]|1[012])[ ]\d{4}$/; break;
					case 'DD.MM.YYYY': validate_pattern = /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.]\d{4}$/; break;
					
					default: validate_pattern = new RegExp(arg_field_obj.field_value.validate); break;
				}
			}
			
			
			// NO VALIDATE PATTERN, CHECK VALUE WITH TYPE
			if (validate_pattern === null)
			{
				self.step(context, 'no validation pattern, check with type');
				
				switch(arg_field_obj.field_value.type)
				{
					case 'integer':		validate_pattern = /^[-+]?[0-9]+$/; break;
					case 'float':		validate_pattern = /^[-+]?\d*(?:[\.\,]\d+)?$/; break;
					case 'boolean':		validate_pattern = /^0|1|true|false|on|off$/i; break;
					case 'email':		validate_pattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/; break;
					case 'color':		validate_pattern = /^#?([a-fA-F0-9]{6}|\(\d{1,3},\d{1,3},\d{1,3}\)$/; break; // #FFFFFF or (ddd,ddd,ddd)
					case 'date':		validate_pattern = /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/; break; // YYYY-MM-DD
					case 'time':		validate_pattern = /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/; break; // HH:MM:SS
					case 'datetime':	validate_pattern = /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2} (0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/; break; // YYYY-MM-DD HH:MM:SS
				}
			}
			
			// REGISTER REGEXP
			if ( DevaptTypes.is_object(validate_pattern) )
			{
				self.step(context, 'validation pattern exists');
				// console.log(validate_pattern, arg_field_obj.name + ':validate_pattern');
				
				arg_field_obj.field_value.validate_regexp = validate_pattern;
				validate_status.is_valid = arg_field_obj.field_value.validate_regexp.test(arg_value);
				
				self.value(context, 'validation result', validate_status.is_valid);
			}
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return validate_status;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-08-23',
			'updated':'2014-12-06',
			'description':'Mixin methods for datas form feature for containers.'
		}
	};
	
	
	/**
	 * @mixin				DevaptMixinFormClass
	 * @public
	 * @desc				Mixin of methods for datas form feature for containers
	 */
	var DevaptMixinFormClass = new DevaptClass('DevaptMixinForm', null, class_settings);
	
	// METHODS
	DevaptMixinFormClass.infos.ctor = DevaptMixinForm.mixin_init_form;
	DevaptMixinFormClass.add_public_method('has_input', {}, DevaptMixinForm.has_input);
	DevaptMixinFormClass.add_public_method('on_input_changed', {}, DevaptMixinForm.on_input_changed);
	DevaptMixinFormClass.add_public_method('get_input', {}, DevaptMixinForm.get_input);
	DevaptMixinFormClass.add_public_method('get_join_input', {}, DevaptMixinForm.get_join_input);
	DevaptMixinFormClass.add_public_method('get_simple_input', {}, DevaptMixinForm.get_simple_input);
	DevaptMixinFormClass.add_public_method('get_password_input', {}, DevaptMixinForm.get_password_input);
	DevaptMixinFormClass.add_public_method('get_list_input', {}, DevaptMixinForm.get_list_input);
	DevaptMixinFormClass.add_public_method('validate_input', {}, DevaptMixinForm.validate_input);
	
	// BUILD MIXIN CLASS
	DevaptMixinFormClass.build_class();
	
	
	return DevaptMixinFormClass;
}
);