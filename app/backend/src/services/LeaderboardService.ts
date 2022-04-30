import ILeaderboard from '../interfaces/ILeaderboard';
import Matches from '../database/models/matches';
import Teams from '../database/models/teams';
import { IMatchesSnake } from '../interfaces/IMatches';

const leaderboardStructure = {
  name: '',
  totalPoints: 0,
  totalGames: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
  efficiency: 0,
};
class LeaderboardService {
  private mergeTables = (homeTable: ILeaderboard[], awayTable: ILeaderboard[]) => {
    const sortedHomeTable = homeTable
      .sort((a: ILeaderboard, b: ILeaderboard) => a.name.localeCompare(b.name));
    const sortedAwayTable = awayTable
      .sort((a: ILeaderboard, b: ILeaderboard) => a.name.localeCompare(b.name));
    const fullTable = sortedHomeTable.map((home: ILeaderboard, index) => ({
      name: home.name,
      totalPoints: home.totalPoints + sortedAwayTable[index].totalPoints,
      totalGames: home.totalGames + sortedAwayTable[index].totalGames,
      totalVictories: home.totalVictories + sortedAwayTable[index].totalGames,
      totalDraws: home.totalDraws + sortedAwayTable[index].totalDraws,
      totalLosses: home.totalLosses + sortedAwayTable[index].totalLosses,
      goalsFavor: home.goalsFavor + sortedAwayTable[index].goalsFavor,
      goalsOwn: home.goalsOwn + sortedAwayTable[index].goalsOwn,
      goalsBalance: home.goalsBalance + sortedAwayTable[index].goalsBalance,
      effiency: +((
        (home.totalPoints + sortedAwayTable[index].totalPoints)
         / (home.totalGames * sortedAwayTable[index].totalPoints)) * 100).toFixed(2) }));
    return fullTable;
  };

  private sortTable = (a: any, b: any) => {
    if (b.totalPoints > a.totalPoints) return 1;
    if (b.totalPoints < a.totalPoints) return -1;

    if (b.totalVictories > a.totalVictories) return 1;
    if (b.totalVictories < a.totalVictories) return -1;

    if (b.goalsBalance > a.goalsBalance) return 1;
    if (b.goalsBalance < a.goalsBalance) return -1;

    if (b.goalsFavor > a.goalsFavor) return 1;
    if (b.goalsFavor < a.goalsFavor) return -1;

    if (b.goalsOwn > a.goalsOwn) return -1;
    if (b.goalsOwn < a.goalsOwn) return 1;

    return 0;
  };

  private getWinnerTeam = (homeGoals: number, awayGoals: number) => {
    const matchResult = { totalVictories: 0, totalPoints: 0, totalLosses: 0, totalDraws: 0 };
    let status = 'win';
    if (homeGoals > awayGoals) status = 'win';
    if (homeGoals < awayGoals) status = 'loss';
    if (homeGoals === awayGoals) status = 'draw';
    if (status === 'win') {
      matchResult.totalVictories += 1;
      matchResult.totalPoints += 3;
    } else if (status === 'loss') {
      matchResult.totalLosses += 1;
    } else {
      matchResult.totalDraws += 1;
      matchResult.totalPoints += 1;
    }
    return matchResult;
  };

  private getLeaderboardTableHome = (matches: IMatchesSnake[], teamName: string) => {
    const leaderboard = { ...leaderboardStructure };
    leaderboard.name = teamName;
    matches.forEach((match: IMatchesSnake) => {
      leaderboard.totalGames += 1;
      const matchResult = this.getWinnerTeam(match.home_team_goals, match.away_team_goals);
      leaderboard.totalVictories += matchResult.totalVictories;
      leaderboard.totalPoints += matchResult.totalPoints;
      leaderboard.totalLosses += matchResult.totalLosses;
      leaderboard.totalDraws += matchResult.totalDraws;
      leaderboard.goalsFavor += match.home_team_goals;
      leaderboard.goalsOwn += match.away_team_goals;
    });
    leaderboard.goalsBalance = leaderboard.goalsFavor - leaderboard.goalsOwn;
    leaderboard.efficiency = (leaderboard.totalPoints / (leaderboard.totalGames * 3)) * 100;
    leaderboard.efficiency = +leaderboard.efficiency.toFixed(2);
    return leaderboard;
  };

  private getLeaderboardTableAway = (matches: IMatchesSnake[], teamName: string) => {
    const leaderboard = { ...leaderboardStructure };
    leaderboard.name = teamName;
    matches.forEach((match: IMatchesSnake) => {
      leaderboard.totalGames += 1;
      const matchResult = this.getWinnerTeam(match.away_team_goals, match.home_team_goals);
      leaderboard.totalVictories += matchResult.totalVictories;
      leaderboard.totalPoints += matchResult.totalPoints;
      leaderboard.totalLosses += matchResult.totalLosses;
      leaderboard.totalDraws += matchResult.totalDraws;
      leaderboard.goalsFavor += match.away_team_goals;
      leaderboard.goalsOwn += match.home_team_goals;
    });
    leaderboard.goalsBalance = leaderboard.goalsFavor - leaderboard.goalsOwn;
    leaderboard.efficiency = (leaderboard.totalPoints / (leaderboard.totalGames * 3)) * 100;
    leaderboard.efficiency = +leaderboard.efficiency.toFixed(2);
    return leaderboard;
  };

  getLeaderboardHome = async () => {
    const teams = await Teams.findAll({ raw: true });

    const homeMatches = await Promise.all(teams.map((team) => Matches.findAll({
      where: {
        in_progress: false,
        home_team: team.id,
      },
      raw: true,
    })));

    const homeClassification = homeMatches
      .map((teamMatches, index) => this
        .getLeaderboardTableHome(teamMatches, teams[index].team_name));

    return homeClassification.sort(this.sortTable);
  };

  getLeaderboardAway = async () => {
    const teams = await Teams.findAll({ raw: true });

    const awayMatches = await Promise.all(teams.map((team) => Matches.findAll({
      where: {
        in_progress: false,
        away_team: team.id,
      },
      raw: true,
    })));

    const awayClassification = awayMatches
      .map((teamMatches, index) => this
        .getLeaderboardTableAway(teamMatches, teams[index].team_name));

    return awayClassification.sort(this.sortTable);
  };

  getAllLeaderboard = async () => {
    const homeTable = await this.getLeaderboardHome();
    const awayTable = await this.getLeaderboardAway();

    const result = this.mergeTables(homeTable, awayTable);

    return result.sort(this.sortTable);
  };
}

export default LeaderboardService;
