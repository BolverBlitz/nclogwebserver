const NetcatServer = require('netcat/server')
const nc = new NetcatServer()
const { logger } = require('../lib/logger');
const db = require('../lib/db');

let server = nc.addr(process.env.localIP || "0.0.0.0")
    .port(Number(process.env.NCPort) || 5555)
    .k(true)
    .listen()
    .on('data', function (socket, data) {
        db.get.uuid(5).then(uuid => {
            db.write.Data(uuid, data.toString().trim().replace("\n", "")).then(result => {
                logger('info', `New log was saved with uuid: ${uuid}`);
                socket.write(Buffer.from(`${process.env.WebURL}/fetch/${uuid}\n`));
                socket.destroy()
            }).catch(err => {
                logger('error', `Error in Netcat: ${err}`)
                socket.write(Buffer.from('Error on saving your Request\n'))
                socket.destroy()
            });
        }).catch(err => {
            logger('error', `Error in Netcat: ${err}`)
            socket.write(Buffer.from('Error in generating your uuid\n'))
            socket.destroy()
        })
    })

logger('system', `Netcat server started on ${process.env.localIP || '0.0.0.0'}:${process.env.NCPort || 5555}`);