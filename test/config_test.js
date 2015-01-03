var expect = require('expect.js'),
    DeisApi = require('../');

var APP_NAME = 'app-config-test';

describe('apps config suite', function() {

  var deis = new DeisApi({
    controller: 'deis.local3.deisapp.com',
    username: 'test',
    password: 'opensesame'
  });

  before(function(done) {
    deis.login(function(err) {
      deis.user.cancelAccount(function(err) {
        deis.register('deis@deis.io', function(err, user) {
          deis.login(function(err) {
            deis.apps.create(APP_NAME, function(err, app) {
              expect(err).to.be(null);
              expect(app).to.be.a(Object);
              done();
            });
          });
        });
      });
    });
  });

  after(function(done) {
    deis.apps.destroy(APP_NAME, function(err) {
      expect(err).to.be(null);
      done();
    });
  });

  it('should return no configuration', function(done) {
    deis.config.list(APP_NAME, function(err, values) {
      expect(err).to.be(null);
      expect(values).to.be.an(Object);
      expect(Object.keys(values).length).to.be.eql(0);
      done();
    });
  });

  it('should add new variables', function(done) {
    var test = {
      'HELLO': 'world',
      'PLATFORM': 'deis'
    };

    deis.config.set(APP_NAME, test, function(err, values) {
      expect(err).to.be(null);
      expect(values).to.be.an(Object);
      expect(Object.keys(values).length).to.be.eql(2);
      expect(values).to.be.eql(test);
      done();
    });
  });

  it('should remove new variables', function(done) {
    var test = {
      'HELLO': 'world',
      'PLATFORM': 'deis'
    };

    deis.config.unset(APP_NAME, ['HELLO', 'PLATFORM'], function(err, values) {
      expect(err).to.be(null);
      expect(values).to.be.an(Object);
      expect(Object.keys(values).length).to.be.eql(0);
      done();
    });
  });
});
