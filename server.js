const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Allow frontend connections
        methods: ["GET", "POST"]
    },
    allowEIO3: true  // Fixes WebSocket handshake issues
});

// 🛠️ Enable CORS for all Express routes
app.use(cors());

// ✅ Serve a simple response for debugging
app.get('/', (req, res) => {
    res.send('🎨 Socket.IO Whiteboard Server is running!');
});

let boardState = []; // Store drawn lines

io.on('connection', (socket) => {
    console.log(`🟢 New user connected: ${socket.id}`);

    // Send existing board state to new clients
    socket.emit('load-board', boardState);

    socket.on('draw', (data) => {
        boardState.push(data);
        socket.broadcast.emit('draw', data);
    });

    socket.on('clear', () => {
        boardState = [];
        io.emit('clear');
    });

    socket.on('disconnect', () => {
        console.log(`🔴 User disconnected: ${socket.id}`);
    });
});

server.listen(3000, '0.0.0.0', () => {
    console.log('🚀 Server running on http://0.0.0.0:3000');
});
