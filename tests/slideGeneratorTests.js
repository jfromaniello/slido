var vows = require('vows'),
    assert = require('assert'),
    slideGenerator = require('../slideGenerator.js');

assert.contains = function ok(str, value, message) {
  if (str.indexOf(value) < 0) assert.fail(value, str, message, 'contains', assert.contains);
};

assert.startsWith = function ok(str, value, message) {
  if (str.indexOf(value) !== 0) assert.fail(value, str, message, 'startsWith', assert.startsWith);
};

assert.endsWith = function ok(str, value, message) {
  if (str.indexOf(value, str.length - value.length) === -1) assert.fail(value, str, message, 'endsWith', assert.endsWith);
};

assert.hasOccurrences = function ok(str, value, occurrences, message) {
  var actual = str.match(new RegExp(value.toString().replace(/(?=[.\\+*?[^\]$(){}\|])/g, "\\"), "g")).length;
  if (actual !== occurrences) {
      assert.fail(value, str, message, 'hasOccurrences ' + occurrences + " of " , assert.hasOccurrences);
  }
};

// Create a Test Suite
vows.describe('SlideGenerator').addBatch({
    'when parsing a simple section': {
        topic: function () { 
            return slideGenerator.generateS6("title\n" +
                                             "========== \n" +
                                             "content"); 
        },
        'header is wrapped in header tags': function (topic) {
            assert.contains (topic, "<header><h1>title</h1></header>");
        },
        'content is wrapped in section': function (topic) {
            assert.contains (topic, "<section class=\"small\"><p>content</p></section>");
        },
        'it should start with the div slide tag': function(topic){
            assert.startsWith(topic, "<div class=\"slide\">");   
        },
        'it should end with the div tag': function(topic){
            assert.endsWith(topic.trim(), "</div>");   
        }
    },

    "when parsing two sections": {
        topic: function () { 
            return slideGenerator.generateS6("title\n" +
                                             "========== \n" +
                                             "content\n\n" + 
                                             "title2\n" +
                                             "========== \n" +
                                             "content\n\n"); 
        },
        'has two slide sections': function (topic) {
            assert.hasOccurrences (topic, "<div class=\"slide\">", 2);
        }
    }

}).run(); // Run it