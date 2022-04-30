import { Request, Response, NextFunction } from 'express';
import LeaderboardService from '../services/LeaderboardService';

class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  getLeaderboardHome = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const leaderboard = await this.leaderboardService.getLeaderboardHome();

      return res.status(200).json(leaderboard);
    } catch (e) {
      next(e);
    }
  };

  getLeaderboardAway = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const leaderboard = await this.leaderboardService.getLeaderboardAway();

      return res.status(200).json(leaderboard);
    } catch (e) {
      next(e);
    }
  };

  getAllLeaderbaord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const leaderboard = await this.leaderboardService.getAllLeaderboard();

      return res.status(200).json(leaderboard);
    } catch (e) {
      next(e);
    }
  };
}

export default LeaderboardController;
