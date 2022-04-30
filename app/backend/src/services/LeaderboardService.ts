import Matches from '../database/models/matches';
import Teams from '../database/models/teams';

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

  private getLeaderboardTableHome = (matches: any, teamName: string) => {
    const leaderboard = { ...leaderboardStructure };
    leaderboard.name = teamName;
    matches.forEach((match: any) => {
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

  private getLeaderboardTableAway = (matches: any, teamName: string) => {
    const leaderboard = { ...leaderboardStructure };
    leaderboard.name = teamName;
    matches.forEach((match: any) => {
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

    let start = 0;
    const merge = [];

    while (start < homeTable.length) {
      if (homeTable[start].name === awayTable[start].name) {
        merge.push({ ...homeTable[start], ...awayTable[start] });
      }
      start += 1;
    }
    return merge;
    // return merge.sort(this.sortTable);
  };
}

export default LeaderboardService;
