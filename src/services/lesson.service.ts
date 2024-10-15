import BaseService from './base.service';
import LessonModel, { ILesson } from '@/models/lesson.model';

export class LessonService extends BaseService<ILesson> {
    constructor() {
        super(LessonModel);
    }
}

export default new LessonService();
