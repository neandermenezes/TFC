import * as express from 'express';
import MatchesService from '../services/MatchesServices';
import MatchesController from '../controllers/MatchesController';
import Validations from '../middlewares/Validations';

const validationsInstance = new Validations();

const matchesServiceInstance = new MatchesService();

const matchesControllerInstance = new MatchesController(matchesServiceInstance);

const matchesRouter: express.Router = express.Router();

matchesRouter.get('/', matchesControllerInstance.getAll);
matchesRouter.post(
  '/',
  validationsInstance.validToken,
  validationsInstance.equalTeams,
  validationsInstance.teamExists,
  matchesControllerInstance.createMatch,
);
matchesRouter.patch(
  '/:id/finish',
  validationsInstance.validToken,
  matchesControllerInstance.finishMatch,
);
matchesRouter.patch(
  '/:id',
  validationsInstance.validToken,
  matchesControllerInstance.editMatch,
);

export default matchesRouter;
