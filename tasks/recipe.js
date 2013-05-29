/*
 * grunt-recipe
 * https://github.com/sideroad/grunt-recipe
 *
 * Copyright (c) 2013 sideroad
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var path = require('path');

  grunt.registerMultiTask('recipe', 'Your task description goes here.', function() {
    var options = this.options({
          concat: 'concat',
          min: 'uglify',
          version: ''+new Date().getTime(),
          suffix: {
            concat: {
              unpack: '.with-dependencies.unpack.js',
              min: '.with-dependencies.js'
            },
            origin: {
              unpack: '.unpack.js',
              min: '.js'
            }
          },
          prepend: {
            version: {
              concat: false,
              origin: false
            }
          }
        }),
        target = this.target,
        _ = grunt.util._;

    this.files.forEach(function(f) {
      var json = {},
          recipe = {},
          src = f.src.filter(function(filepath) {
            if (!grunt.file.exists(filepath)) {
              grunt.log.warn('Source file "' + filepath + '" not found.');
              return false;
            } else {
              return true;
            }
          }).map(function(filepath) {
            recipe = _.extend(recipe, grunt.file.readJSON(filepath));
          }),
          resolve = function(namespace){
            var dependencies = recipe[namespace].dependencies,
                childs = [];
            if(dependencies.length){
              _.map(dependencies, function(namespace){
                childs = childs.concat( resolve(namespace) ).concat(namespace);
              });
            }
            return _.uniq(childs );
          },
          dependenciesPath = path.resolve( f.dest, 'recipe.dependencies.js'),
          versionPath = path.resolve( f.dest, 'recipe.version.js');

      _.each(recipe, function( val, namespace ){
        var files,
            concat,
            min,
            dependencies = _(resolve(namespace)).chain().union([namespace]),
            dest = path.resolve( recipe[namespace].dest, path.basename( val.path )),
            concated = dependencies.map(function(namespace){
              var path;
              if(recipe[namespace].concat !== false){
                path = recipe[namespace].path;
              }
              return path;
            }).compact().value();

        if(options.concat && recipe[namespace].concat !== false){
          concat = grunt.config.get(options.concat);

          // concat dependencies
          files = {};
          files[dest.replace(/\.js$/, options.suffix.concat.unpack)] = (options.prepend.version.concat) ? [versionPath].concat(concated) : concated;
          concat[target + '.' + namespace+options.suffix.concat.unpack] = {files: files};

          // oringinal source
          files = {};
          files[dest.replace(/\.js$/, options.suffix.origin.unpack)] = (options.prepend.version.origin) ? [versionPath, val.path] : [val.path];
          concat[target + '.' + namespace+options.suffix.origin.unpack] = {files: files};

          grunt.config.set(options.concat, concat);
        }

        if(options.min && recipe[namespace].min !== false){
          min = grunt.config.get(options.min);

          // concat dependencies with minify 
          files = {};
          files[dest.replace(/\.js$/, options.suffix.concat.min)] = (options.prepend.version.concat) ? [versionPath].concat(concated) : concated;
          min[target + '.' + namespace+options.suffix.concat.min] = {files: files};

          // original source with minify
          files = {};
          files[dest.replace(/\.js$/, options.suffix.origin.min)] = (options.prepend.version.origin) ? [versionPath, val.path] : [val.path];
          min[target + '.' + namespace+options.suffix.origin.min] = {files: files};

          grunt.config.set(options.min, min);
        }

        json[namespace] = dependencies.map(function(namespace){
          return recipe[namespace].url;
        }).value();
      });

      grunt.file.write(dependenciesPath, 'if(!recipe){var recipe=function(){}};recipe.dependencies='+JSON.stringify(json));
      grunt.file.write(versionPath, 'if(!recipe){var recipe=function(){}};recipe.version='+JSON.stringify(''+options.version));

    });


  });

};
