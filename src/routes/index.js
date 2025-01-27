const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');
const homeController = require('../controllers/home.controller');
const { removeToken, validateAccess } = require('../utils/cookie');
const recoverPassword = require('../controllers/recoverPassword.controller');


const notImplement = (req, res) => {
    return res.json({ message: 'Aun no se implementa' });
}


router.get('/privacy_policies', (req, res) => {
    res.render('privacy_policies');
});
router.get('/terms', (req, res) => {
    res.render('terms');
});

router.get('/', validateAccess, loginController.get);
router.route('/login').get(validateAccess, loginController.get).post(validateAccess, loginController.post);

router.get('/logout', async (req, res) => {
    await removeToken(res);
    res.redirect('/login');
});

router.route('/recoverPassword').get(recoverPassword.get).post(recoverPassword.post);

router.get('/home', validateAccess, homeController.get)

const registerAccount = require('../controllers/registerAccount.controller.js');
router.get('/registerAccount', registerAccount.get);

module.exports = router;