"use strict";


define(
	['Devapt', 'core/traces', 'core/types', 'object/classes'],
	function(Devapt, DevaptTraces, DevaptTypes, DevaptClasses)
	{
		var providers = [];
		var lookup_trace = false;
		var ajax_timeout = 5000;
		
		
		// SET APP CONFIG PROVIDER
		var resources_provider_app_cfg = function(arg_resource_name)
		{
			var context = 'DevaptResourcesLookup.resources_provider_app_cfg(' + arg_resource_name + ')';
			DevaptTraces.trace_enter(context, DevaptTypes.to_string(arg_resource_name, 'empty'), lookup_trace);
			
			
			// GET RESOURCE DECLARATION FROM APPLICATION CONFIGURATION
			var resource_declaration = null;
			var resource_set = null;
			
			var app_config = Devapt.app.get_config();
			// console.log(app_config, 'app_config');
			
			var app_config_sets = ['views', 'models', 'menubars', 'menus', 'connexions'];
			app_config_sets.every(
				function(arg_set_name, arg_set_index, arg_set_array)
				{
					DevaptTraces.trace_value(context + '.app_cfg_provider', 'lookup for set', arg_set_name, lookup_trace);
					// console.info('resource set [%s]', arg_set_name);
					try
					{
						if (! (arg_set_name in app_config) )
						{
							console.error('set [%s] not found in app configuration for context [%s]', arg_set_name, context);
							return true;
						}
						
						if (app_config[arg_set_name] && (arg_resource_name in app_config[arg_set_name]) )
						{
							// console.info('resource [%s] found in set [%s] from app configuration for context [%s]', arg_resource_name, arg_set_name, context);
							resource_declaration = app_config[arg_set_name][arg_resource_name];
							resource_set = arg_set_name;
							return false;
						}
					}
					catch(e)
					{
						console.error(e, context);
						return false;
					}
					return true;
				}
			);
			
			// FOUND
			if (resource_declaration)
			{
				DevaptTraces.trace_leave(context + '.app_cfg_provider', 'resource declaration found from app config.[' + resource_set + ']', lookup_trace);
				// lookup_trace = false;
				return Devapt.promise_resolved(resource_declaration);
			}
			
			
			// NOT FOUND
			DevaptTraces.trace_leave(context + '.app_cfg_provider', 'resource declaration not found from app config', lookup_trace);
			return Devapt.promise_resolved(false);
		};
		
		
		// SET JSON PROVIDERS
		var resources_provider_remote = function(arg_resource_name)
		{
			var context = 'DevaptResourcesLookup.resources_provider_remote(' + arg_resource_name + ')';
			DevaptTraces.trace_enter(context, DevaptTypes.to_string(arg_resource_name, 'empty'), lookup_trace);
			
			
			// INIT REQUEST ARGS
			// var url = url_base + 'resources/' + arg_resource_name;
			
			var url = '/' + 'resources/' + arg_resource_name; // TODO CONFIGURE BASE REST URL
			var options =
			{
				dataType	: 'json',
				timeout		: ajax_timeout
			};
			
			// SEND REQUEST
			var ajax_promise = Devapt.ajax_get(url, null, options, Devapt.app.get_security_token());
			
			
			DevaptTraces.trace_leave(context, 'async request', lookup_trace);
			return ajax_promise;
		};
		
		
		var init_providers = function()
		{
			providers.push(resources_provider_app_cfg);
			providers.push(resources_provider_remote);
		}
		
		
		var lookup_resource = function(arg_resource_name)
		{
			return resources_provider_app_cfg(arg_resource_name)
			.then(
				function(arg_result)
				{
					if (arg_result)
					{
						return arg_result;
					}
					
					return resources_provider_remote(arg_resource_name);
				}
			);
		};
		
		
		var API = {
			init_providers: init_providers,
			lookup_resource: lookup_resource
		};
		
		
		return API;
	}
);