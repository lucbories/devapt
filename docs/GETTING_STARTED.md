
# Devapt

Dynamic, reactive, configurable application builder for Node.js.

## Installation

Via npm on Node:

```
npm install devapt
```

## Usage


Reference in your program:

```js
var devapt = require('devapt/base/runtime'); // for ES5
import runtime from 'devapt/base/runtime' // for ES6 / ES2015

var runtime_settings = {
	'is_master':true,
	'name':'NodeA',
	
	'master':{
		'name':'NodeA',
		'host':"localhost",
		'port':5000
	},
	
	'apps_settings_file': 'apps/apps.json'
}

runtime.load(runtime_settings)

```


## Development

```
git clone git://github.com/lucbories/Devapt.git
cd Devapt
npm install
npm test
```

## Samples and tutorials

- [...](https://github.com/lucbories/Devapt/tree/master/samples/XXXX)

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


