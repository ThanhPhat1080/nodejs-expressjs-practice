import { Router } from 'express';

import userRouter from './user.router';
import projectRouter from './project.router';

const appRouters = Router();
appRouters.use('/user', userRouter);
appRouters.use('/project', projectRouter);

export default appRouters;
