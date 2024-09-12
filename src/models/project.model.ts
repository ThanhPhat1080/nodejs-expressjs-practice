import mongoose, { Schema, Model, Document } from 'mongoose';
import { IUser } from './user.model';

export enum PROJECT_STATUSES {
    ON_TRACK = 'On Track',
    ON_HOLD = 'On Hold',
    AT_RISK = 'At Risk',
    POTENTAL_RISK = 'Potental Risk',
}

export interface IProject extends Document {
    name: String;
    manager: IUser;
    status: PROJECT_STATUSES;
    lastUpdate: Date;
    members: Array<IUser>;
    startTime: Date;
    endTime: Date;
    budget: Number;
}

/**
 * @swagger
 * components:
 *      schemas:
 *          Project:
 *              type: object
 *              required:
 *                  - name
 *                  - manager
 *                  - lastUpdate
 *                  - status
 *                  - members
 *                  - startTime
 *                  - endTime
 *                  - budget
 *              properties:
 *                  name:
 *                      type: string
 *                      description: Project name
 *                  manager:
 *                      type: object
 *                      description: Project manager user
 *                      $ref: '#/components/schemas/User'
 *                  lastUpdate:
 *                      type: date
 *                      description: Project last update
 *                  status:
 *                      type: string
 *                      enum: [On Track, On Hold, At Risk, Potential Risk]
 *                      description: Project status
 *                  members:
 *                      type: [object]
 *                      description: Project list member users
 *                      $ref: '#/components/schemas/User'
 *                  startTime:
 *                      type: date
 *                      description: Project start time
 *                  endTime:
 *                      type: date
 *                      description: Project end time
 *                  budget:
 *                      type: number
 *                      description: Project budget
 *      example:
 *          name: ExpressJS API
 *          managerId: ude-csnr-vng
 *          lastUpdate: Mon Sep 09 2024 22:33:16
 *          status: On Hold
 *          memberIds: [abc-scve-efe, kie-vhre-kui]
 *          startTime: Mon Sep 01 2024 00:00:00
 *          endTime: Mon Sep 01 2025 00:00:00
 *          budget: 500000
 */
export const ProjectSchema: Schema<IProject> = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    manager: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    status: {
        type: String,
        required: true,
        default: PROJECT_STATUSES.ON_HOLD,
    },
    lastUpdate: {
        type: Date,
        default: Date.now,
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    budget: {
        type: Number,
        required: true,
    },
});

const ProjectModal: Model<IProject> = mongoose.model('project', ProjectSchema);

export default ProjectModal;
