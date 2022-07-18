const express = require('express');
const router = express.Router();
const notification = require('../notificacion');
const Conexion = require('../database/Conexion');
const { currentDate, currentTime, formatMoney } = require('../tools/Tools');
const conec = new Conexion();

router.get('/', async function (req, res) {
    res.status(200).send("Api rest usuario");
});

router.get('/list', async function (req, res) {
    try {
        let usuarios = await conec.query(`select 
        u.idUsuario,
        u.documento,
        u.informacion,
        u.celular,
        u.email,
        u.clave,
        u.tipo,
        u.estado,
        ifnull(sum(case t.tipo when 1 then t.monto else -t.monto end),0) as monto
        from usuario as u
        left join transaccion as t on u.idUsuario = t.idUsuario
        where 
        ? = 0
        or
        ? = 1 and u.documento like concat(?,'%')
        or
        ? = 1 and u.informacion like concat(?,'%')
        or
        ? = 1 and u.celular like concat(?,'%')
        group by u.idUsuario
        limit ?,?`, [
            parseInt(req.query.opcion),

            parseInt(req.query.opcion),
            req.query.buscar,

            parseInt(req.query.opcion),
            req.query.buscar,

            parseInt(req.query.opcion),
            req.query.buscar,

            parseInt(req.query.posicionPagina),
            parseInt(req.query.filasPorPagina)
        ]);

        let lista = usuarios.map(function (item, index) {
            return {
                ...item,
                id: (index + 1) + parseInt(req.query.posicionPagina),
            };
        });

        let total = await conec.query(`select count(*) as Total
        from usuario as u
        where 
        ? = 0
        or
        ? = 1 and u.documento like concat(?,'%')
        or
        ? = 1 and u.informacion like concat(?,'%')
        or
        ? = 1 and u.celular like concat(?,'%')`, [
            parseInt(req.query.opcion),

            parseInt(req.query.opcion),
            req.query.buscar,

            parseInt(req.query.opcion),
            req.query.buscar,

            parseInt(req.query.opcion),
            req.query.buscar
        ]);

        res.status(200).send({ "result": lista, "total": total[0].Total });
    } catch (error) {
        console.log(error)
        res.status(500).send("Error interno de conexión, intente nuevamente.");
    }
});

router.post('/add', async function (req, res) {
    let connection = null;
    try {
        connection = await conec.beginTransaction()

        let resultUsuario = await conec.execute(connection, 'select idUsuario from usuario');

        let idUsuario = 0;
        if (resultUsuario.length != 0) {

            let quitarValor = resultUsuario.map(function (item) {
                return parseInt(item.idUsuario.replace("US", ''));
            });

            let valorActual = Math.max(...quitarValor);
            let incremental = valorActual + 1;
            let codigoGenerado = "";
            if (incremental <= 9) {
                codigoGenerado = 'US000' + incremental;
            } else if (incremental >= 10 && incremental <= 99) {
                codigoGenerado = 'US00' + incremental;
            } else if (incremental >= 100 && incremental <= 999) {
                codigoGenerado = 'US0' + incremental;
            } else {
                codigoGenerado = 'US' + incremental;
            }

            idUsuario = codigoGenerado;
        } else {
            idUsuario = "US0001";
        }

        let documento = await conec.execute(connection, 'select * from usuario where documento = ?', [
            req.body.documento,
        ]);

        if (documento.length > 0) {
            conec.rollback(connection);
            res.status(400).send("El número de documento ya se encuentra registrado.");
            return;
        }

        let celular = await conec.execute(connection, 'select * from usuario where celular = ?', [
            req.body.celular,
        ]);

        if (celular.length > 0) {
            conec.rollback(connection);
            res.status(400).send("El número de celular ya se encuentra registrado.");
            return;
        }

        if (req.body.email !== null && req.body.email !== "" && req.body.email !== undefined) {
            let email = await conec.execute(connection, 'select * from usuario where email = ?', [
                req.body.email,
            ]);

            if (email.length > 0) {
                conec.rollback(connection);
                res.status(400).send("El email del usuario ya se encuentra registrado.");
                return;
            }
        }

        await conec.execute(connection, `insert into usuario(
        idUsuario,
        documento,
        informacion,
        celular,
        email,
        clave,
        tipo,
        fecha,
        hora,
        estado) 
        values (?,?,?,?,?,?,?,?,?,?)`, [
            idUsuario,
            req.body.documento,
            req.body.informacion,
            req.body.celular,
            req.body.email,
            req.body.clave,
            req.body.tipo,
            currentDate(),
            currentTime(),
            req.body.estado,
        ]);

        let resultPrivilegio = await conec.execute(connection, 'select idPrivilegio from privilegio');

        let idPrivilegio = 0;
        if (resultPrivilegio.length != 0) {

            let quitarValor = resultPrivilegio.map(function (item) {
                return parseInt(item.idPrivilegio.replace("PV", ''));
            });

            let valorActual = Math.max(...quitarValor);
            let incremental = valorActual + 1;
            let codigoGenerado = "";
            if (incremental <= 9) {
                codigoGenerado = 'PV000' + incremental;
            } else if (incremental >= 10 && incremental <= 99) {
                codigoGenerado = 'PV00' + incremental;
            } else if (incremental >= 100 && incremental <= 999) {
                codigoGenerado = 'PV0' + incremental;
            } else {
                codigoGenerado = 'PV' + incremental;
            }

            idPrivilegio = codigoGenerado;
        } else {
            idPrivilegio = "PV0001";
        }

        await conec.execute(connection, `insert into privilegio(
            idPrivilegio,
            agregarUsuario,
            editarUsuario,
            procesarSaldo,
            verSaldo,
            moduloReporte,
            idUsuario) 
            values (?,1,1,1,1,1,?)`, [
            idPrivilegio,
            idUsuario,
        ]);

        await conec.commit(connection)

        res.status(200).send("Se registró correctamente su cuenta.");
    } catch (error) {
        if (connection != null) {
            conec.rollback(connection);
        }
        res.status(500).send("Se produjo un error de servidor, intente en un par de minutos.");
    }
});

