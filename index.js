var express = require('express');
var app = express();

var redis = require('redis');
var url = require('url');

var redisURL = url.parse(process.env.REDIS_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname);
client.auth(redisURL.auth.split(":")[1]);

var EMBER_APP_NAME = 'location-aware-ember';
var serverVarInjectHelper = require('./lib/server-var-inject-helper');
var emberDeploy = require('node-ember-cli-deploy-redis');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    emberDeploy.fetchIndex(EMBER_APP_NAME, req, client).then(function (indexHtml) {
    indexHtml = serverVarInjectHelper.injectServerVariables(indexHtml, req);
    res.status(200).send(indexHtml);
  }).catch(function(err) {
    res.status(500).send('Oh noes!\n' + err.message);
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
