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
                return res.redirec('/login');
            }

            res.render('index', {
                body: 'resetPassword',
                errors: Message.error,
                success: Message.success,
            });
            return Message.clearMessages();
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error fetching data');
        }
    }

};

module.exports = resetPassword;
