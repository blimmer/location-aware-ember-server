var cheerio   = require('cheerio');
var locationHelper = require('./location-helper');

var injectServerVariables = function (htmlString, req) {
  var $ = cheerio.load(htmlString);
  $('meta[name=var-country]').attr('content', locationHelper.getCountry(req));

  return $.html();
};

module.exports = {
  injectServerVariables: injectServerVariables
};
