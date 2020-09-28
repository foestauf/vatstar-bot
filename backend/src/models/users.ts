import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: String,
    isNewUser: Boolean,
    userId: String,
    createdAt: Date,
    lastSeen: Date,
    vatsimId: String
})

export const User = mongoose.model('users', UserSchema);