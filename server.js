var fs = require("fs");
var path = require("path");
var express = require("express");
var app = express();
var router = express.Router();
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const donus = process.env.MONGO_THING;
var exphbs = require("express-handlebars");
var helpers = require('handlebars-helpers')();
var bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
// const NewPost = require("./models/models")
const mongoDB = `mongodb+srv://shyaboi:${donus}@cluster0.zqw64.azure.mongodb.net/donu?retryWrites=true&w=majority`;
var mongoose = require("mongoose");
const { json } = require("body-parser");
var db = mongoose.connection;
const { v4: uuidv4 } = require('uuid');
const { ok } = require("assert");
 
// Define a custom namespace.  Readers, create your own using something like

var Schema = mongoose.Schema;


app.use(express.static("public/views/layouts"));

app.use(express.static(__dirname + "/public"));
var NewPost = new Schema({
  title: String,
  authour: String,
  date: String,
  comment: String,
  replys: Array,
  uuid:String,
  opID:String,
  ip:String
});



// -----------------------------------------------------date constructor


// console.log(longDate);


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
var moment = require('moment'); // require

app.get("/forum", (request, response) => {
 console.log(typeof(longDate))

const ip = request.header('x-forwarded-for') || request.connection.remoteAddress;
const ip2 = request.headers['x-forwarded-for'] || 
request.connection.remoteAddress || 
request.socket.remoteAddress ||
(request.connection.socket ? request.connection.socket.remoteAddress : null);
console.log("ip1:"+ip)
console.log("ip2:"+ip2)
    const getAll = () => {
    MongoClient.connect(
        mongoDB,
        { useNewUrlParser: true, useUnifiedTopology: true },
        function (err, db) {
          if (err) throw err;
          var dbo = db.db("donu");
          var mysort = { date: -1 };
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
                    const fileName = results;
                    // for (let i = 0; i < fileName.length; i++) {
                    //   const element = JSON.stringify(fileName[i].comment);
                    //   console.log(element)
                    // }
                    
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

  

  app.get("/post:postid?", (request, response) => {
    
    // console.log(request.query.name)
    let keyParam = request.params.postid;

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
            // const postReply = results[0].replys

     
                
                // console.log(postData)
    
           
                response.render(`post`, {
                    postData: postData,
                  });
  });
  })
})

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
            .find(
              {replys:{$elemMatch:{uuuid:"0372d7e9-a6d0-4de2-b0e3-b0e517a142e4"}}}
              )
            .sort(mysort)
            .toArray(function (err, result) {
              if (err) throw err;
              for (let i = 0; i < result.length; i++) {
                    var all = result[i];
                  console.log("\x1b[35m", all.replys);
              }
                  // const results = result.map((wall) => {
                  //   return wall;
                  // });
                  // console.log(wall)
                  
              const fileName = result;
              // }
              db.close();
              response.render(`home`, {
                fileName: fileName,
                all:all,
              });
            });
        }
      );
    };
    getAll();
    // console.log(ok)
  });

app.get("/newpost", (request, response) => {
  response.render(`newpost`);
});
app.post("/postpost", (request, response) => {

  const longDate = moment().format()
  let ip = request.header('x-forwarded-for') || request.connection.remoteAddress;

  const title = request.body.title;
  const comment = request.body.comment;
  const author = request.body.author;
  const uuuid = uuidv4();
  console.log(longDate)
  const mongoModle = new Model({
    title: `${title}`,
    authour: author,
    date: longDate,
    comment: `${comment}`,
    replys: [],
    uuid:uuuid,
    ip:ip
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
setTimeout(() => {
    response.redirect(`/post${uuuid}`);
    
}, 300);
});




app.post("/replypost", (response,request)=> {   
     console.log(response.body)
    let keyParam = response.body.opID;
    // const uuid = response.body.uuid
 
    const longDate = moment().format()
    MongoClient.connect(
      mongoDB,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("donu");
        var mysort = { date: 1 };
        dbo
          .collection("Forum")
          .update({uuid:keyParam}, { $push: { replys: 
            {   author:response.body.authorr,
                comment:response.body.commentr,
                opID:keyParam,
                uuuid:uuidv4(),
                date:longDate,
                replis:[]
                } }})
          console.log("comment added to: " + keyParam)
        //   .sort(mysort)
        //   .toArray(function (err, result) {
        //     if (err) throw err;
        //     const results = result.map((post) => {
        //       return post;
        //     });
        //     const postData = results[0]
        //     // const postReply = results[0].replys

     
                
        //         console.log(postData)
    
           
        //   });
    })
    setTimeout(() => {
        request.redirect(`/post${keyParam}`);
        
    }, 300);  
})


app.post("/replyreplypost", (response,request)=> { 
 
  const longDate = moment().format()
  const don = response.body.uuuid.split("+")  ;
  const donus = don[0]; 
  const danus = don[1];
     console.log(danus)
    let keyParam = response.body.uuuid;

// console.log(keyParam)
    MongoClient.connect(
      mongoDB,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("donu");
        var mysort = { date: 1 };
        dbo
          .collection("Forum")
          .updateOne({replys:{$elemMatch:{uuuid:donus}}}, { $push: { "replys.$.replis": 
            {   
                  author:response.body.authorr,
                  comment:response.body.commentr,
                  opID:donus,
                  oppID:danus,
                  uuuuid:uuidv4(),
                  date:longDate,
                } }})
          // console.log("comment added to: " + keyParam)
        //   .sort(mysort)
        //   .toArray(function (err, result) {
        //     if (err) throw err;
        //     const results = result.map((post) => {
        //       return post;
        //     });
        //     const postData = results[0]
        //     // const postReply = results[0].replys

     
                
        //         console.log(postData)
    
           
        //   });
    })
    setTimeout(() => {
        request.redirect(`/post${danus}`);
        
    }, 300);  
})






app.listen(PORT);
console.log("server started on " + PORT);
// const mongoDB = `mongodb+srv://shyaboi:${donus}@cluster0.zqw64.azure.mongodb.net/donu?retryWrites=true&w=majority`;
