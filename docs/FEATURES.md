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

[SERVERS](https://github.com/lucbories/Devapt/tree/master/docs/features/SERVERS.md)


=================

## Services
Restify provides a builtin Restfull API server.

Express provides a builtin web pages server.


Application features
* security server: authentication (for example with login/password), authorization (permissions for roles on resources)
* views abstraction layer (switch on backends to render the application)


Developper features
* JSON configuration files to describe application, models, views and all others resources
* datas abstraction layer
* UI patterns take the best of MVC and MVVC
* template engine
* Foundation 5 renderer engine
* fully asynchronous processing with promises
* standard client/server communication: Restfull with JSONP exchanges
* fully documented classes
* JS library introspection
* authoring tools (app builder, events spy, objects inspectors)
* server Mysql data store
* server MongoDB data store (coming soon)
* client browser data store
* AMD loader
* QUnit tests
* jQuery UI renderer engine (coming soon)
* ExtJS renderer engine (coming soon)