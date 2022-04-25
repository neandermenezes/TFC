import Teams from '../database/models/teams';
import Matches from '../database/models/matches';

class MatchesService {
  getAll = async () => {
    const matches = await Matches.findAll({
      include: [
        { model: Teams, as: 'teamHome', attributes: [['team_name', 'teamName']] },
        { model: Teams, as: 'teamAway', attributes: [['team_name', 'teamName']] },
      ],
    });
    console.log('all');
    return matches;
  };

  getOnGoingMatches = async () => {
    const matches = await Matches.findAll({
      where: { in_progress: true },
      include: [
        { model: Teams, as: 'teamHome', attributes: [['team_name', 'teamName']] },
        { model: Teams, as: 'teamAway', attributes: [['team_name', 'teamName']] },
      ],
    });
    console.log('OnGOing');
    return matches;
  };

  getConcludedMatches = async () => {
    const matches = await Matches.findAll({
      where: { in_progress: false },
      include: [
        { model: Teams, as: 'teamHome', attributes: [['team_name', 'teamName']] },
        { model: Teams, as: 'teamAway', attributes: [['team_name', 'teamName']] },
      ],
    });
    console.log('finished');
    return matches;
  };
}

export default MatchesService;
