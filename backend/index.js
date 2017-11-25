var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var elasticsearch = require("elasticsearch");

var client = new elasticsearch.Client({
  host:
    "search-fivetum-junction2017-ffvhs3t2abeelwsdpqgyzwxxqa.us-east-2.es.amazonaws.com",
  log: "trace"
});

var lastData = {};
var formatData = function(data) {
  return lastData;
};

server.listen(process.env.PORT || 8080);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  // Client connected
  console.log("[CONNECT]");

  // Client disconnected
  socket.on("disconnect", function() {
    console.log("[DISCONNECT]");
  });

  // TODO: polling data from elasticsearch
  var fetchData = function() {
    if (!socket.connected) return;
    console.log("FETCHDATA");

    client
      .search({
        index: "locations",
        type: "location",
        body: {
          query: {
            bool: {
              must: {
                query_string: {
                  query: "espoo"
                }
              }
            }
          }
        }
      })
      .then(
        function(resp) {
          var hits = resp.hits.hits;
          console.log("resp", resp.hits.hits);
        },
        function(err) {
          console.trace(err.message);
        }
      );

    // fetchData();
  };

  fetchData();
});
