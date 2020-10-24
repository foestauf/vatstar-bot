"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.retrieveUser = exports.newUser = void 0;
const mongoose = require("mongoose");
mongoose.connect('mongodb://database/vatstar', {
    user: 'mongodb',
    pass: 'mongodb',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    vatsimId: { type: String },
    createdAt: { type: Date, default: Date.now },
    isNewUser: { type: Boolean, default: true },
    discordTag: String,
    lastSeen: { type: Date, default: Date.now },
    pilotRating: {
        p0: { type: Boolean, default: false },
        p1: { type: Boolean, default: false },
        p2: { type: Boolean, default: false },
        p3: { type: Boolean, default: false },
        p4: { type: Boolean, default: false },
    },
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB CONNECTION SUCCESSFUL');
});
const User = mongoose.model('User', userSchema);
function newUser(member) {
    const user = new User({
        userId: member.id,
        name: member.displayName,
        discordTag: member.user.tag,
    });
    user.save((err, user) => {
        if (err)
            return console.log(err);
        console.log(user);
    });
}
exports.newUser = newUser;
async function retrieveUser(member) {
    let userDoc;
    await User.findOne({ userId: member.id }, (err, res) => {
        console.log(`Server response: ${res}`);
        if (err)
            console.log(err);
        userDoc = res;
        return userDoc;
    });
    return userDoc;
}
exports.retrieveUser = retrieveUser;
function updateUser(member, data, action) {
    console.log(`Updating member: ${member.id}`);
    const query = { userId: member.id };
    const pilotRating = {
        p0: false,
        p1: false,
        p2: false,
        p3: false,
        p4: false,
    };
    if (data.pilotrating === 0) {
        pilotRating.p0 = true;
    }
    if (data.pilotrating === 1) {
        pilotRating.p0 = true;
        pilotRating.p1 = true;
    }
    if (data.pilotrating === 3) {
        pilotRating.p0 = true;
        pilotRating.p1 = true;
        pilotRating.p2 = true;
    }
    if (data.pilotrating === 7) {
        pilotRating.p0 = true;
        pilotRating.p1 = true;
        pilotRating.p2 = true;
        pilotRating.p3 = true;
    }
    if (data.pilotrating === 15) {
        pilotRating.p0 = true;
        pilotRating.p1 = true;
        pilotRating.p2 = true;
        pilotRating.p3 = true;
        pilotRating.p4 = true;
    }
    switch (action) {
        case 'clearNewUser':
            User.findOneAndUpdate(query, {
                $set: {
                    name: member.nickname,
                    isNewUser: false,
                    vatsimId: data.id,
                    pilotRating,
                    lastSeen: new Date(),
                },
            }, { new: true }, (err) => {
                if (err)
                    console.log(err);
            });
            break;
        case 'updateUser':
            User.findOneAndUpdate(query, {
                $set: {
                    lastSeen: new Date(),
                    pilotRating,
                    vatsimId: data.id,
                },
            }, { new: true }, (err) => {
                if (err)
                    console.log(err);
            });
            break;
        default:
            break;
    }
}
exports.updateUser = updateUser;
//# sourceMappingURL=utils.js.map