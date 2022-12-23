const connection = require('../database/db.js');

exports.addToCart = (productSku, userId) => {
    connection.query('INSERT INTO shopping_cart (product_sku, client_id) VALUES (?, ?)', [productSku, userId],
    (error, result) => {
        if(error) {
            console.log(error);
            return;
        }
    })
}

exports.getCart = (req, res) => {
    const { id } = req.user;
    connection.query('SELECT s.client_id, s.id, s.product_sku, p.product_name, p.product_price, p.product_img FROM shopping_cart s JOIN products p ON s.product_sku = p.product_sku WHERE s.client_id = ?',
    [id], (error, results) => {
        if(error) {
            console.log(error);
            return;
        }
        let totalPrice = 0;
        results.forEach(({product_price}) => {
            totalPrice += product_price;
        });
        res.render('shopping-cart', {products: results, value: totalPrice, productsCount: results.length})
    });
}

exports.remove = (req, res) => {
    const { productId } = req.params;
    connection.query('DELETE FROM shopping_cart WHERE id = ?', [productId], (error, result) => {
        if(error) {
            console.log(error);
            return;
        }
        res.redirect('/carrito');
    });
}

const paymentHandler = (paymentData, paymentId) => {
    let totalPrice = 0;
    paymentData.forEach( ({ client_id, date, product_sku, id:productId, product_price})  => {
        connection.query('INSERT INTO bills_details (id, client_id, payment_date, product_sku, product_id, product_price) VALUES(?, ?, ?, ?, ?, ?)',
        [`${paymentId}`, client_id, date, product_sku, productId, product_price], (error, results) => {
            if(error) {console.log(error); return;}
        });
        totalPrice += product_price;

        connection.query('SELECT quantity FROM stock WHERE product_sku = ?', [product_sku], (error, stock) => {
            const { quantity } = stock[0];
            if(error){console.log(error); return;}
            connection.query('UPDATE stock SET quantity = ? WHERE product_sku = ?', [(quantity - 1), product_sku], (error, results) => {
                if(error){console.log(error); return;}
            });
        });

    });

    const { client_id, date } = paymentData[0];
    connection.query('DELETE FROM shopping_cart WHERE client_id = ?', [client_id], (error, results) => {
        if(error){console.log(error); return;}
    });
    
    connection.query('INSERT INTO bills (id, client_id, payment_date, total_price, status) VALUES(?, ?, ?, ?, ?)', 
    [`${paymentId}`, client_id, date, totalPrice, 'En Bodega'],
    (error, results) => {
        if(error) {
            console.log(error);
            return;
        } 
    });

}

exports.pay = (req, res) => {
    const { id:clientId } = req.user;
    connection.query('SELECT s.id, s.product_sku, s.client_id, p.product_price, NOW()date FROM shopping_cart s JOIN products p ON s.product_sku = p.product_sku WHERE client_id = ?', [clientId], (error, results) =>{
        if(error) {
            console.log(error);
            return;
        }
        if(results) {
            const { date, client_id} = results[0];
            const [dayName, monthName, day, year, time] = `${date}`.split(' ');
            const billId = `${client_id}${dayName.slice(0, 1)}${monthName.slice(0, 1)}${day}${year}${time.split(':').join('')}`;
            paymentHandler(results, billId);
            res.redirect(`/success/${billId}`);
        }
    });
}