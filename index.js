var express = require('express'),
	slideStore = require('./slideStore.js'),
	slideGenerator = require('./slideGenerator.js'),
	hbs = require("hbs");

//var html = md("hello \n====\nthis is something important");
var app = express.createServer(express.logger());

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'hbs');
	app.set('view options', { doctype: 'HTML' }); 
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function(request, response) {
	response.render("index", {
		title: "Slido - Html5 Slideshow Generator",
		inHome: true
	});
});

app.post('/', function(request, response){
	var text = request.body.slideMarkdown;
	if(text.trim() === "") {
		response.send("Markdown was empty...", 400);
		return;
	}
	slideStore.saveSlide(request.body.slideMarkdown)
		.when(function(err, id){
			if(err){
				response.send(err, 500);
			}else{
				response.send({id: id});
			}
		});  
});

app.get('/edit/:id', function(request, response){
	var id = request.params.id;

	slideStore.getSlide(id)
		.when(function(err, markdown){
			if(err){
				response.send(err, 500);
				return;
			}
			if(!markdown){
				response.send(err, 404);
				return;
			}
				response.render("index", {
					title: "Slido - Html5 Slideshow Generator",
					inHome: true,
					slideId: id,
					slideMarkdown: markdown
				});
		});
});

app.post('/edit/:id', function(request, response){
	var text = request.body.slideMarkdown;
	if(text.trim() === "") {
		response.send("Markdown was empty...", 400);
		return;
	}
	slideStore.updateSlide(request.params.id, request.body.slideMarkdown)
		.when(function(err, id){
			if(err){
				response.send(err, 500);
			}else{
				response.send({id: id});
			}
		});  
});

app.get('/about', function(request, response){
	response.render("about", {
		title: "About",
		inAbout: true
	});
});

var allThemes = [
	"moon","metro","sand","sea_wave","default"
];

app.get('/slide/:id', function(request, response){
	slideStore.getSlide(request.params.id)
		.when(function(err, markdown){
			if(err){
				response.send(err, 500);
				return;
			}
			if(!markdown){
				response.send(err, 404);
				return;
			}
			var slideContent = slideGenerator.generateS6(markdown);
			var defaultTheme = request.query.defaultTheme || "default";
			response.render("result", {
				slides: slideContent, 
				layout: false,
				themes: allThemes.map(function(t){
					return {
						name: t,
						isDefault: t == defaultTheme
					};
				})
			});
		});
});


var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});