'use strict'
require('dotenv').config();
const Message = require('../utils/Message');
const API = require('./consume_api');

const resetPassword = {

    get: async (req, res) => {
        try {
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
