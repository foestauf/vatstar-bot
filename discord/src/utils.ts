import mongoose = require('mongoose');
import { GuildMember } from 'discord.js';

mongoose.connect('mongodb://database/vatstar', {
    user: "mongodb",
    pass: "mongodb",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    vatsimId: { type: String },
    createdAt: { type: Date, default: Date.now },
    isNewUser: { type: Boolean, default: true },
    lastSeen: { type: Date, default: Date.now }
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB CONNECTION SUCCESSFUL');
})

const User = mongoose.model('User', userSchema);

export function newUser(member: GuildMember) {
    const user = new User({
        userId: member.id,
        name: member.displayName
    });
    user.save((err, user) => {
        if (err) return console.log(err);
        console.log(user);
    })
}

interface UserSchema {
    name: String,
    userId: String,
    createdAt: Date,
    isNewUser: Boolean,
    lastSeen: Date,
    _id: Object
}

export async function retrieveUser(member: GuildMember): Promise<UserSchema> {
    let userDoc: UserSchema;
    await User.findOne({ userId: member.id }, (err, res: UserSchema) => {
        console.log('Server response: ' + res);
        if (err) console.log(err);
        userDoc = res;
        return userDoc;
    })
    return userDoc;
}

export function updateUser(member: GuildMember, cid: String, action: String) {
    let query = { userId: member.id };
    switch (action) {
        case "clearNewUser":
            User.findOneAndUpdate(query,
                {
                    "$set": {
                        name: member.nickname,
                        isNewUser: false,
                        vatsimId: cid
                    }
                }, { new: true }, (err) => {
                    if (err) console.log(err);
                })
            break;
        default:
            break;
    }
}