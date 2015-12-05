
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
	console.log(req.user);
	console.log("===");
	var isLogin = false;
	if(req.isAuthenticated()){ isLogin = true; }

	var query1 = "select * from MOVIES where POSTER <> '' " + 
				 " and POSTER <> 'None' order by RAND() desc limit 20";
	//change to be ordered by popularity for demo.
	connection.query(query1, function(err, movies){
		if(err)
			throw err;
		res.render('index', { movies: movies,
							  isLogin: isLogin});
	});	
};

exports.movieDetails = function(req, res){
	var isLogin = false;
	var uid = 0;
	if(req.isAuthenticated()){ 
		isLogin = true; 
		uid = req.user.id; 
	}
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
	var query9 = "select * from likes where uid = " + uid + " and mid = " + mid;

	var like = false;
	connection.query(query9, function(err, result){
		if(err) throw err;
		console.log(query9);
		console.log(result);
		if(result.length > 0){ like = true; }
		console.log(result.length);
		console.log(like);
	});

	connection.query(query1, function(err, movies){		      		//query MOVIES
		if(!movies){ res.render('404', { isLogin: isLogin }); return; }
		if(err) throw err;
		console.log(query1);
		console.log(movies);
		connection.query(query2, function(err, genres){            //GENRES
			if(err) throw err;
			console.log(query2);
			console.log(genres);
			if(genres.length > 0){
				var genre = genres[0]["GENRE"];
				for(var i = 1; i < genres.length; i++){ genre = genre + " | " + genres[i]["GENRE"]; }}
			else{ var genre = "none"; }
			connection.query(query3, function(err, tags){  		//TAG
				if(err) throw err;
				console.log(query3);
				console.log(tags);
				if(tags.length > 0){
					var tag = tags[0]["TAG"];
					for(var i = 1; i < tags.length; i++){ tag = tag + " | " + tags[i]["TAG"]; }}
				else{var tag = "none";}
				connection.query(query4, function(err, directors){    //DIRECTOR
					if(err) throw err;
					console.log(query4);
					console.log(directors);
					if(directors.length > 0){
						var director = directors[0]["NAME"];
						for(var i = 1; i < directors.length; i++){ director = director + " | " + director[i]["NAME"]; }}
					else{var director = "none";}
					var temp = connection.query(query5, function(err, actors){
						console.log(temp.sql);
						if(err) throw err;
						console.log("=========actors===========");
						console.log(query5);
						console.log(actors);
						connection.query(query6, function(err, trailers){
							if(err) throw err;
							console.log("trailers");
							console.log(trailers);
							console.log(trailers.length);
							connection.query(query7, function(err, reviews){
								if(err) throw err;
								connection.query(query8, function(err, recommendations){
									if(err) throw err;
									res.render('movieDetails', { isLogin: isLogin, 
									 	 				movies: movies[0],
									 	 				genres: genre, 
									 	 				tags: tag,
									 	 				directors: director,
									 	 				actors: actors,
									 	 				trailers: trailers,
									 	 				reviews: reviews,
									 	 				rec1: recommendations,
									 	 				like: like});
								});
							});
						});
					});
				});
			});
		});
	});
};

exports.getArtists = function(req, res){
	var isLogin = false;
	if(req.isAuthenticated()){ isLogin = true; }
	var query1 = "select * from PERSON_INFO where PROFILE<>'' and BIOGRAPHY<>'' ";
	connection.query(query1, function(err, artists){
		if(err) throw err;
		console.log(artists[0]);
		res.render('artist', { isLogin: isLogin,
								artists: artists});
	});
};

