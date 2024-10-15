import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { IUser } from './user.model';

export enum LESSON_STATUS {
    DRAFT = 'DRAFT',
    PUBLISH = 'PUBLISH',
}

export interface ILessonComment extends Document {
    user: IUser;
    lesson: ILesson;
    content: string;
}

export interface ILesson extends Document {
    name: string;
    videoUrl: string;
    description: string;
    status: LESSON_STATUS;
    creator: IUser;
    metadata: object;
    length: string;
}

export const LessonCommentSchema: Schema<ILessonComment> = new mongoose.Schema({
    user: {
        type: Types.ObjectId,
        required: true,
        ref: 'user',
    },
    lesson: {
        type: Types.ObjectId,
        required: true,
        ref: 'lesson',
    },
    content: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1000,
    },
});

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
            type: Object,
        },
        length: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export const LessonCommentModel: Model<ILessonComment> = mongoose.model('lessonComment', LessonCommentSchema);
export const LessonModel: Model<ILesson> = mongoose.model('lesson', LessonSchema);

export default LessonModel;
