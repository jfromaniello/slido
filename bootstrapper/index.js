var express = require('express'), 
    configure = require('./config'),
    authorization = require('./authorization'),
    routes = require('./routes');

module.exports = function(){
    var app = express.createServer(express.logger());
    
    configure(app);
    authorization(app);
    routes(app);
    
    return app;
};