exports.artistDetails = function(req, res){
	var isLogin = false;
	if(req.isAuthenticated()){ isLogin = true; }
	var aid = req.params.id; 
	console.log(aid);
	var query1 = "select * from PERSON_INFO where ID = " + aid;
	var query2 = "select * from PERSON_ALIASE where PERSON_ID = " + aid;
	var query3 = "select m.MOVIE_ID, ma.CHARACTER, ma.TITLE, m.POSTER "
				+ " from movies_actors1 ma inner join MOVIES m on ma.IMDBID = m.MOVIE_ID "
				+ " where PERSON_ID = " + aid + " limit 8";
	var query4 = "select distinct pi.ID, pi.NAME, ma2.TITLE, pi.PROFILE "
				+ " from movies_actors1 ma1 inner join movies_actors1 ma2 on ma1.IMDBID = ma2.IMDBID "
				+ " inner join PERSON_INFO pi on ma2.PERSON_ID = pi.ID "
				+ " WHERE ma1.PERSON_ID = " + aid + " and ma1.PERSON_ID <> ma2.PERSON_ID and pi.PROFILE <> '' "
				+ " limit 12";
	
	connection.query(query1, function(err, artist){
		if(!artist){ res.render('404', { isLogin: isLogin }); return; }
		if(err) throw err;
		connection.query(query2, function(err, aliases){
			if(err) throw err;
			var aliase = "none";
			if(aliases.length){
				aliase = aliases[0]["ALIASE"];
				for(var i = 1; i < aliases.length; i++){ aliase = aliase + " | " + aliases[i]["ALIASE"] }}
			connection.query(query3, function(err, acting){
				if(err) throw err;
				connection.query(query4, function(err, cooperators){
					if(err) throw err;
					res.render('artistDetails', { isLogin: isLogin,
									  			artist: artist[0],
									  			aliases: aliase,
									  			actings: acting,
												co: cooperators});
				});
			});
		});	
	});
};

exports.getReviews = function(req, res){
	var isLogin = false;
	if(req.isAuthenticated()){ isLogin = true; }

	var query1 = "select distinct r.IMDB, r.REVIEW_ID, r.QUOTE, r.CRITIC, mt.TITLE, mt.POSTER "
 			   + " from REVIEWS r inner join movies_trailers mt on r.IMDB = mt.IMDB "
 			   + " where r.FRESHNESS = 'fresh' and r.QUOTE <> '' and mt.POSTER <> 'null' "
 			   + " and r.PUBLICATION like '%Associated Press%' limit 60, 60";							//how to pull out random reviews?
	connection.query(query1, function(err, reviews){
		if(err)
			throw err;
		res.render('review', { reviews: reviews,
							   isLogin: isLogin });
	});
	
};

exports.reviewDetails = function(req, res){
	var isLogin = false;
	if(req.isAuthenticated()){ isLogin = true; }

	var rid = req.params.id;
	var query1 = "select * from REVIEWS r inner join MOVIES m on r.IMDB = m.MOVIE_ID "
				 + " WHERE r.REVIEW_ID = " + rid;

	connection.query(query1, function(err, review){
		if(!review){ res.render('404', { isLogin: isLogin }); return; }
		if(err) throw err;
		console.log(query1);
		var query2 = "select * from REVIEWS where IMDB = " + review[0]["IMDB"] + " and REVIEW_ID <> " + rid;
		console.log(query2);
		connection.query(query2, function(err, otherReviews){
			res.render('reviewDetails', { isLogin: isLogin,
										review: review[0],
										otherReviews: otherReviews });
		});
	});
}

exports.getTrailers = function(req, res){
	var isLogin = false;
	if(req.isAuthenticated()){ isLogin = true; }
	var query1 = "select * from movies_trailers where TRAILER<>'null' and POSTER<>'null' limit 20";
	connection.query(query1, function(err, trailers){
		if(err) throw err;
		res.render('trailers', { isLogin: isLogin,
								 trailers: trailers});
	});
}

exports.like = function(req, res){
	if(!req.isAuthenticated()){ 
		res.redirect('/');
		return;
	}
	var uid = req.user.id;
	var mid = req.params.id;
	var isLogin = true;
	var query1 = "insert into likes values(" + uid + ", " + mid + ");"
	connection.query(query1, function(err, result){
		console.log(query1);
		var goBackLink = "/movies/" + mid;
		res.redirect(goBackLink);
	});
};
//res.render('contact.ejs', { title: "contact", message: "this is contact page...", date: new Date()  });
exports.cancelLike = function(req, res){
	if(!req.isAuthenticated()){ 
		res.redirect('/');
		return;
	}
	var uid = req.user.id;
	var mid = req.params.id;
	var isLogin = true;
	var query1 = "delete from likes where uid = " + uid + " and mid = " + mid;
	connection.query(query1, function(err, result){
		console.log(query1);
		var goBackLink = "/movies/" + mid;
		res.redirect(goBackLink);
	});
};

