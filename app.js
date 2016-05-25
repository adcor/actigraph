var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var app = express();



mongoose.connect('mongodb://unsio:labtest@ds051750.mlab.com:51750/activities');

// view engine setup

app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');
/*app.get('/', function(request, response) {
    res.render('index');
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});*/


//this worked before making above get change
app.get('/', function(req, res) {
  res.render('index')
})



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect('mongodb://unsio:labtest@ds051750.mlab.com:51750/activities', (err, database) => {
  if(err) return console.log(err) 
  db = database
  app.listen(3000, function() {
  console.log('listening on 3000');
  })
  
})


app.use('/', routes);
app.use('/users', users);
app.use('/api', api);



app.post('/', function(req, res){
  db.collection('activities').save(req.body, (err,result)=>{
    if (err) return console.log(err)

    console.log("saved to database ")
    console.log(req.body)
    res.redirect('/')
  })
})


app.post('/api')


app.post('/activities', (req, res) => {

})

app.get('/views', (req, res) => {
  db.collection('activities').find().toArray((err, result) => {
    if (err) return console.log(err);

    res.render('index', {activity: result})
  })
  
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.post('/activities', (req, res) => {
  db.collection('activities').save(req.body, (err,result)=>{
    if (err) return console.log(err)

    console.log("saved to database ")
    res.redirect('/')
  })
})

app.get('/views', (req, res) => {
  db.collection('activities').find().toArray((err, result) => {
    if (err) return console.log(err);

    res.render('index', {activity: result})
  })
  
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
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



