const sock = require("socket.io")
let io = sock.listen(8000);
let roomCollect = {}


//You can change these variables based on your preferences
let tickRate = 12;
let maxRooms = 1



io.on('connection',(socket)=>{

    console.log(`Received connection from ${socket.id}`)
    socket.cRoom = socket.id


    socket.on('ROOM_JOIN',(room)=>{
        socket.leave(socket.cRoom)
        socket.join(room)
        socket.cRoom = room;

        if(!roomCollect[socket.cRoom]){
            roomCollect[socket.cRoom] = {}
        }

        socket.to(socket.cRoom).emit('PEER_JOIN',socket.id)

        io.to(socket.cRoom).emit('ROOM_STATUS',io.sockets.adapter.rooms[socket.cRoom])
    })
    socket.on('ROOM_LEAVE',()=>{
        socket.to(socket.cRoom).emit('PEER_LEAVE',socket.id)
        socket.leave(socket.cRoom)
        io.to(socket.cRoom).emit('ROOM_STATUS',io.sockets.adapter.rooms[socket.cRoom])
    })

    socket.on(`disconnect`,()=>{
        socket.to(socket.cRoom).emit('PEER_LEAVE',socket.id)
        socket.leave(socket.cRoom)
        io.to(socket.cRoom).emit('ROOM_STATUS',io.sockets.adapter.rooms[socket.cRoom])
    })

    socket.on('INFO_PACKET',(data)=>{
        roomCollect[socket.cRoom][socket.id] = data
    })


    socket.on('PEER_MESSAGE',(data)=>{
        socket.to(socket.cRoom).emit('PEER_MESSAGE',data)
    })
})


setInterval(()=>{
    Object.entries(roomCollect).forEach(e=>{
        io.to(e[0]).emit('ROOM_UPDATE',roomCollect[e[0]])
        roomCollect[e[0]]={}
    })
},1000/tickRate)