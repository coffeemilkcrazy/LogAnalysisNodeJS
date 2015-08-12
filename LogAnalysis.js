var fs = require('fs');
var stat = require('./stat');
var regex = /method=([^\s]+) path=([^\s]+) host=([^\s]+) fwd="([^"]+)" dyno=([^\s]+) connect=([^ms]+)ms service=([^ms]+)ms/;

function LogAnalysis(opts) {
  opts = opts || {pathFile: null, targetUrl: []};
  this.pathFile = opts.pathFile;
  this.summaryData = {};
  for (var i = 0; i < opts.targetUrl.length; i++) {
    var url = opts.targetUrl[i];
    this.summaryData[url] = {call:0, dyno:{}, responseTime:[]};
  }
}

LogAnalysis.prototype.parser = function parser(done) {
  function collector(line, collect, done) {
    var data = LogAnalysis.parse(line);
    var pathNoUser = LogAnalysis.replaceUser(data.path);
    var url = data.method+" "+pathNoUser;

    if (collect.hasOwnProperty(url)) {
      collect[url].call += 1;
      collect[url].responseTime.push(parseInt(data.connect)+parseInt(data.service));
      var dynoData = collect[url].dyno;
      if (dynoData[data.dyno] === undefined) dynoData[data.dyno] = 0;
      dynoData[data.dyno] += 1;
    } else {
      // console.log("not target url", url);
    }

    if (done) return done(collect);
  }

  var input = fs.createReadStream(this.pathFile);
  readLines(input, collector, this.summaryData, done);
};

function findTopDynoInHash(obj) {
  if (Object.keys(obj).length === 0) return {dyno: "", times: NaN};

  var sorted = [];
  for (var key in obj) sorted.push([key, obj[key]]);
  sorted.sort(function(a, b) {
      a = a[1];
      b = b[1];
      return a < b ? 1 : (a > b ? -1 : 0);
  });
  return {dyno: sorted[0][0], times: sorted[0][1]};
}

LogAnalysis.prototype.analysis = function analysis(fileOutput) {

  function done(result) {
    var outputText = "";
    for (var key in result) {
      var topDyno = findTopDynoInHash(result[key].dyno);

      console.log(key);
      console.log("called", result[key].call, "times");
      console.log("mean of response time:", stat.mean(result[key].responseTime), "ms");
      console.log("median of response time:", stat.median(result[key].responseTime), "ms");
      console.log("mode of response time:", stat.mode(result[key].responseTime), "ms");
      console.log("most dyno responded:", topDyno.dyno, topDyno.times, "times");
      console.log("");

      outputText += key+"\n";
      outputText += "called "+ result[key].call+ " times"+"\n";
      outputText += "mean of response time: "+ stat.mean(result[key].responseTime)+ " ms"+"\n";
      outputText += "median of response time: "+ stat.median(result[key].responseTime)+ " ms"+"\n";
      outputText += "mode of response time: "+ stat.mode(result[key].responseTime)+ " ms"+"\n";
      outputText += "most dyno responded: "+ topDyno.dyno+" "+ topDyno.times+ " times"+"\n";
      outputText += "\n";
    }

    fs.writeFile(fileOutput, outputText, function (err) {
      if (err) return console.error(err);
    });
  }

  this.parser(done);
};

LogAnalysis.parse = function parse(line) {
  var capture;
  if ((capture = regex.exec(line)) !== null) {
    if (capture.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    return {
      method: capture[1],
      path: capture[2],
      host: capture[3],
      fwd: capture[4],
      dyno: capture[5],
      connect: capture[6],
      service: capture[7]
    };
  } else {
    console.error("cannot parse", line);
    return;
  }
};

LogAnalysis.replaceUser = function replaceUser(url) {
  return url.replace(/users\/[^\s\/]+/, "users/{user_id}");
};


function readLines(input, func, collect, done) {
  var remaining = '';
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      func(line, collect, null);
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining, collect, done);
    }
  });
}

module.exports = LogAnalysis;
