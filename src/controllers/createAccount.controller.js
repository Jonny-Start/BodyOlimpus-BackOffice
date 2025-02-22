'use strict'
require('dotenv').config();
const Message = require('../utils/Message');
const API = require('../middleware/consume_API');
const { setToken } = require('./../utils/cookie');

const createAccount = {

  get: async (req, res) => {
    try {
      const { token } = req.query;
      if (!token) {
        Message.error.push('token de creación no encontrado');
      }

      const dataUser = await API.get({ req, res, endpoint: '/userAdmin/accountRequestByToken?token=' + token });
      if ('error' in dataUser) {
        Message.error.push('Error al obtener datos de usuario, cuenta ya creada o token inválido');
        return res.redirect("/login");
      }

      const isFederated = (dataUser.data?.google_id ? true : (dataUser.data?.microsoft_id ? true : false));

      res.render('index', {
        body: 'create_account',
        token: token,
        isFederated,
        dataUser: dataUser.data,
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
      const { password, confirm_password, name_gym, isFederated } = req.body;
      const { token } = req.query;
      if (!token) {
        Message.error.push('token de creación no encontrado');
        return res.redirect('/login');
      }
      if (!password && !isFederated) {
        Message.error.push('La contraseña es requerida');
        return res.redirect(`/createAccount?token=${token}`);
      }
      if (!confirm_password && !isFederated) {
        Message.error.push('Confirmar contraseña es requerido');
        return res.redirect(`/createAccount?token=${token}`);
      }
      if ((password !== confirm_password) && !isFederated) {
        Message.error.push('Las contraseñas no coinciden');
        return res.redirect(`/createAccount?token=${token}`);
      }
      if (!name_gym) {
        Message.error.push('El nombre del gimnasio es requerido');
        return res.redirect(`/createAccount?token=${token}`);
      }

      const data = {
        password,
        name_gym,
        token,
      };

      const responseCreate = await API.post({ req, res, endpoint: '/userAdmin/createAccount', dataSend: { ...data } });
      if ('error' in responseCreate) {
        Message.error.push('Error al crear cuenta');
        return res.redirect(`/createAccount?token=${token}`);
      } else {
        Message.success.push('Cuenta creada con éxito');
      }

      await setToken(res, responseCreate.data.token); // Tiene que traer el token sino se permite el acceso con el token invalido

      return res.redirect('/home');

    } catch (error) {
      console.error(error);
      return res.status(500).send('Error fetching data');
    }
  }
};

module.exports = createAccount;
