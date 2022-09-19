// for make server connection to io server
const socket = io();

// Get DOM elements in respective Js variables
const form = document.getElementById('sendcontainer');
const messageInput= document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// for displaying the message
const append = (message,position)=>{
    const messageElement = document.createElement('div')
    messageElement.innerHTML = message;
    messageElement.classList.add(position);
    messageElement.classList.add('message');
    messageContainer.append(messageElement);

}

// take prompt input for user name
const name = prompt("Enter your name:");
socket.emit('new-user-joined',name);

//audio section
var audiocg = new Audio("public/coming_outgoing.mp3");
var send = new Audio('public/Message_sent.mp3');
var receive = new Audio('public/Message_receive.mp3');

// console.log(audiocg)
//if form gets submitted, send server the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`<b>You</b>: ${message}`,'right');
    socket.emit('send',message);
    send.play();
    messageInput.value='';
})

//if server sends user-joined then append the info of the container
socket.on('user-joined',(name)=>{
    append(`<b>${name}</b> joined the chat`,'left')
    audiocg.play();
})

//If server sends a message,receive it
socket.on('receive',data=>{
    append(`<b>${data.name}</b>:  ${data.message}`,'left')
    receive.play()
})

//if server sends a  leave event then append the info of the container with leaving user name
socket.on('leave',name=>{
    append(`<b>${name}</b> is left the chat`,'left')
    audiocg.play()
})