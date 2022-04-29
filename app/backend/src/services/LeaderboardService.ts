/* eslint-disable max-lines-per-function */
import Matches from '../database/models/matches';
import Teams from '../database/models/teams';

class LeaderboardService {
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
    if (homeGoals > awayGoals) return 'win';
    if (homeGoals < awayGoals) return 'loss';
    return 'draw';
  };

  // private getLeaderboardInfo = (isHome:status: string) => {

  // };

  private getLeaderboardByTeam = (matches: any, isHome: boolean, teamName: string) => {
    const leaderboard = {
      teamName,
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: 0
    };

    matches.forEach((match: any) => {
      leaderboard.totalGames += 1;
      if (isHome) {
        const status = this.getWinnerTeam(match.home_team_goals, match.away_team_goals);

        if (status === 'win') {
          leaderboard.totalVictories += 1;
          leaderboard.totalPoints += 3;
        } else if (status === 'loss') {
          leaderboard.totalLosses += 1;
        } else {
          leaderboard.totalDraws += 1;
          leaderboard.totalPoints += 1;
        }

        leaderboard.goalsFavor += match.home_team_goals;
        leaderboard.goalsOwn += match.away_team_goals;
      } else {
        const status = this.getWinnerTeam(match.away_team_goals, match.home_team_goals);

        if (status === 'win') {
          leaderboard.totalVictories += 1;
          leaderboard.totalPoints += 3;
        } else if (status === 'loss') {
          leaderboard.totalLosses += 1;
        } else {
          leaderboard.totalDraws += 1;
          leaderboard.totalPoints += 1;
        }

        leaderboard.goalsFavor += match.home_team_goals;
        leaderboard.goalsOwn += match.away_team_goals;
      }
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
    })));

    const homeClassification = homeMatches
      .map((teamMatches, index) => this
        .getLeaderboardByTeam(teamMatches, true, teams[index].team_name));

    return homeClassification.sort(this.sortTable);
  };

  getLeaderboard = async () => {
    const teams = await Teams.findAll({ raw: true });

    // const homeMatches = await Promise.all(teams.map((team) => Matches.findAll({
    //   where: {
    //     in_progress: false,
    //     home_team: team.id,
    //   },
    // })));

    const awayMatches = await Promise.all(teams.map((team) => Matches.findAll({
      where: {
        in_progress: false,
        away_team: team.id,
      },
    })));

    // const homeClassification = homeMatches
    //   .map((teamMatches) => this.getLeaderboardByTeam(teamMatches, true));

    const awayClassification = awayMatches
      .map((teamMatches, index) => this
        .getLeaderboardByTeam(teamMatches, false, teams[index].team_name));

    return awayClassification;
  };
}

export default LeaderboardService;
