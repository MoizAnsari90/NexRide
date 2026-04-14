require('dotenv').config();


const express = require('express');
const cors = require('cors')
const connectToDb = require('./db/database');
const userRoutes = require('./routes/user.routes');
const cookieparser = require('cookie-parser')
const captainRoutes = require("./routes/captain.routes")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "https://nex-ride-two.vercel.app/",
    credentials: true
}));
app.use(cookieparser());

connectToDb();


app.get('/', (req,res) => {
    res.send('Hello World')
})
app.use('/users', userRoutes);
app.use('/captain', captainRoutes);


module.exports = app;
