/**
 * @file        datas/recordset.js
 * @desc        Devapt datas records set class
 * 					- model
 * 					- records
 * @see			datas/field.js
 * @ingroup     DEVAPT_DATAS
 * @date        2014-08-12
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/events', 'core/object'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptEvents, DevaptObject)
{
	/**
	 * @class				DevaptRecordSet
	 * @desc				Records set class constructor
	 * @method				DevaptRecordSet.constructor
	 * @param {string}		arg_name		object name
	 * @param {object|null}	arg_options		associative array of name/value options
	 * @return {nothing}
	 */
	function DevaptRecordSet(arg_name, arg_model, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptObject;
		self.inheritFrom(arg_event_name, arg_options, false);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptRecordSet';
		self.model				= arg_model;
		self.records			= [];
		self.record_format		= 'array'; // array | object
		
		
		/**
		 * @memberof			DevaptRecordSet
		 * @public
		 * @method				DevaptRecordSet.constructor
		 * @desc				Query class constructor
		 * @return {nothing}
		 */
		self.DevaptRecordSet_constructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context				= self.class_name + '(' + arg_name + ')';
			self.enter(context, 'constructor');
			
			
			// INIT OPTIONS
			var init_option_result = DevaptOptions.set_options_values(self, arg_options, false);
			if (! init_option_result)
			{
				self.error(context + ': init options failure');
			}
			
			// CHECK MODEL
			self.assert(context, 'model', DevaptTypes.is_object(self.model));
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		}
		
		
		// CALL CONSTRUCTOR
		self.DevaptRecordSet_constructor();
		
		
		
		/**
		 * @memberof			DevaptRecordSet
		 * @public
		 * @method				DevaptRecordSet.is_valid()
		 * @desc				Test if the records set is valid
		 * @return {boolean}
		 */
		self.is_valid = function()
		{
			var context = 'is_valid()';
			self.enter(context, '');
			
			var result = self.records.every(self.is_valid_record);
			
			self.leave(context, result ? self.msg_success : self.msg_failure);
			return result;
		}
		
		
		
		/**
		 * @memberof			DevaptRecordSet
		 * @public
		 * @method				DevaptRecordSet.is_valid()
		 * @desc				Test if the records set is valid
		 * @param {object}		arg_record		a record object
		 * @return {boolean}
		 */
		self.is_valid_record = function(arg_record)
		{
			var context = 'is_valid_record(record)';
			self.enter(context, '');
			
			
			self.assertObjectSize(context, record, arg_record, self.model.fields.length, self.model.fields.length);
			
			for(field_name in self.model.fields)
			{
				var field = self.model.fields[field_name];
				var value = self.record_format === 'object' ? arg_record[field_name] : arg_record[field.index];
				if ( ! field.is_value_valid(value) )
				{
					self.leave(context, self.msg_failure);
					return false;
				}
			}
			
			
			self.leave(context, self.msg_success);
			return true;
		}
		
		
		
		/* --------------------------------------------------------------------------------------------- */
		// APPEND MIXIN METHODS
		// self.register_mixin(DevaptMixinTrace);
		/* --------------------------------------------------------------------------------------------- */
	}
	
	
	// INTROSPECTION : REGISTER CLASS
	DevaptClasses.register_class(DevaptRecordSet, ['DevaptObject'], 'Luc BORIES', '2014-08-12', 'Datas records set class.');
	
	
	// INTROSPECTION : REGISTER OPTIONS
	DevaptOptions.register_array_option(DevaptRecordSet, 'records', [], false, '|', 'String', []);
	
	DevaptOptions.register_obj_option(DevaptRecordSet, 'model',	null, true, []);
	
	// this.pk_field			= null;
	// this.access				= {'create':false,'read':false,'update':false,'delete':false};
	// this.engine				= null;
	// this.is_cached			= false;
	// this.cache_ttl			= null;
	
	// this.using_views		= [];
	
	return DevaptRecordSet;
} );
