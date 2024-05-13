import Router from 'express';
import AppController from '../controllers/AppController';
import UserController from '../controllers/UsersController';

const router = Router();

// Get status of redis and mongo client
router.get('/status', AppController.getStatus);

// Get stats of user and file number
router.get('/stats', AppController.getStats);

// Post request to save new user
router.post('/users', UserController.postNew);

module.exports = router;