exports.userMovies = function(req, res){
	if(!req.isAuthenticated()){ 
		res.redirect('/');
		return;
	}
	var uid = req.user.id;
	var query1 = "select * from likes inner join MOVIES on MOVIE_ID = mid where uid = " + uid;
	connection.query(query1, function(err, movies){
		if(err) throw err;
		res.render('likedMovies', { favourate: movies});
	});
}

exports.getUsers = function(req, res){
	if(!req.isAuthenticated()){ res.redirect('/'); return;}
	var uid = req.user.id;
	var query1 = "select * from user where id <> " + uid;
	connection.query(query1, function(err, users){
		if(err) throw err;
		res.render('users', { users: users });
	});
}

exports.follow = function(req, res){
	if(!req.isAuthenticated()){ res.redirect('/'); return;}
	var user1 = req.user.id;
	var user2 = req.params.id;
	var query1 = "insert into follow value (" + user1 + ", " + user2 + ")";
	connection.query(query1, function(err, result){
		if(err) throw err;
		var goBackLink = "/user/" + user2;
		res.redirect(goBackLink);
	});
}

exports.cancelFollow = function(req, res){
	if(!req.isAuthenticated()){ res.redirect('/'); return;}
	var user1 = req.user.id;
	var user2 = req.params.id;
	var query1 = "delete from follow where user1 = " + user1 + " and user2 = " + user2;
	connection.query(query1, function(err, result){
		if(err) throw err;
		var goBackLink = "/user/" + user2;
		res.redirect(goBackLink);
	});
}

exports.getFollows = function(req, res){
	if(!req.isAuthenticated()){ res.redirect('/'); return;}
	var user1 = req.user.id;
	var query1 = "select * from follow inner join user on user2 = id where user1 = " + user1;
	connection.query(query1, function(err, users){
		if(err) throw err;
		res.render('users', { users: users });
	});
}

exports.getFollower = function(req, res){
	if(!req.isAuthenticated()){ res.redirect('/'); return;}
	var user2 = req.user.id;
	var query1 = "select * from follow inner join user on user1 = id where user2 = " + user2;
	connection.query(query1, function(err, users){
		if(err) throw err;
		res.render('users', { users: users });
	});
}

exports.visitUser = function(req, res){
	if(!req.isAuthenticated()){ res.redirect('/'); return;}
	var user1 = req.user.id;
	var user2 = req.params.id;
	if(user1 == user2){ res.redirect('/profile'); return; }
	var user;
	var followed = false;
	var query1 = "select * from user where id = " + user2;
	var query2 = "select * from follow where user1 = " + user1 + " and user2 = " + user2;
	connection.query(query1, function(err, users){
		if(err) throw err;
		user = users[0];
	});
	connection.query(query2, function(err, follow){
		if(err) throw err;
		if(follow.length > 0){ followed = true; }
		res.render('otherUser', { user: user, followed: followed });
	});
}


exports.groupForm = function(req, res){
	if(!req.isAuthenticated()){ res.redirect('/'); return;}
	res.render('createGroup');
}

exports.createGroup = function(req, res){
	if(!req.isAuthenticated()){ res.redirect('/'); return;}
	var gid = 0;
	var groupName = req.body.groupName;
	var creatorId = req.user.id;
	var description = req.body.groupDescription;
	var query1 = "insert into GROUPS(gname, creatorId, description) values ('" 
		+ groupName + "', " + creatorId + ", '" + description + "');";
	connection.query(query1, function(err, result){
		if(err) throw err;
		console.log(result);
		gid = result["insertId"];
		var query2 = "insert into inGroup values(" + creatorId + ", " + gid + ", '" + groupName + "')";
		connection.query(query2, function(err, result){
			if(err) throw err;
			var goBackLink = "/group/" + gid;
			res.redirect(goBackLink);
		});
	});
}

