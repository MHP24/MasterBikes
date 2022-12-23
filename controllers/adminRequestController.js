const connection = require('../database/db.js');

exports.getRepairs = (req, res) => {
    const { user } = req;
    connection.query("SELECT r.repair_id, u.username, u.user_picture, DATE_FORMAT(r.req_date, '%D %M %Y')req_date, r.status, type from repairs r join users u on r.client_id = u.id", 
    (error, repairResults) => {
        if(error) {console.log(error);return;}
        connection.query("SELECT re.id, u.username, u.user_picture, DATE_FORMAT(re.rent_date, '%D %M %Y')rent_date, re.rent_status FROM rent re JOIN users u ON re.client_id = u.id ORDER BY re.rent_date ASC",
        (error, rentResults) => {
            if(error){console.log(error); return;}
            connection.query("SELECT DATE_FORMAT(NOW(), '%D %M %Y')today FROM DUAL", (error, resulttDay) => {
                if(error){console.log(error); return;}
                res.render('admin-requests', {repairs: repairResults, rents:rentResults, day:resulttDay[0], userData: user});
            });

        });
    });
}

exports.editRepair = (req, res) => {
    const { repairId } = req.params;
    const { user } = req;
    connection.query("SELECT repair_id, repair_descr, status, feedback, DATE_FORMAT(req_date, '%D %M %Y')req_date FROM repairs WHERE repair_id = ?", [repairId], (error, results) => {
        if(error) {
            console.log(error);
            return;
        }
        // res.json(user)
        res.render('admin-repairs', {data: results[0], userData: user});
    });
}

exports.updateRepair = (req, res) => {
    const { repairId } = req.params;
    const { field__status:status, summary } = req.body;
    if(status === 'Finalizado') {
        connection.query('SELECT time_id FROM repairs WHERE repair_id = ? ', [repairId], (error, results) => {
            if(error) {console.log(error);return;}
            const { time_id } = results[0];
            connection.query('UPDATE schedule SET schedule_available = 1 WHERE schedule_id = ? ', [time_id],
            (error, results) => {
                if(error) {console.log(error); return;}
            });
        });
    }
    connection.query('UPDATE repairs SET feedback = ?, status = ?, update_date = NOW() WHERE repair_id = ?',
    [summary, status, repairId], (error, results) => {
        if(error) {
            console.log(error);
            return;
        }
        res.redirect('/admin/solicitudes');
    });
}

exports.deleteRepair = (req, res) => {
    const { repairId } = req.params;
    connection.query('SELECT time_id FROM repairs WHERE repair_id = ? ', [repairId], (error, results) => {
        if(error) {console.log(error);return;}
        const { time_id } = results[0];
        connection.query('UPDATE schedule SET schedule_available = 1 WHERE schedule_id = ? ', [time_id],
        (error, results) => {
            if(error) {console.log(error); return;}
        });
    });

    connection.query('DELETE FROM repairs WHERE repair_id = ? ', [repairId], (error, results) => {
        if(error){console.log(error); return;}
        res.redirect('/admin/solicitudes');
    });
}


exports.editMaintenance = (req, res) => {
    const { user } = req;
    const { repairId } = req.params;
    connection.query("SELECT repair_id, repair_descr, status, feedback, DATE_FORMAT(req_date, '%D %M %Y')req_date FROM repairs WHERE repair_id = ?", [repairId], (error, results) => {
        if(error) {
            console.log(error);
            return;
        }
        res.render('admin-maintenances', {data: results[0], userData: user});
    });
}

exports.editRent = (req, res) => {
    const { rentId } = req.params;
    const { user } = req;
    connection.query("SELECT id, DATE_FORMAT(rent_date, '%D %M %Y')date, rent_description, bike_type, rent_days, payment_method, guaranty, total, instructions from rent WHERE id = ?", [rentId], (error, results) => {
        if(error){console.log(error); return;}
        // console.log(results);
        res.render('admin-rents', {data: results[0], userData: user});
    });
}

exports.updateRent = (req, res) => {
    const { rentId } = req.params;
    // console.log(req.body);
    const { field__status:status, summary } = req.body;
    connection.query('UPDATE rent SET rent_status = ?, instructions = ? WHERE id = ?', [status, summary, rentId], 
    (error, results) => {
        if(error){console.log(error); return;}
        res.redirect('/admin/solicitudes');
    }); 
}

exports.deleteRent = (req, res) => {
    const { rentId } = req.params;
    connection.query('DELETE from rent WHERE id = ?', [rentId], (error, results) => {
        if(error){console.log(error); return;}
        res.redirect('/admin/solicitudes');
    });
}

exports.loadSchedule = (req, res) => {
    const { user } = req;
    connection.query("SELECT *, DATE_FORMAT(NOW(), '%D %M %Y')today FROM schedule ORDER BY schedule_available DESC", (error, results) => {
        if(error) throw error;
        res.render('admin-schedule-handler', {userData: user, schedules: results});
    });
}
exports.addSchedule = (req, res) => {
    const { day, month, year, time } = req.body;
    let date = `${day}/${month}/${year} - ${time}`;
    connection.query('INSERT INTO schedule (schedule, schedule_available) VALUES(?, ?)', [date, 1], (error, results) => {
        if(error) throw error;
        
    });
}

exports.updateSchedule = (req, res) => {
    const { schedule_id } = req.params;
    const { status } = req.body;
    let available = 0;
    if(status === 'Disponible') {
        available = 1;
    }
    connection.query('UPDATE schedule SET schedule_available = ? WHERE schedule_id = ?', [available, schedule_id], (error, results) =>{
        if(error) throw error;
        res.redirect('/admin/horarios');
    });
}