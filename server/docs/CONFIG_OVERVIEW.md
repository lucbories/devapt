Devapt / server / config
========================


STATUS:
------------------
The Config module is responsible to manage applications and resources configurations.
The first release deal with readonly resources configurations.
Only Get and List routes are available.


PRINCIPLE
------------------
Devapt is a flexible framework which acts as a dynamic runtime for one or more configured applications.
* Each application uses one ore more configuration sources: INI file, JSON file, JSON object, SQL database (later), NoSQL database (later).
* Each configuration source provides resources declarations: datasources, datas models, UI views, UI menubars and menus.
* Each resource configuration could evolve to dynamically update application features and UI.
* A resource is dynamically created or updated with configuration items, for example: name, type, label, model datasource, model fields, events handles, link with an other view...


ARCHITECTURE
------------------
A configuration set or settings is a javascript plain object. It is stored at a unique point and it is available through the corresponding resource name.
Resources settings are managed from a repository an the server side.
Browser client ask for a configuration of a named resource before to instanciate the resource and before to display or query this resource instance.

