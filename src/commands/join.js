const discord = require('discord.js')
exports.run = async (client, channel, join) => {
client.on("ready", () => {
  const channel = client.channels.cache.get("751188810854957164");
  if (!channel) return console.error("The channel does not exist!");
  channel.join().then(connection => {
    // Yay, it worked!
    console.log("Successfully connected.");
  }).catch(e => {
    // Oh no, it errored! Let's log it to console :)
    console.error(e);
  });
});
}