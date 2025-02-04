const express = require('express');
const router = express.Router();
const { removeToken, validateAccess } = require('../utils/cookie');

const validateToken = require('../middleware/validateToken.js');

/**
 * @separator
*/
const loginController = require('../controllers/login.controller');
router.get('/', validateAccess, loginController.get);
router.route('/login').get(validateAccess, loginController.get).post(validateAccess, loginController.post);
/**
 * @separator
*/
const recoverPassword = require('../controllers/recoverPassword.controller');
router.route('/recoverPassword').get(recoverPassword.get).post(recoverPassword.post);
/**
 * @separator
*/
const homeController = require('../controllers/home.controller');
router.get('/home', validateAccess, homeController.get)
/**
 * @separator
*/
const registerAccount = require('../controllers/registerAccount.controller.js');
router.get('/registerAccount', registerAccount.get);
/**
 * @separator
*/
const resetPassword = require('../controllers/resetPassword.controller.js');
router.get('/resetPassword', validateAccess, validateToken, resetPassword.get);
/**
 * @separator
*/
router.get('/privacy_policies', (req, res) => {
    res.render('privacy_policies');
});
/**
 * @separator
*/
router.get('/terms', (req, res) => {
    res.render('terms');
});
/**
 * @separator
*/
router.get('/logout', async (req, res) => {
    await removeToken(res);
    res.redirect('/login');
});
module.exports = router;