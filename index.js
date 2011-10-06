var express = require('express'),
	slideStore = require('./slideStore.js'),
	slideGenerator = require('./slideGenerator.js'),
	hbs = require("hbs");

//var html = md("hello \n====\nthis is something important");
var app = express.createServer(express.logger());

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'hbs');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function(request, response) {
	response.render("index");
});

app.post('/', function(request, response){
	var text = request.body.slideMarkdown;
	if(text.trim()) {
		response.send("Markdown was empty...", 400);
		return;
	}
	slideStore.saveSlide(request.body.slideMarkdown)
		.when(function(err, id){
			if(err){
				response.send(err, 500);
			}else{
				response.redirect("/slide/" + id);
			}
		});  
});

app.get("favicon.ico", function(request, response){
	response.send(404); //wink
});

app.get('/slide/:id', function(request, response){
	slideStore.getSlide(request.params.id)
		.when(function(err, markdown){
			if(err){
				 response.send(err, 500);
				 return;
			}
			var slideContent = slideGenerator.generateS6(markdown);
			response.render("result", {slides: slideContent, layout: false});
		});
});


var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});