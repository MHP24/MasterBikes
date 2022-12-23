const { CLIENT_IGNORE_SIGPIPE } = require('mysql/lib/protocol/constants/client');
const connection = require('../database/db.js');

exports.getProducts = (req, res) => {
    const { user } = req;
    connection.query('SELECT * FROM products ORDER BY product_category ASC', (error, results) => {
        if(error){console.log(error); return;}
        res.render('admin-products', {products:results, userData: user});
    });
}

exports.editProduct = (req, res) => {
    const { user } = req;
    const { productId } = req.params;
    connection.query('SELECT product_id, product_sku, product_name, product_descr, product_category, product_img, product_price FROM products\
    WHERE product_id = ? ', [productId],
    (error, results) => {
        if(error){console.log(error); return;}
        res.render('admin-product-details', {data: results[0], userData: user});
    });
}

exports.updateProduct = (req, res) => {
    const { productId } = req.params;
    const { productImg, productName, productSku, productDescr, category, productPrice, status} = req.body;
    // console.log(req.body);
    connection.query('UPDATE products SET product_img = ?, product_name = ?, product_sku = ?, product_descr = ?, product_category = ?,\
    product_price = ?, product_status = ? WHERE product_id = ?', [productImg, productName, productSku, productDescr, category, productPrice, status, parseInt(productId)],
    (error, results) => {
        if(error){console.log(error); return;}
        if(status === 'Agotado') {
            connection.query('UPDATE stock SET quantity = 0 WHERE product_id = ?', [productId], (error, results) =>{
                if(error){console.log(error); return;}
            });
        }
    });
    res.redirect(`/admin/productos/${productId}`);
}

exports.addProduct = (req, res) => {
    const { productSku, productName, productDescr, category, productImg, productPrice } = req.body;
    connection.query("INSERT INTO products (product_sku, product_name, product_descr, product_category, product_img, product_price, product_status)\
    VALUES(?, ?, ?, ?, ?, ?, 'Agotado')", [productSku, productName, productDescr, category, productImg, parseInt(productPrice)],
    (error, results) => {
        if(error){console.log(error); return;}
    });

    connection.query('SELECT MAX(product_id)product_id FROM products', (error, productId) => {
        if(error){console.log(error); return;}
        const { product_id } = productId[0];
        connection.query('INSERT INTO stock VALUES(?, ?, ?)', [product_id, productSku, 0], (error, results) => {
            if(error){console.log(error); return;}
        });
    });
    res.redirect('/admin/productos');
}

exports.deleteProduct = (req, res) => {
    const { productId } = req.params;
    connection.query('DELETE FROM products WHERE product_id = ?', [productId],
    (error, results) => {
        if(error){console.log(error); return;}
        res.redirect('/admin/productos');
    });

    connection.query('DELETE FROM stock WHERE product_id = ?', [productId],
    (error, results) =>{
        if(error){console.log(error); return;}
    });
}