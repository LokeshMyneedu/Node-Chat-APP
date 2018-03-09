const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage,generateLocationMessage}=require('./util/message');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT||3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New User Connected');
     
    //from admin welocome to the chat app
    socket.emit('newMessage',generateMessage('Admin','Welcome to chat App'));

    //from admin saying new user joined
    socket.broadcast.emit('newMessage',generateMessage('Admin','New user Joined')) ;
    socket.on('createMessage',(message,callback)=>{
       console.log('Got new message from client ',message);
       io.emit('newMessage',generateMessage(message.from,message.text)); // broadcast to all users including the user who submitted the event toooooooooooooooooo
    callback();
       // socket.broadcast.emit('newMessage',{
    //     from:message.from,
    //     text:message.text,
    //     createdAt:new Date().getTime()
    // })//broadcast to all except sender
    });

    socket.on('createLocation',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));     
     });
 socket.on('disconnect',()=>{
        console.log('Client disconnected');
    });
});
server.listen(port,()=>{
    console.log(`app started on port ${port}`);
})