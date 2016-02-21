# Devapt runtime starting process


## Starting code

```js
var devapt = require('devapt/base/runtime'); // for ES5
import runtime from 'devapt/base/runtime' // for ES6 / ES2015

var runtime_settings = {
	'is_master':true,
	'name':'NodeA',
	
	'master':{
		'name':'NodeA',
		'host':"localhost",
		'port':5000
	},
	
	'apps_settings_file': 'apps/apps.json'
}

runtime.load(runtime_settings)
```


---------------------
## Starting sequence brief

### import runtime from 'devapt/base/runtime'
The first time the file is loaded, the singleton instance of Runtime class is created.

Runtime.constructor is called to define instance attributes:
```js
this.is_runtime = true
this.is_master = this.get_setting('is_master', false)

this.node = null

this.nodes = new Collection()
this.servers = new Collection()
this.services = new Collection()
this.registered_services = new Collection()

this.modules = new Collection()
this.plugins = new Collection()
this.resources = new Collection()

this.transactions = new Collection()
this.applications = new Collection()

this.security = new Security()
```

Security.constructor
* call AuthenticationManager.constructor
* call AuthorizationManager.constructor


### runtime.load
Load method register runtime settings and call a sequence of executable instances.
* RuntimeStage0Executable
* RuntimeStage1Executable
* RuntimeStage2Executable
* RuntimeStage3Executable
* RuntimeStage4Executable
* RuntimeStage5Executable



---------------------
## Starting sequence details

### Runtime loading stage 0 - RuntimeStage0Executable
* create and load runtime node
* create bus instance or connect to an existing bus

Example of code
```js
this.runtime.node = new Node(node_name, this.runtime.get_settings())
this.runtime.node.load()
```


Node.constructor
* init Node.servers collection


Node.load (for a master node)
* create and load a bus server and connect to it
* create and load a metrics server and connect to it


Node.load (not for a master node)
* connect to an existing bus server
* connect to an existing metrics server



### Runtime loading stage 1 - RuntimeStage1Executable
* load master apps settings
* load security settings

dispatch_store_config_set_all(settings) for master node only

runtime.security.load = Security.load
* call this.authentication_manager.load(authentication settings)
* call this.authorization_manager.load(authorization settings)

AuthenticationManager.load
* select one of AuthenticationPlugin* (AuthenticationPluginPassportLocalDb, AuthenticationPluginPassportLocalFile)
* call AuthenticationPlugin*.constructor
* call AuthenticationPlugin*.enable(plugin settings)
!!! AuthenticationPluginPassportLocalDb needs users Model which is defined in stage 3


### Runtime loading stage 2 - RuntimeStage1Executable
* create node servers (for master node only)
* create services (for master node only)

```js
runtime.node.load_master_settings(node_settings)
make_services()
```


Node.load_master_settings
call Node.load_servers
for each servers settings call Node.create_server
```js
let server = this.create_server(server_type, server_name, server_cfg)
server.load()
server.node = this
server.init_bus_client(host, port)
this.servers.add(server)
```

Node.create_server
create a Server instance (ExpressServer, RestifyServer...)

Server.load
load server settings
call Server.build_server

Server.build_server
build a Server.server instance as an Express or Restify object for example.
load server middlewares for errors, security, metrics...

make_services
for each service config of node settings services
* create a Service instance
* call service.enable()
* call runtime.services.add(service)



### Runtime loading stage 3 - RuntimeStage1Executable
* create Database instances (connexions), call db.load, call runtime.resources.add(db)
* create Module instances, call module.load, call runtime.modules.add(module)
* loop on modules resources and call runtime.resources.add(res_obj) for each one
* for each model resources call resource.load_associations() and resource.load_includes()
* create Plugin instances, call plugin.load, call runtime.plugins.add(plugin)

Module.load
loop on resources settings and create Resource instances (Model, View, Menu, Menubar, Database)



### Runtime loading stage 4 - RuntimeStage1Executable
If node is master
* create Application instances from runtime settings
* call application.load
* call runtime.applications.add(application)

Application.load
* enable consumed services
* enable used services
* enable used plugins
* enable provided services




### Runtime loading stage 5 - RuntimeStage1Executable
* enable servers (for master node only)

if node is master node, call runtime.node.start()

runtime.node.start
call server.enable() on each runtime servers


Server.enable
apply security middlewares !!! TODO
start listening
