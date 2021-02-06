const { mongodb } = require('../../config.json');
const mongo = require('mongoose');

mongo.connect(mongodb, {
    useNewUrlParser: true, useUnifiedTopology: true
}).catch((err) => {
    console.error('\x1b[37m\x1b[41mERROR\x1b[0m: Ocorreu um erro no cliente do mongodb! verifique se a sua URI está correta!', err);
    process.exit(1);
});

const user = new mongo.Schema({
    userid: String,
    username: String,
    userBanned: Boolean
});

module.exports = mongo.model('user', user);