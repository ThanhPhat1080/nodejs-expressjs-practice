import mongoose, { Schema, Model, Document } from "mongoose";

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

const UserModel: Model<User> = mongoose.model('user', UserSchema);

export default UserModel
