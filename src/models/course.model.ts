import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { ILesson } from './lesson.model';
import { IUser } from './user.model';

export enum COURSE_STATUS {
    DRAFT = 'DRAFT',
    PUBLISH = 'PUBLISH',
    PRE_RELEASE = 'PRE_RELEASE',
}

export interface ICourseLesson {
    order: number;
    lesson: ILesson;
    rightCode: string;
}

export interface ICourseReview extends Document {
    user: IUser;
    course: ICourse;
    imageUrls: Array<string>;
    content: string;
}

export interface ICourse extends Document {
    name: string;
    description: string;
    length: string;
    level: number;
    status: COURSE_STATUS;
    lessons: Array<ILesson>;
    lessonCount: number;
    reviewCount: number;
    metadata: object;
    rightCode: string;
    originalPrice: number;
    sale: number;
}

export const CourseLesson: Schema<ICourseLesson> = new mongoose.Schema({
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
    rightCode: {
        type: String,
        required: true,
    },
});

export const CourseReviewSchema: Schema<ICourseReview> = new mongoose.Schema({
    user: {
        type: Types.ObjectId,
        required: true,
        ref: 'user',
    },
    course: {
        type: Types.ObjectId,
        required: true,
        ref: 'course',
    },
    imageUrls: {
        type: [String],
    },
    content: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1000,
    },
});

export const CourseSchema: Schema<ICourse> = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
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
            min: 0,
        },
        reviewCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        rightCode: {
            type: String,
            required: true,
            unique: true,
        },
        originalPrice: {
            type: Number,
            required: true,
        },
        sale: {
            type: Number,
        },
        metadata: {
            type: Object,
        },
    },
    { timestamps: true },
);

export const CourseReviewModel: Model<ICourseReview> = mongoose.model('courseReview', CourseReviewSchema);
export const CourseModel: Model<ICourse> = mongoose.model('course', CourseSchema);

export default CourseModel;
