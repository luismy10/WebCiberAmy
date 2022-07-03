const mysql = require('mysql');

class Conexion {

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.HOST_DB,
            user: process.env.USER_DB,
            port: process.env.PORT_DB,
            password: process.env.PASSWORD_DB,
            database: process.env.DATABASE_DB
        });
    }

    query(slq, param = []) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) return reject(err.sqlMessage);
                connection.query(slq, param, (err, result) => {
                    if (err) return reject(err.sqlMessage);
                    connection.release();
                    return resolve(result);
                });
            });
        });
    }

    beginTransaction() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    return reject(err.sqlMessage);
                }

                connection.beginTransaction(function (err) {
                    if (err) {
                        return reject(err.sqlMessage);
                    }

                    return resolve(connection)
                });
            });
        });
    }

    execute(connection, slq, param = []) {
        return new Promise((resolve, reject) => {
            connection.query(slq, param, (err, result) => {
                if (err) return reject(err.sqlMessage);
                return resolve(result);
            });
        });
    }

    commit(connection) {
        return new Promise((resolve, reject) => {
            connection.commit((err) => {
                if (err) {
                    return connection.rollback((err) => {
                        reject(err.sqlMessage);
                    });
                };

                connection.release();
                return resolve();
            });
        });
    }

    rollback(connection) {
        return new Promise((resolve, reject) => {
            connection.rollback((err) => {
                if (err) {
                    return reject(err.sqlMessage);
                }

                connection.release();
                return resolve();
            });
        });
    }

}


module.exports = Conexion;