const connection = require('../database/db.js');

exports.getBills = (req, res) => {
    const { user } = req;
    connection.query("SELECT b.id, u.username, u.user_picture, b.total_price, DATE_FORMAT(b.payment_date, '%D %M %Y')date, b.status, DATE_FORMAT(NOW(), '%D %M %Y')today FROM bills b JOIN users u ON b.client_id = u.id", (error, results) => {
        if(error){console.log(error); return;}
        res.render('admin-delivery', {data: results, userData: user});
    });
}

exports.billDetails =  (req, res) => {
    const { user } = req;
    const { id } = req.params;
    connection.query("SELECT b.product_sku, p.product_category, p.product_name, b.product_price, DATE_FORMAT(b.payment_date, '%D %M %Y')date, bi.status \
    FROM bills_details b join products p on p.product_sku = b.product_sku  join bills bi on bi.id = b.id where b.id = ?", [id],
    (error, results) => {
        if(error){console.log(error); return;}
        connection.query('select payment_date, delivery_date, reception_date from bills where id= ?', [id],
        (error, dates) => {
            let totalPrice = 0;
            results.forEach(({product_price}) => {totalPrice += product_price;});
            res.render('admin-delivery-details', {billId:id, data:results, total:totalPrice, logDates: dates[0], userData: user});
        });
    });
}

exports.updateBill = (req, res) => {
    const { billId } = req.params;
    const { field__status } = req.body;
    switch(field__status) {
        case 'En Bodega':
            res.redirect(`/admin/pedidos/${billId}`);
            break;
        case 'En Camino':
            connection.query("UPDATE bills SET status = 'En Camino', delivery_date = NOW() WHERE id = ?", [billId],
            (error, results) => {
                if(error){console.log(error); return;}
                res.redirect(`/admin/pedidos/${billId}`);
            });
            break;
        case 'Entregado':
            connection.query('SELECT delivery_date FROM bills WHERE id = ?', [billId], 
            (error, date) => {
                if(error){console.log(error); return;}

                if(date[0].delivery_date != '0000-00-00') {
                    connection.query("UPDATE bills SET status = 'Entregado', reception_date = NOW() WHERE id = ?", [billId],
                    (error, results) => {
                        if(error){console.log(error); return;}
                    });
                }
                res.redirect(`/admin/pedidos/${billId}`);
            });
            break;
    }
}

exports.deleteBill = (req, res) => {
    const { billId } = req.params;
    connection.query('DELETE FROM bills where id = ?', [billId], (error, results) => {
        if(error){console.log(error); return;}
    });
    connection.query('DELETE FROM bills_details where id = ?', [billId], (error, results) => {
        if(error){console.log(error); return;}
    });
    res.redirect('/admin/pedidos');
}