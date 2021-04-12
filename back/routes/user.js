const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/Auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/addFriend', auth, userController.addFriend);
router.post('/removeFriend', auth, userController.removeFriend);
router.post('/update', auth, userController.update);

router.get('/me', auth, userController.me);
router.get('/list', userController.list);
module.exports = router;