import * as express from 'express';
import Validations from '../middlewares/Validations';
import LoginController from '../controllers/LoginController';
import AuthService from '../services/AuthService';

const validationsInstance = new Validations();

const authServiceInstance = new AuthService();

const loginControllerInstance = new LoginController(authServiceInstance);

const loginRouter: express.Router = express.Router();

loginRouter.post('/', validationsInstance.login, loginControllerInstance.login);
loginRouter.get('/validate', validationsInstance.validToken, loginControllerInstance.validate);

export default loginRouter;
