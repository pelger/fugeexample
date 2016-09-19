'use strict';

var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

var seneca = require('seneca')();
seneca.use('env-plugins');

seneca.add({role: 'service1', cmd: 'action1'}, function(args, callback) {
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) { return callback(err, {data: ''}); }
    var collection = db.collection('test_insert');
    collection.insert({a:5}, function(err) {
      if(err) { return callback(err, {data: ''}); }
      collection.count(function(err, count) {
        console.log(format('count = %s', count));
        db.close();
        callback(null, {count: (count)});
      });
    });
  });
});

seneca.add({role: 'service1', cmd: 'action2'}, function(args, callback) {
  callback(null, {data: 'data'});
});


seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});
module.exports.seneca = seneca;
