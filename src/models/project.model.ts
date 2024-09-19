import mongoose, { Schema, Model, Document } from 'mongoose';
import { IUser } from './user.model';

export enum PROJECT_STATUSES {
    ON_TRACK = 'On Track',
    ON_HOLD = 'On Hold',
    AT_RISK = 'At Risk',
    POTENTIAL_RISK = 'Potential Risk',
}

export interface IProject extends Document {
    name: string;
    manager: IUser;
    status: PROJECT_STATUSES;
    members: Array<IUser>;
    startTime: Date;
    endTime: Date;
    budget: number;
}

export const ProjectSchema: Schema<IProject> = new Schema(
    {
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
            enum: PROJECT_STATUSES,
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
    },
    { timestamps: true },
);

const ProjectModal: Model<IProject> = mongoose.model('project', ProjectSchema);

export default ProjectModal;
