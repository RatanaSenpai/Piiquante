const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const passwordValidationMiddleware = require('../middleware/passwordValidation');

router.post('/signup', passwordValidationMiddleware, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;