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
            let result = [];

            if (!Object.keys(req.query).length) {
                result = await ProjectService.getAll2()
                    .populate('manager', ['name', '_id', 'email', 'age', 'avatar'])
                    .populate('members');
            } else {
                result = await ProjectService.select(req.query);
            }

            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    createProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                name,
                manager,
                status,
                startTime,
                endTime,
                budget = 0,
                members
            } = req.body;

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
                budget
            });

            const savedProject = await ProjectService.save(newProject);

            return res.json(savedProject);
        } catch (error) {
            next(error);
        }
    };
}

export default ProjectController;
