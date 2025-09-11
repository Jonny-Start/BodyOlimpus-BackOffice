'use strict'
const { getToken } = require('../utils/cookie');
const Message = require('../utils/Message');

const _template = {
    get: async (req, res) => {
        try {
            const userAdmin = req.context;
            
            res.render('index', {
                body: '_template',
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
          return res.redirect('/_template');
        } catch (error) {
          console.error(error);
          return res.status(500).send('Error fetching data');
        }
      }

}

module.exports = _template