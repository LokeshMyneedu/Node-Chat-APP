const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage,generateLocationMessage}=require('./util/message');
const {isRealString}= require('./util/validation');
const {Users}= require('./util/users');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT||3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New User Connected');

    socket.on('join',(params,callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and room name are required') 
    }
    socket.join(params.room);
    users.removeUser(socket.id);//remove from all other rooms
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUserList',users.getUserList(params.room));
    //socket.leave('')    
       //from admin welocome to the chat app       
    socket.emit('newMessage',generateMessage('Admin','Welcome to chat App'));
       //from admin saying new user joined
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} Joined`));
    callback();
    });

    //message event
    socket.on('createMessage',(message,callback)=>{
        let user =users.getUser(socket.id);
        if(user&&isRealString(message.text)){
            io.to(user.room).emit('newMessage',generateMessage(user.name,message.text)); // broadcast to all users including the user who submitted the event toooooooooooooooooo
        }       
      
    callback();
       // socket.broadcast.emit('newMessage',{
    //     from:message.from,
    //     text:message.text,
    //     createdAt:new Date().getTime()
    // })//broadcast to all except sender
    });

    //location event
    socket.on('createLocation',(coords)=>{
        let user =users.getUser(socket.id);
        if(user){
        io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));     
     }
    });
  
     //disconnect event
     socket.on('disconnect',()=>{
        let user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
        }
    });
});

//listening port of server
server.listen(port,()=>{
    console.log(`app started on port ${port}`);
})