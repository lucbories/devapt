/**
 * @file        views/container-mixin-input.js
 * @desc        Mixin for datas input feature for containers
 * @see			DevaptContainer
 * @ingroup     DEVAPT_VIEWS
 * @date        2015-01-03
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class',
	'views/container/mixin-input-simple', 'views/container/mixin-input-validate', 'views/container/mixin-input-association'],
function(Devapt, DevaptTypes, DevaptClass,
	DevaptMixinInputSimple, DevaptMixinInputValidation, DevaptMixinInputAssociation)
{
	/**
	 * @mixin				DevaptMixinInput
	 * @public
	 * @desc				Mixin of methods for datas form features
	 */
	var DevaptMixinInput = 
	{
		/**
		 * @memberof			DevaptMixinInput
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_input_trace: false,
		
		
		/**
		 * @memberof			DevaptMixinInput
		 * @public
		 * @desc				Enable/disable mixin operations
		 */
		mixin_input_enabled: false, // ignored value (see instance value)
		
		
		/**
		 * @memberof			DevaptMixinInput
		 * @public
		 * @desc				Map of HTML input tags
		 */
		// mixin_input_inputs_map: {}, // ignored value (see instance value)
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinInput
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_input_init: function(self)
		{
			self.push_trace(self.trace, DevaptMixinInput.mixin_input_trace);
			var context = 'mixin_input_init()';
			self.enter(context, '');
			
			
			var inputs = self.get_property('items_input_fields');
			// console.log(inputs, 'inputs');
			self.value(context, 'inputs', inputs);
			
			self.mixin_input_enabled = inputs ? inputs.length > 0 : false;
			// console.log(self.mixin_input_enabled, 'self.mixin_input_enabled');
			self.value(context, 'self.mixin_input_enabled', self.mixin_input_enabled);
			
			if (self.mixin_input_enabled)
			{
				self.step(context, 'is enabled');
				
				if (inputs.length === 1 && inputs[0] === 'all' && self.items_fields && self.items_fields.length > 0)
				{
					self.step(context, 'set input fields');
					
					self.items_input_fields = self.items_fields;
					self.value(context, 'self.items_input_fields', self.items_input_fields);
				}
			}
			// console.log(self.items_input_fields, 'self.items_input_fields');
			// self.mixin_input_inputs_map = {};
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinInput
		 * @desc				Test if the view has input fields
		 * @return {nothing}
		 */
		has_input: function()
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinInput.mixin_input_trace);
			var context = 'has_input()';
			self.enter(context, '');
			
			self.value(context, 'enabled', self.mixin_input_enabled);
			
			self.leave(context, '');
			self.pop_trace();
			return self.mixin_input_enabled;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinInput
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
			self.push_trace(self.trace, DevaptMixinInput.mixin_input_trace);
			self.enter(context, '');
			
			
			// VALUE IS NOT CHANGED
			if (arg_previous_value === arg_new_value)
			{
				self.leave(context, 'nothing to do');
				return;
			}
			
			var promise = self.view_model_promise.then(
				function(arg_view_model)
				{
					return arg_view_model.ready_promise.spread(
						function(arg_model, arg_view)
						{
							self.assert_not_empty_string(context, 'arg_view.items_iterator', arg_view.items_iterator);
							
							switch(arg_view.items_iterator)
							{
								case 'records':
								{
									self.step(context, 'records iterator');
									
									// TODO ?
		//							items = arg_view_model.get_recordset().get_records();
									
									self.step(context, Devapt.msg_default_implementation);
									return;
								}
								
								case 'fields':
								{
									self.step(context, 'fields iterator');
									
									// GET FIRST RECORD
									var records = arg_view_model.get_recordset().get_records();
									var record = records.length > 0 ? records[0] : null;
									
									if ( ! DevaptTypes.is_object(record) )
									{
										self.step(context, 'current record is not found');
										return;
									}
									
									record.set(arg_field_obj.name, arg_new_value);
									record.save();
									
									break;
								}
								
								case 'field_editor':
								{
									self.step(context, 'field_editor iterator');
									
		//							self.assert_not_empty_array(context, 'arg_view.items_fields', arg_view.items_fields);
		//							self.assert_object(context, 'self.edited_field', self.edited_field);
									
									// TODO ?
									
									self.step(context, Devapt.msg_default_implementation);
									return;
								}
							}
						}
					);
				}
			);
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinInput
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
			self.push_trace(self.trace, DevaptMixinInput.mixin_input_trace);
			self.enter(context, '');
			
			
			// INIT HAS LABEL
			arg_render_label = !! (arg_render_label ? arg_render_label : false);
			
			// TEST ENABLED
			if ( ! self.mixin_input_enabled )
			{
				self.leave(context, Devapt.msg_success);
				self.pop_trace();
				return null;
			}
			
			
			// INIT INPUT VALUE
			var value_str = DevaptTypes.to_string(arg_value, '');
			
			
			// GET FIELD ATTRIBUTES OBJECT
			self.assert_object(context, 'field definition', arg_field_orig);
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
				
				self.leave(context, Devapt.msg_success);
				self.pop_trace();
				return backend_input_jqo;
			}
			
			
			// GET JOINED INPUT
			if ( field_obj.has_association() )
			{
				self.step(context, 'input field has foreign or join link');
				
				var node_jqo = self.get_association_input(arg_deferred, field_obj, value_str, arg_access);
				
				self.leave(context, Devapt.msg_success);
				self.pop_trace();
				return node_jqo; 
			}
			
			
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
				
				self.leave(context, Devapt.msg_success);
				self.pop_trace();
				return div_jqo;
			}
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
			return node_jqo;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-08-23',
			'updated':'2015-05-08',
			'description':'Mixin methods for datas form feature for containers.'
		}
	};
	
	
	/**
	 * @mixin				DevaptMixinInputClass
	 * @public
	 * @desc				Mixin of methods for datas form feature for containers
	 */
	var DevaptMixinInputClass = new DevaptClass('DevaptMixinInput', null, class_settings);
	
	// METHODS
	DevaptMixinInputClass.infos.ctor = DevaptMixinInput.mixin_input_init;
	DevaptMixinInputClass.add_public_method('has_input', {}, DevaptMixinInput.has_input);
	DevaptMixinInputClass.add_public_method('on_input_changed', {}, DevaptMixinInput.on_input_changed);
	DevaptMixinInputClass.add_public_method('get_input', {}, DevaptMixinInput.get_input);
	
	// MIXINS
	DevaptMixinInputClass.add_public_mixin(DevaptMixinInputSimple);
	DevaptMixinInputClass.add_public_mixin(DevaptMixinInputValidation);
	DevaptMixinInputClass.add_public_mixin(DevaptMixinInputAssociation);
	
	// BUILD MIXIN CLASS
	DevaptMixinInputClass.build_class();
	
	
	return DevaptMixinInputClass;
}
);