if(!recipe){var recipe=function(){}};recipe.version="123456789";
var a = {
	hello: function(){return "world!"}
};
var b = {
	hello: a.hello()
};
var c = {
	goodbye: b.hello + a.hello()
};
var version={include:''};
var dependencies={include:''};