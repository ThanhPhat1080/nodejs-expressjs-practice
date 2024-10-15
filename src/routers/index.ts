import { Router } from 'express';

import userRouter from './user.router';
import projectRouter from './project.router';
import lessonRouter from './lesson.router';
import courseRouter from './course.router';

const appRouters = Router();
appRouters.use('/user', userRouter);
appRouters.use('/project', projectRouter);
appRouters.use('/lesson', lessonRouter);
appRouters.use('/course', courseRouter);

export default appRouters;
