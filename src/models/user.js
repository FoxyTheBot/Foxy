const { mongodb } = require('../../config.json');
const mongo = require('mongoose');

mongo.connect(mongodb, {
    useNewUrlParser: true, useUnifiedTopology: true
}).catch((err) => {
    console.error('\x1b[37m\x1b[41mERROR\x1b[0m: Ocorreu um erro no cliente do mongodb! verifique se a sua URI está correta!', err);
    process.exit(1);
});

// Considere consertar o banco de dados depois.

const user = new mongo.Schema({
    userid: Number, // Trocar para String: Usuarios veteranos do Discord vão ter problemas pois o id deles começam com 0.
    username: String,
    userBanned: String // Trocar para boolean?
});

module.exports = mongo.model('user', user);