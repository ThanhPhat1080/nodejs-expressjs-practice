import UserModel, { User } from '@/models/user.model';
import BaseService from './base.service';

export class UserService extends BaseService<User> {
    constructor() {
        super(UserModel);
    }
}

export default new UserService();
