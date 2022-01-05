const pg = require('pg');

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

pool.query(`CREATE TABLE IF NOT EXISTS data (
    uuid text PRIMARY KEY,
    text text NOT NULL,
    time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`, (err, result) => {
    if (err) {console.log(err)}
});

/**
 * Write new Netcat data to database
 * @param {string} uuid
 * @param {string} text
 * @returns {Promise}
 */
 const WriteData = function(uuid, text) {
    return new Promise(function(resolve, reject) {
      pool.query(`INSERT INTO data (uuid, text) VALUES ($1,$2)`, [
        uuid, text
        ], (err, result) => {
        if (err) {reject(err)}
          resolve(result);
      });
    });
}

/**
 * Read Netcat data from database
 * @param {string} uuid
 * @returns {Promise}
 */
const ReadData = function(uuid) {
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT text FROM data WHERE uuid = $1`, [
        uuid
        ], (err, result) => {
        if (err) {reject(err)}
          resolve(result);
      });
    });
}

let get = {
    Data: ReadData
}

let write = {
    Data: WriteData,
}

module.exports = {
    get,
    write
};