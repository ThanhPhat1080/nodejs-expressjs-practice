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
    age: number;
    avatar: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * @swagger
 * components:
 *      schemas:
 *          User:
 *              type: object
 *              required:
 *                  - name
 *                  - password
 *                  - email
 *                  - age
 *                  - avatar
 *              properties:
 *                  id:
 *                      type: string
 *                      description: The auto-generated id of user
 *                  name:
 *                      type: string
 *                      description: User name
 *                  password:
 *                      type: string
 *                      description: User password
 *                  email:
 *                      type: string
 *                      description: User email
 *                  age:
 *                      type: number
 *                      description: User age
 *                  avatar:
 *                      type: string
 *                      description: User avatar
 *                  role:
 *                      type: string
 *                      description: User role
 *                      enum: [User, Staff, Admin, SuperUser]
 *      example:
 *          id: d5fE_asz
 *          name: Phat Truong
 *          password: very-secret
 *          email: thanhphat.994gmail.com
 *          age: 30
 *          avatar: https://avatar.jpeg
 *          role: Admin
 *          createdAt: Wed Sep 10 2024 22:30:30
 *          updatedAt: Wed Sep 18 2024 23:00:00
 */
export const UserSchema: Schema<IUser> = new Schema({
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
        required: true,
        unique: true,
        lowercase: true,
    },
    age: {
        type: Number,
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: USER_ROLES,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
    },
});

/**
 * Mongo model pre middleware
 * Used to hash the password before action "save" to DB
 */
UserSchema.pre('save', async function (next) {
    try {
        const currentTime = new Date();

        const salt = await bcryptjs.genSalt(process.env.GEN_SALT as unknown as number);
        const hashPassword = await bcryptjs.hash(this.password as string, salt);

        this.password = hashPassword;
        this.createdAt = currentTime;
        this.updatedAt = currentTime;

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
