import { Request, Response, NextFunction } from 'express';
import TeamsService from '../services/TeamsService';

class TeamsController {
  constructor(private teamsService: TeamsService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teams = await this.teamsService.getAll();

      if (!teams) return res.status(401).json({ message: 'No teams found' });

      return res.status(200).json(teams);
    } catch (e) {
      next(e);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const teamFound = await this.teamsService.getById(+id);

      if (!teamFound) return res.status(401).json({ message: 'TO BE DONE' });

      return res.status(200).json(teamFound);
    } catch (e) {
      next(e);
    }
  };
}

export default TeamsController;
