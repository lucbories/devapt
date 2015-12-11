Devapt / Common / Executable
============================

Author: Luc BORIES
Updated: 2015-12-04


CLI commands
------------

Commander based actions.

servers.list
servers.dump		server_name
servers.create		server_name json_settings
servers.delete		server_name
servers.update		server_name json_settings
servers.start		server_name
servers.stop		server_name
servers.clone		server_name_src server_name_target
servers.transfert	server_name_src server_name_target

applications.list	[server...]
applications.dump	app_name
applications.create	app_name json_settings
applications.delete	app_name
applications.update	app_name json_settings

services.list		[application...]
services.dump		svc_name
services.enable		svc_name
services.disable	svc_name
services.execute	svc_name args

metrics.list

resources.list		[collection...]
resources.dump
resources.create	res_name
resources.delete	res_name
resources.update	res_name

store.dump	[path...]