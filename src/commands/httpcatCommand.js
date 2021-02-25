const { MessageEmbed } = require('discord.js');
const colors = require('../structures/color.json');

module.exports = {
  name: 'httpcats',
  aliases: ['httpcat', 'catservers'],
  cooldown: 5,
  guildOnly: false,

  async run(client, message, args) {
    codes = ['100', '200', '201', '202', '204', '206', '207', '208', '300', '301', '302', '400', '404', '401', '408', '450', '499', '500', '504', '599', '511'];
    function choose(choices) {
      const index = Math.floor(Math.random() * choices.length);
      return choices[index];
    }
    const embed = new MessageEmbed()
      .setColor(colors.default)
      .setImage(`https://http.cat/${choose(codes)}`);
    await message.channel.send(embed);
  },
};
