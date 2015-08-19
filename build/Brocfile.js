
/* Brocfile.js */


/*
  BUILD
  cd DevApt
  cd build
  rm -Rf ../dist_broccoli
  broccoli build ../dist_broccoli
*/

// console.log('BROCCOLI TASK IS STARTING');

// var broccoli = require('broccoli')
// var babel = require('broccoli-babel-transpiler');
// var mergeTrees = require('broccoli-merge-trees');
// var browserify = require('broccoli-browserify');
var Concat = require('broccoli-concat');
var Requirejs = require('broccoli-requirejs');
// var uglify = require('broccoli-uglify-js');


// USE MERGE TREES
// var merge_trees_result = mergeTrees(['client/src/js/']);
// /datas/GitHub/DevApt/
var input = '../client/src/js';

// USE CONCAT
var Concat_tree = Concat(input,
  {
    inputFiles: ['**/*.js'],
    outputFile: '/devapt-client-all.js',
    separator: '\n', // (optional, defaults to \n) 
    wrapInEval: false, // (optional, defaults to false) 
    wrapInFunction: false, // (optional, defaults to true) 
    header: '/** Copyright ... **/', // (optional) 
    footer: '/** END OF FILE **/' // (optional) 
  }
);
// console.log(concat_result, 'BROCCOLI CONCAT RESULT');


var Requirejs_settings = {
  verbose   : true,
  requirejs : {
    name : 'devapt-client-all',
    out  : '/devapt-requirejs.js'
  }
};
input = Concat_tree;
var result = Requirejs(input, Requirejs_settings);

module.exports = result;

// var builder = new broccoli.Builder(concat_result);
// builder.build().then(
//   function(results)
//   {
//     console.info('build success');
//   }
// );


// USE UGLIFY
// var uglify_result = uglify(concat_result, {
//   compress:true
// });



// var options = {
// 	entries:['./src-js6/js/Devapt.js'],
// 	outputFile:'devapt-min.js',
// 	browserify:{},
// 	bundle:{},
// 	require:{}
// };
// var browserify_result = browserify(src_js, options);

// console.log(concat_result, 'BROCCOLI TASK RESULT');
// module.exports = uglify_result;

/*
// on importe l'extension babel
var babel = require('broccoli-babel-transpiler');

// on récupère la source et on la transpile en une étape
fruits = babel('src-js6/js'); // src/*.js

module.exports = fruits;
*/


/*
// Import some Broccoli plugins
var compileSass = require('broccoli-sass');
var filterCoffeeScript = require('broccoli-coffee');
var mergeTrees = require('broccoli-merge-trees');

// Specify the Sass and Coffeescript directories
var sassDir = 'app/scss';
var coffeeDir = 'app/coffeescript';

// Tell Broccoli how we want the assets to be compiled
var styles = compileSass([sassDir], 'app.scss', 'app.css');
var scripts = filterCoffeeScript(coffeeDir);

// Merge the compiled styles and scripts into one output directory.
module.exports = mergeTrees([styles, scripts]);
*/

/* shell cms: broccoli build dist */