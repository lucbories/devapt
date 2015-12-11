/**
 * @file        views/mixin-crud.js
 * @desc        Mixin for container CRUD operations
 *				API
 * 					->mixin_init_crud(self): mixin constructor, nothing to do (nothing)
 * 					
 * 					->record_created(record): A record is created and the view should be created (nothing)
 * 					->record_updated(record): A record is updated and the view should be updated (nothing)
 * 					->record_deleted(record): A record is deleted and the view should be deleted (nothing)
 * 					
 * @see			DevaptContainer
 * @ingroup     DEVAPT_VIEWS
 * @date        2015-06-20
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
	 * @mixin				DevaptMixinCrud
	 * @public
	 * @desc				Mixin of methods for container get nodes features
	 */
	var DevaptMixinCrud = 
	{
		/**
		 * @memberof			DevaptMixinCrud
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_crud: false,
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinCrud
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_crud: function(self)
		{
			self.push_trace(self.trace, DevaptMixinCrud.mixin_trace_crud);
			var context = 'mixin_init_crud()';
			self.enter(context, '');
			
			
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinCrud
		 * @desc				A record is created and the view should be updated
		 * @param {object}		arg_record	Record object
		 * @return {nothing}
		 */
		record_created: function(arg_record)
		{
			var self = this;
			var context = 'record_created(record)';
			self.push_trace(self.trace, DevaptMixinCrud.mixin_trace_crud);
			self.enter(context, '');
			
			
			// FIRE EVENT
			self.fire_event('devapt.container.record_created', [arg_record]);
			
			// NOTIFY USER
			if (self.notify_on_record_created && DevaptTypes.is_not_empty_string(self.notify_on_record_created_msg))
			{
				Devapt.get_current_backend().notify_info(self.notify_on_record_created_msg);
			}
			
			// APPEND RECORD TO THE CONTAINER
			self.append_item(arg_record.datas, 'object');
			var item_index = self.items_records.length - 1;
			var item_jqo = self.items_objects[item_index];
			
			// SELECT NEW RECORD
			self.view_model_promise.then(
				function(arg_view_model)
				{
					var selected_item = { index:item_index, record:arg_record, node_jqo:item_jqo };
					arg_view_model.set_selected_records([selected_item]);
				}
			);
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinCrud
		 * @desc				A record is updated and the view should be updated
		 * @return {nothing}
		 */
		record_updated: function(arg_record)
		{
			var self = this;
			var context = 'record_updated(record)';
			self.push_trace(self.trace, DevaptMixinCrud.mixin_trace_crud);
			self.enter(context, '');
			
			
			// FIRE EVENT
			self.fire_event('devapt.container.record_updated', [arg_record]);
			
			// NOTIFY USER
			if (self.notify_on_record_updated && DevaptTypes.is_not_empty_string(self.notify_on_record_updated_msg))
			{
				Devapt.get_current_backend().notify_info(self.notify_on_record_updated_msg);
			}
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinCrud
		 * @desc				A record is deleted and the view should be updated
		 * @return {nothing}
		 */
		record_deleted: function(arg_record)
		{
			var self = this;
			var context = 'record_deleted(record)';
			self.push_trace(self.trace, DevaptMixinCrud.mixin_trace_crud);
			self.enter(context, '');
			
			
			// FIRE EVENT
			self.fire_event('devapt.container.record_deleted', [arg_record]);
			
			// NOTIFY USER
			if (self.notify_on_record_deleted && DevaptTypes.is_not_empty_string(self.notify_on_record_deleted_msg))
			{
				Devapt.get_current_backend().notify_info(self.notify_on_record_deleted_msg);
			}
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinCrud
		 * @desc				A record is created and the view should be updated
		 * @return {nothing}
		 */
		on_record_created: function(arg_record)
		{
			var self = this;
			var context = 'on_record_created(record)';
			self.push_trace(self.trace, DevaptMixinCrud.mixin_trace_crud);
			self.enter(context, '');
			
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinCrud
		 * @desc				A record is updated and the view should be updated
		 * @return {nothing}
		 */
		on_record_updated: function(arg_record)
		{
			var self = this;
			var context = 'on_record_updated(record)';
			self.push_trace(self.trace, DevaptMixinCrud.mixin_trace_crud);
			self.enter(context, '');
			
			
			// CHECK ARGS
			if ( DevaptTypes.is_array(arg_record) )
			{
				if (arg_record.length > 0)
				{
					arg_record = arg_record[0];
				}
				else
				{
					arg_record = null;
				}
			}
			
			
			// UPDATE ITEM
			var defer = Devapt.defer();
			var item_jqo = self.get_node_by_record(arg_record);
			var datas_object = arg_record.is_record ? arg_record.datas : arg_record;
			
			self.render_item_object(defer, item_jqo, datas_object, true);
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinCrud
		 * @desc				A record is deleted and the view should be updated
		 * @return {nothing}
		 */
		on_record_deleted: function(arg_record)
		{
			var self = this;
			var context = 'on_record_deleted(record)';
			self.push_trace(self.trace, DevaptMixinCrud.mixin_trace_crud);
			self.enter(context, '');
			
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinCrud
		 * @desc				A request is received about a record creation
		 * @return {nothing}
		 */
		on_create_request: function()
		{
			var self = this;
			var context = 'on_create_request()';
			self.push_trace(self.trace, DevaptMixinCrud.mixin_trace_crud);
			self.enter(context, '');
			
			
			console.info(self.name + '.' + context);
			
			var record_promise = self.view_model_promise.then(
				function(arg_view_model)
				{
					self.step(context, 'view_model is found and create record');
					
					var recordset = arg_view_model.get_recordset()
					var record = recordset.new_record();
					record = recordset.init_record(record);
					return record;
				}
			);
			
			record_promise.then(
				function(record)
				{
					self.record_created(record);
				}
			);
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinCrud
		 * @desc				A request is received about a record deletion
		 * @return {nothing}
		 */
		on_delete_request: function()
		{
			var self = this;
			var context = 'on_delete_request()';
			self.push_trace(self.trace, DevaptMixinCrud.mixin_trace_crud);
			self.enter(context, '');
			
			
			console.info(self.name + '.' + context);
			
			// // UPDATE ITEM
			// var defer = Devapt.defer();
			// var item_jqo = self.get_node_by_record(arg_record);
			// var datas_object = arg_record.is_record ? arg_record.datas : arg_record;
			
			// self.render_item_object(defer, item_jqo, datas_object, true);
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-06-20',
			'updated':'2015-06-20',
			'description':'Mixin methods for container CRUD operations.'
		}
	};
	
	
	/**
	 * @mixin				DevaptMixinCrudClass
	 * @public
	 * @desc				Mixin methods for container CRUD operations
	 */
	var DevaptMixinCrudClass = new DevaptClass('DevaptMixinCrud', null, class_settings);
	
	// METHODS
	DevaptMixinCrudClass.infos.ctor = DevaptMixinCrud.mixin_init_crud;
	DevaptMixinCrudClass.add_public_method('record_created', {}, DevaptMixinCrud.record_created);
	DevaptMixinCrudClass.add_public_method('record_updated', {}, DevaptMixinCrud.record_updated);
	DevaptMixinCrudClass.add_public_method('record_deleted', {}, DevaptMixinCrud.record_deleted);
	
	DevaptMixinCrudClass.add_public_method('on_record_created', {}, DevaptMixinCrud.on_record_created);
	DevaptMixinCrudClass.add_public_method('on_record_updated', {}, DevaptMixinCrud.on_record_updated);
	DevaptMixinCrudClass.add_public_method('on_record_deleted', {}, DevaptMixinCrud.on_record_deleted);
	
	DevaptMixinCrudClass.add_public_method('on_create_request', {}, DevaptMixinCrud.on_create_request);
	DevaptMixinCrudClass.add_public_method('on_delete_request', {}, DevaptMixinCrud.on_delete_request);
	
	// PROPERTIES
	DevaptMixinCrudClass.add_public_bool_property('notify_on_record_created',	'Enable or disable user notification on record creation.',	true, false, false, []);
	DevaptMixinCrudClass.add_public_bool_property('notify_on_record_updated',	'Enable or disable user notification on record update',		true, false, false, []);
	DevaptMixinCrudClass.add_public_bool_property('notify_on_record_deleted',	'Enable or disable user notification on record delete.',	true, false, false, []);
	
	DevaptMixinCrudClass.add_public_str_property('notify_on_record_created_msg',	'User notification message on record creation.',	'A record is created.', false, false, []);
	DevaptMixinCrudClass.add_public_str_property('notify_on_record_updated_msg',	'User notification message on record update',		'A record is updated.', false, false, []);
	DevaptMixinCrudClass.add_public_str_property('notify_on_record_deleted_msg',	'User notification message on record delete.',		'A record is deleted.', false, false, []);
	
	DevaptMixinCrudClass.build_class();
	
	
	return DevaptMixinCrudClass;
}
);