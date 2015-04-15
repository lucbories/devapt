/**
 * @file        views/container/container-mixin-lookupable.js
 * @desc        View mixin class to lookup container node
 * 				
 *              API:
 *  				->get_select_item_by_index(index)   : get a promise of a selected item object from an index
 *  				->get_select_item_by_label(label)   : get a promise of a selected item object from a label
 *  				->get_select_item_by_record(record) : get a promise of a selected item object from a record
 *  				WITH
 *  					selected item object : { index:integer, node_jqo:jQuery object, record:{...}, label:string, already_selected:boolean };
 * 					
 * @ingroup     DEVAPT_VIEWS
 * @date        2015-03-04
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
	 * @class				DevaptContainerMixinLookupable
	 * @desc				View mixin class for SELECT/UNSELECT operations
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptContainerMixinLookupable
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
	
	
	
	/**
	 * @memberof				DevaptContainerMixinLookupable
	 * @private
	 * @method					cb_get_select_item_by_index(view object, index)
	 * @desc					Get selected item attributes by its index
	 * @param {integer}			arg_index		selected item index
	 * @return {object}			A promise of a selected item record { index:..., node_jqo:..., record:..., label:..., already_selected:... }
	 */
	var cb_get_select_item_by_index = function (arg_index)
	{
		var self = this;
		var context = 'get_select_item_by_index(index)';
		self.enter(context, arg_index);
		
		
		// INIT SELECTED ITEM
		var selected_item = { index:arg_index, node_jqo:null, record:null, label:null, already_selected:false };
		
		
		// GET SELECTED INDEX
		
		
		// GET SELECTED JQUERY NODE WITH GIVEN INDEX
		self.step(context, 'get selected jQuery node');
		var item_object = self.items_objects[arg_index];
		if ( ! item_object )
		{
			console.log(arg_index, context + ':index');
			console.error(self, context);
			return Devapt.promise_rejected();
		}
		selected_item.node_jqo = item_object.node;
		if ( ! selected_item.node_jqo)
		{
			self.error(context + ':node not found');
			self.leave(context, Devapt.msg_failure);
			return Devapt.promise_rejected(context + ':node not found');
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
		return Devapt.promise_resolved(selected_item);
	};
	
	
	/**
	 * @memberof				DevaptContainerMixinLookupable
	 * @private
	 * @method					cb_get_select_item_by_label(view object, label)
	 * @desc					Get selected item attributes by its index
	 * @param {string}			arg_label		selected item node label
	 * @return {object}			A promise of a selected item record { index:..., node_jqo:..., record:..., label:... }
	 */
	var cb_get_select_item_by_label = function (arg_label)
	{
		var self = this;
		var context = 'get_select_item_by_label(label)';
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
			return Devapt.promise_rejected(context + ':node not found');
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
			return Devapt.promise_rejected(context + ':bad node index');
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
		return Devapt.promise_resolved(selected_item);
	};
	
	
	/**
	 * @memberof				DevaptContainerMixinLookupable
	 * @private
	 * @method					cb_get_select_item_by_record(view object, record)
	 * @desc					Get selected item attributes by its record
	 * @param {object}			arg_record		selected item node record
	 * @return {object}			A promise of a selected item record { index:..., node_jqo:..., record:..., label:... }
	 */
	var cb_get_select_item_by_record = function (arg_record)
	{
		var self = this;
		var context = 'get_select_item_by_record(record)';
		self.enter(context, '');
		
		
		// GET ITEMS PROMISE
		self.step(context, 'GET ITEMS PROMISE');
		var items_promise = self.view_model.then(
			function(view_model)
			{
				self.step(context, 'VIEW_MODEL IS READY');
				
				var items_iterator = view_model.view.items_iterator;
				self.value(context, 'items_iterator', items_iterator);
				
				switch(items_iterator)
				{
					case 'field_editor':
					case 'records':
						self.step(context, 'ITERATE ON RECORDS');
						return view_model.get_items_array_model_with_iterator_records();
					case 'fields':
						self.step(context, 'ITERATE ON FIELDS');
						return view_model.get_items_array_model_with_iterator_fields();
				}
				
				self.step(context, 'ITERATE ON NOTHING');
				return Devapt.promise_rejected('bad view iterator [' + items_iterator + ']');
			}
		);
		
		items_promise = items_promise.then(
			function(recordset)
			{
				try
				{
					self.step(context, 'items are found');
					
					// GET ALL ITEMS
					self.step(context, 'GET ALL ITEMS');
					var items_records = recordset.get_records();
					var items_records_count = recordset.get_count();
					self.value(context, 'arg_record', arg_record);
					self.value(context, 'items_records', items_records);
					self.value(context, 'items_records_count', items_records_count);
					
					// GET SELECTION FIELD NAME
					self.step(context, 'GET SELECTION FIELD NAME');
					var field_name = self.items_fields[0];
					self.assert_not_null(context, 'field_name', field_name);
					self.value(context, 'field_name', field_name);
					console.log(context, 'field_name', field_name);
					
					// GET SELECTION FIELD VALUE
					self.step(context, 'GET SELECTION FIELD VALUE');
					var field_value = field_name in arg_record ? arg_record[field_name] : null;
					self.assert_not_null(context, 'field_value', field_value);
					self.value(context, 'field_value', field_value);
					
					// GET SELECTION FIELD OBJECT
					self.step(context, 'GET SELECTION FIELD OBJECT');
					var field_obj_promise = self.view_model.invoke('get_field', field_name);
					if ( ! DevaptTypes.is_object(field_obj) )
					{
						console.error('bad field object', context);
						return Devapt.promise_rejected(context + ':bad field object');
					}
					
					// LOOP ON ITEMS RECORDS
					self.step(context, 'LOOP ON ITEMS RECORDS');
					var selected_record_promise = field_obj_promise.then(
						function()
						{
							self.step(context, 'loop on field values records');
							for(var values_index = 0 ; values_index < items_records_count ; values_index++)
							{
								self.value(context, 'loop on values indes', values_index);
								var loop_value_record = items_records[values_index];
								var loop_value_field = loop_value_record[field_name];
								
								// TEST IF CURRENT ITEM FIELD VALUE IS THE SAME AS THE SELECTION FIELD VALUE
								if (loop_value_record[field_name] === field_value)
								{
									self.step(context, 'selected item is found for field name [' + field_name + '] and value [' + field_value + ']');
									var node_jqo = self.get_node_by_index(values_index);
									
									// CHECK NODE
									if (! node_jqo)
									{
										self.step(context, 'jqo node not found');
										return Devapt.promise_rejected(context + ':jqo node not found');
									}
									
									// UPDATE SELECTED RECORD RESULT
									var selected_item = { index:null, node_jqo:null, record:null, label:null, already_selected:false };
									
									self.step(context, 'SELECTED RECORD RESULT');
									return selected_item;
								}
							}
							
							self.step(context, 'selected record not found');
							return Devapt.promise_rejected(context + ':selected record not found');
						}
					);
					
					self.step(context, 'LOOP ON ITEMS RECORDS: returns promise');
					return selected_record_promise;
				}
				catch(e)
				{
					console.error(context, e);
					return e;
				}
			},
			
			function()
			{
				console.error('items promise failed', context);
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return items_promise;
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-03-06',
			updated:'2015-03-06',
			description:'Mixin to lookup for a node into a container.'
		}
	};
	var parent_class = null;
	var DevaptContainerMixinLookupableClass = new DevaptClass('DevaptContainerMixinLookupable', parent_class, class_settings);
	
	
	// METHODS
	DevaptContainerMixinLookupableClass.infos.ctor = cb_constructor;
	
	DevaptContainerMixinLookupableClass.add_public_method('get_select_item_by_index', {}, cb_get_select_item_by_index);
	DevaptContainerMixinLookupableClass.add_public_method('get_select_item_by_label', {}, cb_get_select_item_by_label);
	DevaptContainerMixinLookupableClass.add_public_method('get_select_item_by_record', {}, cb_get_select_item_by_record);
	
	
	// PROPERTIES
	
	// BUILD CLASS
	DevaptContainerMixinLookupableClass.build_class();
	
	
	return DevaptContainerMixinLookupableClass;
} );