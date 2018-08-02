var server=require('http').createServer();
var io=require('socket.io')(server,{
    serverClient:false,
    wsEngine:'ws'
})
const port=8102
server.listen(port,()=>{
    console.log('server listening on port '+port)
});
setInterval(()=>{
    io.emit('你好啊')
},2000)

var SocketIOUtil={};

SocketIOUtil.send=(event,data)=>{
    io.emit(event,data);
}

module.exports=SocketIOUtil;

