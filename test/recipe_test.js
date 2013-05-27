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
  origin: function(test) {
    test.expect(1);

    var actual = grunt.file.read('example/dist/fettuccine.alfredo.unpack.js');
    var expected = grunt.file.read('test/expected/fettuccine.alfredo.unpack.js');
    test.equal(actual, expected, 'should be here is origin source.');

    test.done();
  },
  minified: function(test) {
    test.expect(1);

    var actual = grunt.file.read('example/dist/fettuccine.alfredo.js');
    var expected = grunt.file.read('test/expected/fettuccine.alfredo.js');
    test.equal(actual, expected, 'should minified origin source.');

    test.done();
  },
  concat: function(test) {
    test.expect(1);

    var actual = grunt.file.read('example/dist/fettuccine.alfredo.with-dependencies.unpack.js');
    var expected = grunt.file.read('test/expected/fettuccine.alfredo.with-dependencies.unpack.js');
    test.equal(actual, expected, 'should concatenated with dependencies.');

    test.done();
  },
  concat_with_minified: function(test) {
    test.expect(1);

    var actual = grunt.file.read('example/dist/fettuccine.alfredo.with-dependencies.js');
    var expected = grunt.file.read('test/expected/fettuccine.alfredo.with-dependencies.js');
    test.equal(actual, expected, 'should minified origin source.');

    test.done();
  }
};
