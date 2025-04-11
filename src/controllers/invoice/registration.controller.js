'use strict'
const invoiceRegistration = {

    get: async (req, res) => {
        const datos = req.query;

        // Supongamos que tienes guardada la info del gym
        const gym = {
          nombre: "Titanes Gym",
          //logo: "/uploads/logos/titanes-logo.png" // esto puede estar en tu base de datos
        };
      
        const factura = {
          cliente: datos.cliente,
          documento: datos.documento,
          fecha: new Date().toLocaleDateString(),
          plan: datos.plan,
          duracion: datos.duracion,
          metodoPago: datos.metodoPago,
          total: parseInt(datos.total),
          logo: gym.logo || null
        };
      
        res.render('invoiceViews/facturaPreview', { factura });
    },
    post: async (req, res) => {
        const datos = req.body;

        // Supongamos que tienes guardada la info del gym
        const gym = {
            nombre: "Titanes Gym",
            //logo: "/uploads/logos/titanes-logo.png" // esto puede estar en tu base de datos
        };

        const factura = {
            cliente: datos.cliente,
            documento: datos.documento,
            fecha: new Date().toLocaleDateString(),
            plan: datos.plan,
            duracion: datos.duracion,
            metodoPago: datos.metodoPago,
            total: parseInt(datos.total),
            logo: gym.logo || null
        };

        res.render('invoiceViews/facturaPreview', { factura });
    }

}

module.exports = invoiceRegistration