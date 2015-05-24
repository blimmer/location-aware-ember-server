var geoip = require('geoip-lite');

var getCountry = function (req) {
  var ipAddr = req.headers["x-forwarded-for"];
  if (ipAddr){
    var list = ipAddr.split(",");
    ipAddr = list[list.length-1];
  } else {
    ipAddr = req.connection.remoteAddress;
  }

  var geo = geoip.lookup(ipAddr);

  if (geo && geo.country) {
    return geo.country;
  } else {
    return 'US';
  }
};

module.exports.getCountry = getCountry;
