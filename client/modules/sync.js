let sync = {
    status:false,
    client:undefined,
    accepted:false,
    tickRate:12,
    events:{
        log:(data)=>{},

        connect:()=>{},
        join:()=>{},
        room_status:(data)=>{},
        room_update:(data)=>{},

        
        peer_join:()=>{},
        peer_leave:()=>{},
        peer_update:()=>{},
        peer_message:(data)=>{},
        
    },
    shareData:undefined
}

sync.connect = (ip,port)=>{
    sync.client = io.connect(`http://${ip}:${port}`)
    sync.events.log(`Trying to connect to ${ip}:${port}`)


    sync.client.on('connect',()=>{
        sync.status = 200;
        sync.events.log(`200: Sync connected.`)
        sync.events.connect()
        
    })

    sync.client.on('PEER_JOIN',(data)=>{
        sync.events.peer_join(data)
    })
    sync.client.on('PEER_LEAVE',(data)=>{
        sync.events.peer_leave(data)
    })

    sync.client.on('ROOM_STATUS',(data)=>{
        sync.events.room_status(data)
    })

    sync.client.on('ROOM_UPDATE',(data)=>{
        sync.events.room_update(data)
    })
    sync.client.on('PEER_MESSAGE',(data)=>{
        sync.events.peer_message(data)
    })
}

sync.join = (room)=>{
    sync.client.emit('ROOM_JOIN',room)
}
sync.leave = ()=>{
    sync.client.emit('ROOM_LEAVE','')
}

sync.send = (protocol,data)=>{
    sync.client.emit('PEER_MESSAGE',{proto:protocol,data:data})
}

sync['on'] = (event,func)=>{
    sync.events[event] = func;
}

setInterval(()=>{
    if(sync.shareData){
        sync.client.emit('INFO_PACKET',sync.shareData)
    }
},1000/sync.tickRate)

