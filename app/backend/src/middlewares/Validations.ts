import { Request, Response, NextFunction } from 'express';
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

    const validUser = authService.verifyToken(authorization);

    if (!validUser) return res.status(401).json({ message: 'Missing authorization' });

    console.log(validUser.dataValues);
    const user = await Users.findOne({
      where: {
        email: validUser.dataValues.email,
        password: validUser.dataValues.password,
      },
    });

    if (!user) return res.status(401).json({ message: 'Incorrect email or password' });

    req.body.user = user;

    next();
  };
}

export default Validations;
