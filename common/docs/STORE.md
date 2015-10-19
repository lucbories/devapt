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
		instances
			...
'config' contains settings (list, map, number, string): persistent state.
'instances' contains objects (class instances): volatile runtime repository.



The config tree:
	config
		server
			host
			port
			
		security
			is_readonly
			authentication
				enabled:true,
				
				expiration:60,
				secret:APPPPPPP449++((éç(à,
				
				mode:database,
				model:MODEL_AUTH_USERS,
				username:login,
				password:password,
				
				alt
					mode:jsonfile,
					file:users.json,
					
					login:demo,
					password:demo
		
			authorization
				enabled:true,
				
				mode:database,
				model:MODEL_AUTH_USERS_ROLES,
				role:label,
				username:users_login,
				
				alt
					mode:databajsonfilese,
					file:users.json
		
		modules
		
		apps
			applicationA
				

applicationA tree:
	applicationA
		app_file_base_directory
		app_fil_name
		
		infos
			...
			
		security
			...
		
		loggers
			...
			
		traces
			...
		
		layout
			...
		
		browser_plugins
			...
		
		modules
			...
		
		views
			...
		
		models
			...
		
		connexions
			...
		
		menubars
			...
		
		menus
			...
	
	applicationA / infos
		name: Tutorial-1
		title: Devapt Demo App
		short_label: Tutorial-1
		long_label: Devapt tutorial 1 Application
		version: 1.0.0
		url
			base: /tutorial-1/,
			default: index.html,
			home: /views/VIEW_HOME,
			login: /views/VIEW_LOGIN/html_page,
			logout: /views/VIEW_LOGOUT/html_page
		favico
			url: assets/img/favico.ico,
			format: image/vnd.microsoft.icon
		status
			env: DEV,
			offline: FALSE,
			load_all_classes: true
		locales
			default_zone: Europe/Paris,
			default_charset: WINDOWS-FR,
			html_language: FR,
			html_charset: UTF-8
		contact
			author: Luc BORIES,
			email: contact--NO SPAM--@--NO SPAM--devapt.org
					
	
	applicationA / connexions
		files
			db_connexions.ini
			
	
	applicationA / loggers
		default
			remote
				enabled: FALSE,
				access: ROLE_LOGGER
			console
				enabled: FALSE
			file
				enabled: TRUE
				path: datas/traces.log
			db
				enabled: FALSE
				connexion: cx_auth
				table:
				fields
					timestamp:
					priority:
					message:
	
	
	applicationA / traces
		enabled: TRUE,
		items
			view_access_user_inspector_form: ':view_access_user_inspector_form::all',
			view_access_users_list: ':view_access_users_list::all',
			DevaptApplication: 'DevaptApplication:::all'
		security
			remote
				enabled: TRUE,
				access: ROLE_LOGGER
			file
				enabled: TRUE,
				path: datas/security.log
	
		
	applicationA / layouts
		default
			logo
				url: /assets/img/logo_libapt_2.jpg,
				alt: logo
			header
				template
					file: modules/home/template/layouts.default.header.html.template,
					string: 
			footer
				template
					file: modules/home/template/layouts.default.footer.html.template,
					string: 
			home
				name: VIEW_HOME
			topbar
				name: HOME_MENUBAR,
				container_id: menubars_id
			breadcrumbs
				name: page_breadcrumbs,
				container_id: page_breadcrumbs_id
			content
				name: VIEW_HOME,
				id: page_content_id
			backend
				name: foundation5
	
	
	applicationA / browser_plugins
		default_plugins
			url: plugins/plugins,
			autoload: true
	
	
	applicationA / modules
		home
			views
				modules/home/home_views.ini
			menubars
				modules/home/home_menubars.ini
		security
			models
				modules/security/users/auth_models_many_users_groups.ini,
				modules/security/users/auth_models_many_users_profiles.ini,
				modules/security/users/auth_models_many_users_roles.ini,
				modules/security/users/auth_models_users.ini,
				modules/security/users/auth_models_users_groups.ini,
				modules/security/users/auth_models_users_roles.ini,
				modules/security/users/auth_models_users_profiles.ini,
				modules/security/groups/auth_models_groups.ini,
				modules/security/groups/auth_models_groups_users.ini,
				modules/security/profiles/auth_models_profiles.ini,
				modules/security/profiles/auth_models_profiles_users.ini,
				modules/security/roles/auth_models_roles.ini,
				modules/security/roles/auth_models_roles_users.ini
		appbuilder
			views
				modules/appbuilder/appbuilder_views.ini
			menubars
				modules/appbuilder/appbuilder_menubars.ini
	
	
	applicationA / views
		VIEW_HOME
			role_display: ROLE_HOME_DISPLAY,
			class_name: IncludeView,
			label: Home,
			include_file_path_name: modules/home/include/VIEW_HOME.html.include,
			name: VIEW_HOME,
			class_type: views
	
	
	applicationA / models
		MODEL_AUTH_USERS
			driver: PDO_MYSQL,
			connexion: cx_auth,
			role_read: ROLE_AUTH_USERS_READ,
			role_create: ROLE_AUTH_USERS_CREATE,
			role_update: ROLE_AUTH_USERS_UPDATE,
			role_delete: ROLE_AUTH_USERS_DELETE,
			crud_table: users,
			engine
				name: users,
				source: json
			fields
				users_id_user
					type: integer,
					label: Id,
					is_editable: 0,
					is_visible: 0,
					sql_is_primary_key: 1,
					sql_is_expression: 0,
					sql_column: id_user
				users_login
					type: string,
					label: Login,
					is_editable: 1,
					is_visible: 1,
					sql_is_primary_key: 0,
					sql_is_expression: 0,
					sql_column: login,
					field_value.validate: alphaALPHAnum_-
				users_lastname
					type: string,
					label: Lastname,
					placeholder: Enter lastname,
					is_editable: 1,
					is_visible: 1,
					sql_is_primary_key: 0,
					sql_is_expression: 0,
					sql_column: lastname,
					field_value.validate: alphaALPHAnum_-space,
					field_value.validate_error_label: upper or lower alphanumeric and - and _ and space
	
	
	applicationA / connexions
		cx_auth
			engine=mysql
			host=localhost
			port=3306
			database_name=my_db_name
			user_name=my_db_user
			user_pwd=my_db_password
			charset=my_db_charset
	
	applicationA / menubars
		HOME_MENUBAR
			class_name: Menubar,
			access_role: ROLE_HELP_READ,
			label: Home,
			tooltip: ,
			default_view: VIEW_HOME,
			default_container: page_content_id,
			default_label: Home,
			format: top,
			fixed: false,
			ongrid: false,
			float: false,
			clickable: false,
			orientation: horizontal,
			template_enabled: false,
			template_string: {begin_row}{begin_4_cols}{this}{end_cols}{end_row},
			items
				menu_includes,
				menu_apps
			display_on_small: true,
			display_on_medium: true,
			display_on_large: true,
			display_on_landscape: true,
			display_on_portrait: true,
			display_on_touch: true,
			name: HOME_MENUBAR,
			class_type: menubars
	
	applicationA / menus
		menu_apps
			access_role: ROLE_HELP_READ,
			label: Apps,
			position: right,
			tooltip: Applications or application modules,
			items
				logout,
				appbuilder_main_menu
			name: menu_apps,
			class_type: menus,
			res_clones
				appbuilder_menu_apps