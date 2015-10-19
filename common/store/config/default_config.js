export const default_config = {
	config: {
		server: {
			host: null,
			port: null
		},
		
		security: {
			is_readonly: false,
			
			authentication: {
				enabled:true,
				
				expiration:60,
				secret:'XXXXXXXXXXXXXXXXXXXX',
				
				mode:'database',
				model:null,
				username:null,
				password:null,
				
				alt: {
					mode:null,
					file:null,
					
					login:null,
					password: null
				},
			},
			
			authorization: {
				enabled:true,
				
				mode:'database',
				model:null,
				role:null,
				username:null,
				
				alt: {
					mode:null,
					file: null
				},
			},
		},
		
		modules: [],
		
		apps: {}
	}
};