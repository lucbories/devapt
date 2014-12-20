/**
 * @file        factory.js
 * @desc        Foundation 5 Devapt factory
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-06-16
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types'],
function(Devapt, DevaptTraces, DevaptTypes)
{
	/**
	 * @memberof	DevaptFactory
	 * @public
	 * @class
	 * @desc		Devapt Foundation5 backend container
	 */
	var DevaptFactory = function() {};
	
	
	/**
	 * @memberof	DevaptFactory
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptFactory.factory_trace = false;
	
	
	
	/**
	 * @memberof				DevaptFactory
	 * @public
	 * @static
	 * @method					DevaptFactory.build_from_declaration(arg_resource_json)
	 * @desc					Build a resource from its json declaration (async)
	 * @param {string}			arg_resource_json	resource declaration (JSON)
	 * @param {string}			arg_backend_path	backend relative path
	 * @return {object}			A promise of a resource
	 */
	DevaptFactory.build_from_declaration = function(arg_resource_json, arg_backend_path)
	{
		var context = 'DevaptFactory.build_from_declaration(resource_json,backend path)';
		DevaptTraces.trace_enter(context, '', DevaptFactory.factory_trace);
		
		
		// CREATE MAIN DEFERRED OBJECT
		var master_deferred = $.Deferred();
		
		
		// GET MAIN PROMISE
		var promise = master_deferred.promise();
		
		
		// CHECK RESOURCE CLASS TYPE
		if ( ! DevaptTypes.is_not_empty_str(arg_resource_json.class_type) )
		{
			// REJECT DEFERRED
			master_deferred.reject();
			
			DevaptTraces.trace_leave(context, 'promise is rejected: no class_type attribute', DevaptFactory.factory_trace);
			return promise;
		}
		
		
		// SWITHC ON RESOURCE CLASS TYPE
		switch(arg_resource_json.class_type)
		{
			case 'menubar':
			case 'view':
			{
				DevaptTraces.trace_step(context, 'resource class_type is [' + arg_resource_json.class_type + ']', DevaptFactory.factory_trace);
				DevaptTraces.trace_var(context, 'class_name', arg_resource_json.class_name, DevaptFactory.factory_trace);
				
				
				// GET RESOURCE DEPENDENCIES
				var view_requires = DevaptFactory.get_class_require(arg_resource_json.class_name, arg_backend_path);
				
				
				// CREATE VIEW
				if ( DevaptTypes.is_not_empty_array(view_requires) )
				{
					DevaptTraces.trace_step(context, 'resource class_name is [' + arg_resource_json.class_name + ']', DevaptFactory.factory_trace);
					
					var view_name = arg_resource_json.name;
					
					
					// ASYNC LOAD OF DEPENDENCIES
					require(view_requires,
						function(ViewClass) 
						{
							DevaptTraces.trace_enter(context + '.dependencies are loaded', '', DevaptFactory.factory_trace);
							
							
							// CREATE VIEW
							var container_jqo = (arg_resource_json.class_name === 'Menubar') ? $('body header') : null; // TODO;
							// console.log(container_jqo, 'container_jqo from factory');
							arg_resource_json.parent_jqo = container_jqo;
							// console.log(arg_resource_json, 'arg_resource_json from factory');
							var view = ViewClass.create(view_name, arg_resource_json);
							
							// RESOLVE DEFERRED
							master_deferred.resolve(view);
							
							DevaptTraces.trace_leave(context + '.dependencies are loaded', 'promise is resoved: [' + view_name + '] resource is build', DevaptFactory.factory_trace);
							return;
						}
					);
					
					
					DevaptTraces.trace_leave(context, '[' + view_name + '] async resource build', DevaptFactory.factory_trace);
					return promise;
				}
				
				break;
			}
			
			case 'model':
			{
				DevaptTraces.trace_step(context, 'resource class_type is model', DevaptFactory.factory_trace);
				
				var model_name = arg_resource_json.name;
				
				require(['datas/model'],
					function(ModelClass) 
					{
						DevaptTraces.trace_enter(context + '.dependencies are loaded', '', DevaptFactory.factory_trace);
						
						// CREATE MODEL
						var model = ModelClass.create(model_name, arg_resource_json);
						
						// RESOLVE DEFERRED
						master_deferred.resolve(model);
						
						DevaptTraces.trace_leave(context + '.dependencies are loaded', 'promise is resoved: [' + model_name + '] resource is build', DevaptFactory.factory_trace);
						return;
					}
				);
			
				DevaptTraces.trace_leave(context, '[' + model_name + '] async resource build', DevaptFactory.factory_trace);
				return promise;
			}
		}
		
		
		// REJECT DEFERRED
		master_deferred.reject();
		
		
		DevaptTraces.trace_leave(context, 'promise is rejected: resource type not found', DevaptFactory.factory_trace);
		return promise;
	}
	
	
	
	/**
	 * @memberof				DevaptFactory
	 * @public
	 * @static
	 * @method					DevaptFactory.get_class_require(arg_class_name)
	 * @desc					Get resource dependencies
	 * @param {string}			arg_class_name		resource class name
	 * @param {string}			arg_backend_path	backend relative path
	 * @return {array}			array of require file paths
	 */
	DevaptFactory.get_class_require = function(arg_class_name, arg_backend_path)
	{
		var context = 'DevaptFactory.get_class_require(class name,path)';
		DevaptTraces.trace_enter(context, '', DevaptFactory.factory_trace);
		
		
		// INIT DENPEDENCIES ARRAY
		var view_requires = [];
		
		// CHECK CLASS NAME
		if ( ! DevaptTypes.is_not_empty_str(arg_class_name) )
		{
			DevaptTraces.trace_var(context, 'resource bad class name', arg_class_name, DevaptFactory.factory_trace);
			DevaptTraces.trace_leave(context, 'resource bad class name', DevaptFactory.factory_trace);
			return view_requires;
		}
		
		// SWITCH CLASS NAME
		switch(arg_class_name)
		{
			// CORE CLASSES
			
			case 'View':
			{
				view_requires = ['views/view'];
				break;
			}
			
			case 'IncludeView':
			case 'TemplateView':
			{
				view_requires = ['views/remote'];
				break;
			}
			
			case 'Input':
			{
				view_requires = ['views/input'];
				break;
			}
			
			
			// BACKEND VIEW CLASSES
			
			case 'Label':
			{
				view_requires = [arg_backend_path + '/views/label'];
				break;
			}
			
			case 'Button':
			{
				view_requires = [arg_backend_path + '/views/button'];
				break;
			}
			
			case 'ButtonGroup':
			{
				view_requires = [arg_backend_path + '/views/button-group'];
				break;
			}
			
			case 'ButtonBar':
			{
				view_requires = [arg_backend_path + '/views/button-bar'];
				break;
			}
			
			case 'Image':
			{
				view_requires = [arg_backend_path + '/views/image'];
				break;
			}
			
			case 'Breadcrumbs':
			{
				view_requires = [arg_backend_path + '/views/breadcrumbs'];
				break;
			}
			
			case 'Panel':
			{
				view_requires = [arg_backend_path + '/views/panel'];
				break;
			}
			
			case 'Menubar':
			{
				view_requires = [arg_backend_path + '/views/menubar'];
				break;
			}
			
			case 'Pagination':
			{
				view_requires = [arg_backend_path + '/views/pagination'];
				break;
			}
			
			
			// BACKEND CONTAINER CLASSES
			
			case 'Row':
			{
				view_requires = [arg_backend_path + '/containers/row'];
				break;
			}
			
			case 'List':
			{
				view_requires = [arg_backend_path + '/containers/list'];
				break;
			}
			
			case 'NavMenu':
			{
				view_requires = [arg_backend_path + '/containers/navmenu'];
				break;
			}
			
			
			case 'Dropdown':
			{
				view_requires = [arg_backend_path + '/containers/dropdown'];
				break;
			}
			
			case 'Tabs':
			{
				view_requires = [arg_backend_path + '/containers/tabs'];
				break;
			}
			
			case 'Accordion':
			{
				view_requires = [arg_backend_path + '/containers/accordion'];
				break;
			}
			
			case 'Table':
			{
				view_requires = [arg_backend_path + '/containers/table'];
				break;
			}
			
			case 'HBox':
			{
				view_requires = [arg_backend_path + '/containers/hbox'];
				break;
			}
			
			case 'VBox':
			{
				view_requires = [arg_backend_path + '/containers/vbox'];
				break;
			}
			
			case 'PGrid':
			{
				view_requires = [arg_backend_path + '/containers/pgrid'];
				break;
			}
			
			case 'RCGrid':
			{
				view_requires = [arg_backend_path + '/containers/rcgrid'];
				break;
			}
			
			
			default:
			{
				DevaptTraces.trace_leave(context, 'resource type not found', DevaptFactory.factory_trace);
				return view_requires;
			}
		}
		
		
		DevaptTraces.trace_leave(context, 'resource class found', DevaptFactory.factory_trace);
		return view_requires;
	}
	
	
	return DevaptFactory;
} );