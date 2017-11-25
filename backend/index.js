var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var elasticsearch = require('./queries');

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

    // elasticsearch.searchByQueryString("espoo");
    elasticsearch.searchAggregatedResults('2017-10-25', '2017-10-28', '6h');
  };

  fetchData();
});
