define(["a","b","exports"], function(a,b,exports){
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

;exports["specified.exports"] = I.want.to.exports.this;
});