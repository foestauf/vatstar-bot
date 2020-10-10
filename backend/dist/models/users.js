"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
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
});
exports.User = mongoose_1.default.model('users', UserSchema);
