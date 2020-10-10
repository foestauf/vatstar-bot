import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: String,
    isNewUser: Boolean,
    userId: String,
    createdAt: Date,
    lastSeen: Date,
    vatsimId: String,
    pilotRating: {
        p0: Boolean,
        p1: Boolean,
        p2: Boolean,
        p3: Boolean,
        p4: Boolean
    }
})

export const User = mongoose.model('users', UserSchema);