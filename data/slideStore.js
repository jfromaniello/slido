(function(){
	var slidesDir = __dirname + "/slides/",
		fs = require('fs'),
		Futures = require('futures'),
		connString = process.env.connection_string || "mongo://localhost/slidito",
		Mongolian = require('mongolian'),
		self = this;


	function saveSlide(content, userId){
		var slide = {
			text: content,
			userId: userId
		}, future = Futures.future();

		new Mongolian(connString)
			.collection("slides")
			.insert(slide, function(err, value){
				if(err){
					future.fulfill(err);
					return;
				}
				future.fulfill(err, slide._id.toString());
			});
		return future.passable();
	}

	function updateSlide (id, content, userId){
		var slide = {
			text: content,
			_id: new Mongolian.ObjectId(id),
			userId: userId
		}, future = Futures.future();

		new Mongolian(connString)
			.collection("slides")
			.save(slide, function(err, value){
				if(err){
					future.fulfill(err);
					return;
				}	
				future.fulfill(err, slide._id);
			});
		return future.passable();
	}

	function getSlide(id){
		var query;
		var future = Futures.future();

		try{
			 query = { _id: new Mongolian.ObjectId(id)};
		}catch(err){
			future.fulfill("Invalid slide id.");
			return future.passable();
		}
		
		new Mongolian(connString)
			.collection("slides")
			.findOne(query, function(err, slide){
				if(err){
					future.fulfill(err);
					return;
				}	
				if(!slide){
					future.fullfill(err, null);
					return;
				}
				future.fulfill(err, slide.text, slide.userId);
			});
		return future.passable();
	}

	module.exports.saveSlide = saveSlide;
	module.exports.getSlide = getSlide; 
	module.exports.updateSlide = updateSlide;
}());







