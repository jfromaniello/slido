var slideStore = require("../data/slideStore"), 
    allThemes = ["moon","metro","sand","sea_wave","default" ],
    slideGenerator = require("../slideGenerator");

module.exports = function(app) {

    app.get('/', function(request, response, error) {
        response.render("index", {
            title: "Slido - Html5 Slideshow Generator"
        });
    });

    app.post('/', function(request, response){
        var text = request.body.slideMarkdown;
        if(text.trim() === "") {
            response.send("Markdown was empty...", 400);
            return;
        }
        var userId = request.user ? request.user.id : null;
        slideStore.saveSlide(request.body.slideMarkdown, userId)
            .when(function(err, id){
                if(err){
                    response.send(err, 500);
                }else{
                    response.send({id: id});
                }
            });  
    });

    function validateUserAccessAndGetSlide (request, response, next) {
        var id = request.params.id;
        slideStore.getSlide(id)
            .when(function(err, markdown, userId){
                if(err){
                    response.send(err, 500);
                    return;
                }
                if(!markdown){
                    response.send(err, 404);
                    return;
                }
                if(userId){
                    if(!request.user || request.user.id !== userId){
                        response.send(401);
                        return;
                    }
                }
                request.slide = {id: id, md: markdown };
                next();
            });
    }

    app.get('/edit/:id', validateUserAccessAndGetSlide, function(request, response){
        response.render("index", {
            title: "Slido - Html5 Slideshow Generator",
            slideId: request.slide.id,
            slideMarkdown: request.slide.md
        });
    });

    app.post('/edit/:id', validateUserAccessAndGetSlide, function(request, response){
        var text = request.body.slideMarkdown;
        if(text.trim() === "") {
            response.send("Markdown was empty...", 400);
            return;
        }
        slideStore.updateSlide(
                request.params.id, 
                request.body.slideMarkdown, 
                request.user ? request.user.id : null)
            .when(function(err, id){
                if(err){
                    response.send(err, 500);
                }else{
                    response.send({id: id});
                }
            });  
    });
    
    app.get('/slide/:id', validateUserAccessAndGetSlide, function(request, response){
        var slideContent = slideGenerator.generateS6(request.slide.md);
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

    app.get('/about', function(request, response){
        response.render("about", {
            title: "About"
        });
    });
};