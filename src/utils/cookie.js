const { name } = require('ejs');
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
    validateAccess: async (req, res, next) => {
        const token = req.cookies.token || req.query.token;
        const origin = req.originalUrl;

        //Validación por si deseo ingresar a algun logar que no sea el login y no tengo token
        if (!token && (origin !== '/login' && origin !== '/')) {
            Message.error.push('No tienes acceso para la página que quieres ingresar');
            return res.redirect('/login');
        }

        //Validación por si deseo ingresar al login y ya tengo token
        if (!!token && (origin === '/login' || origin === '/')) {
            return res.redirect('/home');
        }

        if (token) {
            //Estraer los datos
            const dataUser = await API.get({ req, res, endpoint: '/userAdmin/getUserByToken?token=' + token });
            if ('error' in dataUser) {
                if (dataUser.error === 'INVALID_TOKEN') {
                    Message.error.push('Token inválido o no encontrado');
                    res.clearCookie('token');
                    return res.redirect("/login");
                } else if (dataUser.error === 'TOKEN_EXPIRED') {
                    Message.error.push('Token expirado, sin permisos para acceder');
                    res.clearCookie('token');
                    return res.redirect("/login");
                }
                Message.error.push('Error al obtener datos de usuario');
                res.clearCookie('token');
                return res.redirect("/login");
            }
            req.context = {
                email: dataUser.data.email,
                id_user_admin: dataUser.data.id_user_admin,
                name: dataUser.data.name,
                last_name: dataUser.data.last_name,
                role: dataUser.data.role,
                company_name: dataUser.data.company_name,
                img_profile: dataUser.data.img_profile,
            };
        }


        next();
    }
};