
import assert from 'assert'
import T from 'typr'

import logs from '../../server/utils/logs'
// import load_config_apps_app from './load_config_apps_app'


let context = 'common/loaders/load_config_plugins'
let error_msg_bad_config = context + ':bad config'



function load_config_plugins(arg_config)
{
	logs.info(context, 'loading config.plugins')
	
	try{
		// LOOP ON PLUGINS
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

export default load_config_plugins
