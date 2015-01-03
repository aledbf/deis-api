var expect = require('expect.js'),
    DeisApi = require('../');

describe('login suite', function() {
  before(function(done) {
    var deis = new DeisApi({
      controller: 'deis.local3.deisapp.com',
      username: 'admin',
      password: 'deis'
    });

    deis.login(function(err) {
      deis.user.cancelAccount(function(err) {
        done();
      });
    });
  });

  it('should fail (invalid user)', function(done) {
    var deis = new DeisApi({
      controller: 'deis.local3.deisapp.com',
      username: 'admin',
      password: 'invalid'
    });

    deis.login(function(err) {
      expect(err).to.be.a(Error);
      done();
    });
  });

  it('should fail (invalid password)', function(done) {
    var deis = new DeisApi({
      controller: 'deis.local3.deisapp.com',
      username: 'admin',
      password: 'invalid'
    });

    deis.login(function(err) {
      expect(err).to.be.a(Error);
      done();
    });
  });

  it('should login', function(done) {
    var deis = new DeisApi({
      controller: 'deis.local3.deisapp.com',
      username: 'admin',
      password: 'deis'
    });

    deis.register('deis@deis.io', function(err, user) {
      deis.login(function(err) {
        expect(err).to.be(null);
        done();
      });
    });
  });
});
