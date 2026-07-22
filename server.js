const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const mongoose = require('mongoose');

// MongoDB কানেকশন (এখানে পরে তোমার নিজের লিঙ্ক বসাবে)
const mongoURI = "mongodb+srv://admin:admin123@cluster0.mongodb.net/whatsapp?retryWrites=true&w=majority";
mongoose.connect(mongoURI).then(() => console.log("DB Connected")).catch(err => console.log(err));

// মেসেজ স্কিমা (ডাটাবেসে কি কি সেভ হবে)
const msgSchema = new mongoose.Schema({
    user: String,
    message: String,
    time: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', msgSchema);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', async (socket) => {
    // পুরনো সব মেসেজ ডাটাবেস থেকে লোড করে ইউজারকে পাঠানো
    const oldMessages = await Message.find().sort({ time: 1 });
    socket.emit('load messages', oldMessages);

    socket.on('chat message', async (data) => {
        const newMessage = new Message({ user: data.user, message: data.message });
        await newMessage.save(); // মেসেজ সেভ করা
        io.emit('chat message', data); // সবার কাছে পাঠানো
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
