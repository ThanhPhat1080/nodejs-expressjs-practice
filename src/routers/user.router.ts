import { UserController } from '@/controllers';
import { verifyAccessTokenMiddleware } from '@/helpers/jwt';
import { Router } from 'express';

const userRouter = Router();

const controller = new UserController();
const {
    createUser,
    getUsers,
    getById,
    login,
    refreshToken
} = controller;

/**
 * The Router here
 */
userRouter.post('/register', createUser);
userRouter.get('/', verifyAccessTokenMiddleware, getUsers);
userRouter.get('/:id', getById);
userRouter.post('/login', login);
userRouter.post('/refresh-token', refreshToken);

export default userRouter;
