if(process.env.DB_Driver === "pgsql"){
    const db = require('./pgsql_driver');
    module.exports = {
        db
    };
}else if(process.env.DB_Driver === "mysql"){

}else{
    logger('error',`Only PostgreSQL and MySQL are supported`);
    process.exit(1);
}