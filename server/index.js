const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:['GET','POST'],
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("send_message", (data) => {
      // Emit the entire array of messages to all clients
      io.emit("receive_message", data);
    });

    socket.on("send_likes", (data) => {
        // Emit the entire array of likes to all clients
        io.emit("receive_likes", data);
      });
});

server.listen(3001,()=>{
    console.log("Server is running");
});