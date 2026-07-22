const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('একজন ইউজার কানেক্ট হয়েছে');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // সবার কাছে মেসেজ পাঠিয়ে দাও
    });

    socket.on('disconnect', () => {
        console.log('ইউজার চলে গেছে');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`সার্ভার চলছে পোর্ন: ${PORT}`);
});
