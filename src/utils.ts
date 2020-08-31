import mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vatstar', {
    user: "mongodb",
    pass: "mongodb",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const userSchema = new mongoose.Schema({
    name: {type: String, unique: true}
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB CONNECTION SUCCESSFUL');
})

const User = mongoose.model('User', userSchema);

export function newUser(name: string) {
    const user = new User({ name: name});
    console.log('I got to new user');
    user.save((err, user) => {
        if (err) return console.log(err);
        console.log(user);
    })
}