import mongoose, { Schema, Model, Document } from "mongoose";
import bcrypt from 'bcrypt';

export interface User extends Document {
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

UserSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password as string, salt);
        this.password = hashPassword;

        next();
    } catch (error) {
        log(error);
    }

});

const UserModel: Model<User> = mongoose.model('user', UserSchema);

export default UserModel
