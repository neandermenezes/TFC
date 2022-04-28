import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import Teams from '../database/models/teams';
import Users from '../database/models/users';
import AuthService from '../services/AuthService';

const authService = new AuthService();

class Validations {
  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'All fields must be filled' });

    next();
  };

  validToken = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({ message: 'Missing authorization' });

    const validUser: any = await authService.verifyToken(authorization);
    if (!validUser) return res.status(401).json({ message: 'Missing authorization' });

    const user = await Users.findOne({
      where: {
        email: validUser.email,
      },
      raw: true,
    });

    if (!user) return res.status(401).json({ message: 'Incorrect email or password' });

    req.body.user = user;

    next();
  };

  equalTeams = async (req: Request, res: Response, next: NextFunction) => {
    const { homeTeam, awayTeam } = req.body;
    console.log(homeTeam, awayTeam);
    if (homeTeam === awayTeam) {
      return res.status(401)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }

    next();
  };

  teamExists = async (req: Request, res: Response, next: NextFunction) => {
    const { homeTeam, awayTeam } = req.body;

    const teamHome = await Teams.findByPk(homeTeam, { raw: true });
    const teamAway = await Teams.findByPk(awayTeam, { raw: true });

    if (!teamHome || !teamAway) {
      return res.status(404).json({ message: 'There is no team with such id!' });
    }
    next();
  };

  error: ErrorRequestHandler = (err, _req, res, _next) => {
    const status = err.status ? err.status : 500;

    console.log(status);

    return res.status(status).json({ message: err.message });
  };
}

export default Validations;
