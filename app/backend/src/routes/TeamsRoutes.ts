import * as express from 'express';
import TeamsService from '../services/TeamsService';
import TeamsController from '../controllers/TeamsController';

const teamsServiceInstance = new TeamsService();

const teamsControllerInstance = new TeamsController(teamsServiceInstance);

const teamsRouter: express.Router = express.Router();

teamsRouter.get('/', teamsControllerInstance.getAll);
teamsRouter.get('/:id', teamsControllerInstance.getById);

export default teamsRouter;
