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
		var regex = /<h1>|<div class="slide/gi,
			slides = [], 
			match = regex.exec(html), 
			lastSlide = match === undefined,
			lastIndex = 0;

		do{
			var slide = lastSlide ? html.substr(lastIndex)
								  : html.substr(lastIndex, match.index - lastIndex);
			if(slide) {
				if(slide.indexOf("<div class=\"slide") > -1){
					slides.push(slide);
				}else{
					slides.push(enhanceSlide(slide));
				}
			}
			if(lastSlide) break;
			lastIndex = match.index;
		}while((match = regex.exec(html), lastSlide = !lastSlide && !match), match || lastSlide);

		

		return slides
			.map(function(slide){
				if(slide.indexOf("<div class=\"slide") > -1) return slide;
				return "<div class=\"slide\">\n" + slide + "\n</div>\n";
			}).reduce(function(prev, slide){
				return prev + slide;
			});
	}

	module.exports.generateS6 = function(content){
		return wrapH1WithSlideDirective(md(content));
	};
})();