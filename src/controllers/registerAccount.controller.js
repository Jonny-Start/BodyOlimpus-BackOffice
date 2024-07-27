'use strict'
require('dotenv').config();
const Message = require('../utils/Message');
const API = require('./consume_api');

const registerAccount = {

    get: async (req, res) => {
        try {
            res.render('index', {
                body: 'registerAccount',
                errors: Message.error,
                succes: Message.success,
            });
            return Message.crearMessage();
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error fetching data');
        }
    }

};

module.exports = registerAccount;
