/*!
 * banner test!
 */
define("c", ["a","b"], function(a,b){
var c = {
	goodbye: a.hello() + b.hello
};
;return c;
});