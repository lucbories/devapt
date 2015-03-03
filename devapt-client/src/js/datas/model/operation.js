/**
 * @file        datas/model/operation.js
 * @desc        Do / undo operation
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
		
		
		// self.trace=true;
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	};
	
	
	
	/**
	 * @memberof				DevaptOperation
	 * @public
	 * @method					DevaptOperation.do()
	 * @desc					Do the operation
	 * @return {object}			Promise of the operation
	 */
	var cb_do = function ()
	{
		var self = this;
		self.assert_callback(context, 'do_cb', self.do_cb);
		self.assert_not_empty_object(context, 'state', self.state);
		
		var result = self.do_callback(do_cb, self.state);
		
		if ( Devapt.is_promise(result) )
		{
			return result;
		}
		
		if ( DevaptTypes.is_null(result) )
		{
			return Devapt.promise_rejected(result);
		}
		
		return Devapt.promise_resolved(result);
	};
	
	
	/**
	 * @memberof				DevaptOperation
	 * @public
	 * @method					DevaptOperation.undo()
	 * @desc					Undo the operation
	 * @return {object}			Promise of the operation
	 */
	var cb_undo = function ()
	{
		var self = this;
		self.assert_callback(context, 'do_uncb', self.do_cb);
		self.assert_not_empty_object(context, 'state', self.state);
		
		var result = self.do_callback(undo_cb, self.state);
		
		if ( Devapt.is_promise(result) )
		{
			return result;
		}
		
		if ( DevaptTypes.is_null(result) )
		{
			return Devapt.promise_rejected(result);
		}
		
		return Devapt.promise_resolved(result);
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-02-02',
			updated:'2015-02-02',
			description:'Do / undo operation'
		}
	};
	var parent_class = DevaptObject;
	var DevaptOperationClass = new DevaptClass('DevaptOperation', parent_class, class_settings);
	
	// METHODS
	DevaptOperationClass.infos.ctor = cb_constructor;
	DevaptOperationClass.add_public_method('do', {}, cb_do);
	DevaptOperationClass.add_public_method('undo', {}, cb_undo);
	
	// MIXINS
	
	// PROPERTIES
	DevaptOperationClass.add_public_bool_property('is_operation', 'object is an operation', true, false, true, []);
	
	DevaptOperationClass.add_public_object_property('state', 'operation state object', null, false, true, []);
	
	DevaptOperationClass.add_public_cb_property('do_cb', 'do callback', null, false, true, []);
	DevaptOperationClass.add_public_cb_property('undo_cb', 'undo callback', null, false, true, []);
	
	
	return DevaptOperationClass;
} );