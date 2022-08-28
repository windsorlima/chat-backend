import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { getMessagesRoom, Message, messages, rooms, users } from './chat'

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const allowedOrigins = ['http://localhost:5173'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options))

app.get('/', (request, response) => {
  response.send("Hello world")
})

app.get('/rooms', (request, response) => {
  response.json(rooms)
})

io.on('connection', (socket) => {
  
  socket.on("select_room", (data, callback) => {
    socket.join(data.room);

    const userInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {
      userInRoom.socket_id = socket.id;
    } else {
      users.push({
        room: data.room,
        username: data.username,
        socket_id: socket.id,
      });
    }

    const messagesRoom = getMessagesRoom(data.room);

    callback(messagesRoom);
  });

  socket.on("message", ({ room, text, username }) => {
    const message: Message = {
      room,
      text,
      username,
      createdAt: new Date(),
    };

    messages.push(message);

    io.to(room).emit("message", message);
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log('listening on *:3000')
})