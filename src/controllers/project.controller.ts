import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import ProjectModel, { IProject } from '@/models/project.model';
import { ProjectService } from '@/services';
import { BaseController } from './base.controller';

class ProjectController extends BaseController<IProject, typeof ProjectService> {
    constructor() {
        super(ProjectService);
    }

    getProjects = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { limit, page, embed = 'false', ...criteria } = req.query;

            const option = {
                pagination: {
                    limit: Number(limit),
                    page: Number(page),
                },
                embed: (embed as string).toLowerCase() === 'true',
                populates: [
                    { path: 'manager', select: '-password' },
                    {
                        path: 'members',
                        select: ['name', '_id', 'avatar'],
                    },
                ],
            };

            if (criteria.manager || criteria.members) {
            }

            const result = await ProjectService.getMany(criteria, option);

            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    createProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, manager, status, startTime, endTime, budget = 0, members } = req.body;

            if (!name || !manager || !startTime || !endTime) {
                throw createHttpError.BadRequest();
            }

            const newProject = new ProjectModel({
                name,
                status,
                manager,
                members,
                startTime,
                endTime,
                budget,
            });

            const savedProject = await ProjectService.save(newProject);

            return res.json(savedProject);
        } catch (error) {
            next(error);
        }
    };
}

export default ProjectController;
