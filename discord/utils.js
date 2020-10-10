"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.retrieveUser = exports.newUser = void 0;
const mongoose = require("mongoose");
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
    lastSeen: { type: Date, default: Date.now },
    pilotRating: {
        p0: { type: Boolean, default: false },
        p1: { type: Boolean, default: false },
        p2: { type: Boolean, default: false },
        p3: { type: Boolean, default: false },
        p4: { type: Boolean, default: false },
    }
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
        name: member.displayName
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
        console.log('Server response: ' + res);
        if (err)
            console.log(err);
        userDoc = res;
        return userDoc;
    });
    return userDoc;
}
exports.retrieveUser = retrieveUser;
function updateUser(member, cid, action) {
    let query = { userId: member.id };
    switch (action) {
        case "clearNewUser":
            User.findOneAndUpdate(query, {
                "$set": {
                    name: member.nickname,
                    isNewUser: false,
                    vatsimId: cid
                }
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