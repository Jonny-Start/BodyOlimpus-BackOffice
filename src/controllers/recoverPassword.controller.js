'use strict'
require('dotenv').config();
const Message = require('../utils/Message');
const API = require('./consume_api');

const recoverPassword = {

  get: async (req, res) => {
    try {
      res.render('index', {
        body: 'recoverPassword',
        errors: Message.error,
        succes: Message.success,
      });
      return Message.crearMessage();
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error fetching data');
    }
  },

  post: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        Message.error.push('El correo electrónico es requerido');
        return res.redirect('/recoverPassword');
      }

      const dataSend = { email: email }

      const response = await API.post({ req, res, endpoint: '/sendMail/recoverPassword', dataSend: dataSend });

      if (response == false) {

      }

      if (Message.error.length > 0) {
        return res.redirect('/recoverPassword');
      }

      return res.redirect('/recoverPassword');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error fetching data');
    }
  }


};

module.exports = recoverPassword;
