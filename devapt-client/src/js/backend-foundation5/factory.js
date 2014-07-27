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
			case 'View':
			{
				view_requires = ['views/view'];
				break;
			}
			
			case 'IncludeView':
			case 'TemplateView':
			{
				view_requires = ['backend-foundation5/views/remote'];
				break;
			}
			
			case 'Row':
			{
				view_requires = ['backend-foundation5/containers/row'];
				break;
			}
			
			case 'Label':
			{
				view_requires = ['backend-foundation5/views/label'];
				break;
			}
			
			case 'Image':
			{
				view_requires = ['backend-foundation5/views/image'];
				break;
			}
			
			case 'List':
			{
				view_requires = ['backend-foundation5/containers/list'];
				break;
			}
			
			case 'Breadcrumbs':
			{
				view_requires = ['backend-foundation5/views/breadcrumbs'];
				break;
			}
			
			case 'Panel':
			{
				view_requires = ['backend-foundation5/views/panel'];
				break;
			}
			
			case 'Menubar':
			{
				view_requires = ['backend-foundation5/views/menubar'];
				break;
			}
			
			case 'HBox':
			{
				view_requires = ['backend-foundation5/containers/hbox'];
				break;
			}
			
			case 'VBox':
			{
				view_requires = ['backend-foundation5/containers/vbox'];
				break;
			}
			
			case 'Pagination':
			{
				view_requires = ['backend-foundation5/views/pagination'];
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