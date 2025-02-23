import { io } from 'socket.io-client';

// const socket = io('http://localhost:3000', {
//     transports: ['websocket'],
//     withCredentials: true
// });

const socket = io('http://172.17.0.2:3000', {
    transports: ['websocket'], 
    withCredentials: true
});

socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
});

socket.on('connect_error', (err) => console.error('❌ Connection error:', err.message));

socket.on('draw', (data) => {
    console.log('Received draw data:', data);
});

socket.on('clear', () => {
    console.log('Board cleared');
});

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;

function startDrawing(e) {
    drawing = true;
    draw(e);
}

function endDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;
    const x = e.clientX;
    const y = e.clientY;
    
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    socket.emit('draw', { x, y });
}

// Listen for incoming drawing events
socket.on('draw', (data) => {
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
});

// Clear board functionality
document.getElementById('clear').addEventListener('click', () => {
    socket.emit('clear');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

socket.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Attach event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mousemove', draw);
