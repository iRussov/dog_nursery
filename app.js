import * as dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import router from './routes/index.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
const app = express();

app.use(express.json())

app.use('/api', router);

app.set('view engine', 'ejs');

app.use('/static', express.static(path.resolve(__dirname, 'static')));

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, './node_modules/socket.io/client-dist/socket.io.js'));
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/', async (req, res) => {
    res.render('index');
});

app.get('/dog/:id', async (req, res) => {
    res.render('dog');
});

app.get('/messenger', async (req, res) => {
  res.render('messenger');
});

const ioServer = express();
const ioHttpServer = http.createServer(ioServer);

const io = new Server(ioHttpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const users = {};

io.on('connection', socket => {
  socket.on('new-room', (roomId) => {
    socket.join(roomId);
  });
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});



const start = async () =>{
  try{

    ioHttpServer.listen(3001, () => {
      console.log('Socket.IO server is running on http://localhost:3001');
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch(e){
      console.log(e);
  }
}
start();
