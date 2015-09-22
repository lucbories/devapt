/**
 * @file        views/view/view-mixin-bind.js
 * @desc        Mixin for bind feature
 * 
 * 		[application.views.viewVVV]
 * 		on_event.e0.event='devapt.events.container.selected,devapt.events.container.unselected'
 * 		on_event.e0.log.level='ERROR'
 * 		on_event.e0.log.message='profile is selected/unselected'
 * 		on_event.e0.log.loggers='console'
 * 		
 * 		on_event.e1.event='devapt.events.container.selected'
 * 		on_event.e1.filter.mode='replace'
 * 		on_event.e1.filter.source.field='profiles_id_profile'
 * 		on_event.e1.filter.target.name='view_access_user_inspector_profiles_roles'
 * 		on_event.e1.filter.target.field='profiles_id_profile'
 * 		
 * 		on_event.e1.event='devapt.events.container.selected'
 * 		on_event.e1.value.mode='replace'
 * 		on_event.e1.value.target.name='view_access_user_inspector_profiles_roles'
 * 
 * @see			DevaptView
 * @ingroup     DEVAPT_VIEWS
 * @date        2014-08-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'core/traces', 'object/class', 'core/resources'],
function(Devapt, DevaptTypes, DevaptTraces, DevaptClass, DevaptResources)
{
	/**
	 * @mixin				DevaptMixinBind
	 * @public
	 * @desc				Mixin of template methods
	 */
	var DevaptMixinBind = 
	{
		/**
		 * @memberof			DevaptMixinBind
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_bind_trace: true,
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinBind
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_bind: function(self)
		{
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'mixin_init_bind()';
			self.enter(context, '');
			
			self.on_event_forwards = {};
			self.mixin_bind_initialized = false;
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
		},
		
		
		
		/* --------------------------------------------- ON EVENT BINDINGS ------------------------------------------------ */
		
		/**
		 * @public
		 * @memberof			DevaptMixinBind
		 * @desc				Enable bindings with 'on_event' setting
		 * 	application.views.ViewVVV.on_event: on event actions
		 * 		.EventEEE.log: trace a message
		 * 			level: log level string ('DEBUG', 'INFO', ...)
		 * 			message: string message to log
		 * 			template: string template to log
		 * 			loggers: list of loggers
		 * 		.EventEEE.do_crud: run a CRUD method on a model resource object
		 * 			TO BE DEFINED
		 * 		.EventEEE.do_method: run a resource object method
		 * 			object: object name
		 * 			method: method name
		 * 			operands: operands list of the method call with {1} for the first source event operand...
		 * 		.EventEEE.emit: emit an other event
		 * 			event: event name
		 * 			operands: operands list of the method call with {1} for the first source event operand...
		 * @return {promise}
		 */
		init_on_event: function()
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'init_on_event()';
			self.enter(context, '');
			
			
			// TEST IF AN OPTION IS SET
			if ( ! DevaptTypes.is_object(self.on_event) )
			{
				self.leave(context, 'no on_event bindings');
				self.pop_trace();
				return Devapt.promise_resolved();
			}
			
			// LOOP ON LINKS
			var all_bind_promises = [];
			for(var bind_key in self.on_event)
			{
				self.value(context, 'bind_key', bind_key);
				
				// GET LINK SETTINGS
				var bind_settings = self.on_event[bind_key];
				self.value(context, 'bind_settings', bind_settings);
				
				// INIT SETTING
				var setting_promise = self.init_on_event_setting(bind_settings);
				all_bind_promises.push(setting_promise);
			}
			
			// CREATE ALL PROMISE
			var promise = Devapt.promise_all(all_bind_promises);
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
			return promise;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinBind
		 * @desc				Add an 'on_event' binding
		 * @param {object}		arg_setting		'on_event' setting object
		 * @return {promise}
		 */
		init_on_event_setting: function(arg_setting)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'init_on_event_setting(setting)';
			self.enter(context, '');
			self.assert_object(context, 'setting', arg_setting);
			
			
			// CHECK EVENT NAME
			self.assert_true(context, 'event name', 'event' in arg_setting);
			self.assert_not_empty_string(context, 'event name', arg_setting['event']);
			var event_names = arg_setting['event'];
			self.value(context, 'event_names', event_names);
			event_names = event_names.split(',');
			
			// LOOP ON LINKS
			var all_bind_promises = [];
			for(var bind_action in arg_setting)
			{
				self.value(context, 'bind_action', bind_action);
				
				// SKIP EVENT NAME
				if (bind_action === 'event')
				{
					continue;
				}
				
				// GET LINK SETTINGS
				var action_settings = arg_setting[bind_action];
				self.value(context, 'action_settings', action_settings);
				
				// LOOP ON EVENTS
				for(var event_index in event_names)
				{
					var event_name = event_names[event_index];
					self.value(context, 'event_name', event_name);
					
					// SWITCH ON ACTION
					var setting_promise = null;
					switch(bind_action)
					{
						case 'forward':
						{
							// INIT SETTING
//							setting_promise = self.init_on_event_setting_forward(event_name, action_settings);
//							all_bind_promises.push(setting_promise);
							if ( ! DevaptTypes.is_array(self.on_event_forwards[event_name]) )
							{
								self.on_event_forwards[event_name] = [];
							}
							self.on_event_forwards[event_name].push(action_settings);
							break;
						}
						case 'log':
						{
							// INIT SETTING
							setting_promise = self.init_on_event_setting_log(event_name, action_settings);
							all_bind_promises.push(setting_promise);
							break;
						}
						case 'method':
						{
							// INIT SETTING
							setting_promise = self.init_on_event_setting_method(event_name, action_settings);
							all_bind_promises.push(setting_promise);
							break;
						}
						case 'value':
						{
							// INIT SETTING
							setting_promise = self.init_on_event_setting_value(event_name, action_settings);
							all_bind_promises.push(setting_promise);
							break;
						}
						case 'filter':
						{
							// INIT SETTING
							setting_promise = self.init_on_event_setting_filter(event_name, action_settings);
							all_bind_promises.push(setting_promise);
							break;
						}
						case 'do_crud':
						{
							break;
						}
						case 'emit':
						{
							break;
						}
					}
				}
			}
			
			// CREATE ALL PROMISE
			var promise = Devapt.promise_all(all_bind_promises);
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
			return promise;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinBind
		 * @desc				Add an 'on_event' log binding action
		 * @param {string|array}	arg_event_name	'on_event' event name
		 * @param {object}			arg_setting		'on_event' action setting object
		 * @return {promise}
		 */
		init_on_event_setting_log: function(arg_event_name, arg_setting)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'init_on_event_setting_log(event,setting)';
			self.enter(context, '');
			self.assert_not_null(context, 'event name', arg_event_name);
			self.assert_object(context, 'setting', arg_setting);
			self.assert_true(context, 'level', ('level' in arg_setting));
			self.assert_true(context, 'message', ('message' in arg_setting));
			self.assert_true(context, 'loggers', ('loggers' in arg_setting));
			
			
			// GET LOG LEVEL
			var level = arg_setting['level'];
			if ( ! DevaptTypes.is_not_empty_str(level) )
			{
				self.error(context, 'bad log level');
				self.leave(context, Devapt.msg_failure);
				self.pop_trace();
				return Devapt.promise_rejected();
			}
			
			// GET LOG MESSAGE
			var message = arg_setting['message'];
			if ( ! DevaptTypes.is_not_empty_str(message) )
			{
				self.error(context, 'bad log message');
				self.leave(context, Devapt.msg_failure);
				self.pop_trace();
				return Devapt.promise_rejected();
			}
			
			// GET LOG LOGGERS
			var loggers = arg_setting['loggers'];
			if ( ! DevaptTypes.is_not_empty_str(loggers) )
			{
				self.error(context, 'bad log loggers');
				self.leave(context, Devapt.msg_failure);
				self.pop_trace();
				return Devapt.promise_rejected();
			}
			loggers = loggers.split(',');
			
			// GET EVENT HAS UNIQUE CALLBACK
			var unique_event_callback = ('unique_event_callback' in arg_setting) ? DevaptTypes.to_boolean(arg_setting['unique_event_callback'], false) : false;
			
			// REGISTER ACTION
			var action_cb = function(arg_resource_obj)
			{
				return function(arg_event_obj, arg_source_obj, arg_event_operands)
				{
					return (
						function(arg_self, arg_loggers, arg_level, arg_event, arg_message)
						{
							self.step(context, 'ON ACTION CALLBACK');
	//						console.log(arguments, context + ':ON ACTION CALLBACK');
							
							// TODO format message with arg_event_operands and a template message
							var log_object = {
								level:arg_level,
								step:'',
								class_name:arg_self.class_name,
								object_name:arg_self.name,
								method_name:'on_event:',
								context: DevaptTypes.is_string(arg_event) ? arg_event : 'array of events',
								text:arg_message
							};
							
							DevaptTraces.log_appenders(log_object, arg_loggers);
							
							return true;
						}
					)(arg_resource_obj, loggers, level, arg_event_name, message);
				};
			};
			
			var promise = self.init_on_event_callback(self, arg_event_name, action_cb, unique_event_callback);
			
			
			self.leave(context, Devapt.msg_success_promise);
			self.pop_trace();
			return promise;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinBind
		 * @desc				Add an 'on_event' binding action with an event call
		 * @param {string|array}	arg_event_name	'on_event' event name
		 * @param {object}			arg_setting		'on_event' action setting object
		 * @return {promise}
		 */
		init_on_event_setting_method: function(arg_event_name, arg_setting)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'init_on_event_setting_method(event,setting)';
			self.enter(context, '');
			
			self.assert_not_null(context, 'event name', arg_event_name);
			self.assert_object(context, 'setting', arg_setting);
			
			self.assert_true(context, 'target', ('target' in arg_setting));
			
			self.assert_object(context, 'target', arg_setting['target']);
			
			self.assert_true(context, 'target.name', ('name' in arg_setting['target']));
			self.assert_not_empty_string(context, 'target.name', arg_setting['target']['name']);
			
			self.assert_true(context, 'target.method', ('method' in arg_setting['target']));
			self.assert_not_empty_string(context, 'target.method', arg_setting['target']['method']);
			
			
			
			// GET FILTER TARGET NAMES AND METHOD
			var target_names = arg_setting['target']['name'];
			target_names = target_names.split(',');
			var method_name = arg_setting['target']['method'];
			
			// GET EVENT HAS UNIQUE CALLBACK
			var unique_event_callback = ('unique_event_callback' in arg_setting) ? DevaptTypes.to_boolean(arg_setting['unique_event_callback'], false) : false;
			
			// REGISTER ACTION
			var action_cb = function(arg_resource_obj)
			{
				return function(arg_event_obj, arg_source_obj, arg_event_operands)
				{
					return (
						function(arg_target_obj, arg_event, arg_method_name)
						{
							self.step(context, 'ON ACTION CALLBACK');
	//						console.log(arguments, context + ':ON ACTION CALLBACK');
							
							// CHECK METHOD
							// console.log(arg_method_name, context + ':ON ACTION CALLBACK:method name');
							var method_cb = arg_method_name in arg_target_obj ? arg_target_obj[arg_method_name] : null;
							self.assert_function(context, 'method', method_cb);
							
							// GET EVENT OPERANDS MAP
							var args = arg_event_operands.length > 1 ? arg_event_operands.slice(1) : [];
							// console.log(record, context + ':ON ACTION CALLBACK:record');
							
							// CALL METHOD
							var result = arg_target_obj.do_callback([arg_target_obj, method_cb], args);
							// console.log(result, context + ':ON ACTION CALLBACK:do call result');
							result = null;
							
							return true;
						}
					)(arg_resource_obj, arg_event_name, method_name);
				};
			};
			
			
			// REGISTER ACTION CALLBACK
			var register_cb = function(arg_resource_obj)
			{
				self.step(context, 'REGISTER ACTION CALLBACK for event name [' + arg_event_name + ']');
				
				// CHECK METHOD
				var method_cb = method_name in arg_resource_obj ? arg_resource_obj[method_name] : null;
				self.assert_function(context, 'method', method_cb);
				
				return self.init_on_event_callback(arg_resource_obj, arg_event_name, action_cb, unique_event_callback);
			};
			
			// LOOP ON TARGETS NAMES
			self.step(context, 'LOOP ON TARGETS NAMES');
			var all_bind_promises = [];
			for(var target_name_key in target_names)
			{
				var target_name = target_names[target_name_key];
				
				self.step(context, 'loop on binding target name [' + target_name + ']');
				
				var loop_promise = DevaptResources.get_resource_instance(target_name);
				loop_promise.then(register_cb);
				
				all_bind_promises.push(loop_promise);
			}
			
			// CREATE ALL PROMISE
			var promise = Devapt.promise_all(all_bind_promises);
			
			
			self.leave(context, Devapt.msg_success_promise);
			self.pop_trace();
			return promise;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinBind
		 * @desc				Add an 'on_event' value binding action
		 * @param {string|array}	arg_event_name	'on_event' event name
		 * @param {object}			arg_setting		'on_event' action setting object
		 * @return {promise}
		 */
		init_on_event_setting_value: function(arg_event_name, arg_setting)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'init_on_event_setting_value(event,setting)';
			self.enter(context, '');
			
			self.assert_not_null(context, 'event name', arg_event_name);
			self.assert_object(context, 'setting', arg_setting);
			
			self.assert_true(context, 'mode', ('mode' in arg_setting));
			self.assert_true(context, 'target', ('target' in arg_setting));
			
			self.assert_object(context, 'target', arg_setting['target']);
			
			self.assert_not_empty_string(context, 'mode', arg_setting['mode']);
			
			self.assert_true(context, 'target.name', ('name' in arg_setting['target']));
			self.assert_not_empty_string(context, 'target.name', arg_setting['target']['name']);
			
			
			
			// GET FILTER MODE
			var mode = arg_setting['mode'];
			// TOOD DEFINE OTHERS VALUE MODES : REPLACE, APPEND, REMOVE, MERGE...
			// console.log(arg_setting, context + ':settings')
			self.assert_true(context, 'mode', mode === 'replace');
				
			// GET FILTER TARGET NAMES
			var target_names = arg_setting['target']['name'];
			target_names = target_names.split(',');
			
			// GET EVENT HAS UNIQUE CALLBACK
			var unique_event_callback = ('unique_event_callback' in arg_setting) ? DevaptTypes.to_boolean(arg_setting['unique_event_callback'], false) : false;
			
			// REGISTER ACTION
			var action_cb = function(arg_resource_obj)
			{
				return function(arg_event_obj, arg_source_obj, arg_event_operands)
				{
					return (
						function(arg_self, arg_event)
						{
							self.step(context, 'ON ACTION CALLBACK');
	//						console.log(arguments, context + ':ON ACTION CALLBACK');
							
							// CHECK METHOD
							var set_value_cb = 'set_value' in arg_resource_obj ? arg_resource_obj['set_value'] : null;
							self.assert_function(context, 'set_value', set_value_cb);
							console.log(arg_resource_obj, context + ':ON ACTION CALLBACK:arg_resource_obj');
							
							// GET SOURCE OBJECT
							// var source_object = arg_event_operands[0];
							// console.log(source_object.name, context + 'ON ACTION CALLBACK:source_object');
							
							// GET EVENT OPERANDS MAP
							var event_opds_map = arg_event_operands[1];
							console.log(event_opds_map, context + ':ON ACTION CALLBACK:event_opds_map');
							debugger;
							// GET RECORD
							// TODO CONFIGURE THE OPERAND NAME TO GET FROM THE MAP
							var item_record = null;
							item_record = item_record || ('record' in event_opds_map) ? event_opds_map.record : null;
							item_record = item_record || ('content' in event_opds_map) ? event_opds_map.content : null;
							item_record = item_record || ('value' in event_opds_map) ? event_opds_map.value : null;
							console.log(item_record, context + 'ON ACTION CALLBACK:record');
							
							// CALL METHOD
							if (item_record)
							{
								arg_resource_obj.set_value(item_record);
							}
							
							return true;
						}
					)(arg_resource_obj, arg_event_name);
				};
			};
			
			
			// REGISTER ACTION CALLBACK
			var register_cb = function(arg_resource_obj)
			{
				self.step(context, 'REGISTER ACTION CALLBACK for event name [' + arg_event_name + ']');
				
				// CHECK METHOD
				var set_value_cb = 'set_value' in arg_resource_obj ? arg_resource_obj['set_value'] : null;
				self.assert_function(context, 'set_value', set_value_cb);

				return self.init_on_event_callback(arg_resource_obj, arg_event_name, action_cb, unique_event_callback);
			};
			
			// LOOP ON TARGETS NAMES
			self.step(context, 'LOOP ON TARGETS NAMES');
			var all_bind_promises = [];
			for(var target_name_key in target_names)
			{
				var target_name = target_names[target_name_key];
				
				self.step(context, 'loop on binding target name [' + target_name + ']');
				
				var loop_promise = DevaptResources.get_resource_instance(target_name);
				loop_promise.then(register_cb);
				
				all_bind_promises.push(loop_promise);
			}
			
			// CREATE ALL PROMISE
			var promise = Devapt.promise_all(all_bind_promises);
			
			
			self.leave(context, Devapt.msg_success_promise);
			self.pop_trace();
			return promise;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinBind
		 * @desc				Add an 'on_event' filter binding action
		 * @param {string|array}	arg_event_name	'on_event' event name
		 * @param {object}			arg_setting		'on_event' action setting object
		 * @return {promise}
		 */
		init_on_event_setting_filter: function(arg_event_name, arg_setting)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'init_on_event_setting_filter(event,setting)';
			self.enter(context, '');
			
			self.assert_not_null(context, 'event name', arg_event_name);
			self.assert_object(context, 'setting', arg_setting);
			
			self.assert_true(context, 'mode', ('mode' in arg_setting));
			self.assert_true(context, 'source', ('source' in arg_setting));
			self.assert_true(context, 'target', ('target' in arg_setting));
			
			self.assert_object(context, 'source', arg_setting['source']);
			self.assert_object(context, 'target', arg_setting['target']);
			
			self.assert_not_empty_string(context, 'mode', arg_setting['mode']);
			
			self.assert_true(context, 'source.field', ('field' in arg_setting['source']));
			self.assert_not_empty_string(context, 'source.field', arg_setting['source']['field']);
			
			self.assert_true(context, 'target.name', ('name' in arg_setting['target']));
			self.assert_not_empty_string(context, 'target.name', arg_setting['target']['name']);
			self.assert_true(context, 'target.field', ('field' in arg_setting['target']));
			self.assert_not_empty_string(context, 'target.field', arg_setting['target']['field']);
			
			
			// GET FILTER MODE
			var mode = arg_setting['mode'];
			
			// GET FILTER SOURCE FIELD
			var source_field = arg_setting['source']['field'];
			
			// GET FILTER TARGET NAMES
			var target_names = arg_setting['target']['name'];
			target_names = target_names.split(',');
			
			// GET FILTER TARGET FIELD
			var target_field = arg_setting['target']['field'];
			
			// GET EVENT HAS UNIQUE CALLBACK
			var unique_event_callback = ('unique_event_callback' in arg_setting) ? DevaptTypes.to_boolean(arg_setting['unique_event_callback'], false) : false;
			
			
			// ACTION CALLBACK
			var action_cb = function(arg_resource_obj)
			{
				return function(arg_event_obj, arg_source_obj, arg_event_operands)
				{
					return (
						function(arg_closure_self, arg_closure_resource_obj)
						{
							var context = 'init_on_event_setting_filter.callback(' + arg_closure_resource_obj.name + ')';
							
//							arg_closure_self.trace=true;
							arg_closure_self.step(context, 'ON ACTION CALLBACK');
							
//							console.log(arguments, context + ':ON ACTION CALLBACK');
//							console.log(mode, context + ':ON ACTION CALLBACK:mode');
//							console.log(target_names, context + ':ON ACTION CALLBACK:target_names');
//							console.log(source_field, context + ':ON ACTION CALLBACK:source_field');
//							console.log(target_field, context + ':ON ACTION CALLBACK:target_field');
//							console.log(unique_event_callback, context + ':ON ACTION CALLBACK:unique_event_callback');
							
							// TARGET OBJECT
//							console.log(arg_resource_obj.name, context + 'ON ACTION CALLBACK:target');
							
							// GET SOURCE OBJECT
							// var source_object = arg_event_operands[0];
//							console.log(source_object.name, context + 'ON ACTION CALLBACK:source_object');
							
							// GET EVENT OPERANDS MAP
							var event_opds_map = arg_event_operands[1];
//							console.log(event_opds_map, context + 'ON ACTION CALLBACK:event_opds_map');
							
							// GET RECORD
							var item_record = event_opds_map['record'];
							console.log(item_record, context + 'ON ACTION CALLBACK:record');
							
							// ADD FILTER
							arg_closure_self.step(context, 'ON ACTION CALLBACK:add field value filter');
							var filter_added_promise = arg_resource_obj.view_model_promise.then(
								function(arg_view_model)
								{
									arg_closure_self.step(context, 'ON ACTION CALLBACK:view model is found');
									
//									arg_view_model.trace=true;
									
									// GET MODEL RECORD FOR CURRENT SELECTED ITEM
									var record_promise = arg_closure_self.view_model_promise.then(
										function(arg_self_view_model)
										{
//											arg_self_view_model.trace=true;
											
											return arg_self_view_model.get_first_record_by_object(item_record);
										}
									);
									
									return record_promise.then(
										function(record)
										{
											// TODO NEWLY CREATED ITEM
											if (!record)
											{
												return Devapt.promise_rejected();
											}
											
											arg_closure_self.value(context, 'recordset record', record);
											arg_closure_self.assert_object(context, 'record', record);
											arg_closure_self.assert_true(context, 'record.is_record', record.is_record);
											
											// GET FIELD VALUE
											arg_closure_self.step(context, 'get field value');
											var field_value = event_opds_map['field_value'] ? event_opds_map['field_value'] : record.get(source_field);
//											console.log(field_value, context + 'ON ACTION CALLBACK:field_value');
											
											
											return arg_view_model.ready_promise.spread(
												function(arg_model, arg_view)
												{
													arg_closure_self.step(context, 'ON ACTION CALLBACK:model and view are found');
													
													arg_closure_self.step(context, 'view_model is ready');
													var replace = mode === 'replace';
													arg_view_model.recordset.add_field_value_filter(target_field, field_value, replace);
													arg_view_model.set_linked_record(record);
												}
											);
										}
									);
								}
							);
							
							filter_added_promise.then(
								function()
								{
									arg_closure_self.step(context, 'filter is added');
									
									arg_resource_obj.on_recordset_filter_change();
								}
							);
							
//							arg_closure_self.trace=false;
							return true;
						}
					)(self, arg_resource_obj);
				};
			};
			
			// REGISTER ACTION CALLBACK
			var register_cb = function(arg_resource_obj)
			{
				self.step(context, 'REGISTER ACTION CALLBACK for event name [' + arg_event_name + ']');
				
				return self.init_on_event_callback(arg_resource_obj, arg_event_name, action_cb, unique_event_callback);
			};
			
			// LOOP ON TARGETS NAMES
			var all_bind_promises = [];
			for(var target_name_key in target_names)
			{
				var target_name = target_names[target_name_key];
				
				self.step(context, 'loop on binding target name [' + target_name + ']');
				
				var loop_promise = DevaptResources.get_resource_instance(target_name);
				loop_promise.then(register_cb);
				
				all_bind_promises.push(loop_promise);
			}
			
			// CREATE ALL PROMISE
			var promise = Devapt.promise_all(all_bind_promises);
			
			
			self.leave(context, Devapt.msg_success_promise);
			self.pop_trace();
			return promise;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinBind
		 * @desc				Add an 'on_event' forward binding action
		 * @param {string|array}	arg_event_name	'on_event' event name
		 * @param {object}			arg_callback	'on_event' action callback
		 * @param {boolean}			arg_unique		'on_event' action is a unique callback for this event
		 * @param {object}			arg_setting		'on_event' forward setting object
		 * @return {promise}
		 */
		init_on_event_setting_forward: function(arg_event_name, arg_callback, arg_unique, arg_setting)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'init_on_event_setting_forward(event,setting)';
			self.enter(context, '');
			
			
			// CHECK ARG: EVENT NAME
			self.assert_not_null(context, 'event name', arg_event_name);
			
			// CHECK ARG: EVENT ACTION CALLBACK
			self.assert_function(context, 'event action callback', arg_callback);
			
			// CHECK ARG: EVENT LISTENER IS UNIQUE
			self.assert_true(context, 'listener is unique', DevaptTypes.is_boolean(arg_unique) );
			
			// CHECK ARG: FORWARD SETTINGS
			self.assert_object(context, 'setting', arg_setting);
			
			self.assert_true(context, 'source', ('source' in arg_setting));
			self.assert_true(context, 'target', ('target' in arg_setting));
			
			self.assert_object(context, 'source', arg_setting['source']);
			self.assert_object(context, 'target', arg_setting['target']);
			
			self.assert_true(context, 'source.name', ('name' in arg_setting['source']));
			self.assert_not_empty_string(context, 'source.name', arg_setting['source']['name']);
			
			self.assert_true(context, 'target.name', ('name' in arg_setting['target']));
			self.assert_not_empty_string(context, 'target.name', arg_setting['target']['name']);
			
			
			// GET FILTER SOURCE NAMES
			var source_names = arg_setting['source']['name'];
			source_names = source_names.split(',');
			self.value(context, 'source_names', source_names);
			
			
			// TEST IF CURRENT OBJECT IS IN THE ENABLED SOURCES OBJECTS
			var source_is_found = false;
			for(var source_name_key in source_names)
			{
				var source_name = source_names[source_name_key];
				self.step(context, 'TEST IF CURRENT OBJECT IS IN THE ENABLED SOURCES OBJECTS at [' + source_name + ']');
						
				if (self.name === source_name)
				{
					self.step(context, 'TEST IF CURRENT OBJECT IS IN THE ENABLED SOURCES OBJECTS: found');
					source_is_found = true;
					break;
				}
			}
			if (!source_is_found)
			{
				self.step(context, 'TEST IF CURRENT OBJECT IS IN THE ENABLED SOURCES OBJECTS: not found');
				
				self.leave(context, Devapt.msg_success_promise);
				return Devapt.promise_resolved();
			}
			
			
			// GET FILTER TARGET NAMES
			var target_names = arg_setting['target']['name'];
			target_names = target_names.split(',');
			self.value(context, 'target_names', target_names);
			
			
			
			// LOOP ON TARGET NAMES
			var all_bind_promises = [];
			for(var target_name_key in target_names)
			{
				var target_name = target_names[target_name_key];
				
				self.step(context, 'loop on binding target name [' + target_name + ']');
				
				var promise = DevaptResources.get_resource_instance(target_name);
				promise.then(
					function(arg_target_obj)
					{
						self.step(context, 'REGISTER FORWAD ACTION CALLBACK for target [' + arg_target_obj.name + ']');
						
						var loop_promise = self.init_on_event_callback(arg_target_obj, arg_event_name, arg_callback, arg_unique);
						all_bind_promises.push(loop_promise);
					}
				);
			}
			
			// CREATE ALL PROMISE
			var all_promise = Devapt.promise_all(all_bind_promises);
			
			
			self.leave(context, Devapt.msg_success_promise);
			self.pop_trace();
			return all_promise;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinBind
		 * @desc				Register an event binding action callback
		 * @param {object}			arg_target_obj	'on_event' target object
		 * @param {string|array}	arg_event_name	'on_event' event name(s)
		 * @param {function}		arg_callback	'on_event' action callback with the 
		 * @param {boolean}			arg_unique		'on_event' action is a unique callback for this event
		 * @return {promise}
		 */
		init_on_event_callback: function(arg_target_obj, arg_event_name, arg_callback, arg_unique)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'init_on_event_callback(target,event,callback,unique)';
			self.enter(context, '');
			
			
			// CHECK ARGS
			self.assert_object(context, 'arg_target_obj', arg_target_obj);
			self.assert_not_empty_string(context, 'arg_event_name', arg_event_name);
			self.assert_function(context, 'arg_callback', arg_callback);
			arg_unique = DevaptTypes.to_boolean(arg_unique, false);
			
			
			if ( DevaptTypes.is_object(arg_target_obj.on_event_forwards) )
			{
				self.step(context, 'TARGET OBJECT HAS FORWARDS ?');
				
				var has_event_forward = (arg_event_name in arg_target_obj.on_event_forwards) && DevaptTypes.is_not_empty_array( arg_target_obj.on_event_forwards[arg_event_name] );
				var has_all_forward = ('*' in arg_target_obj.on_event_forwards) && DevaptTypes.is_not_empty_array( arg_target_obj.on_event_forwards['*'] );
				
				// DEBUG
				self.value(context, 'has_event_forward', has_event_forward);
				self.value(context, 'has_all_forward', has_all_forward);
//				console.log(arg_target_obj.on_event_forwards, 'arg_target_obj.on_event_forwards');
				
				var all_promises = [];
				
				// PROCESS GIVEN EVENT FORWARD
				if (has_event_forward)
				{
					self.step(context, 'REGISTER ACTION CALLBACK with event forwards for [' + arg_event_name + ']');
					
					var forwards_settings = arg_target_obj.on_event_forwards[arg_event_name];
					
					// LOOP ON FORWARDS SETTINGS
					for(var forward_index in forwards_settings)
					{
						self.step(context, 'REGISTER ACTION CALLBACK with event forward at [' + forward_index + ']');
						
						var forward_settings = forwards_settings[forward_index];
						
						var setting_promise = self.init_on_event_setting_forward(arg_event_name, arg_callback, arg_unique, forward_settings);
						all_promises.push(setting_promise);
					}
				}
				
				// PROCESS ALL EVENTS FORWARD
				if (has_all_forward)
				{
					self.step(context, 'REGISTER ACTION CALLBACK with all events forwards for [' + '*' + ']');
					
					var all_forwards_settings = arg_target_obj.on_event_forwards['*'];
					
					// LOOP ON FORWARDS SETTINGS
					for(var forward_index in all_forwards_settings)
					{
						self.step(context, 'REGISTER ACTION CALLBACK with all forward at [' + forward_index + ']');
						
						var loop_forward_settings = all_forwards_settings[forward_index];
						
						var loop_setting_promise = self.init_on_event_setting_forward('*', arg_callback, arg_unique, loop_forward_settings);
						all_promises.push(loop_setting_promise);
					}
				}
				
				if (all_promises.length > 0)
				{
					var promise = Devapt.promise_all(all_promises);
					
					self.leave(context, Devapt.msg_success_promise);
					self.pop_trace();
					return promise;
				}
			}
			
			
			// DEFINE ON EVENT CALLBACK
			var on_event_cb = function(arg_cb_event_obj, arg_cb_source_obj, arg_cb_opd_record)
			{
				return (
					function(arg_self, target_obj, event_obj, source_obj, opd_record)
					{
						arg_self.step(context, 'ON EVENT CALLBACK');
						
//						console.log(arg_self.name, 'ON EVENT CALLBACK: self');
//						console.log(event_obj.name, 'ON EVENT CALLBACK: event');
//						console.log(source_obj.name, 'ON EVENT CALLBACK: source');
//						console.log(target_obj.name, 'ON EVENT CALLBACK: target');
//						console.log(opd_record, 'ON EVENT CALLBACK: opds');
						
						var operands = [source_obj, opd_record];
		//				console.log(operands, context + ':bind.cb.operands for event [' + arg_event_name + ']');
						
						if ( target_obj.is_view )
						{
							arg_self.step(context, 'target object is a view');
							
							if ( target_obj.is_render_state_rendering() )
							{
								arg_self.step(context, 'view is rendering (wait)');
								
								var target_render_promise = Devapt.promise(target_obj.mixin_renderable_defer);
								
								return target_render_promise.then(
									function(arg_rendered_view)
									{
										arg_self.step(context, 'target object is a view and is ready to process bind');
										return arg_callback(arg_rendered_view)(event_obj, source_obj, operands);
									}
								);
							}
						}
						
						arg_self.step(context, 'run event callback without waiting for rendering for target [' + target_obj.name + ']');
//						console.log(target_obj.name, context + 'run event callback without waiting for rendering for target');
						
						return arg_callback(target_obj)(event_obj, source_obj, operands);
					}
				)(self, arg_target_obj, arg_cb_event_obj, arg_cb_source_obj, arg_cb_opd_record);
			};
			
			// ADD EVENT CALLBACK
			self.step(context,'add event callback for [' + arg_event_name + ']');
			self.step(context,'event callback is unique ? [' + arg_unique + ']');
			var bool_result = false;
			if ( DevaptTypes.is_not_empty_string(arg_event_name) )
			{
				bool_result = self.add_event_callback(arg_event_name, on_event_cb, arg_unique);
			}
			else if ( DevaptTypes.is_not_empty_array(arg_event_name) )
			{
				for(var event_name_key in arg_event_name)
				{
					var event_name = arg_event_name[event_name_key];
					bool_result = self.add_event_callback(event_name, on_event_cb, arg_unique);
					if (!bool_result)
					{
						break;
					}
				}
			}
			
			self.step(context,'create promise with result [' + bool_result + '] for target [' + arg_target_obj.name + ']');
			var result_promise = bool_result ? Devapt.promise_resolved() : Devapt.promise_rejected();
			
			
			self.leave(context, bool_result ? Devapt.msg_success_promise : Devapt.msg_failure_promise);
			self.pop_trace();
			return result_promise;
		},
		
		
		
		/* --------------------------------------------- ENABLE BINDINGS ------------------------------------------------ */
		
		/**
		 * @public
		 * @memberof			DevaptMixinBind
		 * @desc				Enable bindings
		 * @return {promise}
		 */
		enable_bindings: function()
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'enable_bindings()';
			self.enter(context, '');
			
			
			// CHECK IF ALREADY INITIALIZED
			if (self.mixin_bind_initialized)
			{
				self.leave(context, Devapt.msg_success_promise);
				self.pop_trace();
				return Devapt.promise_resolved();
			}
			
			// ENABLE 'on_event' BINDINGS
			self.mixin_bind_initialized = true;
			var promise = self.init_on_event();
			promise.then(
				function()
				{
					self.fire_event('devapt.render.bind_finished', []);
				}
			);
			
			
			self.leave(context, Devapt.msg_success_promise);
			self.pop_trace();
			return promise;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-14',
			'updated':'2015-05-23',
			'description':'Mixin methods for bindings features.'
		}
	};
	var DevaptMixinBindClass = new DevaptClass('DevaptMixinBind', null, class_settings);
	
	// METHODS
	DevaptMixinBindClass.infos.ctor = DevaptMixinBind.mixin_init_bind;
	
	DevaptMixinBindClass.add_public_method('init_on_event', {}, DevaptMixinBind.init_on_event);
	DevaptMixinBindClass.add_public_method('init_on_event_setting', {}, DevaptMixinBind.init_on_event_setting);
	DevaptMixinBindClass.add_public_method('init_on_event_setting_log', {}, DevaptMixinBind.init_on_event_setting_log);
	DevaptMixinBindClass.add_public_method('init_on_event_setting_method', {}, DevaptMixinBind.init_on_event_setting_method);
	DevaptMixinBindClass.add_public_method('init_on_event_setting_value', {}, DevaptMixinBind.init_on_event_setting_value);
	DevaptMixinBindClass.add_public_method('init_on_event_setting_filter', {}, DevaptMixinBind.init_on_event_setting_filter);
	DevaptMixinBindClass.add_public_method('init_on_event_setting_forward', {}, DevaptMixinBind.init_on_event_setting_forward);
	DevaptMixinBindClass.add_public_method('init_on_event_callback', {}, DevaptMixinBind.init_on_event_callback);
	
	DevaptMixinBindClass.add_public_method('enable_bindings', {}, DevaptMixinBind.enable_bindings);
	
	// PROPERTIES
	DevaptMixinBindClass.add_public_object_property('on_event',				'', null, false, false, []);
	
	// BUID MIXIN CLASS
	DevaptMixinBindClass.build_class();
	
	
	return DevaptMixinBindClass;
}
);