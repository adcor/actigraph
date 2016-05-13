var express = require('express');



var chartD = function(db, callback) {
  var activities = db.collection('activities');
  activities.find({}).toArray(function(err, docs){
    console.dir(docs);
    callback(docs);
  });
}

module.exports = {
	chartD: chartD 
};