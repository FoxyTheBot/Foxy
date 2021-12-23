const { MessageAttachment } = require('discord.js');
const GenerateImage = require("../../structures/GenerateImage");

module.exports = {
  name: 'profile',
  aliases: ['profile', 'perfil'],
  cooldown: 5,
  guildOnly: true,
  clientPerms: ['ATTACH_FILES', 'READ_MESSAGE_HISTORY'],

  async run(client, message) {
    const user = message.mentions.users.first() || message.author;
    const userData = await client.db.getDocument(user.id);
    const canvasGenerator = new GenerateImage(this.client, user, userData, 1436, 884);
    const profile = new MessageAttachment(await canvasGenerator.genProfile(), "foxy_profile.png");

    message.reply(profile);
  },
};