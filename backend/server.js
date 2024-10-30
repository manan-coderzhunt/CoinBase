const express = require('express');
const dbConnect = require('./database/index');
const {PORT} = require('./config/index');
const router = require('./routes/index');
const errorHandeler = require('./middlewares/errorHandling');

const app = express();

app.use(express.json());
app.use(router);

dbConnect();

app.use(errorHandeler);

app.listen(PORT, console.log(`Backend is running on port ${PORT}`));