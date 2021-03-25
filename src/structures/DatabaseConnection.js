const mongoose = require('mongoose');
const config = require('../config/config.json');

mongoose.connect(config.uri, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
}, (err) => {
  if (err) return console.log('\x1b[37m\x1b[41mERROR\x1b[0m: Ocorreu um erro no cliente do mongodb! verifique se a sua URI está correta!', err);
});

const userSchema = new mongoose.Schema({
  userid: String,
  username: String,
  userBanned: Boolean,
  premium: Boolean,
  afk: Boolean,
  afkR: String
});

module.exports = mongoose.model('user', userSchema);
