var expect = require('expect.js'),
    DeisApi = require('../');

function removeAccount(deis, callback) {
  deis.login(function(err) {
    deis.auth.cancel(callback);
  });
}

function registerAndLogin(deis, callback) {
  deis.register('deis@deis.io', function(err, user) {
    expect(err).to.be(null);
    deis.login(callback);
  });
}

describe('auth suite', function() {
  it('should register just as user', function(done) {
    var deis = new DeisApi({
      controller: 'deis.local3.deisapp.com',
      username: 'test',
      password: 'opensesame'
    });

    removeAccount(deis, function(err) {
      expect(err).to.be(null);
      deis.register('deis@deis.io', function(err, user) {
        expect(err).to.be(null);
        expect(user).to.be.a(Object);
        expect(user.is_active).to.be.eql(true);
        done();
      });
    });
  });

  it('should login', function(done) {
    var deis = new DeisApi({
      controller: 'deis.local3.deisapp.com',
      username: 'test',
      password: 'opensesame'
    });

    deis.login(function(err) {
      expect(err).to.be(null);
      done();
    });
  });

  it('should return whoami info', function(done) {
    var deis = new DeisApi({
      controller: 'deis.local3.deisapp.com',
      username: 'test',
      password: 'opensesame'
    });

    var whoami = deis.whoami();
    expect(whoami).to.be.a('object');
    expect(whoami).to.be.eql({ message: 'You are test at deis.local3.deisapp.com' });
    done();
  });

  it('should allow the password change', function(done) {
    var deis = new DeisApi({
      controller: 'deis.local3.deisapp.com',
      username: 'super',
      password: 'user'
    });

    deis.login(function(err) {
      deis.auth.cancel(function(err) {
        deis.register('deis@deis.io', function(err, user) {
          expect(err).to.be(null);
          deis.login(function(err) {
            deis.auth.passwd('user', 'newuser', function(err) {
              expect(err).to.be(null);
              deis = new DeisApi({
                controller: 'deis.local3.deisapp.com',
                username: 'super',
                password: 'newuser'
              });

              deis.login(function(err) {
                expect(err).to.be(null);
                deis.auth.cancel(function(err) {
                  done(err);
                });
              });
            });
          });
        });
      });
    });
  });

  it('should fail to login with an invalid account', function(done) {
    var deis = new DeisApi({
      controller: 'deis.local3.deisapp.com',
      username: 'invalid-user',
      password: 'password'
    });

    deis.login(function(err) {
      expect(err).to.be.a(Error);
      done();
    });
  });

});
