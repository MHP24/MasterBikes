const connection = require('../database/db.js');

exports.generateSummary = (req, res) => {
    const { user } = req;
    connection.query('SELECT p.product_sku, p.product_name, p.product_price, s.quantity\
    FROM products p JOIN stock s ON p.product_id = s.product_id', (error, stockResults) => {
        if(error) throw error;
        let productsCount = 0;
        let productsValue = 0;
        stockResults.forEach(( {product_price, quantity} ) => {
            productsCount += parseInt(quantity);
            productsValue +=  parseInt(product_price);
        });
        connection.query("SELECT id, DATE_FORMAT(payment_date, '%D %M %Y')p_date, total_price FROM bills WHERE MONTH(payment_date) = MONTH(NOW())",
        (error, billsResults) => {
            if(error) throw error;
            let billsPrice = 0;
            billsResults.forEach( ( {total_price} ) => {
                billsPrice += parseInt(total_price);
            });

            connection.query("SELECT repair_id, DATE_FORMAT(req_date, '%D %M %Y')r_date, status FROM repairs\
             WHERE type = 'mantenciones' AND MONTH(req_date) = MONTH(NOW())", (error, maintenanceResults) => {
                if(error) throw error;

                connection.query("SELECT repair_id, DATE_FORMAT(req_date, '%D %M %Y')r_date, status FROM repairs\
                WHERE type = 'reparaciones' AND MONTH(req_date) = MONTH(NOW())", (error, repairResults) => {
                   if(error) throw error;

                   res.render('admin-summary', {userData: user, 
                    stockData: stockResults,
                    stock:productsCount,
                    stockPrice: productsValue,
                    diffProducts: stockResults.length,
                    totalBills: billsPrice,
                    billsCount: billsResults.length,
                    bills: billsResults,
                    maintenances: maintenanceResults,
                    repairs: repairResults,
                    maintenancesCount: maintenanceResults.length,
                    repairsCount: repairResults.length});

               });
            });
        });
    });
}

exports.generateSummaryByMY = (req, res) => {
    const { user } = req;
    const { mm:month, yy:year } = req.params;
    connection.query('SELECT p.product_sku, p.product_name, p.product_price, s.quantity\
    FROM products p JOIN stock s ON p.product_id = s.product_id', (error, stockResults) => {
        if(error) throw error;
        let productsCount = 0;
        let productsValue = 0;
        stockResults.forEach(( {product_price, quantity} ) => {
            productsCount += parseInt(quantity);
            productsValue +=  parseInt(product_price);
        });
        connection.query("SELECT id, DATE_FORMAT(payment_date, '%D %M %Y')p_date, total_price FROM bills WHERE MONTH(payment_date) = ? \
        AND YEAR(payment_date) = ?",
        [month, year],
        (error, billsResults) => {
            if(error) throw error;
            let billsPrice = 0;
            billsResults.forEach( ( {total_price} ) => {
                billsPrice += parseInt(total_price);
            });

            connection.query("SELECT repair_id, DATE_FORMAT(req_date, '%D %M %Y')r_date, status FROM repairs\
             WHERE type = 'mantenciones' AND MONTH(req_date) = ? AND YEAR(req_date) = ? ", [month, year], (error, maintenanceResults) => {
                if(error) throw error;

                connection.query("SELECT repair_id, DATE_FORMAT(req_date, '%D %M %Y')r_date, status FROM repairs\
                WHERE type = 'reparaciones' AND MONTH(req_date) = ? AND YEAR(req_date) = ?", [month, year], (error, repairResults) => {
                   if(error) throw error;

                   res.render('admin-summary', {userData: user, 
                    stockData: stockResults,
                    stock:productsCount,
                    stockPrice: productsValue,
                    diffProducts: stockResults.length,
                    totalBills: billsPrice,
                    billsCount: billsResults.length,
                    bills: billsResults,
                    maintenances: maintenanceResults,
                    repairs: repairResults,
                    maintenancesCount: maintenanceResults.length,
                    repairsCount: repairResults.length});
               });
            });
        });
    });
} 


exports.generateSummaryByDMY = (req, res) => {
    const { user } = req;
    const { dd:day, mm:month, yy:year } = req.params;
    connection.query('SELECT p.product_sku, p.product_name, p.product_price, s.quantity\
    FROM products p JOIN stock s ON p.product_id = s.product_id', (error, stockResults) => {
        if(error) throw error;
        let productsCount = 0;
        let productsValue = 0;
        stockResults.forEach(( {product_price, quantity} ) => {
            productsCount += parseInt(quantity);
            productsValue +=  parseInt(product_price);
        });
        connection.query("SELECT id, DATE_FORMAT(payment_date, '%D %M %Y')p_date, total_price FROM bills WHERE DAY(payment_date) = ? AND MONTH(payment_date) = ? \
        AND YEAR(payment_date) = ?",
        [day, month, year],
        (error, billsResults) => {
            if(error) throw error;
            let billsPrice = 0;
            billsResults.forEach( ( {total_price} ) => {
                billsPrice += parseInt(total_price);
            });

            connection.query("SELECT repair_id, DATE_FORMAT(req_date, '%D %M %Y')r_date, status FROM repairs\
             WHERE type = 'mantenciones' AND DAY(req_date) = ? AND MONTH(req_date) = ? AND YEAR(req_date) = ? ", [day, month, year], (error, maintenanceResults) => {
                if(error) throw error;

                connection.query("SELECT repair_id, DATE_FORMAT(req_date, '%D %M %Y')r_date, status FROM repairs\
                WHERE type = 'reparaciones' AND DAY(req_date) = ? AND MONTH(req_date) = ? AND YEAR(req_date) = ?", [day, month, year], (error, repairResults) => {
                   if(error) throw error;
                   res.render('admin-summary', {userData: user, 
                    stockData: stockResults,
                    stock:productsCount,
                    stockPrice: productsValue,
                    diffProducts: stockResults.length,
                    totalBills: billsPrice,
                    billsCount: billsResults.length,
                    bills: billsResults,
                    maintenances: maintenanceResults,
                    repairs: repairResults,
                    maintenancesCount: maintenanceResults.length,
                    repairsCount: repairResults.length});
               });
            });
        });
    });
} 


exports.generateCustomSummary = (req, res) => {
    const { day, month, year } = req.body;
    if(!day) {
        res.redirect(`/admin/gen_custom_summary/${month}/${year}`);
    }else {
        res.redirect(`/admin/gen_custom_summary/${day}/${month}/${year}`);
    }
}