exports.joinGroup = function(req, res){
	if(!req.isAuthenticated()){ res.redirect('/'); return; }
	var gid = req.params.id;
	var uid = req.user.id;
	var query1 = "select * from GROUPS where gid = " + gid;
	connection.query(query1, function(err, group){
		if(err) throw err;
		var gname = group[0]["gname"];
		var query2 = "insert into inGroup values(" + uid + ", " + gid + ", '" + gname + "')";
		connection.query(query2, function(err, result){
			if(err) throw err;
			var goBackLink = "/group/" + gid;
			res.redirect(goBackLink);
		});
	});
}

exports.quitGroup = function(req, res){
	if(!req.isAuthenticated()){ res.redirect('/'); return; }
	var gid = req.params.id;
	var uid = req.user.id;
	var query1 = "delete from inGroup where uid = " + uid + " and gid = " + gid;
	connection.query(query1, function(err, result){
		if(err) throw err;
		var goBackLink = "/group/" + gid;
		res.redirect(goBackLink);
	});
}

exports.dismissGroup = function(req, res){
	if(!req.isAuthenticated()){ res.redirect('/'); return;}
	var gid = req.params.id;
	var query1 = "delete from GROUPS where gid = " + gid;
	connection.query(query1, function(err, result){
		if(err) throw err;
		res.redirect('/profile');
	});
}

exports.getGroups = function(req, res){
	if(!req.isAuthenticated()){ res.redirect('/'); return;}
	var query1 = "select * from GROUPS inner join user on creatorId = id;";
	connection.query(query1, function(err, groups){
		if(err) throw err;
		res.render('groups', { groups: groups });
	});
}

exports.groupDetails = function(req, res){
	if(!req.isAuthenticated()){ res.redirect('/'); return;}
	var gid = req.params.id;
	var uid = req.user.id;
	var query1 = "select * from GROUPS INNER JOIN user on creatorId = id where gid = " + gid;
	var query2 = "select * from GROUPS where creatorId = " + uid + " and gid = " + gid;
	var query3 = "select * from inGroup where uid = " + uid + " and gid = " + gid;
	var query4 = "select * from inGroup inner join user on uid = id where gid = " + gid;
	var group;
	var isHost = false;
	var isJoin = false;
	var groupMembers;
	connection.query(query1, function(err, groups){
		if(err) throw err;
		group = groups[0];
	});
	connection.query(query2, function(err, result1){
		console.log(query2);
		console.log(result1);
		if(err) throw err;
		if(result1.length > 0){ isHost = true; }
	});
	connection.query(query3, function(err, result2){
		console.log(query3);
		console.log(result2);
		if(err) throw err;
		if(result2.length > 0){ isJoin = true; }
	});
	connection.query(query4, function(err, members){
		if(err) throw err;
		console.log(query4);
		groupMembers = members;
		console.log(isHost);
		console.log(isJoin);
		res.render('group', { group: group,
							  isHost: isHost,
							  isJoin: isJoin,
							  members: groupMembers });
	});
}

