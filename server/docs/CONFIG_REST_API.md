Devapt / server / config
========================



REST API
------------------
List all resources of a given type (DONE):
GET with url: /resources/{resources type name}

Get a resource configuration (DONE):
GET with url: /resources/{resources type name}/{resources name}

Update a resource configuration (TODO):
PUT with url: /resources/{resources type name}/{resources name} and a plain object payload as { setting_name: setting value }

Create a full resource configuration (TODO):
POST with url: /resources/{resources type name}/{resources name} and a plain object payload as { full plain object }

Delete a full resource configuration (TODO):
DELETE with url: /resources/{resources type name}/{resources name} and no payload
