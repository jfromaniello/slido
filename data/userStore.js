(function(){
	var Futures = require('futures'),
		connString = process.env.connection_string || "mongo://localhost/slidito",
		Mongolian = require('mongolian'),
		self = this;

	function findById(id){
		var future = Futures.future(),
			collection = new Mongolian(connString).collection("users");

		collection.findOne({ id: id }, future.fulfill);

		return future.passable();
	}

	function getOrSaveUser(userMetadata){
		var future = Futures.future(),
			collection = new Mongolian(connString).collection("users");

		collection
			.findOne({ id: userMetadata.id },
					function(err,value){
						if(err){
							future.fulfill(err, value);
							return;
						}

						if(!value){
							collection
							.insert(userMetadata, function(err, value){
								if(err){
									future.fulfill(err);
									return;
								}
								future.fulfill(err, userMetadata);
							});	
							return;
						}

						future.fulfill(err, value);
					});

		return future.passable();
	}

	module.exports.getOrSaveUser = getOrSaveUser;
	module.exports.findById = findById;
}());







