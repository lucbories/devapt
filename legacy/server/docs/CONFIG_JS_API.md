Devapt / server / config
========================


Module: app_config.js
---------------------


Module dependancies:
* require('./config_parser')
* require('q')
* require('path')
* require('assert')
* require('../utils/logs')
* require('./module_config')
* require('./resource_config')
* require('./connexion')
* require('./lookup')
* require('./replace')



Private:
* loaded_configs: plain object which contains all loaded configurations



Module API:

Methods|Result|Description
----------|------------------|----------------------------------------
load_app_config(file_path_name,base_dir,force_reload)  |Promise(app config)  |Load an application configuration
get_app_config(app_name)                               |Plain object of an application configuration or null|Lookup a resource configuration
get_resource(res_type,res_name)                        |Plain object of a resource configuration or null|Lookup a resource configuration
get_view(res_name)                                     |Plain object of a resource configuration |Lookup a view resource configuration
get_model(res_name)                                    |Plain object of a resource configuration |Lookup a model resource configuration
get_menubar(res_name)                                  |Plain object of a resource configuration |Lookup a menubar resource configuration
get_menu(res_name)                                     |Plain object of a resource configuration |Lookup a menu resource configuration
get_connexion(res_name)                                |Plain object of a resource configuration |Lookup a connexion resource configuration
get_views()                                            |Map object of resources configurations |Get all views resources configurations
get_models()                                           |Map object of resources configurations |Get all models resources configurations
get_menubars()                                         |Map object of resources configurations |Get all menubars resources configurations
get_menus()                                            |Map object of resources configurations |Get all menus resources configurations
get_connexions()                                       |Map object of resources configurations |Get all connexions resources configurations
