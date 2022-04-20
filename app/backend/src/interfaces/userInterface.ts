export type Role = 'admin' | 'user';

interface IUser {
  id?: number,
  username: string,
  role: Role,
  email: string,
  password: string,
}

export default IUser;
