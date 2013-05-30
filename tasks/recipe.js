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
          }
        }),
        target = this.target,
        _ = grunt.util._;

    this.files.forEach(function(f) {
      var json = {},
          dependenciesPath = path.resolve( f.dest, 'recipe.dependencies.js'),
          versionPath = path.resolve( f.dest, 'recipe.version.js'),
          recipe = {
            'recipe.version': {
              path: versionPath,
              dependencies: []
            },
            'recipe.dependencies': {
              path: dependenciesPath,
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
            concated = dependencies.map(function(namespace){
              var path;
              if(recipe[namespace].include !== false ){
                path = recipe[namespace].path;
              }
              return path;
            }).compact().value();

        concat = grunt.config.get(options.concat);
        min = grunt.config.get(options.min);

        if(dest) {
          // oringinal source
          files = {};
          files[dest.replace(/\.js$/, options.suffix.origin.unpack)] = [val.path];
          concat[target + '.' + namespace+options.suffix.origin.unpack] = {files: files};          
        }

        if(options.concat && dest && recipe[namespace].concat !== false){

          // concat dependencies
          files = {};
          files[dest.replace(/\.js$/, options.suffix.concat.unpack)] = concated;
          concat[target + '.' + namespace+options.suffix.concat.unpack] = {files: files};
        }

        if(options.min && dest && recipe[namespace].min !== false){

          if( recipe[namespace].concat !== false ){
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

        grunt.config.set(options.concat, concat);
        grunt.config.set(options.min, min);

        json[namespace] = dependencies.map(function(namespace){
          return recipe[namespace].url;
        }).compact().value();
      });

      grunt.file.write(dependenciesPath, 'if(!recipe){var recipe=function(){}};recipe.dependencies='+JSON.stringify(json)+';');
      grunt.file.write(versionPath, 'if(!recipe){var recipe=function(){}};recipe.version='+JSON.stringify(''+options.version)+';');

    });


  });

};
