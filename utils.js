"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newUser = void 0;
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/vatstar', {
    user: "mongodb",
    pass: "mongodb",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
const userSchema = new mongoose.Schema({
    name: { type: String, unique: true }
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB CONNECTION SUCCESSFUL');
});
const User = mongoose.model('User', userSchema);
function newUser(name) {
    const user = new User({ name: name });
    console.log('I got to new user');
    user.save((err, user) => {
        if (err)
            return console.log(err);
        console.log(user);
    });
}
exports.newUser = newUser;
//# sourceMappingURL=utils.js.map