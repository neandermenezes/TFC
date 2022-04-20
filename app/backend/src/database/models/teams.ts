import { Model, DataTypes } from 'sequelize';
import db from '.';
import Matches from './matches';

class Teams extends Model {
  public id: number;

  public team_name: string;
}

Teams.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  team_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  timestamps: false,
  modelName: 'teams',
});

Matches.belongsTo(Teams, { foreignKey: 'home_team' as 'homeTeam' });
Matches.belongsTo(Teams, { foreignKey: 'away_team' as 'awayTeam' });

export default Teams;
