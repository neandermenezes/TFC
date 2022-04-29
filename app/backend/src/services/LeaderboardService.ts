import { Op } from 'sequelize';
import Matches from '../database/models/matches';
import Teams from '../database/models/teams';

class LeaderboardService {
  // private getTable = ()

  private testing = (array: any, teamId: number) => {
    // let totalPoints: number;
    // const totalGames = array.length;
    // let totalVictories: number;
    // let totalDraws: number;
    // let totalDraws: number;
    // let goalsFavor: number;
    // let goalsOwn: number;

    console.log(array[0]);
  };

  getLeaderboard = async () => {
    const teams = await Teams.findAll({ raw: true });

    const promises = await Promise.all(teams.map((team) => Matches.findAll({
      where: {
        in_progress: false,
        [Op.or]: [{ home_team: team.id }, [{ away_team: team.id }]],
      },
      raw: true,
    })));

    const result = await promises.map((promise, index) => this.testing(promise, index + 1));

    return promises;
  };
}

export default LeaderboardService;
