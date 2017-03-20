var express = require('express');
var bodyParser= require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var app = express();

var db=null;
MongoClient.connect("mongodb://localhost:27017/todos",function(err,dbconn){
    if(!err){
        console.log("We are connected");
        db=dbconn;
    }
});

app.use(bodyParser.json());

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.get('/api/get-todos',function(req,res){
    console.log("inside get-todos api");
    db.collection('todo',function(err,todosCollection){
        todosCollection.find().toArray(function(err,todos){
            console.log(todos);
            return res.json(todos);
            ///console.log(todos.data);
        });
    });
});

app.post('/api/save-todos',function(req,res){
    console.log("inside save todo");
    db.collection('todo',function(err,todosCollection){
        var todoInsert = {
            'title':req.body.title,
            'content':req.body.content,
            'done':req.body.completed
        }
        todosCollection.insert(todoInsert,{w:1},function(err){
            return res.send();
        });
    });
    return res.send();
});

app.put('/api/remove-todos',function(req,res,next){
    
    
    db.collection('todo',function(err,todoCollection){
        var todoID= req.body.id;
        todoCollection.remove({_id:ObjectId(todoID)},{w:1},function(err){
            return res.send();
        });
    });
    res.send();
});

 app.put('/api/complete-todos',function(req,res,next){
    
    db.collection('todo',function(err,todoCollection){
        var todoID= req.body.id;
        var status = req.body.status;
        todoCollection.update({_id:ObjectId(todoID)},{$set:{done:status}},function(err){
            return res.send();
        });
    });
    res.send();
});

app.listen(3009,function(){
    console.log("Server lisng on port number 3009");
});