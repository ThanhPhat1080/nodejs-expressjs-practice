import CourseModel, { ICourse } from '@/models/course.model';
import BaseService from './base.service';

export class CourseService extends BaseService<ICourse> {
    constructor() {
        super(CourseModel);
    }
}

export default new CourseService();