router.post('/edit', async function (req, res) {
    let connection = null;
    try {
        connection = await conec.beginTransaction()

        let documento = await conec.execute(connection, 'select * from usuario where idUsuario <> ? and documento = ?', [
            req.body.idUsuario,
            req.body.documento
        ]);

        if (documento.length > 0) {
            conec.rollback(connection);
            res.status(400).send("El número de documento ya se encuentra registrado.");
            return;
        }

        let celular = await conec.execute(connection, 'select * from usuario where idUsuario <> ? and celular = ?', [
            req.body.idUsuario,
            req.body.celular
        ]);

        if (celular.length > 0) {
            conec.rollback(connection);
            res.status(400).send("El número de celular ya se encuentra registrado.");
            return;
        }

        if (req.body.email !== null && req.body.email !== "" && req.body.email !== undefined) {
            let email = await conec.execute(connection, 'select * from usuario where idUsuario <> ? and email = ?', [
                req.body.idUsuario,
                req.body.email
            ]);

            if (email.length > 0) {
                conec.rollback(connection);
                res.status(400).send("El email del usuario ya se encuentra registrado.");
                return;
            }
        }

        await conec.execute(connection, `update usuario 
        set 
        documento=?,
        informacion=?,
        celular=?,
        email=?,
        clave=?,
        tipo=?,
        estado=?
        where idUsuario = ?`, [
            req.body.documento,
            req.body.informacion,
            req.body.celular,
            req.body.email,
            req.body.clave,
            req.body.tipo,
            req.body.estado,
            req.body.idUsuario
        ])

        await conec.execute(connection, `update privilegio 
        set
        agregarUsuario=?,
        editarUsuario=?,
        procesarSaldo=?,
        verSaldo=?,
        moduloReporte=?
        where idUsuario = ?`, [
            req.body.agregarUsuario,
            req.body.editarUsuario,
            req.body.procesarSaldo,
            req.body.verSaldo,
            req.body.moduloReporte,
            req.body.idUsuario
        ]);

        await conec.commit(connection)

        res.status(200).send("Se actualizó correctamente su cuenta.");
    } catch (error) {
        if (connection != null) {
            conec.rollback(connection);
        }
        res.status(500).send("Error interno de conexión, intente nuevamente.");
    }
});

