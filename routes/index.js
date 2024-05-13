import Router from 'express';
import AppController from '../controllers/AppController';
import UserController from '../controllers/UsersController';

const router = Router();

router.get('/status', AppController.getStatus);

router.get('/stats', AppController.getStats);

module.exports = router;
