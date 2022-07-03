const express = require('express');
const router = express.Router();
const path = require('path');
const notification = require('../notificacion');
// const pdf = require('../pdf/pdf');
const Conexion = require('../database/Conexion');
const { currentDate, currentTime, formatMoney } = require('../tools/Tools');
const conec = new Conexion();

router.get('/list', async function (req, res) {
    try {
        let transaccion = await conec.query(`select 
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

        let resultLista = transaccion.map(function (item, index) {
            return {
                ...item,
                id: (index + 1) + parseInt(req.query.posicionPagina)
            }
        });

        let total = await conec.query(`SELECT COUNT(*) AS Total FROM transaccion
        where idUsuario = ?`, [
            req.query.idUsuario,
        ]);

        let usuario = await conec.query(`SELECT * FROM usuario WHERE idUsuario = ?`, [
            req.query.idUsuario
        ]);

        res.status(200).send({ "result": resultLista, "total": total[0].Total, "usuario": usuario[0] })
    } catch (error) {
        res.status(500).send("Error interno de conexión, intente nuevamente.");
    }
});

router.post('/add', async function (req, res) {
    let connection = null;
    try {
        connection = await conec.beginTransaction()

        let token = await conec.execute(connection, `select value from token where idUsuario = ?`, [
            req.body.idUsuario
        ]);

        let monto = await conec.execute(connection, 'select tipo,monto from transaccion where idUsuario = ?', [
            req.body.idUsuario,
        ]);

        let total = 0;
        for (let value of monto) {
            total += value.tipo == 1 ? value.monto : -value.monto;
        }

        if (req.body.tipo == 0) {
            if (total < parseFloat(req.body.monto)) {
                conec.rollback(connection);
                res.status(400).send("El monto que va restar es mayor al monto total.");
                return;
            }
        }

        await conec.execute(connection, `insert into transaccion(
        tipo,
        comentario,
        monto,
        fecha,
        hora,
        idUsuario
        ) 
        values (?,?,?,?,?,?)`, [
            req.body.tipo,
            req.body.comentario,
            req.body.monto,
            currentDate(),
            currentTime(),
            req.body.idUsuario,
        ]);

        await conec.commit(connection)

        if (token.length > 0) {
            let title = req.body.tipo == 1 ? `<p style="color: #00b26a;"><b>Saldo Agregado</span></p></b></p> &#10133;` : `<p style="color: #df6574;"><b>Saldo Descontado</span></p></b></p> &#10134;`;
            let body = req.body.tipo == 1 ?
                `<p style="color: #020203;">${req.body.comentario !== "" ? req.body.comentario : `El monto agregado a su cuenta es de S/ ${formatMoney(req.body.monto)}`}</p>` :
                `<p style="color: #020203;">${req.body.comentario !== "" ? req.body.comentario : `El monto descontado a su cuenta es de S/ ${formatMoney(req.body.monto)}`}</p>`;
            notification.sendPushToOneUser({
                tokenId: token[0].value,
                data: {
                    title: title,
                    subtitle: '&#128588;',
                    body: body,
                }
            });
        }

        res.status(200).send("Se registró correctamente su saldo.");
    } catch (error) {
        if (connection != null) {
            conec.rollback(connection);
        }
        res.status(500).send("Error interno de conexión, intente nuevamente.");
    }
});

router.get('/id', async function (req, res) {
    try {
        let transaccion = await conec.query(`select * from usuario where idUsuario = ?`, [
            req.query.idUsuario

        ]);

        res.status(200).send(transaccion[0]);
    } catch (error) {
        res.status(500).send("Error interno de conexión, intente nuevamente.");
    }
});

router.get('/pdf', async function (req, res) {
    try {
        // pdf();
        // console.log(path.join(__dirname, "../..", "html-pdf.pdf"))
        // res.send("pdf");
        res.sendFile(path.join(__dirname, "../..", "html-pdf.pdf"));
    } catch (error) {
        console.log(error)
        res.send("error en enviar el pdf");
    }

});


module.exports = router;