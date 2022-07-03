const express = require('express');
const router = express.Router();
const pdf = require('html-pdf');
const Conexion = require('../database/Conexion');
const { formatMoney, getDateForma } = require('../tools/Tools');
const conec = new Conexion();
// require('dotenv').config();

const config = {
    "format": "A4",
    "orientation": "portrait",
    "dpi": 200,
    "quality": 80,
    "border": {
        "left": "0cm",
        "right": "0cm",
        "top": "0cm",
        "bottom": "0cm"
    },
    "header": {
        "height": "0mm"
    },
    "footer": {
        "height": "0mm"
    }
}

router.get('/transacciones', async function (req, res) {
    try {

        let transaccion = await conec.query(`
        SELECT 
        u.idUsuario,
        u.documento,
        u.informacion,
        u.celular,
        ifnull(sum(case t.tipo when 1 then t.monto else 0 end),0) as ingreso,
        ifnull(sum(case t.tipo when 0 then t.monto else 0 end),0) as salida,
        ifnull(sum(case t.tipo when 1 then t.monto else -t.monto end),0) as saldo
        from usuario as u
        left join transaccion as t on u.idUsuario = t.idUsuario
        where u.tipo = 2 and t.fecha between ? and ?
        group by u.idUsuario`, [
            req.query.fechaInicio,
            req.query.fechaFinal
        ]);

        let content = `
        <!doctype html>
            <html>
            <head>
                    <meta charset="utf-8">
                    <title>RESUMEN DE CLIENTES</title>                
                    <style>
                       
                        @import url('./Roboto-Regular.ttf');

                        *{
                            margin:0px;
                            padding:0px; 
                        }
                        html {
                            zoom: ${process.platform === 'win32' ? '0' : '0.64'};
                        }                          
                         
                        body{
                            font-family: 'Roboto', sans-serif;
                            font-size: 14px;
                            padding:10px;
                            height:100vh;
                        }

                        .th-table-detailt{
                            background-color:black;
                            color:white;
                            padding:5px 3px 5px 3px;
                            font-size:12px;
                            border: 1px solid #000000;
                        }

                        .td-table-detailt{
                            padding:5px 10px;
                            font-size:12px;
                            border-left: 1px solid #000000;
                            border-bottom: 1px solid #000000;
                        }
                        
                        .td-table-detailt-end{
                            border-right: 1px solid #000000;
                        }
                    </style>
                </head>
                <body>            
                    <h3 style="text-align:center;">Resumen de Movimientos</h3>
                    <p style="text-align:center;">CIBER AMY</p>
                    <div style="margin:10px 0px;">
                        <p style="padding:5px 0px;">Fecha: ${getDateForma(req.query.fechaInicio)} al ${getDateForma(req.query.fechaFinal)}</p>
                        <p style="padding:5px 0px;">Lista de Clientes</p>
                    <div>

                    <br/>
                    
                    <table width="100%" border="0" cellspacing="0">
                        <thead>
                            <tr>
                                <th width="5%" class="th-table-detailt">#</th>
                                <th width="30%" class="th-table-detailt">Cliente</th>
                                <th width="15%" class="th-table-detailt">N° de Celular</th>
                                <th width="15%" class="th-table-detailt">Ingresos</th>
                                <th width="15%" class="th-table-detailt">Salidas</th>
                                <th width="20%" class="th-table-detailt">Saldo Actual</th>
                            </tr>
                        </thead>
                        <tbody>`;

        transaccion.map((item, index) => {
            content += `<tr>
                <td align="center" class="td-table-detailt">${(index + 1)}</td>
                <td class="td-table-detailt">${item.documento + "<br/>" + item.informacion}</td>
                <td class="td-table-detailt">${item.celular}</td>
                <td align="right" class="td-table-detailt">+${formatMoney(item.ingreso)}</td>
                <td align="right" class="td-table-detailt">-${formatMoney(item.salida)}</td>
                <td align="right" class="td-table-detailt td-table-detailt-end">${formatMoney(item.saldo)}</td>
            </tr>`;
        })

        content += `</tbody>
                    </table>

                </body>
            </html>
        `;


        let data = await new Promise((resolve, reject) => {
            pdf.create(content, config).toStream(function (error, stream) {
                if (error) {
                    return reject(error);
                }
                return resolve(stream);
            });
        });

        // res.setHeader("Content-Type", "application/pdf");
        data.pipe(res);
    } catch (error) {
        console.log(error)
        res.status(500).send("error en enviar el pdf");
    }
});


module.exports = router;