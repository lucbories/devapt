Devapt / common / store
========================


config micro services and remote odels

Service types:
	rest_api_auth: login, logout clients and svc
	rest_api_logger: receive and save logs
	
	rest_api_models_query
	rest_api_models_modifier
	
	rest_api_resources_query: read operation on datas models
	rest_api_resources_modifier: create,update,delete operations on datas models
	
	rest_api_svcmgt: enable,disable,create,update,delete app svc
	
	html_assets
	html_app
	
	socket_udp
	socket_tcp
	
	branch: A(B/C) with request->process A(calc choice:B or C)->process B or C
	aggregator: A(B,C) with request->process A:process B and process C and merge results
	proxy: A(B) with request->process A:process B and returns result



TODO REST API
------------------
Update a resource configuration (TODO):
PUT with url: /resources/{resources type name}/{resources name} and a plain object payload as { setting_name: setting value }

Create a full resource configuration (TODO):
POST with url: /resources/{resources type name}/{resources name} and a plain object payload as { full plain object }

Delete a full resource configuration (TODO):
DELETE with url: /resources/{resources type name}/{resources name} and no payload



TODO JS API:
------------------
Redesign the server/config/ files with an OO approach:

Resources definition:
* cfg_resource.js: define a standard base resource
* cfg_model.js: define a model resource
* cfg_view.js: define a view resource
* cfg_connexion.js: define a connexion resource
* cfg_menubar.js: define a menubar resource
* cfg_menu.js: define a menu resource


Repository definition:
* cfg_repository.js: define the unique storage for all resources settings
* cfg_application.js: define an application repository with sources and resources

Class|Methods|Result|Description
-----------|---------------------|------------------|----------------------------------------
Repository |init()               |Promise(boolean)  |Init all datasources
Repository |load()               |Promise(settings) |First load of datasources
Repository |applications()       |Map               |Get a map of all applications repositories
Repository |sources()            |Map               |Get a map of all datasources
Repository |dispatch(action)     |Promise(Result)   |Request an action execution
Repository |subscribe(listeners) |boolean           |Request an action execution


Sources definition:
* cfg_source.js: define a configurations base source
* cfg_source_file.js: define a configurations file (INI, CSV, JSON...) source
* cfg_source_sql.js: define a configurations SQL source
* cfg_source_nosql.js: define a configurations NOSQL source

A Source object will have this methods:
* init():Promise(boolean)
* load():Promise(settings)
* reload():Promise(settings)
* create(resource name, setting name, setting value):Promise(boolean)
* update(resource name, setting name, setting value):Promise(boolean)
* remove(resource name, setting name):Promise(boolean)
* fill(resource settings plain object):Promise(boolean)4
* flush():Promise(boolean)

Class|Methods|Result|Description
-----------|----------|------------------|----------------------------------------
Source     |init()    |Promise(boolean)  |Init datasource (open file, connect...)
Source     |load()    |Promise(settings) |First load of datas
