import { Model, DataTypes } from 'sequelize';
import { Role } from '../../interfaces/userInterface';
import { IUser } from '../../interfaces/index';
import db from '.';

class Users extends Model implements IUser {
  declare id: number;

  declare username: string;

  declare role: Role;

  declare email: string;

  declare password: string;
}

Users.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  timestamps: false,
  modelName: 'users',
});

export default Users;
