const connection = require('../database/db.js');

exports.loadProducts = (req, res) => {
    connection.query("SELECT * FROM products WHERE product_status != 'Descontinuado' ORDER BY product_category ASC", (error, results) => {
        if(error) {
            throw error;
        }
        res.render('products', {products: results, count: results.length});
    });
};

exports.loadProduct = (req, res) => {
    const { productSku } = req.params;
    connection.query('SELECT * FROM products WHERE product_sku = ?', [productSku], (error, result) => {
        if(error) {
            throw error;
        }
        res.render('product-details', {product: result[0]});
    });
};

exports.searchProduct = (req, res) => {
    const { product_search:product } = req.body;
    const sql = `SELECT * FROM products WHERE product_name LIKE '%${product}%' OR product_descr LIKE '%${product}%'`;
    connection.query(sql, 
    (error, results) => {
        if(error) {
            throw error;
        }
        // console.log(results);
        res.render('products', {products: results, count: results.length});
    });
}

exports.searchByCategory = (req, res) => {
    // res.send(req.params.category)
    const { category } = req.params;
    const sql = `SELECT * FROM products WHERE product_category LIKE '%${category}%'`;
    connection.query(sql, (error, results) => {
        if(error) {
            console.log(error);
        }
        res.render('products', {products: results, count: results.length});
    });
}