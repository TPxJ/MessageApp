const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
var path = require('path');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set ('view engine', 'hbs');

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  // res.sendFile(join(__dirname, 'index.html'));
  res.render("home");
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg ,room , name) => {
    console.log('message: ' + msg);
    if(room == "" ){
      io.emit('chat message' , name.concat(" : " , msg));
    }
    else{
      io.to(room).emit('chat message' , name.concat(" : " , msg)); 
    }
  });


  socket.on('join room' , (roomid , name) => {
    console.log('join room: ' + roomid);
    socket.join(roomid)
    io.to(roomid).emit('join room' , name , roomid); 
  })
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});