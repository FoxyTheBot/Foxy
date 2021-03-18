const { Intents } = require('discord.js')

module.exports = function intents() {
const foxyIntents = new Intents(Intents.ALL);

foxyIntents.remove(Intents.PRIVILEGED);

}