/**
 * @file        views/mixin-input-validate.js
 * @desc        Mixin for datas input validation feature for containers
 * @see			DevaptContainer
 * @ingroup     DEVAPT_VIEWS
 * @date        2015-01-04
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class'],
function(Devapt, DevaptTypes, DevaptClass)
{
	/**
	 * @mixin				DevaptMixinInputValidation
	 * @public
	 * @desc				Mixin of methods for datas form features
	 */
	var DevaptMixinInputValidation = 
	{
		/**
		 * @memberof			DevaptMixinInputValidation
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_input_validation: true,
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinInputValidation
		 * @desc				Get a password input tag for the given field
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {string}		arg_value				field value
		 * @return {object}		validate status
		 */
		validate_input: function(arg_field_obj, arg_value)
		{
			var self = this;
			var context = 'validate_input(field, value)';
			self.push_trace(self.trace, DevaptMixinInputValidation.mixin_trace_input_validation);
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
				
				self.leave(context, Devapt.msg_success);
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
					
					case 'alpha_-space': validate_pattern = /^[a-z_ -]+$/; break; // BE CAREFULL THE "-"" SIGN HAVE TO BE AT THE END
					case 'Alpha_-space': validate_pattern = /^[A-Z][a-z_ -]+$/; break; // BE CAREFULL THE "-"" SIGN HAVE TO BE AT THE END
					case 'alphaALPHA_-space': validate_pattern = /^[a-zA-Z_ -]+$/; break; // BE CAREFULL THE "-"" SIGN HAVE TO BE AT THE END
					case 'ALPHA_-space': validate_pattern = /^[A-Z_ -]+$/; break; // BE CAREFULL THE "-"" SIGN HAVE TO BE AT THE END
					
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
					case 'color':		validate_pattern = /^#?([a-fA-F0-9]{6})|\(\d{1,3},\d{1,3},\d{1,3}\)$/; break; // #FFFFFF or (ddd,ddd,ddd)
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
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
			return validate_status;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-01-04',
			'updated':'2015-01-06',
			'description':'Mixin methods for datas input validation feature for containers.'
		}
	};
	
	
	/**
	 * @mixin				DevaptMixinInputValidationClass
	 * @public
	 * @desc				Mixin of methods for datas form feature for containers
	 */
	var DevaptMixinInputValidationClass = new DevaptClass('DevaptMixinInputValidation', null, class_settings);
	
	// METHODS
	DevaptMixinInputValidationClass.add_public_method('validate_input', {}, DevaptMixinInputValidation.validate_input);
	
	// BUILD MIXIN CLASS
	DevaptMixinInputValidationClass.build_class();
	
	
	return DevaptMixinInputValidationClass;
}
);