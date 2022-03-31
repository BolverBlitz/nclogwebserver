const mysql = require("mysql");
const utils = require('../utils');

const db = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8mb4"
});

db.getConnection(function (err, connection) {
    connection.query(`CREATE TABLE IF NOT EXISTS data (uuid varchar(32) PRIMARY KEY,text_data MEDIUMTEXT,time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);`, function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        connection.release();
    });
});



/**
 * Write new Netcat data to database
 * @param {string} uuid
 * @param {string} text
 * @returns {Promise}
 */
const WriteData = function (uuid, text) {
    return new Promise(function (resolve, reject) {
        db.getConnection(function (err, connection) {
            connection.query(`INSERT INTO data (uuid, text_data) VALUES ?`, [[
                [uuid, text]
            ]], function (err, rows, fields) {
                connection.release();
                if (err) { reject(err) }
                resolve(rows);
            });
        });
    });
}

/**
 * Read Netcat data from database
 * @param {string} uuid
 * @returns {Promise}
 */
const ReadData = function (uuid) {
    return new Promise(function (resolve, reject) {
        db.getConnection(function (err, connection) {
            connection.query(`SELECT text_data FROM data WHERE uuid = ?`, [[
                [uuid]
            ]], function (err, rows, fields) {
                connection.release();
                if (err) { reject(err) }
                resolve({ rows: rows });
            });
        });
    });
}

/**
 * This function will try to get a unique uuid
 * @param {number} uuid - The uuid of the task
 * @returns {Promise}
 */
const CheckIfUUIDExists = function (uuid) {
    return new Promise(function (resolve, reject) {
        db.getConnection(function (err, connection) {
            connection.query(`SELECT text_data FROM data WHERE uuid = ?`, [[
                [uuid]
            ]], function (err, rows, fields) {
                connection.release();
                if (err) { reject(err) }
                if (rows.length > 0) {
                    reject(false);
                } else {
                    resolve(uuid);
                }
            });
        });
    });
}

/**
 * Will wait for a unique uuid
 * @param {number} tries 
 * @returns 
 */
const awaitUUID = function (tries) {
    return new Promise(function cb(resolve, reject) {
        const uuid = utils.RandomString()
        if (--tries > 0) {
            CheckIfUUIDExists(uuid).then(function (result) {
                resolve(result);
            }).catch(function (err) {
                if (err === false) {
                    cb(resolve, reject);
                } else {
                    reject("DB Error");
                }
            });
        } else {
            reject("Timeout");
        }
    });
}

let get = {
    Data: ReadData,
    uuid: awaitUUID
}

let write = {
    Data: WriteData,
}

module.exports = {
    get,
    write
};