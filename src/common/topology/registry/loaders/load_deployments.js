// NPM IMPORTS
import assert from 'assert'
import T from 'typr'


const context = 'common/topology/registry/loaders/load_deployments'



let error_msg_bad_config                    = context + ':deployments should be an object'
let error_msg_bad_deployed_tenant           = context + ':deployments.tenantA should be an object'
let error_msg_bad_deployed_app              = context + ':deployments.tenantA.appA should be an object'
let error_msg_bad_deployed_app_services     = context + ':deployments.tenantA.appA.services should be an object'
let error_msg_bad_deployed_app_assets       = context + ':deployments.tenantA.appA.assets should be an array'
let error_msg_bad_deployed_svc              = context + ':deployments.tenantA.appA.services.svc1 should be an object'
let error_msg_bad_deployed_svc_servers      = context + ':deployments.tenantA.appA.services.svc1.servers should be an array'
let error_msg_bad_deployed_svc_servers_item = context + ':deployments.tenantA.appA.services.svc1.servers.* should be a string'


/*
Example:
{
	"deployments":{
		"tenantA":{
			"assets":{
				"services":{
					"html_assets_1": { "filters":["*:8080"] }
				}
			},
			
			"devtools":{
				"services":{
					"devtools_store": { "servers":["NodeALocal8080", "NodeB"] },
					"devtools_panel": { "servers":["ClusterC"] },
					"topology": { "servers":["GroupAA"] },
					"logs": { "servers":["NodeALocal8080"] },
					"messages": { "servers":["NodeALocal8080"] }
				}
			}
		}
	}
}
*/
function load_deployments(logs, arg_deploy_config, arg_base_dir)
{
	logs.info(context, 'loading world.deployments from ' + arg_base_dir)
	
	try{
		// CHECK MODULES
		assert(T.isObject(arg_deploy_config), error_msg_bad_config)
		
		// LOOP ON TENANTS
		Object.keys(arg_deploy_config).forEach(
			function(tenant_name)
			{
				// LOOP ON TENANT APPLICATIONS
				const deployed_tenant_apps = arg_deploy_config[tenant_name]
				assert(T.isObject(deployed_tenant_apps), error_msg_bad_deployed_tenant)

				Object.keys(deployed_tenant_apps).forEach(
					function(app_name)
					{
						const deployed_app_obj = deployed_tenant_apps[app_name]
						assert(T.isObject(deployed_app_obj), error_msg_bad_deployed_app)

						const assets = deployed_app_obj.services
						assert(T.isObject(services), error_msg_bad_deployed_app_services)

						const services = deployed_app_obj.assets
						assert(T.isObject(assets), error_msg_bad_deployed_app_assets)

						Object.keys(services).forEach(
							function(svc_name)
							{
								let deployed_svc_obj = services[svc_name]
								assert(T.isObject(deployed_svc_obj), error_msg_bad_deployed_svc)

								load_service(logs, app_name, svc_name, deployed_svc_obj, arg_base_dir)
							}
						)
					}
				)
			}
		)
	}
	catch(e)
	{
		arg_deploy_config = { error: { context:context, exception:e } }
	}
	
	return arg_deploy_config
}


function load_service(logs, arg_app_name, arg_svc_name, arg_deployed_svc_obj, arg_base_dir)
{
	logs.info(context, 'loading world.deployment.' + arg_app_name + '.' + arg_svc_name)
	
	// CHECK MODULES
	assert(T.isObject(arg_deployed_svc_obj), error_msg_bad_deployed_svc)
	
	// LOOP ON SERVERS
	const servers = arg_deployed_svc_obj.servers
	assert(T.isArray(servers), error_msg_bad_deployed_svc_servers)

	servers.forEach(
		function(server_item, server_index)
		{
			assert(T.isString(server_item), error_msg_bad_deployed_svc_servers_item)

			logs.info(context, 'loading world.deployment.' + arg_app_name + '.' + arg_svc_name + ':' + server_index + ':' + server_item)
		}
	)
}


export default load_deployments
