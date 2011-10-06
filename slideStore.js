(function(){
	var slidesDir = __dirname + "/slides/",
		fs = require('fs'),
		Futures = require('futures'),
		self = this;

	function randomstring () {
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		var string_length = 8;
		var randomstring = '';
		for (var i=0; i<string_length; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			randomstring += chars.substring(rnum,rnum+1);
		}
		return randomstring;
	};

	(function createSlideDirectoryIfNotExist(){
		try{
			fs.lstatSync(slidesDir);
		}catch(e){
			fs.mkdirSync(slidesDir,0755);
		}	 	
	})();

	function saveSlide(content){
		var future = Futures.future(),
			id = randomstring(), 
			file = slidesDir + id + ".markdown";

		fs.writeFile(file, content, function(err){
			future.fulfill(err, id);
		});
			
		return future.passable();
	};

	function updateSlide (id, content){
		var file = slidesDir + id + ".markdown",
			future = Futures.future();

		fs.writeFile(file, content, future.fulfill);

		return future.passable();
	};

	function getSlide(id){
		var file = slidesDir + id + ".markdown",
			future = Futures.future();
		fs.readFile(file, function(err, content){
			if(err) {
				future.fulfill(err);
				return;
			}
			future.fulfill(err, content.toString());
		});
		return future.passable();
	};

	module.exports.saveSlide = saveSlide;
	module.exports.getSlide = getSlide; 
	module.exports.updateSlide = updateSlide;
}());







