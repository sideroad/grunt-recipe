if (!recipe) {
  var recipe = function() {};
}
recipe.dependencies = {
  "recipe.version": [],
  "recipe.dependencies": [],
  "recipe.amd.dependencies": [],
  "resolving.dependencies": ["/js/a.js", "/js/b.js", "/js/c.js"],
  "a": ["/js/a.js"],
  "b": ["/js/a.js", "/js/b.js"],
  "c": ["/js/a.js", "/js/b.js", "/js/c.js"],
  "no.exports": ["/js/a.js", "/js/b.js", "/js/no.exports.js"],
  "specified.path": ["/js/a.js", "/js/b.js", "/js/specified.path.js"],
  "specified.exports": ["/js/a.js", "/js/b.js", "/js/specified.exports.js"],
  "no.desitination": [],
  "no.concat": [],
  "no.min": [],
  "version.include": ["/js/a.js", "/js/b.js", "/js/c.js"],
  "dependencies.include": ["/js/a.js", "/js/b.js", "/js/c.js"]
};