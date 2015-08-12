var LogAnalysis = require('./LogAnalysis');
var logAnalysis = new LogAnalysis({pathFile: "sample.log", targetUrl:["GET /api/users/{user_id}/count_pending_messages",
              "GET /api/users/{user_id}/get_messages",
              "GET /api/users/{user_id}/get_friends_progress",
              "GET /api/users/{user_id}/get_friends_score",
              "POST /api/users/{user_id}",
              "GET /api/users/{user_id}"]});

logAnalysis.analysis("report.txt");
