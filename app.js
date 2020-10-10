require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Connecting to DB
const mongoose = require('mongoose');
mongoose
  .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USER_PASSWORD}@tick.jm1v9.mongodb.net/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then((conn) => console.log(`DB CONNECTED at PORT: ${conn.connection.port}`))
  .catch((err) => {
    console.error('DB CONNECTION FAILED');
    console.log(err.message);
    process.exit(1); // Stop everything
  });

// using 3rd party middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())

const port = process.env.PORT || 8000;
app.listen(8000, () => console.log(`Server is up & running at port: ${port}`));
