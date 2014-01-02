'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.recipe = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  recipeDependencies: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/actual/recipe.dependencies.js');
    var expected = grunt.file.read('test/expected/recipe.dependencies.js');
    test.equal(actual, expected, 'should output recipe.dependencies.js');

    test.done();
  },
  recipeAmdDependencies: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/actual/recipe.amd.dependencies.js');
    var expected = grunt.file.read('test/expected/recipe.amd.dependencies.js');
    test.equal(actual, expected, 'should output recipe.amd.dependencies.js');

    test.done();
  },
  recipeVersion: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/actual/recipe.version.js');
    var expected = grunt.file.read('test/expected/recipe.version.js');
    test.equal(actual, expected, 'should output recipe.version.js');

    test.done();
  },
  resolvingDependencies: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/actual/resolving.dependencies.js');
    var expected = grunt.file.read('test/expected/resolving.dependencies.js');
    test.equal(actual, expected, 'should resolve dependencies.');

    test.done();
  },
  noMin: function(test) {
    test.expect(3);

    var actual = grunt.file.read('test/actual/no.min.unpack.js');
    var expected = grunt.file.read('test/expected/no.min.unpack.js');
    test.equal(false, grunt.file.exists('test/expected/no.min.js'));
    test.equal(false, grunt.file.exists('test/expected/no.min.with-dependencies.js'));
    test.equal(actual, expected, 'should not output minified source.');

    test.done();
  },
  noConcat: function(test) {
    test.expect(3);

    var actual = grunt.file.read('test/actual/no.concat.js');
    var expected = grunt.file.read('test/expected/no.concat.js');
    test.equal(false, grunt.file.exists('test/expected/no.concat.with-dependencies.js'));
    test.equal(false, grunt.file.exists('test/expected/no.concat.with-dependencies.unpack.js'));
    test.equal(actual, expected, 'should not output concatenated source.');

    test.done();
  },
  versionInclude: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/actual/version.include.js');
    var expected = grunt.file.read('test/expected/version.include.js');
    test.equal(actual, expected, 'should include recipe.version.js');

    test.done();
  },
  dependenciesInclude: function(test) {
    test.expect(1);

    var actual = grunt.file.read('test/actual/dependencies.include.js');
    var expected = grunt.file.read('test/expected/dependencies.include.js');
    test.equal(actual, expected, 'should include recipe.dependencies.js');

    test.done();
  }
};
