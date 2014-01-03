/*
 * grunt-recipe
 * https://github.com/sideroad/grunt-recipe
 *
 * Copyright (c) 2013 sideroad
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    clean: ['example/dist', 'tmp', 'test/actual'],

    // Configuration to be run (and then tested).
    recipe: {
      main: {
        options: {
          dest: 'example/dist/recipe'
        },
        files: {
          'example/dist': ['recipe.json']
        }
      },
      test: {
        options:{
          version: 123456789
        },
        files: {
          'test/actual': ['test/recipe.json']
        }
      },
      nomin: {
        options: {
          version: 123456789,
          min: false
        },
        files: {
          'test/actual': ['test/recipe.json']
        }
      },
      noconcat: {
        options: {
          version: 123456789,
          concat: false
        },
        files: {
          'test/actual': ['test/recipe.json']
        }
      },
      amd: {
        options: {
          version: 123456789,
          amd: true
        },
        files: {
          'test/actual': ['test/recipe.json']
        }
      }
    },

    // Concat configuration will be set by recipe task automatically
    concat: {},

    // Minify configuration will be set by recipe task automatically
    uglify: {},

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['clean', 'recipe', 'concat', 'uglify']);
  grunt.registerTask('test', ['clean', 'recipe', 'concat', 'uglify', 'nodeunit']);

};
