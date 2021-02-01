module.exports = async(member) => {
    const db_User = require('../models/user');
    db_User.findOne({ userid: member.id }, function(erro, dados) {
    if(dados) { 
    if(erro) return console.error(erro);
    if(dados.userBanned == 'banned') return;
    new db_User({
    userid: member.id,
    username: member.username,
    userBanned: 'not'
  }).save().catch((err) => {
    console.error(err);
  })
  } else { 
    new db_User({
    userid: member.id,
    username: member.username,
    userBanned: 'not'
  }).save().catch((err) => {
    console.error(err);
  })
  }
  }) 
}