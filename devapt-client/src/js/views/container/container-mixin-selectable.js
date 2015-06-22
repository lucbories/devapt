/**
 * @file        view/container/container-mixin-selectable.js
 * @desc        View mixin class for SELECT/UNSELECT operations
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
 *              API:
 *  				Selected item object:
 *  					{ index:..., node_jqo:..., record:..., label:..., already_selected:... }
 *  				
 *                  ->constructor(object)     : nothing
 *  
 *                  ->get_selected_item(args)     : Get normalized selected item object promise (object)
 *                  ->get_selected_items(args)    : Get an array of normalized selected item object promises (array)
 * 
 *                  ->select(object|array)        : Select one or more records into the view and get the operation promise (object)
 *                  ->unselect(object|array)      : Unselect one or more records into the view and get the operation promise (object)
 * 
 *                  ->select_all()                : All view records are selected into the View object and get the operation promise (object)
 *                  ->unselect_all()              : All view records are unselected into the View object and get the operation promise (object)
 * 
 *                  ->on_view_model_select(item)  : On ViewModel selection change and get the operation promise (object)
 *                  ->on_view_model_unselect(item): On ViewModel selection change and get the operation promise (object)
 *                  ->on_recordset_filter_change(): On Recordset filter added and get the operation promise (object)
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
	 * @private
	 * @method					get_selected_item(args)
	 * @desc					Get normalized selected item attributes
	 * @param {array}			arg_selection	selected item (record, label or index)
	 * @return {promise}		Selected item attributes promise
	 */
	var cb_get_selected_item = function (arg_selection)
	{
		var self = this;
		var context = 'get_selected_item(args)';
		self.enter(context, '');
		
		
		var selected_item_promise = null;
		
		try
		{
			if ( DevaptTypes.to_integer(arg_selection, -1) >= 0 )
			{
				self.value(context, 'selected_value is integer', arg_selection);
				selected_item_promise = self.get_select_item_by_index(arg_selection);
			}
			
			// GET SELECTED ITEM BY ITS LABEL
			else if ( DevaptTypes.is_string(arg_selection) )
			{
				self.value(context, 'selected_value is string', arg_selection);
				selected_item_promise = self.get_select_item_by_label(arg_selection);
			}
			
			// GET SELECTED ITEM BY ITS RECORD
			else if ( DevaptTypes.is_object(arg_selection) )
			{
	//			self.value(context, 'selected_value is object', arg_selection); // TODO to_string recursive error
				selected_item_promise = self.get_select_item_by_record(arg_selection);
			}
		}
		catch(e)
		{ 
			console.error(e, context);
			self.leave(context, Devapt.msg_failure_promise);
			return Devapt.promise_rejected(e);
		}
		
		
		self.leave(context, Devapt.msg_success_promise);
		return selected_item_promise;
	};
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @private
	 * @method					get_selected_items(args)
	 * @desc					Select one or more records into the view with args is one ore more indices or records or labels
	 * @param {array}			arg_selection	selected items array (record, label or index)
	 * @return {array}			Selected items attributes promises
	 */
	var cb_get_selected_items = function (arg_selection)
	{
		var self = this;
		var context = 'get_selected_items(args)';
		self.enter(context, '');
		
		
		var selected_items_promises = [];
		
		try
		{
			self.step(context, 'NORMALIZE ITEMS');
			
			// LOOP ON SELECTED ITEMS VALUES
			for(var selected_index in arg_selection)
			{
				self.value(context, 'loop on selected_index', selected_index);
				
				var selected_value = arg_selection[selected_index];
				var selected_item_promise = self.get_selected_item(selected_value);
				
				
				// CHECK AND APPEND SELECTED ITEM
				// console.log(selected_items, context + ':CHECK AND APPEND SELECTED ITEM');
				if (selected_item_promise)
				{
					self.step(context, 'selected_value promise is valid');
					
					selected_items_promises.push(selected_item_promise);
				}
				else
				{
					self.error(context, 'selected item not found');
					self.value(context, 'selected value', selected_value);
				}
			}
		}
		catch(e)
		{
			console.error(e, context);
			self.leave(context, Devapt.msg_failure_promise);
			return Devapt.promise_rejected(e);
		}
		
		
		self.leave(context, Devapt.msg_success_promise);
		return selected_items_promises;
	};
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @public
	 * @method					self.select(args)
	 * @desc					Get one or more selected items into the view with args is one ore more indices or records or labels
	 * @param {object|array|integer|string}	arg_selection			one or more selected items record, label or index
	 * @return {object}			Promise of the operation
	 */
	var cb_select = function (arg_selection)
	{
		var self = this;
		var context = 'select(array|object|label|index)';
		self.enter(context, '');
		
		
//		console.log(self, context + ':' + self.name + '[' + self.selection_enabled + ']');
		if (! self.selection_enabled)
		{
			self.leave(context, 'SELECTION IS DISABLED');
			return Devapt.promise_resolved();
		}
		
		// INIT
		var promise = null;
		
		// CREATE AN ARRAY
		if ( ! DevaptTypes.is_array(arg_selection) )
		{
			arg_selection = [arg_selection];
		}
		
		// GET SELECTION ITEMS
		var selected_items = self.get_selected_items(arg_selection);
		
		// PROCESS VIEW MODEL OPERATIONS
		promise = self.view_model_promise.then(
			function(arg_view_model)
			{
				self.step(context, 'view_model is ready');
				try
				{
					arg_view_model.on_container_select(selected_items);
				}
				catch(e)
				{
					console.error(e, context);
					return null;
				}
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @public
	 * @method					DevaptContainerMixinSelectable.unselect(records)
	 * @desc					Unselect one or more records into the view
	 * @param {object|array|integer|string}	arg_selection			one or more selected items record, label or index
	 * @return {object}			Promise of the operation
	 */
	var cb_unselect = function (arg_selection)
	{
		var self = this;
		var context = 'unselect(array|object|label|index)';
		self.enter(context, '');
//		self.value(context, 'arg_selection', arg_selection);
		
		
//		console.log(self, context + ':' + self.name + '[' + self.selection_enabled + ']');
		if (! self.selection_enabled)
		{
			self.leave(context, 'SELECTION IS DISABLED');
			return Devapt.promise_resolved();
		}
		
		// INIT
		var promise = null;
		
		// CREATE AN ARRAY
		if ( ! DevaptTypes.is_array(arg_selection) )
		{
			arg_selection = [arg_selection];
		}
		
		// GET SELECTION ITEMS
		var selected_items = self.get_selected_items(arg_selection);
		
		// PROCESS VIEW MODEL OPERATIONS
		promise = self.view_model_promise.then(
			function(arg_view_model)
			{
				self.step(context, 'view_model is ready');
				try
				{
					arg_view_model.on_container_unselect(selected_items);
				}
				catch(e)
				{
					console.error(e, context);
					return null;
				}
			}
		);
		
		
		self.leave(context, '');
		return promise;
	};
	
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @public
	 * @method					self.select_all(records)
	 * @desc					Select all records into the view
	 * @return {object}			Promise of the operation
	 */
	var cb_select_all = function ()
	{
		var self = this;
		var context = 'select_all()';
		self.enter(context, '');
		self.assert_object(context, 'model', self.model);
		
		
//		console.log(self, context + ':' + self.name + '[' + self.selection_enabled + ']');
		if (! self.selection_enabled)
		{
			self.leave(context, 'SELECTION IS DISABLED');
			return Devapt.promise_resolved();
		}
		
		var promise = self.view_model_promise.then(
			function(arg_view_model)
			{
				self.step(context, 'view_model is ready');
				try
				{
					arg_view_model.on_container_select_all();
				}
				catch(e)
				{
					console.error(e, context);
					return null;
				}
			}
		);
		
		
		self.leave(context, '');
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @public
	 * @method					self.unselect_all()
	 * @desc					Unelect all records into the view
	 * @return {object}			Promise of the operation
	 */
	var cb_unselect_all = function ()
	{
		var self = this;
		var context = 'unselect_all()';
		self.enter(context, '');
		self.assert_object(context, 'view_model_promise', self.view_model_promise);
		
		
//		console.log(self, context + ':' + self.name + '[' + self.selection_enabled + ']');
		if (! self.selection_enabled)
		{
			self.leave(context, 'SELECTION IS DISABLED');
			return Devapt.promise_resolved();
		}
		
		var promise = self.view_model_promise.then(
			function(arg_view_model)
			{
				self.step(context, 'view_model is ready');
				try
				{
					return arg_view_model.on_container_unselect_all();
				}
				catch(e)
				{
					console.error(e, context);
					return Devapt.promise_rejected(e);
				}
			}
		);
		
		
		self.leave(context, '');
		return promise;
	};
	
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @private
	 * @method					self.on_view_model_select(item)
	 * @desc					On ViewModel selection change
	 * @param {object}			arg_selected_item	Selected item object { index:..., node_jqo:..., record:..., label:..., already_selected:... }
	 * @return {object}			Promise of the operation
	 */
	var cb_on_view_model_select = function (arg_selected_item)
	{
		var self = this;
//		self.trace=true;
		var context = 'on_view_model_select(item)';
		self.enter(context, '');
		
		
		// DEBUG
//		console.log(arg_selected_item, 'arg_selected_item');
//		console.log(arg_selected_item.node_jqo, 'arg_selected_item.node_jqo');
		
		// REMOVE PREVIOUS SELECTED ITEM
		if (! self.has_multiple_selection)
		{
			self.step(context, 'remove all css selected');
			self.remove_items_css_class('selected');
		}
		
		self.step(context, 'add css class "selected"');
		self.add_item_node_css_class(arg_selected_item.node_jqo, 'selected');
		
		self.step(context, 'fire event "...selected"');
		self.fire_event('devapt.events.container.selected', [arg_selected_item]);
		
		
		self.leave(context, Devapt.msg_success_promise);
//		self.trace=false;
		return Devapt.promise_resolved(arg_selected_item);
	};
	
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @private
	 * @method					self.on_view_model_unselect(item)
	 * @desc					On ViewModel selection change
	 * @param {object}			arg_selected_item	Selected item object { index:..., node_jqo:..., record:..., label:..., already_selected:... }
	 * @return {object}			Promise of the operation			
	 */
	var cb_on_view_model_unselect = function (arg_selected_item)
	{
		var self = this;
//		self.trace=true;
		var context = 'on_view_model_unselect(item)';
		self.enter(context, '');
		
		
		// DEBUG
//		console.log(arg_selected_item, 'arg_selected_item');
//		console.log(arg_selected_item.node_jqo, 'arg_selected_item.node_jqo');
		
		self.step(context, 'remove css class "selected"');
		self.remove_item_node_css_class(arg_selected_item.node_jqo, 'selected');
		
		self.step(context, 'fire event "unselected"');
		self.fire_event('devapt.events.container.unselected', [arg_selected_item]);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return Devapt.promise_resolved(arg_selected_item);
	};
	
	
	
	/**
	 * @memberof				DevaptContainerMixinSelectable
	 * @private
	 * @method					self.on_recordset_filter_change()
	 * @desc					On Recordset filter added
	 * @return {object}			Promise of the operation			
	 */
	var cb_on_recordset_filter_change = function ()
	{
		var self = this;
//		self.trace=true;
		var context = 'on_recordset_filter_change()';
		self.enter(context, '');
		
		
		try
		{
			self.value(context, 'self.renders_count', self.renders_count);
			self.value(context, 'self.items_iterator', self.items_iterator);
			
			var render_promise = null;
			if (self.items_iterator === 'field_editor')
			{
				self.step(context, 'select items in field editor');
				
				if ( self.is_render_state_not() )
				{
					self.step(context, 'first view rendering');
					
					render_promise = self.render( Devapt.defer() );
				}
				else
				{
					self.step(context, 'view is rendering or rendered');
					
					render_promise = Devapt.promise(self.mixin_renderable_defer);
				}
				
				render_promise = render_promise.then(
					function()
					{
						self.step(context, 'view is rendered');
						
						// UNSELECT ALL IF FIELD EDITOR
						if (self.items_iterator === 'field_editor')
						{
							self.remove_items_css_class('selected');
						}
						
						// PROCESS RECORDS
						return self.view_model_promise.get('recordset').then(
							function(arg_recordset)
							{
								self.step(context, 'view_model recordset is ready');
								
								return self.unselect_all().then(
									function()
									{
										self.step(context, 'view unselect_all is finished');
										return arg_recordset.read().then(
											function()
											{
												self.step(context, 'recordset is read');
												
												var records = arg_recordset.get_records();
												
												return self.select(records);
											}
										);
									}
								);
							}
						);
					}
				);
			}
			else if (self.items_iterator === 'fields')
			{
				self.step(context, 'select items in fields');
				
//				self.reset_items();
//				render_promise = self.fill_items( Devapt.defer() );
				
				self.remove_items();
				render_promise = self.render_items( Devapt.defer() );
			}
			else if (self.items_iterator === 'records')
			{
				self.step(context, 'select items in fields');
				
				if ( self.renders_count === 0)
				{
					self.step(context, 'first view rendering');
					
					render_promise = self.render( Devapt.defer() );
				}
				else
				{
					self.step(context, 'remove previous items and render items');
					
					self.remove_items();
					render_promise = self.render_items( Devapt.defer() );
				}
			}
			else
			{
				self.step(context, 'bad items iterator [' + self.items_iterator + ']');
			}
		}
		catch(e)
		{
			console.error(e, context);
			self.leave(context, Devapt.msg_failure_promise);
			return Devapt.promise_rejected(e);
		}
		
		
		self.leave(context, Devapt.msg_success_promise);
		return render_promise ? render_promise : Devapt.promise_rejected();
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-02-02',
			updated:'2015-05-06',
			description:'Mixin for SELECT/UNSELECT operation on a view.'
		},
		mixins:[DevaptContainerMixinLookupable]
	};
	var parent_class = null;
	var DevaptContainerMixinSelectableClass = new DevaptClass('DevaptContainerMixinSelectable', parent_class, class_settings);
	
	
	// METHODS
	DevaptContainerMixinSelectableClass.infos.ctor = cb_constructor;
	
	DevaptContainerMixinSelectableClass.add_public_method('get_selected_item', { description:'' }, cb_get_selected_item);
	DevaptContainerMixinSelectableClass.add_public_method('get_selected_items', { description:'' }, cb_get_selected_items);
	
	DevaptContainerMixinSelectableClass.add_public_method('select', { description:'Select one or more records into the view with args is one ore more indices or records or labels'}, cb_select);
	DevaptContainerMixinSelectableClass.add_public_method('unselect', {}, cb_unselect);
	
	DevaptContainerMixinSelectableClass.add_public_method('select_all', {}, cb_select_all);
	DevaptContainerMixinSelectableClass.add_public_method('unselect_all', {}, cb_unselect_all);
	
	DevaptContainerMixinSelectableClass.add_public_method('on_view_model_select', { description:'' }, cb_on_view_model_select);
	DevaptContainerMixinSelectableClass.add_public_method('on_view_model_unselect', { description:'' }, cb_on_view_model_unselect);
	DevaptContainerMixinSelectableClass.add_public_method('on_recordset_filter_change', {}, cb_on_recordset_filter_change);
	
	
	// PROPERTIES
	
	// BUILD CLASS
	DevaptContainerMixinSelectableClass.build_class();
	
	
	return DevaptContainerMixinSelectableClass;
} );