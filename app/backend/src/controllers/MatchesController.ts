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

  createMatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress }: IMatches = req.body;
      const match: IMatches = { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress };

      const createdMatchId: number = await this.matchesService
        .createMatch(match);

      if (!createdMatchId) return res.status(401).json({ message: 'error' });

      return res.status(201).json({ id: createdMatchId, ...match });
    } catch (e) {
      next(e);
    }
  };

  finishMatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await this.matchesService.finishMatch(+id);

      return res.status(200).json({ id });
    } catch (e) {
      next(e);
    }
  };

  editMatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { homeTeamGoals, awayTeamGoals } = req.body;
      console.log(homeTeamGoals, awayTeamGoals, 'controller');
      await this.matchesService.editMatch(+id, homeTeamGoals, awayTeamGoals);

      return res.status(200).json({ id });
    } catch (e) {
      next(e);
    }
  };
}

export default MatchesController;
