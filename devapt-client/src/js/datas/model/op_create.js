/**
 * @file        datas/model/op_create.js
 * @desc        Create do/undo operation
 *              API:
 *                  ->constructor(object)     : nothing
 *  
 *                  ->do()                    : do the operation
 *                  ->undo()                  : undo the operation
 *  
 * @ingroup     DEVAPT_DATAS
 * @date        2015-02-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['Devapt', 'core/types', 'object/class', 'object/object'],
function(Devapt, DevaptTypes, DevaptClass, DevaptObject)
{
	/**
	 * @public
	 * @class				DevaptOperation
	 * @desc				Do/undo operation
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptOperation
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// CONSTRUCTOR BEGIN
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// DEBUG
		// self.trace=true;
		
		// SET STATE
		self.state = {
			created:false,
			deleted:false,
			create_promise:null,
			delete_promise:null,
			record_to_create: self.record
		};
		
		// SET DO
		self.do_cb = function()
		{
			if (self.state.created || (self.state.deleted && ! self.state.delete_promise) )
			{
				return null;
			}
			
			if (self.state.delete_promise)
			{
				self.state.create_promise = self.state.delete_promise.then(
					function()
					{
						return self.model.create(self.state.record_to_create);
					}
				);
			}
			else
			{
				self.state.create_promise = self.model.create(self.state.record_to_create);
			}
			
			self.state.create_promise.then(
				function(resultset)
				{
					self.state.created_record = resultset.record;
				}
			);
			
			self.state.created = true;
			self.state.deleted = true;
			
			return self.state.create_promise;
		};
		
		// SET DO
		self.undo_cb = function()
		{
			if (self.state.deleted || ! self.state.created || ! self.state.create_promise || ! self.state.created_record)
			{
				return null;
			}
			
			self.state.delete_promise = self.state.create_promise.then(
				function()
				{
					return self.model.delete(self.state.created_record);
				}
			);
			
			self.state.created = false;
			self.state.deleted = true;
			self.state.created_record = null;
			
			return self.state.delete_promise;
		};
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-02-02',
			updated:'2015-02-02',
			description:'Do/undo create operation'
		}
	};
	var parent_class = DevaptObject;
	var DevaptOperationClass = new DevaptClass('DevaptOperation', parent_class, class_settings);
	
	// METHODS
	DevaptOperationClass.infos.ctor = cb_constructor;
	
	// MIXINS
	
	// PROPERTIES
	DevaptOperationClass.add_public_object_property('model', 'model for operation', null, true, false, []);
	DevaptOperationClass.add_public_object_property('record', 'record for operation', null, true, false, []);
	
	
	return DevaptOperationClass;
} );