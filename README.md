Devapt
======

Current version: 1.0.0 beta (do not use in production environment)

What is it?
-----------

The Developper Application Toolkit is a usefull library for developers.
Devapt help you to write less code and to use easily more features.
The developper declare some resources on the server and the client part automatically generates the application.

With Devapt you can declare your datas models, your views and your application.
Simply launch index.php and your application is up with at least a JSON server and
a rich user interface.


Features summary
----------------

see FEATURES.md for a full description

* declarative programming
* datas abstraction layer
* views abstraction layer (switch on backends to render the application)
* ... Model View View Controller MVVC
* template engine
* Foundation 5 renderer engine
* jQuery UI renderer engine (coming soon)
* ExtJS renderer engine (coming soon)
* fully asynchronous processing with promises
* standard client/server communication: Restfull with JSONP exchanges
* fully documented classes
* JS library introspection
* authoring tools (app builder, events spy, objects inspectors)
* server Mysql data store
* server MongoDB data store (coming soon)
* client browser data store
* security server
* AMD loader
* QUnit tests
* composer PHP packaging


Architecture summary
--------------------
It is composed of two parts: a server side (provider for datas, security and resources) and a client part.

For instance the server part use PHP. The PHP server part is based on Zend Framework 2 modules.
In the future, a NodeJS server should be created.

The client part use modern Javascript.

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

  
Installation
------------

Please see the file called INSTALL.md.


Licensing
---------

Please see the file called LICENSE.


Contacts
--------

To subscribe to news or report a bug or contribute to the project, use the project website at https://github.com/lucbories/DevApt.
