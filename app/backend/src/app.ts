import * as express from 'express';
import * as cors from 'cors';
import loginRouter from './routes/LoginRoutes';
import teamsRouter from './routes/TeamsRoutes';
import matchesRouter from './routes/MatchesRoutes';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.config();
    this.app.use(cors());
    this.app.use(express.json());
  }

  private config(): void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
  }

  private routes(): void {
    this.app.use('/login', loginRouter);
    this.app.use('/teams', teamsRouter);
    this.app.use('/matches', matchesRouter);
  }

  public start(PORT: string | number): void {
    this.routes();
    this.app.listen(PORT, () => console.log(`App running on port: ${PORT}`));
  }
}

export { App };

export const { app } = new App();
