var fs = require('fs.extra');




/*
fs.copy('foo.txt', 'bar.txt', { replace: false }, function (err) {
  if (err) {
    // i.e. file already exists or can't write to directory 
    throw err;
  }
 
  console.log("Copied 'foo.txt' to 'bar.txt');
});

try {
  fs.mkdirpSync('/tmp/foo/bar/baz');
} catch(e) {
  throw e;
}

fs.move('foo.txt', 'bar.txt', function (err) {
  if (err) {
    throw err;
  }
 
  console.log("Moved 'foo.txt' to 'bar.txt');
});

var walker = fs.walk(dir)
  ;
 
// file, files, directory, directories 
walker.on("file", function (root, stat, next) {
  var filepath = path.join(root, stat.name)
    ;
 
  console.log(filepath);
});

fs.copyRecursive('./foo', './bar', function (err) {
  if (err) {
    throw err;
  }
 
  console.log("Copied './foo' to './bar');
});

fs.mkdirp('/tmp/foo/bar/baz', function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('pow!')
  }
});

*/