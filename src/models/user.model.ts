import mongoose, { Schema, Model, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export enum USER_ROLES {
    USER = 'User',
    ADMIN = 'Admin',
    SUPER_USER = 'SuperUser',
    STAFF = 'Staff',
}

export interface IUser extends Document {
    // Extends method for user-model
    checkPassword(password: any): Promise<boolean>;

    name: string;
    password: string;
    email: string;
    phoneNumber: string;
    age: number;
    sex: string
    avatar: string;
    role: string;
}

export const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            unique: true
        },
        age: {
            type: Number,
            required: true,
        },
        sex: {
            type: String,
            default: 'Nam',
            require: true
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            required: true,
            enum: USER_ROLES,
        },
    },
    { timestamps: true },
);

/**
 * Mongo model pre middleware
 * Used to hash the password before action "save" to DB
 */
UserSchema.pre('save', async function (next) {
    try {
        const salt = await bcryptjs.genSalt(Number(process.env.GEN_SALT as string));
        const hashPassword = await bcryptjs.hash(this.password as string, salt);

        this.password = hashPassword;

        next();
    } catch (error) {
        console.log('Save ::: error ::: ', error);
    }
});

/**
 * Mongo model
 * Used to compare hash of the given "password" and "saved password"
 */
UserSchema.methods.checkPassword = async function (password: string) {
    try {
        return await bcryptjs.compare(password, this.password);
    } catch (error) {
        console.log('CheckPassword ::: error ::: ', error);
    }
};

const UserModel: Model<IUser> = mongoose.model('user', UserSchema);

export default UserModel;
