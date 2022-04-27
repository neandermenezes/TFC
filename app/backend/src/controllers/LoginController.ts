import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

class LoginController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      console.log('here');
      const user = await this.authService.authenticate(email, password);
      if (!user) return res.status(401).json({ message: 'Incorrect email or password' });

      return res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  };

  validate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = req.body.user;

      return res.status(200).json(role);
    } catch (e) {
      next(e);
    }
  };
}

export default LoginController;
