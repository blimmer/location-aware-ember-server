var express = require('express');
var app = express();

var emberDeployHelper = require('./lib/ember-deploy-helper');
var redis = require('redis');
var url = require('url');

var redisURL = url.parse(process.env.REDIS_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname);
client.auth(redisURL.auth.split(":")[1]);

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  emberDeployHelper.renderIndex(req, res, client);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
