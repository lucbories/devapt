Devapt / common / store
=======================


In a Redux application there is only one application state tree, the store.
All application current state take place in this store.
A store is an immutable tree: any change to a value of the tree will produce an another variable: values aren't mutable.

The store is used by the server and the client part and contains all initial configuraiton and runtime values.


The Store tree:
	store
		config
			...
		runtime
			...
'config' contains settings (list, map, number, string): persistent state.
'runtime' contains objects (class instances): volatile runtime repository.



The config tree:
	config
		server
			...
			
		security
			is_readonly
			
			authentication
				...
		
			authorization
				...
		
		modules
			...
		
		apps
			applicationA
				...


The runtime tree:
	authentication
		...
	
	authorization
		...
	
	views
		...
	
	models
		...
	
	menubars
		...
	
	menus
		...
	
	databases
		...
	
	plugins
		...
	
	loggers
		...
	