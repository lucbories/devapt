<<<<<<< HEAD
Devapt
======

Current version: 1.0.0 beta (do not use in production environment)

What is it?
-----------

The Developper Application Toolkit is a declarative programming library.
Devapt help you to write less code and to use easily more features.
It use PHP for the server side and Javascript for the client side.
The PHP server part is based on Zend Framework 2 modules.
In the future, a NodeJS server should be created.
With Devapt you can declare your datas models, your views and your application.
Simply launch index.php and your application is up with at least a JSON server and
a rich user interface. The browser part is rendered with one of many backends.
For the first release, a Foundation 5 and a jQueryUI backends should be available.
Devapt is a rewrite of Libapt.

The Latest Version
------------------

Details of the latest version can be found on the Devapt project page
under https://github.com/lucbories/DevApt.

Documentation
-------------

The documentation available as of the date of this release is
included in HTML format in the devapt-doc/ directory.
A more user friendly website is available at www.devapt.org but it is not up to date for this beta release.
The documentation module contains:
 * client side Javascript API (english)
 * server side PHP API (english)
 * client/server communication format (all versions)
  * json request / response format
  * model query format
=======
# Devapt

Current version: 0.9.0 (do not use in production environment)

NPM module isn't available yet, please download devapt source insteed.

Module would be available before version 1.0.0 final.



## What is it?

The Developpers Application Toolkit is a usefull package for developers:
create quickly and securely a complex distributed set of applications or a simple alone application. 

This project is based on Javascript (ECMAscript 6 transpiled in ES5) and nodejs.
Devapt contains a server runtime and a set of client features.
Devapt help you to write less code and to use easily more features.

The principle is simple: you write some configuration files for distributed nodes, models, views and menus and the you start the application.
The framework will automatically generates the RESTfull server.
Simply launch index.html and your application is up a rich user interface and many features.

See [FEATURES](https://github.com/lucbories/Devapt/tree/master/docs/FEATURES.md)



## USAGE

See [GETTING_STARTED](https://github.com/lucbories/Devapt/tree/master/docs/GETTING_STARTED.md)

Devapt library offers a "runtime" instance which delivers this features:
* main rendering wrapper (Render instance)
* rendering base class (Component class)
* Redux store wrapper
* configuration settings wrapper
* main logging wrapper



## LICENCE

Apache Version 2 license.

See [LICENSE](https://github.com/lucbories/Devapt/tree/master/LICENSE)



## ROADMAP
0.9.0   initial release (not ready for production)
1.0.0   first stable release
1.1.0   add features and tests

See [ROADMAP](https://github.com/lucbories/Devapt/tree/master/docs/ROADMAP.md)



## BUGS

See [LICENSE](https://github.com/lucbories/Devapt/issues) TO CHECK



## Technical details

With Devapt you define 
* A topology, simple (one application, one server, one service) or complex (many services distributed for many applications on many distributed servers).
* Some resources (models, views, menubars, menus)
* Security rules

A topology contains:
* nodes: A node is a nodejs process with a unique name. You can have many nodes on the same machine.
Each node communicates with other node through a couple (host, port).
A node can have one or many servers.
* servers: A server provides one or more services and listen client connections through a couple (host, port).
A server has a unique name and can be one of types: restify, express, socket.io, message bus...
* services: A service offer one feature to clients. A service can be one of: static assets providers, middleware provider, model RESTfull access...
* applications: An application contains some services and is provided through nodes and servers.
An application can have one service on one server on one node.
Or many services on many servers on many nodes.
* modules: functional features for applications (a set of preconfigured UI for example).
* plugins: technical fearures for applications (a rendering provider for example).
* security: defines authentication and authorization rules.

The rendering engines are plugins and rendering classes are stateless: state is stored in a Redux store.
See [Getting Started with Redux](https://egghead.io/series/getting-started-with-redux) for flow concepts.



## Devapt is a glue between many usefull projects
Thanks for all projects leaders and contributers.

The given list is an extract of all used or inspired projects.


Main dependancies:

NodeJS: https://nodejs.org

Servers and datas access:
* Express: http://expressjs.com/
* Restify: http://restify.com/
* Epilogue: https://github.com/dchester/epilogue
* Sequelize: http://sequelizejs.com
* Socket.io: http://socket.io/

Security:
* Passport: http://passportjs.org
* Node ACL: https://github.com/OptimalBits/node_acl

Foundations
* SimpleBus: https://github.com/ajlopez/SimpleBus
* jQuery: https://jquery.com
* Immutable: https://facebook.github.io/immutable-js/docs/#/
* Redux: http://redux.js.org/docs/introduction/Motivation.html
* Moment: http://momentjs.com/
* Vantage: https://github.com/dthree/vantage
* Bunyan: https://github.com/trentm/node-bunyan
* Winston: https://github.com/winstonjs/winston
* Circuit breaker: https://www.npmjs.com/package/circuit-breaker or https://github.com/yammer/circuit-breaker-js

Rendering:
* Foundation by ZURB: http://foundation.zurb.com/sites.html
* Mustache: https://github.com/janl/mustache.js
* React: http://facebook.github.io/react/docs/tutorial.html



Dev and build dependancies: (coming soon.)
* Babel:
* Chai:
* Gulp
* Mocha


>>>>>>> develop

Installation
------------

Please see the file called INSTALL.md.

<<<<<<< HEAD
Licensing
---------

Please see the file called LICENSE.
=======

>>>>>>> develop

Contacts
--------

To subscribe to news or report a bug or contribute to the project, use the project website at https://github.com/lucbories/DevApt.
