'use strict'
require('dotenv').config();
const Message = require('../utils/Message');
const API = require('../middleware/consume_API');

const requestCreateAccount = {

    get: async (req, res) => {
        try {
            const notification = Message.success.length > 0;

            res.render('index', {
                body: 'request_create_account',
                notification: notification,
                errors: Message.error,
                success: Message.success,
            });
            return Message.clearMessages();
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error fetching data');
        }
    },

    post: async (req, res) => {
        try {
            const { name, last_name, email } = req.body;
            if (!name) {
                Message.error.push('El nombre es requerido');
                return res.redirect('/requestCreateAccount');
            }
            if (!last_name) {
                Message.error.push('El apellido es requerido');
                return res.redirect('/requestCreateAccount');
            }
            if (!email) {
                Message.error.push('El correo electrónico es requerido');
                return res.redirect('/requestCreateAccount');
            }

            // Validar que el correo no este registrado
            const existUser = await API.post({ req, res, endpoint: '/userAdmin/validateExistenceByEmail', dataSend: { email: email } });
            if ('error' in existUser && existUser.error != 'RESOURCE_NOT_FOUND') {
                Message.error.push('Error al validar existencia de usuario');
                return res.redirect('/requestCreateAccount');
            }

            const createAccountRequest = await API.post({ req, res, endpoint: '/userAdmin/createAccountRequest', dataSend: { name, last_name, email } });
            if ('error' in createAccountRequest) {
                Message.error.push('Error al solicitar creación de cuenta');
                return res.redirect('/requestCreateAccount');
            } else if ('success' in createAccountRequest) {
                Message.success.push('Solicitud de creación de cuenta enviada');
            } else {
                Message.success.push('Proceso completado sin mensaje de confirmación');
            }

            res.redirect('requestCreateAccount');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error fetching data');
        }
    }

};

module.exports = requestCreateAccount;
