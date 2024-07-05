'use strict'
const { getToken } = require('./../utils/cookie');
const Message = require('./../utils/Message');

const home = {

    get: async (req, res) => {
        try {
            const data = [];
            res.render('index', {
                body: 'home',
                data
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        }
    }

}

module.exports = home