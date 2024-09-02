import mongoose, { Schema, Model, Document } from "mongoose";
import bcrypt from 'bcrypt';

export interface User extends Document {
    checkPassword(password: any): Promise<boolean>;
    name: String;
    password: String;
    email: String;
    age: Number;
    avatar: String;
}

export const UserSchema: Schema<User> = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
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
    }
});

/**
 * Mongo model pre middleware
 * Used to hash the password before action "save" to DB
 */
UserSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password as string, salt);
        this.password = hashPassword;

        next();
    } catch (error) {
        console.log("Save ::: error ::: ", error);
    }
});

/**
 * Mongo model
 * Used to compare hash of the given "password" and "saved password"
 */
UserSchema.methods.checkPassword = async function (password: string) {
    try {
        return await bcrypt.compare(password, this.password);

    } catch (error) {
        console.log("CheckPassword ::: error ::: ", error);
    }
};

const UserModel: Model<User> = mongoose.model('user', UserSchema);

export default UserModel
