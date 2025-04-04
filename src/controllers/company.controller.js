'use strict'
const { getToken } = require('../utils/cookie');
const Message = require('../utils/Message');

const company = {

    get: async (req, res) => {
        try {
            const userAdmin = req.context;
            const environment = req.url.split('/')[2] || 'basic';
            res.render('index', {
                body: 'company',
                environment,
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
          return res.redirect('/company');
        } catch (error) {
          console.error(error);
          return res.status(500).send('Error fetching data');
        }
      }

}

module.exports = company