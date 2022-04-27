import Teams from '../database/models/teams';
import Matches from '../database/models/matches';
import Camelizer from '../utils/Camelizer';
import IMatches from '../interfaces/IMatches';

class MatchesService {
  getAll = async () => {
    const matches: any = await Matches.findAll({
      include: [
        { model: Teams, as: 'teamHome', attributes: [['team_name', 'teamName']] },
        { model: Teams, as: 'teamAway', attributes: [['team_name', 'teamName']] },
      ],
    });

    const matchesCamelized: _.Dictionary<string | number>[] = matches
      .map((match: any) => Camelizer.snakeToCamel(match.dataValues));

    return matchesCamelized;
  };

  getOnGoingMatches = async () => {
    const matches: any = await Matches.findAll({
      where: { in_progress: true },
      include: [
        { model: Teams, as: 'teamHome', attributes: [['team_name', 'teamName']] },
        { model: Teams, as: 'teamAway', attributes: [['team_name', 'teamName']] },
      ],
    });

    const matchesCamelized: _.Dictionary<string | number>[] = matches
      .map((match: any) => Camelizer.snakeToCamel(match.dataValues));

    return matchesCamelized;
  };

  getConcludedMatches = async () => {
    const matches: any = await Matches.findAll({
      where: { in_progress: false },
      include: [
        { model: Teams, as: 'teamHome', attributes: [['team_name', 'teamName']] },
        { model: Teams, as: 'teamAway', attributes: [['team_name', 'teamName']] },
      ],
    });

    const matchesCamelized: _.Dictionary<string | number>[] = matches
      .map((match: any) => Camelizer.snakeToCamel(match.dataValues));

    return matchesCamelized;
  };

  createMatch = async (match: IMatches) => {
    const createdMatch: Matches = await Matches.create({
      home_team: match.homeTeam,
      away_team: match.awayTeam,
      home_team_goals: match.homeTeamGoals,
      away_team_goals: match.awayTeamGoals,
      in_progress: match.inProgress,
    }, { raw: true });

    return createdMatch.id;
  };

  finishMatch = async (id: number) => {
    await Matches.update({ in_progress: false }, { where: { id } });
  };

  editMatch = async (id: number, homeGoals: number, awayGoals: number) => {
    await Matches.update({
      home_team_goals: homeGoals,
      away_team_goals: awayGoals,
    }, { where: { id } });
  };
}

export default MatchesService;
