const WebSocket=require('ws')
const http = require('http');

const server = new http.createServer();

const wss = new WebSocket.Server({ server });

var WsUtil={};
WsUtil.send=function(data){
    wss.on('connection',websocket => {
        websocket.send(data);
    })
}

server.listen(8102);

module.exports=WsUtil;