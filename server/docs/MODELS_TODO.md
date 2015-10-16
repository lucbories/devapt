Devapt / server / models
========================


STATUS:
------------------
The Models module is responsible to manage datas access resources configurations.
Model resources


PRINCIPLE
------------------
Devapt is a flexible framework which acts as a dynamic runtime for one or more configured applications.
* 


ARCHITECTURE
------------------
databases file:

models file:
dependancies: sequelize, q, databases, assert, ../config/app_config
API
init
load_association
load_fields
load_model
to_boolean
get_field_type
get_field_validate
add_model
get_model
get_models


REST API
------------------
HTTP METHOD|DATAS OPERATION|URL|URL PARAMETERS|PAYLOAD
------|------------|------------------------|--------|--------
GET|List all records|/{app rest base url}/{resource model name}/|credentials or nothing|credentials or nothing
GET|List queried records|/{app rest base url}/{resource model name}/|credentials or nothing|credentials? and query
GET|Read one record|/{app rest base url}/{resource model name}/{record id}|credentials or nothing|credentials or nothing
POST|Create one record|/{app rest base url}/{resource model name}|credentials or nothing|credentials? record plain object
PUT|Update one record|/{app rest base url}/{resource model name}|credentials or nothing|credentials? record plain object




