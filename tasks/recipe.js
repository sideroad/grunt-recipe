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
          amdMinSuffix: '.amd.js',
          banner: '',
          footer: ''
        }),
        target = this.target,
        banner = grunt.template.process(options.banner),
        footer = grunt.template.process(options.footer),
        concat = options.concat ? grunt.config.get(options.concat) : {},
        min = options.min ? grunt.config.get(options.min) : {};

    concat[target+'-recipe'] = {files:{}, options: {banner: banner, footer: footer}};
    min[target+'-recipe'] = {files:{}, options: {banner: banner, footer: footer}};
    min[target+'-recipe-amd'] = {files: {}};

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
        var deps = _(resolve(namespace)).chain(),
            depsWithSelf = deps.union([namespace]),
            dest = recipe[namespace].dest ? path.resolve( recipe[namespace].dest, path.basename( val.path )) : '',
            amdDest = recipe[namespace].amd && recipe[namespace].amd.dest ? path.resolve( recipe[namespace].amd.dest, path.basename( val.path )) : '',
            concated = depsWithSelf.map(function(namespace){
              var path;
              if(recipe[namespace].include !== false ){
                path = recipe[namespace].path;
              }
              return path;
            }).compact().value();

        if(dest) {
          // oringinal source
          var originalSource = grunt.file.read(val.path);
          grunt.file.write(dest.replace(/\.js$/, options.originUnpackSuffix), banner+originalSource+footer);
        }

        if(dest && recipe[namespace].concat !== false && options.concat !== false){
          concat[target+'-recipe'].files[dest.replace(/\.js$/, options.concatUnpackSuffix)] = concated;
        }

        if(dest && recipe[namespace].min !== false){

          if( recipe[namespace].concat !== false && options.concat){
            // concat dependencies with minify 
            min[target+'-recipe'].files[dest.replace(/\.js$/, options.concatMinSuffix)] = concated;
          }
          // original source with minify
          min[target+'-recipe'].files[dest.replace(/\.js$/, options.originMinSuffix)] = [val.path];
        }

        if(amdDest && options.amd !== false){
          // original source with minify
          var amdfile = grunt.file.read(val.amd.path || val.path),
              depsString = deps.value().join('","');

          amdfile = banner+
                    'recipe.define("'+namespace+'", [' + ( depsString? '"' + depsString + '"' : '') + '], function('+deps.value().join(',').replace(/\./g, "_")+'){\r\n'+
                    amdfile+'\r\n;'+
                    (val.amd.exports !== false ? 'return '+(val.amd.hasOwnProperty('exports') ? val.amd.exports : namespace)+';\r\n' : '') +
                    '});'+
                    footer;

          grunt.file.write(amdDest.replace(/\.js$/, options.amdUnpackSuffix), amdfile);
          min[target+'-recipe-amd'].files[amdDest.replace(/\.js$/, options.amdMinSuffix)] = [amdDest.replace(/\.js$/, options.amdUnpackSuffix)];
        }

        json[namespace] = depsWithSelf.map(function(namespace){
          return recipe[namespace].url;
        }).compact().value();

        amd[namespace] = depsWithSelf.map(function(namespace){
          return recipe[namespace].amd ? recipe[namespace].amd.url : undefined;
        }).compact().value();
      });

      if(options.concat){
        grunt.config.set(options.concat, concat);
      }
      if(options.min){
        grunt.config.set(options.min, min);
      }

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
