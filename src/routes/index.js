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
router.route('/resetPassword')
    .get(validateAccess, validateToken, resetPassword.get)
    .post(validateAccess, validateToken, resetPassword.post);
/**
 * @separator
*/
const requestCreateAccount = require('../controllers/requestCreateAccount.controller.js');
router.route('/requestCreateAccount').get(requestCreateAccount.get).post(requestCreateAccount.post);
/**
 * @separator
*/
const create_account = require('../controllers/createAccount.controller.js');
router.route('/createAccount').get(create_account.get).post(create_account.post);
/**
 * @separator
*/
const company = require('../controllers/company.controller.js');
router.route('/company').get(validateAccess, company.get).post(validateAccess, company.post);
router.route('/company/legal').get(validateAccess, company.get).post(validateAccess, company.post);
router.route('/company/advanced').get(validateAccess, company.get).post(validateAccess, company.post);
/**
 * @separator
*/
const invoiceRegistration = require('../controllers/invoice/registration.controller.js');
router.route('/invoice/registration').get(invoiceRegistration.get).post(invoiceRegistration.post);
/**
 * @separator
*/
const users = require('../controllers/users.controller.js');
router.route('/users').get(validateAccess, users.get).post(validateAccess, users.post);

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