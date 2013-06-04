
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user.js')
  , http = require('http')
  , path = require('path')
  , models = require('./models.js')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , GoogleStrategy = require('passport-google').Strategy;

var app = express();
var User = models.User;

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/storinary');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var local = 'http://localhost:3000/';
var remote = 'Fill in later';

passport.use(new GoogleStrategy({
    //change local to remote when deploying
    returnURL: local + 'auth/google/return',
    realm: local
  },
  function(identifier, profile, done) {
    var email = profile.emails[0].value;
    console.log("User email: ", email);
    User.findOne({email:email}).exec(function(err,user){
      console.log("\nUser info below: \n")
      console.log(user);
      if (err){
        console.log(err);
        return done(err);
      }
      if (user==null){
        user = new User({email:email});
        console.log('User created.');
        user.save(function(err){
          if (err) {
            console.log(err);
            return done(err);
          }
          console.log('User saved.');
          return done(null, user);
        });
      }
      else {
        console.log('User found.');
        return done(null, user);
      }
    });
  }));


app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('secret', process.env.SESSION_SECRET)
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('use .env files later'));
  app.use(express.session({ secret: 'use .env files later' }))
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

passport.serializeUser(function(user, done) {
    done(null, user.email);
});

passport.deserializeUser(function(email, done) {
    User.findOne({email:email}, function(err, user) {
        done(err, user);
    });
});

app.get('/', routes.index);
app.get('/login', loginRequired, user.login); // Logging in, creating a user.
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return', passport.authenticate('google', {failureRedirect: '/login' }), function(req, res) {
  res.redirect('/');
});


function loginRequired(req, res, next){
  if (!req.user) {
    //Set the url the user was trying to get to in req.session
    console.log("User not authenticated.")
    //Automatically lead the user to the auth page
    res.redirect('/auth/google');
  } else {
    console.log("User already logged in.")
    console.log(req.user)
    next();
  }
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
