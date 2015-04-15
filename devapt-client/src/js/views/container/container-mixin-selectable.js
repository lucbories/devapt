/**
 * @file        view/container/container-mixin-selectable.js
 * @desc        View mixin class for SELECT/UNSELECT operations
 * 				
 * 				Process:
 * 					A view V detects the selection of one or more of its items.
 * 					V call V.select(item index or item labek or item record) for each selected items.
 * 					promise = V.select(args)
 * 						--> V.view_model.ready_promise.select(args) : promise
 * 							--> view_model.select_index(index) or select_label(label) or select_record(record) : promise
 * 					
 *              API:
 *  				Selected item object:
 *  					{ index:..., node_jqo:..., record:..., label:..., already_selected:... }
 *  				
 *                  ->constructor(object)     : nothing
 *  
 *                  ->select(args)            : Do action on items selection (args is one ore more indices or records or labels)
 *                  ->select_all()            : All view records are selected into the View object
 *                  ->unselect(ars)           : Do action on items unselection (args is one ore more indices or records or labels)
 *                  ->unselect_all()          : All view records are unselected into the View object
 *  			
 *  			PRIVATE API:
 *  				->cb_select_items(self,array)               : loop on items, get selected item object, call select_item(obj) for each one.
 *  				->cb_select_item(self,selected object)      : call view model select and call view select
 *  			
 * @ingroup     DEVAPT_VIEWS
 * @date        2015-02-08
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define([
	'Devapt', 'core/types',
	'object/class', 'object/object',
	'views/container/container-mixin-lookupable'
	],
function(
	Devapt, DevaptTypes,
	DevaptClass, DevaptObject,
	DevaptContainerMixinLookupable)
{
	/**
	 * @public
	 * @class				DevaptContainerMixinSelectable
	 * @desc				View mixin class for SELECT/UNSELECT operations
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptContainerMixinSelectable
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
	 * @memberof				DevaptContainerMixinSelectable
	 * @public
	 * @method					DevaptContainerMixinSelectable.select(args)
	 * @desc					Select one or more records into the view with args is one ore more indices or records or labels
	 * @param {object|array|integer|string}	arg_selection			one or more selected items record, label or index
	 * @return {object}			Promise of the operation
	 */
	var cb_select = function (arg_selection)
	{
		var self = this;
		var context = 'select(array|object|label|index)';
		self.enter(context, '');
		
		
		// INIT
		var promise = null;
		
		// CREATE AN ARRAY
		if ( ! DevaptTypes.is_array(arg_selection) )
		{
			arg_selection = [arg_selection];
		}
		
		// SELECT OPERATIONS ON ITEMS ARRAY
		if ( DevaptTypes.is_array(arg_selection) )
		{
			self.step(context, 'selected items is an array');
			
			promise = self.view_model.get('ready_promise').then(
				function()
				{
					self.step(context, 'view_model is ready');
					try
					{
						return self.select_items(arg_selection);
					}
					catch(e)
					{
						console.error(e, context);
					}
				}
			);
		}
		else
		{
			promise = Devapt.promise_rejected('nothing to select');
		}
		
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @private
	 * @method					cb_select_items(args)
	 * @desc					Select one or more records into the view with args is one ore more indices or records or labels
	 * @param {array}			arg_selection	selected items array (record, label or index)
	 * @return {object}			Promise of the operation with selected items attributes
	 */
	var cb_select_items = function (arg_selection)
	{
		var self = this;
		var context = 'select_items(args)';
		self.enter(context, '');
		
		
		// DEBUG
		// console.log('arg_selection', arg_selection);
		
		// NORMALIZE ITEMS
		self.step(context, 'NORMALIZE ITEMS');
		var selected_items = [];
		var selected_items_promises = [];
		for(var selected_index in arg_selection)
		{
			self.value(context, 'loop on selected_index', selected_index);
			
			var selected_value = arg_selection[selected_index];
			var selected_item_promise = null;
			
			// FIELD EDITOR
			if (self.items_iterator === 'field_editor')
			{
				self.step(context, 'VIEW IS A VIEW EDITOR');
				
				// REMOVE PREVIOUS SELECTED ITEM
				self.step(context, 'remove all css selected');
				self.remove_items_css_class('selected');
				
				// GET ITEMS PROMISE
				self.step(context, 'GET ITEMS PROMISE');
				var items_promise = self.view_model.get('ready_promise').invoke('get_items_array_model_with_iterator_records');
				selected_item_promise = items_promise.then(
					function(recordset)
					{
						try
						{
							self.step(context, 'ITEMS ARE FOUND');
							
							// GET ALL ITEMS
							self.step(context, 'GET ALL ITEMS');
							var items_records = recordset.get_records();
							var items_records_count = recordset.get_count();
							self.value(context, 'items_records', items_records);
							self.value(context, 'items_records_count', items_records_count);
							
							// GET SELECTION FIELD NAME
							self.step(context, 'GET SELECTION FIELD NAME');
							var field_name = self.items_fields[0];
							self.assert_not_null(context, 'field_name', field_name);
							self.value(context, 'field_name', field_name);
							
							// LOOP ON ITEMS RECORDS
							self.step(context, 'LOOP ON ITEMS RECORDS');
							var all_selected_promise = [];
							for(var values_index = 0 ; values_index < items_records_count ; values_index++)
							{
								self.value(context, 'loop on values index', values_index);
								var loop_value_record = items_records[values_index];
								var loop_value_field = loop_value_record[field_name];
								self.value(context, 'loop on value for field name', loop_value_field);
								var node_by_label_promise = self.get_select_item_by_label(loop_value_field);
								all_selected_promise.push(node_by_label_promise);
							}
							
							return Devapt.promise_all(all_selected_promise);
						}
						catch(e)
						{
							console.error(context, e);
							return e;
						}
					}
				);
			}
			// GET SELECTED ITEM BY ITS INDEX
			else if ( DevaptTypes.to_integer(selected_value, -1) >= 0 )
			{
				self.value(context, 'selected_value is integer', selected_value);
				selected_item_promise = self.get_select_item_by_index(selected_value);
			}
			
			// GET SELECTED ITEM BY ITS LABEL
			else if ( DevaptTypes.is_string(selected_value) )
			{
				self.value(context, 'selected_value is string', selected_value);
				selected_item_promise = self.get_select_item_by_label(selected_value);
			}
			
			// GET SELECTED ITEM BY ITS RECORD
			else if ( DevaptTypes.is_object(selected_value) )
			{
				self.value(context, 'selected_value is object', selected_value);
				selected_item_promise = self.get_select_item_by_record(selected_value); // RETURNS A PROMISE ?
			}
			
			// CHECK AND APPEND SELECTED ITEM
			// console.log(selected_items, context + ':CHECK AND APPEND SELECTED ITEM');
			if (selected_item_promise)
			{
				self.step(context, 'selected_value promise is valid');
				
				var selected_item_added_promise = selected_item_promise.then(
					function(selected_item)
					{
						self.step(context, 'selected_value is added');
						if ( DevaptTypes.is_array(selected_item) )
						{
							for(var index in selected_item)
							{
								selected_items.push( selected_item[index] );
							}
						}
						else
						{
							selected_items.push(selected_item);
						}
					}
				);
				selected_items_promises.push(selected_item_added_promise);
			}
			else
			{
				self.error(context, 'selected item not found');
				self.value(context, 'selected value', selected_value);
			}
		}
		
		
		// CHECK VIEW MODEL PROMISE AND SELECTED VALUES
		// console.log(selected_items, context + ':CHECK VIEW MODEL PROMISE AND SELECTED VALUES');
		if ( ! self.view_model || ! self.view_model.then || selected_items_promises.length === 0)
		{
			self.step(context, 'view_model and selected_items_promises doesn t exist');
			promise = Devapt.promise_rejected(context + ':nothing to select');
			
			self.leave(context, Devapt.msg_failure_promise);
			return promise;
		}
		
		
		// DO SELECT OPERATION ON VIEW MODEL
		selected_items_promises.push(self.view_model);
		var selected_items_resolved_promise = Devapt.promise_all(selected_items_promises);
		var promise = selected_items_resolved_promise.then(
			function()
			{
				self.step(context, 'view_model and selected_items exist');
				return self.view_model.get('ready_promise').then(
					function(view_model)
					{
						self.step(context, 'view_model is ready');
						
						// REMOVE PREVIOUS SELECTED ITEM
						if (! self.has_multiple_selection)
						{
							self.step(context, 'remove all css selected');
							self.remove_items_css_class('selected');
						}
						
						
						// PROCESS VIEW MODEL SELECT OPERATIONS
						self.step(context, 'PROCESS VIEW MODEL SELECT OPERATIONS');
						// console.log(selected_items, context + ':PROCESS VIEW MODEL SELECT OPERATIONS');
						
						// var view_model_promise = self.view_model.invoke('select', selected_items);
						var view_model_promise = view_model.select(selected_items);
						
						
						// PROCESS VIEW OPERATIONS
						self.step(context, 'PROCESS VIEW OPERATIONS');
						view_model_promise.then(
							function(valid_selected_items)
							{
								self.step(context, 'PROCESS VIEW OPERATIONS: promise is resolved');
								// console.log(selected_items, context + ':PROCESS VIEW OPERATIONS');
								
								for(var selected_index in valid_selected_items)
								{
									var selected_item = valid_selected_items[selected_index];
									self.value(context, 'loop on selected item at [' + selected_index + ']', selected_item);
									
									self.select_item(selected_item);
								}
							}
						);
						
						return view_model_promise;
					}
				);
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	};
	
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @private
	 * @method					cb_select_item(item)
	 * @desc					Select an item
	 * @param {integer}			arg_selected_item	A selected item record { index:..., node_jqo:..., record:..., label:..., already_selected:... }
	 * @return {nothing}			
	 */
	var cb_select_item = function (arg_selected_item)
	{
		var self = this;
		var context = 'select_item(item)';
		self.enter(context, '');
		
		
		// DEBUG
		// console.log(arg_selected_item, 'arg_selected_item');
		// console.log(arg_selected_item.node_jqo, 'arg_selected_item.node_jqo');
		
		// ENABLE SELECTED NODE
		self.step(context, 'toggle css class "selected"');
		self.toggle_item_node_css_class(arg_selected_item.node_jqo, 'selected');
		
		// SEND EVENT
		if (arg_selected_item.already_selected)
		{
			self.step(context, 'fire event "unselected"');
			self.fire_event('devapt.events.container.unselected', [arg_selected_item]);
		}
		else
		{
			self.step(context, 'fire event "...selected"');
			self.fire_event('devapt.events.container.selected', [arg_selected_item]);
		}
		
		
		self.leave(context, Devapt.msg_success);
	};
	
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @public
	 * @method					DevaptContainerMixinSelectable.select_all(records)
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
	 * @memberof				DevaptContainerMixinSelectable
	 * @public
	 * @method					DevaptContainerMixinSelectable.unselect(records)
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
	 * @memberof				DevaptContainerMixinSelectable
	 * @public
	 * @method					DevaptContainerMixinSelectable.unselect_all()
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
			updated:'2015-03-06',
			description:'Mixin for SELECT/UNSELECT operation on a view.'
		},
		mixins:[DevaptContainerMixinLookupable]
	};
	var parent_class = null;
	var DevaptContainerMixinSelectableClass = new DevaptClass('DevaptContainerMixinSelectable', parent_class, class_settings);
	
	
	// METHODS
	DevaptContainerMixinSelectableClass.infos.ctor = cb_constructor;
	
	DevaptContainerMixinSelectableClass.add_public_method('select', { description:'Select one or more records into the view with args is one ore more indices or records or labels'}, cb_select);
	DevaptContainerMixinSelectableClass.add_public_method('select_items', { description:'Select one or more records into the view with args is one ore more indices or records or labels' }, cb_select_items);
	DevaptContainerMixinSelectableClass.add_public_method('select_item', { description:'' }, cb_select_item);
	// DevaptContainerMixinSelectableClass.add_public_method('get_select_item_by_index', {}, cb_get_select_item_by_index);
	// DevaptContainerMixinSelectableClass.add_public_method('get_select_item_by_label', {}, cb_get_select_item_by_label);
	// DevaptContainerMixinSelectableClass.add_public_method('get_select_item_by_record', {}, cb_get_select_item_by_record);
	
	DevaptContainerMixinSelectableClass.add_public_method('select_all', {}, cb_select_all);
	
	DevaptContainerMixinSelectableClass.add_public_method('unselect', {}, cb_unselect);
	DevaptContainerMixinSelectableClass.add_public_method('unselect_all', {}, cb_unselect_all);
	
	
	// PROPERTIES
	
	// BUILD CLASS
	DevaptContainerMixinSelectableClass.build_class();
	
	
	return DevaptContainerMixinSelectableClass;
} );