const axios = require('axios');
require('dotenv').config();
const Message = require('../utils/Message');
const URL_BASE = process.env.URL_API + '/api';
const { getToken } = require('../utils/cookie');

module.exports = API = {
    get: ({ req, res, endpoint, data = [] }) => {

    },

    post: async ({ req, res, endpoint, dataSend = [] }) => {
        //Extraer la url del post del endpoint
        const endpointOrigin = req.originalUrl;
        try {
            //Estraer el token de autenticación
            const token = getToken(req);

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            const URL = URL_BASE + endpoint;

            const response = await axios.post(URL, dataSend, config)
                .then(response => {
                    //Error en datos de la petición, por ejemplo usuario o contraseña incorrectos
                    if (response.status === 200 && response.data.data.errorMessage === 'Data in the request is invalid') {
                        Message.error.push('Error en datos enviados');
                    }
                    return response.data;
                })
                .catch(error => {
                    //Error de conexión con el servidor de la API
                    if (error.code === 'ECONNREFUSED') {
                        Message.error.push('Error de conexión');
                    }
                    return error.response;
                });

            if (Message.error.length > 0) {
                return;
            }

            // const isError = response.data.data.error;
            // if (isError) {
            //     isError == 'Data in the request is invalid' ? Message.error.push('Datos incorrectos') : Message.error.push(isError);
            //     return res.redirect(endpointOrigin);
            // }

            const data = response.data;
            return data;
        } catch (error) {
            console.error('Error fetching data: ', error);
            return res.redirect(endpointOrigin);
        }
    }
};