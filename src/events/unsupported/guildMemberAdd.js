module.exports = async (member) => {
  const db_User = require('../../models/user');
  db_User.findOne({ userid: member.id }, function (error, data) {
    if (error) return console.err('\x1b[37m\x1b[41mERROR\x1b[0m: Um erro ocorreu no tempo de execução!', error);
    if (data) {
      if (data.userBanned == 'banned') return;
      new db_User({
        userid: member.id,
        username: member.username,
        userBanned: 'not'
      }).save().catch((err) => {
        console.err('\x1b[37m\x1b[41mERROR\x1b[0m: Um erro ocorreu no tempo de execução!', err);
      })
    } else {
      new db_User({
        userid: member.id,
        username: member.username,
        userBanned: 'not'
      }).save().catch((err) => {
        console.err('\x1b[37m\x1b[41mERROR\x1b[0m: Um erro ocorreu no tempo de execução!', err);
      })
    }
  })
}