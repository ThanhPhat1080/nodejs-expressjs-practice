import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import CourseModel, { ICourse } from '@/models/course.model';
import { CourseService } from '@/services';
import { BaseController } from './base.controller';

class CourseController extends BaseController<ICourse, typeof CourseService> {
    constructor() {
        super(CourseService);
    }

    getCourses = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { limit, page, embed = 'false', ...criteria } = req.query;

            const option = {
                pagination: {
                    limit: Number(limit),
                    page: Number(page),
                },
                embed: (embed as string).toLowerCase() === 'true',
            };

            const result = await CourseService.getMany(criteria, option);

            return res.json(result);
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
            // TODO: https://github.com/typestack/class-validator
            const { id, ...criteria } = req.body;

            if (!id) {
                throw createHttpError.BadRequest();
            }

            const updatedCourse = await CourseService.findOneAndUpdate({ _id: id }, { ...criteria });

            return res.json(updatedCourse);
        } catch (error) {
            next(error);
        }
    };
}

export default CourseController;

