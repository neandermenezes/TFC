import { Request, Response, NextFunction } from 'express';
import LeaderboardService from '../services/LeaderboardService';

class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const leaderboard = await this.leaderboardService.getLeaderboardHome();

      return res.status(200).json(leaderboard);
    } catch (e) {
      next(e);
    }
  };
}

export default LeaderboardController;
