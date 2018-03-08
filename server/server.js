const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT||3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New User Connected');
    
    socket.on('createMessage',(message)=>{
       console.log('Got new message from client ',message);
       io.emit('newMessage',{
           from:message.from,
           text:message.text,
           createdAt:new Date().getTime()
       })
    })
    socket.on('disconnect',()=>{
        console.log('Client disconnected');
    });
});
server.listen(port,()=>{
    console.log(`app started on port ${port}`);
})