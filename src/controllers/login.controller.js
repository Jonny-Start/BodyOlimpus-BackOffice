'use strict'
const axios = require('axios');
require('dotenv').config();
const Message = require('./../utils/message-views');
const localStorage = require('./../utils/localStorage');


const login = {

  get: async (req, res) => {
    try {
      // Ejemplo de llamada a una API con Axios
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      const data = response.data;
      res.render('index', {
        body: 'login',
        data,
        errors: Message.errorMessage,
        succes: Message.successMessage,
      });
      Message.crearMessage();
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error fetching data');
    }
  },

  post: async (req, res) => {
    try {
      //Validar req.body email y password existan
      const { email, password } = req.body;

      const URL = process.env.URL_API + '/api/company/login';

      const dataSend = {
        email,
        password
      }

      // Configuración opcional (encabezados, autenticación, etc.)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer tu_token_de_autenticación'
        }
      };

      const response = await axios.post(URL, dataSend, config)
        .then(response => response)
        .catch(error => {
          return error.response.data
        });

      const isError = response.data.data.errorMessage;
      if (isError) {
        // crear notificaciones 
        isError == 'Data in the request is invalid' ? Message.errorMessage.push('Datos incorrectos') : Message.errorMessage.push(isError);
        return res.redirect('/login');
      }
      // localStorage.push();

      const data = response.data;
      return res.render('index', {
        body: 'login',
        data
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error fetching data');
    }
  }


};

module.exports = login;
