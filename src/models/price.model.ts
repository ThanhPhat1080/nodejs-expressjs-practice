import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { ILesson } from './lesson.model';
import { ICourse } from './course.model';

export interface IPrice extends Document {
    course: ICourse;
    originalPrice: number;
    sale: number;
    status: COURSE_STATUS;
    lessons: Array<ILesson>;
    lessonCount: number;
    reviewCount: number;
    metadata: object;
    rightCode: string;
}

export const CourseLesson = new mongoose.Schema({
    order: {
        type: Number,
        required: true,
        unique: true,
        default: 0,
    },
    lesson: {
        type: Types.ObjectId,
        required: true,
        ref: 'lesson',
    },
});

export const CourseSchema: Schema<ICourse> = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        length: {
            type: String,
            required: true,
        },
        level: {
            type: Number,
            required: true,
            default: 1,
        },
        status: {
            type: String,
            required: true,
            enum: COURSE_STATUS,
            default: COURSE_STATUS.DRAFT,
        },
        lessons: [
            {
                type: CourseLesson,
            },
        ],
        lessonCount: {
            type: Number,
            default: 0,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        metadata: {
            type: Types.Map,
        },
        rightCode: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true },
);

const CourseModel: Model<ICourse> = mongoose.model('course', CourseSchema);

export default CourseModel;
