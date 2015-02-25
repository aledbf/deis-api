var expect = require('expect.js'),
    DeisApi = require('../');

var deis = new DeisApi({
  controller: 'deis.local3.deisapp.com',
  username: 'test',
  password: 'opensesame'
});

var TEST_KEY = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAAYQD3txsEf0HAKElAFUvIXzsM98gfPlIbG4/GlqbYYBulkHu6z0laOdoT14Zx2M+3q+9RjhTZjHxyMfePdcgNK9z98V6tOz5bIQhtMS8tl1Tnw5qZByGqpqOKf665ev62LaM= testing-ssh2-from-node.js';

describe('keys suite', function() {

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

  it('should list the keys (0)', function(done) {
    deis.keys.list(function(err, keys) {
      expect(err).to.be(null);
      expect(keys.count).to.be.eql(0);
      done();
    });
  });

  it('should add a key with id demo-key', function(done) {
    deis.keys.add('demo-key', TEST_KEY, function(err, key) {
      expect(err).to.be(null);
      expect(key).to.be.a(Object);
      done();
    });
  });

  it('should list the keys (1)', function(done) {
    deis.keys.list(function(err, keys) {
      expect(err).to.be(null);
      expect(keys.count).to.be.eql(1);
      expect(keys.results[0].public).to.be.eql(TEST_KEY);
      done();
    });
  });

  it('should remove the keys with id demo-key', function(done) {
    deis.keys.remove('demo-key', function(err) {
      expect(err).to.be(null);
      deis.keys.list(function(err, keys) {
        expect(err).to.be(null);
        expect(keys.count).to.be.eql(0);
        done();
      });
    });
  });
});
