# Features summary


## Configurable without code
Devapt has for first principle to build applications without coding common features.
Why writing code to offer REST api, metrics, role based security, database access...
Concentrate your coding forces to write uncommon business code.

[CONFIGURABLE](https://github.com/lucbories/Devapt/tree/master/docs/features/CONFIGURABLE.md)



=================

## Distributed
Devapt provides a distributed infrastructure of nodes with a master configuration pushed on others nodes.

Nodes communicate between them with messages passing.

Each node corresponds to a Node instance and provides one or more servers.

Eache server provides one ore more services.

A simple application can have one node with one server.

A more complex application can have several nodes on one ore more host and each node can have one ore more servers.

Distributed feature can help to create micro-services based application.

[DISTRIBUTED](https://github.com/lucbories/Devapt/tree/master/docs/features/DISTRIBUTED.md)



=================

## Messaging
Devapt provides messages bus server and client classes.

Distributed nodes communicates each others with simple JSON messages.

[MESSAGING](https://github.com/lucbories/Devapt/tree/master/docs/features/MESSAGING.md)



=================

## Metrics
Applications optimization and analyze need some metrics.

Usefull libraries offer builin metrics support but each one with its own format.

Devapt provides a unique metrics format per server domain: http request, messaging request...

[METRICS](https://github.com/lucbories/Devapt/tree/master/docs/features/METRICS.md)



=================

## Rendering
Applications can render pages on server side or on browser side.

Render engine accepts rendering plugins:
* default (simple HTML tags)
* Foundation (ZURB HTML/CSS rendering framework)
* jQuery UI

[RENDERING](https://github.com/lucbories/Devapt/tree/master/docs/features/RENDERING.md)



=================

## Security
Devapt framework lets you use the best in class authentication features with Passport technology.

Authorization is provided by an ACL module for per resource permissions with roles.

[SECURITY](https://github.com/lucbories/Devapt/tree/master/docs/features/SECURITY.md)


=================

## Servers
Devapt provides builtin servers for common usages (Restify, Express, SocketIO).

But you can code your own server.

A server is attached to a node (a couple of hostname and port).

[SERVERS](https://github.com/lucbories/Devapt/tree/master/docs/features/SERVERS.md)


=================

## Services
Devapt enables features for applications with services.

A service is enabled on a server on a node.

A service is provided and consumed.

Builin services:
* static assets router
* resources definitions router
* CRUD operations router
* middleware router for functions as f(request,response,next)

[SERVICES](https://github.com/lucbories/Devapt/tree/master/docs/features/SERVICES.md)

