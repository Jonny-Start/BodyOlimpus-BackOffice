const Message = require('./Message');

module.exports = cookie = {
    getToken: (req) => {
        return req.cookies.token;
    },
    setToken: (res, token) => {
        res.cookie('token', token, { httpOnly: true });
    },
    removeToken: (res) => {
        res.clearCookie('token');
    },
    validateAccess: (req, res, next) => {
        const token = req.cookies.token || req.query.token;
        const origin = req.originalUrl;

        if (!token && (origin !== '/login' && origin !== '/')) {
            Message.error.push('No tienes acceso para la página que quieres ingresar');
            return res.redirect('/login');
        }

        if(!!token && (origin === '/login' || origin === '/')){
            return res.redirect('/home');
        }

        next();
    }
};