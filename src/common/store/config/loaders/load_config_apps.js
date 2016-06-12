
// import assert from 'assert'
// import T from 'typr'

import load_config_apps_app from './load_config_apps_app'


let context = 'common/store/config/loaders/load_config_apps'
// let error_msg_bad_config = context + ':bad config'



/**
 * Load the 'config.applications' key of the final state
 * Pure function: (Plain Object) => (mutated Plain Object)
 */
function load_config_apps(logs, arg_config, arg_config_modules, arg_config_plugins, arg_config_resources, arg_base_dir)
{
	logs.info(context, 'loading config.applications')
	
	try{
		// LOOP ON APPLICATIONS
		Object.keys(arg_config).forEach(
			function(app_name)
			{
				let app = arg_config[app_name]
				arg_config[app_name] = load_config_apps_app(logs, app, arg_config_modules, arg_config_plugins, arg_config_resources, arg_base_dir)
				
				// PROCESS ERROR
				if (arg_config[app_name].error)
				{
					if (! arg_config.suberrors)
					{
						arg_config.suberrors = []
					}
					arg_config.suberrors.push(arg_config[app_name].error)
				}
			}
		)
	}
	catch(e)
	{
		arg_config = { error: { context:context, exception:e } }
	}
	
	return arg_config
}

export default load_config_apps
