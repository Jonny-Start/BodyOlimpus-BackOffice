'use strict'
const { getToken } = require('../utils/cookie');
const Message = require('../utils/Message');

const profile = {
    get: async (req, res) => {
        try {
            const userAdmin = req.context;

            res.render('index', {
                body: 'profile',
                userAdmin,
                errors: Message.error,
                success: Message.success
            });
            return Message.clearMessages();
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        }
    },
    post: async (req, res) => {
        try {    
          return res.redirect('/profile');
        } catch (error) {
          console.error(error);
          return res.status(500).send('Error fetching data');
        }
      }

}

module.exports = profile