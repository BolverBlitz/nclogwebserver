const express = require('express');
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const { logger } = require('../lib/logger');


require('dotenv').config();

const middlewares = require('./middlewares');
const routes = require('./routes');

const app = express();
app.set('trust proxy', 1); //If Behind PROXY

//app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(expressCspHeader({
  directives: {
      'default-src': [SELF],
      'script-src': [SELF, INLINE],
      'style-src': [SELF, INLINE],
      'img-src': [SELF, INLINE],
      'worker-src': [NONE],
      'block-all-mixed-content': true
  }
}));
app.use(bodyParser.urlencoded({ extended: false }))

if (process.env.Enable_Static === 'true' || process.env.Enable_Static === true) {
  logger('system', 'Static content enabled');
  const static = require('./routes/static');
  app.use('/static', static);
}

app.use('/fetch', routes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;