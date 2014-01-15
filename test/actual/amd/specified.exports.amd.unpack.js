/*!
 * banner test!
 */
define("specified.exports", ["a","b"], function(a,b){
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

;return I.want.to.exports.this;
});