var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var home = require('./routes/home');
var workout = require('./routes/workout')
var users = require('./routes/users');
var groups = require('./routes/groups');
var workout_notifications = require('./routes/workout_notifications');
var friend_notifications = require('./routes/friend_notifications');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/workout',workout);
app.use('/users', users);
app.use('/groups', groups);
app.use('/workout_notifications', workout_notifications);
app.use('/friend_notifications', friend_notifications);

mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + 'beaverRun';
//take advantage of openshift env vars when available:
/*
if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + 'beaverRun';
}

*/
mongoose.connect('mongodb://127.0.0.1:27017/' + 'beaverRun');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
    console.log('database connection confirmed');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            title: 'beaverRun | Error',
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
