var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'cis550courseproject.cojm56uytqf8.us-east-1.rds.amazonaws.com',
	user: 'MinionMovies',
	password: '1234567890',
	database: 'MinionMovies'
});
connection.connect();

module.exports = function(passport){
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		connection.query("select * from user where id = " + id,function(err,rows){	
			done(err, rows[0]);
		});
	});

	//Facebook login strategy -->
	passport.use(new FacebookStrategy({
		clientID: '454728868060496',
		clientSecret: '338c5b532e4f897e801fee55a9de4b9c',
		callbackURL: 'http://ec2-52-91-185-158.compute-1.amazonaws.com/auth/facebook/callback',
		profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'photos'], 
        passReqToCallback: true
	},
	function(req, accessToken, refreshToken, profile, done){
		console.log(profile);
		var query1 = "select * from user where facebookId = '" + profile.id + "'";
		console.log(query1);
		connection.query(query1, function(err, rows){
			console.log(rows);
			if(err){
				return done(err);
			}
			if(rows.length){
				return done(null, rows[0], req.flash('facebookMessage', 'Success.'));
			}else{
				var newUser = new Object();
				newUser.facebookId = profile.id;
				newUser.name = profile.displayName;
				newUser.gender = profile.gender;
				newUser.facebookLink = profile.profileUrl;
				newUser.photo = profile.photos[0].value;
				var query2 = "insert into user (facebookId, name, gender, facebookLink, photo) values (" 
								+ newUser.facebookId +", '" + newUser.name + "', '" + newUser.gender + "', '"
								+ newUser.facebookLink + "', '" + newUser.photo + "')";
				console.log(query2);
				console.log(profile);
				connection.query(query2, function(err, rows1){
					console.log(rows1);
					console.log(newUser);
					newUser.id = rows1.insertId;
					return done(null, newUser, req.flash('facebookMessage', 'Success.'));
				});	
			}
		});
	}));
}






































