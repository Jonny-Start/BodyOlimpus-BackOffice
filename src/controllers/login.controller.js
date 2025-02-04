'use strict'
require('dotenv').config();
const Message = require('../utils/Message');
const API = require('../middleware/consume_API');
const { setToken } = require('./../utils/cookie');

const login = {

  get: async (req, res) => {
    try {
      res.render('index', {
        body: 'login',
        errors: Message.error,
        success: Message.success,
      });
      return Message.clearMessages();
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error fetching data');
    }
  },

  post: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        Message.error.push('Existen campos obligatorios vacíos');
        return res.redirect('/login');
      }

      const dataSend = {
        email,
        password
      }

      const response = await API.post({ req, res, endpoint: '/company/login', dataSend: dataSend });

      if ('error' in response) {
        Message.error.push('Usuario o contraseña incorrectos');
        return res.redirect('/login');
      }

      await setToken(res, response.data?.token);
      
      return res.redirect('/home');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error fetching data');
    }
  }


};

module.exports = login;
