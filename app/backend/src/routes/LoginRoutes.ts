import * as express from 'express';
import Validations from '../middlewares/Validations';
import LoginController from '../controllers/LoginController';
import AuthService from '../services/AuthService';

const validations = new Validations();

const authService = new AuthService();

const loginController = new LoginController(authService);

const loginRouter: express.Router = express.Router();

loginRouter.post('/', validations.login, loginController.login);
loginRouter.get('/validate', validations.validToken, loginController.validate);

export default loginRouter;
