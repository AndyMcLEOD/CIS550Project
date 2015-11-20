
/*
 * GET home page.
 */


var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'cis550courseproject.cojm56uytqf8.us-east-1.rds.amazonaws.com',
	user: 'MinionMovies',
	password: '1234567890',
	database: 'MinionMovies'
});
connection.connect();


exports.getMovies = function(req, res){

	var query1 = "select * from MOVIES order by POPULARITY desc limit 20";
	connection.query(query1, function(err, movies){
		if(err)
			throw err;
		res.render('index', { movies: movies,
							  isLogin: false});
	});	
};

exports.movieDetails = function(req, res){
	var mid = req.params.id;
	console.log(mid);
	var query1 = "select * from MOVIES where MOVIE_ID = ? limit 20";
	var query2 = "select * from MOVIE_GENRE where IMDB = ? limit 30";
	var query3 = "select distinct * from MOVIE_TAGS where IMDB = ? limit 121";
	connection.query(query1, mid, function(err, movies){				//query MOVIES
		if(err) throw err;
		connection.query(query2, mid, function(err, genres){
			if(err) throw err;
			var genre = genres[0]["GENRE"];
			for(var i = 1; i < genres.length; i++){ genre = genre + " | " + genres[i]["GENRE"]; }
			connection.query(query3, mid, function(err, tags){
				if(err) throw err;
				var tag = tags[0]["TAG"];
				for(var i = 1; i < tags.length; i++){ tag = tag + " | " + tags[i]["TAG"]; }
				res.render('movieDetails', { isLogin: false, 
									 	 	movies: movies[0],
									 	 	genres: genre, 
									 	 	tags: tag });
			});
		});
	});
};

exports.getActors = function(req, res){

};

exports.getReviews = function(req, res){

	var query1 = "select * from REVIEWS limit 20";
	connection.query(query1, function(err, reviews){
		if(err)
			throw err;
		res.render('review', { reviews: reviews,
							   isLogin: false });
	});
	
};

exports.about = function(req, res){

	res.render('about.ejs', { title: "about", message: "this is about page...", date: new Date()  });
	
};

exports.contact = function(req, res){

	res.render('contact.ejs', { title: "contact", message: "this is contact page...", date: new Date()  });
	
};

exports.results = function(req, res){
	
		var query = connection.query('select * from REVIEWS', function(err, result){
			
		console.log(query.sql);
		
		if(err){
			console.error(err);
			return;
		}
		
		res.render('result.ejs', { results: result});
	
	});
};