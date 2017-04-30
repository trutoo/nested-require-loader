var path = require('path');
var steed = require('steed');

function resolveFile(loaderContext, require, callback) {

  var dirname = path.dirname(loaderContext.resourcePath);
  var __webpack_public_path__ = loaderContext._compilation.options.output.publicPath || '';

  loaderContext.resolve(dirname, require.path, function(err, filename) {
    if (err) {
      return callback(err);
    }

    // Ensure Webpack knows that the file is a dependency of the manifest
    loaderContext.dependency && loaderContext.dependency(filename);

    // Asynchronously pass the file through the loader pipeline
    loaderContext.loadModule(filename, function(err, source, map, module) {
      if (err) {
        return callback(err);
      }

      try {
        require.result = JSON.stringify(eval(source));
        callback(null, require);
      } catch (err) {
        callback(err);
      }
    });
  });
}

module.exports = function(content) {
  this.cacheable && this.cacheable();

  var loaderContext = this;
  var callback = loaderContext.async();
  var pattern = /require\(['"](.*?)['"]\)/g;

  var match, requires = [];
  while (match = pattern.exec(content)) {
    requires.push({
      match: match[0],
      path: match[1],
      index: match.index,
    })
  }

  steed.map(requires, resolveFile.bind(null, loaderContext), function(err, results) {
    if (err) {
      return callback(err);
    }

    // Replace the require call with loaded file public path
    for (var i = 0; i < results.length; i++) {
      content = content.replace(results[i].match, results[i].result); 
    };

    // Final clean up for double quoted strings
    content = content.replace(/(['"])['"]/g, '$1');
    callback(null, content);
  });
};
