import _ = require('lodash');
import Teams from '../database/models/teams';
import Camelizer from '../utils/Camelizer';

class TeamsService {
  getAll = async () => {
    const teams: Teams[] = await Teams.findAll({ raw: true });

    if (!teams) return false;

    const teamsCamelized: _.Dictionary<string | number>[] = teams
      .map((team: Teams) => Camelizer.snakeToCamel(team));

    return teamsCamelized;
  };

  getById = async (id: number) => {
    const teamFound: Teams | null = await Teams.findByPk(id, { raw: true });

    if (!teamFound) return false;

    const teamFoundCamelized: _.Dictionary<string | number> = Camelizer
      .snakeToCamel(teamFound);

    return teamFoundCamelized;
  };
}

export default TeamsService;
