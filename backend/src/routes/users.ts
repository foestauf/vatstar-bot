import express from 'express'
export const users = express.Router();

import { User } from '../models/users';

users.get('/', (req, res) => {
    User.find({}, (err, docs) => {
        if (err) {
            return res.status(404).json({ userNotFound: 'User not found'})
        }
    })
    .then((docs) => {
        console.log(docs);
        res.json(docs);
    })
    .catch((err) => console.log(err));
})