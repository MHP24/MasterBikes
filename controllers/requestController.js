const { request } = require('express');
const res = require('express/lib/response');
const connection = require('../database/db.js');

exports.contact = (req, res) => {
    const { email, subject, description } = req.body
    connection.query('INSERT INTO contact (mail, subject, content) VALUES(?, ?, ?)',
    [email, subject, description], (error, results) => {
        console.log(email, subject, description)
        if(error) {
            res.render('send', {msg: 'Hubo un error al procesar el mensaje, intentalo más tarde.'});
            return;
        }
        res.render('send', {msg: '¡Gracias por contactarnos! nos contactaremos contigo a la brevedad.'});
    });
}


exports.rent = (req, res) => {
    const { field__type, field__days, field__paymentMethod, request__description } = req.body
    const { id } = req.user;
    connection.query('INSERT INTO rent (client_id, bike_type, rent_days, payment_method, rent_description, rent_date, guaranty, total, rent_status)\
    VALUES(?, ?, ?, ?, ?, NOW(), ?, ?, ?)',
    [
        id,
        field__type.split('-')[0],
        field__days.split('-')[0],
        field__paymentMethod,
        request__description,
        parseInt(field__type.split('-')[1]),
        parseInt(field__type.split('-')[1]) + parseInt(field__days.split('-')[1]),
        'Sin Asignar'
    ], (error, results) => {
        if(error) {
            console.log(error);
            res.render('rent-form', {
                alert: true,
                alertTitle: '¡Oops!',
                alertMessage: 'Ocurrió un error. Intentelo más tarde.',
                alertIcon: 'Info',
                showConfirmButton: true,
                timer: false,
                ruta: 'servicios/arrendar'
            });
            return;
        }
        res.render('rent-form', {
            alert: true,
            alertTitle: 'Solicitud recibida',
            alertMessage: 'Será atendida en un plazo de 5 días habíles',
            alertIcon: 'success',
            showConfirmButton: true,
            timer: false,
            ruta: 'servicios/arrendar'
        });
    });
}


exports.loadRepairSchedule = (req, res) => {
    connection.query('SELECT * FROM schedule WHERE schedule_available = 1', (error, results) => {
        if(error) {
            console.log(error);
            return;
        }
        res.render('repair-form', {data:results});
    });
}

exports.loadMaintenanceSchedule = (req, res) => {
    connection.query('SELECT * FROM schedule WHERE schedule_available = 1', (error, results) => {
        if(error) {
            console.log(error);
            return;
        }
        res.render('maintenance-form', {data:results});
    });
}

const takeSchedule = (id) => {
    connection.query('UPDATE schedule SET schedule_available = 0 WHERE schedule_id = ?', [id], (error, results) => {
        if(error) {
            console.log(error);
            res.render('index', {
                alert: true,
                alertTitle: '¡Oops!',
                alertMessage: 'Ocurrió un error. Intentelo más tarde.',
                alertIcon: 'Info',
                showConfirmButton: true,
                timer: false,
                ruta: '/'
            });
            return;
        }
    })
}


exports.addRepair = (req, res) => {
    const { id } = req.user;
    const {field__options, field__schedule, request__description } = req.body;
    connection.query(`INSERT INTO repairs (client_id, repair_descr, time_id, status, req_date, update_date, feedback, type)\
    VALUES(${parseInt(id)}, '${request__description}', ${parseInt(field__schedule)}, 'Solicitado', NOW(), NOW(), 'Sin respuesta.', '${field__options}')`, 
    (error, results) => {
        if(error) {
            console.log(error);
            res.render('index', {
                alert: true,
                alertTitle: '¡Oops!',
                alertMessage: 'Ocurrió un error. Intentelo más tarde.',
                alertIcon: 'Info',
                showConfirmButton: true,
                timer: false,
                ruta: '/'
            });
            return;
        }
        takeSchedule(field__schedule);
        res.render('index', {
            alert: true,
            alertTitle: 'Reparación agendada con éxito.',
            alertMessage: '¡Te esperamos en nuestra sucursal!',
            alertIcon: 'success',
            showConfirmButton: true,
            timer: false,
            ruta: '/'
        });
    })
}

exports.addMaintenance = (req, res) => {
    const { id } = req.user;
    const {field__options, field__schedule, request__description } = req.body;
    connection.query(`INSERT INTO repairs (client_id, repair_descr, time_id, status, req_date, update_date, feedback, type)\
    VALUES(${parseInt(id)}, '${request__description}', ${parseInt(field__schedule)}, 'Solicitado', NOW(), NOW(), 'Sin respuesta.', '${field__options}')`, 
    (error, results) => {
        if(error) {
            console.log(error);
            res.render('index', {
                alert: true,
                alertTitle: '¡Oops!',
                alertMessage: 'Ocurrió un error. Intentelo más tarde.',
                alertIcon: 'Info',
                showConfirmButton: true,
                timer: false,
                ruta: '/'
            });
            return;
        }
        takeSchedule(field__schedule);
        res.render('index', {
            alert: true,
            alertTitle: 'Mantención agendada con éxito.',
            alertMessage: '¡Te esperamos en nuestra sucursal!',
            alertIcon: 'success',
            showConfirmButton: true,
            timer: false,
            ruta: '/'
        });
    })
}