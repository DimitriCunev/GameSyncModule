
sync.on('log',(data)=>{
    console.log(data)
})

sync.on('peer_join',(data)=>{
    console.log(`${data} joined`)
})

sync.on('peer_leave',(data)=>{
    console.log(`${data} left`)
})

sync.connect('localhost',8000)
sync.join('test')