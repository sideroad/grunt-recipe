var a = {
	hello: function(){return "world!"}
};
var b = {
	hello: a.hello()
};
var c = {
	goodbye: a.hello() + b.hello
};