var expect = require('expect.js'),
    once = require('once'),
    DeisApi = require('../');

var APP_NAME = 'app-config-test';

describe('apps suite', function() {

  var deis = new DeisApi({
    controller: 'deis.local3.deisapp.com',
    username: 'test',
    password: 'opensesame'
  });

  before(function(done) {
    done = once(done);
    deis.login(function(err) {
      deis.user.cancelAccount(function(err) {
        deis.register('deis@deis.io', function(err, user) {
          deis.login(function(err) {
            deis.apps.destroy(APP_NAME, function(err) {
              console.log(err);
              done();
            });
          });
        });
      });
    });
  });

  it('should list the apps (0)', function(done) {
    deis.apps.list(function(err, apps) {
      expect(err).to.be(null);
      expect(apps.count).to.be.eql(0);
      done();
    });
  });

  it('should create an app ', function(done) {
    deis.apps.create('app-config-test', function(err, app) {
      expect(err).to.be(null);
      expect(app).to.be.a(Object);
      done();
    });
  });

  it('should list the apps (1)', function(done) {
    deis.apps.list(function(err, apps) {
      expect(err).to.be(null);
      expect(apps.count).to.be.eql(1);
      done();
    });
  });

  it('should return the info of an app', function(done) {
    deis.apps.list(function(err, apps) {
      expect(err).to.be(null);
      expect(apps.count).to.be.eql(1);
      done();
    });
  });

  it('should return the logs of an app', function(done) {
    deis.apps.list(function(err, apps) {
      expect(err).to.be(null);
      expect(apps.count).to.be.eql(1);
      done();
    }); });

  it('should run the command echo in one app', function(done) {
    deis.apps.list(function(err, apps) {
      expect(err).to.be(null);
      expect(apps.count).to.be.eql(1);
      done();
    });
  });

  it('should destroy the new app', function(done) {
    deis.apps.destroy('app-config-test', function(err) {
      expect(err).to.be(null);
      done();
    });
  });
});
