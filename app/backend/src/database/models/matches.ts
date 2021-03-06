import { Model, DataTypes } from 'sequelize';
import db from '.';
import Teams from './teams';

class Matches extends Model {
  public id: number;

  public home_team: number;

  public home_team_goals: number;

  public away_team: number;

  public away_team_goals: number;

  public in_progress: boolean;
}

Matches.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  home_team: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  home_team_goals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  away_team: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  away_team_goals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  in_progress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  timestamps: false,
  modelName: 'matches',
});

Matches.belongsTo(Teams, { foreignKey: 'home_team', as: 'teamHome' });
Matches.belongsTo(Teams, { foreignKey: 'away_team', as: 'teamAway' });

export default Matches;
