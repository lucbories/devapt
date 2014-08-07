/**
 * @file        backend-foundation5/factory.js
 * @desc        Foundation 5 Devapt factory
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-06-16
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTraces, DevaptTypes, undefined)
{
	/**
	 * @memberof	DevaptFoundation5Factory
	 * @public
	 * @class
	 * @desc		Devapt Foundation5 backend container
	 */
	var DevaptFoundation5Factory = function() {};
	
	
	/**
	 * @memberof	DevaptFoundation5Factory
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptFoundation5Factory.factory_trace = false;
	
	
	/**
	 * @memberof	DevaptFoundation5Factory
	 * @public
	 * @static
	 * @desc		Backend path
	 */
	DevaptFoundation5Factory.factory_backend_path = 'backend-foundation5';
	
	
	
	/**
	 * @memberof				DevaptFoundation5Factory
	 * @public
	 * @static
	 * @method					DevaptFoundation5Factory.build_from_declaration(arg_resource_json)
	 * @desc					Build a resource from its json declaration (async)
	 * @return {object}			A promise of a resource
	 */
	DevaptFoundation5Factory.build_from_declaration = function(arg_resource_json)
	{
		var context = 'DevaptFoundation5Factory.build_from_declaration(resource_json)';
		DevaptTraces.trace_enter(context, '', DevaptFoundation5Factory.factory_trace);
		
		
		// CREATE MAIN DEFERRED OBJECT
		var master_deferred = $.Deferred();
		
		
		// GET MAIN PROMISE
		var promise = master_deferred.promise();
		
		
		// CHECK RESOURCE CLASS TYPE
		if ( ! DevaptTypes.is_not_empty_str(arg_resource_json.class_type) )
		{
			// REJECT DEFERRED
			master_deferred.reject();
			
			DevaptTraces.trace_leave(context, 'promise is rejected: no class_type attribute', DevaptFoundation5Factory.factory_trace);
			return promise;
		}
		
		
		// SWITHC ON RESOURCE CLASS TYPE
		switch(arg_resource_json.class_type)
		{
			case 'view':
			{
				DevaptTraces.trace_step(context, 'resource class_type is view', DevaptFoundation5Factory.factory_trace);
				DevaptTraces.trace_var(context, 'class_name', arg_resource_json.class_name, DevaptFoundation5Factory.factory_trace);
				
				
				// GET RESOURCE DEPENDENCIES
				var view_requires = DevaptFoundation5Factory.get_class_require(arg_resource_json.class_name);
				
				
				// CREATE VIEW
				if ( DevaptTypes.is_not_empty_array(view_requires) )
				{
					DevaptTraces.trace_step(context, 'resource class_name is [' + arg_resource_json.class_name + ']', DevaptFoundation5Factory.factory_trace);
					
					var view_name = arg_resource_json.name;
					
					
					// ASYNC LOAD OF DEPENDENCIES
					require(view_requires,
						function(ViewClass) 
						{
							DevaptTraces.trace_enter(context + '.dependencies are loaded', '', DevaptFoundation5Factory.factory_trace);
							
							
							// CREATE VIEW
							var container_jqo = (arg_resource_json.class_name === 'Menubar') ? $('body header') : null; // TODO;
							// console.log(container_jqo, 'container_jqo from factory');
							var view = new ViewClass(view_name, container_jqo, arg_resource_json);
							
							// RESOLVE DEFERRED
							master_deferred.resolve(view);
							
							DevaptTraces.trace_leave(context + '.dependencies are loaded', 'promise is resoved: [' + view_name + '] resource is build', DevaptFoundation5Factory.factory_trace);
							return;
						}
					);
					
					
					DevaptTraces.trace_leave(context, '[' + view_name + '] async resource build', DevaptFoundation5Factory.factory_trace);
					return promise;
				}
				
				break;
			}
			
			case 'model':
			{
				DevaptTraces.trace_step(context, 'resource class_type is model', DevaptFoundation5Factory.factory_trace);
				break;
			}
		}
		
		
		// REJECT DEFERRED
		master_deferred.reject();
		
		
		DevaptTraces.trace_leave(context, 'promise is rejected: resource type not found', DevaptFoundation5Factory.factory_trace);
		return promise;
	}
	
	
	
	/**
	 * @memberof				DevaptFoundation5Factory
	 * @public
	 * @static
	 * @method					DevaptFoundation5Factory.get_class_require(arg_class_name)
	 * @desc					Get resource dependencies
	 * @param {string}			arg_class_name		resource class name
	 * @return {array}			array of require file paths
	 */
	DevaptFoundation5Factory.get_class_require = function(arg_class_name)
	{
		var context = 'DevaptFoundation5Factory.get_class_require(class name)';
		DevaptTraces.trace_enter(context, '', DevaptFoundation5Factory.factory_trace);
		
		
		// INIT DENPEDENCIES ARRAY
		var view_requires = [];
		
		// CHECK CLASS NAME
		if ( ! DevaptTypes.is_not_empty_str(arg_class_name) )
		{
			DevaptTraces.trace_var(context, 'resource bad class name', arg_class_name, DevaptFoundation5Factory.factory_trace);
			DevaptTraces.trace_leave(context, 'resource bad class name', DevaptFoundation5Factory.factory_trace);
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
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/views/remote'];
				break;
			}
			
			
			// BACKEND VIEW CLASSES
			
			case 'Label':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/views/label'];
				break;
			}
			
			case 'Button':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/views/button'];
				break;
			}
			
			case 'ButtonGroup':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/views/button-group'];
				break;
			}
			
			case 'ButtonBar':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/views/button-bar'];
				break;
			}
			
			case 'Image':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/views/image'];
				break;
			}
			
			case 'Breadcrumbs':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/views/breadcrumbs'];
				break;
			}
			
			case 'Panel':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/views/panel'];
				break;
			}
			
			case 'Menubar':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/views/menubar'];
				break;
			}
			
			case 'Pagination':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/views/pagination'];
				break;
			}
			
			
			// BACKEND CONTAINER CLASSES
			
			case 'Row':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/containers/row'];
				break;
			}
			
			case 'List':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/containers/list'];
				break;
			}
			
			case 'NavMenu':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/containers/navmenu'];
				break;
			}
			
			
			case 'Dropdown':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/containers/dropdown'];
				break;
			}
			
			case 'Tabs':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/containers/tabs'];
				break;
			}
			
			case 'Accordion':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/containers/accordion'];
				break;
			}
			
			case 'Table':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/containers/table'];
				break;
			}
			
			case 'HBox':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/containers/hbox'];
				break;
			}
			
			case 'VBox':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/containers/vbox'];
				break;
			}
			
			case 'PGrid':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/containers/pgrid'];
				break;
			}
			
			case 'RCGrid':
			{
				view_requires = [DevaptFoundation5Factory.factory_backend_path + '/containers/rcgrid'];
				break;
			}
			
			
			default:
			{
				DevaptTraces.trace_leave(context, 'resource type not found', DevaptFoundation5Factory.factory_trace);
				return view_requires;
			}
		}
		
		
		DevaptTraces.trace_leave(context, 'resource class found', DevaptFoundation5Factory.factory_trace);
		return view_requires;
	}
	
	
	return DevaptFoundation5Factory;
} );