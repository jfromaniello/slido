(function(){
	var md = require('node-markdown').Markdown;

	function wrapH1WithHeaderTag(slide){
		var rx = /<h1.*<\/h1>/i,
			match = slide.match(rx);
		return slide.replace(rx, "<header>" + match + "</header>");	
	}

	function wrapContentWithSection(slide){
		var endOfTitle = slide.indexOf("</header>") + "</header>".length,
			title = slide.substring(0, endOfTitle),
			content = slide.substring(endOfTitle);
		return title + "\n<section class=\"small\">" + content.trim() + "</section>";
	}

	function enhanceSlide(slide){
		var withHeaderTag = wrapH1WithHeaderTag(slide);
		return wrapContentWithSection(withHeaderTag);	
	}

	function wrapH1WithSlideDirective(html){
		var regex = /<h1>/gi,
			slides = [], 
			match = regex.exec(html),
			lastIndex = 0;
		
		do{
			var slide = html.substring(lastIndex, match.index - lastIndex);
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
	}

	module.exports.generateS6 = function(content){
		return wrapH1WithSlideDirective(md(content));
	};
})();