// NPM IMPORTS
import assert from 'assert'
import T from 'typr'
import path from 'path'

// COMMON IMPORTS
import load_applications from './load_applications'
import load_packages from './load_packages'


const context = 'common/topology/registry/loaders/load_tenants'


const error_msg_bad_config = context + ':bad config'


function load_tenants(logs, arg_tenants_config, arg_plugins, arg_base_dir)
{
	logs.info(context, 'loading world.tenants from ' + arg_base_dir)
	
	try{
		// CHECK ARGS
		assert(T.isObject(arg_tenants_config), error_msg_bad_config)
		
		// LOOP ON TENANTS
		let error = undefined
		Object.keys(arg_tenants_config).forEach(
			function(tenant_name)
			{
				if (arg_tenants_config.error)
				{
					error = arg_tenants_config.error
				}
				if (error)
				{
					logs.info(context, 'skip tenants.' + tenant_name + ' because an error occured.')
					return
				}

				// logs.info(context, 'loading config.tenants.' + tenant_name)

				let tenant_obj = arg_tenants_config[tenant_name]
				tenant_obj = load_tenant(logs, tenant_name, tenant_obj, arg_plugins, arg_base_dir)
				// console.log(tenant_obj, 'tenant_obj')

				// PROCESS ERRORS
				if (tenant_obj.error)
				{
					error = tenant_obj.error
					error.context = error.context + ' for ' + tenant_name
				}
			}
		)

		if (error)
		{
			arg_tenants_config = { error: error }
			// console.error(context, error)
		}
	}
	catch(e)
	{
		arg_tenants_config = { error: { context:context, exception:e } }
		// console.error(arg_tenants_config)
	}
	
	return arg_tenants_config
}


function load_tenant(logs, arg_tenant_name, arg_tenant_config, arg_plugins, arg_base_dir)
{
	logs.info(context, 'loading world.tenants.' + arg_tenant_name + ' from ' + arg_base_dir)
	// console.log(arg_tenant_config, 'arg_tenant_config')

	// CHECK ARGS
	assert(T.isObject(arg_tenant_config), error_msg_bad_config)

	// LOAD PACKAGES
	if ( T.isString(arg_tenant_config.packages) )
	{
		const file_path_name = path.join(arg_base_dir, arg_tenant_config.packages)
		arg_tenant_config.packages = require(file_path_name).packages
	}
	if ( T.isObject(arg_tenant_config.packages) )
	{
		logs.info(context, 'loading world.tenants.' + arg_tenant_name + '.packages')
		arg_tenant_config.packages = load_packages(logs, arg_tenant_config.packages, arg_base_dir)

		// PROCESS ERROR
		if (arg_tenant_config.packages.error)
		{
			arg_tenant_config = {
				error:arg_tenant_config.packages.error
			}
			return arg_tenant_config
		}
	}
	
	// CONSOLID SERVICES
	let services = {}
	Object.keys(arg_tenant_config.packages).forEach(
		(pkg_name)=>{
			const pkg = arg_tenant_config.packages[pkg_name]
			services = Object.assign(services, pkg.services)
		}
	)

	// LOAD APPLICATIONS
	if (T.isString(arg_tenant_config.applications))
	{
		const file_path_name = path.join(arg_base_dir, arg_tenant_config.applications)
		arg_tenant_config.applications = require(file_path_name).applications
	}
	if ( T.isObject(arg_tenant_config.applications) )
	{
		logs.info(context, 'loading world.tenants.' + arg_tenant_name + '.applications')
		arg_tenant_config.applications = load_applications(logs, arg_tenant_config.applications, arg_tenant_config.packages, arg_plugins, services, arg_base_dir)
		
		// PROCESS ERROR
		if (arg_tenant_config.applications.error)
		{
			arg_tenant_config = {
				error:arg_tenant_config.applications.error
			}
			return arg_tenant_config
		}
	}

	return arg_tenant_config
}


export default load_tenants
