import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import LessonModel, { ILesson } from '@/models/lesson.model';
import { LessonService } from '@/services';
import { BaseController } from './base.controller';

class LessonController extends BaseController<ILesson, typeof LessonService> {
    constructor() {
        super(LessonService);
    }

    getLessons = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { limit, page, embed = 'false', ...criteria } = req.query;
            const option = {
                pagination: {
                    limit: Number(limit),
                    page: Number(page),
                },
                embed: (embed as string).toLowerCase() === 'true',
            };

            const result = await LessonService.getMany(criteria, option);

            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    createLesson = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, videoUrl, description, status, creator, metadata, length } = req.body;

            if (!name || !videoUrl || !description || !creator || !length) {
                throw createHttpError.BadRequest();
            }

            const newLesson = new LessonModel({
                name,
                videoUrl,
                description,
                status,
                creator,
                metadata,
                length,
            });

            const savedLesson = await LessonService.save(newLesson);

            return res.json(savedLesson);
        } catch (error) {
            next(error);
        }
    };

    updateLesson = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw createHttpError.BadRequest();
            }

            // TODO: https://github.com/typestack/class-validator
            const criteria = req.body;

            const updatedLesson = await LessonService.findOneAndUpdate({ _id: id }, { ...criteria });

            return res.json(updatedLesson);
        } catch (error) {
            next(error);
        }
    };
}

export default LessonController;
