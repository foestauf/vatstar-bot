"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const express_1 = __importDefault(require("express"));
exports.users = express_1.default.Router();
const users_1 = require("../models/users");
exports.users.get('/', (req, res) => {
    users_1.User.find({}, (err, docs) => {
        if (err) {
            return res.status(404).json({ userNotFound: 'User not found' });
        }
    })
        .then((docs) => {
        console.log(docs);
        res.json(docs);
    })
        .catch((err) => console.log(err));
});
