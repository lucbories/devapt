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
 *  				->cb_get_select_item_by_index(self,index)   : get a selected item object from an index
 *  				->cb_get_select_item_by_label(self,label)   : get a selected item object from a label
 *  				->cb_get_select_item_by_record(self,record) : get a selected item object from a record
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
					self.step(context, 'on ready');
					try
					{
						return cb_select_items(self, arg_selection);
					} catch(e)
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
		
		
		self.leave(context, '');
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @private
	 * @method					cb_select_items(args)
	 * @desc					Select one or more records into the view with args is one ore more indices or records or labels
	 * @param {object}			self			view object
	 * @param {array}			arg_selection	selected items array (record, label or index)
	 * @return {object}			Promise of the operation with selected items attributes
	 */
	var cb_select_items = function (self, arg_selection)
	{
		var context = 'cb_select_items(args)';
		self.enter(context, '');
		
		
		// DEBUG
		console.log(arg_selection, 'arg_selection');
		
		
		// NORMALIZE ITEMS
		self.step(context, 'NORMALIZE ITEMS');
		var selected_items = [];
		for(var selected_index in arg_selection)
		{
			self.value(context, 'loop on selected_index', selected_index);
			
			var selected_value = arg_selection[selected_index];
			var selected_item = null;
			
			// GET SELECTED ITEM BY ITS INDEX
			if ( DevaptTypes.to_integer(selected_value, -1) >= 0 )
			{
				self.value(context, 'selected_value is integer', selected_value);
				selected_item = cb_get_select_item_by_index(self, selected_value);
			}
			
			// GET SELECTED ITEM BY ITS LABEL
			else if ( DevaptTypes.is_string(selected_value) )
			{
				self.value(context, 'selected_value is string', selected_value);
				selected_item = cb_get_select_item_by_label(self, selected_value);
			}
			
			// GET SELECTED ITEM BY ITS RECORD
			else if ( DevaptTypes.is_object(selected_value) )
			{
				self.value(context, 'selected_value is object', selected_value);
				selected_item = cb_get_select_item_by_record(self, selected_value); // RETURNS A PROMISE ?
			}
			
			// CHECK AND APPEND SELECTED ITEM
			if (selected_item)
			{
				self.step(context, 'selected_value is valid');
				selected_items.push(selected_item);
			}
			else
			{
				self.error(context, 'selected item not found');
				self.value(context, 'selected item', selected_item);
			}
		}
		
		
		// DO SELECT OPERATION ON VIEW MODEL
		var promise = null;
		if (self.view_model && self.view_model.then && selected_items.length > 0)
		{
			self.step(context, 'view_model and selected_items exist');
			promise = self.view_model.get('ready_promise').then(
				function()
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
					
					var view_model_promise = self.view_model.invoke('select', selected_items);
					
					
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
								
								cb_select_item(self, selected_item);
							}
						}
					);
					
					return view_model_promise;
				}
			);
		}
		else
		{
			self.step(context, 'view_model and selected_items doesn t exist');
			promise = Devapt.promise_rejected(context + ':nothing to select');
		}
		
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	};
	
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @private
	 * @method					cb_get_select_item_by_index(view object, index)
	 * @desc					Select one item by its index
	 * @param {object}			self				view object
	 * @param {integer}			arg_selected_item	A selected item record { index:..., node_jqo:..., record:..., label:..., already_selected:... }
	 * @return {nothing}			
	 */
	var cb_select_item = function (self, arg_selected_item)
	{
		// var self = this;
		var context = 'cb_select_item(self,item)';
		self.enter(context, '');
		
		
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
	 * @private
	 * @method					cb_get_select_item_by_index(view object, index)
	 * @desc					Get selected item attributes by its index
	 * @param {object}			self			view object
	 * @param {integer}			arg_index		selected item index
	 * @return {object}			A selected item record { index:..., node_jqo:..., record:..., label:..., already_selected:... }
	 */
	var cb_get_select_item_by_index = function (self, arg_index)
	{
		// var self = this;
		var context = 'cb_get_select_item_by_index(self, index)';
		self.enter(context, arg_index);
		
		
		// INIT SELECTED ITEM
		var selected_item = { index:arg_index, node_jqo:null, record:null, label:null, already_selected:false };
		
		
		// GET SELECTED INDEX
		
		
		// GET SELECTED JQUERY NODE WITH GIVEN INDEX
		self.step(context, 'get selected jQuery node');
		selected_item.node_jqo = self.items_objects[arg_index].node;
		if ( ! selected_item.node_jqo)
		{
			self.error(context + ':node not found');
			self.leave(context, Devapt.msg_failure);
			return null;
		}
		// console.log(selected_item.node_jqo, context + ':node_jqo [' + self.name + '] at index [' + arg_index + ']');
		
		
		// WAS SELECTED
		self.step(context, 'get already selected');
		selected_item.already_selected = self.has_item_node_css_class(selected_item.node_jqo, 'selected');
		
		
		// GET SELECTED LABEL
		self.step(context, 'get selected label');
		selected_item.label = self.get_item_node_text(selected_item.node_jqo);
		// console.log(selected_item.label, context + '.label');
		
		// GET SELECTED RECORD
		self.step(context, 'get selected record');
		selected_item.record = self.items_records[selected_item.index]; // TODO self.get_record_at(index)
		// console.log(selected_item.record, context + '.record');
		
		
		self.leave(context, Devapt.msg_success);
		return selected_item;
	};
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @private
	 * @method					cb_get_select_item_by_label(view object, label)
	 * @desc					Get selected item attributes by its index
	 * @param {object}			self			view object
	 * @param {string}			arg_label		selected item node label
	 * @return {object}			A selected item record { index:..., node_jqo:..., record:..., label:... }
	 */
	var cb_get_select_item_by_label = function (self, arg_label)
	{
		// var self = this;
		var context = 'cb_get_select_item_by_label(self, label)';
		self.enter(context, arg_label);
		
		
		// INIT SELECTED ITEM
		var selected_item = { index:null, node_jqo:null, record:null, label:null, already_selected:false };
		
		
		// GET SELECTED JQUERY NODE WITH GIVEN LABEL
		self.step(context, 'get selected jQuery node');
		selected_item.node_jqo = self.get_node_by_content(arg_label);
		if ( ! selected_item.node_jqo)
		{
			self.error(context + ':node not found');
			self.leave(context, Devapt.msg_failure);
			return null;
		}
		// console.log(selected_item.node_jqo, context + ':node_jqo [' + self.name + '] with label [' + arg_label + ']');
		
		
		// GET SELECTED INDEX
		try
		{
			selected_item.index = parseInt( selected_item.node_jqo.index() );
		}
		catch(e)
		{
			self.error(context + ':bad node index');
			self.leave(context, Devapt.msg_failure);
			return null;
		}
		
		
		// WAS SELECTED
		self.step(context, 'get already selected');
		selected_item.already_selected = self.has_item_node_css_class(selected_item.node_jqo, 'selected');
		
		
		// GET SELECTED LABEL
		self.step(context, 'get selected label');
		selected_item.label = arg_label;
		// console.log(selected_item.label, context + '.label');
		
		
		// GET SELECTED RECORD
		self.step(context, 'get selected record');
		selected_item.record = self.items_records[selected_item.index]; // TODO self.get_record_at(index)
		// console.log(selected_item.record, context + '.record');
		
		
		self.leave(context, Devapt.msg_success);
		return selected_item;
	};
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @private
	 * @method					cb_get_select_item_by_record(view object, record)
	 * @desc					Get selected item attributes by its record
	 * @param {object}			self			view object
	 * @param {object}			arg_record		selected item node record
	 * @return {object}			A selected item record { index:..., node_jqo:..., record:..., label:... }
	 */
	var cb_get_select_item_by_record = function (self, arg_record)
	{
		// var self = this;
		var context = 'cb_get_select_item_by_record(self, record)';
		self.enter(context, '');
		
		
		// INIT SELECTED ITEM
		var selected_item = { index:null, node_jqo:null, record:null, label:null, already_selected:false };
		
		// GET ITEMS PROMISE
		var items_promise = (model_promise);
		
		self.view_model.invoke('read').then(
			function(recordset)
			{
				self.step(context, 'items are found');
				// console.log(items, context + ':field_editor[' + self.name + ']:items are found');
				
				
				// INIT SELECTED ITEM
				var selected_item = { index:null, node_jqo:null, record:null, label:null, already_selected:false };
				
				
				// GET ALL ITEMS
				var items_records = recordset.get_records_array();
				var items_records_count = recordset.get_count();
				self.value(context, 'items_records', items_records);
				self.value(context, 'items_records_count', items_records_count);
				
				
				// GET FIELD OBJECT
				var field_name = self.items_fields[0];
				self.assert_not_null(context, 'field_name', field_name);
				self.value(context, 'field_name', field_name);
				
				var field_obj_promise = self.view_model.invoke('get_field', field_name);
				if ( ! DevaptTypes.is_object(field_obj) )
				{
					console.error('bad field object', context);
					deferred.reject();
					return null;
				}
				
				
				// LOOP ON FIELD VALUES RECORDS
				field_obj_promise.then(
					function()
					{
						self.step(context, 'loop on field values records');
						for(var values_index = 0 ; values_index < items_records_count ; values_index++)
						{
							self.value(context, 'loop on values indes', values_index);
							var loop_value_record = items_records[values_index];
							
							// LOOP ON SELECTED VALUES
							self.step(context, 'loop on selected records');
							for(var selected_items_index = 0 ; selected_items_index < items.length ; selected_items_index++)
							{
								var loop_selected_record = items[selected_items_index];
								if (loop_value_record[field_name] === loop_selected_record[field_name])
								{
									self.step(context, 'loop records are equals for field[' + field_name + '] with [' + loop_value_record[field_name] + ']');
									var node_jqo = self.get_node_by_index(values_index);
									
									// CHECK NODE
									if (! node_jqo)
									{
										self.leave(context, Devapt.msg_failure);
										// self.pop_trace();
										return null;
									}
									
									// SAVE SELECTION RECORD
									self.items_selected_records[values_index] = loop_selected_record;
									
									var operands_map = {
										field_value:loop_value_record[field_name],
										field_name:field_name
									};
									
									self.select_item_node(values_index, operands_map, false);
								}
							}
						}
					}
				);
				
				return items_promise;
			},
			
			function()
			{
				console.error('items promise failed', context);
			}
		);
		
		
		self.leave(context, Devapt.msg_success);
		return selected_item;
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
			updated:'2015-02-08',
			description:'Mixin for SELECT/UNSELECT operation on a view.'
		}
	};
	var parent_class = null;
	var DevaptContainerMixinSelectableClass = new DevaptClass('DevaptContainerMixinSelectable', parent_class, class_settings);
	
	
	// METHODS
	DevaptContainerMixinSelectableClass.infos.ctor = cb_constructor;
	
	DevaptContainerMixinSelectableClass.add_public_method('select', {}, cb_select);
	DevaptContainerMixinSelectableClass.add_public_method('select_all', {}, cb_select_all);
	DevaptContainerMixinSelectableClass.add_public_method('unselect', {}, cb_unselect);
	DevaptContainerMixinSelectableClass.add_public_method('unselect_all', {}, cb_unselect_all);
	
	
	// PROPERTIES
	
	
	return DevaptContainerMixinSelectableClass;
} );