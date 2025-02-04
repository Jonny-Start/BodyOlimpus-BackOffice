const API = require('./consume_API');
const Message = require('../utils/Message');
const { getToken } = require('../utils/cookie');

const validateToken = async (req, res, next) => {
    try {
        const token = getToken(req) || req.query.token;

        if (!token) {
            Message.error.push('Token de seguridad no encontrado');
            return res.redirect('/login');
        }

        // const  = await API.get(`//${token}`, false);
        const validate_token = await API.get({ req, res, endpoint: `/validate_token?token=${token}`, firstApi: false });

        if ('error' in validate_token) {
            if (validate_token.error == 'UNAUTHORIZED') {
                if (validate_token.message == 'Token expired') {
                    Message.error.push('Token expirado');
                } else {
                    Message.error.push('Token no autorizado');
                }
            } else if (validate_token.error == 'Token not found') {
                Message.error.push('Token no encontrado');
            } else if (validate_token.error == 'UNKNOWN_ERROR') {
                Message.error.push('No se pudo validar el token');
            } else {
                Message.error.push('Error desconocido');
            }
            return res.redirect('/login');
        }

        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Error fetching data');
    }
}

module.exports = validateToken;