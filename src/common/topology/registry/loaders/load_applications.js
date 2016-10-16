// SERVER IMPORTS
import load_application from './load_application'


const context = 'common/topology/registry/loaders/load_applications'



/**
 * Load the 'config.applications' key of the final state
 * Pure function: (Plain Object) => (mutated Plain Object)
 */
function load_applications(logs, arg_config, arg_config_packages, arg_config_plugins, arg_config_services, arg_base_dir)
{
	logs.info(context, 'loading world.tenants.*.applications')
	
	try{
		// LOOP ON APPLICATIONS
		let error = undefined
		Object.keys(arg_config).forEach(
			function(app_name)
			{
				if (arg_config.error)
				{
					error = arg_config.error
				}
				if (error)
				{
					logs.info(context, 'skip applications.' + app_name + ' because an error occured.')
					return
				}

				logs.info(context, 'loading world.tenants.*.applications.' + app_name)

				let app_cfg = arg_config[app_name]
				app_cfg = load_application(logs, app_name, app_cfg, arg_config_packages, arg_config_plugins, arg_config_services, arg_base_dir)
				// console.error(context, app_cfg)

				// PROCESS ERRORS
				if (app_cfg.error)
				{
					error = app_cfg.error
					error.context = error.context + ' for ' + app_name
					// console.log(context + ' has error for ' + app_name, app_cfg.error)
				}
			}
		)

		if (error)
		{
			arg_config = { error: error }
			// console.error(context, error)
		}
	}
	catch(e)
	{
		arg_config = { error: { context:context, exception:e } }
	}
	
	return arg_config
}

export default load_applications
