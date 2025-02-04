const axios = require('axios');
require('dotenv').config();
const Message = require('../utils/Message');
const URL_BASE = process.env.URL_API + '/api';
const { getToken } = require('../utils/cookie');

module.exports = API = {
  get: async ({ req, res, endpoint, firstApi = true }) => {
    // Extraer la URL original del endpoint
    const endpointOrigin = req.originalUrl;

    try {
      // Extraer el token de autenticación
      const token = getToken(req);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const URL = `${firstApi ? URL_BASE : process.env.URL_API}${endpoint}`;

      const response = await axios.get(URL, config);

      // Estandarización: Verificar si la respuesta sigue el esquema de éxito
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }

      // Estandarización: Manejar respuestas de error de la API
      if (response.data.status === 'error') {
        return {
          success: false,
          error: response.data.error.code,
          message: response.data.error.details,
        };
      }

      // Si la respuesta no sigue el esquema esperado
      return {
        success: false,
        error: 'UNKNOWN_RESPONSE',
        message: 'The API response does not follow the expected format.',
      };
    } catch (error) {

      if (error.code === 'ECONNREFUSED') {
        return {
          success: false,
          error: 'CONNECTION_REFUSED',
          message: 'Error de conexión con el servidor de la API.',
        };
      }

      if (error.response.data) {
        return {
          success: false,
          error: error.response.data?.error?.code || error.response.data?.error?.details || 'UNKNOWN_ERROR',
          message: error.response.data?.message || 'An unexpected error occurred.',
        };
      }

      // Manejar errores de conexión o respuesta no estándar
      console.error('Error fetching data: ', error);

      // Manejar otros errores
      return {
        success: false,
        error: 'INTERNAL_ERROR',
        message: error.message || 'An unexpected error occurred.',
      };
    }
  },
  post: async ({ req, res, endpoint, dataSend = [] }) => {
    // Extraer la URL original del endpoint
    const endpointOrigin = req.originalUrl;

    try {
      // Extraer el token de autenticación
      const token = getToken(req);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const URL = `${URL_BASE}${endpoint}`;

      const response = await axios.post(URL, dataSend, config);

      // Estandarización: Verificar si la respuesta sigue el esquema de éxito
      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }

      // Estandarización: Manejar respuestas de error de la API
      if (response.data.status === 'error') {
        return {
          success: false,
          error: response.data.error.code,
          message: response.data.error.details,
        };
      }

      // Si la respuesta no sigue el esquema esperado
      return {
        success: false,
        error: 'UNKNOWN_RESPONSE',
        message: 'The API response does not follow the expected format.',
      };
    } catch (error) {

      if (error.code === 'ECONNREFUSED') {
        return {
          success: false,
          error: 'CONNECTION_REFUSED',
          message: 'Error de conexión con el servidor de la API.',
        };
      }

      if (error.response.data) {
        return {
          success: false,
          error: error.response.data?.error?.code || error.response.data?.error?.details || 'UNKNOWN_ERROR',
          message: error.response.data?.message || 'An unexpected error occurred.',
        };
      }

      // Manejar errores de conexión o respuesta no estándar
      console.error('Error fetching data: ', error);

      // Manejar otros errores
      return {
        success: false,
        error: 'INTERNAL_ERROR',
        message: error.message || 'An unexpected error occurred.',
      };
    }
  }
};