router.get('/id', async function (req, res) {
    try {

        let usuario = await conec.query(`select 
        idUsuario,
        documento,
        informacion,
        celular,
        email,
        clave,
        tipo,
        estado
        from usuario 
        where idUsuario = ?`, [
            req.query.idUsuario,
        ]);

        if (usuario.length > 0) {

            let privilegio = await conec.query(`select * from privilegio where idUsuario = ?`, [
                req.query.idUsuario,
            ]);

            res.status(200).send({ "usuario": usuario[0], "privilegio": privilegio[0] });
        } else {
            res.status(400).send("Datos no encontrados");
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Error interno de conexión, intente nuevamente.");
    }
});

router.get('/login', async function (req, res) {
    try {
        let resultUsuario = await conec.query(`select 
        idUsuario,
        documento,
        informacion,
        celular,
        email,
        clave,
        tipo
        from usuario where 
        email <> '' and email = ? and clave = ? and tipo = ? and estado = 1
        or
        celular = ? and clave = ? and tipo = ? and estado = 1`, [
            req.query.usuario,
            req.query.clave,
            req.query.tipo,

            req.query.usuario,
            req.query.clave,
            req.query.tipo,
        ]);

        if (resultUsuario.length > 0) {
            let usuario = resultUsuario[0];

            let resultPrivilegio = await conec.query(`select * from privilegio where idUsuario = ?`, [
                usuario.idUsuario
            ]);

            res.status(200).send({ "usuario": usuario, "privilegio": resultPrivilegio[0] });
        } else {
            res.status(400).send("Datos no encontrados o usuario inactivo");
        }
    } catch (error) {
        res.status(500).send("Error interno de conexión, intente nuevamente.");
    }
});

router.get('/app/login', async function (req, res) {
    let connection = null;
    try {
        connection = await conec.beginTransaction()

        let resultUsuario = await conec.execute(connection, `select 
        idUsuario,
        documento,
        informacion,
        celular,
        email,
        clave,
        tipo
        from usuario where 
        email <> '' and email = ? and clave = ? and tipo = ? and estado = 1
        or
        celular = ? and clave = ? and tipo = ? and estado = 1`, [
            req.query.usuario,
            req.query.clave,
            req.query.tipo,

            req.query.usuario,
            req.query.clave,
            req.query.tipo,
        ]);

        if (resultUsuario.length > 0) {
            let usuario = resultUsuario[0];

            if (typeof req.query.token === 'string' || req.query.token instanceof String) {
                if (req.query.token !== "") {
                    await conec.execute(connection, 'delete from token where value = ?', [
                        req.query.token,
                    ])

                    await conec.execute(connection, 'delete from token where idUsuario = ?', [
                        usuario.idUsuario
                    ])

                    await conec.execute(connection, 'insert into token (value,fecha,hora,idUsuario) values (?,?,?,?)', [
                        req.query.token,
                        currentDate(),
                        currentTime(),
                        usuario.idUsuario
                    ])
                }
            }

            await conec.commit(connection)

            res.status(200).send(usuario);
        } else {
            conec.rollback(connection);
            res.status(400).send("Datos no encontrados o usuario inactivo");
        }
    } catch (error) {
        if (connection != null) {
            conec.rollback(connection);
        }
        res.status(500).send("Error interno de conexión, intente nuevamente.");
    }
});

router.get('/app/id', async function (req, res) {
    try {

        let usuario = await conec.query(`select 
        idUsuario,
        documento,
        informacion,
        celular,
        email,
        clave,
        tipo,
        estado
        from usuario 
        where idUsuario = ?`, [
            req.query.idUsuario,
        ]);

        if (usuario.length > 0) {

            res.status(200).send(usuario[0]);
        } else {
            res.status(400).send("Datos no encontrados");
        }
    } catch (error) {
        res.status(500).send("Error interno de conexión, intente nuevamente.");
    }
});

router.post('/token', async function (req, res) {
    let connection = null;
    try {
        connection = await conec.beginTransaction()

        await conec.execute(connection, 'delete from token where value = ?', [
            req.body.token,
        ])

        await conec.execute(connection, 'delete from token where idUsuario = ?', [
            req.body.idUsuario
        ])

        await conec.execute(connection, 'insert into token (value,fecha,hora,idUsuario) values (?,?,?,?)', [
            req.body.token,
            req.body.fecha,
            req.body.hora,
            idUsuario
        ])
        await conec.commit(connection)

        res.status(200).send("Se registró correctamente el token.");
    } catch (error) {
        console.log(error)
        if (connection != null) {
            conec.rollback(connection);
        }
        res.status(500).send("Error interno de conexión, intente nuevamente.");
    }
});

router.get('/transacciones', async function (req, res) {
    try {
        let lista = await conec.query(`select 
        tipo,
        comentario,
        monto,
        DATE_FORMAT(fecha,'%d/%m/%Y') as fecha,
        hora 
        from transaccion 
        where idUsuario = ?
        order by fecha desc,hora desc
        limit ?,?`, [
            req.query.idUsuario,
            parseInt(req.query.posicionPagina),
            parseInt(req.query.filasPorPagina)
        ]);

        let total = await conec.query(`select count(*) as Total
        from transaccion 
        where idUsuario = ?`, [
            req.query.idUsuario,
        ]);

        let monto = await conec.query(`select 
        ifnull(sum(case t.tipo when 1 then t.monto else -t.monto end),0) as Monto
        from usuario as u
        left join transaccion as t on u.idUsuario = t.idUsuario
        where u.idUsuario = ?`, [
            req.query.idUsuario,
        ]);

        let empresa = await conec.query(`select * from empresa`);
        let celular = "";
        let mensaje = "";
        if (empresa.length > 0) {
            celular = empresa[0].celular;
            mensaje = empresa[0].mensaje;
        }

        res.status(200).send({
            "result": lista,
            "total": total[0].Total,
            "monto": monto[0].Monto,
            "celular": celular,
            "mensaje": mensaje
        });

    } catch (error) {
        console.log(error)
        res.status(500).send("Error interno de conexión, intente nuevamente.");
    }
});

router.get('/filtrar', async function (req, res) {
    try {
        let lista = await conec.query(`select 
        idUsuario,
        documento,
        informacion 
        from usuario 
        where informacion like concat('%',?,'%') and tipo = 1`, [
            req.query.filtrar,
        ]);

        res.status(200).send(lista);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error interno de conexión, intente nuevamente.");
    }
});

module.exports = router;