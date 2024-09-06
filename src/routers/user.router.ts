import { UserController } from '@/controllers';
import { verifyAccessTokenFilter } from '@/helpers/jwt';
import { Router } from 'express';

const userRouter = Router();

const controller = new UserController();
const {
    createUser,
    getUsers,
    getById,
    login,
    refreshToken,
    logout
} = controller;

/**
 * The Router here
 */
userRouter.post('/register', createUser);
userRouter.get('/', verifyAccessTokenFilter, getUsers);
userRouter.get('/:id', getById);
userRouter.post('/login', login);
userRouter.post('/refresh-token', refreshToken);
userRouter.delete('/logout', logout);

export default userRouter;
