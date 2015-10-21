
import assert from 'assert'
import T from 'typr'

import logs from '../../server/utils/logs'
// import load_config_apps_app from './load_config_apps_app'


let context = 'common/loaders/load_config_modules'
let error_msg_bad_config = context + ':bad config'



function load_config_modules(arg_config)
{
	logs.info(context, 'loading config.modules')
	
	try{
		// CHECK APPLICATION
		assert(T.isObject(arg_app_config), error_msg_bad_config)
		assert(T.isString(arg_app_config.from_file), error_msg_bad_from_file)
		
		// LOOP ON MODULES
		Object.keys(arg_config).forEach(
			function(app_name)
			{
				let app = arg_config[app_name]
				// arg_config[app_name] = load_config_apps_app(app)
			}
		)
	}
	catch(e)
	{
			arg_config = { error: e }
	}
	
	return arg_config
}

export default load_config_modules
