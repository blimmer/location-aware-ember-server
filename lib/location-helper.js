var geoip = require('geoip-lite');

var getCountry = function (req) {
  var geo = geoip.lookup(req.ip);

  console.log('geoip info for ip ' + req.ip);
  console.dir(geo);

  if (geo && geo.country) {
    return geo.country;
  } else {
    return 'US';
  }
};

module.exports.getCountry = getCountry;
