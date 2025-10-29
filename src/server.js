import express from 'express'
import connectDB from './config/mongodb.js'
import cors from 'cors'
import userRouter from './routers/userRoute.js'
import dotenv from 'dotenv'

dotenv.config();
// app config

const app = express();
const port = process.env.PORT || 4000;
connectDB();

// middleware
app.use(express.json())
app.use(cors());

// initalizing routes
app.use(userRouter);
app.get('/', (req, res) => {
    res.send('API is working');
});

app.listen(port, () => console.log('Server is running on port: ' + port));