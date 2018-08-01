const WebSocket=require('ws')
const http = require('http');

const server = new http.createServer();

const wss = new WebSocket.Server({ server });

setInterval(()=>{
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(2);
        }
    });
},2000)

var WsUtil={};
WsUtil.send=function(data){
    console.log('发送'+data);
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

server.listen(8102,'192.168.1.106',()=>{
    console.log('server running at');
});

module.exports=WsUtil;