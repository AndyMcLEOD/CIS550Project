
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

	var query1 = "select * from MOVIES limit 20";
	var query2 = "select * from REVIEWS limit 20";
	connection.query(query1, function(err, movies){
		if(err)
			throw err;
		connection.query(query2, function(err, reviews){
			if(err)
				throw err;
			res.render('index', { movies: movies, reviews: reviews} );
		});
	});
	
};

exports.getReviews = function(req, res){

	var query1 = "select * "
	
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