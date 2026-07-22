var socket = io();
var form = document.getElementById('form');
var input = document.getElementById('input');
var messages = document.getElementById('messages');

// ইউজার নেম সেট করা
var userName = prompt("আপনার নাম লিখুন:") || "Anonymous";

// পুরনো মেসেজ লোড করা
socket.on('load messages', function(docs) {
    docs.forEach(doc => {
        displayMessage(doc);
    });
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        var data = { user: userName, message: input.value };
        socket.emit('chat message', data);
        input.value = '';
    }
});

socket.on('chat message', function(data) {
    displayMessage(data);
    messages.scrollTop = messages.scrollHeight;
});

function displayMessage(data) {
    var item = document.createElement('li');
    item.classList.add('message');
    
    // মেসেজটি কি আমার নাকি অন্যের তা চেক করা
    if (data.user === userName) {
        item.classList.add('my-msg');
    } else {
        item.classList.add('other-msg');
    }

    item.innerHTML = `<span class="user-name">${data.user}</span>${data.message}`;
    messages.appendChild(item);
                    }
