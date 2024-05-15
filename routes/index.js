import Router from 'express';
import AppController from '../controllers/AppController';
import UserController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

const router = Router();

// Get status of redis and mongo client
router.get('/status', AppController.getStatus);

// Get stats of user and file number
router.get('/stats', AppController.getStats);

// Post request to save new user
router.post('/users', UserController.postNew);

// Sign in user with authentication token
router.get('/connect', AuthController.getConnect);

// Sign out user based on token
router.get('/disconnect', AuthController.getDisconnect);

// Get user based on token
router.get('/users/me', UserController.getMe);

module.exports = router;
