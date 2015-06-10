/**
 * @file        datas/datasource/datasources.js
 * @desc        Datasource model provider
 * @see			DevaptModel, DevaptStorage
 * @ingroup     DEVAPT_DATAS
 * @date        2015-04-19
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt',
	'core/traces', 'core/types', 'core/traces-memory', 'core/resources',
	'object/class', 'object/classes', 'object/events'//,
	// 'datas/datasource/logs_provider'
],
function(Devapt,
	DevaptTraces, DevaptTypes, DevaptTracesMemory, DevaptResources,
	DevaptClass, DevaptClasses, DevaptEvents//,
	// DevaptLogsProvider
)
{
	/**
	 * @mixin				DevaptDatasources
	 * @public
	 * @desc				Datas sources provider
	 */
	var DevaptDatasources = 
	{
		/**
		 * @memberof			DevaptDatasources
		 * @static
		 * @public
		 * @desc				Enable/disable trace for static class operations
		 */
		trace_datasources: true,
		
		/**
		 * @memberof			DevaptDatasources
		 * @static
		 * @public
		 * @desc				Datasource providers
		 */
		datasources_providers: {},
		
		
		/**
		 * @public
		 * @static
		 * @memberof			DevaptDatasources
		 * @desc				Get datasource provider
		 * @param {string}		arg_datasource_name		the name of the requested datasource
		 * @return {promise}	or null if not found
		 */
		get_datasource_provider: function(arg_datasource_name)
		{
			var context = 'get_datasource_provider(name)';
			
			// CACHED PROVIDER
			if (arg_datasource_name in DevaptDatasources.datasources_providers)
			{
				DevaptTraces.trace_step(context, 'provider is logs from cache', DevaptDatasources.trace_datasources);
				
				var provider = DevaptDatasources.datasources_providers[arg_datasource_name];
				return Devapt.promise_resolved(provider);
			}
			
			// SERACH PROVIDER
			switch(arg_datasource_name)
			{
				case 'logs':
				{
					DevaptTraces.trace_step(context, 'provider is logs from promise', DevaptDatasources.trace_datasources);
					
					return Devapt.create('DevaptLogsProvider', 'LogsProvider', {});
				}
					
				case 'resources':
				{
					DevaptTraces.trace_step(context, 'provider is resources from promise', DevaptDatasources.trace_datasources);
					
					return Devapt.create('DevaptResourcesProvider', 'ResourcesProvider', {});
				}
				
				case 'events':
				{
					DevaptTraces.trace_step(context, 'provider is events from promise', DevaptDatasources.trace_datasources);
					
					return Devapt.create('DevaptEventsProvider', 'EventsProvider', {});
				}
				
				case 'classes':
				{
					DevaptTraces.trace_step(context, 'provider is classes from promise', DevaptDatasources.trace_datasources);
					
					return Devapt.create('DevaptClassesProvider', 'ClassesProvider', {});
				}
				
				case 'crud-api':
				{
					DevaptTraces.trace_step(context, 'provider is crud-api from promise', DevaptDatasources.trace_datasources);
					
					return Devapt.create('DevaptCrudApiProvider', 'CrudApiProvider', {});
				}
				
				case 'view-api':
				{
					DevaptTraces.trace_step(context, 'provider is view-api from promise', DevaptDatasources.trace_datasources);
					
					return Devapt.create('DevaptViewApiProvider', 'ViewApiProvider', {});
				}
				
				case 'resource-api':
				{
					DevaptTraces.trace_step(context, 'provider is resource-api from promise', DevaptDatasources.trace_datasources);
					
					return Devapt.create('DevaptResourceApiProvider', 'ResourceApiProvider', {});
				}
			}
			
			// return Devapt.promise_rejected();
			return null;
		},
		
		
		/**
		 * @public
		 * @static
		 * @memberof			DevaptDatasources
		 * @desc				Get datasource model
		 * @param {string}		arg_datasource_name		the name of the requested datasource
		 * @return {promise}
		 */
		get_datasource_model: function(arg_datasource_name)
		{
			var context = 'get_datasource_model(name)';
			DevaptTraces.trace_enter(context, DevaptTypes.to_string(arg_datasource_name, 'bad name'), DevaptDatasources.trace_datasources);
			
			
			// CHECK NAME
			if ( ! DevaptTypes.is_not_empty_str(arg_datasource_name) )
			{
				DevaptTraces.trace_leave(context, Devapt.msg_failure_promise, DevaptDatasources.trace_datasources);
				return Devapt.promise_rejected();
			}
			
			
			// GET MODEL
			var model_promise = null;
			try
			{
				var provider_promise = DevaptDatasources.get_datasource_provider(arg_datasource_name);
				
				if (provider_promise)
				{
					DevaptTraces.trace_leave(context, Devapt.msg_sucess_promise, DevaptDatasources.trace_datasources);
					return provider_promise.then(
						function(arg_provider)
						{
							var settings = arg_provider.get_model_settings();
							return Devapt.create('DevaptModel', settings);
						}
					);
				}
			}
			catch(e)
			{
				console.error(e, context);
			}
			
			
			DevaptTraces.trace_leave(context, Devapt.msg_failure_promise, DevaptDatasources.trace_datasources);
			return Devapt.promise_rejected();
		}
	};
	
	
	return DevaptDatasources;
}
);