import ProjectModel, { IProject } from '@/models/project.model';
import BaseService from './base.service';

export class ProjectService extends BaseService<IProject> {
    constructor() {
        super(ProjectModel);
    }
}

export default new ProjectService();
