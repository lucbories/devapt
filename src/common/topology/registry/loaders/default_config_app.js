export const default_config = {
	'nodes':{},

	'tenants':{
		'default':{
			'applications':{},
			'packages':{}
		}
	},
	
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
		
		'datasources':[]
	},
	
	'plugins':{},
	
	'loggers':{},
	'traces':{}
}
