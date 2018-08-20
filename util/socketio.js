var fs=require('fs');
var options = {
    key: fs.readFileSync('bin/ssl/server.key'),  //ssl文件路径
    cert: fs.readFileSync('bin/ssl/server.crt')  //ssl文件路径
};
var server=require('https').createServer(options);
var io=require('socket.io')(server,{
    serverClient:false,
    wsEngine:'ws'
})
const port=8102
server.listen(port,()=>{
    console.log('server listening on port '+port)
});
/*setInterval(()=>{
    io.emit('你好啊')
},2000)*/



var SocketIOUtil={};

SocketIOUtil.send=(event,data)=>{
    io.emit(event,data);
}

module.exports=SocketIOUtil;