exports.results = function(req, res){
	var isLogin = false;
	if(req.isAuthenticated()){ isLogin = true; }
	var content = req.body.searchContent;
	var type = req.body.searchType;
	console.log(type);
	console.log(content);
	var query;
	if(type == "title"){
		query = "select distinct m.MOVIE_ID, m.TITLE_YEAR, m.RUNTIME, m.POSTER, m.POPULARITY, m.MPAA, m.RT_AUDIENCE_RATING, "
					+ " m.RELEASE_DATE, mt.GENRES, mt.COUNTRIES, m.OVERVIEW"
					+ " from MOVIES m left outer join movies_trailers mt on m.MOVIE_ID = mt.IMDB" 
					+ " where mt.TITLE like '%" + content + "%'"
					+ " limit 200";
		connection.query(query, function(err, movies){
			if(err) throw err;
			if(!movies){ res.render('404', { isLogin: isLogin }); return; }
			res.render('movieResult', { isLogin: isLogin,
										movies: movies });
		});
	}
	if(type == "genres"){
		query = "select distinct m.MOVIE_ID, m.TITLE_YEAR, m.RUNTIME, m.POSTER, m.POPULARITY, m.MPAA, m.RT_AUDIENCE_RATING, "
					+ " m.RELEASE_DATE, mt.GENRES, mt.COUNTRIES, m.OVERVIEW"
					+ " from MOVIES m left outer join movies_trailers mt on m.MOVIE_ID = mt.IMDB" 
					+ " where mt.GENRES like '%" + content + "%'"
					+ " limit 200";
		connection.query(query, function(err, movies){
			if(err) throw err;
			if(!movies){ res.render('404', { isLogin: isLogin }); return; }
			res.render('movieResult', { isLogin: isLogin,
										movies: movies });
		});
	}
	if(type == "year"){
		query = "select distinct m.MOVIE_ID, m.TITLE_YEAR, m.RUNTIME, m.POSTER, m.POPULARITY, m.MPAA, m.RT_AUDIENCE_RATING, "
					+ " m.RELEASE_DATE, mt.GENRES, mt.COUNTRIES, m.OVERVIEW"
					+ " from MOVIES m left outer join movies_trailers mt on m.MOVIE_ID = mt.IMDB" 
					+ " where m.TITLE_YEAR like '%" + content + "%'"
					+ " limit 200"; 
		connection.query(query, function(err, movies){
			if(!movies){ res.render('404', { isLogin: isLogin }); return; }
			if(err) throw err;
			res.render('movieResult', { isLogin: isLogin,
										movies: movies });
		});
	}
	if(type == "country"){
		query = "select distinct m.MOVIE_ID, m.TITLE_YEAR, m.RUNTIME, m.POSTER, m.POPULARITY, m.MPAA, m.RT_AUDIENCE_RATING, "
					+ " m.RELEASE_DATE, mt.GENRES, mt.COUNTRIES, m.OVERVIEW"
					+ " from MOVIES m left outer join movies_trailers mt on m.MOVIE_ID = mt.IMDB" 
					+ " where mt.COUNTRIES like '%" + content + "%'"
					+ " limit 200"; 
		connection.query(query, function(err, movies){
			if(err) throw err;
			if(!movies){ res.render('404', { isLogin: isLogin }); return; }
			res.render('movieResult', { isLogin: isLogin,
										movies: movies });
		});
	}
	if(type == "tag"){
		query = "select DISTINCT m.MOVIE_ID, m.TITLE_YEAR, m.RUNTIME, m.POSTER, m.POPULARITY, m.MPAA, m.RT_AUDIENCE_RATING, "
				+ " m.RELEASE_DATE, mt.GENRES, mt.COUNTRIES, m.OVERVIEW "
				+ " from Movies_Tags mta inner join MOVIES m on mta.IMDB = m.MOVIE_ID "
				+ " inner join movies_trailers mt on mt.IMDB = m.MOVIE_ID "
				+ "	where mta.TAG LIKE '%" + content + "%'"
				+ " LIMIT 8";
		connection.query(query, function(err, movies){
			if(!movies){ res.render('404', { isLogin: isLogin }); return; }
  			if(err) throw err;
			res.render('movieResult', { isLogin: isLogin,
										movies: movies });
  		});
	}

	if(type == "actors"){
		query = "select * "
					+ " from PERSON_INFO "
  					+ " WHERE NAME like '%" + content + "%'";
  		connection.query(query, function(err, actors){
  			if(err) throw err;
  			if(!actors){ res.render('404', { isLogin: isLogin }); return; }
  			res.render('actorResult', { isLogin: isLogin,
  										actors: actors });
  		});
	}
};



exports.getGenres = function(req, res){

	var isLogin = false;
	if(req.isAuthenticated()){ isLogin = true; }
	var genre = req.params.value;
	console.log(genre);
	var query1 = "select distinct m.MOVIE_ID, m.TITLE_YEAR, m.RUNTIME, m.POSTER, m.POPULARITY, m.MPAA, m.RT_AUDIENCE_RATING, "
				+ " m.RELEASE_DATE, mt.GENRES, mt.COUNTRIES, m.OVERVIEW"
				+ " from MOVIES m left outer join movies_trailers mt on m.MOVIE_ID = mt.IMDB" 
				+ " where mt.GENRES like '%" + genre + "%'"
				+ " limit 200";
	connection.query(query1, function(err, movies){
		if(err) throw err;
		res.render('movieResult', { isLogin: isLogin,
									movies: movies });
	});				
};

