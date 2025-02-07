'use strict'
require('dotenv').config();
const Message = require('../utils/Message');
const API = require('../middleware/consume_API');

const resetPassword = {

    get: async (req, res) => {
        try {
            const { token } = req.query;
            if (!token) {
                Message.error.push('Token no encontrado');
                return res.redirect('/login');
            }

            res.render('index', {
                token,
                body: 'resetPassword',
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
            const { newPassword, confirmPassword } = req.body;
            const { token } = req.query;

            if (!token) {
                Message.error.push('Token no encontrado');
                return res.redirect('/login');
            }

            if (!newPassword || !confirmPassword) {
                Message.error.push('Por favor, rellene todos los campos');
                return res.redirect(`/resetPassword?token=${token}`);
            }

            if (newPassword !== confirmPassword) {
                Message.error.push('Las contraseñas no coinciden');
                return res.redirect(`/resetPassword?token=${token}`);
            }

            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                Message.error.push('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
                return res.redirect(`/resetPassword?token=${token}`);
            }

            const data = { token, newPassword };

            const response = await API.post({ req, res, endpoint: '/company/resetPassword', dataSend: data });

            if ('error' in response) {
                if (response.error === 'INVALID_TOKEN') {
                    Message.error.push('Token inválido o no encontrado');
                }
                return res.redirect(`/resetPassword?token=${token}`);

            }

            if (response.error) {
                Message.error.push(response.message);
                return res.redirect(`/resetPassword?token=${token}`);
            }

            Message.success.push(response.message);
            return res.redirect('/login');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error fetching data');
        }
    },

};

module.exports = resetPassword;
