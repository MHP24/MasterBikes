const connection = require('../database/db.js');

exports.loadStock = (req, res) => {
    const { user } = req;
    connection.query('SELECT s.product_id, p.product_sku, p.product_img, p.product_name, p.product_category, s.quantity \
    FROM products p JOIN stock s ON p.product_id = s.product_id ORDER BY p.product_category', (error, results) => {
        if(error){console.log(error); return;}
        res.render('admin-stock', {data:results, userData: user});
    });
}

exports.updateStock = (req, res) => {
    const { stock } = req.body;
    const { productId } = req.params;
    connection.query('UPDATE stock SET quantity = ? WHERE product_id = ?', [parseInt(stock), productId], (error, results) => {
        if(error){console.log(error); return;}
        let status;
        if(parseInt(stock) > 0) {
            status = 'Disponible';
        }else{
            status = 'Agotado';
        }
        connection.query("UPDATE products SET product_status = ? WHERE product_id = ? ", [status, productId], (error, results) => {
            if(error){console.log(error); return;}
        });
        res.redirect('/admin/stock');
    });
}