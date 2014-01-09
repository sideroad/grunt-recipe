var a = {
	hello: function(){return "world!"}
};
var b = {
	hello: a.hello()
};