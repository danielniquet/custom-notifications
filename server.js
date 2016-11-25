var fs = require('fs');
var app = require("express")();
var bodyParser = require('body-parser');
// var https = require('https');
// var options = {
//    key  : fs.readFileSync('server.key'),
//    cert : fs.readFileSync('server.crt')
// };
var http = require('http').Server(app);
// http=https.createServer(options, app) 

var io = require("socket.io")(http);


app.use(require("express").static('data'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get("/",function(req,res){
    res.sendFile(__dirname + '/index.html');
});
app.get("/admin",function(req,res){
    res.sendFile(__dirname + '/data/admin.html');
});
app.get("/sample",function(req,res){
    res.sendFile(__dirname + '/data/sample/index.html');
});


// creating array of users.
var users=[];

// This is auto initiated event when Client connects to Your Machien.  
io.on('connection',function(socket){  
    
    //Storing users into array as an object
    socket.on('user name',function(user_name, is_admin){
      if(!is_admin){
        users.push({id:socket.id,date:user_name});
        len=users.length;
        len--;
      }
      //Sending th user Id and List of users
      io.emit('user entrance',users,(is_admin)?0:users[len].id); 
    });

    //Sending message to Specific user
    socket.on('send msg',function(data_server){
      socket.broadcast.to(data_server.id).emit('get msg',{msg:data_server.msg,id:data_server.id,date:data_server.date});
    });

    //Removig user when user left the chatroom
    socket.on('disconnect',function(){
      for(var i=0;i<users.length;i++){
        if(users[i].id==socket.id){
          users.splice(i,1); //Removing single user
        }
      }
      io.emit('exit',users); //sending list of users
    });
});


var port = process.env.PORT || 3000;

http.listen(port,function(){
    console.log("Listening on "+port);
});
