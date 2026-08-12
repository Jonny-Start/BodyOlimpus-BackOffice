'use strict'
const Http = require('../../utils/http');
const { getToken } = require('../../utils/cookie');

const invoiceRegistration = {

    get: async (req, res) => {
        const datos = req.query;

        let gym = { name: "Gimnasio", img_path: null, nit: "" };
        try {
            const token = getToken(req);
            if (token) {
                const response = await Http.get('company/invoice-data', token);
                if (response && response.data) {
                    gym = response.data;
                }
            }
        } catch (error) {
            console.error('Error al obtener datos del gimnasio para factura:', error.message || error);
        }

        // Determinar si hay datos reales o usar datos de ejemplo para previsualización
        const isPreview = !datos.cliente;

        const factura = {
          cliente: datos.cliente || 'Juan Pérez (Ejemplo)',
          documento: datos.documento || '1.234.567.890',
          fecha: new Date().toLocaleDateString('es-CO'),
          plan: datos.plan || 'Mensual',
          duracion: datos.duracion || '30 días',
          metodoPago: datos.metodoPago || 'Efectivo',
          total: parseInt(datos.total) || 90000,
          logo: gym.img_path ? `${(process.env.URL_API || '').replace(/\/$/, '')}/${gym.img_path.replace(/^\//, '')}` : null,
          nombreGym: gym.name || 'Gimnasio',
          nitGym: gym.nit || null,
          isPreview
        };
      
        res.render('invoiceViews/facturaPreview', { factura });
    },
    post: async (req, res) => {
        const datos = req.body;

        let gym = { name: "Gimnasio", img_path: null, nit: "" };
        try {
            const token = getToken(req);
            if (token) {
                const response = await Http.get('company/invoice-data', token);
                if (response && response.data) {
                    gym = response.data;
                }
            }
        } catch (error) {
            console.error('Error al obtener datos del gimnasio para factura:', error.message || error);
        }

        const factura = {
            cliente: datos.cliente || 'Juan Pérez (Ejemplo)',
            documento: datos.documento || '1.234.567.890',
            fecha: new Date().toLocaleDateString('es-CO'),
            plan: datos.plan || 'Mensual',
            duracion: datos.duracion || '30 días',
            metodoPago: datos.metodoPago || 'Efectivo',
            total: parseInt(datos.total) || 90000,
            logo: gym.img_path ? `${(process.env.URL_API || '').replace(/\/$/, '')}/${gym.img_path.replace(/^\//, '')}` : null,
            nombreGym: gym.name || 'Gimnasio',
            nitGym: gym.nit || null,
            isPreview: false
        };

        res.render('invoiceViews/facturaPreview', { factura });
    }

}

module.exports = invoiceRegistration