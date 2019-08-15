require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const database = require('./database');
const routes = require('./routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, _, next) => {
  database(function(err, db) {
    if (err) return next(err);

    req.models = db.models;
    req.db = db;

    return next();
  });
});

routes(app);

module.exports = app;
