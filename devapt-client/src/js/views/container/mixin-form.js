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
		mixin_form_enabled: false,
		
		
		/**
		 * @memberof			DevaptMixinForm
		 * @public
		 * @desc				Map of HTML input tags
		 */
		mixin_form_inputs_map: {},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinForm
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_form: function(self)
		{
			self.push_trace(self.trace, self.mixin_trace_form);
			var context = 'mixin_init_form()';
			self.enter(context, '');
			
			
			var inputs = self.get_property('items_input_fields');
			self.mixin_form_enabled = inputs ? inputs.length > 0 : false;
			if (self.mixin_form_enabled)
			{
				if (inputs.length === 1 && inputs[0] === 'all' && self.items_fields && self.items_fields.length > 0)
				{
					self.items_input_fields = self.items_fields;
				}
			}
			
			
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
			self.push_trace(self.trace, self.mixin_trace_form);
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
			var context = 'on_input_changed(field, prev value1, new value)';
			self.push_trace(self.trace, self.mixin_trace_form);
			self.enter(context, '');
			
			
			self.items_current_record[arg_field_obj.name] = arg_new_value;
			// console.log(self.items_current_record, context);
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
									self.fire_event('devapt.container.updated', [model, self.items_current_record]);
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
		 * @param {object}		arg_field_orig			field definition attributes
		 * @param {object}		arg_field_custom		custom field attributes
		 * @param {string}		arg_value				field value
		 * @return {object}		jQuery node object
		 */
		get_input: function(arg_field_orig, arg_field_custom, arg_value)
		{
			var self = this;
			var context = 'get_input(field, value)';
			self.push_trace(self.trace, self.mixin_trace_form);
			self.enter(context, '');
			
			
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
			var backend_input_jqo = Devapt.has_current_backend() ? Devapt.get_current_backend().get_input(field_obj, value_str) : null;
			if (backend_input_jqo)
			{
				self.step(context, 'input is found in current backend');
				
				self.leave(context, self.msg_success);
				self.pop_trace();
				return backend_input_jqo;
			}
			
			
			// GET STANDARD INPUT
			var type_str = DevaptTypes.to_string(field_obj.field_value.type, 'string').toLocaleLowerCase();
			var node_jqo = null;
			switch(type_str)
			{
				case 'password':
					node_jqo = self.get_password_input(field_obj, value_str);
					break;
				default:
					node_jqo = self.get_simple_input(field_obj, value_str);
					break;
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
			self.push_trace(self.trace, self.mixin_trace_form);
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
				var node_jqo = $(event.target);
				var value_filled = node_jqo.data('value_filled');
				var value = node_jqo.val();
				
				if (value !== value_filled)
				{
					node_jqo.data('value_filled', value);
					console.log(value, 'input changed');
					self.fire_event('devapt.input.changed', [field_obj, value_filled, value]);
					self.on_input_changed(field_obj, value_filled, value);
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
			self.push_trace(self.trace, self.mixin_trace_form);
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
					console.log(value, 'pass input changed');
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
			self.push_trace(self.trace, self.mixin_trace_form);
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return node_jqo;
		}
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinForm
	 * @desc				Register mixin options
	 * @return {nothing}
	 */
	// DevaptMixinForm.register_options = function(arg_prototype)
	// {
		// DevaptOptions.register_array_option(arg_prototype, 'items_input_fields',	[], false, ',', 'String', []);
	// };
	
	
	
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
	DevaptMixinFormClass.add_public_method('get_simple_input', {}, DevaptMixinForm.get_simple_input);
	DevaptMixinFormClass.add_public_method('get_password_input', {}, DevaptMixinForm.get_password_input);
	DevaptMixinFormClass.add_public_method('get_list_input', {}, DevaptMixinForm.get_list_input);
	
	// PROPERTIES
	DevaptMixinFormClass.add_property_record(
		{
			name: 'items_input_fields',
			type: 'array',
			visibility:'pulic',
			is_public:true,
			default_value: [],
			array_separator: ',',
			array_type: 'String',
			format: '',
			is_required: false,
			children: {},
			aliases: []
		}
	);
	
	DevaptMixinFormClass.build_class();
	
	
	return DevaptMixinFormClass;
}
);