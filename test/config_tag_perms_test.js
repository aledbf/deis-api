var expect = require('expect.js'),
    DeisApi = require('../');

var APP_NAME = 'app-config-test';

describe('app config, tags and perms suite', function() {

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

  it('should return no tags', function(done) {
    deis.tags.list(APP_NAME, function(err, values) {
      expect(err).to.be(null);
      expect(values).to.be.an(Object);
      expect(Object.keys(values).length).to.be.eql(0);
      done();
    });
  });

  it('should add new tag', function(done) {
    var test = {
      'location': 'test'
    };

    deis.tags.set(APP_NAME, test, function(err, values) {
      expect(err).to.be(null);
      expect(values).to.be.an(Object);
      expect(Object.keys(values).length).to.be.eql(1);
      expect(values).to.be.eql(test);
      done();
    });
  });

  it('should remove the tag "location"', function(done) {
    deis.tags.unset(APP_NAME, ['location'], function(err, values) {
      expect(err).to.be(null);
      expect(values).to.be.an(Object);
      expect(Object.keys(values).length).to.be.eql(0);
      done();
    });
  });


  /****/
  it('should return empty perms', function(done) {
    var expected = {
      'users': []
    };

    deis.perms.list(APP_NAME, function(err, values) {
      expect(err).to.be(null);
      expect(values).to.be.an(Object);
      expect(Object.keys(values).length).to.be.eql(1);
      expect(values).to.be.eql(expected);
      done();
    });
  });

  it('should add new perm for user "deis"', function(done) {
    var expected = {
      users: ['test']
    };

    deis.perms.create('test', APP_NAME, function(err) {
      expect(err).to.be(null);
      deis.perms.list(APP_NAME, function(err, values) {
        expect(err).to.be(null);
        expect(values).to.be.an(Object);
        expect(Object.keys(values).length).to.be.eql(1);
        expect(values).to.be.eql(expected);
        done();
      });
    });
  });

  it('should remove the permission for user "test"', function(done) {
    deis.tags.unset(APP_NAME, ['location'], function(err, values) {
      expect(err).to.be(null);
      expect(values).to.be.an(Object);
      expect(Object.keys(values).length).to.be.eql(0);
      done();
    });
  });
});
