
import runtime from '../common/base/runtime'



const runtime_settings = {
	'is_master':false,
	
	'master':{
		'name': 'NodeA',
		'host':"localhost",
		'port':5000
	},
	
	'node':{
		'name': 'NodeB',
		'host':"localhost",
		'port':5001
	},
}

runtime.load(runtime_settings)
