
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , bing = require('./routes/bing');

//var productCategoryRoute = require('./routes/productCategoryRouteConfig.js');
var app = express();
var server = http.createServer(app);
exports.server = server;
var user = require('./routes/user');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

require('./config/passport')(passport);

// all environments

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}





require('./routes/auth.js')(app, passport);
app.get('/like/:id', routes.like);
app.get('/cancelLike/:id', routes.cancelLike);
app.get('/users', routes.getUsers);
app.get('/user/:id', routes.visitUser);
app.get('/follow/:id', routes.follow);
app.get('/cancelFollow/:id', routes.cancelFollow);
app.get('/getFollows', routes.getFollows);
app.get('/getFollower', routes.getFollower);
app.get('/likedMovies', routes.userMovies);
app.get('/createGroup', routes.groupForm);
app.post('/createGroup', routes.createGroup);
app.get('/allGroups', routes.getGroups);
app.get('/group/:id', routes.groupDetails);
app.get('/dismissGroup/:id', routes.dismissGroup);
app.get('/joinGroup/:id', routes.joinGroup);
app.get('/quitGroup/:id', routes.quitGroup);
app.post('/post/:id', routes.post);
app.get('/post/:id', routes.getPost);
app.post('/comment/:id', routes.comment);
app.post('/userReview/:id', routes.userReview);
app.get('/textFriends', routes.getTextForm);
app.post('/textFriend', routes.sendMsg);
//========================================================//
app.get('/movies/:id', routes.movieDetails);
app.get('/', routes.getMovies);
app.get('/artists', routes.getArtists);
app.get('/artists/:id', routes.artistDetails);
app.get('/review/:id', routes.reviewDetails);
app.get('/reviews', routes.getReviews);
app.get('/login', user.login);
app.get('/trailers', routes.getTrailers);
app.get('/categories', routes.get_classes);

app.post('/result', routes.results);
app.get('/category/genres/:value', routes.getGenres);
app.get('/category/years/:value', routes.getYears);
app.get('/category/tag/:value', routes.getTag);
app.post('/bing', bing.postSearchResults);

app.get('/chatroom/:rid', user.chat);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
