import express from 'express'
import connectDB from './config/mongodb.js'
import cors from 'cors'
import userRouter from './routers/userRoute.js'
import iotRouter from './routers/iotRoute.js'
import dotenv from 'dotenv' 
import { Server } from 'socket.io'
import connectMQTT from './config/mqtt.js'   
import http from 'http'
dotenv.config();
// app config

const app = express();
const port = process.env.PORT || 4000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

connectDB();
connectMQTT(io);

// middleware
app.use(express.json())
app.use(cors());

// initalizing routes
app.use(userRouter);
app.use(iotRouter);

app.get('/', (req, res) => {
    res.send('API is working');
});
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
server.listen(port, () => console.log('Server is running on port: ' + port));