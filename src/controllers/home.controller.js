'use strict'
const { getToken } = require('./../utils/cookie');
const Message = require('./../utils/Message');

const home = {

    get: async (req, res) => {
        try {
            const userAdmin = req.context;
            res.render('index', {
                body: 'home',
                userAdmin,
                errors: Message.error,
                success: Message.success
            });
            return Message.clearMessages();
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        }
    }

}

module.exports = home