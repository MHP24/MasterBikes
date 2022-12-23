const connection = require('../database/db.js');

exports.loadHome = (req, res) => {
    const { user } = req;
    connection.query('SELECT COUNT(*)products FROM products', (error, productResults) =>{
        if(error) throw error;
        const { products } = productResults[0];
        
        connection.query('SELECT COUNT(*)users FROM users', (error, usersResults) => {
            if(error) throw error;
            const { users } = usersResults[0];

            connection.query('SELECT SUM(total_price)money FROM bills', (error, moneyResults) => {
                if(error) throw error;
                const { money } = moneyResults[0];

                connection.query("SELECT COUNT(*)delivery FROM bills WHERE status = 'En Camino'", (error, deliveryResults) => {
                    if(error) throw error;
                    const { delivery } = deliveryResults[0];
                    
                    connection.query("SELECT b.id, u.username, b.total_price, DATE_FORMAT(b.payment_date, '%D %M %Y')payment_date, DATE_FORMAT(NOW(), '%D %M %Y')today\
                      FROM bills b JOIN users u ON b.client_id = u.id ORDER BY b.payment_date DESC LIMIT 3", (error, recentPayments) => {
                        if(error) throw error;

                        connection.query('SELECT b.product_sku, p.product_name, p.product_img, COUNT(b.product_sku)product_count, p.product_price \
                                FROM bills_details b JOIN products p ON p.product_sku = b.product_sku \
                                GROUP BY b.product_sku, p.product_name, p.product_img, p.product_price \
                                ORDER BY COUNT(b.product_sku) DESC LIMIT 3', (error, productsData) => {
                            if(error) throw error;
                            res.render('admin-home', {
                                productCount:products, 
                                userCount:users, 
                                totalBal:money, 
                                soonDel:delivery,
                                orders: recentPayments,
                                bestProducts: productsData,
                                userData:user
                            });
                        });
                    });
                });
            });
        });
    });
}