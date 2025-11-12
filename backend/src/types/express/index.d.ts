import { IUser } from '../../api/users/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
