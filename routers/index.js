
const login = require('../routers/login');


module.exports = (app) => {
  app.use('/login',login);
}
