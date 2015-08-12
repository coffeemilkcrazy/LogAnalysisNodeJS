var stat = require('../stat');
var LogAnalysis = require('../LogAnalysis');

describe('stat', function() {

  describe('#mean()', function() {
    it('test find mean value set 1', function(done) {
      var val = stat.mean([1,2,3,4,5]);
      if (val === 3) return done();
      throw "invalid value "+val;
    });

    it('test find mean value set 2', function(done) {
      var val = stat.mean([3,3,4,1]);
      if (val === 2.75) return done();
      throw "invalid value "+val;
    });
  });

  describe('#median()', function() {
    it('test find median value set 1', function(done) {
      var val = stat.median([1,2,3,4,5]);
      if (val === 3) return done();
      throw "invalid value "+val;
    });

    it('test find median value set 2', function(done) {
      var val = stat.median([3,3,4,1]);
      if (val === 3) return done();
      throw "invalid value "+val;
    });
  });

  describe('#mode()', function() {
    it('test find mode value set 1', function(done) {
      var val = stat.mode([1,1,3,4,5]);
      if (val === 1) return done();
      throw "invalid value "+val;
    });

    it('test find mode value set 2', function(done) {
      var val = stat.mode([3,3,4,1]);
      if (val === 3) return done();
      throw "invalid value "+val;
    });
  });

});


describe('LogAnalysis', function() {

  describe('#parse()', function() {
    it('method should be POST', function(done) {
      var data = LogAnalysis.parse("2014-01-09T06:17:19.658075+00:00 heroku[router]: at=info method=POST path=/api/users/100002855870680 host=services.pocketplaylab.com fwd=\"27.131.40.242\" dyno=web.10 connect=1ms service=442ms status=200 bytes=52");
      if (data.method === "POST" && data.path === "/api/users/100002855870680" && data.dyno === "web.10" && data.connect === "1" && data.service === "442") return done();
      throw "invalid value "+data;
    });

    it('method should be GET', function(done) {
      var data = LogAnalysis.parse("2014-01-09T06:15:59.090644+00:00 heroku[router]: at=info method=GET path=/api/users/100007107163063/get_messages host=services.pocketplaylab.com fwd=\"75.177.118.225\" dyno=web.2 connect=0ms service=58ms status=200 bytes=443");
      if (data.method === "GET" && data.path === "/api/users/100007107163063/get_messages" && data.dyno === "web.2" && data.connect === "0" && data.service === "58") return done();
      throw "invalid value "+data;
    });
  });

  describe('#replaceUser()', function() {
    it('url should be replace user_id to {user_id}', function(done) {
      var data = LogAnalysis.replaceUser("/api/users/100002855870680");
      if (data === "/api/users/{user_id}") return done();
      throw "invalid value "+data;
    });

    it('url should be replace user_id/... to {user_id}', function(done) {
      var data = LogAnalysis.replaceUser("/api/users/100007107163063/get_messages");
      if (data === "/api/users/{user_id}/get_messages") return done();
      throw "invalid value "+data;
    });
  });

});
