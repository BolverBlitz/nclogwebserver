const pg = require('pg');
const utils = require('../utils')

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

pool.query(`CREATE TABLE IF NOT EXISTS data (
    uuid text PRIMARY KEY,
    text_data text NOT NULL,
    time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`, (err, result) => {
  if (err) { console.log(err) }
});

/**
 * Write new Netcat data to database
 * @param {string} uuid
 * @param {string} text
 * @returns {Promise}
 */
const WriteData = function (uuid, text) {
  return new Promise(function (resolve, reject) {
    pool.query(`INSERT INTO data (uuid, text_data) VALUES ($1,$2)`, [
      uuid, text
    ], (err, result) => {
      if (err) { reject(err) }
      resolve(result);
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
    pool.query(`SELECT text_data FROM data WHERE uuid = $1`, [
      uuid
    ], (err, result) => {
      if (err) { reject(err) }
      resolve(result);
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
    pool.query(`SELECT text_data FROM data WHERE uuid = $1`, [
      uuid
    ], (err, result) => {
      if (err) { reject(err) }
      if (result.rows.length > 0) {
        reject(false);
      } else {
        resolve(uuid);
      }
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