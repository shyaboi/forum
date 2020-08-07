var fs = require("fs");
var path = require("path");
var express = require("express");
var app = express();
var router = express.Router();
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const donus = process.env.MONGO_THING;
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
// const NewPost = require("./models/models")
const mongoDB = `mongodb+srv://shyaboi:${donus}@cluster0.zqw64.azure.mongodb.net/donu?retryWrites=true&w=majority`;
var mongoose = require("mongoose");
const { json } = require("body-parser");
var db = mongoose.connection;
const { v4: uuidv4 } = require('uuid');
 
// Define a custom namespace.  Readers, create your own using something like

var Schema = mongoose.Schema;
app.use(express.static("public/views/layouts"));

app.use(express.static(__dirname + "/public"));
var NewPost = new Schema({
  title: String,
  authour: String,
  date: Number,
  comment: String,
  replys: Array,
  uuid:String
});

// -----------------------------------------------------date constructor

var d = new Date();
const y = d.getFullYear();
var m = d.getMonth() + 1;
let dd = d.getDate();
let h = d.getHours();
let mm = d.getMinutes();
let s = d.getSeconds();

if (m < 10) {
  m = "" + 0 + m;
}
if (dd < 10) {
  dd = "" + 0 + dd;
}
if (h < 10) {
  h = "" + 0 + h;
}
if (mm < 10) {
  mm = "" + 0 + mm;
}
if (s < 10) {
  s = "" + 0 + s;
}
const longDate = "" + y + m + dd + h + mm + s;

console.log(longDate);


// -----------------------------------------------------date constructor
var Model = mongoose.model("NewPost", NewPost);

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB Popped! from forum"))
  .catch((err) => {
    console.log(err);
  });

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(bodyParser.json()); // to support JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


app.get("/forum", (request, response) => {

    const getAll = () => {
    MongoClient.connect(
        mongoDB,
        { useNewUrlParser: true, useUnifiedTopology: true },
        function (err, db) {
          if (err) throw err;
          var dbo = db.db("donu");
          var mysort = { date: 1 };
          dbo
            .collection("Forum")
            .find({})
            .sort(mysort)
            .toArray(function (err, result) {
              if (err) throw err;
              // for (let i = 0; i < result.length; i++) {
                  //   const all = result[i];
                  // console.log("\x1b[35m", element.name);
                  // var getAl = all.name
                  // console.log(getAl)
                  const results = result.map((wall) => {
                      return wall;
                    });
                    console.log(results)
  
              const fileName = results;
              // }
              db.close();
              response.render(`forum`, {
                fileName: fileName,
              });
            });
        }
      );
    };
    getAll();
    // console.log(ok)
  });

  

  app.get("/forum/post/:postid?", (req, res) => {
    console.log(req.query.name)
    let keyParam = req.params.postid;

console.log(keyParam)
    MongoClient.connect(
      mongoDB,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("donu");
        var mysort = { date: 1 };
        dbo
          .collection("Forum")
          .find({uuid:keyParam})
          .sort(mysort)
          .toArray(function (err, result) {
            if (err) throw err;
            const results = result.map((post) => {
              return post;
            });
            const postData = results[0]
            const postReply = results[0].replys

     
                
                console.log(postData)
    
           
    res.json(result);
  });
  })})

app.get("/", (request, response) => {

    const getAll = () => {
    MongoClient.connect(
        mongoDB,
        { useNewUrlParser: true, useUnifiedTopology: true },
        function (err, db) {
          if (err) throw err;
          var dbo = db.db("donu");
          var mysort = { date: 1 };
          dbo
            .collection("Forum")
            .find({})
            .sort(mysort)
            .toArray(function (err, result) {
              if (err) throw err;
              // for (let i = 0; i < result.length; i++) {
                  //   const all = result[i];
                  // console.log("\x1b[35m", element.name);
                  // var getAl = all.name
                  // console.log(getAl)
                  const results = result.map((wall) => {
                      return wall;
                    });
                    console.log(results)
  
              const fileName = results;
              // }
              db.close();
              response.render(`home`, {
                fileName: fileName,
              });
            });
        }
      );
    };
    getAll();
    // console.log(ok)
  });

app.post("/newforumpost", (request, response) => {});
app.get("/newpost", (request, response) => {
  response.render(`newpost`);
});
app.post("/postpost", (request, response) => {
    

  const title = request.body.title;
  const comment = request.body.comment;
  const author = request.body.author;
  const uuuid = uuidv4();
  var mongoModle = new Model({
    title: `${title}`,
    authour: author,
    date: longDate,
    comment: `${comment}`,
    replys: ["things", "another thing", "i am also a thing"],
    uuid:uuuid
  });

  MongoClient.connect(
    mongoDB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("donu");
      var myobj = mongoModle;
      dbo.collection("Forum").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("\x1b[36m", "1 document inserted");
        db.close();
      });
    }
  );

  console.log(request.body, title, comment);
  response.json({ title, comment });
});

app.listen(PORT);
console.log("server started on " + PORT);
// const mongoDB = `mongodb+srv://shyaboi:${donus}@cluster0.zqw64.azure.mongodb.net/donu?retryWrites=true&w=majority`;
