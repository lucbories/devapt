# Devapt - Roadmap



## 1.4.x	implement Cloud features (LATER)

### PROJECT
* document Cloud integration process (TODO)
* write Unit tests for Cloud integration classes (TODO)


### FEATURES
* implement AWS DynamoDB datasource (TODO)
* implement AWS Lambda integration (TODO)
* implement AWS Security integration (TODO)



## 1.3.x	enhance datas access features (LATER)

### PROJECT
* document datas access process (TODO)
* write Unit tests for datas access classes (TODO)


### FEATURES
* enhance devapt-devtools: create datas access dashboard (TODO)
* enhance devapt-devtools: create datas admin backend (TODO)
* implement homogeneous datas access for all datasources (TODO)
* enhance sequelize datasource for SQL databases:MySQL, MariaDb, PostgreSQL, SQLite, MSSQL (TODO)
* implement mongoose datasource for mongodb NoSQL database (TODO)
* implement Redis datasource for caching, messaging, NoSQL database (TODO)
* implement datas management classes for browser and server (TODO)
* implement datas cache on distributed nodes (TODO)



## 1.2.x	enhance security features (LATER)

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



## 1.1.x	enhance core features, architecture and stability (CURRENT)

### PROJECT
* update web site on github with project/, technical/... (TODO)
* document build process (TODO)
* rearrange directories into common/, browser/, server/ (DONE)
* write Unit tests for base classes (CURRENT)
* use babel-register to debug without build to dist/ directory (DONE)
* test on nodejs 4.4, 5.1, 6.x (DONE)


### FEATURES
* implement browser router for single page application (DONE)
* enhance devapt-devtools: runtime registry viewing (DONE)
* enhance devapt-devtools: runtime topology viewing (DONE)
* enhance devapt-devtools: metrics on topology (TODO)
* enhance devapt-devtools: application Redux state viewing (TODO)
* enhance devapt-devtools: application Redux state history player (TODO)
* implement unit test for instances, traces, loggers... (CURRENT)
* implement distributed services consumers (TODO)
* implement master configuration changes: receive and propagate complete/add/remove/update (TODO)
* implement master node revocation and promotion (TODO)
* implement node settings filter (TODO)
* implement swagger API player (TODO)
* implement circuit breaker on browser (TODO)
* implement topology registry (DONE)
* implement topology runtime (DONE)
* implement generic api for state storing (Redux, Map) (DONE)
* implement cache management classes for browser and server (DONE)



## 1.0.x   first stable release (RELEASED)

### PROJECT
* create web site on github with index, api/, features/ (DONE)
* complete files inline comments for classes and methods (DONE)
* write a CONTRIBUTING file (DONE)
* generate API docs (DONE)
* clean files (DONE)
* clean build process (DONE)
* create and publish NPM modules:devapt, devapt-devtools... (DONE)
* complete features documentation (CURRENT)


### FEATURES
* enhance devapt-devtools:logs, messages, metrics, settings (DONE)
* write test for authentication (TODO)



## 0.9.x   initial release (not ready for production)