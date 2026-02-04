'use strict'
const { getToken } = require('../utils/cookie');
const Message = require('../utils/Message');
const Http = require('../utils/http');

const company = {
  get: async (req, res) => {
    try {
      const userAdmin = req.context;
      const environment = req.url.split('/')[2] || 'basic';

      let dataCompany = {};
      const getCompany = await Http.get(`company/allDataBasic`, getToken(req));
      if ('error' in getCompany) {
        Message.error.push('Error al obtener datos de la empresa');
        console.error(getCompany.error);
      } else {
        dataCompany = getCompany.data;
      }

      //Todas las opciones de redes sociales
      const getAllSocialNetworks = await Http.get('socialNetworks', getToken(req));
      if ('error' in getAllSocialNetworks) {
        Message.error.push('Error al obtener las redes sociales');
        console.error(getAllSocialNetworks.error);
      }

      res.render('index', {
        options: {
          socialNetworks: getAllSocialNetworks.data || []
        },
        body: 'company',
        dataCompany,
        environment,
        userAdmin,
        MAPS_API_KEY: process.env.MAPS_API_KEY,
        API_BASE_URL: process.env.URL_API,
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
      const body = req.body;

      // Actualizar datos basicos de la empresa y posibles redes sociales
      if (body.name) {
        if (req.files) {
          body.files = req.files;
        }
        const updateCompany = await Http.put('company', body, getToken(req));
        if ('error' in updateCompany) {
          Message.error.push(updateCompany.error || 'Error al actualizar la empresa');
        } else {
          Message.success.push('Empresa actualizada correctamente');
        }

        // Actualizar redes sociales
        // if(body.){

        // }

      }

      return res.redirect('/company');
    } catch (error) {
      console.error(error);
      Message.error.push(error.message || 'Error al actualizar la empresa');
      return res.redirect('/company');
    }
  }

}

module.exports = company