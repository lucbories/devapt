
import runtime from '../common/base/runtime'


//test
var tt=0
tt=105559
console.log(tt, 'test')


const runtime_settings = {
	'node_name': 'NodeA',
	'apps_settings_file': 'apps/apps.json',
	'logs':{
		'enabled':true,
		'levels':['debug', 'info', 'warn', 'error'],
		'classes':null,
		'instances':null
	}
}

runtime.load(runtime_settings)

