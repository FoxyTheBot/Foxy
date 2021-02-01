const { mongodb } = require('../config.json')
const mongo = require('mongoose')
mongo.connect(mongodb, { 
    useNewUrlParser: true, useUnifiedTopology: true 
}).catch((err) => {
    console.log(err)
   })
   const user = new mongo.Schema({
       userid: Number,
       username: String,
       userBanned: String
   })
   module.exports = mongo.model('user', user)