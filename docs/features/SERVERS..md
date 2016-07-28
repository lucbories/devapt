# Devapt - Features - Servers


## Description
Servers provide featured services.



## Status
Express server: make middlewares use configurables.

Restify server: make middlewares use configurables, check authorizations.

Need Test, Optimization and code review.



## Builtin servers
Devapt provides builtin servers for common usages.
But you can code your own server.

### EXPRESS
Serve static pages or middleware generated content.

### RESTIFY
Serve RESTfull content.



### For Devapt users:
Configure servers in nodes.json
A JSON nodes servers declaration:
```
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
				},
				"NodeALocal8081":{
					"type":"restify",
					"port":8081,
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
		},
		
		"NodeB":{
			"host":"localhost",
			"is_master":false,
			"servers":{
				"NodeBLocal8080":{
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
				},
				"NodeBLocal8081":{
					"type":"restify",
					"port":8081,
					"protocole":"http",
					"middlewares":[],
					"use_socketio":true,
					
					"security": {
						"authentication": {
							"enabled":true,
							"plugins":["file_users"]
						}
					}
				},
				"NodeBLocal8082":{
					"type":"express",
					"port":8082,
					"protocole":"http",
					"middlewares":[],
					"use_socketio":true,
					
					"security": {
						"authentication": {
							"enabled":true,
							"plugins":["file_users"]
						}
					}
				},
			}
		}
	}
}
```
Each node contains one or more servers.

A server declaration:
```
"serverA2":{
	"type":"express",
	"port":8082,
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
```
A server has 
* a name string, the key of the server record ("serverA2"), should be unique on a node and between all distributed nodes.
* a type string: express, restify, socket.io ("express"), "cluster" and "bus" are coming soon.
* a port integer (8081), should be unique on a node.
* a protocole string ("http"), others will arrive later.
* a middlewares array ([]), not used yet but it will give configurable middleware uses.
* a flag: use or not socketio between browser and server.
* a security record.




## For Devapt contributers:




## Thanks

### Express
Strongloop provides a wonderfull de facto standard library, Express.
It's a very popular project, used by many people.

[Express](https://github.com/strongloop/express)


### Restify
Restify helps to easily provides a RESTfull server.

[Express](https://github.com/.../restify)
