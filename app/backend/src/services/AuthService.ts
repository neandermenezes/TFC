import * as Jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import Users from '../database/models/users';

class AuthService {
  private _secret: string;

  private _config: { expiresIn: string };

  constructor() {
    this._secret = readFileSync('./jwt.evaluation.key', 'utf-8');
    this._config = { expiresIn: '25m' };
  }

  authenticate = async (email: string, password: string) => {
    const user = await Users.findOne({
      where: { email, password },
      attributes: { exclude: ['password'] },
    });

    if (!user) return false;

    const { ...payload } = user;

    const token = Jwt.sign(
      payload,
      this._secret,
      this._config as Jwt.SignOptions,
    );

    return { user, token };
  };

  verifyToken(token: string) {
    try {
      const user = <Jwt.JwtPayload>Jwt.verify(token, this._secret);
      return user;
    } catch (e) {
      return false;
    }
  }
}

export default AuthService;
