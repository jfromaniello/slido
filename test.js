var express = require('express'),
	path = require("path"),
	md = require('node-markdown').Markdown,
	hbs = require("hbs"),
	fs = require('fs'),
	util = require('./util.js');

//var html = md("hello \n====\nthis is something important");
var slidesDir = __dirname + "/slides/";
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
	console.log("the markdown is " +  request.body.slideMarkdown);
	var fileName = util.randomString() ;
	fs.writeFile(slidesDir + fileName + ".markdown", request.body.slideMarkdown, function(err){
		if(!err)
			response.redirect("/slide/" + fileName)
		else
			response.send(err, 500);  
	});  
});

app.get('/slide/:file', function(request, response){
	fs.readFile(slidesDir + request.params.file + ".markdown", function(err, data){
		if(err) response.send(err, 500);
		var html = md(data.toString());
		response.send(html);
	});
});


var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});