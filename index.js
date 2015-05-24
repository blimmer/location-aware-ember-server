var express = require('express');
var app = express();

var async = require('async');

var EMBER_APP_NAME = 'location-aware-ember';
var redis = require('redis');
var url = require('url');

var redisURL = url.parse(process.env.REDIS_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname);
client.auth(redisURL.auth.split(":")[1]);

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  var indexkey = null;

  if (req.query.index_key) {
    queryKey = req.query.index_key.replace(/[^A-Za-z0-9]/g, '');
    indexkey = EMBER_APP_NAME + ':' + queryKey;
  }

  async.waterfall([
    // 1. Get the current indexkey, or use the one provided in the query param
    function(callback) {
      if (indexkey) {
        callback(null, indexkey, false);
      } else {
        client.get(EMBER_APP_NAME + ":current", function(err, indexkey) {
          if (err || !indexkey) {
            // there's no "current" revision
            callback(true);
          } else {
            callback(null, indexkey, true);
          }
        });
      }
    },
    // 2. Get the index page out of redis
    function(indexkey, isCurrent, callback) {
      client.get(indexkey, function(err, index) {
        if (err || !index) {
          // TODO: integrate with your ops (newrelic/pagerduty)
          if (isCurrent) {
            // current index is not found - warn someone
          } else {
            // couldn't find passed index - not a huge deal
          }

          return callback(true);
        } else {
          callback(null, index);
        }
      });
    },
    function(index, callback) {
      // index = _injectServerVariables(index, req);
      callback(null, index);
    }
  ], function(err, indexHtml) {
    if (err) {
      res.status(500).send('Oh noes!');
    } else {
      res.status(200).send(indexHtml);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
