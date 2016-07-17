
# Devapt

With DEVAPT you can easily develop powerfull application.
Built-in features cover many important subjects as: authentication, restfull, http server, distributed services, logs, metrics...
Main characteristics of DEVAPT architecture is dynamic behaviors, reactive programming, object oriented ES6 javascript, gulp build chain
All of this on NodeJS.

A usefull application is DEVTOOLS which actualy display settings, logs, buses messages, metrics and topology.
[DEVTOOLS project](https://github.com/lucbories/devapt-devtools/)

In a near futur, DEVTOOLS will act as a configurable application builder for DEVAPT applications.

devapt and devapt-* github repositories have the same structure: a master branch with the last tagged tree, a develop branch with latest comited updates and tags.

Versionning use standard method: M.m.p with M is a major change, m a minor change, p a patch.



## Installation

Via npm on Node:

```js
npm install devapt
```



## Usage

Reference in your program:

```js
// For ES5
var devapt = require('devapt').default
var runtime = devapt.runtime

// for ES6 / ES2015
import devapt from 'devapt'
const runtime = devapt.runtime

var runtime_settings = {
	'is_master':true,
	'name':'NodeA',
	
	// BUSES SERVERS (for inter nodex communication)
	"master":{
		"name":"NodeA",
		
		"msg_bus":{
			"type":"simplebus_server",
			"host":"localhost",
			"port":5000
		},
		"logs_bus":{
			"type":"simplebus_server",
			"host":"localhost",
			"port":5001
		},
		"metrics_bus":{
			"type":"simplebus_server",
			"host":"localhost",
			"port":5002
		}
	},
	
	"base_dir": "",
	
	"settings_provider": {
		"source":"local_file",
		"relative_path":"resources/apps.json"
	}
}

runtime.load(runtime_settings)

```



## Development

```
git clone git://github.com/lucbories/Devapt.git
cd devapt
npm install
npm test
```



## Samples and tutorials

Coming soon.
- [...](https://github.com/lucbories/Devapt/tree/master/samples/XXXX)

See DEVTOOLS project for a complete DEVAPT application:
[DEVTOOLS project](https://github.com/lucbories/devapt-devtools/)



## Versions

- 1.0.0: Published



## Contribution

Feel free to contribute, you're welcome.

Check issues and solve it:
[file issues](https://github.com/lucbories/devapt)

Submit your work:
[pull requests](https://github.com/lucbories/devapt/pulls)

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.


