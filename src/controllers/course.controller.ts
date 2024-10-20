import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import CourseModel, { ICourse } from '@/models/course.model';
import { CourseService } from '@/services';
import { BaseController } from './base.controller';
import { USER_ROLES } from '@/models/user.model';

class CourseController extends BaseController<ICourse, typeof CourseService> {
    constructor() {
        super(CourseService);
    }

    getCourses = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user } = req.body;

            const { limit, page, embed = 'false', ...criteria } = req.query;
            const option = {
                pagination: {
                    limit: Number(limit),
                    page: Number(page),
                },
                embed: (embed as string).toLowerCase() === 'true',
                populates: [{ path: 'lesson' }],
            };

            if (user?.role === USER_ROLES.USER) {
                return res.json(
                    await CourseService.getUserCourses(user.courseRight, {
                        ...option,
                        populates: [{ path: 'lesson', select: '-videoUrl' }],
                    }),
                );
            }

            return res.json(await CourseService.getMany(criteria, option));
        } catch (error) {
            next(error);
        }
    };

    getCourseById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user } = req.body;
            const { id } = req.params;

            const course = await CourseService.getCourseDetail(id, user);

            return res.json(course);
        } catch (error) {
            next(error);
        }
    };

    createCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, description, length, level, lessons, status, metadata, rightCode, originalPrice, sale } =
                req.body;

            if (!name || !description || !length || !rightCode) {
                throw createHttpError.BadRequest();
            }

            const newCourse = new CourseModel({
                name,
                description,
                length,
                level,
                status,
                metadata,
                rightCode,
                lessons,
                originalPrice: Number(originalPrice),
                sale: Number(sale),
            });

            const savedCourse = await CourseService.save(newCourse);

            return res.json(savedCourse);
        } catch (error) {
            next(error);
        }
    };

    updateCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw createHttpError.BadRequest();
            }

            // TODO: https://github.com/typestack/class-validator
            const criteria = req.body;

            const updatedCourse = await CourseService.findOneAndUpdate({ _id: id }, { ...criteria });

            return res.json(updatedCourse);
        } catch (error) {
            next(error);
        }
    };
}

export default CourseController;
