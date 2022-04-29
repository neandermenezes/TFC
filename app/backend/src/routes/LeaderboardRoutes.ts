import * as express from 'express';
import LeaderboardService from '../services/LeaderboardService';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardServiceInstance = new LeaderboardService();

const leaderboardControllerInstance = new LeaderboardController(leaderboardServiceInstance);

const leaderboardRouter: express.Router = express.Router();

leaderboardRouter.get(
  '/home',
  leaderboardControllerInstance.getLeaderboard,
);

export default leaderboardRouter;
