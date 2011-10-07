(function(){
	var slidesDir = __dirname + "/slides/",
		fs = require('fs'),
		Futures = require('futures'),
		connString = "mongo://jfromaniello:Zkw1Ru7h@dbh55.mongolab.com:27557/slidito",
		Mongolian = require('mongolian'),
		self = this;


	function saveSlide(content){
		var slide = {
			text: content
		}, future = Futures.future();

		new Mongolian(connString)
			.collection("slides")
			.insert(slide, function(err, value){
				if(err){
					future.fulfill(err);
					return
				}
				future.fulfill(err, slide._id.toString());
			});
		return future.passable();
	};

	function updateSlide (id, content){
		var slide = {
			text: content,
			_id: new Mongolian.ObjectId(id)
		}, future = Futures.future();

		new Mongolian(connString)
			.collection("slides")
			.save(slide, function(err, value){
				if(err){
					future.fulfill(err);
					return
				}	
				future.fulfill(err, slide._id);
			});
		return future.passable();
	};

	function getSlide(id){
		var query;
		var future = Futures.future();

		try{
			 query = { _id: new Mongolian.ObjectId(id)}
		}catch(err){
			future.fulfill("Invalid slide id.");
			return future.passable();
		}
		
		new Mongolian(connString)
			.collection("slides")
			.findOne(query, function(err, slide){
				if(err){
					future.fulfill(err);
					return
				}	
				if(!slide){
					future.fullfill(err, null);
					return;
				}
				future.fulfill(err, slide.text);
			});
		return future.passable();
	};

	module.exports.saveSlide = saveSlide;
	module.exports.getSlide = getSlide; 
	module.exports.updateSlide = updateSlide;
}());







