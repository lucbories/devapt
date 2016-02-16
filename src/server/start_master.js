
import runtime from '../common/base/runtime'
import {SOURCE_LOCAL_FILE, SOURCE_MSG_BUS, SOURCE_REMOTE_URL, SOURCE_SQL_DATABASE, SOURCE_NOSQL_DATABASE} from '../common/datas/providers/provider'



const optional_trace_settings = {
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
		
		/**
		* Runtime Stage 2 consists of:
		* 		- create node servers
		* 		- create services
		*/
		"RuntimeStage2":{
			"enabled":true
		},
		
		/**
		* Runtime Stage 3 consists of:
		* 		- create connexions, modules and plugins
		*/
		"RuntimeStage3":{
			"enabled":false
		},
		
		/**
		* Runtime Stage 4 consists of:
		* 		- create applications
		*/
		"RuntimeStage4":{
			"enabled":false
		},
		
		/**
		* Runtime Stage 5 consists of:
		* 		- enable servers
		*/
		"RuntimeStage5":{
			"enabled":true
		}
	},
	
	// MODULES TRACE SETTINGS
	'modules':null, // TODO: not used yet
	'classes':null, // TODO: not used yet
	'instances':null // TODO: not used yet
}


const runtime_settings = {
	'is_master':true,
	'name':'NodeA',
	
	'master':{
		'name':'NodeA',
		'host':"localhost",
		'port':5000
	},
	
    "settings_provider": {
        'source':SOURCE_LOCAL_FILE,
        "relative_path":"apps/world.json"
    },
	
	'trace': optional_trace_settings
}


runtime.load(runtime_settings)


process.on('SIGTERM',
	function()
	{
		process.exit()
	}
)
