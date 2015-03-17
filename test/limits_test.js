var expect = require('expect.js'),
    DeisApi = require('../');

var APP_NAME = 'app-config-test';

describe('limits suite', function() {

  var deis = new DeisApi({
    controller: 'deis.local3.deisapp.com',
    username: 'test',
    password: 'opensesame'
  });

  before(function(done) {
    deis.login(function(err) {
      deis.auth.cancel(function(err) {
        deis.register('deis@deis.io', function(err, user) {
          deis.login(function(err) {
            deis.apps.destroy(APP_NAME, function(err) {
              done();
            });
          });
        });
      });
    });
  });

  it('should return no limits', function(done) {
    deis.apps.create(APP_NAME, function(err, app) {
      expect(err).to.be(null);
      expect(app).to.be.a(Object);

      deis.limits.list(APP_NAME, function(err, limits) {
        expect(err).to.be(null);
        expect(limits).to.be.a(Object);
        expect(Object.keys(limits).length).to.be.eql(2);
        expect(Object.keys(limits.memory).length).to.be.eql(0);
        expect(Object.keys(limits.cpu).length).to.be.eql(0);
        done();
      });
    });
  });

  it('should set memory limits', function(done) {
    deis.limits.set(APP_NAME, {
      memory: {
        web: '1G'
      }
    }, function(err, limits) {
      expect(err).to.be(null);
      expect(limits).to.be.a(Object);
      expect(Object.keys(limits).length).to.be.eql(1);
      expect(Object.keys(limits.memory).length).to.be.eql(1);
      expect(limits.cpu).to.be(undefined);
      expect(limits.memory.web).to.be.eql('1G');
      done();
    });
  });

  it('should remove memory limits', function(done) {
    deis.limits.unset(APP_NAME, 'memory', 'web', function(err, limits) {
      expect(err).to.be(null);
      expect(limits).to.be.a(Object);
      console.log(limits)
      expect(Object.keys(limits).length).to.be.eql(1);
      expect(limits.cpu).to.be(undefined);
      expect(limits.memory).to.be(null);
      done();
    });
  });
});
