var expect = require('expect.js'),
    DeisApi = require('../');

describe('auth suite', function() {
  it('should register just as user', function(done) {
    var deis = new DeisApi({
      controller: 'deis.local3.deisapp.com',
      username: 'test',
      password: 'opensesame'
    });

    deis.login(function(err) {
      expect(err).to.be(null);
      deis.user.cancelAccount(function(err) {
        expect(err).to.be(null);
        deis.register('deis@deis.io', function(err, user) {
          expect(err).to.be(null);
          expect(user).to.be.a(Object);
          expect(user.is_active).to.be.eql(true);
          done();
        });
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
      expect(deis.token).to.be.a('string');
      done();
    });
  });

  it('should allow the password change', function(done) {
    var deis = new DeisApi({
      controller: 'deis.local3.deisapp.com',
      username: 'super',
      password: 'newuser'
    });

    deis.register('deis@deis.io', function(err, user) {
      expect(err).to.be(null);
      deis.login(function(err) {
        expect(err).to.be(null);
        deis.user.cancelAccount(function(err) {
          deis.register('deis@deis.io', function(err, user) {
            expect(err).to.be(null);
            deis.login(function(err) {
              expect(err).to.be(null);
              expect(deis.token).to.be.a('string');
              expect(deis.authenticated).to.be.eql(true);

              deis.user.changePassword('newuser', 'user', function(err) {
                expect(err).to.be(null);
                deis = new DeisApi({
                  controller: 'deis.local3.deisapp.com',
                  username: 'super',
                  password: 'user'
                });

                deis.login(function(err) {
                  expect(err).to.be(null);
                  deis.user.cancelAccount(function(err) {
                    done();
                  });
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
      expect(deis.token).to.be(null);
      done();
    });
  });
});
