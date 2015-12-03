
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , bing = require('./routes/bing')

//var productCategoryRoute = require('./routes/productCategoryRouteConfig.js');
var app = express();

// all environments
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

//new productCategoryRoute(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
