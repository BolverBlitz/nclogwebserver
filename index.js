require('dotenv').config()

const app = require('./src/app');
const {logger} = require('./lib/logger');

const port = process.env.WebPORT || 5000;

app.listen(port, () => {
  /* eslint-disable no-console */
  logger('system',`Server started on port ${port}`);
  /* eslint-enable no-console */
});