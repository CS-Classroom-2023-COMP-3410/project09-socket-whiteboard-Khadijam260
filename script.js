const socket = io('http://localhost:3000', {
    transports: ['websocket'],
    withCredentials: true
});


socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
});

socket.on('connect_error', (err) => console.error('❌ Connection error:', err.message));

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let lastX = null;
let lastY = null;

function startDrawing(e) {
    drawing = true;
    lastX = e.clientX;
    lastY = e.clientY;
}

// ✅ Stop drawing
function endDrawing() {
    drawing = false;
    lastX = null;
    lastY = null;
}

// ✅ Draw and send data
function draw(e) {
    if (!drawing) return;

    const x = e.clientX;
    const y = e.clientY;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Send full stroke data
    socket.emit('draw', { lastX, lastY, x, y });

    lastX = x;
    lastY = y;
}


// ✅ Handle board loading for new users
socket.on('load-board', (boardState) => {
    boardState.forEach((data) => {
        ctx.beginPath();
        ctx.moveTo(data.lastX, data.lastY);
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
    });
});

// ✅ Handle incoming drawing events
socket.on('draw', (data) => {
    ctx.beginPath();
    ctx.moveTo(data.lastX, data.lastY);
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
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
