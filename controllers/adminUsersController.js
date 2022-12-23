const connection = require('../database/db.js');

exports.loadUsers = (req, res) => {
    const { user } = req;
    connection.query("SELECT *, DATE_FORMAT(NOW(), '%D %M %Y')today FROM users", (error, results) => {
        if(error) throw error;
        res.render('admin-users', {userData: user, data:results})
    });
}