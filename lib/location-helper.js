var geoip = require('geoip-lite');

var getCountry = function (req) {
  var geo = geoip.lookup(req.ip);
  if (geo && geo.country) {
    return geo.country;
  } else {
    return 'US';
  }
};

module.exports.getCountry = getCountry;
