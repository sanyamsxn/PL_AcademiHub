const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv= require('dotenv');
const authRoutes = require('./routes/authroutes');
const fileRoutes = require('./routes/filesroutes');
const cors = require('cors');
// const dashboard = require('./routes/dashboard');
dotenv.config();

const app = express();

// database connection here
mongoose.connect(process.env.DATA_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Middleware---------
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
//hbs.registerPartials(path.join(__dirname, 'views/layouts')); for future use if needed

// for parse -------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200', // Replace with your frontend's URL
  methods: ['GET', 'POST'], // Allow specific methods
  credentials: true, // Allow cookies or other credentials
}));
// Routes---------
app.use('/auth', authRoutes);

// app.use('/dashboard',dashboard);

port = process.env.PORT
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
