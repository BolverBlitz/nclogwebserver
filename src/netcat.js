const NetcatServer = require('netcat/server')
const nc = new NetcatServer()

let server = nc.addr('192.168.0.80')
    .port(6666)
    .k(true)
    .listen()
    .on('data', function (socket, data) {
        socket.write(Buffer.from('Arschloch\n'))
        console.log(data.toString().trim().replace("\n",""))
        socket.destroy()
    })