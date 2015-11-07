var express = require('express');
var app = express();

var url = require('url');

var redisURL = url.parse(process.env.REDIS_URL);

var EMBER_APP_NAME = 'location-aware-ember:index';
var serverVarInjectHelper = require('./lib/server-var-inject-helper');
var fetchIndex = require('node-ember-cli-deploy-redis/fetch');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  fetchIndex(req, EMBER_APP_NAME, {
    host: redisURL.hostname,
    port: redisURL.port,
    password: redisURL.auth.split(":")[1],
    database: 0
  }).then(function(indexHtml) {
    indexHtml = serverVarInjectHelper.injectServerVariables(indexHtml, req);
    res.status(200).send(indexHtml);
  }).catch(function(err) {
    res.status(500).send('Oh noes!\n' + err.message);
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
