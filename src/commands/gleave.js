exports.run = async(client, guild, message) => {
    message.guild.leave('784590077254172704')
  .then(g => message.channel.send(`Left the guild ${g}`))
  .catch(console.error);
}