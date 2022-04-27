import * as express from 'express';
import TeamsService from '../services/TeamsService';
import TeamsController from '../controllers/TeamsController';
import Validations from '../middlewares/Validations';

const teamsServiceInstance = new TeamsService();

const validationsInstance = new Validations();

const teamsControllerInstance = new TeamsController(teamsServiceInstance);

const teamsRouter: express.Router = express.Router();

teamsRouter.get('/', teamsControllerInstance.getAll, validationsInstance.error);
teamsRouter.get('/:id', teamsControllerInstance.getById, validationsInstance.error);

export default teamsRouter;
