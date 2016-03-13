Devapt / server / models
========================



REST API
------------------

HTTP METHOD|DATAS OPERATION|URL|URL PARAMETERS|PAYLOAD
------|------------|------------------------|--------|--------
GET|List all records|/{app rest base url}/{resource model name}/|credentials or nothing|credentials or nothing
GET|List queried records|/{app rest base url}/{resource model name}/|credentials or nothing|credentials? and query
GET|Read one record|/{app rest base url}/{resource model name}/{record id}|credentials or nothing|credentials or nothing
POST|Create one record|/{app rest base url}/{resource model name}|credentials or nothing|credentials? record plain object
PUT|Update one record|/{app rest base url}/{resource model name}|credentials or nothing|credentials? record plain object




