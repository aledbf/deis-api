var expect = require('expect.js'),
    DeisApi = require('../');

var deis = new DeisApi({
  controller: 'deis.local3.deisapp.com',
  username: 'admin',
  password: 'deis'
});

describe('logout suite', function() {
  before(function(done) {
    deis.login(function(err) {
      deis.auth.cancel(function(err) {
        deis.register('deis@deis.io', function(err, user) {
          deis.login(function(err) {
            done();
          });
        });
      });
    });
  });

  it('should remove token', function(done) {
    var deis = new DeisApi({
      controller: 'deis.local3.deisapp.com',
      username: 'admin',
      password: 'deis'
    });

    deis.logout(function() {
      expect(deis.token).to.be(null);
      done();
    });
  });
});
