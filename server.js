const express = require("express");
const app = express();

app.use("/public",express.static(__dirname+"/public"));


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

const PORT = process.env.PORT || 3000;

// node server which will handle socket to connection
// for make server connection to io server
const io = require('socket.io')(app.listen(PORT,(res,req)=>{
    console.log(`server is runnig at ${PORT}`);   
}));

const users ={}; 
io.on('connection',socket =>{
    // if any new user joins, let other connected to the the server know!
    socket.on('new-user-joined',(name)=>{
        // console.log("new user",name)
        users[socket.id]=name;
        // broadcast to other user that new user joined
        socket.broadcast.emit('user-joined',name)
    });
    
    // if someone sends a message, broadcast it to other people
    socket.on('send',(message)=>{
        socket.broadcast.emit('receive',{message: message, name:users[socket.id]})
    });

    //if someone leaves the chat, let the others know
    socket.on('disconnect',(message)=>{
        socket.broadcast.emit('leave',users[socket.id]);
        delete users[socket.id];
    });
});


