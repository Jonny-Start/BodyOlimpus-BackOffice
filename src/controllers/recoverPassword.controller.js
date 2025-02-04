'use strict'
require('dotenv').config();
const Message = require('../utils/Message');
const API = require('../middleware/consume_API');

const recoverPassword = {

  get: async (req, res) => {
    try {
      res.render('index', {
        body: 'recoverPassword',
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
      const { email } = req.body;

      if (!email) {
        Message.error.push('El correo electrónico es requerido');
        return res.redirect('/recoverPassword');
      }

      //Validar existencia de usuario en la base de datos
      const existUser = await API.post({ req, res, endpoint: '/company/validateExistenceByEmail', dataSend: { email: email } });

      if (existUser.data == "Company exists") {
        //Enviar correo con instrucciones para recuperar contraseña
        const responseSendMail = await API.post({ req, res, endpoint: '/sendMail/recoverPassword', dataSend: { email: email } });
        if ('error' in responseSendMail) {
          console.log(responseSendMail);
          Message.error.push(responseSendMail.error);
        } else {
          Message.success.push('Si el correo electrónico ingresado cuenta con una cuenta, se enviará un correo con las instrucciones para recuperar la contraseña');
        }
      } else {
        Message.success.push('Si el correo electrónico ingresado cuenta con una cuenta, se enviará un correo con las instrucciones para recuperar la contraseña');
      }

      return res.redirect('/recoverPassword');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error fetching data');
    }
  }


};

module.exports = recoverPassword;
