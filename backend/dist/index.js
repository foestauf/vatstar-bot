"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = require("./routes/users");
const db = process.env.MONGO_URI;
mongoose_1.default
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connection successful'))
    .catch((err) => console.log(err));
const APP_PORT = 4000;
const app = express_1.default();
app.use(morgan_1.default('combined'));
app.use(cors_1.default());
// app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.get('/api/sayHello', (req, res) => {
    res.send('Hello from the back-end.');
});
app.use('/api/users', users_1.users);
app.listen(APP_PORT);
console.log('Web server listening on port', APP_PORT);
