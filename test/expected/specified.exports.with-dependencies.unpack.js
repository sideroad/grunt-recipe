var a = {
	hello: function(){return "world!"}
};
var b = {
	hello: a.hello()
};
var specified = {
		exports: "I don't want to export this"
	},
	I = {
		want: {
			to: {
				exports: {
					this: ture
				}
			}
		}
	};
