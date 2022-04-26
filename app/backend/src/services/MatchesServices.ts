import Teams from '../database/models/teams';
import Matches from '../database/models/matches';
import Camelizer from '../utils/Camelizer';

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
}

export default MatchesService;
