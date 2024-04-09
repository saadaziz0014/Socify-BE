import express from 'express'
import mongoose from 'mongoose';
import { config } from './config';
import authRouter from './routers/auth';
import threadRouter from './routers/thread';
import cors from 'cors';
import { authentication } from './middlewares/auth';

const app = express();

app.use(express.json());
app.use(cors())
app.use('/auth', authRouter);
app.use('/thread', authentication, threadRouter);

mongoose.connect(config.dbUrl).then(() => {
    console.log("Connected to DB");
    app.listen(config.port, () => {
        console.log(`Listening on port ${config.port}`);
    })
}).catch((err: string) => { console.log(err) })
