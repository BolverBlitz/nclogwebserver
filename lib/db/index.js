if (process.env.DB_Driver === "pgsql") {
    const db = require('./pgsql_driver');
    module.exports = {
        get: db.get,
        write: db.write
    };
} else if (process.env.DB_Driver === "mysql") {
    const db = require('./mysql_driver');
    module.exports = {
        get: db.get,
        write: db.write
    };
} else if (process.env.DB_Driver === "files") {
    const db = require('./fs_driver');
    module.exports = {
        get: db.get,
        write: db.write
    };
} else {
    logger('error', `Only PostgreSQL and MySQL are supported`);
    process.exit(1);
}