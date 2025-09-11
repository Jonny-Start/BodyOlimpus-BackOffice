'use strict'
const { getToken } = require('../utils/cookie');
const Message = require('../utils/Message');

const foodExerciseGroups = {
    get: async (req, res) => {
        try {
            const userAdmin = req.context;

            res.render('index', {
                body: 'foodExerciseGroups',
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
          return res.redirect('/foodExerciseGroups');
        } catch (error) {
          console.error(error);
          return res.status(500).send('Error fetching data');
        }
      }

}

module.exports = foodExerciseGroups