import express from 'express';
import 'dotenv/config';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';

// DB config
interface ProcessEnv {
    [MONGO_URI: string]: string
}

const db: string = (process.env.MONGO_URI as string);
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connection successful'))
    .catch((err) => console.log(err));

const APP_PORT = 4000;
const app = express();

app.use(morgan('combined'));
app.use(cors());
// app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.get('/sayHello', (req, res) => {
    interface Req extends Request{
        user: String
    }
    res.send('Hello from the back-end.');
});

app.listen(APP_PORT);
console.log('Web server listening on port', APP_PORT);