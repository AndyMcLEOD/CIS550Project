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
		var uid = req.user.id;
		var query1 = "select * from likes inner join MOVIES on mid = MOVIE_ID where uid = " + uid + " limit 5";
		console.log(query1);
		connection.query(query1, function(err, movies){
			if(err) throw err;
			console.log(movies);
			res.render('profile', { user: req.user, favourate: movies });
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
