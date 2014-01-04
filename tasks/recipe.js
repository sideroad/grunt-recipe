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
          amd: false,
          version: ''+new Date().getTime(),
          suffix: {
            concat: {
              unpack: '.with-dependencies.unpack.js',
              min: '.with-dependencies.js'
            },
            origin: {
              unpack: '.unpack.js',
              min: '.js',
            },
            amd: {
              unpack: '.amd.unpack.js',
              min: '.amd.js'
            }
          },
          dest: false
        }),
        target = this.target,
        _ = grunt.util._;

    this.files.forEach(function(f) {
      var json = {},
          amd = {},
          dependenciesPath = path.resolve( options.dest || f.dest, 'recipe.dependencies.js'),
          amdDependenciesPath = path.resolve( options.dest || f.dest, 'recipe.amd.dependencies.js'),
          versionPath = path.resolve( options.dest || f.dest, 'recipe.version.js'),
          recipe = {
            'recipe.version': {
              path: versionPath,
              dependencies: []
            },
            'recipe.dependencies': {
              path: dependenciesPath,
              dependencies: []
            },
            'recipe.amd.dependencies': {
              path: amdDependenciesPath,
              dependencies: []
            }
          },
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
          };

      _.each(recipe, function( val, namespace ){
        var files,
            concat,
            min,
            dependencies = _(resolve(namespace)).chain().union([namespace]),
            dest = recipe[namespace].dest ? path.resolve( recipe[namespace].dest, path.basename( val.path )) : '',
            amdDest = recipe[namespace].amd && recipe[namespace].amd.dest ? path.resolve( recipe[namespace].amd.dest, path.basename( val.path )) : '',
            concated = dependencies.map(function(namespace){
              var path;
              if(recipe[namespace].include !== false ){
                path = recipe[namespace].path;
              }
              return path;
            }).compact().value();

        concat = options.concat ? grunt.config.get(options.concat) : {};
        min = options.min ? grunt.config.get(options.min) : {};

        if(dest) {
          // oringinal source
          grunt.file.copy(val.path, dest.replace(/\.js$/, options.suffix.origin.unpack));
        }

        if(dest && recipe[namespace].concat !== false && options.concat !== false){

          // concat dependencies
          files = {};
          files[dest.replace(/\.js$/, options.suffix.concat.unpack)] = concated;
          concat[target + '.' + namespace+options.suffix.concat.unpack] = {files: files};
        }

        if(dest && recipe[namespace].min !== false){

          if( recipe[namespace].concat !== false && options.concat){
            // concat dependencies with minify 
            files = {};
            files[dest.replace(/\.js$/, options.suffix.concat.min)] = concated;
            min[target + '.' + namespace+options.suffix.concat.min] = {files: files};
          }
          // original source with minify
          files = {};
          files[dest.replace(/\.js$/, options.suffix.origin.min)] = [val.path];
          min[target + '.' + namespace+options.suffix.origin.min] = {files: files};

        }

        if(amdDest && options.amd !== false){
          // original source with minify
          files = {};

          var amdfile = grunt.file.read(val.path);
          amdfile = 'define(["'+dependencies.without(namespace, "").push("exports").value().join('","')+'"], function('+dependencies.without("", namespace).push("exports").value().join(',').replace(/\./g, "_")+'){\r\n'+
                    amdfile+
                    '\r\n;exports["'+namespace+'"] = '+namespace+';});';

          grunt.file.write(amdDest.replace(/\.js$/, options.suffix.amd.unpack), amdfile);
          files[amdDest.replace(/\.js$/, options.suffix.amd.min)] = [amdDest.replace(/\.js$/, options.suffix.amd.unpack)];
          min[target + '.' + namespace+options.suffix.amd.min] = {files: files};
        }

        if(options.concat){
          grunt.config.set(options.concat, concat);
        }
        if(options.min || options.amd){
          grunt.config.set(options.min, min);
        }

        json[namespace] = dependencies.map(function(namespace){
          return recipe[namespace].url;
        }).compact().value();

        amd[namespace] = dependencies.map(function(namespace){
          return recipe[namespace].amd ? recipe[namespace].amd.url : undefined;
        }).compact().value();
      });

      grunt.file.write(dependenciesPath, 'if(!recipe){var recipe=function(){}};recipe.dependencies='+JSON.stringify(json)+';');
      grunt.file.write(versionPath, 'if(!recipe){var recipe=function(){}};recipe.version='+JSON.stringify(''+options.version)+';');

      if(options.amd){
        grunt.file.write(amdDependenciesPath, 'if(!recipe){var recipe=function(){}};recipe.dependencies='+JSON.stringify(amd)+';');
      }
      

    });


  });

};
