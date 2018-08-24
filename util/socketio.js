var fs=require('fs');
var options = {
    key: fs.readFileSync('bin/ssl/server.key'),  //ssl文件路径
    cert: fs.readFileSync('bin/ssl/server.crt')  //ssl文件路径
};
var httpServer = require('http').createServer();
var server=require('https').createServer(options);

var io=require('socket.io')(server,{
    serverClient:false,
    wsEngine:'ws'
})

var ioHttp=require('socket.io')(httpServer,{
    serverClient:false,
    wsEngine:'ws'
})


const port=8102
const portHttp=8104
server.listen(port,()=>{
    console.log('https server listening on port '+port)
});
httpServer.listen(portHttp,()=>{
    console.log('http server listening on port '+portHttp)
});
/*setInterval(()=>{
    io.emit('你好啊')
},2000)*/



var SocketIOUtil={};

SocketIOUtil.send=(event,data)=>{
    io.emit(event,data);
    ioHttp.emit(event,data);
}

module.exports=SocketIOUtil;

