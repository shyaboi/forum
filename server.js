const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const donus = process.env.MONGO_THING;
const exphbs = require("express-handlebars");
const helpers = require("handlebars-helpers")();
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
// const NewPost = require("./models/models")
const mongoDB = `mongodb+srv://shyaboi:${donus}@cluster0.zqw64.azure.mongodb.net/donu?retryWrites=true&w=majority`;
const mongoose = require("mongoose");
const { json } = require("body-parser");
const db = mongoose.connection;
const { v4: uuidv4 } = require("uuid");
const { ok } = require("assert");
const Request = require("request");
// Define a custom namespace.  Readers, create your own using something like

const Schema = mongoose.Schema;

app.use(express.static("public/views/layouts"));

app.use(express.static(__dirname + "/public"));
var NewPost = new Schema({
  title: String,
  avatar: String,
  authour: String,
  dateUp:String,
  date: String,
  comment: String,
  replys: Array,
  uuid: String,
  opID: String,
  ip: String,
  flag:String,
  region:String,
  city:String
});


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
var moment = require("moment"); // require










    













app.get("/forum", (request, response) => {
 
  const ipp = request.header("x-forwarded-for") || request.connection.remoteAddress;
  const ip = ipp.slice(7);
  console.log("ip1:" + ip);
  const getAll = () => {
    MongoClient.connect(
      mongoDB,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("donu");
        var mysort = {dateUp:-1}
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

  console.log(keyParam);
  MongoClient.connect(
    mongoDB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("donu");
      var mysort = { date: 1 };
      dbo
        .collection("Forum")
        .find({ uuid: keyParam })
        .sort(mysort)
        .toArray(function (err, result) {
          if (err) throw err;
          const results = result.map((post) => {
            return post;
          });
          const postData = results[0];
          // const postReply = results[0].replys

          // console.log(postData)

          response.render(`post`, {
            postData: postData,
          });
        });
    }
  );
});

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
          .find({
            replys: {
              $elemMatch: { uuuid: "0372d7e9-a6d0-4de2-b0e3-b0e517a142e4" },
            },
          })
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
              all: all,
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

let bod
let region
let flag
let city
app.get(`/regionBoard`, (req, response) => {

  const ipp = req.header("x-forwarded-for") || req.connection.remoteAddress;
  const ip = ipp.slice(7);
  console.log("ip1:" + ip);

  Request.get(`http://ipwhois.app/json/${ip}`, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.log(JSON.parse(body));
  bod = JSON.parse(body);
  flag = bod.country_flag;
  region = bod.region
  city = bod.city
  console.log(bod.country_flag,bod.region)
  });
  const getAll = () => {
    MongoClient.connect(
      mongoDB,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("donu");
        var mysort = {dateUp:-1}
        dbo
          .collection("RegionBoard")
          .find({})
          .sort(mysort)
          .toArray(function (err, result) {
            if (err) throw err;
            const results = result.map((wall) => {
              return wall;
            });
            const fileName = results;
        
            db.close();

         

            response.render(`regionBoard`, {
              fileName: fileName,
              bod:bod
            });
          });
      }
    );
  };
  getAll();
  // console.log(ok)
  

   
    })

app.post("/postpost", (request, response) => {
  const ipp =  request.header("x-forwarded-for") || request.connection.remoteAddress;
  const ip = ipp.slice(7)
  
  const title = request.body.title;
  const comment = request.body.comment;
  const author = request.body.author;
  const uuuid = uuidv4();
  const avatar = request.body.avatar;
  const longDate = moment().format();
  const mongoModle = new Model({
    title: `${title}`,
    avatar:avatar||"https://placekitten.com/96/139",
    authour: author,
    date: longDate,
    dateUp:longDate,
    comment: `${comment}`,
    replys: [],
    uuid: uuuid,
    ip: ip,
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

app.post("/newRegionPost", (request, response) => {
  const ipp =  request.header("x-forwarded-for") || request.connection.remoteAddress;
  const ip = ipp.slice(7)
  Request.get(`http://ipwhois.app/json/${ip}`, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.log(JSON.parse(body));
  bod = JSON.parse(body);
  // console.log(bod.country_flag,bod.region)
  flag = bod.country_flag;
  region = bod.region;
  });

  const title = request.body.title;
  const comment = request.body.comment;
  const author = request.body.author;
  const uuuid = uuidv4();
  const avatar = request.body.avatar;
  const longDate = moment().format();
  const mongoModle = new Model({
    title: `${title}`,
    avatar:avatar||"https://placekitten.com/96/139",
    authour: author,
    date: longDate,
    dateUp:longDate,
    comment: `${comment}`,
    replys: [],
    uuid: uuuid,
    ip: ip,
    flag:flag,
    region:region,
    city:city
  });
  MongoClient.connect(
    mongoDB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("donu");
      var myobj = mongoModle;
      dbo.collection("RegionBoard").insertOne(myobj, function (err, res) {
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




app.post("/replypost", (response, request) => {
  const ipp =  response.header("x-forwarded-for") || response.connection.remoteAddress;
  console.log(ipp)

  const ip = ipp.slice(7)
  console.log(response.body);
  let keyParam = response.body.opID;
  // const uuid = response.body.uuid
  const avatar = response.body.avatar;

  const longDate = moment().format();
  MongoClient.connect(
    mongoDB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("donu");
      var mysort = { date: 1 };
      dbo.collection("Forum").updateOne(
        { uuid: keyParam },
        {
          $push: {
            replys: {
              author: response.body.authorr,
              avatar: avatar || "https://placekitten.com/96/139",
              comment: response.body.commentr,
              opID: keyParam,
              uuuid: uuidv4(),
              date: longDate,
              replis: [],
              ip:ip
            },
          },
          $set:{dateUp:longDate}
        }
      );
      console.log("comment added to: " + keyParam);
    }
  );
  setTimeout(() => {
    request.redirect(`/post${keyParam}`);
  }, 300);
});


app.post("/replyreplypost", (response, request) => {
  const ipp =  response.header("x-forwarded-for") || response.connection.remoteAddress;
  console.log(ipp)
  const ip = ipp.slice(7)
  const longDate = moment().format();
  const don = response.body.uuuid.split("+");
  const donus = don[0];
  const danus = don[1];
  console.log(danus);
  let keyParam = response.body.uuuid;

  const avatar = response.body.avatar
  MongoClient.connect(
    mongoDB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("donu");
      var mysort = { date: 1 };
      dbo.collection("Forum").updateOne(
        { replys: { $elemMatch: { uuuid: donus } } },
        {
          $push: {
            "replys.$.replis": {
              author: response.body.authorr,
              avatar: avatar || "https://placekitten.com/96/139",
              comment: response.body.commentr,
              opID: donus,
              oppID: danus,
              uuuuid: uuidv4(),
              date: longDate,
              ip:ip
            },
          },
          $set:{dateUp:longDate}
        }
      );
    }
  );
  setTimeout(() => {
    request.redirect(`/post${danus}`);
  }, 300);
});
const net = require('net');
const server = net.createServer((socket) => {
  socket.end('goodbye\n');
}).on('error', (err) => {
  // Handle errors here.
  throw err;
});

// Grab an arbitrary unused port.


require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})

app.listen(PORT);
console.log("server started on " + PORT);
// const mongoDB = `mongodb+srv://shyaboi:${donus}@cluster0.zqw64.azure.mongodb.net/donu?retryWrites=true&w=majority`;
