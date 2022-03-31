const fs = require("fs");
const utils = require("../utils");
const dir = "./db_store";

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

/**
 * Write new Netcat data to database
 * @param {string} uuid
 * @param {string} text
 * @returns {Promise}
 */
const WriteData = function (uuid, text) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(`${dir}/${uuid}.txt`, text, (err) => {
            if (err) { reject(err) }
            resolve(true);
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
        fs.exists(`${dir}/${uuid}.txt`, (exists) => {
            if (exists) {
                
                fs.readFile(`${dir}/${uuid}.txt`, "utf8", (err, data) => {
                    if (err) { reject(err) }
                    resolve({rows: [{text_data: data}]});
                });
            } else {
                resolve({rows: []});
            }
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
        fs.exists(`${dir}/${uuid}.txt`, (exists) => {
            if (exists) {
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