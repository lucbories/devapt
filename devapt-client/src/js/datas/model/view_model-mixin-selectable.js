/**
 * @file        datas/model/view_model-mixin-selectable.js
 * @desc        ModelView mixin class for SELECT/UNSELECT operations
 * 				
 * 				Process:
 * 					A view V detects the selection of one or more of its items.
 * 					V call V.select(item index or item labek or item record) for each selected items.
 * 					promise = V.select(args)
 * 						--> V.view_model.ready_promise.select(args) : promise
 * 							--> view_model.select_index(index) or select_label(label) or select_record(record) : promise
 * 					
 *              API:
 *                  ->constructor(object)     : nothing
 *  
 *                  ->select(records)         : Given records are selected into the View object
 *                  ->select_all()            : All view records are selected into the View object
 *                  ->unselect(records)       : Given records are unselected into the View object
 *                  ->unselect_all()          : All view records are unselected into the View object
 *  
 * @ingroup     DEVAPT_DATAS
 * @date        2015-02-08
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define([
	'Devapt', 'core/types',
	'object/class', 'object/object'
	],
function(
	Devapt, DevaptTypes,
	DevaptClass, DevaptObject)
{
	/**
	 * @public
	 * @class				DevaptViewModelMixinSelectable
	 * @desc				ModelView mixin class for SELECT/UNSELECT operations
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptViewModelMixinSelectable
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// CONSTRUCTOR BEGIN
		var context = 'constructor';
		self.enter(context, '');
		
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	};
	
	
	
	/* --------------------------------------------- SELECT OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptViewModelMixinSelectable
	 * @public
	 * @method					DevaptViewModelMixinSelectable.select(items)
	 * @desc					Select one or more records into the view
	 * @param {array}			arg_selected_items		selected items array (record or label or index)
	 * @return {object}			Promise of the operation
	 */
	var cb_select = function (arg_selected_items)
	{
		var self = this;
		var context = 'select(items)';
		self.enter(context, (arg_selected_items ? arg_selected_items.length : 0) + ' items');
		
		
		// LOOP ON SELECTED ITEMS
		// var promise = self.ready_promise.then(
			// function()
			// {
				// self.step(context, 'on ready');
				
				// self.view.select(arg_selected_items);
				/*
				// LOOP ON ITEMS
				for(var selected_item_index in arg_selected_items)
				{
					self.step(context, 'loop on selected item at [' + selected_item_index + ']');
					
					var selected_item = arg_selected_items[selected_item_index];
					self.value(context, 'selected_item', selected_item);
					
					// SET CURRENT RECORD
					self.items_current_record = selected_item;
					
					// SELECT ITEM
					self.view.select();
				}*/
			// }
		// );
		
		
		self.leave(context, '');
		return Devapt.promise_resolved(arg_selected_items);
	};
	
	
	/**
	 * @memberof				DevaptViewModelMixinSelectable
	 * @public
	 * @method					DevaptViewModelMixinSelectable.select_all(records)
	 * @desc					Select all records into the view
	 * @return {object}			Promise of the operation
	 */
	var cb_select_all = function ()
	{
		var self = this;
		self.enter('select_all()', '');
		self.assert_object(context, 'model', self.model);
		
		// var promise = model.read(self.query);
		
		self.leave('select_all()', '');
		// return promise;
	};
	/**
	 * @memberof				DevaptViewModelMixinSelectable
	 * @public
	 * @method					DevaptViewModelMixinSelectable.unselect(records)
	 * @desc					Unselect one or more records into the view
	 * @param {object|array}	arg_records			one record object or an array of objects
	 * @return {object}			Promise of the operation
	 */
	var cb_unselect = function (arg_records)
	{
		var self = this;
		self.enter('unselect()', '');
		self.assert_object(context, 'model', self.model);
		
		// var promise = model.read(self.query);
		
		self.leave('unselect()', '');
		// return promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModelMixinSelectable
	 * @public
	 * @method					DevaptViewModelMixinSelectable.unselect_all()
	 * @desc					Unelect all records into the view
	 * @return {object}			Promise of the operation
	 */
	var cb_unselect_all = function ()
	{
		var self = this;
		self.enter('unselect_all()', '');
		self.assert_object(context, 'model', self.model);
		
		// var promise = model.read(self.query);
		
		self.leave('unselect_all()', '');
		// return promise;
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-02-02',
			updated:'2015-02-08',
			description:'Mixin for SELECT/UNSELECT operation on a model view.'
		}
	};
	var parent_class = null;
	var DevaptViewModelMixinSelectableClass = new DevaptClass('DevaptViewModelMixinSelectable', parent_class, class_settings);
	
	
	// METHODS
	DevaptViewModelMixinSelectableClass.infos.ctor = cb_constructor;
	
	DevaptViewModelMixinSelectableClass.add_public_method('select', {}, cb_select);
	DevaptViewModelMixinSelectableClass.add_public_method('select_all', {}, cb_select_all);
	DevaptViewModelMixinSelectableClass.add_public_method('unselect', {}, cb_unselect);
	DevaptViewModelMixinSelectableClass.add_public_method('unselect_all', {}, cb_unselect_all);
	
	
	// PROPERTIES
	
	
	return DevaptViewModelMixinSelectableClass;
} );