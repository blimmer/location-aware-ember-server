var expect  = require('chai').expect;
var sinon   = require('sinon');

var rewire  = require('rewire');
var subject = rewire('../lib/location-helper');

describe('location-helper', function() {
  var sandbox, geoip, geoipMock;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    geoip = {
      lookup: function () { }
    };
    subject.__set__('geoip', geoip);
    geoipMock = sandbox.mock(geoip);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('uses the x-forwarded-for header if it exists', function() {
    var req = {
      headers: {
        'x-forwarded-for': '8.8.8.8'
      },
      connection: {
        'remoteAddress': '1.2.3.4'
      }
    };

    geoipMock.expects('lookup').withArgs('8.8.8.8').once();

    subject.getCountry(req);
    geoipMock.verify();
  });

  it('uses the remote address if x-forwarded-for header is not present', function() {
    var req = {
      headers: {},
      connection: {
        'remoteAddress': '1.2.3.4'
      }
    };

    geoipMock.expects('lookup').withArgs('1.2.3.4').once();

    subject.getCountry(req);
    geoipMock.verify();
  });

  it('returns the country if exists in results', function() {
    var req = {
      headers: {},
      connection: {
        'remoteAddress': '1.2.3.4'
      }
    };

    geoipMock.expects('lookup').withArgs('1.2.3.4').once().returns({
      country: 'MX'
    });

    var res = subject.getCountry(req);
    geoipMock.verify();
    expect(res).to.equal('MX');
  });

  it('defaults to US if country is not defined', function() {
    var req = {
      headers: {},
      connection: {
        'remoteAddress': '1.2.3.4'
      }
    };

    geoipMock.expects('lookup').withArgs('1.2.3.4').once().returns(undefined);

    var res = subject.getCountry(req);
    geoipMock.verify();
    expect(res).to.equal('US');
  });
});
