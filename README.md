# grunt-recipe[![Build Status](https://api.travis-ci.org/sideroad/grunt-recipe.png?branch=master)](https://travis-ci.org/sideroad/grunt-recipe) [![NPM version](https://badge.fury.io/js/grunt-recipe.png)](http://badge.fury.io/js/grunt-recipe)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/sideroad/grunt-recipe/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


> Generate scripts for recipe.js

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-recipe --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-recipe');
```

## The "recipe" task

### Overview
In your project's Gruntfile, add a section named `recipe` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  recipe: {
    options: {
      // Task-specific options go here.
    },
    main: {
      files: {
        "example/dist": ["recipe.json"]
      }
    },
  },
})
```

### Prepare for execute

#### recipe.json
```
{
  ${namespace}: {
    "path": ${path},
    "dest": ${dest},
    "url": ${url},
    "dependencies": ${dependencies},
    "concat": ${concat},
    "min": ${min},
    "amd": {
      "path": ${amd path},
      "dest": ${amd dest},
      "url": ${amd url}
      "exports": ${exports}
    }
  }
}
```

Declare below under the namespace property.

|Property Name|Type|Required|Default value|Value of meaning|
|-----|-----|-----|-----|-----|
|namespace|`String`|*||Library namespace|
|path|`String`|||Library path|
|dest|`String`|||Destination directory path|
|url|`String`|||Library URL|
|dependencies|`Array<String>`|*|[]|Dependents namespace|
|concat|`Boolean`||true|Concatenate scripts|
|min|`Boolean`||true|Minify script|
|amd path|`String`|||Use AMD script path instead of path value|
|amd dest|`String`|||Destination directory path for AMD script|
|amd url|`String`|||AMD script URL|
|amd exports|`Boolean` or `String`|||Export specified value instead of `namespace`. if value is `false`, ignore to export namespace|

See example [recipe.json](https://github.com/sideroad/grunt-recipe/blob/master/recipe.json)

### Output
Grunt will output below

|File name|Value of meaning|
|---------|----------------|
|recipe.version.js|Version of libraries|
|recipe.dependencies.js|Libraries dependencies|
|${librarieName}.with-dependencies.js|Concat and minified origin with dependencies|
|${librarieName}.with-dependencies.unpack.js|Concat origin with dependencies|
|${librarieName}.js|Minified origin source|
|${librarieName}.unpack.js|Origin source|
|${librarieName}.amd.js|Minified AMD packed source|
|${librarieName}.amd.unpack.js|AMD packed source|

### Options

#### options.concat
Type: `String`
Default value: `'concat'`

Concatenate configuration properties name.
Set null, if you don't want to add concatenate configuration automatically.

#### options.min
Type: `String`
Default value: `'uglify'`

Minification configuration properties name.
Set null, if you don't want to add minification configuration automatically.

#### options.version
Type: `String`
Default value: `Unix time`

The value is used for avoiding browser cache when update libraries.

#### options.concatUnpackSuffix
Type: `String`
Default value: `.with-dependencies.unpack.js`

File name suffix of concatenate with dependencies.

#### options.concatMinSuffix
Type: `String`
Default value: `.with-dependencies.js`

File name suffix of minified after concatenate with dependencies.

#### options.originUnpackSuffix
Type: `String`
Default value: `.unpack.js`

File name suffix of origin source.

#### options.originMinSuffix
Type: `String`
Default value: `.js`

File name suffix of minified source.

#### options.amdUnpackSuffix
Type: `String`
Default value: `.amd.unpack.js`

File name suffix of generated AMD source.

#### options.amdMinSuffix
Type: `String`
Default value: `.amd.js`

File name suffix of minify and generated AMD source.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_


