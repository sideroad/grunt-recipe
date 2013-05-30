# grunt-recipe

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
Declare below under the namespace property.

|Property Name|Type|Required|Default value|Value of meaning|
|-----|-----|-----|-----|-----|
|path|`String`|*||Library path|
|dest|`String`|||Destination directory path|
|url|`String`|||Library URL|
|dependencies|`Array<String>`|*|[]|Dependents namespace|
|concat|`Boolean`||true|Is concatenate and output dest?|
|min|`Boolean`||true|Is minify and output dest?|

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

### options.version
Type: `String`
Default value: `Unix time`

The value is used for avoiding browser cache when update libraries.

### options.suffix.concat.unpack
Type: `String`
Default value: `.with-dependencies.unpack.js`

File name suffix of concatenate with dependencies.

### options.suffix.concat.min
Type: `String`
Default value: `.with-dependencies.js`

File name suffix of minified after concatenate with dependencies.

### options.suffix.origin.unpack
Type: `String`
Default value: `.unpack.js`

File name suffix of origin source.

### options.suffix.origin.min
Type: `String`
Default value: `.js`

File name suffix of minified source.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
