import * as express from 'express';

const leaderboardRouter: express.Router = express.Router();

leaderboardRouter.get(
  '/home',
);

export default leaderboardRouter;
