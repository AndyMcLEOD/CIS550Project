
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

	var query1 = "select * from MOVIES where POSTER <> '' " + 
				 " and POSTER <> 'None' order by RAND() desc limit 20";
	//change to be ordered by popularity for demo.
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
	var query1 = "select * from MOVIES where MOVIE_ID = " + mid + " limit 20"; 
	var query2 = "select * from MOVIE_GENRE where IMDB = " + mid + " limit 30";
	var query3 = "select distinct * from Movies_Tags where IMDB = " + mid + " limit 121";
	var query4 = "select * from MOVIE_DIRECTOR where IMDB = " + mid + " limit 10";
	var query5 = "select * from movies_actors1 where IMDBID = " + mid + " limit 50";
	var query6 = "select * from movies_trailers where IMDB = " + mid + " limit 10";
	var query7 = "select * from REVIEWS where IMDB = " + mid + " limit 10";
	var query8 = "select DISTINCT m.MOVIE_ID, m.TITLE_YEAR, m.POSTER "
				+ " from MOVIE_GENRE mg1 inner join MOVIE_GENRE mg2 on mg1.GENRE = mg2.GENRE "
				+ " inner join MOVIES m ON mg2.IMDB = m.MOVIE_ID "
				+ " where m.POSTER <> '' and m.TMDB_RATING > 3 " 
				+ " and mg1.IMDB <> mg2.IMDB and mg1.IMDB = " + mid + "  LIMIT 4";
	connection.query(query1, function(err, movies){		      		//query MOVIES
		if(err) throw err;
		console.log(query1);
		connection.query(query2, function(err, genres){            //GENRES
			if(err) throw err;
			console.log(query2);
			if(genres.length > 0){
				var genre = genres[0]["GENRE"];
				for(var i = 1; i < genres.length; i++){ genre = genre + " | " + genres[i]["GENRE"]; }}
			else{ var genre = "none"; }
			connection.query(query3, function(err, tags){  		//TAG
				if(err) throw err;
				if(tags.length > 0){
					var tag = tags[0]["TAG"];
					for(var i = 1; i < tags.length; i++){ tag = tag + " | " + tags[i]["TAG"]; }}
				else{var tag = "none";}
				connection.query(query4, function(err, directors){    //DIRECTOR
					if(err) throw err;
					if(directors.length > 0){
						var director = directors[0]["NAME"];
						for(var i = 1; i < directors.length; i++){ director = director + " | " + director[i]["NAME"]; }}
					else{var director = "none";}
					var temp = connection.query(query5, function(err, actors){
						console.log(temp.sql);
						if(err) throw err;
						console.log("=========actors===========");
						console.log(actors);
						connection.query(query6, function(err, trailers){
							if(err) throw err;
							console.log("=========actors===========");
							console.log(actors);
							connection.query(query7, function(err, reviews){
								if(err) throw err;
								connection.query(query8, function(err, recommendations){
									if(err) throw err;
									res.render('movieDetails', { isLogin: false, 
									 	 				movies: movies[0],
									 	 				genres: genre, 
									 	 				tags: tag,
									 	 				directors: director,
									 	 				actors: actors,
									 	 				trailers: trailers,
									 	 				reviews: reviews,
									 	 				rec1: recommendations});
								})
							})
						});
					});
				});
			});
		});
	});
};

exports.getArtists = function(req, res){
	var query1 = "select * from PERSON_INFO where PROFILE<>'' and BIOGRAPHY<>'' ";
	connection.query(query1, function(err, artists){
		if(err) throw err;
		console.log(artists[0]);
		res.render('artist', { isLogin: false,
								artists: artists});
	});
};

exports.artistDetails = function(req, res){
	var aid = req.params.id; 
	var query1 = "select * from PERSON_INFO where ID = " + aid;
	var query2 = "select * from PERSON_ALIASE where PERSON_ID = " + aid;
	var query3 = "select m.MOVIE_ID, ma.CHARACTER, ma.TITLE, m.POSTER "
				+ " from movies_actors1 ma inner join MOVIES m on ma.IMDBID = m.MOVIE_ID "
				+ " where PERSON_ID = " + aid + " limit 8";
	
	connection.query(query1, function(err, artist){
		if(err) throw err;
		connection.query(query2, function(err, aliases){
			if(err) throw err;
			var aliase = "none";
			if(aliases.length){
				aliase = aliases[0]["ALIASE"];
				for(var i = 1; i < aliases.length; i++){ aliase = aliase + " | " + aliases[i]["ALIASE"] }}
			connection.query(query3, function(err, acting){
				if(err) throw err;
				res.render('artistDetails', { isLogin: false,
									  artist: artist[0],
									  aliases: aliase,
									  actings: acting});
			});
		});	
	});
};

exports.getReviews = function(req, res){

	var query1 = "select distinct r.IMDB, r.REVIEW_ID, r.QUOTE, r.CRITIC, mt.TITLE, mt.POSTER "
 			   + " from REVIEWS r inner join movies_trailers mt on r.IMDB = mt.IMDB "
 			   + " where r.FRESHNESS = 'fresh' and r.QUOTE <> '' and mt.POSTER <> 'null' "
 			   + " and r.PUBLICATION like '%Associated Press%' limit 60, 60";							//how to pull out random reviews?
	connection.query(query1, function(err, reviews){
		if(err)
			throw err;
		res.render('review', { reviews: reviews,
							   isLogin: false });
	});
	
};

exports.reviewDetails = function(req, res){
	var rid = req.params.id;
	var query1 = "select * from REVIEWS r inner join MOVIES m on r.IMDB = m.MOVIE_ID "
				 + " WHERE r.REVIEW_ID = " + rid;

	connection.query(query1, function(err, review){
		console.log(query1);
		var query2 = "select * from REVIEWS where IMDB = " + review[0]["IMDB"] + " and REVIEW_ID <> " + rid;
		console.log(query2);
		connection.query(query2, function(err, otherReviews){
			res.render('reviewDetails', { isLogin: false,
										review: review[0],
										otherReviews: otherReviews });
		});
	});
}

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

exports.get_classes = function(req, res){

		var query1 = connection.query('SELECT DISTINCT(GENRE) FROM MOVIE_GENRE', function(err, genres){

			if(err){ console.error(err); return; }

			var query2 = connection.query('SELECT DISTINCT(TAG), COUNT(IMDB) FROM Movies_Tags GROUP BY TAG ORDER BY COUNT(IMDB) DESC LIMIT 30', function(err, tags_temp){
												
						if(err){ console.error(err); return; }

						var years = new Array(30);
						for(var i = 0, start = 1987; i <= 30; i++)   years[i] = start + i;

						var tags = new Array(30);
						for(var i = 0; i < 30; i++)   tags[i] = tags_temp[i]["TAG"]

						res.render('categories.ejs', {genres_list: genres, years_list: years, tags_list: tags, isLogin: false});
					});
	});
};


exports.getTrailers = function(req, res){
	var query1 = "select * from movies_trailers where TRAILER<>'null' and POSTER<>'null' limit 20";
	connection.query(query1, function(err, trailers){
		if(err) throw err;
		res.render('trailers.ejs', { isLogin: false,
								 trailers: trailers});
	});
}
