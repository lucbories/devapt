/**
 * @file        datas/model/view_model-mixin-selectable.js
 * @desc        ModelView mixin class for SELECT/UNSELECT operations
 * 				
 * 				Process:
 * 					A view V detects the selection of one or more of its items.
 * 					V call V.select(item index or item labek or item record) for each selected items.
 * 					promise = V.select(args)
 * 						selected items = V.get_selected_items(args)
 * 						--> V.view_model.on_container_select(selected items) : promise
 * 							--> V.view_model.(un)select_record(record);
 * 							--> V.on_view_model_select(selected item) : promise
 * 					
 *              MIXIN API:
 *                  ->constructor(object)            : nothing
 *  				
 *                  ->get_selected_records()         : Get current selected records (Array of Record objects)
 *                  ->set_selected_records(records)  : Set current selected records (call select_record on all records) (nothing)
 *                  
 * 					->select_record(record)          : Select a record into the ViewModel object (nothing)
 *                  ->unselect_record(record)        : Unselect a recorsinto the ViewModel object (nothing)
 * 					
 * 					->new_selected_record(record)    : Return the given Record or create a Record object with a given plain object (Record object)
 * 					
 * 					->on_container_select(selected_items)   : React on a container selection change
 * 						foreach(selected_items)
 * 							record = self.get_recordset().get_first_record_by_object(selected_item)
 * 							self.select_record(record) or self.unselect_record(record)
 * 							self.recordset.free_record(record) if needed
 * 							view.on_view_model_select(selected_item) or view.on_view_model_unselect(selected_item)
 * 					->on_container_unselect(selected_items) : React on a container selection change
 * 					
 *                  ->on_container_select_all()      : React on a container full selection change
 *                  ->on_container_unselect_all()    : React on a container full selection change
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
		var context = 'DevaptViewModelMixinSelectable.constructor';
		self.enter(context, '');
		
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	};
	
	
	
	/* --------------------------------------------- SELECTION OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.get_selected_records()
	 * @desc					Get selected records
	 * @return {array}			Array of Records of the ViewModel Recordset
	 */
	var cb_get_selected_records = function ()
	{
		var self = this;
		self.step('get selected records', '');
		return self.selection;
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.set_selected_records(records)
	 * @desc					Set selected records (unselect all previous records)
	 * @param {array}			arg_records		Record array
	 * @return {nothing}
	 */
	var cb_set_selected_records = function (arg_records)
	{
		var self = this;
		var context = 'set_selected_records(records)';
		self.enter(context, '');
		
		
		// CHECK RECORDS
		self.assert_array(context, 'records', arg_records);
		self.assert_array(context, 'self.selection', self.selection);
		
		// UNSELECT ALL RECORDS
		self.selection.forEach(
			function(record)
			{
				record.unselect();
			}
		);
		
		self.selection = [];
		
		var check_record_cb = function(record)
		{
			var check = DevaptTypes.is_object(record) && record.is_record && record.is_valid();
			if (check)
			{
				self.select_record(record);
			}
			return check;
		};
		
		var check_select_records = self.selection.every(check_record_cb);
		self.assert_true(context, 'check and select records', check_select_records);
		
		
		self.leave(context, Devapt.msg_success);
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					self.selected_record(record)
	 * @desc					Select a record
	 * @param {object}			arg_record		a Record object
	 * @return {nothing}
	 */
	var cb_select_record = function (arg_record)
	{
		var self = this;
		var context = 'select_record(record)';
		self.enter(context, '');
		self.assert_object(context, 'record is object', arg_record);
		self.assert_true(context, 'record.is_record', arg_record.is_record && arg_record.is_valid());
//		self.assert_true(context, 'record is part of this recordset?', self.recordset.has_record(arg_record) );
		
		
		/*var promise = self.ready_promise.spread(
			function(arg_model, arg_view)
			{
				self.assert_not_empty_string(context, 'arg_view.items_iterator', arg_view.items_iterator);
				
				switch(arg_view.items_iterator)
				{
					case 'records':
					{
						self.step(context, 'nothing to do for records view iterator');
						break;
					}
					
					case 'fields':
					{
						self.step(context, 'nothing to do for fields view iterator');
						break;
					}
					
					case 'field_editor':
					{
						self.step(context, 'view iterator is field_editor');
						break;
					}
				}
			}
		);*/
		
		arg_record.select();
		self.selection.push(arg_record);
		
		
		self.leave(context, '');
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					self.selected_record(record)
	 * @desc					Select a record
	 * @param {object}			arg_record		a Record object
	 * @return {nothing}
	 */
	var cb_unselect_record = function (arg_record)
	{
		var self = this;
		var context = 'unselect_record(record)';
		self.enter(context, '');
		self.assert_object(context, 'record is object', arg_record);
		self.assert_true(context, 'record.is_record', arg_record.is_record && arg_record.is_valid());
//		self.assert_true(context, 'record is part of this recordset?', self.recordset.has_record(arg_record) );
		
		
		arg_record.unselect();
		
		// REMOVE RECORD FROM SELECTED RECORDS
		var tmp_selection = [];
		for(var index in self.selection)
		{
			var loop_record = self.selection[index];
			if (loop_record.get_id() !== arg_record.get_id())
			{
				tmp_selection.push(loop_record);
			}
		}
		self.selection = tmp_selection;
		
		
		self.leave(context, '');
	};
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.new_selected_record()
	 * @desc					Get selected records
	 * @param {object}			arg_record	given record or selected item
	 * @return {object}			A Record object promise
	 */
	var cb_new_selected_record = function (arg_record)
	{
		var self = this;
//		self.trace=true;
		var context = 'new_selected_record(record)';
		self.enter(context, '');
		self.assert_object(context, 'arg_record', arg_record);
		
		
		// GIVEN RECORD IS A VALID RECORD
		if (arg_record.is_record)
		{
			if ( self.get_recordset().has_record(arg_record) )
			{
				self.leave(context, Devapt.msg_success_promise);
				return Devapt.promise_resolved(arg_record);
			}
			
			arg_record = arg_record.datas;
		}
		
		// DEBUG
//		console.log(self.linked_record, context + ':self.linked_record');
//		console.log(arg_record, context + ':arg_record');
		
		// INIT
		// var record = null;
		
		// LOOKUP FOR RECORD OF GIVEN VALUES OBJECT
		var record_promise = null;
		if (arg_record.is_record)
		{
			record_promise = Devapt.promise_resolved(arg_record);
		}
		else
		{
			var values_promise = self.get_values();
			record_promise = values_promise.then(
				function(values)
				{
	//				self.trace=true;
					self.step(context, 'values are found');
					console.log(values, context + ':values');
					self.value(context, 'values', values);
					
					for(var index=0 ; index < values.length ; ++index)
					{
						self.value(context, 'values index', index);
						
						var loop_record = values[index];
						if (loop_record.is_record)
						{
							self.step(context, 'current value is a Record');
							
							// TEST ID
							var id_field_name = loop_record.recordset.id_field_name;
							if ( loop_record.get_id() == arg_record[id_field_name])
							{
								self.step(context, Devapt.msg_found);
								return Devapt.promise_resolved(loop_record);
							}
							
							// TEST ALL FIELDS
							for(var field_name in arg_record)
							{
								self.value(context, 'field_name', field_name);
								
								var field_value = arg_record[field_name];
								var found = loop_record.has_field_value(field_name, field_value);
								if (found)
								{
									self.step(context, Devapt.msg_found);
									return Devapt.promise_resolved(loop_record);
								}
							}
							
							continue;
						}
						
						self.step(context, 'current value is not a Record');
						
						// TEST ALL FIELDS
						for(var field_name in arg_record)
						{
							self.value(context, 'field_name', field_name);
							
							var loop_field_value = arg_record[field_name];
							var loop_found = (field_name in loop_record) && loop_record[field_name] == loop_field_value;
							if (loop_found)
							{
								self.step(context, Devapt.msg_found);
								var record = self.recordset.get_first_record_by_object(loop_record);
								if (record)
								{
									self.step(context, 'Record found');
									return Devapt.promise_resolved(record);
								}
								
								self.step(context, 'Record not found');
								console.error(loop_record, self.name + '.' + context + ':not found');
								console.log(self.recordset, self.name + '.' + context + ':recordset');
								return Devapt.promise_rejected(record);
							}
						}
					}
					
					self.step(context, Devapt.msg_not_found);
					return Devapt.promise_rejected(arg_record);
				}
			);
		}
		
		// PROCESS FOUND RECORD
		record_promise = record_promise.then(
			function(arg_found_record)
			{
//				self.trace=true;
//				console.log(arg_found_record, context + ':arg_found_record');
				self.assert_object(context, 'found record', arg_found_record);
				
				return self.ready_promise.spread(
					function(arg_model, arg_view)
					{
						self.assert_not_empty_string(context, 'arg_view.items_iterator', arg_view.items_iterator);
						
						switch(arg_view.items_iterator)
						{
							case 'records':
							{
								self.step(context, 'records iterator');
								return arg_found_record;
							}
							
							case 'fields':
							{
								self.step(context, 'fields iterator');
								return arg_found_record;
							}
							
							case 'field_editor':
							{
								self.step(context, 'field_editor iterator');
								
								// CHECK FIELD EDITOR OBJECT
								self.assert_object(context, 'self.edited_field', self.edited_field);
								
				//				var edited_field_name = self.edited_field.name;
								var edited_field_asso = self.edited_field.get_association();
				//				console.log(edited_field_asso, context + ':edited_field_asso');
								
								var datas = self.linked_record.get_datas();
				//				var model = self.recordset.model;
								
				//				var model_pk_field_name = model.get_pk_field().name;
								var asso_id_field_name = edited_field_asso.model.pk_field_name;
								var datas_id_field_name = self.linked_record.recordset.id_field_name;
								var new_record_fields = [datas_id_field_name, asso_id_field_name];
				//				console.log(new_record_fields, context + ':new_record_fields');
								
								
								var new_record = {};
								for(var field_index in new_record_fields)
								{
									var field_name = new_record_fields[field_index];
									var loop_field_value = null;
									
									if ( arg_found_record.has_field(field_name) )
									{
										loop_field_value = arg_found_record.get(field_name);
										new_record[field_name] = loop_field_value;
										continue;
									}
									
									if (field_name in datas)
									{
										loop_field_value = datas[field_name];
										new_record[field_name] = loop_field_value;
									}
								}
//								console.log(new_record, context + ':new_record');
								
								return self.recordset.append([new_record]).then(
									function(arg_new_records)
									{
										self.step(context, 'new record is added in recordset');
										return self.recordset.read().then(
											function(arg_recordset)
											{
												self.step(context, 'recordset record is found');
												return arg_recordset.get_first_record_by_object(new_record);
											}
										);
									}
								);
							}
						}
					}
				);
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return record_promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					self.on_container_select(items, is unselect)
	 * @desc					React on a container selection change
	 * @param {array}			arg_selected_items		array of selected items attributes
	 * @return {nothing}
	 */
	var cb_on_container_select = function (arg_selected_items, arg_unselect)
	{
		var self = this;
//		self.trace=true;
		arg_unselect = !! arg_unselect;
		var context = arg_unselect ? 'on_container_unselect(items)' : 'on_container_select(items)';
		self.enter(context, '');
		self.assert_array(context, 'arg_selected_items', arg_selected_items);
		self.value(context, 'arg_unselect', arg_unselect);
		
		
		try
		{
			var process_selected_items_results = [];
			var process_selected_item_cb = function(arg_selected_item_promise)
			{
				arg_selected_item_promise.then(
					function(arg_selected_item)
					{
						self.step(context, 'selected item is ready');
						
						// DEBUG
//						self.value(context, 'selected item', arg_selected_item);
						console.debug(arg_selected_item, context + ':selected item');
						
						var result_promise = null;
						
						// GET SELECTED ITEM
						var item_record = arg_selected_item.content;
//						self.value(context, 'item record', item_record);
						self.assert_object(context, 'item_record', item_record);
						
						// GET MODEL RECORD FOR CURRENT SELECTED ITEM
						var record = item_record.is_record ? item_record : self.get_recordset().get_first_record_by_object(item_record);
//						self.value(context, 'recordset record', record);
//						console.debug(self.get_recordset(), context + ':selected item recordset');
//						console.debug(record, context + ':selected item record');
						if (record && record.is_record && ! item_record.is_record)
						{
							arg_selected_item.record = record;
						}
						
						var saved_trace = self.trace;
//						self.trace=true;
						
						// DO RECORD SELECT OPERATION
						if (arg_selected_item.already_selected)
						{
							self.step(context, 'DO RECORD SELECT OPERATION: item is already selected');
							
							self.assert_object(context, 'recordset record', record);
							self.assert_true(context, 'recordset record.is_record', record.is_record);
							
							self.step(context, 'unselect item with existing record');
							
							if (arg_unselect)
							{
								self.select_record(record);
							}
							else
							{
								self.unselect_record(record);
								
								// REMOVE RECORD
								self.value(context, 'self.view_items_iterator', self.view_items_iterator);
								if (self.view_items_iterator === 'field_editor')
								{
									self.step(context, 'free recordset record');
									self.recordset.free_record(record);
								}
							}
						}
						else
						{
							self.step(context, 'DO RECORD SELECT OPERATION: item is not already selected');
							
							if (record && record.is_record)
							{
								self.step(context, 'select item with existing record');
								if (! arg_unselect)
								{
									self.step(context, 'do select record');
									self.select_record(record);
								}
								else
								{
									self.step(context, 'do unselect record');
									self.unselect_record(record);
									
									// REMOVE RECORD
									self.value(context, 'self.view_items_iterator', self.view_items_iterator);
									if (self.view_items_iterator === 'field_editor')
									{
										self.step(context, 'free recordset record');
										self.recordset.free_record(record);
									}
								}
							}
							else
							{
								self.step(context, 'select item with new record');
								var record_promise = self.new_selected_record(item_record);
								record_promise.then(
									function(arg_record)
									{
										if (arg_record && arg_record.is_record)
										{
											arg_selected_item.record = arg_record;
										}
										else
										{
											console.error(arg_record, self.name + '.' + context + ':not a Record');
										}
										
										if (! arg_unselect)
										{
											self.step(context, 'do select record');
											self.select_record(arg_record);
										}
										else
										{
											self.step(context, 'do select record');
											self.unselect_record(arg_record);
										}
									}
								);
							}
						}
						
						// DO VIEW SELECT OPERATION
						result_promise = self.view_promise.then(
							function(view)
							{
								var saved_trace = self.trace;
//								self.trace=true;
								
								self.step(context, 'view is ready');
								if (arg_selected_item.already_selected)
								{
									if (arg_unselect)
									{
										self.step(context, 'view: select item');
										view.on_view_model_select(arg_selected_item);
									}
									else
									{
										self.step(context, 'view: unselect item');
										view.on_view_model_unselect(arg_selected_item);
									}
								}
								else
								{
									if (! arg_unselect)
									{
										self.step(context, 'view: select item');
										view.on_view_model_select(arg_selected_item);
									}
									else
									{
										self.step(context, 'view: unselect item');
										view.on_view_model_unselect(arg_selected_item);
									}
								}
								
								self.trace=saved_trace;
							}
						);
						self.trace=saved_trace;
						
						process_selected_items_results.push(result_promise);
					}
				);
			};
			
			self.step(context, 'loop on selected items');
			self.batch_promise = self.batch_promise.then(
				function()
				{
					arg_selected_items.forEach(process_selected_item_cb);
					return Devapt.promise_all(process_selected_items_results);
				}
			);
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		self.leave(context, '');
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					self.on_container_select(record)
	 * @desc					Select a record
	 * @param {array}			arg_selected_items		array of selected items attributes
	 * @return {nothing}
	 */
	var cb_on_container_unselect = function (arg_selected_items, arg_unselect)
	{
		var self = this;
		self.on_container_select(arg_selected_items, true);
	};
	
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					self.on_container_select_all()
	 * @desc					Select all selected records
	 * @return {object}			A promise of the operation
	 */
	var cb_on_container_select_all = function ()
	{
		var self = this;
//		self.trace=true;
		var context = 'on_container_select_all()';
		self.enter(context, '');
		
		
		try
		{
			var process_selected_items_results = [];
			var process_selected_record_cb = function(arg_selected_record)
			{
				self.step(context, 'loop on selected record');
//				self.value(context, 'selected record', arg_selected_record);
				
				// DO RECORD SELECT OPERATION
				self.select_record(arg_selected_record);
				
				// DO VIEW SELECT OPERATION
				var promise = self.view_promise.then(
					function(view)
					{
						self.step(context, 'view: on view_model unselect');
						var selected_item_promise = view.get_selected_item(arg_selected_record);
						
						return selected_item_promise.then(
							function(arg_selected_item)
							{
								self.step(context, 'select item is found');
//								self.value(context, 'arg_selected_item', arg_selected_item);
								return view.on_view_model_select(arg_selected_item);
							}
						);
					}
				);
				
				process_selected_items_results.push(promise);
			};
			
			self.step(context, 'loop on selected records');
			self.batch_promise = self.batch_promise.then(
				function()
				{
					self.recordset.get_records().forEach(process_selected_record_cb);
					return Devapt.promise_all(process_selected_items_results);
				}
			);
		}
		catch(e)
		{
			console.error(e, context);
			self.leave(context, Devapt.msg_failure_promise);
			return Devapt.promise_rejected(e);
		}
		
		
		self.leave(context, Devapt.msg_success_promise);
		return self.batch_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					self.on_container_unselect_all()
	 * @desc					Unselect all selected records
	 * @return {object}			A promise of the operation
	 */
	var cb_on_container_unselect_all = function ()
	{
		var self = this;
//		self.trace=true;
		var context = 'on_container_unselect_all()';
		self.enter(context, '');
		
		
		try
		{
			var process_selected_items_results = [];
			var process_selected_record_cb = function(arg_selected_record)
			{
				self.step(context, 'loop on selected record');
//				self.value(context, 'selected record', arg_selected_record);
				
				// DO RECORD SELECT OPERATION
				self.unselect_record(arg_selected_record);
				
				// DO VIEW SELECT OPERATION
				var promise = self.view_promise.then(
					function(view)
					{
						self.step(context, 'view: on view_model unselect');
						var selected_item_promise = view.get_selected_item(arg_selected_record);
						
						return selected_item_promise.then(
							function(arg_selected_item)
							{
								self.step(context, 'select item is found');
//								self.value(context, 'arg_selected_item', arg_selected_item);
								return view.on_view_model_unselect(arg_selected_item);
							}
						);
					}
				);
				
				process_selected_items_results.push(promise);
			};
			
			self.step(context, 'loop on selected records');
			self.batch_promise = self.batch_promise.then(
				function()
				{
					self.selection.forEach(process_selected_record_cb);
					return Devapt.promise_all(process_selected_items_results);
				}
			);
		}
		catch(e)
		{
			console.error(e, context);
			self.leave(context, Devapt.msg_failure_promise);
			return Devapt.promise_rejected(e);
		}
		
		
		self.leave(context, Devapt.msg_success_promise);
		return self.batch_promise;
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
	
		// SELECTION OPERATIONS
	DevaptViewModelMixinSelectableClass.add_public_method('get_selected_records', {}, cb_get_selected_records);
	DevaptViewModelMixinSelectableClass.add_public_method('set_selected_records', {}, cb_set_selected_records);
	
	DevaptViewModelMixinSelectableClass.add_public_method('select_record', {}, cb_select_record);
	DevaptViewModelMixinSelectableClass.add_public_method('unselect_record', {}, cb_unselect_record);
	
	DevaptViewModelMixinSelectableClass.add_public_method('new_selected_record', {}, cb_new_selected_record);
	
	DevaptViewModelMixinSelectableClass.add_public_method('on_container_select', {}, cb_on_container_select);
	DevaptViewModelMixinSelectableClass.add_public_method('on_container_unselect', {}, cb_on_container_unselect);
	
	DevaptViewModelMixinSelectableClass.add_public_method('on_container_select_all', {}, cb_on_container_select_all);
	DevaptViewModelMixinSelectableClass.add_public_method('on_container_unselect_all', {}, cb_on_container_unselect_all);
	
	
	// PROPERTIES
	DevaptViewModelMixinSelectableClass.add_public_array_property('selection', 'Selected model datas records', null, true, false, []);
	
	
	return DevaptViewModelMixinSelectableClass;
} );