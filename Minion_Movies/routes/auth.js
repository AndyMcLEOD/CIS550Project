var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'cis550courseproject.cojm56uytqf8.us-east-1.rds.amazonaws.com',
	user: 'MinionMovies',
	password: '1234567890',
	database: 'MinionMovies'
});
connection.connect();

module.exports = function(app, passport){

	app.get('/profile', isLoggedIn, function(req, res){
		var favourate = "";
		var followNum = 0;
		var followerNum = 0;
		var uid = req.user.id;
		var query1 = "select * from likes inner join MOVIES on mid = MOVIE_ID where uid = " + uid + " limit 5";
		var query2 = "select count(user2) from follow where user1 = " + uid + " group by user1;";
		var query3 = "select count(user1) from follow where user2 = " + uid + " group by user2;";
		var query4 = "select * from inGroup where uid = " + uid;
		console.log(query1);
		connection.query(query1, function(err, movies){
			if(err) throw err;
			favourate = movies;
		});
		connection.query(query2, function(err, follows){
			if(err) throw err;
			if(follows.length > 0){ followNum = follows[0]["count(user2)"]; }	
		});
		connection.query(query3, function(err, followers){
			if(err) throw err;
			if(followers.length > 0){ followerNum = followers[0]["count(user1)"]; }
			
		});
		connection.query(query4, function(err, groups){
			if(err) throw err;
			res.render('profile', { user: req.user, 
									favourate: favourate,
									followNum: followNum,
									followerNum: followerNum,
									groups: groups });
			
		});
	});

	app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

	app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/profile',
																			failureRedirect: '/',
																			successFlash: true,
																			failureFlash: true}));

	app.get('/logout', function(req, res){
		console.log("User:");
		console.log(req.user);
		req.logout();
		res.redirect('/');
	});
}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/');
}
