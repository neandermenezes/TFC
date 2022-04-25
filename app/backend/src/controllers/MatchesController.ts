import { Request, Response, NextFunction } from 'express';
import IMatches from '../interfaces/IMatches';

class MatchesController {
  constructor(private matchesService: any) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { inProgress } = req.query;

      let matches: IMatches[] = [];

      if (!inProgress) matches = await this.matchesService.getAll();

      if (inProgress !== undefined && inProgress === 'true') {
        matches = await this.matchesService.getOnGoingMatches();
      }

      if (inProgress !== undefined && inProgress === 'false') {
        matches = await this.matchesService.getConcludedMatches();
      }

      return res.status(200).json(matches);
    } catch (e) {
      next(e);
    }
  };
}

export default MatchesController;
