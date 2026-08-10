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

      // Catálogo completo de métodos de pago disponibles
      const getAllPaymentMethods = await Http.get('paymentMethods', getToken(req));
      if ('error' in getAllPaymentMethods) {
        Message.error.push('Error al obtener los métodos de pago');
        console.error(getAllPaymentMethods.error);
      }

      // Métodos de pago que ya tiene registrados la empresa
      let companyPaymentMethods = [];
      let companySchedules = [];
      if (dataCompany.company_id) {
        const getCompanyPaymentMethods = await Http.get(`paymentMethods/company/${dataCompany.company_id}`, getToken(req));
        if ('error' in getCompanyPaymentMethods) {
          console.error('Error al obtener métodos de pago de la empresa:', getCompanyPaymentMethods.error);
        } else {
          companyPaymentMethods = getCompanyPaymentMethods.data || [];
        }

        // Horarios de apertura de la empresa
        const getCompanySchedules = await Http.get(`schedules/company/${dataCompany.company_id}`, getToken(req));
        if ('error' in getCompanySchedules) {
          console.error('Error al obtener horarios de la empresa:', getCompanySchedules.error);
        } else {
          companySchedules = getCompanySchedules.data || [];
        }
      }

      res.render('index', {
        options: {
          socialNetworks: getAllSocialNetworks.data || [],
          paymentMethods: getAllPaymentMethods.data || [],
          companyPaymentMethods,
          companySchedules,
        },
        body: 'company',
        dataCompany,
        environment,
        userAdmin,
        MAPS_API_KEY: process.env.MAPS_API_KEY,
        API_BASE_URL: process.env.URL_API,
        token: getToken(req),
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