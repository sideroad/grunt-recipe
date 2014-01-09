/*
 * grunt-recipe
 * https://github.com/sideroad/grunt-recipe
 *
 * Copyright (c) 2013 sideroad
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var path = require('path'),
      _ = require('lodash');

  grunt.registerMultiTask('recipe', 'Your task description goes here.', function() {
    var options = this.options({
          concat: 'concat',
          min: 'uglify',
          amd: false,
          version: ''+new Date().getTime(),
          concatUnpackSuffix: '.with-dependencies.unpack.js',
          concatMinSuffix: '.with-dependencies.js',
          originUnpackSuffix: '.unpack.js',
          originMinSuffix: '.js',
          amdUnpackSuffix: '.amd.unpack.js',
          amdMinSuffix: '.amd.js'
        }),
        target = this.target;

    this.files.forEach(function(f) {
      var json = {},
          amd = {},
          dependenciesPath = path.resolve( f.dest, 'recipe.dependencies.js'),
          amdDependenciesPath = path.resolve( f.dest, 'recipe.amd.dependencies.js'),
          versionPath = path.resolve( f.dest, 'recipe.version.js'),
          recipePath = path.resolve( f.dest, 'recipe.js'),
          recipeUnpackPath = path.resolve( f.dest, 'recipe.unpack.js'),
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
            deps = _(resolve(namespace)).chain(),
            depsWithSelf = deps.union([namespace]),
            depsWithExports = deps.push('exports'),
            dest = recipe[namespace].dest ? path.resolve( recipe[namespace].dest, path.basename( val.path )) : '',
            amdDest = recipe[namespace].amd && recipe[namespace].amd.dest ? path.resolve( recipe[namespace].amd.dest, path.basename( val.path )) : '',
            concated = depsWithSelf.map(function(namespace){
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
          grunt.file.copy(val.path, dest.replace(/\.js$/, options.originUnpackSuffix));
        }

        if(dest && recipe[namespace].concat !== false && options.concat !== false){

          // concat dependencies
          files = {};
          files[dest.replace(/\.js$/, options.concatUnpackSuffix)] = concated;
          concat[target + '.' + namespace+options.concatUnpackSuffix] = {files: files};
        }

        if(dest && recipe[namespace].min !== false){

          if( recipe[namespace].concat !== false && options.concat){
            // concat dependencies with minify 
            files = {};
            files[dest.replace(/\.js$/, options.concatMinSuffix)] = concated;
            min[target + '.' + namespace+options.concatMinSuffix] = {files: files};
          }
          // original source with minify
          files = {};
          files[dest.replace(/\.js$/, options.originMinSuffix)] = [val.path];
          min[target + '.' + namespace+options.originMinSuffix] = {files: files};

        }

        if(amdDest && options.amd !== false){
          // original source with minify
          files = {};

          var amdfile = grunt.file.read(val.amd.path || val.path);
          amdfile = 'define(["'+depsWithExports.value().join('","')+'"], function('+depsWithExports.value().join(',').replace(/\./g, "_")+'){\r\n'+
                    amdfile+'\r\n;'+
                    (val.amd.exports !== false ? 'exports["'+namespace+'"] = '+namespace+';\r\n' : '') +
                    '});';

          grunt.file.write(amdDest.replace(/\.js$/, options.amdUnpackSuffix), amdfile);
          files[amdDest.replace(/\.js$/, options.amdMinSuffix)] = [amdDest.replace(/\.js$/, options.amdUnpackSuffix)];
          min[target + '.' + namespace+options.amdMinSuffix] = {files: files};
        }

        if(options.concat){
          grunt.config.set(options.concat, concat);
        }
        if(options.min){
          grunt.config.set(options.min, min);
        }

        json[namespace] = depsWithSelf.map(function(namespace){
          return recipe[namespace].url;
        }).compact().value();

        amd[namespace] = depsWithSelf.map(function(namespace){
          return recipe[namespace].amd ? recipe[namespace].amd.url : undefined;
        }).compact().value();
      });

      grunt.file.write(dependenciesPath, 'if(!recipe){var recipe=function(){}};recipe.dependencies='+JSON.stringify(json)+';');
      grunt.file.write(versionPath, 'if(!recipe){var recipe=function(){}};recipe.version='+JSON.stringify(''+options.version)+';');

      if(options.amd){
        grunt.file.write(amdDependenciesPath, 'if(!recipe){var recipe=function(){}};recipe.dependencies='+JSON.stringify(amd)+';');
      }
      
      grunt.file.copy(path.resolve(__dirname, '../lib/recipe/recipe.js' ), recipePath);
      grunt.file.copy(path.resolve(__dirname, '../lib/recipe/recipe.unpack.js' ), recipeUnpackPath);

    });


  });

};
