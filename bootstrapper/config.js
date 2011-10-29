var express = require('express'),
    hbs = require('hbs');

module.exports = function  (app) {
	app.configure(function(){
		app.set('views', __dirname + '/../views');
		app.set('view engine', 'hbs');
		app.set('view options', { doctype: 'HTML' }); 

		app.use(express.bodyParser());
		app.use(express.static(__dirname + '/../public'));
		app.use(express.cookieParser());
		app.use(express.session({secret: 'FooBarBaz'}));
	});
};