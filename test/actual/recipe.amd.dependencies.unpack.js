if (!recipe) {
  var recipe = function() {};
}
recipe.dependencies = {
  "recipe.version": [],
  "recipe.dependencies": [],
  "recipe.amd.dependencies": [],
  "resolving.dependencies": ["/js/amd/a.amd.js", "/js/amd/b.amd.js", "/js/amd/c.amd.js"],
  "a": ["/js/amd/a.amd.js"],
  "b": ["/js/amd/a.amd.js", "/js/amd/b.amd.js"],
  "c": ["/js/amd/a.amd.js", "/js/amd/b.amd.js", "/js/amd/c.amd.js"],
  "no.exports": ["/js/amd/a.amd.js", "/js/amd/b.amd.js", "/js/amd/no.exports.amd.js"],
  "specified.path": ["/js/amd/a.amd.js", "/js/amd/b.amd.js", "/js/amd/specified.path.amd.js"],
  "specified.exports": ["/js/amd/a.amd.js", "/js/amd/b.amd.js", "/js/amd/specified.exports.amd.js"],
  "no.desitination": [],
  "no.concat": [],
  "no.min": [],
  "version.include": ["/js/amd/a.amd.js", "/js/amd/b.amd.js", "/js/amd/c.amd.js"],
  "dependencies.include": ["/js/amd/a.amd.js", "/js/amd/b.amd.js", "/js/amd/c.amd.js"]
};