exports.getYears = function(req, res){
	var isLogin = false;
	if(req.isAuthenticated()){ isLogin = true; }
	var year = req.params.value;
	console.log(year);
	var query1 = "select distinct m.MOVIE_ID, m.TITLE_YEAR, m.RUNTIME, m.POSTER, m.POPULARITY, m.MPAA, m.RT_AUDIENCE_RATING, "
					+ " m.RELEASE_DATE, mt.GENRES, mt.COUNTRIES, m.OVERVIEW"
					+ " from MOVIES m left outer join movies_trailers mt on m.MOVIE_ID = mt.IMDB" 
					+ " where m.TITLE_YEAR like '%" + year + "%'"
					+ " limit 200"; 
	connection.query(query1, function(err, movies){
		if(err) throw err;
		res.render('movieResult', { isLogin: isLogin,
									movies: movies });
	});	
};

exports.getTag = function(req, res){
	var isLogin = false;
	if(req.isAuthenticated()){ isLogin = true; }
	var tag = req.params.value;
	console.log(tag);
	var query1 = "select DISTINCT m.MOVIE_ID, m.TITLE_YEAR, m.RUNTIME, m.POSTER, m.POPULARITY, m.MPAA, m.RT_AUDIENCE_RATING, "
				+ " m.RELEASE_DATE, mt.GENRES, mt.COUNTRIES, m.OVERVIEW "
				+ " from Movies_Tags mta inner join MOVIES m on mta.IMDB = m.MOVIE_ID "
				+ " inner join movies_trailers mt on mt.IMDB = m.MOVIE_ID "
				+ "	where mta.TAG LIKE '%" + tag + "%'"
				+ " LIMIT 8";
	connection.query(query1, function(err, movies){
		if(err) throw err;
		res.render('movieResult', { isLogin: isLogin,
									movies: movies });
	});	
};

/*
exports.get_classes = function(req, res){

	var isLogin = false;
	if(req.isAuthenticated()){ isLogin = true; }

		var query1 = connection.query('SELECT DISTINCT(GENRE) FROM MOVIE_GENRE', function(err, genres){

			if(err){ console.error(err); return; }

			var query2 = connection.query('SELECT DISTINCT(TAG), COUNT(IMDB) FROM Movies_Tags GROUP BY TAG ORDER BY COUNT(IMDB) DESC LIMIT 30', function(err, tags_temp){
												
						if(err){ console.error(err); return; }

						var years = new Array(30);
						for(var i = 0, start = 1987; i <= 30; i++)   years[i] = start + i;

						var tags = new Array(30);
						for(var i = 0; i < 30; i++)   tags[i] = tags_temp[i]["TAG"]

						res.render('categories.ejs', {genres_list: genres, years_list: years, tags_list: tags, isLogin: isLogin});
					});
	});
};*/

exports.get_classes = function(req, res){
	var MongoClient = require('mongodb').MongoClient
	  , assert = require('assert');
	var url = 'mongodb://Minions:1234567890@ds057954.mongolab.com:57954/cis550_project';
	
	MongoClient.connect(url, function(err, db) {
		  assert.equal(null, err);
		  console.log("Connected correctly to server");
		  
		  var collection = db.collection('MOVIE_GENRE');
		  collection.distinct('GENRE', function(err, genres) {
			  var collection2 = db.collection('Movies_Tags');
			  
			  collection2.aggregate(
					  [
					   { $group: { _id: "$TAG", count: {$sum:1} } },
					   { $sort : { count : -1} }
					  ]
			  ).limit(30).toArray(function(err, tags_tmp) {
				  assert.equal(err, null);
			  
				  var tags = JSON.parse(JSON.stringify(tags_tmp));
				  
				  var years = new Array(30);
				  for(var i = 0, start = 1987; i <= 30; i++)   years[i] = start + i;
				  
				  var tags_trim = new Array(30);
				  for(var i = 0; i < 30; i++)   tags_trim[i] = tags[i]["_id"]
				  
				  res.render('categories.ejs', {genres_list: genres, years_list: years, tags_list: tags_trim, isLogin: false});
				  
				  //db.close();
			  });
		  });
	});
}

