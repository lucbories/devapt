# Devapt - Features - Configurable

## Description
Devapt first principle to build applications without coding common features.

Why write code for REST api, metrics, role based security, database access...

It is best to concentrate on the business code.



## Status


Configuration providers:
* JSON file: 1.0
* JSON url: 1.1
* Datas model: 1.2

Local configuration loading: 1.0

Distributed configuration loading: 1.1

Need Test, Optimization and code review.



## FORMAT:


# Source
Settings are loaded from a Json object.
Json providers could be: files, sql db, nosql db...
For instance only file provider is available.


# Fisrt level format:
First levels are the sub-tree at the Json tree root.

First level keys should be:
 * templates: collection of defined templates.
 * nodes: collection of defined nodes and servers.
 * services: collection of defined services, a service is a feature which could be applied on a set of servers for a set of applications.
 * applications: collection of defined applications, an application links servers and services.
 * modules: collection of defined modules, a module is a set of resources.
 * plugins: collection of defined plugins, a plugin is an addon for rendering, security, servers types, services types...
 * security: authentication and authorization configuration.
 * loggers: collection of defined loggers.
 * traces: configuration of enabled traces for modules, classes, instances of classes.

With sub settings files:
```
{
	"templates":"templates.json",

	"nodes":"nodes.json",
	
	"services":"services.json",
	
	"applications":"applications.json",
	
	"modules":"modules.json",
	
	"plugins":"plugins.json",
	
	"security":"security.json",
	
	"loggers":"loggers.json",
	
	"traces":"traces.json"
}
```


With inline settings:
```
{
	"templates":{ ... },

	"nodes":{ ... },
	
	"services":{ ... },
	
	"applications":{ ... },
	
	"modules":{ ... },
	
	"plugins":{ ... },
	
	"security":{ ... },
	
	"loggers":{ ... },
	
	"traces":{ ... }
}
```


With a mix of inline and files settings:
```
{
	"templates":{ ... },

	"nodes":{ ... },
	
	"services":{ ... },
	
	"applications":{ ... },
	
	"modules":{ ... },
	
	"plugins":{ ... },
	
	"security":"security.json",
	
	"loggers":"loggers.json",
	
	"traces":"traces.json"
}
```



# Second level settings:

### For nodes:


### For services:


### For applications:


### For modules:


### For plugins:


### For security:


### For loggers:


### For traces:


### For templates:
The second level "templates" collection stores all templates definition.
A template can be used everywhere.

Define a global template and a service template:
```{
	"templates":{
		"services":{
			"security_svc_template":{
				"type":"security",
				"tenant":"${svc_tenant}",
				"version":"1.2.0",
				"routes":[
					{
						"route":"/login",
						"action":"login"
					},
					{
						"route":"/signin",
						"action":"login"
					},
					{
						"route":"/logout",
						"action":"logout"
					},
					{
						"route":"/signup",
						"action":"signup"
					},
					{
						"route":"/renew",
						"action":"renew"
					}
				]
			}
		},
		"security_single_node_template":{
			"services":{
				"${svc_name}":{
					"template":"security_svc_template",
					"values":{
						"svc_tenant":${app_tenant}
					}
				}
			},
			"nodes":{
				"${node_name}":{
					"host":"${$host_name}",
					"tenant":"${app_tenant}",
					"is_master":false,
					"servers":{
						"${node_server_name}":{
							"type":"express",
							"tenant":"${app_tenant}",
							"port":"${node_server_port}",
							"protocole":"http",
							"middlewares":[],
							
							"security": {
								"authentication": {
									"enabled":true,
									"plugins":"${security_plugins}"
								}
							}
						}
					}
				}
			},
			"applications":{
				"${app_name}":{
					"tenant":"${app_tenant}",
					"version":"${app_version}",
					"env":"${app_env}",
					"group":"${app_group}",

					"description":"...",

					"url":"${app_url}",
					
					"services":{
						"provides":{
							"${svc_name}": { "servers":["${node_server_name}"], "filters":["*"] }
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
			}
		}
	}
}```


Use a global template:

```{
	"nodes":...,
	"templated":[
		{
			"template":"security_single_node",
			"values":{
				"app_name":"my_app_1",
				"app_tenant":"Client 12",
				"app_version":"0.5.3",
				"app_env":"production",
				"app_group":"financial",
				"app_url":"my_apps/my_app_1",
				"svc_name":"my_app_1_svc",
				"node_name":"my_app_1_node",
				"host_name":"localhost",
				"node_server_name":"my_app_1_server",
				"node_server_port":8080,
				"security_plugins":["file_users", "oauth2"]
			}
		}
	]
}```