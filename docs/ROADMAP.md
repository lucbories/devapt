# Devapt - Roadmap


## 2.0.x   breaking changes and features addition (CURRENT)

### MAIN GOALS
When I was working on devtools features with devapt 1.0.x, I meet some trouble with missing features.
An other problem was to deal with topology definition and deployment information previously stored in many pieces of code.
It was difficult to obtain a global view of defined or deployed topology.
So I pull out deployment information from topology definition.

One missing feature for fine deployment was the lake of customer and version of defined items.



Main added features:
* isomorphic Credentials class to deal with session information on browser or on server (tenant, application, username, token...). (DONE)
* isomorphic data management classes: DataStore, DataRecord, DataCollection...
* topology management classes: TopologyDefineItem...(DONE)
* topology deployment classes: TopologyDeployLocalNode... (DONE)
* browser router (for single page application and more) (DONE)
* isomorphic cache management (DONE)
* versionned Collection to register versionned items (CURRENT)
 

Main breaking changes:
* settings json format has evolved
* module was renamed to package
* change Collection.$items from [] to {}, use lodash as collection backend



New topology tree is now:
```
world: the root of the topology

-nodes
--nodeA
---serverA1
---serverA2

-tenants
--tenantA
---applications
----applicationA
-----url
-----license
-----provided_services
-----used_services
-----used_packages
-----used_plugins
-----assets
---packages
----packageA
-----base_dir
-----resources
-----services
---security

-plugins
--pluginA
---type
---file or package

-deployments
--tenantA
---applicationA
----assets
----services

-security
-loggers
-traces
```
That's why previous roadmap is outdated, sorry for the changes.



### enhance core features, architecture and stability (previous 1.1.x)

#### PROJECT
* refactor directories into common/, browser/, server/ (DONE)
* implement Unit tests for base classes (CURRENT)
* use babel-register to debug without build to dist/ directory (DONE)
* test on nodejs 4.4, 5.1, 6.x (DONE)

#### FEATURES
* implement browser router for single page application (DONE)
* enhance devapt-devtools: runtime registry viewing (DONE)
* enhance devapt-devtools: runtime topology viewing (DONE)
* enhance devapt-devtools: metrics on topology (TODO)
* enhance devapt-devtools: application Redux state viewing (TODO)
* enhance devapt-devtools: application Redux state history player (TODO)
* implement unit test for instances, traces, loggers... (CURRENT)
* implement topology registry (DONE)
* implement topology runtime (DONE)
* implement generic api for state storing (Redux, Map) (DONE)
* implement cache management classes for browser and server (DONE)



### enhance datas access features (previous 1.3.x)

### PROJECT
* document datas access layers (TODO)
* write Unit tests for datas access classes (TODO)


### FEATURES
* enhance devapt-devtools: create datas access dashboard (TODO)
* enhance devapt-devtools: create datas admin backend (TODO)
* implement homogeneous datas access for all datasources (DONE)
* enhance sequelize datasource for SQL databases:MySQL, MariaDb, PostgreSQL, SQLite, MSSQL (DONE)
* implement waterline ORM layer (TODO)
* implement Redis datasource for caching, messaging, NoSQL database (TODO)
* implement datas management classes for browser and server (DONE)
* implement datas cache on distributed nodes (TODO)



## 2.1.x	enhance distributed features and documentatioon (LATER)

### PROJECT
* update web site on github with project/, technical/... (TODO)
* document build process (TODO)


### FEATURES
* implement distributed services consumers (TODO)
* implement master configuration changes: receive and propagate complete/add/remove/update (TODO)
* implement master node revocation and promotion (TODO)
* implement node settings filter (TODO)
* implement swagger API player (TODO)
* implement circuit breaker on browser (TODO)



## 2.2.x	enhance security features (LATER)

### PROJECT
* document security process (TODO)
* write Unit tests for security classes (TODO)


### FEATURES
* enhance devapt-devtools: create security dashboard (TODO)
* enhance devapt-devtools: create security admin backend (TODO)
* implement security routes /login, /signup, /logout (TODO)
* implement Passport security plugin (TODO)
* implement authorization with ACL (TODO)
* implement security token (TODO)
* implement registry setting validation with a json schema (TODO)



## 2.3.x	implement Cloud features (LATER)

### PROJECT
* document Cloud integration process (TODO)
* write Unit tests for Cloud integration classes (TODO)


### FEATURES
* implement AWS DynamoDB datasource (TODO)
* implement AWS Lambda integration (TODO)
* implement AWS Security integration (TODO)













