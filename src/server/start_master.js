
import runtime from '../common/base/runtime'



const runtime_settings = {
	'is_master':true,
	'name':'NodeA',
	
	'master':{
		'name':'NodeA',
		'host':"localhost",
		'port':5000
	},
	
	'apps_settings_file': 'apps/apps.json',
	
	'trace':{
		// GLOBAL TRACE SETTINGS
		'enabled':true, // TODO: not used yet
		
		'levels':['debug', 'info', 'warn', 'error'], // TODO: not used yet
		
		// RUNTIME STAGES TRACE SETTINGS
		"stages":{
			"enabled":true, // TODO: not used yet
			
			/**
			* Runtime Stage 0 consists of:
			* 		- create node
			* 		- create bus or connect to bus
			*/
			"RuntimeStage0":{
				"enabled":false
			},
			
			/**
			* Runtime Stage 1 consists of:
			* 		- load master apps settings
			*/
			"RuntimeStage1":{
				"enabled":false
			},
			
			// RUNTIME STAGE 2 TRACE SETTINGS
			"RuntimeStage2":{
				"enabled":false
			},
			
			// RUNTIME STAGE 3 TRACE SETTINGS
			"RuntimeStage3":{
				"enabled":false
			},
			
			// RUNTIME STAGE 4 TRACE SETTINGS
			"RuntimeStage4":{
				"enabled":false
			},
			
			// RUNTIME STAGE 5 TRACE SETTINGS
			"RuntimeStage5":{
				"enabled":true
			}
		},
		
		// MODULES TRACE SETTINGS
		'modules':null, // TODO: not used yet
		'classes':null, // TODO: not used yet
		'instances':null // TODO: not used yet
	}
}

runtime.load(runtime_settings)

// process.exit()