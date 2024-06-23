const axios = require('axios');

const mainController = {
  index: async (req, res) => {
    try {
      // Ejemplo de llamada a una API con Axios
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      const data = response.data;
      res.render('index', { data });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
    }
  }
};

module.exports = mainController;
