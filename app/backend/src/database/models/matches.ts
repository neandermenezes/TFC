import { Model, DataTypes } from 'sequelize';
import db from '.';
import { IMatches } from '../../interfaces/index';

class Matches extends Model implements IMatches {
  declare id: number;

  declare home_team: number;

  declare home_team_goals: number;

  declare away_team: number;

  declare away_team_goals: number;

  declare in_progress: boolean;
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

export default Matches;
