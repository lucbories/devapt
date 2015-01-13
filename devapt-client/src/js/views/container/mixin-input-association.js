/**
 * @file        views/mixin-input-association.js
 * @desc        Mixin for datas association input feature for containers
 * @see			DevaptContainer
 * @ingroup     DEVAPT_CORE
 * @date        2015-01-04
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict'
define(
['Devapt', 'core/types', 'core/class'],
function(Devapt, DevaptTypes, DevaptClass)
{
	/**
	 * @mixin				DevaptMixinInputAssociation
	 * @public
	 * @desc				Mixin of methods for datas form features
	 */
	var DevaptMixinInputAssociation = 
	{
		/**
		 * @memberof			DevaptMixinInputAssociation
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_input_association: false,
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinInputAssociation
		 * @desc				Get an input tag for the given joined field
		 * @param {object}		arg_deferred			deferred object
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {string}		arg_value				field value
		 * @param {object}		arg_access				access object: {create:bool,read:bool,update:bool,delete:bool}
		 * @return {object}		jQuery node object
		 */
		get_association_input: function(arg_deferred, arg_field_obj, arg_value, arg_access)
		{
			var self = this;
			var context = 'get_association_input(deferred,field,value,access)';
			self.push_trace(self.trace, DevaptMixinInputAssociation.mixin_trace_input_association);
			self.enter(context, '');
			
			
			// STANDARD INPUT EVENT CALLBACK
			var change_cb = function(event) {
				var event_node_jqo = $(event.target);
				var value_filled = event_node_jqo.data('value_filled');
				var value = event_node_jqo.val();
				
				// ON VALUE CHANGE
				if (value !== value_filled)
				{
					event_node_jqo.data('value_filled', value);
					// console.log(value, 'input changed');
					
					// VALIDATE VALUE
					var validate_status = self.validate_input(arg_field_obj, value);
					if (! validate_status.is_valid)
					{
						event_node_jqo.parent().addClass('devapt_validate_error');
						
						if ( Devapt.has_current_backend() )
						{
							Devapt.get_current_backend().notify_error(validate_status.error_label);
						}
					}
					else
					{
						event_node_jqo.parent().removeClass('devapt_validate_error');
						
						// EMIT CHANGE EVENTS
						self.fire_event('devapt.input.changed', [arg_field_obj, value_filled, value]);
						
						// TODO ON JOIN CHANGE
						// self.on_input_changed(arg_field_obj, value_filled, value);
					}
				}
			};
			
			
			
			
			
			
			// TODO GET PREFERRED INPUT
			// var preferred_inputs_array = arg_field_obj.preferred_inputs;
			
			
			
			
			
			// CREATE MAIN INPUT DIV
			var uid = self.name + '_' + arg_field_obj.name + '_' + Devapt.uid();
			var node_jqo = $('<div id="' + uid + '" style="display:block;float:none;">');
			// console.info(node_jqo, 'get_join_input.node with uid[' + uid + ']');
			
			var input_jqo = self.get_association_input_set(arg_deferred, node_jqo, arg_field_obj, arg_value, arg_access);
			input_jqo.on('change', change_cb);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return node_jqo;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinInputAssociation
		 * @desc				Get an input tag for the given joined field
		 * @param {object}		arg_deferred			deferred object
		 * @param {object}		arg_node_jqo			container node jquery object
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {string}		arg_value				field value
		 * @param {object}		arg_access				access object: {create:bool,read:bool,update:bool,delete:bool}
		 * @return {object}		jQuery node object
		 */
		get_association_input_lll: function(arg_deferred, arg_node_jqo, arg_field_obj, arg_value, arg_access)
		{
			var self = this;
			var context = 'get_association_input_set(deferred,node,field,value,access)';
			self.push_trace(self.trace, DevaptMixinInputAssociation.mixin_trace_input_association);
			self.enter(context, '');
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return input_jqo;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinInputAssociation
		 * @desc				Get an input tag for the given joined field
		 * @param {object}		arg_deferred			deferred object
		 * @param {object}		arg_node_jqo			container node jquery object
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {string}		arg_value				field value
		 * @param {object}		arg_access				access object: {create:bool,read:bool,update:bool,delete:bool}
		 * @return {object}		jQuery node object
		 */
		get_association_input_set: function(arg_deferred, arg_node_jqo, arg_field_obj, arg_value, arg_access)
		{
			var self = this;
			var context = 'get_association_input_set(deferred,node,field,value,access)';
			self.push_trace(self.trace, DevaptMixinInputAssociation.mixin_trace_input_association);
			self.enter(context, '');
			
			
			var icon_css = 'width:20px;height:20px;text-align:center;padding:0px';
			
			// var main_div_jqo = $('<div class="row collapse">');
			// var main_div_jqo = $('<div>');
			// node_jqo.append(main_div_jqo);
			// var input_div_icons_jqo = $('<div class="small-3 large-2 columns">');
			
			var table_jqo = $('<table style="margin:0px;padding:0px;">');
			arg_node_jqo.append(table_jqo);
			var tr_jqo = $('<tr style="margin:0px;padding:0px;">');
			table_jqo.append(tr_jqo);
			
			var input_div_icons_jqo = $('<div>');
			var td1_jqo = $('<td style="margin:0px;padding:0px;">');
			tr_jqo.append(td1_jqo);
			td1_jqo.append(input_div_icons_jqo);
			
			var input_jqo = $('<div style="margin:0px;padding:0px;">');
			var td2_jqo = $('<td style="margin:0px;padding:0px;">');
			tr_jqo.append(td2_jqo);
			td2_jqo.append(input_jqo);
			
			// CREATE
			if (arg_access.create)
			{
				var div_jqo = $('<div>');
				var create_jqo = $('<a href="#" class="devapt_icon_small" style="' + icon_css + '">&times;</a>');
				div_jqo.append(create_jqo);
				input_div_icons_jqo.append(div_jqo);
			}
			
			// DELETE
			if (arg_access['delete'])
			{
				var div_jqo = $('<div>');
				var delete_jqo = $('<a href="#" class="devapt_icon_small" style="' + icon_css + '">&plus;</a>');
				div_jqo.append(delete_jqo);
				input_div_icons_jqo.append(div_jqo);
			}
			
			// UPDATE
			if (arg_access.update)
			{
				// GET VALUES PROMISE
				var values_promise = arg_field_obj.get_available_values();
				values_promise.then(
					function(result)
					{
						// console.info(result, 'get_join_input.promise.result');
						
						// CHECK RESPONSE STATUS
						if (result.status !== 'ok')
						{
							input_jqo.text('Error during fetching');
							return;
						}
						
						// CREATE SELECT
						var select_jqo = $('<select style="margin:0px;padding:0px;">');
						input_jqo.append(select_jqo);
						
						// SET EVENTS HANDLES
						select_jqo.data('value_filled', arg_value);
						
						// FILL ITEMS
						for(var record_index = 0 ; record_index < result.count ; record_index++)
						{
							var record = result.records[record_index];
							var label = record[arg_field_obj.name];
							var option = $('<option>');
							
							select_jqo.append(option);
							
							option.text(label);
							if (label === arg_value)
							{
								option.attr('selected', '');
							}
						}
					}
				);
			}
			else
			{
				// RENDER ITEM
				if ( DevaptTypes.is_not_empty_str(self.items_format) )
				{
					self.step(context, 'items_format is a valid string');
					
					var content = DevaptTemplate.render(self.items_format, tags_object);
					self.render_item_text(arg_deferred, input_jqo, content);
				}
				else
				{
					self.step(context, 'items_format is a not valid string');
					
					var field_value = tags_object[field_name] ? tags_object[field_name] : field_def_obj.field_value.defaults;
					self.render_item_text(arg_deferred, input_jqo, field_value);
				}
			}
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return input_jqo;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinInputAssociation
		 * @desc				Handle a selection on a one to many link
		 * @param {object}		arg_deferred			deferred object
		 * @param {object}		arg_node_jqo			container node jquery object
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {object}		arg_item_jqo			selected node
		 * @param {integer}		arg_item_index			selected node index
		 * @return {nothing}
		 */
		on_one_to_many_select: function(arg_deferred, arg_node_jqo, arg_field_obj, arg_item_jqo, arg_item_index)
		{
			var self = this;
			var context = 'on_one_to_many_select(deferred,node,field,item,index)';
			self.push_trace(self.trace, DevaptMixinInputAssociation.mixin_trace_input_association);
			self.enter(context, '');
			
			
			// CONTAINER HANDLER
			self.select_item_node(arg_item_index);
			console.log('on_one_to_many_select');
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return input_jqo;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinInputAssociation
		 * @desc				Get an input tag for the given joined field
		 * @param {object}		arg_deferred			deferred object
		 * @param {object}		arg_node_jqo			container node jquery object
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {string}		arg_value				field value
		 * @param {object}		arg_access				access object: {create:bool,read:bool,update:bool,delete:bool}
		 * @return {object}		jQuery node object
		 */
		get_association_input_single_list: function(arg_deferred, arg_node_jqo, arg_field_obj, arg_value, arg_access)
		{
			var self = this;
			var context = 'get_association_input_single_list(deferred,node,field,value,access)';
			self.push_trace(self.trace, DevaptMixinInputAssociation.mixin_trace_input_association);
			self.enter(context, '');
			
			
			// CREATE LIST
			var input_jqo = $('<ul>');
			arg_node_jqo.append(self.input_jqo);
			input_jqo.addClass('side-nav');
			
			
			// GET VALUES PROMISE
			var values_promise = arg_field_obj.get_available_values();
			
			
			// FILL LIST
			values_promise.then(
				function(result)
				{
					// CHECK RESPONSE STATUS
					if (result.status !== 'ok')
					{
						input_jqo.text('Error during fetching');
						return;
					}
					
					// SET EVENTS HANDLES
					arg_node_jqo.data('value_filled', arg_value);
					
					// FILL ITEMS
					for(var record_index = 0 ; record_index < result.count ; record_index++)
					{
						var record = result.records[record_index];
						var label = record[arg_field_obj.name];
						var item_jqo = $('<li>');
						
						// APPEND ITEM
						input_jqo.append(item_jqo);
						
						// SET ITEM LABEL
						var a_jqo = $('<a href="#">');
						a_jqo.html(label);
						item_jqo.append(a_jqo);
						
						// HANDLE CLICK ON ITEM
						item_jqo.click(
							function()
							{
								var node_index = parseInt( item_jqo.index() );
								self.on_one_to_many_select(arg_deferred, arg_node_jqo, arg_field_obj, item_jqo, node_index);
							}
						);
						
						// IS SELECTED
						if (label === arg_value)
						{
							if ( item_jqo.attr('selected') )
							{
								item_jqo.attr('selected', '');
							}
						}
					}
				}
			);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return ul_jqo;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-01-04',
			'updated':'2015-01-06',
			'description':'Mixin methods for datas association input feature for containers.'
		}
	};
	
	
	/**
	 * @mixin				DevaptMixinInputAssociationClass
	 * @public
	 * @desc				Mixin of methods for datas form feature for containers
	 */
	var DevaptMixinInputAssociationClass = new DevaptClass('DevaptMixinInputAssociation', null, class_settings);
	
	// METHODS
	DevaptMixinInputAssociationClass.add_public_method('get_association_input', {}, DevaptMixinInputAssociation.get_association_input);
	DevaptMixinInputAssociationClass.add_public_method('get_association_input_set', {}, DevaptMixinInputAssociation.get_association_input_set);
	DevaptMixinInputAssociationClass.add_public_method('on_one_to_many_select', {}, DevaptMixinInputAssociation.on_one_to_many_select);
	
	// BUILD MIXIN CLASS
	DevaptMixinInputAssociationClass.build_class();
	
	
	return DevaptMixinInputAssociationClass;
}
);