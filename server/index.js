var http = require("http");
var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var open = require('open');
var rString = require('random-string');

app.use(bodyParser.json({limit: '15mb'}));
app.use('/', express.static(__dirname + '/../'));
app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
  fs.readFile(__dirname+'/../client/index.html', function(err, data){
    if(err) console.log(err);
    res.end(data);
  })
})

app.post('/photo', function(req, res) {
  var decodedImage = new Buffer(req.body.data
    .replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
  var fileLoc = "./server/uploads/" + rString({length: 20}) + ".jpeg";

  fs.writeFile(fileLoc, decodedImage, function(err) {
    if (err) console.error(err);
    else res.end(fileLoc);
  });
})

app.listen(app.get('port'), function(){
  console.log('Node app is running on port', app.get('port'));
  //open('http://localhost:3000');
});