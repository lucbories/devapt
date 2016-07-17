export const default_config = {
	'nodes':{},
	'services':{},
	'applications':{},
	'modules':{},
	'plugins':{},
	
	'security':{
		'is_readonly':false,
		
		'authentication': {
			'enabled':false,
			'plugins':[],
			'default_plugins':[]
		},
		
		'authorization': {
			'enabled':false,
			'plugins':[],
			'default_plugins':[]
		},
		
		'connexions':[]
	},
	
	'loggers':{},
	'traces':{}
}
