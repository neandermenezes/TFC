import * as express from 'express';
import MatchesService from '../services/MatchesServices';
import MatchesController from '../controllers/MatchesController';

const matchesServiceInstance = new MatchesService();

const matchesControllerInstance = new MatchesController(matchesServiceInstance);

const matchesRouter: express.Router = express.Router();

matchesRouter.get('/', matchesControllerInstance.getAll);

export default matchesRouter;
