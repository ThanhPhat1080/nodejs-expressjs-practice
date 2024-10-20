import CourseModel, { COURSE_STATUS, ICourse, ICourseLesson } from '@/models/course.model';
import BaseService from './base.service';
import { IUser, USER_ROLES } from '@/models/user.model';
import { ILesson } from '@/models/lesson.model';

export class CourseService extends BaseService<ICourse> {
    constructor() {
        super(CourseModel);
    }

    async getUserCourses(userCourseRight: Pick<IUser, 'courseRight'>, option: any) {
        const { data, ...queryOptions } = await this.getMany(
            { status: COURSE_STATUS.PUBLISH },
            {
                ...option,
                isExact: true,
            },
        );

        const courses = data.map((course) => {
            const courseRightCode = course.rightCode;
            const courseLessons = course.lessons.map((lesson: ICourseLesson) => {
                const lessonRightCode = lesson.rightCode;

                return {
                    ...lesson,
                    hasRight: !!userCourseRight[lessonRightCode],
                };
            });

            return {
                ...course,
                lessons: courseLessons,
                hasRight: !!userCourseRight[courseRightCode],
            };
        });

        return {
            data: courses,
            ...queryOptions,
        };
    }

    async getCourseDetail(id: string, user: Partial<IUser>) {
        const course = await this.getOne(
            {
                _id: id,
            },
            { isExact: true, embed: true, populates: [{ path: 'lesson' }] },
        );

        if (user?.role === USER_ROLES.USER) {
            const result = course.lessons.map((lesson: ICourseLesson) => {
                const lessonRightCode = lesson.rightCode;

                return {
                    ...lesson,
                    hasRight: !!user.courseRight[lessonRightCode],
                };
            });

            return result;
        }

        return course;
    }
}

export default new CourseService();
