exports.randomString = function() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 8;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
};

function wrapH1WithHeaderTag(slide){
	var rx = /<h1.*<\/h1>/i,
		match = slide.match(rx);
	return slide.replace(rx, "<header>" + match + "</header>")	
};

function wrapContentWithSection(slide){
	var endOfTitle = slide.indexOf("</header>") + "</header>".length,
		title = slide.substring(0, endOfTitle),
		content = slide.substring(endOfTitle);
	return title + "<section class=\"small\">" + content + "</slide>"; 	
};

function enhanceSlide(slide){
	var withHeaderTag = wrapH1WithHeaderTag(slide);
	return wrapContentWithSection(withHeaderTag);	
};

exports.wrapH1WithSlideDirective = function(html){
	var regex = /<h1>/gi,
		slides = [], 
		match = regex.exec(html),
		lastIndex = 0;
	
	do{
		var slide = html.substring(lastIndex, match.index - lastIndex)
		if(slide) slides.push(enhanceSlide(slide));
		lastIndex = match.index;
		match = regex.exec(html);
	}while(match);

	slides.push(enhanceSlide(html.substring(lastIndex)));


	return slides
		.map(function(slide){
			return "<div class=\"slide\">\n" + slide + "\n</div>\n";
		}).reduce(function(prev, slide){
			return prev + slide;
		});
};