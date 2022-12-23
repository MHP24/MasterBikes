const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const connection = require('../database/db.js');
const { promisify } = require('util');

//Procedure
exports.register = async (req, res) => {
    try {
        const { email, username, rut, address, password, field__options, profilePicture } = req.body;
        const passwordHash = await bcryptjs.hash(password, 8);

        connection.query('INSERT INTO users SET ?', 
            {email:email, 
            username:username,
            userpassword:passwordHash,
            rut:rut,
            ocupation:field__options,
            address:address,
            role:'user',
            user_picture: profilePicture}, (error, results) => {
            if(error) {
                console.log(error);
            }
            res.redirect('/login');
        });
    }catch(err) {
        console.log(err);
    }

}

exports.login = async (req, res) => {
    try {
        const { username } = req.body;
        const { password } = req.body;
        if(!username || !password) {
            res.render('login', {
                alert: true,
                alertTitle: '¡Oops!',
                alertMessage: 'Ingrese su usuario y contraseña',
                alertIcon: 'Info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            });
        }else {
            connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
                if( results.length === 0 || ! await bcryptjs.compare(password, results[0].userpassword)) {
                    res.render('login', {
                        alert: true,
                        alertTitle: 'Error',
                        alertMessage: 'Usuario o clave incorrectas',
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                }else {
                    const id = results[0].id;
                    const token = jwt.sign({id:id}, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_TOKEN_EXPIRES
                    });
                    const cookieOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    };

                    res.cookie('jwt', token, cookieOptions);
                    res.render('login', {
                        alert: true,
                        alertTitle: 'Iniciando Sesión',
                        alertMessage: 'Redirigiendo',
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                    })
                }
            });
        }
        
    }catch(err) {
        console.log(err);
    }

}

exports.isAuthenticated = async (req, res, next) => {
    if(req.cookies.jwt) {
        try {
            const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            connection.query('SELECT * FROM users WHERE id = ?', [decode.id], (error, results) => {
                if(!results) {
                    return next()
                }
                req.user = results[0];
                // console.log(req.user);
                return next();
            });
        } catch (err) {
            console.log(err);
            return next();
        }
    }else {
        res.redirect('/login');
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/');
}

exports.isAdmin = (req, res, next) => {
    try {
        const { role } = req.user;
        if(role === 'Administrador') {
            return next();
        }else {
            res.redirect('/');
        }
    }catch(err) {
        console.log(error);
    }
}

