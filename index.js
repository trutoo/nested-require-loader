var path = require('path');
var steed = require('steed');
var loaderUtils = require('loader-utils');
var schema = require('./options-schema.json');
var ajv = new require('ajv')({ useDefaults: true });

function resolveFile(loaderContext, loaderOptions, require, callback) {

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
        var result = eval(source);
        // Ensure that extra quotes are not added if the result is already a string
        require.result = typeof result === 'string' && loaderOptions.rawString ? result : JSON.stringify(result);
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
  var loaderOptions = Object.assign({}, loaderUtils.getOptions(loaderContext));
  var callback = loaderContext.async();
  var pattern = /require\(['"](.*?)['"]\)/g;

  // Validate options and prevent incorrect options
  var validate = ajv.compile(schema);
  if (!validate(loaderOptions)) {
    return callback(new Error('loader options are incorrect'));
  }

  var match, requires = [];
  while (match = pattern.exec(content)) {
    requires.push({
      match: match[0],
      path: match[1],
      index: match.index,
    })
  }

  steed.map(requires, resolveFile.bind(null, loaderContext, loaderOptions), function(err, results) {
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
