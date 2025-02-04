'use strict'
require('dotenv').config();
const Message = require('../utils/Message');
const API = require('../middleware/consume_API');

const registerAccount = {

    get: async (req, res) => {
        try {
            res.render('index', {
                body: 'registerAccount',
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

module.exports = registerAccount;
