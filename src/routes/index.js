const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');
const homeController = require('../controllers/home.controller');
const { removeToken, validateAccess } = require('../utils/cookie');
const recoverPassword = require('../controllers/recoverPassword.controller');


const notImplement = (req, res) => {
    return res.json({ message: 'Aun no se implementa' });
}


router.get('/', validateAccess, loginController.get);
router.route('/login')
    .get(validateAccess, loginController.get)
    .post(validateAccess, loginController.post);


router.get('/logout', async (req, res) => {
    await removeToken(res);
    res.redirect('/login');
});

router.get('/recoverPassword', recoverPassword.get);
router.get('/home', validateAccess, homeController.get)

module.exports = router;