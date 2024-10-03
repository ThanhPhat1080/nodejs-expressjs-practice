import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { IUser } from './user.model';

export enum LESSON_STATUS {
    DRAFT = 'DRAFT',
    PUBLISH = 'PUBLISH',
}

export interface ILesson extends Document {
    name: string;
    videoUrl: string;
    description: string;
    status: LESSON_STATUS;
    creator: IUser;
    metadata: object;
    rightCode: string;
    length: string;
}

export const LessonSchema: Schema<ILesson> = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        videoUrl: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            default: LESSON_STATUS.DRAFT,
            enum: LESSON_STATUS,
        },
        creator: {
            type: Types.ObjectId,
            required: true,
            ref: 'user',
        },
        metadata: {
            type: Types.Map,
        },
        rightCode: {
            type: String,
            required: true,
            unique: true,
        },
        length: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const LessonModel: Model<ILesson> = mongoose.model('lesson', LessonSchema);

export default LessonModel;
