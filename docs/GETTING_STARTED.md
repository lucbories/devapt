
# Devapt

With DEVAPT you can easily develop powerfull application.
Built-in features cover many important subjects as: authentication, restfull, http server, distributed services, logs, metrics...
Main characteristics of DEVAPT architecture is dynamic behaviors, reactive programming, object oriented ES6 javascript, gulp build chain
All of this on NodeJS.

A usefull application is DEVTOOLS which actualy display settings, logs, buses messages, metrics and topology.
[DEVTOOLS project](https://github.com/lucbories/devapt-devtools/)

In a near futur, DEVTOOLS will act as a configurable application builder for DEVAPT applications.

devapt and devapt-* github repositories have the same structure: a master branch with the last tagged tree, a develop branch with latest comited updates and tags.

Versionning use standard method: M.m.p with M is a major change, m a minor change, p a patch.



## Installation

Via npm on Node:

```js
npm install devapt
```



## Usage

Reference in your program:

```js
// For ES5
var devapt = require('devapt').default
var runtime = devapt.runtime

// for ES6 / ES2015
import devapt from 'devapt'
const runtime = devapt.runtime
```


Write a configuration file for your node (the runner):

```js
var runtime_settings = {
	'is_master':true,
	'name':'NodeA',
	
	// BUSES SERVERS (for inter nodex communication)
	"master":{
		"name":"NodeA",
		
		"msg_bus":{
			"type":"simplebus_server",
			"host":"localhost",
			"port":5000
		},
		"logs_bus":{
			"type":"simplebus_server",
			"host":"localhost",
			"port":5001
		},
		"metrics_bus":{
			"type":"simplebus_server",
			"host":"localhost",
			"port":5002
		}
	},
	
	"base_dir": "",
	
	"settings_provider": {
		"source":"local_file",
		"relative_path":"resources/apps.json"
	}
}
```


Launch your runtime nodes and servers:

```js
runtime.load(runtime_settings)
```


What contains "resources/apps.json" ?
It's you're runtime resources settings: servers, services, applications, security, plugins are defined here.
[See Devtools example](https://github.com/lucbories/devapt-app-devtools/tree/develop/dist)

Each resource is defined with a json object.
Settings can be placed in one or many files.
To include a json file set a file path name (relative to the base directory) in place of a json object.


Example with settings in one file:

```js
"resources/apps.json":

{
	"nodes":{
		"NodeA":{
			"host":"localhost",
			"is_master":true,
			"servers":{
				"NodeALocal8080":{
					"type":"express",
					"port":8080,
					"protocole":"http",
					"middlewares":[],
					"use_socketio":true,
					
					"security": {
						"authentication": {
							"enabled":true,
							"plugins":["file_users"]
						}
					}
				}
			}
		}
	},
	
	"services":{
		"html_assets_1":{
			"type":"html_assets",
			"routes":[
				{
					"is_global":true,
					"route":"/",
					"directory":".../devapt-app-devtools/dist/assets",
					"default":"index.html"
				},

				{
					"route":"/css/.*.css",
					"directory":"./public"
				}
			]
		}
	},
	
	"applications":{
		"assets":{
			"url":"assets",
			
			"services":{
				"provides":{
					"html_assets_1": { "servers":["NodeALocal8080"] }
				},
				"consumes":{
				}
			},
			
			"modules": [],
			"plugins":[],
			"resources":[],
			
			"assets":{
				"css":[],
				"js":[],
				"img":[],
				"index":""
			},
			"license":"APACHE-LICENSE-2.0"
		}
	},
	
	"modules":{},
	
	"plugins":{},
	
	"security":{
		"is_readonly":false,
		
		"connexions":[],
		
		"authentication": {
			"enabled":true,
			
			"plugins":{
				"token123": {
					"mode":"token",
					"expiration":60,
					"secret":"APPPPPPP449++((éç(à"
				},
				
				"file_users": {
					"mode":"jsonfile",
					"file_name":"users.json",
					"username_fieldname":"login",
					"password_fieldname":"password"
				}
			},
			
			"default_plugins": ["file_users"]
		},
		
		"authorization": {
			"enabled":true,
			"mode":"database",
			
			"model":"MODEL_AUTH_USERS_ROLES",
			"role":"label",
			"username":"users_login",
			
			"alt": {
				"mode":"jsonfile",
				"file":"users.json"
			},
			
			"roles":{
				"*": {
					"list_resources":"ROLE_RESOURCES_LIST",
					"get_resource":"ROLE_RESOURCE_GET"
				},
				"views": {
					"list_resources":"ROLE_RESOURCES_LIST",
					"get_resource":"ROLE_RESOURCE_GET"
				}
			}
		}
	},
	
	"loggers":{
		"winston":{
			"transports":{
				"file_1":{
					"type":"file",
					"level": "debug",
					"filename": "./tmp/debug_by_json.log",
					"maxsize":100000,
					"maxFiles":2
				},
				"console_1":{
					"type":"console",
					"level":"debug"
				}
			}
		}
	},
	
	"traces":{
		"enabled":true,
		
		"modules":{
			".*":false
		},
		
		"classes":{
			"Application":false,
			"Service":false,
			"ServiceProvider":false,
			".*":false
		},
		
		"instances":{
			"NodeA":false,
			"NodeB":true,
			"NodeB_msg_bus":true,
			"NodeB_msg_bus_gateway":true,
			".*":false
		}
	}
}
```


Example with settings in separate files:

```js
"resources/apps.json":

{
	"nodes":"nodes.json",
	
	"services":"services.json",
	
	"applications":"applications.json",
	
	"modules":"modules.json",
	
	"plugins":"plugins.json",
	
	"security":"security.json",
	
	"loggers":"loggers.json",
	
	"traces":"traces.json"
}

"nodes.json":
{
	"nodes":{ same settings than above }
}

"services.json":
{
	"services":{ same settings than above }
}

Repeat on each files on the same manner.

```



## Development

```
git clone git://github.com/lucbories/Devapt.git
cd devapt
npm install
npm test
```



## Samples and tutorials

Coming soon.
- [...](https://github.com/lucbories/Devapt/tree/master/samples/XXXX)

See DEVTOOLS project for a complete DEVAPT application:
[DEVTOOLS project](https://github.com/lucbories/devapt-devtools/)



## Versions

- 1.0.0: Published



## Contribution

Feel free to contribute, you're welcome.

Check issues and solve it:
[file issues](https://github.com/lucbories/devapt)

Submit your work:
[pull requests](https://github.com/lucbories/devapt/pulls)

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.


