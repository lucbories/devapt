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

### SOCKET.IO
Exchange datas between server and clients.

### MESSAGES BUS
Exchange messages on a bus.


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
				"serverA1":{
					"type":"restify",
					"port":8080,
					"protocole":"http",
					"middlewares":[]
				},
				
				"serverA2":{
					"type":"express",
					"port":8081,
					"protocole":"http",
					"middlewares":[]
				}
			}
		},
		
		"NodeB":{
			"host":"localhost",
			"is_master":false,
			"servers":{
				"serverB1":{
					"type":"restify",
					"port":7080,
					"protocole":"http",
					"middlewares":[]
				},
				
				"clusterB2":{
					"type":"cluster",
					"port":7081,
					"protocole":"http",
					"servers":["serverB21", "serverB22"]
				},
				
				"serverB21":{
					"type":"express",
					"port":7082,
					"protocole":"http",
					"middlewares":[]
				},
				
				"serverB22":{
					"type":"express",
					"port":7083,
					"protocole":"http",
					"middlewares":[]
				}
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
    "port":8081,
    "protocole":"http",
    "middlewares":[]
}
```
A server has 
* a name string, the key of the server record ("serverA2"), should be unique on a node and between all distributed nodes.
* a type string: express, restify, socket.io ("express"), "cluster" and "bus" are coming soon.
* a port integer (8081), should be unique on a node.
* a protocole string ("http"), others will arrive later.
* a middlewares array ([]), not used yet but it will give configurable middleware uses.


## For Devapt contributers:




## Thanks

### Express
Strongloop provides a wonderfull de facto standard library, Express.
It's a very popular project, used by many people.

[Express](https://github.com/strongloop/express)


### Restify
Restify helps to easily provides a RESTfull server.

[Express](https://github.com/.../restify)
