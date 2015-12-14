
import runtime from '../common/base/runtime'



const runtime_settings = {
	'is_master':true,
	
	'master':{
		'name':'NodeA',
		'host':"localhost",
		'port':5000
	},
	
	'apps_settings_file': 'apps/apps.json',
	
	'logs':{
		'enabled':true,
		'levels':['debug', 'info', 'warn', 'error'],
		'classes':null,
		'instances':null
	}
}

runtime.load(runtime_settings)

// process.exit()