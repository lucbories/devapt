/**
 * @file        datas/mixin-status.js
 * @desc        Mixin for resources data source
 *              API:
 *                  ->constructor()         : nothing
 *  
 *                  ->get_status()            : string
 *                  ->set_status(status)      : nothing
 *  				
 *                  ->get_error()             : string
 *                  ->set_error(error)        : nothing
 *  				
 *                  ->set_ok()                : nothing
 *  				
 *                  ->is_valid()              : boolean (query, model, view, records are valid object and status is 'ok')
 *                  ->is_ok()                 : boolean (status is 'ok')
 *                  ->is_error()              : boolean (status is 'error')
 *  			
 * @see			...
 * @ingroup     DEVAPT_CORE
 * @date        2015-02-05
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
	 * @mixin				DevaptMixinStatus
	 * @public
	 * @desc				Mixin for status and error
	 */
	var DevaptMixinStatus = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinStatus
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		init_mixin_status: function(self)
		{
			// var self = this;
			var context = 'init_mixin_status()';
			self.enter(context, '');
			
			
			
			self.leave(context, Devapt.msg_success);
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinStatus
		 * @desc				Get status
		 * @return {nothing}
		 */
		get_status: function()
		{
			var self = this;
			var context = 'get_status()';
			self.enter(context, '');
			
			
			self.leave(context, Devapt.msg_success);
			return self.status;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinStatus
		 * @desc				Set status
		 * @param{string}		arg_status		new status
		 * @return {nothing}
		 */
		set_status: function(arg_status)
		{
			var self = this;
			var context = 'set_status(status)';
			self.enter(context, '');
			
			self.status = arg_status;
			
			self.leave(context, Devapt.msg_success);
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinStatus
		 * @desc				Get error
		 * @return {nothing}
		 */
		get_error: function()
		{
			var self = this;
			var context = 'get_error()';
			self.enter(context, '');
			
			
			self.leave(context, Devapt.msg_success);
			return self.error_msg;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinStatus
		 * @desc				Set error status
		 * @param{string}		arg_error		new error
		 * @return {nothing}
		 */
		set_error: function(arg_error)
		{
			var self = this;
			var context = 'set_error(error)';
			self.enter(context, '');
			
			self.status = 'error';
			self.error_msg = arg_error;
			
			self.leave(context, Devapt.msg_success);
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinStatus
		 * @desc				Set ok status
		 * @return {nothing}
		 */
		set_ok: function()
		{
			var self = this;
			var context = 'set_ok()';
			self.enter(context, '');
			
			self.status = 'ok';
			self.error_msg = null;
			
			self.leave(context, Devapt.msg_success);
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinStatus
		 * @desc				Is valid
		 * @return {boolean}
		 */
		is_valid: function()
		{
			var self = this;
			var context = 'is_valid()';
			self.enter(context, '');
			
			switch(self.status)
			{
				case 'ok':
					self.leave(context, Devapt.msg_success);
					return self.error_msg === null;
				
				case 'error':
					self.leave(context, Devapt.msg_success);
					return self.error_msg !== null;
			}
			
			self.leave(context, Devapt.msg_success);
			return false;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinStatus
		 * @desc				Is ok
		 * @return {boolean}
		 */
		is_ok: function()
		{
			var self = this;
			var context = 'is_ok()';
			self.enter(context, '');
			
			self.leave(context, Devapt.msg_success);
			return self.status === 'ok';
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinStatus
		 * @desc				Is error
		 * @return {boolean}
		 */
		is_error: function()
		{
			var self = this;
			var context = 'is_error()';
			self.enter(context, '');
			
			self.leave(context, Devapt.msg_success);
			return self.status === 'error';
		}
	};
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-02-05',
			'updated':'2015-02-05',
			'description':'Mixin methods for status of object.'
		}
	};
	
	// CREATE CLASS
	var DevaptMixinStatusClass = new DevaptClass('DevaptMixinStatus', null, class_settings);
	
	// METHODS
	DevaptMixinStatusClass.infos.ctor = DevaptMixinStatus.init_mixin_status;
	
	DevaptMixinStatusClass.add_public_method('get_status', {}, DevaptMixinStatus.get_status);
	DevaptMixinStatusClass.add_public_method('set_status', {}, DevaptMixinStatus.set_status);
	
	DevaptMixinStatusClass.add_public_method('get_error', {}, DevaptMixinStatus.get_error);
	DevaptMixinStatusClass.add_public_method('set_error', {}, DevaptMixinStatus.set_error);
	
	DevaptMixinStatusClass.add_public_method('set_ok', {}, DevaptMixinStatus.set_ok);
	
	DevaptMixinStatusClass.add_public_method('is_valid', {}, DevaptMixinStatus.is_valid);
	DevaptMixinStatusClass.add_public_method('is_ok', {}, DevaptMixinStatus.is_ok);
	DevaptMixinStatusClass.add_public_method('is_error', {}, DevaptMixinStatus.is_error);
	
	// PROPERTIES
	DevaptMixinStatusClass.add_public_str_property('status', 'object status', null, false, true, []);
	DevaptMixinStatusClass.add_public_str_property('error_msg', 'object error message', null, false, true, []);
	
	// BUILD CLASS
	DevaptMixinStatusClass.build_class();
	
	
	return DevaptMixinStatusClass;
}
);