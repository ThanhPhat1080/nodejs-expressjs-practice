import mongoose, { Schema, Model, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface User extends Document {
    checkPassword(password: any): Promise<boolean>;
    name: String;
    password: String;
    email: String;
    age: Number;
    avatar: String;
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
 *      example:
 *          id: d5fE_asz
 *          name: Phat Truong
 *          password: very-secret
 *          email: thanhphat.994gmail.com
 *          age: 30
 *          avatar: https://avatar.jpeg
 */
export const UserSchema: Schema<User> = new Schema({
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
});

/**
 * Mongo model pre middleware
 * Used to hash the password before action "save" to DB
 */
UserSchema.pre('save', async function (next) {
    try {
        const salt = await bcryptjs.genSalt(10);
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

const UserModel: Model<User> = mongoose.model('user', UserSchema);

export default UserModel;
