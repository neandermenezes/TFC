import Teams from '../database/models/teams';

class TeamsService {
  getAll = async () => {
    const teams = await Teams.findAll();

    if (!teams) return false;

    return teams;
  };

  getById = async (id: number) => {
    const teamFound = await Teams.findByPk(id);

    if (!teamFound) return false;

    return teamFound;
  };
}

export default TeamsService;
