exports.randomString = function() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 8;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
};

exports.wrapH1WithSlideDirective = function(html){
	var regex = /<h1>/i, indexes = [], match;
	
	while(match = regex.exec(html)){
		indexes.push(match.index);
	}
};