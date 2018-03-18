/*==============================================================================================
how to add external css style to node.js
check: https://teamtreehouse.com/community/cant-get-the-css-to-load-in-the-nodejs-server
================================================================================================*/
/*=========================================================================
Start MongoDB.
To start MongoDB, run exe. For example, from the Command Prompt:
"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe"
==========================================================================*/

//when the user fill the form the
// form fields data will be saved in Database


var http = require('http'); // making connection with server
var fs = require('fs'); // for reading file system
var path = require('path');

//for making connaction to Mongodb:
var MongoClient = require('mongodb').MongoClient;
var querystring = require('querystring');
var url = "mongodb://localhost:27017/"; // the database address


var server = http.createServer(function(req, res){
  //for each request we have to define how the page should work ( ex: for css page req etc..)
  //connecting to css file
  if(req.url.indexOf(".css") !== -1){
    var file = fs.readFileSync(`.${req.url}`, {'encoding' : 'utf8'});
    res.writeHead(200, {'Content-Type' : 'text/css'});
    res.write(file);
    res.end();
     console.log("CSS file working");
  }
  if (req.url.match("\.jpg$") || req.url.match("\.png$")){
       var imagePath = path.join(__dirname, 'public', req.url);
       //read the file and with images it read from binary so no need to convert
       var fileStream = fs.createReadStream(imagePath);
       res.writeHead(200, {"Content-Type":"image/jpg"});
       res.writeHead(200, {"Content-Type":"image/png"});
       fileStream.pipe(res);
   }
  //locate the path to the form
    if(req.url === '/contact'){
       res.writeHead(200, {"Contact-Type": "text/html"});
       fs.createReadStream("./public/contactMe.html", "UTF-8").pipe(res);
       console.log("working");
   }

   // we need to catch the data and store first
     //then show it to the console or save it in database
     var data = "";
     if(req.method === 'POST'){
       req.on("data", function(chunk){
         data += chunk;
       });
       req.on("end", function(chunk){
      //saving the data into db but we need to make connection first
      MongoClient.connect(url, function(err, db){
        var dbo = db.db("cvportfoliocontactMe"); //database contactMe
        var userData = querystring.parse(data);
        console.log(userData);
        if(err) throw err;
        dbo.collection('usersdata').insertOne(userData, function(req, res){
          if(err) throw err;
          console.log(" UserData added sucessfully");
          db.close();
        });
      });
    });
     }
});

server.listen(3000, function(){
  console.log("Listening to port 3000!");
});
