var key = "NIA1QuVOHk5v2aSPsh4Ify1Q43YjraKYFqVQkGrqpFA";
var Bing = require('node-bing-api')({ accKey: key });
console.log("Successfully connected to Bing! search engine...")


exports.postSearchResults = function(request, response){

	var isLogin = false;
	if(request.isAuthenticated()){ isLogin = true; }
	var keyword = request.body.bingSearchContent;

	/* try to make all results movie related */
	keyword += " + movie"

	Bing.web( keyword, function(error, res, body ){
		
		var titles = [];
		var urls = [];
		var descriptions = [];
		for(var i = 0; i < body.d.results.length; i++){

			titles.push(body.d.results[i]["Title"]);
			urls.push(body.d.results[i]["Url"]);
			descriptions.push(body.d.results[i]["Description"]);
		}
		response.render('bing', { titles: titles, urls: urls, descriptions: descriptions, isLogin: isLogin });
	  },
	  {
	    top: 20,
	    market: 'en-US'
	  });
}